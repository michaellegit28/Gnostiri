import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assessment content — Orthopaedics (AIIMS spine).
 *
 * 16 original single-best-answer (SBA) items deepening the Orthopaedics bank
 * from 0 to 16, tagged to the existing ConceptNodes (see prisma/seed-university.ts).
 * Covers fractures & dislocations, fracture healing/complications (compartment
 * syndrome), upper-limb (scaphoid, supracondylar), lower-limb/knee (SCFE, ACL),
 * amputations, congenital malformations (DDH, CTEV), osteomyelitis & septic
 * arthritis, TB spine & poliomyelitis, bone tumours, spinal deformity and
 * rehabilitation/prosthetics/radiology.
 *
 * Idempotent: upserts on the item slug; safe to re-run. orderIndex starts at
 * 0 because this course has no pre-existing assessment items.
 *
 * Governance: every item ships reviewStatus "needs-human-review" — production
 * rows must never sit at "draft". negativeMarks is held at 0.25 to match the
 * live negative-marking convention used across the assessment bank.
 */

const COURSE_SLUG = "orthopaedics";

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
  // 1 — Fractures and dislocations: posterior hip dislocation (easy)
  {
    slug: "orth-posterior-hip-dislocation-nerve",
    concept: "fractures-dislocations",
    format: "sba",
    stem: "A restrained front-seat passenger in a head-on collision has a deformed hip with the thigh shortened, adducted and internally rotated. Which nerve is most characteristically at risk in this injury?",
    options: [
      "Sciatic nerve, especially its common fibular (peroneal) division",
      "Femoral nerve in the iliopsoas groove",
      "Obturator nerve as it exits the obturator canal",
      "Superior gluteal nerve, causing truncal Trendelenburg instability",
    ],
    correctAnswer: "Sciatic nerve, especially its common fibular (peroneal) division",
    explanation: "Posterior hip dislocation typically follows a dashboard injury and presents with a shortened, adducted and internally rotated limb. The displaced femoral head stretches the sciatic nerve directly behind the hip, injuring it in roughly 10-20% of cases and most often sparing the common peroneal division, giving foot drop. Femoral, obturator and superior gluteal nerve palsies do not fit this dislocation pattern; urgent closed reduction also limits later avascular necrosis.",
    difficulty: "easy",
    marks: 1,
  },

  // 2 — Fracture healing & complications: acute compartment syndrome (medium)
  {
    slug: "orth-compartment-syndrome-fasciotomy",
    concept: "fracture-healing-complications",
    format: "sba",
    stem: "Eight hours after intramedullary nailing of a tibial shaft fracture, a patient has pain out of proportion, pain on passive stretch of the toes, paraesthesia and a tense calf, with pulses and capillary refill still present. What is the single most appropriate immediate management?",
    options: [
      "Emergency fasciotomy of all four compartments of the leg",
      "Elevate the limb above the heart, apply a compression bandage and review in the morning",
      "Increase opioid analgesia and observe for further progression overnight",
      "Withhold decompression until measured intracompartmental pressure rises above arterial diastolic pressure",
    ],
    correctAnswer: "Emergency fasciotomy of all four compartments of the leg",
    explanation: "Compartment syndrome is a clinical diagnosis made on disproportionate pain, pain on passive stretch and a tense compartment; pulses often remain present until very late, so a pulse is falsely reassuring. Definitive treatment is urgent four-compartment fasciotomy after releasing any constrictive dressings and keeping the limb at heart level, not elevated. Pressures support the diagnosis only when examination is unreliable (e.g., an obtunded patient); waiting to confirm hypotension or arterial occlusion wastes the window needed to save the limb.",
    difficulty: "medium",
    marks: 1,
  },

  // 3 — Upper limb injuries: occult scaphoid fracture (easy)
  {
    slug: "orth-scaphoid-occult-fracture",
    concept: "upper-limb-injuries",
    format: "sba",
    stem: "A 22-year-old falls on an outstretched hand and has anatomical snuffbox tenderness, but initial wrist radiographs are reported as normal. What is the most appropriate next step?",
    options: [
      "Immobilise in a scaphoid cast and arrange early repeat imaging (or MRI/CT), treating it as a clinical fracture",
      "Reassure and discharge with no follow-up because the radiographs are normal",
      "Proceed directly to open reduction and internal fixation",
      "Refer for physiotherapy for a wrist sprain and advise return if pain persists at six weeks",
    ],
    correctAnswer: "Immobilise in a scaphoid cast and arrange early repeat imaging (or MRI/CT), treating it as a clinical fracture",
    explanation: "Scaphoid fractures are frequently invisible on the first radiographs, so snuffbox tenderness after a fall on an outstretched hand is managed as a fracture: thumb-spica/scaphoid cast and repeat films at 10-14 days, or early MRI/CT for a definitive answer. Missing it risks non-union and avascular necrosis because the retrograde blood supply is easily disrupted, especially in the proximal pole. Discharge or physiotherapy without protection courts these complications, and immediate fixation is not first-line for an undisplaced fracture.",
    difficulty: "easy",
    marks: 1,
  },

  // 4 — Lower limb & knee injuries: slipped upper femoral epiphysis (medium)
  {
    slug: "orth-scfe-management",
    concept: "lower-limb-injuries",
    format: "sba",
    stem: "An obese 13-year-old boy has a limp with groin and referred knee pain and an externally rotated gait; frog-leg radiographs confirm a stable slipped upper femoral epiphysis (SCFE). What is the correct management?",
    options: [
      "Make the patient non-weight-bearing immediately and fix the epiphysis in situ with a cannulated screw",
      "Attempt forceful closed reduction under anaesthesia to restore the slip angle before casting",
      "Allow protected weight-bearing as tolerated and re-image in six months",
      "Treat as referred knee pain with NSAIDs and quadriceps physiotherapy alone",
    ],
    correctAnswer: "Make the patient non-weight-bearing immediately and fix the epiphysis in situ with a cannulated screw",
    explanation: "SCFE is treated by stopping further slippage: immediate non-weight-bearing and prophylactic pinning of the contralateral hip in high-risk cases, with in-situ single-screw fixation as the standard definitive treatment. Forceful closed reduction risks avascular necrosis of the femoral head, the most devastating complication. Pain is referred to the knee via the obturator nerve, so managing the knee or allowing weight-bearing lets an unstable slip progress.",
    difficulty: "medium",
    marks: 1,
  },

  // 5 — Amputations: level selection (medium)
  {
    slug: "orth-amputation-level-selection",
    concept: "amputations",
    format: "sba",
    stem: "A diabetic patient has a gangrenous, non-salvageable forefoot with spreading infection that has failed revascularisation and requires amputation. Which principle best guides the level of amputation?",
    options: [
      "Amputate at the most distal level expected to heal while preserving the knee joint whenever possible",
      "Perform a transfemoral (above-knee) amputation in all diabetic foot infections to ensure clearance",
      "Carry out a guillotine (open) amputation as the single definitive staged level",
      "Delay amputation for a fixed 30 days of wound care regardless of systemic infection",
    ],
    correctAnswer: "Amputate at the most distal level expected to heal while preserving the knee joint whenever possible",
    explanation: "The goal is the most distal level that will heal and preserve function, because keeping the knee (a transtibial amputation) keeps the oxygen cost of walking near normal, whereas transfemoral amputation markedly raises it. Perfusion is judged clinically and with measures such as transcutaneous oximetry (above about 40 mmHg) and ankle-brachial index. Where infection is uncontrolled an open guillotine amputation may precede a definitive level, but automatic high-level amputation or arbitrary fixed delays are inappropriate.",
    difficulty: "medium",
    marks: 1,
  },

  // 6 — Congenital malformations: developmental dysplasia of the hip (medium)
  {
    slug: "orth-ddh-ortolani-barlow",
    concept: "congenital-malformations",
    format: "sba",
    stem: "A newborn is screened with Ortolani's and Barlow's manoeuvres. Which description of these two tests is correct?",
    options: [
      "Ortolani reduces a dislocated hip (a 'clunk' of reduction); Barlow dislocates a dislocatable hip (a 'clunk' of exit)",
      "Ortolani dislocates the hip; Barlow reduces it, so they are interchangeable",
      "Both tests measure fixed hip flexion to detect cerebral palsy",
      "Both manoeuvres are valid only after the femoral head has ossified on radiograph",
    ],
    correctAnswer: "Ortolani reduces a dislocated hip (a 'clunk' of reduction); Barlow dislocates a dislocatable hip (a 'clunk' of exit)",
    explanation: "In Ortolani's manoeuvre the abducted, flexed hip is lifted so the dislocated femoral head reduces with a palpable clunk; in Barlow's manoeuvre adduction with posterior pressure provokes a dislocatable hip out of the socket. A soft 'click' is benign and distinct from these clunks, and both tests are most useful before ossification, after which ultrasound (and later radiograph) is used. Reducible dysplasia treated in the first months with a Pavlik harness has an excellent prognosis.",
    difficulty: "medium",
    marks: 1,
  },

  // 7 — Congenital malformations: congenital talipes equinovarus (easy)
  {
    slug: "orth-ctev-ponseti",
    concept: "congenital-malformations",
    format: "sba",
    stem: "A newborn has a foot that is turned downward and inward with a deep medial crease and cannot be passively corrected to neutral. What is the first-line treatment?",
    options: [
      "Serial Ponseti manipulation and casting, usually with percutaneous Achilles tenotomy, followed by a foot-abduction brace",
      "Immediate extensive posteromedial soft-tissue release surgery",
      "Observation only, as most cases resolve by walking age",
      "A rigid ankle-foot orthosis and home stretching without casting",
    ],
    correctAnswer: "Serial Ponseti manipulation and casting, usually with percutaneous Achilles tenotomy, followed by a foot-abduction brace",
    explanation: "Congenital talipes equinovarus (clubfoot) is treated with the Ponseti method: weekly manipulation and above-knee casts that correct cavus, adductus and varus in sequence, followed in most cases by a percutaneous Achilles tenotomy for the residual equinus. A foot-abduction (Denis-Browne) bar is then worn to prevent the high relapse rate, and compliance is emphasised. Extensive surgical release is reserved for resistant or recurrent cases; the deformity does not resolve spontaneously.",
    difficulty: "easy",
    marks: 1,
  },

  // 8 — Osteomyelitis & septic arthritis: septic arthritis vs transient synovitis (hard)
  {
    slug: "orth-septic-arthritis-kocher",
    concept: "osteomyelitis-septic-arthritis",
    format: "sba",
    stem: "A 4-year-old refuses to bear weight, has a temperature of 39 °C, ESR 48 mm/h and white cell count 16 × 10⁹/L; ultrasound confirms a hip effusion. What is the most appropriate immediate management?",
    options: [
      "Urgent hip aspiration for Gram stain and culture, then joint washout/surgical drainage with intravenous anti-staphylococcal antibiotics",
      "Reassure with oral ibuprofen and review in two weeks, as transient synovitis of the hip is self-limiting",
      "Start oral amoxicillin and apply a hip spica cast without joint aspiration",
      "Prescribe bed rest and traction and await culture results before any antibiotic",
    ],
    correctAnswer: "Urgent hip aspiration for Gram stain and culture, then joint washout/surgical drainage with intravenous anti-staphylococcal antibiotics",
    explanation: "Refusal to bear weight, fever ≥ 38.5 °C, ESR ≥ 40 mm/h and WCC ≥ 12 × 10⁹/L are all four Kocher predictors of septic arthritis, which together carry over 99% probability and constitutes an orthopaedic emergency because proteolytic pus destroys cartilage within days. Management is immediate aspiration for diagnosis, urgent washout/arthrotomy, and intravenous antibiotics (Staphylococcus aureus first). Transient synovitis is a diagnosis of exclusion in an afebrile or low-grade-fever child who still walks, with low inflammatory markers; delaying antibiotics or treatment damages the joint irreversibly.",
    difficulty: "hard",
    marks: 1,
  },

  // 9 — Osteomyelitis: acute haematogenous osteomyelitis (medium)
  {
    slug: "orth-acute-haematogenous-osteomyelitis",
    concept: "osteomyelitis-septic-arthritis",
    format: "sba",
    stem: "A 6-year-old has fever, focal metaphyseal tibial tenderness and refusal to bear weight with raised ESR and CRP; early radiographs are normal but MRI shows marrow oedema with a subperiosteal collection. Which organism and management pairing is most appropriate?",
    options: [
      "Staphylococcus aureus — prompt intravenous anti-staphylococcal antibiotics with surgical drainage of any collection",
      "Kingella kingae — oral amoxicillin alone, as in uncomplicated pre-school disease",
      "Salmonella enterica serovar Typhi — anti-tuberculous chemotherapy without antibiotics",
      "Mycobacterium tuberculosis — ultrasound-guided drainage alone plus six months of anti-tubercular therapy",
    ],
    correctAnswer: "Staphylococcus aureus — prompt intravenous anti-staphylococcal antibiotics with surgical drainage of any collection",
    explanation: "Acute haematogenous osteomyelitis is dominated by Staphylococcus aureus at all ages; in a school-age child it causes focal metaphyseal tenderness, refusal to bear weight and raised inflammatory markers, with radiographs normal early and MRI detecting marrow and subperiosteal disease. Treatment is prompt intravenous anti-staphylococcal antibiotics after cultures, with operative drainage or debridement of abscesses, sequestra or collections. Kingella kingae affects children under about four years, while Salmonella complicates sickle-cell disease and tuberculous osteitis follows an indolent course needing anti-tubercular therapy.",
    difficulty: "medium",
    marks: 1,
  },

  // 10 — TB spine & poliomyelitis: Pott disease (medium)
  {
    slug: "orth-tb-spine-pott-disease",
    concept: "tuberculosis-spine-poliomyelitis",
    format: "sba",
    stem: "A 45-year-old with back pain, night sweats and weight loss has MRI showing contiguous involvement of three vertebral bodies with relative sparing of the discs and a large paravertebral cold abscess. Which statement best characterises this disease?",
    options: [
      "Tuberculous (Pott) spondylitis: anterior subligamentous spread that skips discs, spans contiguous levels and forms a paucisymptomatic 'cold' paravertebral abscess",
      "Pyogenic vertebral osteomyelitis: centred on the disc, destroying it early and usually confined to one level",
      "Metastatic disease: typically preserves vertebral endplates while producing a paraspinal abscess",
      "Multiple myeloma: lytic lesions that create a cold abscess and an anterior wedge collapse",
    ],
    correctAnswer: "Tuberculous (Pott) spondylitis: anterior subligamentous spread that skips discs, spans contiguous levels and forms a paucisymptomatic 'cold' paravertebral abscess",
    explanation: "Pott disease spreads beneath the anterior longitudinal ligament, so it crosses and involves contiguous vertebral bodies while sparing the intervertebral discs until late, and produces large psoas or paravertebral cold abscesses with little systemic inflammatory response; anterior column collapse then causes a painful kyphotic (gibbous) deformity. Pyogenic infection is disc-centred, destructive and usually single-level. Metastases and myeloma are body-centred lytic lesions without the subligamentous multi-level pattern or cold abscess; Pott disease is treated with anti-tubercular therapy, with surgery for instability or neural compromise.",
    difficulty: "medium",
    marks: 1,
  },

  // 11 — Poliomyelitis (medium)
  {
    slug: "orth-poliomyelitis-flaccid-paralysis",
    concept: "tuberculosis-spine-poliomyelitis",
    format: "sba",
    stem: "A 2-year-old in an under-immunised area has a febrile prodrome and then asymmetric flaccid weakness of the legs with absent tendon reflexes, fasciculations and preserved sensation. Which mechanism underlies the paralysis?",
    options: [
      "Poliovirus destruction of anterior horn cells of the spinal cord, producing a lower motor neurone flaccid paralysis",
      "Peripheral nerve demyelination of Guillain–Barré syndrome with albumino-cytological dissociation",
      "Epidural cord compression producing a sensory level with upper motor neurone signs",
      "Juvenile myasthenia gravis producing fatigable weakness with prominent bulbar signs",
    ],
    correctAnswer: "Poliovirus destruction of anterior horn cells of the spinal cord, producing a lower motor neurone flaccid paralysis",
    explanation: "Poliomyelitis is an acute flaccid paralysis caused by poliovirus lysing anterior horn cells, giving a patchy, asymmetric lower motor neurone pattern — areflexia, wasting and fasciculations with intact sensation, often after a febrile prodrome. Guillain–Barré is a largely symmetric, ascending weakness with sensory features and albumino-cytological dissociation, while a compressive cord lesion produces a sensory level and upper motor neurone signs. Later 'post-polio' weakness reflects degeneration of residual enlarged motor units, not reinfection.",
    difficulty: "medium",
    marks: 1,
  },

  // 12 — Bone tumours: osteosarcoma (hard)
  {
    slug: "orth-osteosarcoma-diagnosis",
    concept: "bone-tumours",
    format: "sba",
    stem: "A 15-year-old boy has progressive distal thigh pain with a tender mass and raised alkaline phosphatase; the radiograph shows a destructive metaphyseal lesion with a Codman triangle and sunburst spiculation. Which is the most likely diagnosis?",
    options: [
      "Conventional osteosarcoma",
      "Ewing sarcoma",
      "Giant-cell tumour of bone",
      "Enchondroma",
    ],
    correctAnswer: "Conventional osteosarcoma",
    explanation: "Osteosarcoma is the commonest primary malignant bone tumour of adolescence; it arises in the metaphysis of long bones, especially around the knee, and its aggressive periosteal reaction produces the Codman triangle and sunburst spiculation with a raised alkaline phosphatase. Ewing sarcoma is a diaphyseal tumour of younger children with an 'onion-skin' periosteum, giant-cell tumour is a benign epiphyseal 'soap-bubble' lesion of young adults, and enchondroma is an indolent medullary cartilage lesion with 'popcorn' calcification. Staging uses MRI of the compartment, chest CT for metastases and a biopsy before neoadjuvant chemotherapy and limb-salvage surgery.",
    difficulty: "hard",
    marks: 1,
  },

  // 13 — Spinal deformity: adolescent idiopathic scoliosis (medium)
  {
    slug: "orth-adolescent-idiopathic-scoliosis",
    concept: "spine-deformities",
    format: "sba",
    stem: "A pre-menarchal 13-year-old girl (Risser 1) has a 30° right thoracic curve; the rib hump persists on forward bending and does not correct on side-bending. What is the most appropriate management?",
    options: [
      "Prescribe a thoracolumbosacral (underarm) brace and observe until skeletal maturity",
      "Reassure and discharge, as Scheuermann curves remodel after puberty",
      "Proceed straight to posterior spinal fusion without further monitoring",
      "Advise targeted postural exercises to straighten the curve and avoid bracing",
    ],
    correctAnswer: "Prescribe a thoracolumbosacral (underarm) brace and observe until skeletal maturity",
    explanation: "A structural adolescent idiopathic curve of 20-45° in a skeletally immature child (pre-menarche, low Risser grade) is braced to halt progression, with observation and serial radiographs until growth is complete. Surgery (posterior fusion) is reserved for curves above about 45-50° or those progressing despite bracing, while observation alone suits smaller curves below 20-25°. Bracing arrests rather than corrects the curve, and exercises or physiotherapy cannot straighten a fixed, rotated structural deformity.",
    difficulty: "medium",
    marks: 1,
  },

  // 14 — Rehabilitation, prosthetics & radiology: first-line imaging (easy)
  {
    slug: "orth-first-line-bone-imaging",
    concept: "rehabilitation-prosthetics-orthotics",
    format: "sba",
    stem: "Which imaging study should generally be obtained first when evaluating suspected bone or joint pathology such as a fracture, suspected tumour or arthritis?",
    options: [
      "Plain radiographs in at least two orthogonal planes",
      "MRI as the routine initial investigation in every case",
      "CT as the routine initial investigation in every case",
      "Bone scintigraphy as the routine initial investigation in every case",
    ],
    correctAnswer: "Plain radiographs in at least two orthogonal planes",
    explanation: "Plain radiographs in two planes are inexpensive, widely available and sensitive to cortical and trabecular change, so they are the first-line test for almost all suspected bone and joint disease and guide any further imaging. MRI is the most sensitive for occult fracture, early osteomyelitis, and meniscal, ligament or spinal cord pathology; CT best defines cortical detail and complex intra-articular or spinal fractures; scintigraphy or PET detects multifocal disease, metastases or occult infection. Advanced modalities are selected by the clinical question rather than used as a universal first step.",
    difficulty: "easy",
    marks: 1,
  },

  // 15 — Upper limb injuries: supracondylar humerus fracture (medium)
  {
    slug: "orth-supracondylar-brachial-artery",
    concept: "upper-limb-injuries",
    format: "sba",
    stem: "A 7-year-old falls onto an outstretched hand and has a displaced extension-type supracondylar fracture of the humerus with a swollen elbow. Which acute complication is most feared with this injury?",
    options: [
      "Brachial artery compromise leading to forearm compartment syndrome and, if missed, Volkmann's ischaemic contracture",
      "Radial nerve palsy in the spiral groove producing wrist drop",
      "Axillary artery injury producing a traumatic shoulder dislocation",
      "Delayed union with osteomyelitis as the commonest early complication",
    ],
    correctAnswer: "Brachial artery compromise leading to forearm compartment syndrome and, if missed, Volkmann's ischaemic contracture",
    explanation: "In the extension-type supracondylar fracture the sharp proximal fragment can injure the brachial artery (spasm, intimal tear or entrapment), and the resulting antecubital swelling and rising pressure cause forearm compartment syndrome, which untreated leads to Volkmann's ischaemic contracture. Management is prompt closed or percutaneous crossed K-wire fixation with serial neurovascular checks, and urgent vascular assessment if perfusion is compromised. The median/anterior interosseous nerve is the commonest nerve lesion, while spiral-groove radial palsy belongs to humeral shaft fractures.",
    difficulty: "medium",
    marks: 1,
  },

  // 16 — Lower limb & knee injuries: anterior cruciate ligament tear (medium)
  {
    slug: "orth-acl-lachman-pivot-shift",
    concept: "lower-limb-injuries",
    format: "sba",
    stem: "A footballer twists a planted knee, hears a 'pop' and develops rapid swelling; Lachman test shows increased anterior tibial translation with a soft endpoint and the pivot-shift is positive, while the posterior drawer is normal. Which structure is torn?",
    options: [
      "Anterior cruciate ligament",
      "Posterior cruciate ligament",
      "Medial collateral ligament",
      "Lateral collateral ligament",
    ],
    correctAnswer: "Anterior cruciate ligament",
    explanation: "The ACL restrains forward glide of the tibia, and its rupture is diagnosed by a positive Lachman test (the most sensitive examination at 20-30° of flexion) and pivot-shift after a twisting injury with rapid haemarthrosis. PCL injury is signalled by posterior tibial sag and an increased posterior drawer, such as after a dashboard impact, whereas isolated collateral ligament tears produce valgus or varus laxity rather than abnormal sagittal translation. Management is staged: early rehabilitation to regain motion and strength, then reconstruction for the unstable or high-demand knee, since persistent instability predisposes to meniscal tears and osteoarthritis.",
    difficulty: "medium",
    marks: 1,
  },
];

async function seedAssessmentOrthopaedics() {
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
        reviewStatus: "needs-human-review",
        needsCheck: it.needsCheck ?? false,
      },
    });
    count++;
  }

  console.log(`✓ Orthopaedics assessment items: ${count} items (marks 1, needs-human-review)`);
}

// CLI usage: npx ts-node prisma/seed-assessment-orthopaedics.ts
if (process.argv[1] && process.argv[1].includes("seed-assessment-orthopaedics")) {
  seedAssessmentOrthopaedics()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export { seedAssessmentOrthopaedics, ITEMS as ORTHOPAEDICS_ITEMS };
