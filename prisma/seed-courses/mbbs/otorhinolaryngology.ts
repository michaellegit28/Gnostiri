/**
 * OTOR 308 — Otorhinolaryngology (ENT).
 *
 * All 9 concepts are authored in full as pilot-report lessons — outcomes,
 * prerequisites, big idea, explanation with worked clinical examples, common
 * mistakes, check questions and MCQs. Only established clinical teaching is
 * asserted: the diagnostic criteria that separate acute otitis media from
 * otitis media with effusion, the intratemporal and intracranial complications
 * of chronic suppurative otitis media, the clinical features of the deep neck
 * space infections, the Dix-Hallpike manoeuvre and the head-impulse test in
 * the vertigo differential, and the radiology used in each emergency.
 *
 * The assessment bank for this course (prisma/seed-assessment-
 * otorhinolaryngology.ts) attaches to the same concept slugs.
 */

import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";

// ---------------------------------------------------------------------------
// LESSON 1 — External and middle ear disease (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the anatomy of the external meatus, the tympanic membrane and the middle ear cleft, and explain how the Eustachian tube converts an upper respiratory infection into a middle-ear infection; distinguish otitis externa, acute otitis media (AOM), otitis media with effusion (OME) and chronic suppurative otitis media (CSOM) from the history and the otoscopic appearances; state the organisms that cause AOM and the first-line antibiotic; recognise a cholesteatoma and explain why an unsafe ear is a surgical problem; and build the differential for otalgia, including the referred causes that reach the ear through the fifth, ninth and tenth cranial nerves.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Anatomy of the temporal bone (gross anatomy) — the external meatus, tympanic membrane, ossicular chain and the facial nerve's course through the middle ear — and basic microbiology of the upper respiratory flora, because every organism named below is a coloniser that becomes a pathogen when drainage fails.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The middle ear cleft",
        text: "The air-containing space behind the tympanic membrane comprising the tympanic cavity, the Eustachian tube, the mastoid antrum and the mastoid air cells. It is a ventilator-dependent space: when the Eustachian tube blocks, negative pressure develops, fluid is drawn into the cavity, and the resulting effusion is the substrate for infection.",
      },
      {
        type: "paragraph",
        text: "Almost all middle-ear disease follows one chain of events. A child (or an adult) gets a viral upper respiratory infection. The mucosa of the Eustachian tube swells, the tube blocks, and the middle ear can no longer equalise its pressure. Cilian action fails, oxygen is absorbed from the trapped air, and negative pressure develops; the drum retracts, then fluid transudates into the cavity. If the fluid becomes infected you have acute otitis media. If the effusion persists without acute infection you have otitis media with effusion. If drainage through the perforation or a retraction pocket stays impaired for months you have chronic suppurative otitis media, and that is where the dangerous complications start.",
      },

      { type: "heading", level: 2, text: "The anatomy that predicts the pattern" },
      {
        type: "table",
        headers: ["Structure", "What to know", "Why disease follows"],
        rows: [
          ["External auditory meatus", "Two-thirds cartilaginous with hair and ceruminous glands, one-third bony; S-shaped in the adult, straight in the child", "The cartilaginous part is the site of furuncles and otitis externa; the straight paediatric canal makes injuries and foreign bodies easier to inflict and to remove"],
          ["Tympanic membrane", "Three layers; the pars flaccida (Shrapnell) is weaker than the pars tensa", "Retraction pockets form in the pars flaccida first, and this is where cholesteatoma begins"],
          ["Eustachian tube", "About 3.5 cm in the adult; shorter, wider and more horizontal in the child; opened by tensor veli palatini", "The paediatric geometry is why AOM peaks between 6 months and 3 years and again at school entry, and why cleft palate children have near-universal middle-ear disease"],
          ["Ossicles", "Malleus, incus, stapes — the chain that bridges drum to oval window", "Necrosis of the incus and stapes superstructure leaves a conductive deafness that outlives the infection"],
          ["Facial nerve", "Runs through the middle ear in the fallopian canal, sometimes dehiscent", "Acute otitis media can therefore cause an immediate lower motor neurone facial palsy with no surgical cause"],
          ["Mastoid antrum and air cells", "Connected to the middle ear through the aditus ad antrum", "The route by which middle-ear infection becomes mastoiditis and then intracranial infection"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Look at the child, not only the ear. Bottle-feeding while supine, passive smoking, crèche attendance and adenoidal hypertrophy all raise the risk of otitis media with effusion, and a child with persistent glue ear needs an audiology assessment more than another course of antibiotics.",
      },

      { type: "heading", level: 2, text: "Otitis externa" },
      {
        type: "paragraph",
        text: "Otitis externa is infection of the skin of the canal, classically after swimming, humidity, cotton-bud trauma or a hot climate. The cardinal features are pain on moving the pinna or pressing the tragus, and a narrowed, oedematous, debris-filled canal. The organisms are Pseudomonas aeruginosa and Staphylococcus aureus, and the treatment is aural toilet plus topical antibiotic drops (with a steroid for the oedema), not oral antibiotics.",
      },
      {
        type: "table",
        headers: ["Feature", "Otitis externa", "Acute otitis media", "Otitis media with effusion"],
        rows: [
          ["Pain on moving the pinna or tragal pressure", "Present and severe", "Absent", "Absent or mild fullness"],
          ["Discharge", "Often, scanty and green-yellow", "Perforated ears discharge suddenly, then pain stops", "Absent unless there is a perforation"],
          ["Tympanic membrane", "Normal, but hard to see through the swollen canal", "Red, bulging, immobile, light reflex lost", "Dull, retracted or amber, with an air-fluid level or bubbles"],
          ["Systemic features", "Mild or absent", "Fever, irritability, malaise", "Absent"],
          ["Deafness", "Conductive, from a blocked canal", "Conductive, from the effusion", "Conductive, fluctuating, often the presenting complaint"],
          ["Treatment", "Aural toilet and topical antibiotic-steroid drops", "Analgesia; amoxicillin first line when indicated", "Watchful waiting up to 3 months; grommets if persistent with hearing loss"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never irrigate an ear you have not inspected, and never syringe an ear with a known or suspected perforation, a previous mastoid cavity, or a foreign body. Irrigation can convert otitis externa into iatrogenic labyrinthitis, or push a bead deeper. Where irrigation is appropriate, the water must be at body temperature, because a caloric stimulus causes vertigo and vomiting.",
      },

      { type: "heading", level: 2, text: "Wax, foreign bodies and the canal" },
      {
        type: "paragraph",
        text: "Impacted wax causes a conductive deafness, fullness and sometimes tinnitus or cough, and it is one of the commonest causes of a sudden hearing loss rather like water going into the ear when it becomes wet. Ask directly about cotton buds, which drive wax against the drum, and about hearing aids, which block migration of wax out of the canal. Softeners followed by irrigation, or microsuction under direct vision, both work.",
      },
      {
        type: "example",
        text: "A 2-year-old presents with a weeks-long unilateral offensive discharge. The causes in this age group are a retained cotton-wool plug, a bead or a piece of paper, and otitis externa — the discharge is unilateral because a foreign body is almost always one-sided, whereas a viral cold is bilateral. Do not attempt blind instrumentation in a moving child; consider examination under anaesthesia if removal at the first attempt fails, and remember that a button battery is a same-hour emergency.",
      },

      { type: "heading", level: 2, text: "Acute otitis media" },
      {
        type: "paragraph",
        text: "AOM is diagnosed on three findings: acute onset of symptoms, a middle-ear effusion, and signs of middle-ear inflammation. The bulging, immobile drum is the sign that matters most, because a red drum alone is a child crying, screaming or having a fever. The usual pathogens are Streptococcus pneumoniae, non-typeable Haemophilus influenzae and Moraxella catarrhalis — the same three that colonise the nasopharynx and ascend the blocked tube.",
      },
      {
        type: "table",
        headers: ["Organism", "Proportion of cases", "Clinical note"],
        rows: [
          ["Streptococcus pneumoniae", "The commonest single organism", "The organism behind most persistent and recurrent disease; conjugate vaccines have reduced it substantially"],
          ["Non-typeable Haemophilus influenzae", "Common", "Beta-lactamase producers are frequent, which is why amoxicillin-clavulanate is the second line"],
          ["Moraxella catarrhalis", "Common", "Almost all produce beta-lactamase"],
          ["Group A streptococcus and Staphylococcus aureus", "Minority", "Consider staphylococcal disease especially after perforation or in neonates"],
          ["Viruses (RSV, influenza, adenovirus)", "The antecedent, sometimes the pathogen", "Frequently isolated from the effusion with or without bacteria"],
        ],
      },
      {
        type: "paragraph",
        text: " Amoxicillin remains first line in children who are toxic, febrile under 2 years, or in whom symptoms have persisted beyond 72 hours, because spontaneous resolution is common but the risk of mastoiditis falls with treatment. Bilateral disease, perforation and recent antibiotic exposure predict failure and push you to amoxicillin-clavulanate. Adults with uncomplicated AOM also receive amoxicillin. Analgesia is not optional: it is the only intervention shown to shorten pain duration in the first 24 hours.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A perforation that drains is a clinical improvement. The severe otalgia of AOM stops abruptly when the drum bursts, followed by a bloody then mucopurulent discharge. The dangerous exception is an infant with fever and irritability but no localising signs — always look at both drums.",
      },

      { type: "heading", level: 2, text: "Otitis media with effusion" },
      {
        type: "paragraph",
        text: "OME is fluid in the middle ear without acute inflammation. The child does not complain of pain; the parent complains that the television is too loud, that the child says 'what' repeatedly, and that speech has become indistinct. The drum is dull, retracted or amber, sometimes with a meniscus or bubbles behind it, and mobility is reduced on pneumatic otoscopy. The condition follows 40 per cent of AOM episodes and resolves spontaneously in three months in most.",
      },
      {
        type: "paragraph",
        text: "Management is a hearing test first, and then decongestants and antihistamines do not work. Auto-inflation exercises are reasonable; adenoidectomy is effective in children with coexisting adenoidal obstruction; grommets (ventilation tubes) restore hearing while the Eustachian tube matures, with the complications of tympanosclerosis, recurrent discharge and focal atrophy of the drum. Persistent unilateral OME in an adult is not glue ear — it is a nasopharyngeal carcinoma until you have looked at the postnasal space.",
      },

      { type: "heading", level: 2, text: "Chronic suppurative otitis media" },
      {
        type: "paragraph",
        text: "CSOM is a perforation of the pars tensa with chronic discharge through it. The two types must be separated because they behave completely differently.",
      },
      {
        type: "definition",
        term: "Cholesteatoma",
        text: "Not a tumour and not a cancer, but keratinising squamous epithelium growing in the middle ear where it does not belong. It releases enzymes that dissolve bone, it traps infection and does not drain, and it is the unsafe ear that causes facial palsy, labyrinthine fistula and intracranial abscess.",
      },
      {
        type: "table",
        headers: ["", "Safe (tubotympanic) CSOM", "Unsafe (attico-antral) CSOM"],
        rows: [
          ["Perforation", "Central, in the pars tensa, with an intact annulus", "Marginal or attic, in the pars flaccida, often with a retraction pocket"],
          ["Discharge", "Mucoid, profuse, odourless, worse with colds", "Scanty, offensive, persistent, often blood-stained"],
          ["Granulations or polyp", "Uncommon", "Common — aural polyp means cholesteatoma until excluded"],
          ["Otorrhoea pattern", "Intermittent and responsive to drops", "Persistent and recurrent despite drops"],
          ["Bone destruction", "Ossicular necrosis and tympanosclerosis only", "Erosion of the incus, the lateral semicircular canal, the facial canal and the tegmen"],
          ["Risk of intracranial extension", "Low", "High — meningitis, epidural abscess, brain abscess, sigmoid sinus thrombosis"],
          ["Management", "Aural toilet, antibiotic-steroid drops, water precautions, water-tolerance test and myringoplasty or tympanoplasty when dry and safe", "Urgent CT temporal bone and surgery — canal wall up or canal wall down mastoidectomy, plus imaging follow-up for recurrence"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Three findings in a discharging ear should stop you treating with ear drops and make you refer the same day: granulation tissue or an aural polyp, scanty offensive discharge, and a marginal or attic perforation. Each points to cholesteatoma, and drops will not cure it. Refer also if there is vertigo, facial weakness, severe headache, fever or any change in consciousness.",
      },

      { type: "heading", level: 2, text: "Otalgia" },
      {
        type: "paragraph",
        text: "Ear pain is either otogenic (the drum is abnormal) or referred, and referred causes far outnumber ear disease in adults with a normal examination. The sensory innervation of the ear is the fifth, ninth and tenth cranial nerves plus the cervical plexus C2-C3, so anything that shares those nerves can present as earache.",
      },
      {
        type: "table",
        headers: ["Source", "Nerve", "Typical cause"],
        rows: [
          ["External ear and canal", "V3 (auriculotemporal), X (Arnold), VII, IX, C2-C3", "Otitis externa, furuncle, impacted wax, perichondritis, canal foreign body"],
          ["Middle ear", "IX (tympanic branch)", "AOM, OME, mastoiditis, barotrauma"],
          ["Nasopharynx", "IX", "Nasopharyngeal carcinoma, adenoiditis"],
          ["Oropharynx, tonsil, tongue base", "IX", "Tonsillitis, peritonsillar abscess, base of tongue tumour"],
          ["Larynx, hypopharynx", "X (superior laryngeal)", "Laryngeal and pyriform sinus carcinoma, throat cancer with referred otalgia"],
          ["Teeth, temporomandibular joint, cervical spine", "V3, V2, C2-C3", "Dental abscess, TMJ dysfunction, cervical spondylosis"],
        ],
      },
      {
        type: "example",
        text: "An adult smoker of 60 presents with three months of right otalgia. Both drums look normal. That combination is a red flag: normal otoscopy plus persistent unilateral otalgia in a smoker needs examination of the postnasal space, oropharynx and larynx under flexible endoscopy, and imaging, because the common causes are a carcinoma of the nasopharynx, tongue base, tonsil or pyriform sinus referring through the ninth and tenth cranial nerves.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing AOM on a red drum. Redness is a sign of a crying or febrile child, not of a middle-ear effusion. Bulging, loss of the light reflex, and reduced mobility are the signs that carry the diagnosis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Giving antibiotic drops to an ear that has not been inspected for perforation. Aminoglycoside drops are ototoxic to the middle ear and can cause a permanent sensorineural loss through a perforation. Inspect first, or use a quinolone drop, which is safe with a perforation.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating unilateral persistent glue ear in an adult as if it were paediatric disease. In an adult, unilateral serous otitis media is a presentation of nasopharyngeal carcinoma, and the postnasal space and neck must be examined and imaged.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that perforation relieves pain. A child whose severe otalgia stops abruptly and then discharges is not improved but perforated, and still needs the disease treated, followed by a formal audiology check and hearing test.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do otitis externa, acute otitis media and otitis media with effusion differ on otoscopy and on tragal pressure?",
        answer: "Tragal pressure hurts only in otitis externa, where the canal skin is infected and the drum is normal but hard to see. In AOM the drum is red, bulging, immobile, with the light reflex lost, and the child has fever and systemic features. In OME the drum is dull, retracted or amber with an air-fluid level or bubbles, and there are no acute inflammatory signs.",
        explanation: "The separation that matters is that AOM has inflammation and effusion, OME has effusion without inflammation, and otitis externa leaves the drum intact while making the canal painful to touch.",
      },
      {
        type: "question",
        prompt: "Which findings distinguish an unsafe ear from a safe ear in chronic suppurative otitis media?",
        answer: "An unsafe ear has a marginal or attic perforation through the pars flaccida or a retraction pocket, scanty offensive or blood-stained discharge, granulations or an aural polyp, and evidence of bone erosion. A safe ear has a central perforation in the pars tensa, profuse mucoid odourless discharge and no granulations.",
        explanation: "The presence of squamous epithelium in the middle ear (cholesteatoma) is the defining distinction, and its markers are a marginal perforation, foul scanty discharge and granulation.",
      },
      {
        type: "question",
        prompt: "Why is otalgia with a normal examination an ominous finding in a smoker?",
        answer: "Because the ear's sensation passes through cranial nerves V, IX and X and the C2-C3 roots, so a normal drum means the pain is referred from the nasopharynx, oropharynx, larynx or hypopharynx, and carcinoma in these sites is commoner in smokers. Normal otoscopy plus unilateral otalgia earns an endoscopy and imaging.",
        explanation: "The ear is a common mask for head and neck cancer, and the combination of normal drums, smoking and persistent unilateral pain is the classic presentation of a referred primary.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 2-year-old has a 3-day coryza, then otalgia, fever of 38.8 C and irritability. The right tympanic membrane is bulging and immobile with no visible light reflex; the canal is normal and tragal pressure is painless. What is the diagnosis?",
        options: [
          "Otitis externa",
          "Acute otitis media",
          "Otitis media with effusion",
          "Mastoiditis",
          "Referred otalgia from teething",
        ],
        correctIndex: 1,
        explanation: "Acute onset with fever, a bulging immobile drum and no canal findings is AOM. Otitis externa would hurt on tragal pressure; OME has no fever or bulging; mastoiditis would give postauricular swelling and tenderness; referred otalgia leaves the drum normal.",
      },
      {
        type: "mcq",
        stem: "A child has a dull amber tympanic membrane with an air-fluid level, no fever, and a normal canal. Which management is correct?",
        options: [
          "Amoxicillin for 10 days",
          "Topical ciprofloxacin drops",
          "Watchful waiting up to 3 months with an audiology assessment, and grommets if effusion and hearing loss persist",
          "Insert ventilation tubes immediately",
          "Oral prednisolone",
        ],
        correctIndex: 2,
        explanation: "This is otitis media with effusion: effusion without inflammation resolves in most children within 3 months, so management is watchful waiting, a hearing test, and tubes only for persistent effusion with documented hearing loss. Antibiotics do not clear a sterile effusion.",
      },
      {
        type: "mcq",
        stem: "Which feature in a chronically discharging ear most strongly suggests cholesteatoma rather than safe chronic otitis media?",
        options: [
          "A central perforation of the pars tensa",
          "Profuse mucoid odourless discharge",
          "A marginal perforation in the pars flaccida with granulations and scanty offensive discharge",
          "Tympanosclerosis plaques",
          "A conductive deafness that improves in cold weather",
        ],
        correctIndex: 2,
        explanation: "Cholesteatoma is an unsafe ear: squamous epithelium in the middle ear grows through a marginal or attic perforation, traps infection, secretes offensive scanty discharge and grows granulations. Central perforation and profuse mucoid odourless pus are safe disease.",
      },
      {
        type: "mcq",
        stem: "Which set of organisms are the usual bacterial causes of acute otitis media?",
        options: [
          "Pseudomonas aeruginosa and Staphylococcus aureus",
          "Streptococcus pneumoniae, non-typeable Haemophilus influenzae and Moraxella catarrhalis",
          "Group A streptococcus and Corynebacterium diphtheriae",
          "Aspergillus and Candida species",
          "Streptococcus pyogenes and Clostridium species",
        ],
        correctIndex: 1,
        explanation: "The middle-ear pathogens arrive from the nasopharynx through the Eustachian tube: pneumococcus, non-typeable H. influenzae and Moraxella, the same three that cause sinusitis. Pseudomonas and staphylococcus are canal organisms and belong to otitis externa.",
      },
      {
        type: "mcq",
        stem: "A 58-year-old smoker has 6 weeks of unilateral otalgia and both tympanic membranes are normal. What is the most appropriate next step?",
        options: [
          "Reassure and prescribe analgesia, since the ear is normal",
          "Examine the postnasal space, oropharynx and larynx under flexible endoscopy and arrange imaging",
          "Prescribe amoxicillin empirically",
          "Insert a grommet to equalise middle-ear pressure",
          "Advise cotton-wool with olive oil for the ear",
        ],
        correctIndex: 1,
        explanation: "Normal drums mean the pain is referred through the fifth, ninth and tenth nerves and the cervical plexus. In a smoker, unilateral otalgia is a head and neck cancer presentation until you have inspected the postnasal space, oropharynx and larynx and imaged the head and neck.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The external and middle ear are one functional unit whose disease follows a blocked Eustachian tube. Otitis externa is a painful canal with a normal drum and is treated topically; acute otitis media is a bulging immobile drum with fever and is treated with analgesia and amoxicillin when indicated; otitis media with effusion is an effusion without inflammation and is managed by watchful waiting and audiology; and chronic suppurative otitis media splits into a safe central perforation and an unsafe marginal or attic perforation with cholesteatoma, which is surgical.",
      },
      {
        type: "paragraph",
        text: "Next: what happens when that infection reaches the mastoid and the skull base — mastoiditis, facial palsy, labyrinthitis and the intracranial complications, plus otosclerosis and stapes surgery.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Mastoid disease and complications (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recognise acute mastoiditis clinically and list the intratemporal and intracranial complications of middle-ear infection; name the route each complication takes from the mastoid to the cranial cavity; explain why facial palsy in acute otitis media and facial palsy in a chronically discharging ear carry completely different implications; diagnose and treat otosclerosis, contrast it with other causes of conductive deafness in the adult, and describe the place of stapedectomy.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (External and middle ear disease) — you must know the difference between safe and unsafe chronic suppurative otitis media — and the temporal bone anatomy that places the facial nerve, the lateral semicircular canal and the sigmoid sinus adjacent to the mastoid air cells.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Mastoiditis",
        text: "Infection of the mucoperiosteum lining the mastoid air cells, arising almost always from extension of acute or chronic otitis media through the aditus ad antrum. Drainage out of the ear and ventilation through the Eustachian tube fail, pus under pressure destroys the bony septa of the air cells, and infection then spreads wherever bone or a venous channel leads.",
      },
      {
        type: "paragraph",
        text: "The mastoid is not a dead-end air space. It sits between the middle ear below, the middle cranial fossa above (separated only by the thin tegmen), the sigmoid sinus behind, and the lateral semicircular canal and facial nerve within. That single anatomical fact explains the entire complication list: infection that cannot leave the ear walks up, back and inward, and arrives at the meninges, the venous sinuses and the brain.",
      },

      { type: "heading", level: 2, text: "Recognising acute mastoiditis" },
      {
        type: "paragraph",
        text: "Acute mastoiditis is a clinical diagnosis: an unresolved or worsening AOM, typically 2 weeks after onset, with fever, otalgia and postauricular pain. The classic triad is postauricular erythema, swelling and tenderness, with the pinna pushed outwards and downwards and a protrusion that you can measure behind the ear where an abscess lies. Systemic upset follows, the drum may be bulging or already perforated, and there is a sagging of the posterosuperior canal wall on otoscopy.",
      },
      {
        type: "table",
        headers: ["Investigation", "Finding", "Role"],
        rows: [
          ["CT temporal bone with contrast", "Mastoid clouding, destruction of the intercellular septa, a subperiosteal or intracranial abscess, erosion of the tegmen or sinus plate", "The investigation that determines whether surgery is needed and whether the problem has become intracranial"],
          ["Blood tests", "Raised CRP, white cell count; blood cultures if febrile", "Establishes severity baseline, guides response"],
          ["Urgent microscopy and culture of discharge", "Organism and sensitivity", "Directs the change from amoxicillin to intravenous cover including Staphylococcus and anaerobes"],
        ],
      },
      {
        type: "paragraph",
        text: "A subperiosteal abscess with clinical mastoiditis needs a cortical mastoidectomy with intravenous antibiotics, not simply longer oral treatment. If the disease is confined to the mucoperiosteum and there is no collection, a trial of intravenous antibiotics with myringotomy for drainage is acceptable in some patients, particularly children who respond. Gradenigo syndrome — petrous apicitis — combines suppurative otitis media with deep retro-orbital pain and an ipsilateral abducens nerve palsy.",
      },

      { type: "heading", level: 2, text: "The routes of spread" },
      {
        type: "table",
        headers: ["Route from the middle ear and mastoid", "Where it lands", "How it presents"],
        rows: [
          ["Direct bone erosion or preformed pathways (fissures, sutures, the tympanomeningeal fissure of Hyrtl)", "Epidural or subdural abscess, meningitis, temporal lobe or cerebellar abscess", "Headache, fever, neck stiffness, focal neurology, seizures, reduced level of consciousness"],
          ["Thrombophlebitis of the small veins", "Sigmoid sinus thrombosis", "Spiking fever, bacteraemia, papilloedema, obstructive hydrocephalus, otitic hydrocephalus"],
          ["Erosion of the fallopian canal, usually in a dehiscent nerve", "Facial nerve palsy", "Complete lower motor neurone weakness on the same side"],
          ["Erosion of the lateral semicircular canal", "Labyrinthine fistula", "Rotatory vertigo with a positive fistula test, sensorineural hearing loss"],
          ["Spread through the mucosa and the labyrinthine window", "Serous or suppurative labyrinthitis", "Vertigo, vomiting, nystagmus and profound deafness"],
          ["Medial spread through the mastoid tip", "Bezold abscess in the sternocleidomastoid, or a zygomatic abscess", "Deep neck swelling with torticollis and fluctuance; risk of airway obstruction and jugular vein thrombosis"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The single most useful question in any patient with ear discharge is 'have you had fever, headache, vomiting, neck stiffness, drowsiness or double vision?' A yes converts a routine ENT consultation into an emergency CT and a neurosurgical referral.",
      },

      { type: "heading", level: 2, text: "Facial palsy in ear disease" },
      {
        type: "paragraph",
        text: "The same symptom has two opposite meanings, and the discriminating feature is the state of the ear. In acute otitis media with a bulging drum and no perforation, the nerve is affected by inflammation pressing on a dehiscent canal: myringotomy plus intravenous antibiotics and steroids usually recovers the nerve, and a true mastoidectomy is not always needed. In chronic suppurative disease, the palsy is due to cholesteatoma eroding the fallopian canal or osteitis of the nerve: this is an unsafe ear and needs urgent surgery to clear disease, and recovery is less certain.",
      },
      {
        type: "example",
        text: "A 6-year-old on day 5 of AOM has otalgia, fever, and a complete left lower motor neurone facial palsy, with a bulging immobile drum. This is a complication of acute otitis media and not Bell palsy: the ear is the cause, and management is urgent myringotomy (or grommet insertion) for drainage with intravenous antibiotics, with CT reserved for suspected cholesteatoma or no resolution on antibiotics. The prognosis for nerve recovery is good.",
      },

      { type: "heading", level: 2, text: "Otosclerosis" },
      {
        type: "definition",
        term: "Otosclerosis",
        text: "An autosomal dominant disorder of bone remodelling of the otic capsule: mature lamellar bone is replaced by spongy vascular bone that first fixes the stapes footplate at the oval window, producing a conductive deafness, and later involves the cochlea producing a sensorineural loss.",
      },
      {
        type: "table",
        headers: ["Feature", "What to expect"],
        rows: [
          ["Epidemiology", "Onset typically between 20 and 40 years; more common in women; family history in over half; often worsens or first appears during pregnancy"],
          ["Hearing loss", "Bilateral and asymmetric conductive loss; the patient hears better in noise (paracusis) because noise suppresses the healthy cochlea; tinnitus appears as disease advances"],
          ["Ear examination", "Perfectly normal tympanic membrane and canal — the diagnosis is audiological, not otoscopic"],
          ["Audiometry", "Conductive loss with a stapedial Carhart notch — a dip in bone conduction at 2 kHz — and a reduced stapedial reflex; a mixed loss appears when otospongiotic foci invade the cochlea"],
          ["Schwartz sign", "A reddish flush on the promontory behind the drum in very active otospongiosis; a sign of vascularity that predicts surgery will be harder"],
          ["Management", "Sodium fluoride and hearing aids have historical and supplementary roles; the definitive operation is stapedotomy or stapedectomy with a piston prosthesis, and laser-assisted surgery improves the outcome"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not leave a conductive deafness in a young adult unexplained. The differential of bilateral conductive deafness with normal drums includes otosclerosis, ossicular discontinuity after trauma, and a third-window syndrome. A patient told there is 'no cause and no treatment' has usually not had proper pure-tone audiometry, tympanometry and a stapedial reflex test.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a swollen, protruding auricle with a longer course of oral antibiotics. Postauricular swelling, erythema and tenderness with a protruding pinna is mastoiditis with an abscess until proven otherwise, and needs urgent CT and a cortical mastoidectomy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mistaking a mastoid abscess for mumps. Mumps is bilateral, tender on both sides, centred on the parotid rather than the mastoid, and does not follow an ear infection.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that a facial palsy in a chronically discharging ear is unsafe disease and requires surgery, not expectation of spontaneous recovery as in Bell palsy.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which complications of mastoid disease present with headache, fever, neck stiffness and drowsiness, and by what route do they reach the brain?",
        answer: "Meningitis, extradural abscess, subdural empyema, temporal lobe and cerebellar abscess, and sigmoid sinus thrombosis. They spread from the mastoid either by direct bone erosion or by thrombophlebitis through the small veins that connect the middle ear and mastoid to the dural sinuses and the subarachnoid space across the tegmen and the sigmoid sinus plate.",
        explanation: "The mastoid lies directly against the middle cranial fossa and posterior fossa: the tegmen tympani and the sinus plate are the two thin bones, and venous channels cross them even where bone is intact.",
      },
      {
        type: "question",
        prompt: "Why does otosclerosis produce a normal tympanic membrane with a conductive deafness?",
        answer: "Otospongiosis fixes the stapes footplate so that sound cannot efficiently reach the cochlea, which is conductive deafness; but the disease is in the bone of the otic capsule visible only through an intact, healthy drum. The cochlea is normal at first, so the drum looks ordinary while air conduction thresholds progressively rise, with bone conduction remaining good until cochlear invasion begins.",
        explanation: "This is the general principle separating conductive deafness (middle-ear mechanics, normal drum or visible middle-ear disease) from sensorineural deafness (cochlear or retrocochlear, no middle-ear explanation).",
      },
      {
        type: "question",
        prompt: "What is Gradenigo syndrome?",
        answer: "Petrous apicitis complicating suppurative otitis media: suppurative otitis media, deep retro-orbital pain from trigeminal involvement in Meckel's cave, and an ipsilateral sixth cranial nerve palsy from the nerve's course through Dorello's canal beside the petrous apex.",
        explanation: "The petrous apex sits between the middle ear and the posterior fossa, and inflammation there irritates both the fifth and sixth nerves, which are the two cranial nerves that cross it.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A child with a 2-week history of acute otitis media, now treated with oral antibiotics, develops fever, severe otalgia, postauricular erythema, tenderness, and a visible protrusion of the pinna outwards and downwards. What is the most appropriate immediate management?",
        options: [
          "Continue the oral antibiotic for a further 14 days",
          "Analgesia and review in 48 hours",
          "Urgent CT temporal bone and cortical mastoidectomy with intravenous antibiotics",
          "Topical antibiotic drops and a hearing test",
          "Oral corticosteroids alone",
        ],
        correctIndex: 2,
        explanation: "Postauricular swelling, erythema, tenderness and protrusion of the pinna define mastoiditis, and a subperiosteal abscess needs a cortical mastoidectomy with intravenous antibiotics. Continued oral therapy is what let the complication develop.",
      },
      {
        type: "mcq",
        stem: "Which combination best describes the triad of Gradenigo syndrome?",
        options: [
          "Facial palsy, sensorineural deafness and mastoid swelling",
          "Suppurative otitis media, retro-orbital pain and abducens nerve palsy",
          "Vertigo, vomiting and nystagmus",
          "Deep neck abscess, torticollis and dysphagia",
          "Meningitis, seizures and coma",
        ],
        correctIndex: 1,
        explanation: "Gradenigo syndrome is petrous apicitis: infection at the petrous apex irritates the trigeminal nerve (retro-orbital pain) and the sixth nerve as it crosses Dorello's canal, on top of the underlying otitis media.",
      },
      {
        type: "mcq",
        stem: "A 35-year-old woman has a progressive bilateral conductive deafness with normal tympanic membranes, tinnitus, a Carhart notch at 2 kHz on the audiogram, and symptoms that worsened during pregnancy. What is the diagnosis?",
        options: [
          "Chronic secretory otitis media",
          "Otosclerosis",
          "Acoustic neuroma",
          "Otitis externa",
          "Presbycusis",
        ],
        correctIndex: 1,
        explanation: "Young adult onset, progressive bilateral conductive loss, normal drums, a Carhart notch and worsening in pregnancy are the features of otosclerosis, in which spongy bone fixes the stapes footplate. Acoustic neuroma causes unilateral sensorineural loss with poor speech discrimination.",
      },
      {
        type: "mcq",
        stem: "A patient with chronic suppurative otitis media develops vertigo with nystagmus and an ipsilateral facial palsy. What is the most likely mechanism?",
        options: [
          "Eustachian tube obstruction alone",
          "Cholesteatoma eroding the lateral semicircular canal and the fallopian canal",
          "Benign paroxysmal positional vertigo",
          "Ototoxicity of ear drops",
          "Meniere's disease",
        ],
        correctIndex: 1,
        explanation: "Cholesteatoma is bone-destroying, and the two most vulnerable structures in the mastoid after the ossicles are the lateral semicircular canal and the facial nerve. A fistula of the canal plus facial palsy is unsafe ear disease requiring urgent surgery.",
      },
      {
        type: "mcq",
        stem: "A patient with ear discharge has fever, spiking rigors, headache, papilloedema and a positive blood culture. Which complication is most likely, and which structure does it involve?",
        options: [
          "Bezold abscess involving the sternocleidomastoid",
          "Sigmoid sinus thrombosis involving the dural venous sinus",
          "Labyrinthitis involving the cochlea",
          "Facial palsy involving the fallopian canal",
          "Petrositis involving Dorello's canal",
        ],
        correctIndex: 1,
        explanation: "Pyaemia with spiking fevers, bacteraemia and papilloedema is sigmoid sinus thrombosis, from septic thrombophlebitis of the veins draining the mastoid, and it requires contrast imaging of the posterior fossa plus prolonged antibiotics and anticoagulation in selected cases.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Mastoiditis is the same infection that caused otitis media, trapped in a bony space against the meninges, the sinuses and the facial nerve. It is diagnosed clinically and by CT, and needs a cortical mastoidectomy with intravenous antibiotics. The complication list — facial palsy, labyrinthitis and fistula, petrositis, Bezold abscess, meningitis, epidural and brain abscess, sigmoid sinus thrombosis — is a list of the structures the mastoid abuts, plus otosclerosis, the occluding disease of the stapes footplate that causes a conductive deafness behind a normal drum.",
      },
      {
        type: "paragraph",
        text: "Next: the nose and sinuses — rhinosinusitis and nasal polyps, the drainage pathways that decide the disease names, and the indications for endoscopic sinus surgery.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Rhinosinusitis and nasal polyps (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: draw the drainage pathways of the paranasal sinuses and explain why the ostiomeatal complex is the pivot of sinus disease; separate viral rhinosinusitis from acute bacterial rhinosinusitis using symptom duration and pattern; recognise allergic rhinitis and prescribe its treatment, including the role of intranasal corticosteroids; diagnose nasal polyps and list their associations, including aspirin sensitivity, asthma and cystic fibrosis in children; and state the indications for endoscopic sinus surgery.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Nasal and paranasal sinus anatomy — the meatuses, the hiatus semilunaris, the lamina papyracea that separates the ethmoid sinuses from the orbit, and the close relationship of the maxillary teeth to the sinus floor — and the microbiology of the respiratory pathogens named below.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Ostiomeatal complex",
        text: "The common drainage pathway of the maxillary antrum, the frontal sinus and the anterior ethmoid air cells, emptying into the middle meatus through the hiatus semilunaris. It is the final common route for three sinuses, so a small amount of oedema there obstructs all three at once.",
      },
      {
        type: "paragraph",
        text: "The sinuses do not fill with disease from nowhere. They are air spaces that fail because drainage is obstructed, and the obstruction is nearly always the consequence of a viral cold, an allergic reaction or an anatomical narrowing. The modern name reflects that unity: rhinosinusitis, because the nose and the sinuses are one continuous mucosa and one disease, not two.",
      },

      { type: "heading", level: 2, text: "The drainage map" },
      {
        type: "table",
        headers: ["Sinus", "Drains into", "Consequence of obstruction"],
        rows: [
          ["Maxillary antrum", "Middle meatus, through the hiatus semilunaris of the ostiomeatal complex", "The commonest sinus to be infected, and the one whose floor carries the roots of the upper premolars and molars — odontogenic sinusitis follows dental extraction and apical infection"],
          ["Frontal sinus", "Middle meatus through the frontal recess", "Frontal sinusitis, with the risk of frontal bone osteomyelitis (Pott puffy tumour) or an intracranial collection"],
          ["Anterior ethmoid air cells", "Middle meatus via the ostiomeatal complex", "Ethmoiditis, and through the paper-thin lamina papyracea, orbital cellulitis and orbital abscess"],
          ["Posterior ethmoid air cells", "Superior meatus", "Posterior ethmoiditis; on CT this is where polyps first proliferate"],
          ["Sphenoid sinus", "Spheno-ethmoidal recess, above the superior turbinate", "Sphenoiditis with the optic nerve and cavernous sinus adjacent, so visual loss and cranial nerve palsy are the danger"],
          ["Nasolacrimal duct", "Inferior meatus", "Epiphora and crusting with nasal obstruction, and the route by which a nasal foreign body causes unilateral discharge"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Fever with a swollen, red, painful eye in a patient with a blocked nose is an emergency: orbital cellulitis and orbital abscess arise from ethmoid sinusitis through the lamina papyracea, and cavernous sinus thrombosis follows posterior spread. These patients need contrast CT, intravenous antibiotics and an urgent ophthalmology and ENT assessment.",
      },

      { type: "heading", level: 2, text: "Viral rhinosinusitis: the starting point" },
      {
        type: "paragraph",
        text: "The common cold is a viral rhinosinusitis. Symptoms peak on day two or three, and the nasal discharge becomes thick and coloured because of sloughed mucosa and an influx of leucocytes, not because of a bacterial superinfection. Recovery is expected by day ten. That single fact is the most important prescribing message in rhinology: coloured mucus is not an indication for an antibiotic.",
      },
      {
        type: "table",
        headers: ["Feature", "Viral rhinosinusitis", "Acute bacterial rhinosinusitis"],
        rows: [
          ["Duration", "Under 10 days, with improvement by then", "Over 10 days without any improvement"],
          ["Pattern", "Peaks early, then settles", "Double worsening — a cold that improves for five or six days and then deteriorates"],
          ["Severity at onset", "Mild", "Severe from the start: fever of 39 C or more with purulent discharge or facial pain for three to four consecutive days"],
          ["Facial pain", "Mild, over the cheeks and forehead", "Severe, toothache-like in the maxillary sinus"],
          ["Management", "Reassurance, paracetamol or ibuprofen, saline irrigation, a topical decongestant for up to seven days", "Antibiotic, intranasal corticosteroid, saline irrigation and analgesia"],
        ],
      },

      { type: "heading", level: 2, text: "Acute bacterial rhinosinusitis" },
      {
        type: "paragraph",
        text: "The pathogens mirror those of acute otitis media because they are the same nasopharyngeal flora: Streptococcus pneumoniae, non-typeable Haemophilus influenzae and Moraxella catarrhalis, with anaerobes and Staphylococcus aureus in chronic or odontogenic disease. Amoxicillin remains first line; amoxicillin-clavulanate or doxycycline covers beta-lactamase producers and anaerobes; a respiratory quinolone is reserved for failure of second-line therapy. In adults with mild uncomplicated disease, watchful waiting for 72 hours with a reserve prescription is a legitimate option.",
      },
      {
        type: "paragraph",
        text: "Recurrent acute sinusitis raises the question of anatomy — a septal spur, a concha bullosa, a lateralised middle turbinate — or of underlying allergy. Refractory unilateral disease in a child raises the question of a foreign body, and persistent unilateral disease in an adult raises the question of a tumour until the postnasal space has been seen.",
      },

      { type: "heading", level: 2, text: "Allergic rhinitis" },
      {
        type: "paragraph",
        text: "Allergic rhinitis is an IgE-mediated reaction of the nasal mucosa and one of the most reliable patterns to discriminate from infection. The patient sneezes in paroxysms, the nose runs clear and watery, the eyes itch and water, the obstruction is bilateral and alternates with a dominant side, and there is a personal or family history of eczema, asthma or food allergy.",
      },
      {
        type: "table",
        headers: ["Feature", "Allergic rhinitis", "Viral cold"],
        rows: [
          ["Sneezing", "Frequent and in bouts", "Present early, settles"],
          ["Itching", "Nose, palate, ears and eyes — the hallmark", "Absent"],
          ["Discharge", "Clear and watery", "Thick and coloured after a day or two"],
          ["Blockage", "Bilateral, alternating sides", "Bilateral and resolving over a week"],
          ["Conjunctival signs", "Common", "Absent or mild"],
          ["Mucosa", "Pale, boggy, bluish inferior turbinates", "Red and swollen"],
          ["Duration", "Seasonal or perennial, weeks to months", "Days"],
        ],
      },
      {
        type: "paragraph",
        text: "Treatment is a hierarchy. Allergen avoidance is free but rarely sufficient. An intranasal corticosteroid (fluticasone, mometasone, budesonide) is the single most effective agent and works on obstruction as well as discharge, and must be used continuously rather than on demand. A non-sedating oral antihistamine is added for sneezing, itch and eye symptoms. A leukotriene receptor antagonist has a place, particularly with coexisting asthma. Allergen immunotherapy is the only disease-modifying treatment and its benefit extends beyond the nasal symptoms.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Topical decongestant sprays used for more than a week produce rhinitis medicamentosa: the mucosa becomes more congested than before, the patient sprays more often, and the withdrawal state is worse than the original symptom. Five to seven days is the ceiling. Treat the underlying disease with a corticosteroid spray instead.",
      },

      { type: "heading", level: 2, text: "Nasal polyps" },
      {
        type: "paragraph",
        text: "Nasal polyps are pale, gelatinous, insensitive swellings arising in the ethmoid sinuses and prolapsing into the nasal cavity, almost always bilaterally. The symptoms are bilateral obstruction, hyposmia or anosmia, postnasal drip and a feeling of fullness. On examination the polyp is insensitive to probing, whereas the inferior turbinate, the usual mimic, is highly sensitive.",
      },
      {
        type: "definition",
        term: "Aspirin-exacerbated respiratory disease (Samter triad)",
        text: "The association of nasal polyps, asthma and a respiratory reaction to aspirin and other non-steroidal anti-inflammatory drugs, driven by cysteinyl leukotriene overproduction; ingestion of an NSAID produces an acute asthma exacerbation with profuse rhinorrhoea.",
      },
      {
        type: "table",
        headers: ["Association", "Why it matters"],
        rows: [
          ["Asthma", "Treated together; the severity of the nasal disease and of the asthma track each other"],
          ["Aspirin or NSAID sensitivity", "Samter's triad; aspirin desensitisation has a place in selected patients after surgery"],
          ["Cystic fibrosis", "Any child under 12 with nasal polyps needs a sweat chloride or genetic test, and a high proportion of adults with cystic fibrosis have polyps"],
          ["Allergic fungal rhinosinusitis", "Dense allergic mucin with hypersensitivity to dematiaceous fungi; consider in unilateral, atopic patients with expansion on CT"],
          ["Eosinophilic granulomatosis with polyangiitis", "Systemic vasculitis with asthma, eosinophilia and mononeuritis multiplex; difficult-to-control nasal disease"],
        ],
      },
      {
        type: "paragraph",
        text: "First-line treatment is a topical corticosteroid, and drops instilled in the upside-down position reach the middle meatus better than a spray. A short course of oral prednisolone is used for severe obstruction or a failed trial, and doxycycline has an anti-inflammatory effect in polyposis. Surgery — polypectomy or functional endoscopic sinus surgery — is for the patient who has failed maximal medical therapy, is disabled by obstruction or anosmia, or cannot tolerate the medication. Polyps recur in a substantial minority, so surgery buys control of the disease rather than a cure, and it needs to be followed by the same medical maintenance.",
      },
      {
        type: "example",
        text: "A 45-year-old with asthma and known aspirin sensitivity reports three months of bilateral blockage, loss of smell and thick postnasal drip. Endoscopy shows bilateral pale insensitive swellings emerging from the middle meatus. This is bilateral nasal polyposis with Samter's triad: the plan is a corticosteroid drop, saline irrigation, strict aspirin and NSAID avoidance, a check that the asthma is controlled, and referral for endoscopic sinus surgery if the sense of smell does not return. Had the mass been unilateral, the differential would have been different — an antrochoanal polyp, an inverted papilloma or a malignancy, all of which need imaging and biopsy.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing an antibiotic for coloured nasal discharge on day five of a cold. Colour comes from inflammatory cells, not bacteria; the justification for treatment needs 10 days of symptoms, double worsening, or a severe onset with high fever.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Continuing a decongestant nasal spray for weeks. Seven days is the ceiling, after which rhinitis medicamentosa congests the nose further and leaves the patient worse than at the start.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Labelling a unilateral nasal mass as a polyp without imaging or biopsy. Unilateral obstruction, unilateral blood-stained discharge, orbital signs, pain and cranial nerve palsy are the red flags for sinonasal malignancy, and a unilateral mass requires CT and endoscopic assessment with biopsy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Operating on nasal polyps without establishing the medical baseline. Asthma control, aspirin caution and topical corticosteroid therapy all matter more than the operation, and recurrence after surgery is common without them.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why are the maxillary, frontal and anterior ethmoid sinuses described together in the ostiomeatal complex, and what follows from that grouping?",
        answer: "Because all three drain through the same narrow route — the hiatus semilunaris in the middle meatus. One focus of mucosal oedema therefore obstructs all three sinuses simultaneously, which is why bacterial rhinosinusitis often affects all three at once and why a functional endoscopic sinus operation aims to open that single common pathway rather than each sinus separately.",
        explanation: "The surgical principle follows the anatomy: widen the drainage of the ostiomeatal complex and the ventilated sinuses recover.",
      },
      {
        type: "question",
        prompt: "Which three patterns define acute bacterial rather than viral rhinosinusitis?",
        answer: "Symptoms that persist beyond 10 days without any improvement; symptoms that are severe from the onset — fever of at least 39 C with purulent discharge or facial pain for 3 to 4 consecutive days at the start of the illness; or double worsening, in which a viral illness improves for five or six days and then deteriorates.",
        explanation: "These three criteria exist to spare viral infections from unnecessary antibiotics while catching the ones that will not resolve spontaneously.",
      },
      {
        type: "question",
        prompt: "How does a nasal polyp differ from an inferior turbinate on examination, and why does that matter?",
        answer: "A polyp is pale, gelatinous, originates from the middle meatus, and is completely insensitive when touched with a cotton-tip; the inferior turbinate is pinker, fixed to the lateral wall, and very sensitive. Sensitivity to probing is the bedside discriminator, and it matters because the turbinate is what is usually mistaken for a polyp and vice versa.",
        explanation: "The examination discriminator protects against unnecessary surgery on a turbinate that has been misread as a polyp.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has had nasal discharge and facial pressure for 14 days without improvement after a head cold. What is the most appropriate management?",
        options: [
          "No treatment, because coloured mucus always means a virus",
          "A topical decongestant spray for three weeks",
          "An antibiotic such as amoxicillin, an intranasal corticosteroid and saline irrigation",
          "Oral antihistamines and reassurance",
          "Empirical nasal polypectomy",
        ],
        correctIndex: 2,
        explanation: "Symptoms persisting beyond 10 days without improvement is one of the criteria for acute bacterial rhinosinusitis and earns an antibiotic, alongside an intranasal corticosteroid, saline irrigation and analgesia. Reassurance alone applies to the cold that improves by day ten.",
      },
      {
        type: "mcq",
        stem: "Which of the following best differentiates allergic rhinitis from a viral upper respiratory infection?",
        options: [
          "Bilateral obstruction and facial pain lasting 10 days",
          "Paroxysmal sneezing with nasal and ocular itching and clear watery discharge",
          "Thick yellow-green discharge with fever",
          "Unilateral blood-stained discharge",
          "Postnasal drip with hyposmia and halitosis",
        ],
        correctIndex: 1,
        explanation: "Itch is the hallmark of allergic rhinitis — sneezing in bouts, itchy nose, palate, ears and eyes, with clear watery discharge. Thick coloured discharge with fever and pain suggests bacterial rhinosinusitis, and unilateral blood-stained discharge is a red flag for a tumour.",
      },
      {
        type: "mcq",
        stem: "A 7-year-old has bilateral nasal obstruction, loss of smell and palpable pale nasal swellings. Which additional investigation is most important?",
        options: [
          "Skin-prick allergy testing",
          "CT of the paranasal sinuses in the first instance",
          "Sweat chloride or genetic testing for cystic fibrosis",
          "Serum ACE",
          "Throat swab",
        ],
        correctIndex: 2,
        explanation: "Nasal polyps in a child are uncommon and strongly associated with cystic fibrosis, which must be excluded with a sweat chloride or genetic test before treatment. CT has a radiation cost and is reserved for surgical planning; allergy testing does not address the key differential.",
      },
      {
        type: "mcq",
        stem: "Which statement about nasal polyposis is correct?",
        options: [
          "Polyps are highly sensitive when probed, unlike the inferior turbinate",
          "Unilateral nasal polyps are common and never need further investigation",
          "Polyps are associated with asthma, aspirin sensitivity and cystic fibrosis",
          "Endoscopic sinus surgery cures polyposis, so no medical follow-up is needed",
          "Oral corticosteroids have no role in polyposis",
        ],
        correctIndex: 2,
        explanation: "Polyps are pale, insensitive swellings associated with asthma, aspirin-exacerbated respiratory disease and, in children, cystic fibrosis. They are usually bilateral; a unilateral mass needs biopsy, and surgery reduces the polyp load but does not remove the disease, so medical therapy is continued.",
      },
      {
        type: "mcq",
        stem: "A patient using an over-the-counter decongestant nasal spray for three weeks has worsening congestion that is worse when she misses a dose. What is the mechanism?",
        options: [
          "Allergic sensitisation to the spray",
          "Rebound vasodilatation — rhinitis medicamentosa",
          "Bacterial superinfection of the turbinate",
          "Development of nasal polyps",
          "Adenoidal hypertrophy",
        ],
        correctIndex: 1,
        explanation: "Prolonged topical decongestant use causes rebound congestion with tachyphylaxis of the vasoconstrictor effect, so the mucosa swells more as the spray wears off and the patient escalates the dose. The treatment is withdrawal, a corticosteroid spray and saline, and limiting any decongestant to 5 to 7 days.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Sinus disease is a disease of drainage. Viral rhinosinusitis resolves by day ten and earns no antibiotic; acute bacterial rhinosinusitis is defined by duration beyond 10 days, severe onset, or double worsening and is treated with amoxicillin, a topical corticosteroid and saline. Allergic rhinitis is the itch-and-sneeze pattern treated with intranasal corticosteroids, antihistamines and immunotherapy, and nasal polyps are bilateral insensitive swellings linked to asthma, aspirin sensitivity and cystic fibrosis, treated medically first and surgically when medical therapy fails.",
      },
      {
        type: "paragraph",
        text: "Next: the nose as a bleeding organ — epistaxis, septal disease and the sinonasal tumours that hide behind a unilateral symptom.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 4 — Epistaxis, septal lesions and sinonasal tumours (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: locate the common sites of epistaxis and describe first aid, cautery, anterior packing and the management of posterior bleeding; list the local and systemic causes of epistaxis and name the investigations that matter; recognise septal deviation and septal perforation and their causes; distinguish the benign and malignant tumours of the nose and sinuses, including juvenile angiofibroma and inverted papilloma; and identify the red flags that make a unilateral nasal symptom an urgent cancer referral.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Rhinosinusitis and nasal polyps) for the sinus anatomy, and the arterial supply of the nasal cavity — the sphenopalatine artery (the terminal branch of the maxillary artery), the anterior and posterior ethmoidal arteries (from the ophthalmic artery), and the superior labial and greater palatine arteries, since epistaxis is entirely a disease of these four vessels.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Little's area (Kiesselbach's plexus)",
        text: "The anastomosis on the antero-inferior part of the nasal septum of the sphenopalatine, anterior ethmoidal, superior labial and greater palatine arteries. It is the source of about 90 per cent of epistaxis, and it is a watershed of four vessels where a drying breeze, a fingernail or a deviated septum injures mucosa that cannot heal.",
      },
      {
        type: "paragraph",
        text: "Epistaxis is a vascular problem before it is a disease. The nose is a high-flow, low-pressure, thin-walled mucosal surface that warms and humidifies the air you breathe, and it is the one part of the body you repeatedly scrape with a finger. Anterior epistaxis is common, dramatic and easy to control. Posterior epistaxis is less common, harder to see, more dangerous, usually arterial from the sphenopalatine artery, and more common in the elderly, the anticoagulated and the hypertensive.",
      },

      { type: "heading", level: 2, text: "The two epistaxis syndromes" },
      {
        type: "table",
        headers: ["Feature", "Anterior epistaxis", "Posterior epistaxis"],
        rows: [
          ["Site", "Little's area on the septum", "Posterior nasal cavity, Woodruff's plexus or the sphenopalatine artery"],
          ["Proportion", "About 90 per cent of bleeds", "About 10 per cent"],
          ["Patient", "Children and young adults", "Older adults, often hypertensive, on anticoagulants or antiplatelet drugs"],
          ["Presentation", "Dribbling from the front, visible bleeding point", "Bleeding down both nostrils and the pharynx, swallowed blood, haematemesis, anaemia"],
          ["First aid", "Pinching the soft part of the nose for 10 to 15 minutes with the head leaning forward usually stops it", "Does not respond; needs a posterior pack, balloon or sphenopalatine artery ligation"],
          ["Definitive control", "Silver nitrate cautery or bipolar diathermy of the visible point", "Endoscopic sphenopalatine artery ligation, or angiographic embolisation of the internal maxillary artery"],
        ],
      },
      {
        type: "paragraph",
        text: "First aid is done badly by most lay people, and the examiners know it. Sit the patient up and lean them slightly forward — not backwards, because the blood is swallowed and the volume underestimated. Pinch the soft, cartilaginous part of the nose between finger and thumb for a continuous 10 to 15 minutes without repeatedly checking, breathe through the mouth, and apply a cold pack to the nasal bridge. Nothing is put up the nose during this period.",
      },
      {
        type: "table",
        headers: ["Step", "Action", "Pitfall"],
        rows: [
          ["1. Stabilise", "Sit the patient up, lean forward, continuous pressure on the soft part for 10 to 15 minutes, ice on the bridge, suction the pharynx", "Pressure on the bony bridge, or intermittent release to check, restarts the bleeding"],
          ["2. Assess", "Falling blood pressure, tachycardia, airway compromise, anticoagulants, symptoms of shock", "Estimating blood loss from what the patient reports — much is swallowed"],
          ["3. Visualise", "Headlight, suction, cotton wool soaked in adrenaline and lignocaine; identify the bleeding point and cauterise with silver nitrate or diathermy", "Cauterising without seeing the point, or bilateral cautery that perforates the septum"],
          ["4. Pack", "Anterior pack — a Merocel sponge, Rapid Rhino balloon or BIPP ribbon gauze; pack for 24 to 48 hours", "Leaving a unilateral pack in place without antibiotics, and missing the posterior source"],
          ["5. Escalate", "Posterior bleed: balloon catheter or Foley through the nose into the nasopharynx, inflation, traction, a formal posterior pack, admission and airway monitoring", "A blind pack without correcting a coagulopathy, anticoagulation or hypertension"],
          ["6. Definitive", "Endoscopic sphenopalatine artery ligation, anterior and posterior ethmoidal ligation, or embolisation; surgical vessel control in refractory disease", "Embolising a vessel with dangerous anastomoses with the ophthalmic artery or internal carotid"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A packed patient needs antibiotics and observation, not a discharge pack. Nasal packing for more than 24 to 48 hours risks toxic shock syndrome, sinusitis and pressure necrosis of the septum, and a bilateral posterior pack can cause hypoxia, hypercarbia and aspiration. Correct anticoagulation, reverse a warfarin or a DOAC where clinically appropriate, and never assume a bleed that will not stop with a pack is a simple bleed.",
      },

      { type: "heading", level: 2, text: "The causes" },
      {
        type: "table",
        headers: ["Category", "Cause", "Clue"],
        rows: [
          ["Local", "Nose-picking, digital trauma, dry air, heated rooms", "The commonest cause in children; recurrent unilateral bleeding in Little's area"],
          ["Local", "Rhinitis, septal deviation with mucosal drying, septal perforation", "Crusting, discharge and scarring"],
          ["Trauma", "Facial fractures, foreign bodies, nasal surgery, nasal cannulae", "History, and visible injury"],
          ["Neoplastic", "Juvenile angiofibroma, inverted papilloma, sinonasal carcinoma, nasopharyngeal carcinoma", "Unilateral obstruction with bleeding — the red flag"],
          ["Systemic", "Hypertension, anticoagulant and antiplatelet therapy, alcoholism", "Prolonged or recurrent bleeding, and the patient who bleeds from two sites"],
          ["Haematological", "Von Willebrand disease, haemophilia, thrombocytopenia, leukaemia", "Bleeding from gums, easy bruising, family history, prolonged epistaxis from childhood"],
          ["Vascular", "Hereditary haemorrhagic telangiectasia (Osler-Weber-Rendu)", "Telangiectasia on lips, tongue and fingers, anaemia, epistaxis in adults with a family history"],
        ],
      },

      { type: "heading", level: 2, text: "Septal lesions" },
      {
        type: "paragraph",
        text: "Septal deviation is present in most adults and symptomatic in a minority. It is a C-shaped or S-shaped curvature producing unilateral obstruction, recurrent epistaxis from the drying mucosa on the convex side, headache, and sinus disease from obstruction of the middle meatus. Septoplasty repositions the septum; the complications are the ones a candidate must know — septal haematoma, which requires urgent drainage to prevent avascular necrosis and a saddle deformity, septal perforation, nasal obstruction from over-resection, cerebrospinal fluid leak from a cribriform plate injury, and the worsening of tip support.",
      },
      {
        type: "paragraph",
        text: "Septal perforation is a hole through all three layers. It produces a whistle with inspiration, crusting, bleeding and a sense of blockage, and the causes tell the diagnosis: previous septal surgery, trauma, cocaine use, granulomatosis with polyangiitis, malignancy, tuberculosis, syphilis, leprosy and an untreated septal abscess. Treat with saline or gel, and a septal button for a large perforation; biopsy the edge in an unexplained case.",
      },

      { type: "heading", level: 2, text: "Benign sinonasal tumours" },
      {
        type: "table",
        headers: ["Tumour", "Who", "Behaviour and management"],
        rows: [
          ["Juvenile angiofibroma", "Adolescent males, aged 10 to 25", "Benign but locally aggressive, arising in the nasopharynx at the sphenopalatine foramen; presents with profuse recurrent epistaxis and nasal obstruction; heavily supplied by the internal maxillary artery. Image with CT and MRI, biopsy is hazardous, and treatment is surgical excision after preoperative embolisation"],
          ["Inverted papilloma", "Middle-aged and older men", "A unilateral mass arising from the lateral nasal wall or middle meatus; it recurs if incompletely excised and carries a risk of malignant transformation to squamous cell carcinoma. Treated by wide local excision — endoscopic or lateral rhinotomy with medial maxillectomy — and needs long-term follow-up"],
          ["Antrochoanal polyp", "Children and young adults", "A single benign polyp that arises in the maxillary antrum and prolapses backward through the choana; it may be seen behind the soft palate on oral examination, and is removed endoscopically"],
          ["Haemangioma and osteoma", "Any age", "Blood vessel and bone tumours; bleeding or obstruction, removed if symptomatic; an osteoma of the frontal recess may obstruct sinus drainage"],
        ],
      },

      { type: "heading", level: 2, text: "Malignant sinonasal tumours" },
      {
        type: "paragraph",
        text: "Malignancy of the nose and sinuses is rare and late, because the early symptoms are indistinguishable from rhinitis. That is the whole lesson: unilateral nasal symptoms that persist are the red flag. The occupational history matters as much as the examination — nickel, chromium, leather tanning, mustard gas and hardwood dust are established risk factors, the last with adenocarcinoma of the ethmoid, and cigarette smoke multiplies the risk of squamous cell carcinoma.",
      },
      {
        type: "table",
        headers: ["Red flag", "What it implies"],
        rows: [
          ["Unilateral nasal obstruction that does not alternate and persists", "A mass, from a benign tumour to a carcinoma"],
          ["Unilateral blood-stained discharge", "The single most reliable symptom of sinonasal malignancy"],
          ["Facial numbness in the distribution of the infraorbital nerve", "Maxillary carcinoma invading the infraorbital foramen"],
          ["Loosening of the upper teeth or an ill-fitting denture", "Invasion of the maxillary alveolus"],
          ["Proptosis, diplopia or loss of vision", "Extension into the orbit through the lamina papyracea or the orbital floor"],
          ["Cranial nerve palsy, especially the sixth nerve", "Extension to the cavernous sinus or the skull base"],
          ["A neck mass with a normal nose", "Cervical metastasis or nasopharyngeal carcinoma"],
        ],
      },
      {
        type: "definition",
        term: "Nasopharyngeal carcinoma",
        text: "A squamous cell carcinoma arising in the nasopharynx, strongly associated with Epstein-Barr virus and commonest in Southern China. It presents with a painless neck mass, unilateral serous otitis media from Eustachian tube obstruction, blood-stained nasal discharge, nasal obstruction, and cranial nerve palsy — and it is radiotherapy-sensitive.",
      },
      {
        type: "example",
        text: "A 62-year-old retired woodworker has six months of left-sided nasal obstruction, blood-stained discharge, and now numbness of the left cheek. Nasal endoscopy shows a friable unilateral mass. This is sinonasal malignancy until proven otherwise: CT and MRI define the extent, the neck is examined and imaged, and biopsy of the mass under endoscopic control gives the diagnosis, with squamous cell carcinoma the likeliest histology and adenocarcinoma a real possibility given the wood dust exposure.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Advising a patient with epistaxis to lie down and look at the ceiling. The head must be forward so that blood is not swallowed, and the pressure must be applied to the soft part of the nose against the septum, not on the bony bridge.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Cauterising a bleeding point that has not been seen, or cauterising both sides of the septum, which risks a perforation. Identify the point, and prefer silver nitrate to aggressive bilateral cautery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating recurrent unilateral epistaxis as a trivial dryness. Recurrent bleeding from one side in an adolescent male is a juvenile angiofibroma until imaged, and in an older adult it is sinonasal malignancy.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Biopsying a suspected angiofibroma. It is a vascular tumour of adolescent males and the biopsy can cause uncontrollable haemorrhage; the sequence is imaging, then embolisation, then excision.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does anterior epistaxis respond to pinching the nose while posterior epistaxis does not?",
        answer: "Anterior epistaxis comes from Little's area on the septum, a point reached by compressing the soft cartilaginous part of the nose against the septum, which occludes the superior labial, ethmoidal and greater palatine contributions. Posterior epistaxis arises from the sphenopalatine artery or Woodruff's plexus behind the nose, where external pressure cannot compress the vessel, so it needs a posterior pack, a balloon, arterial ligation or embolisation.",
        explanation: "The success of first aid follows the anatomy: anterior bleeding points are compressible, and posterior arterial bleeding is not.",
      },
      {
        type: "question",
        prompt: "A 13-year-old boy has three episodes of profuse right-sided epistaxis with progressive obstruction. What is the most likely diagnosis and the safest sequence of management?",
        answer: "Juvenile angiofibroma. The correct sequence is imaging first — CT and MRI to define a nasopharyngeal mass centred on the sphenopalatine foramen — then preoperative angiography with embolisation of the internal maxillary artery, then surgical excision. Blind biopsy is dangerous because of the haemorrhage it can cause.",
        explanation: "Adolescent male, recurrent profuse epistaxis and obstruction is the classic presentation, and the tumor's blood supply dictates the sequence.",
      },
      {
        type: "question",
        prompt: "Which unilateral nasal symptoms justify an urgent cancer referral?",
        answer: "Unilateral obstruction that does not alternate and persists, unilateral blood-stained discharge, facial numbness in the infraorbital nerve distribution, loosening of the upper teeth, orbital signs such as proptosis or diplopia, cranial nerve palsies, and a painless neck mass. Any one of these with a unilateral nasal presentation means malignancy until excluded.",
        explanation: "The common malignant diseases all announce themselves with unilateral symptoms, and the nose is examined with endoscopy, imaged and biopsied through it.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "The arterial supply that forms Little's area on the antero-inferior septum is contributed by which of the following?",
        options: [
          "Internal carotid, ophthalmic and ascending pharyngeal arteries",
          "Sphenopalatine, anterior ethmoidal, superior labial and greater palatine arteries",
          "Internal maxillary and facial arteries only",
          "Posterior ethmoidal and sphenopalatine arteries only",
          "Basilar and vertebral arteries",
        ],
        correctIndex: 1,
        explanation: "Little's area is the anastomosis of the sphenopalatine, anterior ethmoidal, superior labial and greater palatine arteries, which is why it is the commonest site of epistaxis in children and young adults.",
      },
      {
        type: "mcq",
        stem: "A 70-year-old man on warfarin has profuse bleeding from both nostrils and into the pharynx that does not stop after 20 minutes of correctly applied pressure. What is the next step?",
        options: [
          "Send home with a topical decongestant spray",
          "Silver nitrate cautery of Little's area",
          "Admit, resuscitate, reverse the coagulopathy, apply a posterior pack or balloon catheter, and consider endoscopic sphenopalatine artery ligation",
          "Prescribe oral antibiotics and review in clinic in a week",
          "Urgent septoplasty",
        ],
        correctIndex: 2,
        explanation: "Blood in both nostrils and the pharynx with failed anterior pressure is posterior epistaxis; it needs resuscitation, reversal of anticoagulation where clinically appropriate, a posterior pack or balloon, airway monitoring and definitive arterial control. Silver nitrate treats an anterior point that can be seen, and this is not one.",
      },
      {
        type: "mcq",
        stem: "Which combination is most suggestive of a juvenile angiofibroma?",
        options: [
          "Bilateral pale nasal polyps with asthma",
          "An adolescent male with recurrent profuse unilateral epistaxis and a nasopharyngeal mass on imaging",
          "An adult with nasal polyps, asthma and aspirin sensitivity",
          "An elderly woman with a saddle deformity and perforation",
          "A child with a unilateral foul-smelling nasal discharge",
        ],
        correctIndex: 1,
        explanation: "Juvenile angiofibroma is a benign, highly vascular tumour of adolescent males arising at the sphenopalatine foramen, presenting with profuse epistaxis and obstruction; it requires imaging and embolisation before surgery.",
      },
      {
        type: "mcq",
        stem: "Which single symptom is the most reliable indicator of sinonasal malignancy?",
        options: [
          "Bilateral obstruction alternating with the season",
          "Unilateral blood-stained nasal discharge",
          "Sneezing with clear rhinorrhoea",
          "Facial pain with fever during a cold",
          "Loss of smell with bilateral polyps",
        ],
        correctIndex: 1,
        explanation: "Unilateral blood-stained discharge is the most reliable symptom of sinonasal malignancy because a tumour ulcerates and bleeds on one side; the other options are features of allergy, viral infection or bilateral polyposis.",
      },
      {
        type: "mcq",
        stem: "Which of the following is a recognised cause of a septal perforation?",
        options: [
          "Allergic rhinitis",
          "Adenoidal hypertrophy",
          "Cocaine use, previous septal surgery and granulomatosis with polyangiitis",
          "Viral rhinosinusitis",
          "Nasal polyposis alone",
        ],
        correctIndex: 2,
        explanation: "Septal perforation results from loss of the mucoperichondrium: trauma, previous septal surgery, cocaine vasoconstriction, and systemic vasculitis such as granulomatosis with polyangiitis are the classic causes, along with malignancy, tuberculosis, syphilis and leprosy.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Ninety per cent of epistaxis is anterior and responds to correct first aid; posterior epistaxis needs admission, posterior packing and arterial control. Causation follows age and comorbidity, and the unifying red flag is a unilateral nasal symptom — obstruction, bleeding, numbness, orbital or cranial nerve signs — which is sinonasal malignancy until excluded. Septal disease is a disease of airflow and crusting, and its benign and malignant tumours, angiofibroma and inverted papilloma, both demand imaging before any instrument.",
      },
      {
        type: "paragraph",
        text: "Next: the larynx and the voice — stridor, palsy and carcinoma, and the airway decisions that come before everything else.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 5 — Laryngeal disorders and voice (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: assess a hoarse voice, including the flexible laryngoscopy and the urgency that attaches to a smoker with hoarseness; recognise the common benign lesions of the vocal folds and their first-line treatment; distinguish inspiratory, expiratory and biphasic stridor and generate the differential for each; manage the airway priorities in croup, epiglottitis and bacterial tracheitis; and describe the presentation, staging and treatment of laryngeal carcinoma.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "The anatomy of the larynx — the cartilages, the cricothyroid and posterior cricoarytenoid muscles, and the course of the recurrent laryngeal nerve around the aorta on the left and under the subclavian on the right — because every symptom in this lesson is a lesion of the larynx described anatomically.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Stridor",
        text: "Harsh, noisy respiration caused by obstruction of the airway. Its timing names the site: inspiratory stridor arises in the supraglottis or glottis, expiratory stridor in the intrathoracic trachea and bronchi, and biphasic stridor in the glottis or subglottis, where a fixed lesion obstructs in both phases.",
      },
      {
        type: "paragraph",
        text: "The larynx is an airway first and a voice organ second. Every voice symptom must therefore be assessed for an airway threat before it is assessed for a voice problem, because the mature clinical habit in ENT is to answer the question 'is this patient safe to sit in my waiting room?' before answering 'is this dysphonia?' A child with stridor at rest, a drooling patient who cannot swallow saliva, or a voice change that progresses over weeks are the three situations in which that question must be asked.",
      },

      { type: "heading", level: 2, text: "Assessing the voice" },
      {
        type: "paragraph",
        text: "The assessment begins with the history. Was the onset sudden (a viral illness, intubation, shouting) or gradual over weeks (a tumour, a palsy, a neurological disease)? Is the voice breathy, hoarse or strained, and does it fatigue? Are there risk factors — smoking, alcohol, occupational dust, reflux, previous thyroid or chest surgery? Then flexible transnasal laryngoscopy in the clinic: it is the single most useful investigation in ENT, and it shows the shape of the folds, their movement, and any mass, in the patient's own airway.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Persistent hoarseness of more than three weeks in a smoker is a carcinoma of the larynx until proven otherwise and must be referred urgently. Glottic cancer is the earliest laryngeal cancer to present — because a lesion on the vocal fold alters the voice from its first millimetre — and it is the one with the best prognosis if it is caught there.",
      },

      { type: "heading", level: 2, text: "Acute and chronic laryngitis" },
      {
        type: "paragraph",
        text: "Acute laryngitis follows an upper respiratory infection: the voice becomes hoarse, the throat tickles, and the cough is dry. It is self-limiting over three to seven days and is treated by voice rest, hydration, humidification and the avoidance of smoking, alcohol and whispering — whispering is an abusive use of the larynx, not rest. Antibiotics do not shorten it.",
      },
      {
        type: "paragraph",
        text: "Chronic laryngitis is the consequence of chronic irritation: cigarette smoke, alcohol, laryngopharyngeal reflux, occupational dust, and chronic cough. The voice is rough, low-pitched and tiring. The single most effective intervention is cessation of the irritant, together with reflux management and voice therapy. Reinke's oedema is the descriptive extreme — a diffuse, gelatinous, polypoid swelling of the whole vocal fold in smokers that produces a characteristically low-pitched female voice, and that requires surgical debulking and, above all, cessation of smoking, or it returns.",
      },

      { type: "heading", level: 2, text: "Benign vocal fold lesions" },
      {
        type: "table",
        headers: ["Lesion", "Appearance and cause", "Treatment"],
        rows: [
          ["Vocal nodules", "Bilateral, at the junction of the anterior and middle third of the fold, from voice misuse — teachers, singers, shouting children. Voice therapy is the treatment, not surgery", "Voice therapy; surgery only for a persistent fibrous lesion after therapy has failed"],
          ["Vocal polyp", "Unilateral, often haemorrhagic and glassy, following a single vocal trauma or from smoking; causes hoarseness and a rough voice", "Microsurgical excision, plus reflux and voice treatment"],
          ["Granuloma and contact ulcer", "At the vocal process of the arytenoid, from intubation trauma or from cough and reflux", "Reflux treatment, voice therapy, and removal of the causative irritant; excision alone recurs"],
          ["Recurrent respiratory papillomatosis", "Exophytic wart-like lesions on the folds caused by human papilloma virus 6 and 11, presenting in children with hoarseness, then stridor; recurs at the same site after each removal", "Repeated surgical debulking, and adjuvant antimitotic or antiviral therapy in aggressive disease"],
          ["Cyst, sulcus and web", "A blocked gland, a mucosal groove, or a congenital band between the folds", "Excision or release to restore vibration"],
        ],
      },

      { type: "heading", level: 2, text: "Vocal fold paralysis" },
      {
        type: "paragraph",
        text: "The recurrent laryngeal nerve supplies every intrinsic laryngeal muscle except cricothyroid, and the left recurrent laryngeal nerve has the long course around the aortic arch that makes it vulnerable in both the neck and the chest. Palsy therefore follows thyroid and parathyroid surgery, mediastinal and apical lung tumours, oesophageal surgery, and aortic aneurysm; a large proportion remain idiopathic, and a proportion are viral. The superior laryngeal nerve, which supplies cricothyroid, affects pitch and projection rather than the airway.",
      },
      {
        type: "table",
        headers: ["Feature", "Unilateral recurrent laryngeal nerve palsy", "Bilateral abductor palsy"],
        rows: [
          ["Voice", "Breathy, weak and easily fatigued, improving as the cord moves toward the midline over weeks", "Near normal, but weak"],
          ["Airway", "No compromise", "Inspiratory stridor at rest; a tracheostomy may be required"],
          ["Aspiration", "Little, unless the vagus is involved high in the neck", "Variable"],
          ["Common causes", "Thyroid and chest surgery, apical lung and mediastinal tumours, idiopathic, viral", "Thyroid surgery, trauma, neurological disease"],
          ["Treatment", "Voice therapy; injection medialisation, medialisation thyroplasty or arytenoid adduction if the voice or aspiration is disabling", "Restore the airway first, then the voice; lateralisation procedures with an airway trade-off"],
        ],
      },

      { type: "heading", level: 2, text: "Laryngeal carcinoma" },
      {
        type: "paragraph",
        text: "Over 90 per cent of laryngeal cancer is squamous cell carcinoma, caused by tobacco with alcohol as a multiplicative cofactor, and with a substantial contribution from human papilloma virus in oropharyngeal disease. Two presentations matter, and the difference is the timing of the voice change.",
      },
      {
        type: "table",
        headers: ["", "Glottic carcinoma", "Supraglottic carcinoma"],
        rows: [
          ["First symptom", "Hoarseness — early, because a lesion on the fold immediately disrupts vibration", "Sore throat, odynophagia, referred earache, a mass in the neck — often silent locally until late"],
          ["Lymphatic spread", "Sparse — the glottis is relatively lymphatic-poor, so nodes are late", "Rich — early bilateral cervical node metastasis"],
          ["Presenting stage", "Often T1 or T2", "Often advanced, with nodal disease"],
          ["Treatment", "Radiotherapy or transoral laser microsurgery for early disease, because both preserve the voice; total laryngectomy for advanced or salvage disease", "Often radiotherapy with chemotherapy, with surgery reserved for advanced nodal or residual disease"],
          ["Voice rehabilitation", "Preserved in early disease", "Tracheo-oesophageal puncture with a voice prosthesis, or an electrolarynx"],
        ],
      },
      {
        type: "paragraph",
        text: "The decision between radiotherapy and surgery is not made on survival alone, because early glottic cancer has a similar cure rate by either route; it is made on the voice outcome, the patient's comorbidity, the need for a second treatment later, and the patient's own priorities. A total laryngectomy is a permanent tracheal stoma with an unavoidable loss of the normal voice, which is why early detection, and the referral rule of three weeks of hoarseness in a smoker, matters more than any treatment decision.",
      },

      { type: "heading", level: 2, text: "Stridor: the paediatric airway differential" },
      {
        type: "table",
        headers: ["Diagnosis", "Age and pattern", "Key features", "Airway management"],
        rows: [
          ["Croup (laryngotracheobronchitis)", "6 months to 3 years, insidious onset after coryza, worse at night", "Barking seal-like cough, hoarseness, inspiratory stridor, low-grade fever; the steeple sign of subglottic narrowing on an anteroposterior neck film", "Single dose of oral dexamethasone, nebulised adrenaline for severe stridor with respiratory distress, minimal handling; intubation is rarely needed"],
          ["Acute epiglottitis", "2 to 5 years, abrupt onset over hours", "High fever, toxic, drooling, muffled hot-potato voice, tripod or sniffing posture, no cough, severe throat pain; the thumb sign on lateral film", "An emergency: do NOT examine the throat; secure the airway by intubation in theatre with a surgeon prepared to cut, then intravenous ceftriaxone and blood cultures"],
          ["Bacterial tracheitis", "Any age, after a viral prodrome", "Toxic, high fever, brassy cough, stridor, thick mucopurulent secretions with membrane; unlike croup the child is systemically unwell and there is no drooling", "Airway suction or bronchoscopy to clear the trachea, intubation, intravenous antibiotics"],
          ["Inhaled foreign body", "Any age, sudden onset at a meal", "Witnessed choking or gagging, then unilateral wheeze, reduced air entry, and cough; a vegetable foreign body is not radio-opaque", "Rigid bronchoscopy under anaesthesia; do not delay the theatre for imaging in an obstructed child"],
          ["Peritonsillar abscess", "Adolescents and adults", "Unilateral throat pain, trismus, hot-potato voice and a deviated uvula", "Drainage of the abscess; the airway risk is from the base of tongue and oedema"],
          ["Anaphylaxis and angio-oedema", "Any age", "Wheeze, urticaria, lip and tongue swelling, hypotension, sudden onset", "Intramuscular adrenaline, airway support, and intubation for progression"],
          ["Retropharyngeal abscess", "Children under 5", "Fever, neck stiffness with torticollis, drooling, dysphagia and snoring", "CT with contrast, drainage, and intravenous antibiotics; the airway is at risk"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The discriminator between croup and epiglottitis is the combination of drooling, absence of cough and toxicity. A child who is drooling, cannot swallow saliva and has a muffled voice must not have the throat examined with a spatula — provoking the child completes the airway obstruction. Move the child to theatre with an anaesthetist and an ENT surgeon.",
      },
      {
        type: "paragraph",
        text: "In the acute setting the sequence is: position the child (upright, on the parent's lap, undisturbed), give oxygen by the least intrusive method, avoid forced examination, give nebulised adrenaline for severe stridor while preparing intubation, and give dexamethasone. If intubation fails and the airway cannot be ventilated, the rescue is a surgical airway — needle cricothyroidotomy for the very small child, and a surgical cricothyroidotomy or emergency tracheostomy thereafter.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Examining the throat of a child with suspected epiglottitis. The examination can precipitate complete obstruction; the diagnosis is clinical, and the airway is secured in theatre.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing antibiotics for acute laryngitis, or advising complete silence. Antibiotics do not shorten viral laryngitis, and enforced silence is less useful than easy, quiet voice use.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Operating on vocal nodules. Bilateral nodules are a disorder of voice use, and the first treatment is voice therapy; excising the nodules without changing the technique leaves the cause and the lesion returns.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing three weeks of hoarseness in a 60-year-old smoker to reflux without looking. Refer for flexible laryngoscopy first; carcinoma of the glottis presents with nothing more than hoarseness.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A child has a barking cough, hoarseness and inspiratory stridor that improves on the way to hospital, with a temperature of 37.8 C. What is the diagnosis and the management?",
        answer: "Croup — laryngotracheobronchitis, commonly parainfluenza. Management is a single dose of oral dexamethasone (0.15 to 0.6 mg per kg), nebulised adrenaline if stridor is present at rest or there is respiratory distress, minimal handling, oxygen if saturation falls, and observation for fatigue. Untroubled improvement en route and the absence of drooling and toxicity separate it from epiglottitis, and the child is not subjected to a throat examination.",
        explanation: "Croup is common, self-limiting and treated with steroids and adrenaline for distress; the danger is mistaking the drooling, coughing, toxic child with epiglottitis for croup.",
      },
      {
        type: "question",
        prompt: "Why does a lesion on the vocal fold present early, and which laryngeal cancer presents late?",
        answer: "A glottic lesion disrupts vibration immediately, so hoarseness appears at T1 and is the reason glottic carcinoma has the best laryngeal survival. Supraglottic carcinoma has plenty of room, a silent mucosa and a rich lymphatic drainage, so it presents with nodal metastasis, referred earache or dysphagia at an advanced stage.",
        explanation: "The difference is the timing of the voice change, which is the trigger for referral.",
      },
      {
        type: "question",
        prompt: "What are the actions on finding a unilateral vocal fold palsy, and what are the likely causes?",
        answer: "Confirm the side with flexible laryngoscopy, examine the neck and thyroid, and image the course of the nerve — from the skull base to the aortic arch and the mediastinum, including the thyroid, neck and chest — because the cause may be surgical or neoplastic. The likely causes are thyroid and parathyroid surgery, apical lung and mediastinal tumours, aortic aneurysm, idiopathic cases, and viral neuritis.",
        explanation: "The left recurrent laryngeal nerve runs around the aortic arch, so its territory is neck plus chest plus mediastinum, and a palsy must be traced along that whole course.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 2-year-old has a high fever, drooling saliva, a muffled voice and sits upright in a tripod posture. Which is the most important immediate action?",
        options: [
          "Examine the throat with a spatula to see the exudate",
          "Order an urgent lateral neck radiograph in the radiology department",
          "Transfer to theatre with an anaesthetist and an ENT surgeon for intubation under direct vision, without examining the throat",
          "Give oral antibiotics and discharge with follow-up",
          "Nebulised adrenaline and oral dexamethasone",
        ],
        correctIndex: 2,
        explanation: "This is acute epiglottitis: drooling, fever, a muffled voice and the tripod posture. Examining the throat or sending the child alone to radiology can precipitate complete obstruction; the airway is secured in theatre by an experienced intubator with a surgeon prepared to perform a surgical airway. Radiotherapy-style radiographs are used only when the diagnosis is uncertain and the airway is protected.",
      },
      {
        type: "mcq",
        stem: "A 6-month-old has a barking cough, hoarseness, inspiratory stridor at rest and a temperature of 37.6 C. Which single treatment has the greatest effect on the course?",
        options: [
          "Amoxicillin",
          "Oral dexamethasone",
          "Nebulised salbutamol",
          "Intravenous ceftriaxone",
          "Steam inhalation alone",
        ],
        correctIndex: 1,
        explanation: "Corticosteroids reduce the subglottic oedema of croup and have been shown to improve symptoms within hours; a single dose of oral dexamethasone is standard. Nebulised adrenaline is for severe stridor with respiratory distress, and antibiotics and salbutamol have no role in viral croup.",
      },
      {
        type: "mcq",
        stem: "A 55-year-old smoker has had hoarseness for four weeks, and flexible laryngoscopy shows an exophytic lesion on the anterior third of one vocal fold with normal mobility. Which statement is most accurate?",
        options: [
          "It is most likely a vocal nodule and should be treated with voice therapy",
          "Early glottic carcinoma is treated with radiotherapy or transoral laser microsurgery, both of which can preserve the voice",
          "Total laryngectomy is required for all glottic cancers",
          "It should be observed for a further three months",
          "It is most likely a papilloma",
        ],
        correctIndex: 1,
        explanation: "Hoarseness of more than three weeks in a smoker is a glottic carcinoma until excluded; an early lesion with normal mobility is T1 or T2, and both radiotherapy and transoral laser microsurgery achieve similar cure rates while preserving the larynx.",
      },
      {
        type: "mcq",
        stem: "Which lesion is best treated initially with voice therapy rather than surgery?",
        options: [
          "A unilateral haemorrhagic vocal polyp",
          "Bilateral vocal nodules at the junction of the anterior and middle thirds of the folds",
          "Recurrent respiratory papillomatosis",
          "A juvenile angiofibroma",
          "A glottic carcinoma",
        ],
        correctIndex: 1,
        explanation: "Vocal nodules are the consequence of voice misuse, so the first treatment is voice therapy, which succeeds in most patients; the other lesions are surgical or neoplastic and require removal, not therapy.",
      },
      {
        type: "mcq",
        stem: "A patient who had a thyroidectomy three months ago has a breathy, weak voice and an immobile vocal fold in the paramedian position. Which nerve is affected and what was the most likely cause?",
        options: [
          "The superior laryngeal nerve, injured during division of the superior thyroid vessels",
          "The recurrent laryngeal nerve, injured during thyroid surgery",
          "The vagus nerve at the skull base",
          "The hypoglossal nerve",
          "The glossopharyngeal nerve",
        ],
        correctIndex: 1,
        explanation: "The recurrent laryngeal nerve supplies every intrinsic laryngeal muscle except the cricothyroid, so its injury produces a breathy, weak voice with an immobile paramedian fold; thyroid and parathyroid surgery are the commonest causes, and the left nerve is additionally vulnerable at the aortic arch.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The larynx is an airway first. Stridor names its own site by its timing, and the two paediatric emergencies it must be separated from are croup — treated with dexamethasone and adrenaline, drool-free and low-toxicity — and epiglottitis, where the throat must not be examined and the airway is secured in theatre. Dysphonia is assessed by flexible laryngoscopy, with a three-week rule for hoarseness in smokers, and it is caused by benign lesions (nodules, polyps, granulomas, papilloma) treated by removing the cause, by cord palsy whose nerve must be traced, and by carcinoma whose early glottic form is curable with the voice preserved.",
      },
      {
        type: "paragraph",
        text: "Next: the pharynx and oral cavity — tonsillitis, the peritonsillar abscess, the ulcers that are not aphthous, and the differential of dysphagia.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 6 — Pharynx and oral cavity (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish viral tonsillitis from streptococcal tonsillitis using the clinical features and the Centor score, and name the complications of each; recognise and manage a peritonsillar abscess and a parapharyngeal abscess; recognise infectious mononucleosis and the two treatment avoidances it demands; diagnose the pre-malignant and malignant lesions of the oral cavity; and construct the differential of dysphagia with its red flags.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "The anatomy of the pharynx — Waldeyer's ring of lymphoid tissue and the palatine tonsil's capsule and blood supply — and the microbiology of group A beta-haemolytic streptococcus and Epstein-Barr virus, because the whole lesson is about a small number of organisms in a small space next to an airway.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Waldeyer's ring",
        text: "The ring of lymphoid tissue guarding the entrance to the pharynx: the pharyngeal tonsil (adenoids), the palatine tonsils, the lingual tonsil and the tubal tonsils. Together they sample swallowed and inhaled antigens, and they enlarge in childhood for that reason and regress after puberty.",
      },
      {
        type: "paragraph",
        text: "Tonsillitis is a self-limiting illness in almost everyone who gets it, and ENT earns its place in the curriculum by recognising the exceptions. The exceptions are the patients whose disease escapes the capsule — the peritonsillar abscess, the parapharyngeal abscess, the descending mediastinitis — the patients whose immune response, not the organism, is the danger — rheumatic fever, post-streptococcal glomerulonephritis — and the patient whose persistent unilateral symptom is a carcinoma.",
      },

      { type: "heading", level: 2, text: "Acute tonsillitis" },
      {
        type: "paragraph",
        text: "Most sore throats are viral, and no antibiotic is indicated. Group A beta-haemolytic streptococcus accounts for a minority, but it is the minority that requires treatment because of the risk of rheumatic fever, and it has a recognisable pattern.",
      },
      {
        type: "table",
        headers: ["Feature", "Viral tonsillitis", "Streptococcal tonsillitis"],
        rows: [
          ["Age", "Any age", "Peak between 5 and 15 years"],
          ["Cough, coryza, hoarseness", "Prominent — the giveaway", "Usually absent"],
          ["Fever", "Any", "Often high, with headache and abdominal pain"],
          ["Exudate", "Often patchy, scattered", "On the tonsils with a strawberry tongue and palatal petechiae"],
          ["Cervical nodes", "Glands in the posterior triangle", "Tender, enlarged anterior cervical nodes"],
          ["Course", "Settles in a few days", "Needs penicillin V for ten days to prevent rheumatic fever"],
        ],
      },
      {
        type: "table",
        headers: ["Centor criterion", "McIsaac modification"],
        rows: [
          ["Fever above 38 C", "Age 3 to 14 adds 1 point; 15 to 44 scores 0; 45 and above subtracts 1"],
          ["Tonsillar exudate", "The four clinical criteria are fever, exudate, tender anterior cervical nodes and absence of cough"],
          ["Tender anterior cervical lymphadenopathy", "A score of 3 or 4 supports testing and treatment"],
          ["Absence of cough", "A score of 0 to 2 rarely warrants antibiotics"],
        ],
      },
      {
        type: "paragraph",
        text: "Phenoxymethylpenicillin or amoxicillin for ten days is the standard treatment; a cephalosporin or clindamycin covers penicillin allergy and, in practice, a macrolide is the usual alternative. The point of treating is rheumatic fever — a score-driven decision that balances a small benefit against a large prescription burden. Recurrent tonsillitis is defined for surgical purposes as five or more episodes a year for two years, seven in one year or three a year for three years, if they impair schooling or work.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The complications that a candidate must be able to name are rheumatic fever, post-streptococcal glomerulonephritis, scarlet fever, peritonsillar abscess, and rarely Lemierre syndrome — septic thrombophlebitis of the internal jugular vein with fusobacterial bacteraemia and metastatic infection, which presents with a persisting sore throat, swinging fever, tender neck cord and pulmonary abscesses.",
      },

      { type: "heading", level: 2, text: "Infectious mononucleosis" },
      {
        type: "paragraph",
        text: "Epstein-Barr virus infection in the adolescent presents with an exudative tonsillitis that looks bacterial and is not. The features that give it away are posterior as well as anterior cervical lymphadenopathy, generalised malaise and low-grade fever, palatal petechiae, splenomegaly and jaundice, and a lymphocytosis with atypical cells. Diagnosis is confirmed by a heterophile antibody test (Monospot) or by EBV-specific IgM serology.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Two avoidances define the management of glandular fever. Do not give amoxicillin or ampicillin — a maculopapular rash develops in almost every patient and is not an allergy but is remembered as one. Do not allow contact sports or heavy lifting for four weeks — splenomegaly makes splenic rupture a real cause of death, particularly in a teenager who feels well by day ten.",
      },

      { type: "heading", level: 2, text: "Peritonsillar abscess (quinsy)" },
      {
        type: "paragraph",
        text: "A peritonsillar abscess is pus that has escaped the tonsil capsule into the space between the tonsil and the superior constrictor muscle. It is a collection next to an airway, and the presentation is unmistakable in its late stage.",
      },
      {
        type: "table",
        headers: ["Feature", "Finding"],
        rows: [
          ["Voice", "Muffled, hot-potato, as though there were a mouthful"],
          ["Symptom", "Progressive unilateral throat pain and otalgia, odynophagia, drooling of saliva"],
          ["Examination", "Trismus from the pterygoid spasm, the tonsil pushed downwards and medially, the uvula deviated to the opposite side, and a bulging soft palate"],
          ["Systemic", "Fever and toxicity, often with dehydration from not drinking"],
          ["Management", "Intravenous fluids and analgesia, parenteral antibiotics — amoxicillin-clavulanate, or benzylpenicillin with metronidazole — and needle aspiration or incision and drainage, usually under local or general anaesthesia"],
          ["Follow-up", "Contrast CT if extension is suspected; interval tonsillectomy for recurrent quinsy or recurrent tonsillitis"],
        ],
      },
      {
        type: "paragraph",
        text: "The parapharyngeal abscess is the extension that must not be missed. It presents with trismus that prevents adequate intraoral examination, a medial bulge behind the angle of the mandible, neck swelling with torticollis, and systemic toxicity. Contrast CT defines the space involved, the airway is assessed and secured if compromised, and drainage in theatre with culture-directed intravenous antibiotics is the standard of care.",
      },

      { type: "heading", level: 2, text: "The adenoids" },
      {
        type: "paragraph",
        text: "Adenoidal disease is a paediatric airway and hearing problem. Symptoms are mouth breathing with snoring and hyponasal speech, nasal discharge, obstructive sleep apnoea with witnessed apnoeas and restless sleep, and persistent glue ear from Eustachian tube obstruction. Adenoidectomy is indicated for recurrent acute otitis media with effusion, obstructive sleep apnoea after a proper sleep assessment, recurrent or chronic rhinosinusitis, and epistaxis that has failed other treatment; a bleeding disorder and a cleft palate are the contraindications that matter.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Diphtheria is the diagnosis that has not gone away: a low-grade fever with a dirty grey pseudomembrane on the tonsils that bleeds on removal, a bull neck from cervical lymphadenopathy, and airway obstruction. Treatment is diphtheria antitoxin plus erythromycin or penicillin, and it is an urgent notification and isolation.",
      },

      { type: "heading", level: 2, text: "Ulcers and white lesions" },
      {
        type: "table",
        headers: ["Lesion", "Appearance", "Significance"],
        rows: [
          ["Recurrent aphthous ulcer (minor)", "A superficial grey-based ulcer with an erythematous halo, 3 to 10 mm, healing within two weeks", "Common, painful, benign; topical steroid or chlorhexidine"],
          ["Major aphthous ulcer", "Larger, deeper, heals with scarring, may involve the palate and the pharynx", "Consider Behcet disease, coeliac disease, inflammatory bowel disease, HIV"],
          ["Herpetiform ulceration", "Dozens of pinpoint ulcers", "A variant of aphthous ulceration"],
          ["Traumatic ulcer", "Sited against a sharp tooth, a denture or a restoration", "Remove the cause and review; a traumatic ulcer that does not heal is a carcinoma"],
          ["Lichen planus and lichenoid reaction", "White lacy striae (Wickham's striae), erosions", "Differential includes drug reaction and lupus; biopsy and review"],
          ["Leukoplakia", "A white patch or plaque that cannot be scraped off", "A premalignant lesion; biopsy mandatory"],
          ["Erythroplakia", "A red velvety patch", "Carries a higher malignant potential than leukoplakia and must be biopsied"],
          ["Submucous fibrosis", "Pale, fibrotic mucosa with restricted mouth opening", "Caused by areca and betel quid; a pre-malignant condition with a high risk of carcinoma"],
        ],
      },
      {
        type: "paragraph",
        text: "Oral squamous cell carcinoma arises most often on the lateral border of the tongue, the floor of the mouth and the retromolar region, driven by tobacco and alcohol, and increasingly by human papilloma virus in the oropharynx. It is classically a painless, indurated ulcer with rolled everted edges, but it presents as much by odynophagia, referred earache, trismus from pterygoid invasion, unexplained loosening of teeth, or a neck node as by the ulcer itself. Treatment is surgical excision with reconstruction where feasible, radiotherapy, or a combination with chemotherapy, with the worst outcomes of all the head and neck cancers and a five-year survival that improves only with early detection.",
      },

      { type: "heading", level: 2, text: "Dysphagia" },
      {
        type: "table",
        headers: ["Level", "Pattern", "Differential"],
        rows: [
          ["Oral or pharyngeal (transfer dysphagia)", "Difficulty initiating the swallow, drooling, coughing and nasal regurgitation on swallowing, wet voice, aspiration pneumonia", "Stroke with bulbar or pseudobulbar palsy, Parkinson's disease, motor neurone disease, myasthenia gravis, cranial nerve palsy from skull base tumour, local pharyngeal disease"],
          ["Oesophageal (transit dysphagia)", "Solids sticking behind the sternum, then liquids, with regurgitation and weight loss", "Carcinoma of the oesophagus, peptic stricture, achalasia, diffuse spasm, a Schatzki ring, eosinophilic oesophagitis, mediastinal compression"],
          ["Odynophagia alone", "Pain on swallowing", "Infective oesophagitis — candida, herpes, cytomegalovirus — pill oesophagitis, reflux, malignancy"],
          ["Sensation of a lump without true dysphagia (globus)", "A lump that is not painful, worse on swallowing saliva and absent on eating", "Globus pharyngeus, cricopharyngeal spasm, reflux, and, uncommonly, a pharyngeal mass"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Progressive dysphagia for solids followed by liquids, weight loss, hoarseness or a neck node is a carcinoma until excluded by endoscopy and biopsy. In a smoker or drinker over 40 with these features, urgent imaging of the pharynx, oesophagus and neck replaces any trial of reflux treatment.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Giving amoxicillin to the patient with exudative tonsillitis, fever, posterior cervical nodes and splenomegaly. That is glandular fever, and the antibiotic produces a near-universal maculopapular rash and a false allergy label.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a peritonsillar abscess with antibiotics alone. Drainage, by needle aspiration or incision, is the definitive step; refusing to drain a bulging quinsy leaves a neck-space collection that can obstruct the airway.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reassuring a patient with a three-week non-healing oral ulcer. A traumatic ulcer that does not heal after the cause is removed needs biopsy, because oral carcinoma follows.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing progressive dysphagia with weight loss to reflux in a patient over 40 without endoscopy. Progressive dysphagia for solids then liquids with weight loss is oesophageal carcinoma until excluded.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How does a peritonsillar abscess differ from an uncomplicated tonsillitis on examination, and what is its treatment?",
        answer: "In quinsy the disease is unilateral: the tonsil is pushed downwards and medially, the soft palate bulges above it, the uvula deviates to the opposite side, there is trismus and a hot-potato voice, drooling, and systemic upset. Treatment is intravenous fluid, analgesia and parenteral antibiotics, plus needle aspiration or incision and drainage, with an interval tonsillectomy for recurrence.",
        explanation: "The localising signs are asymmetry — a bulging palate, a deviated uvula and trismus — and the treatment is drainage, not antibiotics alone.",
      },
      {
        type: "question",
        prompt: "Which features distinguish infectious mononucleosis from bacterial tonsillitis, and what two things must be avoided?",
        answer: "It is the clinical context: an adolescent with several weeks of malaise, exudative tonsillitis, posterior as well as anterior cervical lymphadenopathy, splenomegaly, palatal petechiae, jaundice and an atypical lymphocytosis, confirmed by Monospot or EBV serology. Two avoidances: amoxicillin or ampicillin, which produce a maculopapular rash in almost all patients, and contact sport for four weeks because of the risk of splenic rupture.",
        explanation: "The pattern is a prolonged glandular illness rather than an acute exudative one, and management is supportive with strict avoidance of contact sports.",
      },
      {
        type: "question",
        prompt: "What are the red flags in a patient with dysphagia?",
        answer: "Progressive dysphagia moving from solids to liquids, weight loss, hoarseness or a change in the voice, a neck mass, pain radiating to the ear, persistent regurgitation of undigested food, and age over 40 with smoking and alcohol exposure. Any of these mandates urgent endoscopy, imaging and biopsy rather than a therapeutic trial of acid suppression.",
        explanation: "The transition from solids to liquids means a mechanical obstruction that is progressing, and the accompanying weight loss and node make carcinoma the diagnosis to exclude.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 17-year-old has a severe sore throat with exudate, low-grade fever, posterior cervical lymphadenopathy, splenomegaly and a Monospot-positive test. Which action is contraindicated?",
        options: [
          "Paracetamol and fluids",
          "Amoxicillin",
          "Advising no contact sport for four weeks",
          "Throat swab",
          "Rest and hydration",
        ],
        correctIndex: 1,
        explanation: "Amoxicillin in Epstein-Barr virus infection produces a near-universal maculopapular rash and is often mistaken for an allergy; treatment is supportive, and activity restriction protects the enlarged spleen.",
      },
      {
        type: "mcq",
        stem: "An 18-year-old with acute tonsillitis develops progressive unilateral throat pain, trismus, drooling of saliva, a hot-potato voice and a uvula deviated to the left. Which is the definitive treatment?",
        options: [
          "Oral amoxicillin for ten days",
          "Intravenous antibiotics alone with review in 48 hours",
          "Needle aspiration or incision and drainage of the collection with parenteral antibiotics",
          "Immediate tonsillectomy in all cases",
          "A lateral neck radiograph and discharge if normal",
        ],
        correctIndex: 2,
        explanation: "This is a peritonsillar abscess — unilateral pain, trismus, a hot-potato voice and a deviated uvula — and the definitive management is drainage by needle aspiration or incision, with parenteral antibiotics and fluids.",
      },
      {
        type: "mcq",
        stem: "Which combination of features best predicts group A beta-haemolytic streptococcal tonsillitis rather than a viral sore throat?",
        options: [
          "Cough, coryza and hoarseness",
          "Fever, tonsillar exudate, tender anterior cervical nodes and absence of cough",
          "Diarrhoea and abdominal pain",
          "Conjunctival injection and lacrimation",
          "Posterior cervical adenopathy and splenomegaly",
        ],
        correctIndex: 1,
        explanation: "The Centor criteria — fever above 38 C, tonsillar exudate, tender anterior cervical lymphadenopathy and absence of cough — separate streptococcal from viral pharyngitis; posterior adenopathy with splenomegaly is glandular fever.",
      },
      {
        type: "mcq",
        stem: "A 65-year-old smoker has a three-week non-healing indurated ulcer on the lateral border of the tongue with rolled everted edges. What is the most appropriate management?",
        options: [
          "A topical anaesthetic gel and review in two weeks",
          "Incisional biopsy of the ulcer, with cross-sectional imaging of the neck",
          "Extraction of the adjacent sharp tooth and reassurance",
          "Empirical antibiotics for a traumatic ulcer",
          "A topical corticosteroid mouthwash",
        ],
        correctIndex: 1,
        explanation: "An indurated ulcer with rolled everted edges in a smoker is squamous cell carcinoma until excluded by biopsy, and imaging of the neck is part of the staging. Treating it as traumatic or aphthous delays the diagnosis of the most curable head and neck cancer.",
      },
      {
        type: "mcq",
        stem: "A patient reports food sticking behind the sternum, first solids and now liquids, with weight loss. Which sequence is most appropriate?",
        options: [
          "A trial of a proton pump inhibitor for eight weeks",
          "Urgent upper gastrointestinal endoscopy with biopsy, and cross-sectional imaging",
          "Reassurance and antacids",
          "Barium swallow and review in clinic",
          "A swallowing assessment for aspiration only",
        ],
        correctIndex: 1,
        explanation: "Progressive dysphagia for solids then liquids with weight loss in an older patient is a mechanical obstruction, most commonly carcinoma, and requires urgent endoscopy, biopsy and staging; reflux treatment without investigation is the classic error.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Most sore throats are viral and self-limiting; the streptococcal causes are identified by the Centor criteria and treated to prevent rheumatic fever, and glandular fever is identified by the glandular pattern and by two avoidances — amoxicillin and contact sport. The dangerous local events are the escape of infection into the capsule (quinsy) and into the neck spaces, both of which are treated by drainage. In the oral cavity the lesions that matter are the pre-malignant white and red patches and the carcinoma that follows them, and dysphagia that progresses from solids to liquids with weight loss is a carcinoma until excluded.",
      },
      {
        type: "paragraph",
        text: "Next: the deep spaces of the neck and the facial nerve — deep neck infection, congenital neck cysts, and the difference between an upper and a lower motor neurone facial palsy.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 7 — Neck spaces and facial paralysis (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: list the fascial layers of the neck and the deep spaces they define; recognise a deep neck space infection, secure the airway, and name its sources, investigation and treatment; describe the congenital and inflammatory neck cysts and the differential of a neck mass in a child and in an adult; distinguish an upper from a lower motor neurone facial palsy and list the causes of each; and manage Bell's palsy and Ramsay Hunt syndrome, including eye care and the 72-hour steroid window.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "The cervical fascia from gross anatomy — the investing layer, the pretracheal layer, the prevertebral layer and the carotid sheath — and the course of the seventh cranial nerve through the temporal bone and the face, because both are taught as structures first and diagnosed as spaces second.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Deep neck space infection",
        text: "Infection within the potential spaces bounded by the layers of the deep cervical fascia, spreading from a dental, tonsillar or pharyngeal source. These spaces communicate with each other, with the mediastinum through the prevertebral and danger spaces, and with the airway, so the infection is a double threat: suffocation and sepsis.",
      },
      {
        type: "paragraph",
        text: "The fascia of the neck is not an academic exercise. Each layer closes a space, and each space conducts infection in a direction that is determined by its boundaries: the submandibular space elevates the tongue and obstructs the airway; the parapharyngeal space lies against the carotid sheath, so it threatens the great vessels and the lower cranial nerves; the retropharyngeal and danger spaces run downward from the skull base into the mediastinum, so a neck infection that is not drained becomes a mediastinitis.",
      },

      { type: "heading", level: 2, text: "The fascial layers and their spaces" },
      {
        type: "table",
        headers: ["Layer or space", "Boundaries and content", "Clinical consequence"],
        rows: [
          ["Investing fascia", "Surrounds the neck and encloses the sternomastoid and trapezius; attached to the hyoid bone", "Infection is limited above the hyoid unless the layer is breached"],
          ["Carotid sheath", "Contains the carotid artery, the internal jugular vein, the vagus nerve and the ansa cervicalis", "Extension of infection here causes jugular vein thrombosis and, rarely, arterial erosion"],
          ["Pretracheal (middle) fascia", "Invests the thyroid, trachea and oesophagus", "The route of spread of a thyroid or oesophageal infection to the anterior mediastinum"],
          ["Prevertebral fascia", "Covers the prevertebral muscles and extends from the skull base to the coccyx", "Infection behind it may extend the full length of the spine"],
          ["Retropharyngeal space", "Between the buccopharyngeal and alar fascia, from the skull base to the upper thoracic level where the two fuse", "Infection here bulges the posterior pharyngeal wall, causing a sore throat, torticollis, drooling and stridor"],
          ["Danger space", "Between the alar and prevertebral fascia, from the skull base to the posterior mediastinum", "Named for its route: descending necrotising mediastinitis, the most lethal complication"],
          ["Submandibular and sublingual spaces", "The floor of the mouth, bounded by the mylohyoid muscle", "Ludwig's angina: bilateral woody cellulitis that elevates the tongue and obstructs the airway"],
          ["Parapharyngeal space", "The lateral pharyngeal space, from the skull base to the hyoid, containing cranial nerves IX to XII", "Trismus and a medial bulge behind the angle of the mandible; also the route of peritonsillar spread"],
        ],
      },
      {
        type: "paragraph",
        text: "Ludwig's angina deserves its own line. It is a bilateral, rapidly spreading cellulitis of the submandibular, sublingual and submental spaces of dental origin, classically from the lower second and third molars whose roots lie below the mylohyoid. The floor of the mouth becomes hard and elevated, the tongue is pushed up and back, the patient drools and speaks with a muffled voice, and the airway is compromised both by the swelling and by the impossibility of intubation. Treatment is airway first — an awake tracheostomy in theatre is safer than sedation — then incision and drainage, and intravenous ampicillin-sulbactam or clindamycin with metronidazole.",
      },

      { type: "heading", level: 2, text: "Recognising and managing deep neck infection" },
      {
        type: "table",
        headers: ["Element", "What to do"],
        rows: [
          ["Symptoms", "Sore throat, odynophagia, neck swelling and pain, torticollis, drooling, trismus, muffled voice, fever, rigours, reduced intake"],
          ["Signs", "Erythema and fluctuance of the neck, trismus, a bulging posterior or lateral pharyngeal wall, reduced air entry, and the inability to lie flat"],
          ["Airway", "Assess it first. Sit the patient up, avoid supine positioning and avoid sedating an obstructed patient, and call anaesthesia and ENT before it closes"],
          ["Imaging", "Contrast-enhanced CT of the neck defines the spaces, the collections and the relationship to the airway and vessels; ultrasound is useful for simple submandibular collections"],
          ["Source control", "Drainage of the collection and of the dental or tonsillar source, with pus sent for culture"],
          ["Antibiotics", "Broad-spectrum intravenous cover for oral anaerobes, streptococci and staphylococci — co-amoxiclav or a third-generation cephalosporin with metronidazole, adjusted by culture"],
          ["Complications", "Descending necrotising mediastinitis, Lemierre syndrome from jugular thrombophlebitis, internal carotid erosion, airway obstruction, and septic emboli to the lungs"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The neck is never examined in a child with torticollis without thinking of retropharyngeal abscess, and is never drained late. The triad to remember is fever, neck stiffness (refusal to move the neck and to extend) and a bulging posterior pharyngeal wall, and the drain must not be done awake in a struggling child.",
      },

      { type: "heading", level: 2, text: "A neck mass: the differentials by age" },
      {
        type: "paragraph",
        text: "A single question separates paediatric from adult neck lumps: in a child, inflammation and congenital cysts dominate, and malignancy is rare; in an adult over 40, particularly a smoker or drinker, a lateral neck mass is a metastatic squamous cell carcinoma until excluded.",
      },
      {
        type: "table",
        headers: ["Group", "Diagnoses", "Discriminating feature"],
        rows: [
          ["Inflammatory (any age)", "Reactive lymphadenitis, bacterial or viral cervical lymphadenitis, tuberculous lymphadenitis, cat-scratch disease, atypical mycobacteriosis", "Tender, mobile, fever, and a resolving course; tuberculosis gives a cold abscess and a matted mass, often in the posterior triangle"],
          ["Congenital (child)", "Thyroglossal duct cyst — a midline cyst that moves with swallowing and with protrusion of the tongue; branchial cleft cyst — a lateral cyst anterior to the sternomastoid that may discharge through a fistula; cystic hygroma — a posterior triangle lymphangioma that transilluminates", "The embryological site and the behaviour on swallowing and tongue protrusion decide the name"],
          ["Endocrine (any age)", "Thyroid nodule, goitre, thyroid cancer with a neck node", "The lump moves with swallowing and lies in the anterior triangle"],
          ["Salivary (any age)", "Pleomorphic adenoma, salivary malignancy", "The pre-auricular or submandibular site, slow growth, and a stone or pain with eating for the inflammatory forms"],
          ["Metastatic (adult)", "Squamous cell carcinoma metastasis from the pharynx, larynx, oral cavity, nasopharynx or unknown primary", "A hard, painless, fixed mass in the lateral neck, with a smoking and alcohol history and a possible primary mucosal lesion"],
          ["Lymphoma (any age)", "Hodgkin and non-Hodgkin lymphoma", "Rubbery, multiple, firm nodes, often with B symptoms, hepatosplenomegaly, and night sweats"],
        ],
      },
      {
        type: "definition",
        term: "Thyroglossal duct cyst",
        text: "A midline neck cyst arising from the descent of the thyroid from the foramen caecum of the tongue. Its defining features are that it lies at or below the hyoid bone and moves on swallowing and on protrusion of the tongue, and the operation is the Sistrunk procedure: excision of the cyst, the midline portion of the hyoid bone and the tract to the foramen caecum, because leaving the tract invites recurrence and later carcinoma.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The red flags that make a neck node malignant are: it is hard and painless, it is fixed, it exceeds 2 cm, it is in the supraclavicular fossa, it is progressive, and the patient is over 40 with tobacco and alcohol exposure. Any of these makes a full mucosal examination of the upper aerodigestive tract and an image with biopsy or ultrasound-guided fine-needle aspiration mandatory.",
      },

      { type: "heading", level: 2, text: "The facial nerve" },
      {
        type: "paragraph",
        text: "The facial nerve innervates the muscles of facial expression, the stapedius, the posterior belly of digastric and stylohyoid, and it carries taste from the anterior two-thirds of the tongue and secretomotor fibres to the lacrimal, submandibular and sublingual glands. The clinical question is always the same: is the lesion above the facial nucleus (upper motor neurone) or at or below it (lower motor neurone)?",
      },
      {
        type: "table",
        headers: ["", "Upper motor neurone facial palsy", "Lower motor neurone facial palsy"],
        rows: [
          ["Site of the lesion", "Above the facial nucleus in the cortex or its corticonuclear tract", "The nucleus, the nerve in the pons, the cerebellopontine angle, the internal auditory canal, the middle ear, the parotid or the face"],
          ["Pattern", "Contralateral weakness of the lower face only — the forehead is spared", "Ipsilateral weakness of the whole half of the face, including the forehead"],
          ["Reason", "The upper facial muscles receive bilateral cortical innervation; the lower face receives contralateral innervation only", "The nerve supplies the whole half of the face, so every facial muscle is affected"],
          ["Common causes", "Stroke, a hemispheric mass, motor neurone disease (an unusual pseudobulbar pattern is bilateral)", "Bell's palsy, Ramsay Hunt syndrome, otitis media and cholesteatoma, parotid tumour and parotid surgery, temporal bone fracture, Lyme disease, sarcoidosis, acoustic neuroma, and a central lesion of the nucleus or fascicle"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A bilateral facial palsy is not Bell's palsy twice. The causes are Lyme disease, sarcoidosis, Guillain-Barre syndrome with Miller Fisher variant, a pontine event, and Melkersson-Rosenthal syndrome; bilateral weakness requires systemic investigation and not a single-dose assumption.",
      },

      { type: "heading", level: 2, text: "Bell's palsy" },
      {
        type: "paragraph",
        text: "Bell's palsy is an acute, isolated, lower motor neurone facial palsy of unknown cause, probably viral and inflammatory, and it reaches its maximum weakness within 72 hours. Diagnosis is exclusionary: the palsy must be complete or partial, of sudden onset, without vesicle, without parotid mass, without other cranial neuropathies or limb signs, and with an otherwise normal examination.",
      },
      {
        type: "table",
        headers: ["Management", "Detail"],
        rows: [
          ["Systemic corticosteroids", "Prednisolone 60 mg daily for five days, or 25 mg twice daily for ten days, started within 72 hours of onset. It is the only treatment shown to improve the chance of complete recovery and must not be delayed for any other test"],
          ["Antiviral therapy", "Valacyclovir or aciclovir is added when the palsy is complete (House-Brackmann grade V or VI) or severe, on the basis of the suspected viral cause; the evidence is best when combined with steroid"],
          ["Eye care", "Artificial tears hourly by day, lubricating ointment and taping or shielding the eye at night, and urgent ophthalmology referral if the cornea is involved — corneal abrasion and ulceration are the commonest avoidable complications"],
          ["Rehabilitation", "Gentle facial exercises, physiotherapy and biofeedback; electrical stimulation and long-term rest have no role"],
          ["Prognosis", "About 70 per cent recover completely, 85 per cent substantially, with recovery beginning within three weeks; recurrence occurs in about 7 per cent, and incomplete improvement with synkinesis and crocodile tears follows severe degeneration"],
          ["Imaging", "MRI if the palsy is atypical — incomplete, slowly progressive, recurrent, bilateral, accompanied by other cranial nerve signs, or if there is no recovery at three to four months"],
        ],
      },
      {
        type: "paragraph",
        text: "Ramsay Hunt syndrome is herpes zoster of the geniculate ganglion: severe ear pain, vesicles on the pinna and in the external auditory canal and on the palate, and an ipsilateral facial palsy, often with tinnitus, hearing loss and vertigo. It produces a more complete palsy and a worse prognosis than Bell's palsy, and it is treated with a combination of corticosteroid and antiviral therapy. When vesicles are absent the term is zoster sine herpete.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for imaging before starting prednisolone in an acute Bell's palsy. Imaging has no place in the first 72 hours of a classic unilateral acute palsy; the steroid does, and the delay costs the patient recovery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling a forehead-sparing facial weakness a peripheral lesion. If the patient can wrinkle both foreheads, the lesion is above the nucleus and the diagnosis is in the brain and the carotid, not in the parotid and temporal bone.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Sedating a patient with Ludwig's angina or a deep neck abscess and reduced air entry. Sedation, supine positioning and quiet observation of a compromised airway are all dangerous; the airway is assessed and secured by a team that can cut.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Excising a midline thyroglossal cyst without the tract and the hyoid segment, or without imaging the thyroid first. Recurrence follows the retained tract, and an ectopic thyroid may be the only functioning thyroid tissue the patient has.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient can wrinkle both foreheads but cannot smile on the left side. Where is the lesion and what should be examined first?",
        answer: "This is an upper motor neurone facial weakness — sparing of the forehead with contralateral lower-face weakness — so the lesion is above the facial nucleus: hemisphere, internal capsule, or brainstem tract. Examine the limbs and speech, check the blood pressure, and image the brain and carotid territory. The face is not the lesion, and Bell's palsy is excluded.",
        explanation: "The forehead receives bilateral cortical innervation, so sparing localises the lesion to the supranuclear pathway.",
      },
      {
        type: "question",
        prompt: "Why does a deep neck infection threaten the airway and the mediastinum at the same time?",
        answer: "The airway is threatened because the spaces surround it and the floor of the mouth can elevate the tongue — as in Ludwig's angina — so the patient drools and cannot lie flat. The mediastinum is threatened because the retropharyngeal, alar and prevertebral fascial layers form a continuous route from the skull base down to the posterior mediastinum, so infection that is not drained can descend as a necrotising mediastinitis.",
        explanation: "The danger is double: a mechanical obstruction of the airway by the collection, and a vertical conducting route to the chest.",
      },
      {
        type: "question",
        prompt: "What are the three features that distinguish a thyroglossal cyst from a branchial cleft cyst and from a lymph node?",
        answer: "The thyroglossal cyst is midline, moves with swallowing, and — uniquely — moves on protrusion of the tongue because of its tract to the foramen caecum. A branchial cleft cyst lies anterior to the sternomastoid in the upper lateral neck, and may discharge through a skin punctum. A lymph node moves with the surrounding tissues and does not follow the hyoid. Surgical excision of a thyroglossal cyst is Sistrunk's procedure, removing the cyst, the mid-hyoid and the tract.",
        explanation: "Embryology and two bedside movements separate the congenital cysts, and both differ from nodes in their age of onset.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has an acute complete left lower motor neurone facial palsy with a normal ear, normal parotid examination, no other cranial nerve signs, and no vesicles. Which treatment must be started within 72 hours?",
        options: [
          "Aciclovir alone",
          "Prednisolone, begun within 72 hours",
          "MRI before any treatment",
          "Topical antibiotic ear drops",
          "Referral for facial nerve decompression within 48 hours",
        ],
        correctIndex: 1,
        explanation: "Bell's palsy is diagnosed clinically and early systemic corticosteroid improves the rate of complete recovery; imaging is reserved for atypical features, and antivirals are added in severe palsy rather than used alone.",
      },
      {
        type: "mcq",
        stem: "A patient with a left facial palsy has vesicles on the pinna and in the external auditory canal, with pain and loss of taste. What is the diagnosis?",
        options: [
          "Bell's palsy",
          "Ramsay Hunt syndrome from varicella zoster virus in the geniculate ganglion",
          "A parotid tumour",
          "A temporal bone fracture",
          "Acoustic neuroma",
        ],
        correctIndex: 1,
        explanation: "Vesicles on the pinna and in the external canal with an ipsilateral facial palsy, vertigo and loss of taste are herpes zoster of the geniculate ganglion — Ramsay Hunt syndrome — which has a worse prognosis than Bell's palsy and is treated with steroid and antiviral therapy.",
      },
      {
        type: "mcq",
        stem: "Which of the following is an upper motor neurone facial palsy?",
        options: [
          "Paralysis of the whole left half of the forehead, eye and mouth after a parotidectomy",
          "Inability to smile on the right with preserved right forehead wrinkling after a stroke",
          "Complete unilateral weakness with hyperacusis and loss of taste",
          "Weakness with vesicles in the ear canal",
          "Bilateral facial weakness with fever",
        ],
        correctIndex: 1,
        explanation: "Forehead sparing with contralateral lower-face weakness is upper motor neurone by definition: the lower face is unilaterally represented in the cortex, the upper face bilaterally. Post-parotidectomy palsy with hyperacusis and loss of taste is lower motor neurone.",
      },
      {
        type: "mcq",
        stem: "A 5-year-old has fever, torticollis, drooling, and a bulging posterior pharyngeal wall. Which space is infected, and what is the danger?",
        options: [
          "The submandibular space, and the danger is cerebral abscess",
          "The retropharyngeal space, and the danger is airway obstruction and descending mediastinitis",
          "The parotid space, and the danger is salivary fistula",
          "The submental space, and the danger is Ludwig's angina only",
          "The masticator space, and the danger is tooth loss",
        ],
        correctIndex: 1,
        explanation: "A bulging posterior pharyngeal wall with fever and torticollis is a retropharyngeal abscess; the space runs from the skull base into the mediastinum, so the twin dangers are airway obstruction from the collection and descending necrotising mediastinitis.",
      },
      {
        type: "mcq",
        stem: "A 30-year-old woman has a painless midline neck mass below the hyoid bone that moves on swallowing and on tongue protrusion. Which operation is correct?",
        options: [
          "Simple excision of the cyst",
          "Sistrunk's procedure: excision of the cyst, the midline portion of the hyoid bone and the tract",
          "Total thyroidectomy",
          "Excision of the anterior border of the sternomastoid",
          "Aspiration and antibiotics",
        ],
        correctIndex: 1,
        explanation: "The thyroglossal duct cyst moves with swallowing and tongue protrusion because of its tract to the foramen caecum; simple excision leaves the tract and recurs, so the Sistrunk procedure removes the cyst, the mid-hyoid and the tract.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The cervical fascia defines spaces that conduct infection toward the airway and downward into the mediastinum, so a deep neck infection is managed by securing the airway first, imaging the spaces with contrast CT, and draining the collection with its source, and Ludwig's angina is the subset that most threatens the airway. A neck mass is read by age — congenital and inflammatory in the child, metastatic carcinoma in the adult over 40 with red flags of a hard, fixed, supraclavicular node. Facial palsy is separated into upper and lower motor neurone by the forehead, and Bell's palsy is treated with corticosteroid within 72 hours and eye care, with Ramsay Hunt the vesicular variant.",
      },
      {
        type: "paragraph",
        text: "Next: vertigo and audiology — the distinction between peripheral and central dizziness, the Dix-Hallpike manoeuvre, the tuning-fork tests and the audiogram.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 8 — Vertigo and audiological assessment (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define vertigo and separate it from presyncope and disequilibrium; distinguish peripheral from central vertigo using the pattern, the duration and the nystagmus; perform and interpret the Dix-Hallpike manoeuvre and treat benign paroxysmal positional vertigo with the Epley manoeuvre; recognise vestibular neuritis, Meniere's disease and vestibular schwannoma; and interpret pure-tone audiometry, tympanometry and the tuning-fork tests, including the Rinne and Weber results.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (External and middle ear disease) for the anatomy of the cochlea, vestibular apparatus and eighth cranial nerve, and the physiology of the vestibulo-ocular reflex, because every test in this lesson is a test of that reflex or of the cochlear mechanics behind the ear drum.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Vertigo",
        text: "The false sensation of rotation or motion of the patient or of the surroundings. It must be separated from presyncope — lightheadedness and a feeling of impending faint, which is cardiac — from disequilibrium — unsteadiness while walking, which is neurological or musculoskeletal — and from non-specific dizziness, which is often anxiety, anaemia or medication.",
      },
      {
        type: "paragraph",
        text: "Vertigo is a problem of asymmetry: the vestibular system is a pair, and vertigo is the experience of one side signalling more than the other, whatever the cause. The useful questions are therefore about the pattern of the asymmetry — did it come on in seconds or over weeks, how long does an attack last, is it provoked by position, is there hearing loss, are there neurological signs — and the answers point at the ear, the vestibular nerve, or the brainstem.",
      },

      { type: "heading", level: 2, text: "The pattern is the diagnosis" },
      {
        type: "table",
        headers: ["Condition", "Duration and trigger", "Associated features"],
        rows: [
          ["Benign paroxysmal positional vertigo (BPPV)", "Attacks of under 60 seconds, provoked by rolling in bed, looking up or head extension, recurrent over weeks", "No hearing loss, no neurological signs, a positive Dix-Hallpike; the commonest cause of vertigo"],
          ["Vestibular neuritis", "Continuous severe vertigo for days, beginning abruptly after a viral illness, improving over weeks", "Nausea and vomiting, no hearing loss, no other neurological signs, an abnormal head impulse test"],
          ["Meniere's disease", "Attacks lasting 20 minutes to a few hours, unprovoked and recurrent", "Fluctuating unilateral hearing loss, tinnitus, aural fullness; the audiogram shows a low-frequency loss"],
          ["Vestibular schwannoma", "Progressive rather than episodic, over months or years", "Unilateral sensorineural hearing loss with disproportionately poor speech discrimination, tinnitus, imbalance, and eventually facial numbness or weakness"],
          ["Central — brainstem or cerebellar stroke, multiple sclerosis, posterior fossa tumour", "Sudden onset, continuous, with any neurological accompaniment", "Diplopia, dysarthria, dysphagia, limb weakness, ataxia, numbness, or new severe headache; the nystagmus is direction-changing or purely vertical"],
          ["Vestibular migraine", "Minutes to hours, recurrent, in a patient with migraine", "Photophobia, phonophobia, headache; hearing is usually normal"],
        ],
      },
      {
        type: "table",
        headers: ["Feature", "Peripheral vertigo", "Central vertigo"],
        rows: [
          ["Intensity", "Severe — the patient cannot stand or walk", "Milder, the patient can often walk"],
          ["Nausea and vomiting", "Profound", "Variable"],
          ["Nystagmus", "Unidirectional, horizontal with a torsional component, fatigable, has a latency and is suppressed by visual fixation", "Direction-changing on gaze in different directions, purely vertical or torsional, non-fatigable, not suppressed by fixation"],
          ["Hearing", "May be affected (Meniere's, labyrinthitis, schwannoma)", "Usually unaffected, though a large pontine lesion can involve the pathways"],
          ["Other neurological signs", "Absent", "Common — and decisive"],
          ["Head impulse test", "Abnormal — a corrective saccade when the head is turned to the affected side", "Normal — the reflex arc is intact, which is paradoxically the worrying finding"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "HINTS — head impulse, nystagmus, and test of skew — separates a peripheral vestibular crisis from a posterior circulation stroke in the acutely dizzy patient better than an early MRI does. A normal head impulse test, direction-changing nystagmus, or skew deviation means a central cause and urgent imaging, and a patient who cannot walk unaided in an acute vestibular presentation needs the same suspicion.",
      },

      { type: "heading", level: 2, text: "BPPV: the canalith repositioning test and treatment" },
      {
        type: "paragraph",
        text: "BPPV is the commonest cause of vertigo and one of the few conditions in medicine that can be diagnosed and cured in a single consultation. Otoconia displaced from the utricle into the posterior semicircular canal make the canal sensitive to gravity, so a change of head position produces a brief burst of vertigo with a characteristic nystagmus.",
      },
      {
        type: "table",
        headers: ["Step", "Dix-Hallpike manoeuvre (posterior canal)"],
        rows: [
          ["Position", "The patient sits on the couch with the head turned 45 degrees to the side being tested, and is laid supine with the head extended about 20 degrees below the level of the couch"],
          ["Positive finding", "After a latency of two to ten seconds, a burst of upbeating and torsional nystagmus beating toward the dependent ear, with vertigo, lasting under a minute, fatiguing and reversing when the patient sits up"],
          ["Interpretation", "The affected ear is the one that is down. If nothing happens after 30 seconds of observation, test the other side"],
          ["Treatment — Epley manoeuvre", "From the positive position, rotate the head 90 degrees to the opposite side, then roll the patient onto that side with the head turned a further 45 degrees so that the nose points downward; hold each position 30 to 60 seconds until the nystagmus stops; then sit the patient up. Repeat until no nystagmus occurs"],
          ["Alternative", "Semont liberatory manoeuvre, or Brandt-Daroff exercises for home use"],
        ],
      },
      {
        type: "paragraph",
        text: "Vestibular sedatives do not treat BPPV: prochlorperazine helps the vomiting of any vertigo but long-term use delays the central compensation that actually resolves the dizziness. A canalith repositioning manoeuvre treats 80 per cent of patients in one to three applications, and a horizontal-canal variant exists with a different nystagmus pattern, needing the roll test rather than the Dix-Hallpike.",
      },

      { type: "heading", level: 2, text: "Vestibular neuritis" },
      {
        type: "paragraph",
        text: "Vestibular neuritis is a sudden unilateral vestibular deficit, usually after a viral illness, producing severe continuous vertigo with nausea, a horizontal-torsional nystagmus beating away from the affected ear, and no hearing loss and no other neurological signs. The head impulse test is the discriminator: turning the head to the affected side produces a corrective catch-up saccade, because the vestibulo-ocular reflex has failed on that side alone. Treatment is reassurance, a short course of an antiemetic, and early vestibular rehabilitation; corticosteroids improve the outcome in some patients, and the dizziness settles over weeks as the brain compensates.",
      },

      { type: "heading", level: 2, text: "Meniere's disease" },
      {
        type: "definition",
        term: "Meniere's disease",
        text: "Episodic vertigo lasting 20 minutes to several hours, with fluctuating unilateral hearing loss, tinnitus and aural fullness, caused by endolymphatic hydrops of the labyrinth. The diagnostic criteria require audiometrically confirmed hearing loss and the exclusion of other causes.",
      },
      {
        type: "table",
        headers: ["Aspect", "Meniere's disease"],
        rows: [
          ["Episodes", "Recurrent, spontaneous, 20 minutes to 12 hours, often with warning fullness in the ear"],
          ["Audiometry", "Low-frequency sensorineural loss early, flattening over time; recruitment and poor speech discrimination in the affected ear"],
          ["Investigations", "Pure-tone audiogram during and between attacks; MRI to exclude a retrocochlear lesion; glycaemic and autoimmune screening where indicated"],
          ["Medical treatment", "Low-salt diet, caffeine and nicotine avoidance, betahistine, a thiazide diuretic, and a short course of a vestibular sedative for the acute attack only"],
          ["Procedural treatment", "Intratympanic gentamicin or dexamethasone, endolymphatic sac decompression or vestibular nerve section for refractory vertigo; the disease becomes bilateral in a proportion, which is the reason to be conservative"],
          ["Counselling", "The vertigo is treatable, the hearing loss is progressive, and the patient must know to sit or lie immediately when an attack begins to avoid falls"],
        ],
      },

      { type: "heading", level: 2, text: "Audiological assessment" },
      {
        type: "paragraph",
        text: "Audiology is not a laboratory afterthought; the tuning-fork tests at the bedside localise a deafness before any machine is used, and the audiogram confirms it. Hearing loss is classified by whether air conduction or bone conduction is worse, and the difference between them — the air-bone gap — is the part that middle-ear surgery can close.",
      },
      {
        type: "table",
        headers: ["Test", "How it is done", "What it means"],
        rows: [
          ["Rinne test", "A vibrating 512 Hz fork is placed on the mastoid, then beside the ear canal; the patient reports which is louder", "Rinne positive — air conduction greater than bone conduction — is normal or sensorineural loss; Rinne negative — bone conduction greater than air conduction — indicates a conductive loss of at least 20 to 30 dB"],
          ["Weber test", "The vibrating fork is placed on the vertex of the skull", "The sound lateralises to the ear with a conductive loss and to the better ear in sensorineural loss; it is the fastest bedside discriminator"],
          ["Absolute bone conduction", "The fork on the mastoid compared with the examiner's own bone conduction", "Shortened bone conduction indicates sensorineural loss, which the Rinne cannot distinguish from normal"],
          ["Pure-tone audiometry", "Air conduction through headphones and bone conduction through a mastoid vibrator, at octave frequencies from 250 Hz to 8 kHz", "An air-bone gap means conductive deafness; no gap with raised thresholds means sensorineural; a mixed pattern has both components"],
          ["Speech audiometry", "Speech discrimination and speech reception thresholds", "Disproportionately poor discrimination for the degree of pure-tone loss suggests a retrocochlear lesion such as a vestibular schwannoma"],
          ["Tympanometry", "Probe in the ear canal measures compliance of the drum as canal pressure is varied", "Type A is normal; type As (a shallow peak) suggests otosclerosis; type Ad (a deep peak) suggests ossicular discontinuity; type B (a flat trace) means effusion or perforation; type C (negative middle-ear pressure) means Eustachian tube dysfunction"],
          ["Acoustic reflex", "Loud sound contracts the stapedius, raising the eardrum compliance", "An absent or elevated reflex threshold localises a lesion to the cochlea, the eighth nerve, or the middle ear"],
          ["Otoacoustic emissions", "Sounds produced by the outer hair cells, recorded from the canal", "Their absence indicates cochlear (outer hair cell) dysfunction, and they are used in newborn screening"],
          ["Auditory brainstem response", "Electrodes record the far-field responses to click stimuli", "An ABR is used in newborn screening, diagnoses retrocochlear pathology, and provides objective threshold estimation"],
          ["Vestibular testing", "Videonystagmography with caloric stimulation, videonystagmography with a rotary chair, video head impulse testing and vestibular evoked myogenic potentials", "A canal paresis on caloric testing localises a weak labyrinth or nerve; VEMPs test individual otolith organs"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Two referral rules follow from all of the above. A unilateral or asymmetric sensorineural hearing loss needs MRI of the internal auditory meatus to exclude a vestibular schwannoma. And a sudden sensorineural hearing loss of 30 dB or more over three contiguous frequencies within 72 hours is an ENT emergency, treated with oral corticosteroids within two weeks — the earlier the treatment, the better the chance of recovery.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Leaving a patient with dizziness on prochlorperazine for weeks. Vestibular sedatives delay central compensation and produce a fixed disability; they are for the vomiting phase of an acute peripheral vertigo, not for BPPV and not for chronic dizziness.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a cerebellar infarction in an acutely vertiginous patient because there was nystagmus. Nystagmus does not make vertigo peripheral; look for the head-impulse test, direction-changing nystagmus, skew deviation and the inability to walk.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Aborting a positive Dix-Hallpike before the nystagmus has developed. The manoeuvre needs a fixed position, a watchful eye and patience, because the latency is up to ten seconds and the response is under a minute.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Interpreting a Rinne test without the Weber test in a patient with severe unilateral deafness. In a profoundly deaf ear the patient hears the fork on the mastoid of the good ear and reports a false negative; the Weber and masking resolve the confusion.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do BPPV, vestibular neuritis and Meniere's disease differ in the duration of an attack and in the hearing?",
        answer: "BPPV causes attacks of under a minute, provoked by a change of head position, with normal hearing. Vestibular neuritis causes continuous vertigo for days after a viral illness, with no hearing loss. Meniere's disease causes attacks of 20 minutes to a few hours, unprovoked, with fluctuating unilateral hearing loss, tinnitus and aural fullness.",
        explanation: "Duration, provocation and hearing separate the three commonest causes of vertigo at the bedside.",
      },
      {
        type: "question",
        prompt: "A patient has a unilateral sensorineural hearing loss and tinnitus, and the Rinne test is positive and the Weber lateralises to the good ear. What does this mean and what is the next investigation?",
        answer: "A positive Rinne with the Weber lateralising to the better ear is a sensorineural loss on the affected side, not a conductive one. A unilateral sensorineural loss with tinnitus needs MRI of the internal auditory meatus to exclude a vestibular schwannoma, together with speech audiometry, which shows disproportionately poor discrimination in that condition.",
        explanation: "Asymmetry is the key: a unilateral or asymmetric sensorineural loss is a retrocochlear lesion until imaging proves otherwise.",
      },
      {
        type: "question",
        prompt: "What is the Epley manoeuvre and what does it treat?",
        answer: "It is the canalith repositioning manoeuvre for posterior canal BPPV. From the position that produced vertigo on the Dix-Hallpike, the head is turned 90 degrees to the opposite side, the patient is rolled onto that side with the head angled further so that the nose points downwards, and each position is held until the vertigo and nystagmus stop; then the patient sits up. Gravity moves the displaced otoconia out of the canal back into the vestibule, relieving the vertigo.",
        explanation: "BPPV is a mechanical disease of displaced otoconia, so a mechanical repositioning manoeuvre cures it — which is why sedatives do not.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has attacks of disabling vertigo lasting about 30 seconds, brought on by rolling over in bed and by looking up, with no hearing loss and no neurological signs. Which is the correct treatment?",
        options: [
          "Long-term prochlorperazine three times daily",
          "The Epley canalith repositioning manoeuvre",
          "Oral betahistine and a low-salt diet",
          "MRI of the internal auditory meatus",
          "Intratympanic gentamicin",
        ],
        correctIndex: 1,
        explanation: "This is posterior canal BPPV — short attacks, positional triggers, normal hearing and neuro examination — and the canalith repositioning manoeuvre cures it in most patients within a few treatments. Betahistine and gentamicin treat Meniere's disease, and long-term sedation prevents compensation.",
      },
      {
        type: "mcq",
        stem: "A 60-year-old has acute continuous vertigo lasting three days after a viral illness, with nausea, a normal ear examination, normal hearing and no neurological signs. Which finding is most characteristic?",
        options: [
          "A positive Dix-Hallpike with upbeating torsional nystagmus",
          "An abnormal head impulse test with a corrective saccade on turning the head to the affected side",
          "Direction-changing vertical nystagmus on lateral gaze",
          "A positive skew deviation",
          "A fluctuating low-frequency audiometric loss",
        ],
        correctIndex: 1,
        explanation: "This is vestibular neuritis: acute, prolonged, peripheral vertigo after a viral illness with an abnormal head impulse test and a unidirectional horizontal-torsional nystagmus. Direction-changing vertical nystagmus and skew deviation indicate a central lesion, and a positive Dix-Hallpike is BPPV.",
      },
      {
        type: "mcq",
        stem: "A patient has a flat tympanogram (type B). Which of the following is the most likely explanation?",
        options: [
          "Otosclerosis",
          "Ossicular discontinuity",
          "A middle-ear effusion or a perforated tympanic membrane",
          "Eustachian tube dysfunction with negative middle-ear pressure",
          "A normal ear",
        ],
        correctIndex: 2,
        explanation: "A type B tympanogram is flat because the drum cannot move: the common causes are middle-ear effusion and a perforation. Type As suggests otosclerosis, type Ad ossicular discontinuity, and type C negative middle-ear pressure.",
      },
      {
        type: "mcq",
        stem: "A 45-year-old has a left unilateral sensorineural hearing loss, left tinnitus, and disproportionately poor speech discrimination. What is the most appropriate next investigation?",
        options: [
          "Repeat pure-tone audiometry in three months",
          "MRI of the internal auditory meatus",
          "Repeat tympanometry",
          "A caloric test",
          "Prescribe a hearing aid",
        ],
        correctIndex: 1,
        explanation: "A unilateral sensorineural loss with tinnitus and disproportionately poor speech discrimination is the classic presentation of a vestibular schwannoma, and the investigation is MRI of the internal auditory meatus. A hearing aid does not treat the underlying lesion.",
      },
      {
        type: "mcq",
        stem: "A 50-year-old presents with sudden loss of hearing in one ear developed over 24 hours. Which management is correct?",
        options: [
          "Watch and wait for six weeks, then consider a hearing aid",
          "Urgent ENT referral and oral corticosteroids within two weeks, followed by MRI of the internal auditory meatus",
          "Antibiotics and nasal decongestant spray",
          "Intratympanic gentamicin",
          "Bed rest with vestibular sedatives",
        ],
        correctIndex: 1,
        explanation: "A sudden sensorineural hearing loss of 30 dB or more over three contiguous frequencies within 72 hours is an emergency; systemic corticosteroids within two weeks give the best chance of recovery, and MRI excludes a retrocochlear cause. Antibiotics treat infection, not cochlear injury.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Vertigo is vestibular asymmetry read through a pattern: BPPV is a brief positional vertigo cured by the Epley manoeuvre, vestibular neuritis is prolonged post-viral vertigo with an abnormal head impulse test, Meniere's is a 20-minute-to-hours attack with fluctuating hearing loss and fullness, and the central causes declare themselves with neurological signs, direction-changing nystagmus and a normal head impulse. Audiology localises and quantifies: the tuning forks at the bedside and the audiogram, tympanogram and speech discrimination in the clinic, with unilateral sensorineural loss and sudden deafness the two findings that must never wait.",
      },
      {
        type: "paragraph",
        text: "Next: the emergencies — foreign bodies, trauma, the acute airways, and the plain films, CT and MRI that answer them.",
      },
    ],
  };
}
// ---------------------------------------------------------------------------
// LESSON 9 — ENT emergencies and radiology (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: manage a choking child and an inhaled foreign body, including the age boundaries for back blows, chest thrusts and abdominal thrusts; manage aural and nasal foreign bodies and recognise which are same-hour emergencies; recognise and treat septal haematoma, nasal fracture, tympanic membrane perforation and temporal bone fracture; and select the correct radiology for each ENT emergency — the plain films, the CT of the temporal bone and sinuses, and the uses of MRI and ultrasound.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 to 8 of this course, in particular the airway differential from Lesson 5 (croup and epiglottitis) and the deep neck spaces from Lesson 7, because ENT emergencies are airway emergencies first and radiology is chosen by the structure that is threatened.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Choking",
        text: "Mechanical obstruction of the airway by an inhaled object, producing an ineffective cough in the obstructed stage. A patient who is coughing effectively is not yet choked: intervention is indicated only when the cough becomes ineffective, or when the patient cannot speak, breathe or cry.",
      },
      {
        type: "paragraph",
        text: "The acquired foreign body is the commonest accidental killer of children under three, and it is the one foreign body disaster that is managed at the supermarket, in the park and in the waiting room rather than in theatre. The second theme of the lesson is that the commonest nose and ear emergencies — a bead, a bean, a button battery — are often misdiagnosed for weeks because the child is brought for discharge or bad smell. The third is that radiology is used deliberately: the plain film that rules out a radio-opaque object, the CT that defines bone and air, and the MRI that defines soft tissue and the eighth nerve.",
      },

      { type: "heading", level: 2, text: "The inhaled foreign body" },
      {
        type: "table",
        headers: ["Stage", "Recognition", "Action"],
        rows: [
          ["Effective cough", "The child coughs loudly, cries or speaks, and can breathe", "Do nothing but encourage the cough; every foreign body extracted with a blind finger sweep is a foreign body driven deeper"],
          ["Ineffective cough", "Quiet or silent, unable to cry or speak, cyanosis, decreasing consciousness", "Call for help, then the age-specific sequence below"],
          ["Aphonia", "No response", "Begin paediatric basic life support"],
        ],
      },
      {
        type: "table",
        headers: ["Age", "Manoeuvre", "Detail"],
        rows: [
          ["Infant under 1 year", "Five back blows alternating with five chest thrusts", "Lay the baby face down along the rescuer's forearm along the leg, supporting the head; deliver five firm blows between the scapulae with the heel of the hand; turn the baby face up and give five chest thrusts with two fingers on the lower sternum; alternate five and five"],
          ["Child over 1 year and adult", "Abdominal thrusts (Heimlich manoeuvre) after back blows", "Stand behind, place a fist below the xiphisternum, grasp it with the other hand, and pull sharply inwards and upwards up to five times"],
          ["Remains obstructed", "Paediatric basic life support with airway opening, rescue breaths, and reassessment between cycles", "Do not abandon the manoeuvres while there is any response"],
          ["Definitive treatment", "Rigid bronchoscopy under general anaesthesia", "Indicated for a witnessed aspiration, unilateral decreased air entry, a unilateral wheeze, or a persistent unexplained pneumonia; do not delay theatre for a radiograph in an obstructed child"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Peanuts are the classic inhaled object and the worst one. Vegetable matter is not radio-opaque on plain film, it swells in the warm humid bronchial tree, and it produces a valvular obstruction that lets air out poorly — air trapping, atelectasis, then pneumonia days to weeks later. A denied history is common: a normal chest radiograph does not exclude a foreign body, and bronchoscopy is decided clinically.",
      },
      {
        type: "example",
        text: "A 2-year-old suddenly chokes and turns blue while eating a bowl of peanuts at a family meal, then develops a persistent cough with a wheeze. The chest radiograph is reported normal and the child is sent home. Ten days later he is brought back with a fever and a right-sided wheeze, and a plain film now shows hyperinflation of the right hemithorax with mediastinal shift to the left and a segmental opacity. At bronchoscopy a fragment of peanut is found and removed. The lesson is that plain films are normal in most vegetable foreign bodies and history plus examination take priority, and that a delay of weeks leaves a distal pneumonia that can become a destructive process requiring surgery.",
      },

      { type: "heading", level: 2, text: "Foreign bodies in the nose and ear" },
      {
        type: "table",
        headers: ["Situation", "Recognition", "Management"],
        rows: [
          ["Nasal foreign body", "Unilateral purulent and offensive discharge in a small child, often for weeks, with no systemic upset; sometimes a visible mass on inspection", "Remove under direct vision with a hook or a wire curette passed beyond the object; do NOT push it posteriorly with forceps or a swab. Techniques that avoid instrumentation include a parent blowing into the mouth while occluding the clear nostril. Button batteries are an emergency"],
          ["Button battery in the nose", "Discharge and epistaxis, occasionally blackened mucosa, and a history of ingestion or insertion", "Immediate removal. The battery discharges current, produces hydroxide in the wet mucosa, and can perforate the septum within hours; treat as a same-hour ENT emergency with imaging and irrigation of the site"],
          ["Aural foreign body", "A child puts beads, paper, seeds or a small battery in the ear; adults get insects or cotton-wool", "Remove with a probe or a hook under direct vision or under the operating microscope; syringing is acceptable in an intact, uninstrumented ear with an immobile object. Live insects are killed first with oil or chloroform, then removed"],
          ["Button battery in the ear", "Pain, discharge, bleeding in an infant with a small object", "Same-hour removal; do not irrigate, because the current continues until the battery is out and the risk of perforation is high"],
        ],
      },
      {
        type: "paragraph",
        text: "Repeat presentations should raise the question of an underlying diagnosis: adolescents with repeated foreign body insertion may have anxiety or self-harm, children with recurrent insertion sometimes have an otitis or a habit, and a retained cotton-wool plug with a discharge may be a perichondritis if it followed ear piercing, particularly in diabetic and immunosuppressed patients, which requires treatment with an antipseudomonal quinolone.",
      },

      { type: "heading", level: 2, text: "Trauma" },
      {
        type: "table",
        headers: ["Injury", "Recognition", "Management"],
        rows: [
          ["Nasal fracture", "Deviated or depressed nose with epistaxis and swelling after a blow; Check the septum and for a septal haematoma", "Reduce and manipulate within 14 days in an adult and within 7 days in a child; analgesia and ice, and protection. Plain films are not routinely required because a clinically normal radiograph does not exclude a fracture and a fracture without displacement needs no operation"],
          ["Septal haematoma", "A boggy, fluctuant dark swelling of the septum after nasal trauma with progressive nasal obstruction", "Emergency incision and drainage with antibiotics, or the cartilage loses its perichondrium, collapses and leaves a saddle deformity. Untreated it may become a septal abscess"],
          ["Auricular haematoma", "A swollen, tender bruise of the pinna in a contact-sport player", "Aspiration or drainage with a pressure dressing and antibiotics, to prevent a cauliflower ear from cartilage necrosis"],
          ["Tympanic membrane perforation and barotrauma", "Pain, bleeding, hearing loss, sometimes vertigo, after a blow, a cotton-bud, a slap, or a pressure change on a dive or flight", "Keep the canal dry, do not put drops in, avoid swimming and blowing; most heal in four to eight weeks, and a persistent perforation is repaired by myringoplasty or tympanoplasty. If there is profuse vertigo and sensorineural loss, think a perilymph fistula"],
          ["Longitudinal temporal bone fracture", "Bleeding from a canal laceration, conductive deafness, deafness from ossicular disruption, facial palsy in a fifth", "CT of the temporal bone; the fracture runs parallel to the petrous ridge and the facial nerve is involved in a minority"],
          ["Transverse temporal bone fracture", "Profound sensorineural hearing loss, vertigo, facial palsy in up to half, and cerebrospinal fluid otorrhoea", "CT of the temporal bone; the fracture crosses the internal auditory canal and the facial canal"],
          ["Penetrating neck injury", "An expanding haematoma, airway compromise, bruits and thrill, neurological deficit", "Airway secure first, then either CT angiography or direct theatre exploration depending on the zone of injury and the stability of the patient"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Emotional as well as physical trauma presents to ENT. The child with a nasal fracture in whom the history does not fit, the adult with a recurrent pinna haematoma, and the patient with unexplained burns of the lips and mouth from a battery are three presentations in which the safeguarding referral is the most important intervention of the visit.",
      },

      { type: "heading", level: 2, text: "Choosing the radiology" },
      {
        type: "table",
        headers: ["Question", "Investigation", "What it shows"],
        rows: [
          ["Is a coin or a battery in the child's airway or oesophagus?", "Plain radiograph — chest, abdomen, and a lateral soft tissue neck film", "Radio-opaque foreign bodies: coins in the trachea appear edge-on in the anteroposterior view, coins in the oesophagus lie flat; battery ingestion is a same-hour emergency"],
          ["Is this croup or epiglottitis?", "Lateral soft tissue neck radiograph, when the diagnosis is uncertain and the airway is protected", "Croup shows the steeple sign of subglottic narrowing on the anteroposterior view; epiglottitis shows the thumb sign of a swollen epiglottis with prevertebral widening"],
          ["Is there a temporal bone fracture or cholesteatoma?", "CT of the temporal bone with thin slices", "Fracture lines and their relation to the facial canal, ossicular disruption, erosion of the lateral semicircular canal and tegmen by cholesteatoma, and mastoiditis with destruction of the bony septa"],
          ["Is there a chronic rhinosinusitis or its orbital complication?", "CT of the paranasal sinuses without contrast (disease) or with contrast (complications)", "Mucosal thickening, polyps, obstruction of the ostiomeatal complex, dehiscence, and orbital abscess; CT is not indicated in uncomplicated acute disease"],
          ["Is there a deep neck abscess?", "Contrast-enhanced CT of the neck", "Loculated collections, gas, the neck spaces involved, the relationship to the airway and vessels, and the source — a tooth or a tonsil"],
          ["Is there a vestibular schwannoma?", "MRI of the internal auditory meatus with gadolinium", "A small enhancing intracanalicular tumour; MRI is also the test for the intracranial spread of ear and sinus infection"],
          ["Is the thyroid, parotid or a neck node abnormal?", "Ultrasound with fine needle aspiration", "Cystic and solid components of a thyroid nodule, and cytology from a lymph node or a salivary mass, which directs the operation and avoids the open biopsy trap in a salivary tumour"],
          ["Is there facial or nasoethmoidal trauma?", "CT of the facial bones", "Fracture lines of the maxilla, zygoma, nasoethmoid and frontal sinuses"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Radiation matters in the paediatric population, and the ENT radiology habit of using CT for any acute airway question has been tempered. A child with a classic croup history needs no film at all, and a child with a classic inhaled foreign body history needs a bronchoscopy, not a radiograph. CT is reserved for the trauma, the refractory disease, the suspected cholesteatoma, and the intracranial complication.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Blind finger sweeps in a choking child. Never place a finger unless a foreign body is clearly visible, and never invert a conscious child to dislodge an object; both convert a partial obstruction into a complete one.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ignoring a button battery. A battery in the nose or the ear is a same-hour emergency, and one in the oesophagus is an emergency endoscopy regardless of symptoms — the mucosal burn is a chemical injury measured in minutes.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a septal haematoma because the nose looks like a simple fracture. Palpate the septum in every nasal trauma, and drain any boggy fluctuant swelling.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ordering CT as the first test for a convincing foreign body history in a child. A witnessed aspiration with unilateral decreased air entry goes to bronchoscopy; CT adds radiation and delay, and the commonest inhaled objects are radiolucent anyway.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A toddler with a witnessed choking episode now has a quiet cough, is cyanosed and cannot cry. What do you do, and in what order?",
        answer: "This is an ineffective cough, so call for help, open the airway, and give five back blows with the baby face down along the forearm, then five chest thrusts for an infant under one year, or five abdominal thrusts for a child over one. Re-check the mouth between cycles and remove a visible body only if you can see it; continue with rescue breaths if the baby becomes unresponsive, and take the child to a centre capable of rigid bronchoscopy.",
        explanation: "Sequences are age-specific — chest thrusts and back blows under one year, abdominal thrusts above it — and a blind finger sweep is contraindicated.",
      },
      {
        type: "question",
        prompt: "A 5-year-old is brought with a three-week unilateral offensive nasal discharge and no fever. What is the most likely diagnosis and the safest removal technique?",
        answer: "A retained nasal foreign body. The safest technique is removal under direct vision with a hook or a wire curette passed beyond the object so that it is pulled out along the floor of the nose, never pushed posteriorly with forceps or a swab; irrigation or positive-pressure techniques are acceptable alternatives, and imaging is reserved for a suspected button battery.",
        explanation: "The unilateral, foul, chronic discharge is the classic story, and posterior displacement risks aspiration into the airway.",
      },
      {
        type: "question",
        prompt: "Which radiological test answers which question in each of: suspected cholesteatoma, suspected deep neck abscess, suspected vestibular schwannoma, and suspected inhaled peanut?",
        answer: "Thin-section CT of the temporal bone for a cholesteatoma; contrast-enhanced CT of the neck for a deep neck abscess; gadolinium MRI of the internal auditory meatus for a vestibular schwannoma. For an inhaled peanut there is no useful radiograph: vegetable matter is radiolucent, so the investigation is bronchoscopy, decided on the history and the unilateral signs.",
        explanation: "The test follows the tissue that is threatened: bone to CT, soft tissue and nerves to MRI, and the radiolucent foreign body to direct visualisation.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 9-month-old infant is brought with sudden choking while eating a grape. The infant now cannot cry or cough and is turning blue. What is the first action?",
        options: [
          "Blind finger sweep of the mouth",
          "Five back blows followed by five chest thrusts",
          "Five abdominal thrusts",
          "Attempt cardiopulmonary resuscitation with rescue breaths first",
          "Hold the baby upside down and shake",
        ],
        correctIndex: 1,
        explanation: "An infant with an ineffective cough needs five back blows and then five chest thrusts, repeated in alternating cycles; abdominal thrusts are for a child over one year, a blind finger sweep is contraindicated, and inversion risks complete obstruction.",
      },
      {
        type: "mcq",
        stem: "A 3-year-old has foul-smelling unilateral nasal discharge for three weeks with no fever. What is the most likely diagnosis and the safest removal technique?",
        options: [
          "Viral rhinosinusitis; reassurance",
          "A retained nasal foreign body; remove under direct vision with a hook, never pushing it posteriorly",
          "Allergic rhinitis; a corticosteroid nasal spray",
          "Nasal polyposis; surgical polypectomy",
          "Acute otitis media; antibiotics",
        ],
        correctIndex: 1,
        explanation: "Unilateral offensive discharge in a small child is a retained foreign body until proven otherwise, and the object is removed under direct vision with a hook or a probe, avoiding posterior displacement into the airway.",
      },
      {
        type: "mcq",
        stem: "A patient is brought with a boggy, fluctuant, dark swelling of the nasal septum three days after a nasal injury, with progressive obstruction. What is the management?",
        options: [
          "Antibiotics and observation for two weeks",
          "Incision and drainage with antibiotics, to prevent cartilage necrosis and a saddle deformity",
          "Radiographs and discharge if negative",
          "Nasal packing alone",
          "Reduction of the fracture only",
        ],
        correctIndex: 1,
        explanation: "This is a septal haematoma: pressure between the cartilage and its perichondrium causes ischaemic necrosis, collapse and a saddle deformity, so it must be incised and drained urgently with culture and antibiotics.",
      },
      {
        type: "mcq",
        stem: "Which investigation is most appropriate for a patient with suspected cholesteatoma and chronic ear discharge?",
        options: [
          "Plain radiograph of the skull",
          "Thin-section CT of the temporal bone",
          "MRI of the internal auditory meatus",
          "Ultrasound of the parotid",
          "CT of the sinuses",
        ],
        correctIndex: 1,
        explanation: "CT of the temporal bone shows the erosion of bone that defines cholesteatoma — loss of the incus and stapes, erosion of the lateral semicircular canal, the tegmen and the facial canal — and both MRI and CT are used when intracranial extension is suspected.",
      },
      {
        type: "mcq",
        stem: "Which statement about a.child with a witnessed inhaled peanut is correct?",
        options: [
          "A normal chest radiograph excludes an inhaled foreign body",
          "Vegetable foreign bodies are radiolucent, so bronchoscopy is decided on the history and examination",
          "The child should wait for a chest CT before bronchoscopy",
          "Epistaxis first aid is indicated",
          "The peanut will dissolve and no treatment is needed",
        ],
        correctIndex: 1,
        explanation: "Peanuts and other vegetable matter are not radio-opaque, a normal film does not exclude one, and the decision for rigid bronchoscopy is clinical, based on the witnessed aspiration and the unilateral signs. Plain films are useful only for radio-opaque objects such as coins or batteries.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "ENT emergencies are airway emergencies first. A choking patient with an ineffective cough needs the age-specific manoeuvre — back blows and chest thrusts under one year, abdominal thrusts above it — and a witnessed inhaled foreign body is a bronchoscopy, decided clinically, because the commonest inhaled objects are radiolucent. Nasal and aural foreign bodies are diagnosed by the unilateral discharge and removed under direct vision, with a button battery as the same-hour emergency. Trauma — nasal fracture, septal haematoma, auricular haematoma, tympanic membrane rupture and temporal bone fracture — is managed by the structure at risk, and the radiology is chosen by the tissue: plain film for the radio-opaque object in the airway, CT for bone and for the deep collections, and MRI for the nerve and the brain.",
      },
    ],
  };
}
export const OTORHINOLARYNGOLOGY: SubjectSeed = {
  id: "mbbs-otorhinolaryngology",
  slug: "otorhinolaryngology",
  title: "Otorhinolaryngology (ENT)",
  code: "OTOR 308",
  department: "Otorhinolaryngology",
  level: 300,
  credits: 2,
  semester: "second",
  description:
    "Ear, nose, throat and head & neck disease: otitis and mastoid disease, rhinosinusitis, epistaxis, laryngeal disorders, oral cavity and pharynx, vertigo, neck space infection, emergencies and operative basics (AIIMS semesters VI and VIII).",
  faculty: "clinical-medicine",
  prereqCourses: ["gross-anatomy-i", "pathology-cell-injury-repair"],
  modules: [
    { slug: "otology", title: "M1 — Otology" },
    { slug: "rhinology", title: "M2 — Rhinology & the nose" },
    { slug: "larynx-pharynx", title: "M3 — Larynx, pharynx & oral cavity" },
    { slug: "head-neck-practice", title: "M4 — Head & neck, vertigo & practice" },
  ],
  lessons: [
    { title: "External & middle ear disease", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "External and middle ear disease", slug: "otology-external-middle-ear", summary: "Otitis externa, wax, foreign bodies, acute and chronic suppurative otitis media, otitis media with effusion and otalgia differentials.", blooms: "apply", minutes: 40, prereq: [] }, content: lesson1() as never },
    { title: "Mastoid disease & complications", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Mastoid disease and complications", slug: "otospongiosis-mastoid-complications", summary: "Mastoiditis, facial palsy, labyrinthitis and intracranial spread; otosclerosis and stapes surgery.", blooms: "analyze", minutes: 40, prereq: ["otology-external-middle-ear"] }, content: lesson2() as never },
    { title: "Rhinosinusitis & nasal polyps", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Rhinosinusitis and nasal polyps", slug: "rhinosinusitis-nasal-polyp", summary: "Acute and chronic rhinosinusitis, allergic rhinitis and polyps — medical therapy and the indications for endoscopic surgery.", blooms: "apply", minutes: 40, prereq: [] }, content: lesson3() as never },
    { title: "Epistaxis, septum & tumours", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Epistaxis, septal lesions and sinonasal tumours", slug: "epistaxis-septal-tumours", summary: "Epistaxis sites and control, septal deviation and perforation, and benign and malignant sinonasal tumours.", blooms: "analyze", minutes: 40, prereq: ["rhinosinusitis-nasal-polyp"] }, content: lesson4() as never },
    { title: "Larynx & voice disorders", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Laryngeal disorders and voice", slug: "laryngeal-disorders-voice", summary: "Acute and chronic laryngitis, nodules, palsy, stridor and airway obstruction — assessment and emergency airway decisions.", blooms: "analyze", minutes: 40, prereq: [] }, content: lesson5() as never },
    { title: "Pharynx & oral cavity", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Pharynx and oral cavity", slug: "pharynx-oral-cavity", summary: "Tonsillitis and its complications, peritonsillar abscess, adenoids, oralulcers and leukoplakia, and dysphagia differentials.", blooms: "apply", minutes: 40, prereq: [] }, content: lesson6() as never },
    { title: "Neck spaces & facial paralysis", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Neck spaces and facial paralysis", slug: "neck-spaces-facial-paralysis", summary: "Deep neck space infection, neck masses and cysts in children and adults, and the level localisation of facial palsy.", blooms: "analyze", minutes: 40, prereq: [] }, content: lesson7() as never },
    { title: "Vertigo & audiological assessment", module: 4, estimatedMinutes: 35, authored: true, concept: { title: "Vertigo and audiological assessment", slug: "vertigo-audiological-assessment", summary: "BPPV, Meniere's, vestibular neuritis and central causes; audiometry, tuning-fork tests and vestibular testing.", blooms: "apply", minutes: 35, prereq: ["otology-external-middle-ear"] }, content: lesson8() as never },
    { title: "ENT emergencies & radiology", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "ENT emergencies and radiology", slug: "ent-emergencies-radiology", summary: "Airway foreign bodies, nasal and aural foreign bodies, trauma and the plain films, CT and MRI used in ENT diagnosis.", blooms: "apply", minutes: 40, prereq: ["epistaxis-septal-tumours", "laryngeal-disorders-voice"] }, content: lesson9() as never },
  ],
  sbas: [],
}

export async function seedOtorhinolaryngology(): Promise<void> {
  const counts = await seedMbbsCourse(OTORHINOLARYNGOLOGY);
  console.log(`\u2713 ${OTORHINOLARYNGOLOGY.code} ${OTORHINOLARYNGOLOGY.title}: ${counts.modules} modules \u00b7 ${counts.concepts} concepts \u00b7 ${counts.lessons} lessons \u00b7 ${counts.items} items`);
}

if (process.argv[1] && (process.argv[1].includes("mbbs/otorhinolaryngology") || process.argv[1].includes("seed-assessment-otorhinolaryngology"))) {
  seedOtorhinolaryngology()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
