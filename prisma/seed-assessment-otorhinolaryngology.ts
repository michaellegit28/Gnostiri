import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Otorhinolaryngology (ENT 201).
 *
 * 14 original SBA items seeding the Otorhinolaryngology assessment bank from
 * zero, tagged to the existing ConceptNodes (see prisma/seed-university.ts).
 * Covers external/middle ear disease, mastoid disease and complications,
 * rhinosinusitis and nasal polyps, epistaxis and sinonasal tumours, laryngeal
 * disorders and voice, pharynx and oral cavity, neck spaces and facial
 * paralysis, vertigo and audiological assessment, and ENT emergencies
 * including radiology.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 0 because the course ships no assessment items.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — the
 * 2026-10-20 repair established that production rows must never sit at
 * "draft" (42 draft rows drifted live before). needsCheck flags the numeric
 * or distractor reasoning a physician should double-check.
 */

const COURSE_SLUG = "otorhinolaryngology";

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
  // 1 — External and middle ear disease (easy)
  {
    slug: "ent201-aom-vs-ome",
    concept: "otology-external-middle-ear",
    format: "sba",
    stem: "A child has otalgia, fever of 38.6 C, and a red, bulging tympanic membrane with absent light reflex. Another child of the same age has a dull, amber tympanic membrane with an air-fluid level, no fever, and no otalgia. Which statement is most correct?",
    options: [
      "The first child has acute otitis media with middle-ear effusion (bulging red drum plus acute inflammatory signs); the second has otitis media with effusion, in which bulging and systemic features are absent",
      "Both children have acute otitis media because the membranes are not normal",
      "The first child has otitis media with effusion, which characteristically produces fever and a bulging membrane",
      "Neither diagnosis can be made without pneumatic otoscopy in both children",
    ],
    correctAnswer: "The first child has acute otitis media with middle-ear effusion (bulging red drum plus acute inflammatory signs); the second has otitis media with effusion, in which bulging and systemic features are absent",
    explanation: "Acute otitis media is diagnosed by acute onset of symptoms, middle-ear effusion (a bulging, immobile, or perforated membrane with air-fluid levels), and signs of middle-ear inflammation such as otalgia and fever. Otitis media with effusion lacks acute inflammatory signs — the drum is dull, retracted, or amber with fluid but there is no fever, erythema, or marked bulging, and management is watchful waiting with audiology follow-up. Pneumatic otoscopy helps confirm immobility but is not required to separate the two when classic signs are present.",
    difficulty: "easy",
    marks: 1,
  },

  // 2 — External ear disease (hard)
  {
    slug: "ent201-malignant-otitis-externa",
    concept: "otology-external-middle-ear",
    format: "sba",
    stem: "A frail diabetic man has severe nocturnal otalgia, granulation tissue at the bony-cartilaginous junction of the ear canal, purulent discharge, and a week of severe headache. Which diagnosis and pathogen best fit?",
    options: [
      "Necrotising (malignant) otitis externa caused by Pseudomonas aeruginosa, which invades the skull base from the canal fissures of Santorini",
      "Otitis media with effusion caused by Streptococcus pneumoniae",
      "Bullous myringitis caused by respiratory syncytial virus",
      "Wax impaction causing obstructive otorrhoea",
    ],
    correctAnswer: "Necrotising (malignant) otitis externa caused by Pseudomonas aeruginosa, which invades the skull base from the canal fissures of Santorini",
    explanation: "Necrotising otitis externa is a skull-base osteomyelitis of the external canal seen in elderly diabetics and immunocompromised patients: disproportionate nocturnal otalgia, canal granulations at the bony-cartilaginous junction, and Pseudomonas aeruginosa as the causative organism, entering through the fissures of Santorini. Untreated, it spreads to cause facial palsy (most common cranial neuropathy), jugular foramen syndromes, or meningitis, and is diagnosed by MRI/CT with gallium or technetium bone scanning, treated with prolonged antipseudomonal therapy and surgical debridement. Ordinary diffuse otitis externa does not granulate at the bony junction or invade bone.",
    difficulty: "hard",
    marks: 1,
  },

  // 3 — Mastoid disease and complications (hard)
  {
    slug: "ent201-csom-complications",
    concept: "otospongiosis-mastoid-complications",
    format: "sba",
    stem: "A patient with a chronically discharging ear and posterior-superior retraction pockets develops headache, swinging fever peaks with rigors, papilloedema, and then a lower motor neuron facial palsy. Which complication is most likely?",
    options: [
      "Lateral (transverse/sigmoid) sinus thrombophlebitis spreading from coalescent mastoiditis, with facial palsy as an associated intracranial complication",
      "Otosclerosis conducted loss from stapes fixation",
      "Acute otitis externa alone without mastoid involvement",
      "A perilymph fistula causing fluctuating hearing loss",
    ],
    correctAnswer: "Lateral (transverse/sigmoid) sinus thrombophlebitis spreading from coalescent mastoiditis, with facial palsy as an associated intracranial complication",
    explanation: "Cholesteatoma (unsafe squamous chronic otitis media — posterior-superior retraction, granulations, and a discharging ear) erodes bone and drives intratemporal and intracranial complications. Thrombophlebitis of the lateral sinus gives the classic picture of drenching sweats, spiking rigors, headache, and papilloedema (Griesinger sign when mastoid tip involvement occludes the mastoid emissary vein), while intracranial spread also underlies facial nerve palsy, meningitis, extradural abscess, and brain abscess. Diagnosis is by contrast MRI/MRV with CT showing the infected granulated mastoid, and treatment is cortical mastoidectomy plus antibiotics and anticoagulation — never watchful waiting.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },

  // 4 — Rhinosinusitis (medium)
  {
    slug: "ent201-acute-bacterial-rhinosinusitis",
    concept: "rhinosinusitis-nasal-polyp",
    format: "sba",
    stem: "A woman has 10 days of nasal congestion, mucopurulent discharge, facial pressure worse on bending forward, and reduced smell. Which feature would most suggest acute viral rhinositis rather than acute bacterial rhinosinusitis?",
    options: [
      "Symptoms that began improving after day 5 and have since plateaued without worsening ('double sickening')",
      "Symptoms persisting beyond 10 days with no improvement at any point",
      "Severe symptoms from onset with fever above 39 C and purulent discharge for 3-4 consecutive days",
      "Symptoms that worsen after initially improving, with new fever and facial pain",
    ],
    correctAnswer: "Symptoms that began improving after day 5 and have since plateaued without worsening ('double sickening')",
    explanation: "Acute rhinosinusitis is viral in the great majority of cases, and the diagnostic threshold for bacterial rhinosinusitis is symptoms lasting more than 10 days without any improvement, 'double sickening' (worsening after initial improvement), or severe onset with fever above 39 C plus 3-4 days of purulent discharge. A course that improves by day 5 and then plateaus without deterioration fits viral illness and antibiotic-sparing management. Only 2-10% of cases meet bacterial criteria, where amoxicillin or doxycycline is used.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Nasal polyps (medium)
  {
    slug: "ent201-samters-triad",
    concept: "rhinosinusitis-nasal-polyp",
    format: "sba",
    stem: "A 35-year-old with asthma that worsens whenever she takes aspirin develops profuse bilateral watery rhinorrhoea, nasal obstruction, anosmia, and visible pale grape-like masses in both middle meati. Which diagnosis and mechanism best describe this?",
    options: [
      "Aspirin-exacerbated respiratory disease (Samter's triad): nasal polyps with asthma and NSAID hypersensitivity driven by arachidonic-acid shunting toward cysteinyl leukotrienes",
      "Acute allergic rhinitis with inferior turbinate oedema",
      "Antrochoanal polyp arising from the maxillary sinus alone",
      "Inverted papilloma caused by human papillomavirus",
    ],
    correctAnswer: "Aspirin-exacerbated respiratory disease (Samter's triad): nasal polyps with asthma and NSAID hypersensitivity driven by arachidonic-acid shunting toward cysteinyl leukotrienes",
    explanation: "Samter's triad (aspirin-exacerbated respiratory disease) is the combination of adult-onset asthma, nasal polyps, and hypersensitivity to COX-1 inhibitors such as aspirin. Cyclo-oxygenase blockade shunts arachidonic acid down the lipoxygenase pathway, generating cysteinyl leukotrienes (LTC4, LTD4, LTE4) that provoke bronchospasm and intense rhinorrhoea. Management uses intranasal corticosteroids, endoscopic polypectomy, and aspirin desensitisation; leukotriene modifiers may help. Bilateral middle-meatal pale polyps also occur in cystic fibrosis and asthma without NSAID sensitivity.",
    difficulty: "medium",
    marks: 1,
  },

  // 6 — Epistaxis (easy)
  {
    slug: "ent201-epistaxis-first-line",
    concept: "epistaxis-septal-tumours",
    format: "sba",
    stem: "A child has continuous bilateral anterior epistaxis after nose picking. Sitting forward, the patient pinches the soft lower nose for 10-15 minutes without interruption, and ice is applied. What is the next appropriate step if bleeding persists?",
    options: [
      "Inspect Little's area for a visible vessel and silver-nitrate cautery (or topical vasoconstrictor plus packing if no bleeding point is seen), while correcting this common anterior bleed at Kiesselbach's plexus",
      "Immediate external carotid artery ligation",
      "Ligation of the internal maxillary artery by endoscopic approach as first-line treatment in a child",
      "Transfuse packed red cells before any local measure in a haemodynamically stable child",
    ],
    correctAnswer: "Inspect Little's area for a visible vessel and silver-nitrate cautery (or topical vasoconstrictor plus packing if no bleeding point is seen), while correcting this common anterior bleed at Kiesselbach's plexus",
    explanation: "Most epistaxis (about 90%) is anterior, arising in Little's area of the nasal septum where the anterior ethoidal, sphenopalatine, greater palatine, and superior labial arteries anastomose (Kiesselbach's plexus). First aid is forward tilt plus sustained soft-nose pressure; a visible anterior vessel is then treated with topical anaesthesia, vasoconstrictor, and silver-nitrate or bipolar cautery, escalating to anterior or posterior packing, balloon tamponade, and only then to sphenopalatine/ethmoidal artery ligation or embolisation. Arterial ligation and transfusion are reserved for uncontrolled or unstable cases, and bilateral cautery at the same spot risks septal perforation.",
    difficulty: "easy",
    marks: 1,
  },

  // 7 — Sinonasal tumours (hard)
  {
    slug: "ent201-juvenile-nasopharyngeal-angiofibroma",
    concept: "epistaxis-septal-tumours",
    format: "sba",
    stem: "A 14-year-old boy has recurrent severe unilateral epistaxis and progressive nasal obstruction. CT shows a hypervascular posterior-nasal mass eroding the pterygopalatine fossa and widening the sphenopalatine foramen. What is the diagnosis and preferred treatment?",
    options: [
      "Juvenile nasopharyngeal angiofibroma — a benign but locally aggressive vascular tumour of adolescent males treated by preoperative embolisation followed by endoscopic resection",
      "Nasopharyngeal carcinoma treated by primary radiotherapy",
      "Antrochoanal polyp treated by simple polypectomy",
      "Allergic fungal rhinosinusitis treated by oral corticosteroids",
    ],
    correctAnswer: "Juvenile nasopharyngeal angiofibroma — a benign but locally aggressive vascular tumour of adolescent males treated by preoperative embolisation followed by endoscopic resection",
    explanation: "Juvenile angiofibroma is a testosterone-sensitive, benign, highly vascular tumour of adolescent males that presents with recurrent unilateral epistaxis and obstruction; CT shows a enhancing mass centred at the sphenopalatine foramen with anterior bowing of the posterior maxillary wall (Holman-Miller sign) and pterygopalatine fossa spread. Biopsy is hazardous because of bleeding — diagnosis is clinical and radiological. Treatment is surgical resection after preoperative embolisation of the internal maxillary artery feeders, with radiotherapy reserved for unresectable intracranial disease.",
    difficulty: "hard",
    marks: 1,
  },

  // 8 — Laryngeal disorders (medium)
  {
    slug: "ent201-vocal-cord-paralysis",
    concept: "laryngeal-disorders-voice",
    format: "sba",
    stem: "A patient who recently underwent total thyroidectomy for carcinoma develops a weak, breathy voice with aspiration of liquids. Laryngoscopy shows the right vocal cord fixed in a paramedian position. What is the mechanism and appropriate management?",
    options: [
      "Recurrent laryngeal nerve injury during thyroid surgery — manage with voice therapy, injection medialisation for thin cord, and consider medialisation laryngoplasty if no recovery by 6-12 months",
      "Superior laryngeal nerve injury causing a paramedian cord requiring no intervention",
      "Cricoarytenoid rheumatoid fixation best treated with antibiotics",
      "Laryngeal papillomatosis treated by wide-field excision",
    ],
    correctAnswer: "Recurrent laryngeal nerve injury during thyroid surgery — manage with voice therapy, injection medialisation for thin cord, and consider medialisation laryngoplasty if no recovery by 6-12 months",
    explanation: "The recurrent laryngeal nerve supplies all intrinsic laryngeal muscles except cricothyroid and is vulnerable during thyroidectomy, especially in revision surgery or malignancy; unilateral palsy gives a breathy, weak voice, a paramedian cord, and aspiration of thin liquids. Early management is voice therapy and temporary injection medialisation to restore glottic closure, with permanent medialisation laryngoplasty or reinnervation if no recovery occurs within 6-12 months. Bilateral palsy causes airway compromise after extubation and may require tracheostomy, arytenoidectomy, or cordotomy; superior laryngeal nerve injury instead causes easy fatigability and loss of pitch range.",
    difficulty: "medium",
    marks: 1,
  },

  // 9 — Stridor (medium)
  {
    slug: "ent201-stridor-differentials",
    concept: "laryngeal-disorders-voice",
    format: "sba",
    stem: "Which statement correctly matches the pattern of stridor with its likely anatomical level?",
    options: [
      "Inspiratory stridor suggests laryngeal or supraglottic obstruction; expiratory stridor suggests tracheobronchial obstruction; biphasic stridor suggests a fixed glottic or subglottic lesion",
      "Biphasic stridor always indicates a tracheobronchial foreign body, while expiratory stridor indicates a pharyngeal lesion",
      "Stridor is always inspiratory regardless of level, and timing has no anatomical value",
      "Expiratory stridor with drooling is diagnostic of laryngomalacia",
    ],
    correctAnswer: "Inspiratory stridor suggests laryngeal or supraglottic obstruction; expiratory stridor suggests tracheobronchial obstruction; biphasic stridor suggests a fixed glottic or subglottic lesion",
    explanation: "Stridor is a harsh, high-pitched sound from turbulent airflow through a narrowed upper airway. Inspiratory stridor arises from dynamic collapse of the extrathoracic airway (laryngomalacia, supraglottitis, vocal cord palsy), expiratory stridor from the intrathoracic tracheobronchial tree (foreign body, tracheomalacia), and biphasic (fixed) stridor from an unchanging lesion at or below the cords (subglottic stenosis, bilateral vocal cord palsy). Timing therefore localises the lesion, and the commonest cause of congenital inspiratory stridor is laryngomalacia, which is never associated with drooling — drooling, tripoding, and fever instead point to epiglottitis.",
    difficulty: "medium",
    marks: 1,
  },

  // 10 — Pharynx (medium)
  {
    slug: "ent201-peritonsillar-abscess",
    concept: "pharynx-oral-cavity",
    format: "sba",
    stem: "A young adult on day 5 of severe sore throat now speaks with a muffled 'hot potato' voice, drools, trismus, and has a unilateral soft-palate swelling deviating the uvula away from the affected side. What is the diagnosis and definitive management?",
    options: [
      "Peritonsillar abscess (quinsy) — incision and drainage (or needle aspiration) plus antibiotics; if airway is threatened, perform the procedure in theatre with airway support",
      "Simple tonsillitis, which requires only oral amoxicillin",
      "Retropharyngeal abscess, which is aspirated through a posterior pharyngeal wall puncture as first-line treatment",
      "Infectious mononucleosis treated with ampicillin",
    ],
    correctAnswer: "Peritonsillar abscess (quinsy) — incision and drainage (or needle aspiration) plus antibiotics; if airway is threatened, perform the procedure in theatre with airway support",
    explanation: "A peritonsillar abscess is a collection between the tonsil capsule and the superior constrictor muscle, usually polymicrobial with Streptococcus pyogenes and oral anaerobes. The hot-potato voice, trismus, drooling, and uvular deviation away from the bulge are characteristic, and definitive management is drainage — needle aspiration or incision and drainage — plus antibiotics, with tonsillectomy for recurrent or refractory disease. Distinguish this from tonsillitis alone (exudate but no trismus or palatal bulge), epiglottitis (minimal pharyngeal findings, tripoding), and retropharyngeal abscess (posterior wall bulge, torticollis, often children); drainage in trismus is done in theatre for airway safety.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — Facial paralysis (easy)
  {
    slug: "ent201-facial-palsy-patterns",
    concept: "neck-spaces-facial-paralysis",
    format: "sba",
    stem: "A patient has sudden onset unilateral weakness that flattens the nasolabial fold, prevents eye closure, and droops the corner of the mouth, sparing the forehead only in the opposite way — in fact the forehead is involved. Which lesion best fits?",
    options: [
      "Lower motor neuron facial nerve lesion (e.g., Bell's palsy) causing complete ipsilateral hemifacial weakness including the forehead, with inability to close the eye",
      "Upper motor neuron facial weakness, which spares the forehead because the frontalis receives bilateral cortical innervation",
      "Masticatory muscle weakness from a trigeminal motor lesion",
      "Isolated hypoglossal nerve palsy with tongue deviation",
    ],
    correctAnswer: "Lower motor neuron facial nerve lesion (e.g., Bell's palsy) causing complete ipsilateral hemifacial weakness including the forehead, with inability to close the eye",
    explanation: "The frontalis and orbicularis oculi receive bilateral upper motor neuron innervation, so a supranuclear (cortical) weakness spares the forehead and eye closure, producing drooping limited to the lower face. A lower motor neuron facial lesion (Bell's palsy, geniculate herpes zoster/Ramsay Hunt, parotid tumour, temporal bone fracture) paralyses the entire ipsilateral hemifacial distribution, so the patient cannot wrinkle the forehead or close the eye — and Bell's palsy specifically spares the other cranial nerves and is diagnosed by exclusion. Sudden complete palsy presenting within a week with good prognosis indicators is treated with prednisolone started within 72 hours, with eye protection and an antiviral (valaciclovir) in severe cases such as Ramsay Hunt.",
    difficulty: "easy",
    marks: 1,
  },

  // 12 — Vertigo (medium)
  {
    slug: "ent201-bppv-vs-vestibular-neuritis",
    concept: "vertigo-audiological-assessment",
    format: "sba",
    stem: "A 60-year-old has brief (under 1 minute) spinning episodes triggered by rolling over in bed, with no hearing loss or interictal symptoms. A second patient has continuous severe vertigo lasting days, worsened by head movement, with spontaneous nystagmus, nausea, and no hearing loss. Which pairing is correct?",
    options: [
      "First patient: benign paroxysmal positional vertigo diagnosed by Dix-Hallpike and treated with Epley manoeuvre; second: vestibular neuritis (a single prolonged attack with no hearing loss) treated with vestibular suppressants and early mobilisation",
      "First patient: vestibular neuritis; second: Meniere's disease with fluctuating hearing loss",
      "Both patients have Meniere's disease, as both lack hearing loss at presentation",
      "First patient: acoustic neuroma; second: BPPV",
    ],
    correctAnswer: "First patient: benign paroxysmal positional vertigo diagnosed by Dix-Hallpike and treated with Epley manoeuvre; second: vestibular neuritis (a single prolonged attack with no hearing loss) treated with vestibular suppressants and early mobilisation",
    explanation: "BPPV causes seconds-long vertigo on rolling in bed or head extension, is confirmed by Dix-Hallpike showing upbeating-torsional nystagmus for the posterior canal form, and is cured by canalith repositioning (Epley or Semont). Vestibular neuritis causes a single prolonged attack lasting hours to days with spontaneous unidirectional nystagmus, positive head-impulse test, nausea, a normal otoscopy, and no hearing loss — treated with short-course vestibular sedatives (prochlorperazine/betahistine), corticosteroids, and early vestibular rehabilitation. Meniere's disease presents with recurrent attacks lasting 20 minutes to hours plus fluctuating low-frequency hearing loss, tinnitus, and aural fullness; acoustic neuroma causes gradually progressive unilateral hearing loss with absent caloric responses.",
    difficulty: "medium",
    marks: 1,
  },

  // 13 — Audiological assessment (easy)
  {
    slug: "ent201-weber-rinne",
    concept: "vertigo-audiological-assessment",
    format: "sba",
    stem: "Tuning-fork testing shows Weber lateralising to the right ear, Rinne test negative on the right (bone conduction louder than air) and positive on the left. What does this pattern indicate?",
    options: [
      "Right conductive hearing loss, confirmed by Weber lateralising to the affected ear with Rinne negative (bone greater than air) — suggesting a conductive cause such as wax, effusion, or otosclerosis",
      "Right sensorineural hearing loss, because the affected side is lateralised on Weber",
      "Bilateral normal hearing, because Rinne is positive on the left",
      "Right vestibular schwannoma, which cannot be distinguished with tuning forks",
    ],
    correctAnswer: "Right conductive hearing loss, confirmed by Weber lateralising to the affected ear with Rinne negative (bone greater than air) — suggesting a conductive cause such as wax, effusion, or otosclerosis",
    explanation: "Rinne compares air conduction (AC) with bone conduction (BC): AC better than BC (Rinne positive) is normal or sensorineural loss; BC better than or equal to AC (Rinne negative) requires at least a 15-20 dB conductive gap, as in wax impaction, otitis media with effusion, or otosclerosis. Weber lateralises to the ear with a conductive loss (ambient masking is absent), whereas sensorineural loss lateralises to the better ear. Combined with pure-tone audiometry showing an air-bone gap on the affected side, this confirms conductive loss, which is surgically or medically correctable.",
    difficulty: "easy",
    marks: 1,
  },

  // 14 — ENT emergencies and radiology (hard)
  {
    slug: "ent201-acute-epiglottitis",
    concept: "ent-emergencies-radiology",
    format: "sba",
    stem: "A toxic, febrile, drooling 4-year-old sits upright, leans forward, and refuses to lie down, with severe sore throat but surprisingly few oropharyngeal findings. What is the immediate priority and the characteristic radiological sign?",
    options: [
      "Secure the airway in theatre with anaesthesia/ENT present — examination or imaging in a controlled setting showing a swollen epiglottis ('thumb sign' on lateral neck radiograph) with a normal subglottic outline, unlike croup's steeple sign",
      "Force direct visualisation with a tongue depressor in the emergency department while the child lies supine",
      "Give oral amoxicillin and discharge with safety-netting advice",
      "Order a soft-tissue radiograph that would show an oedematous epiglottis with a steeple sign extending to the subglottis",
    ],
    correctAnswer: "Secure the airway in theatre with anaesthesia/ENT present — examination or imaging in a controlled setting showing a swollen epiglottis ('thumb sign' on lateral neck radiograph) with a normal subglottic outline, unlike croup's steeple sign",
    explanation: "Acute epiglottitis (now predominantly adult and Haemophilus influenzae type b in children) is an airway emergency: drooling, dysphagia, tripoding, muffled voice, and low or absent pharyngeal signs, classically with fever and rapid progression in children. Airway management must be in theatre with ENT and anaesthesia, since forcing supine examination or tongue-depressor inspection risks complete obstruction. A lateral neck film shows a thickened epiglottis and aryepiglottic folds (thumbprint sign) with a normal subglottis, whereas croup (laryngotracheobronchitis from parainfluenza) shows symmetric subglottic narrowing (steeple sign) with a barking cough and is managed with dexamethasone and nebulised adrenaline.",
    difficulty: "hard",
    marks: 1,
    needsCheck: false,
  },
];

async function seedAssessmentOtorhinolaryngology() {
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

  console.log(`✓ ENT 201 assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-otorhinolaryngology.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-otorhinolaryngology")) {
  seedAssessmentOtorhinolaryngology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentOtorhinolaryngology, ITEMS as OTORHINOLARYNGOLOGY_ITEMS };
