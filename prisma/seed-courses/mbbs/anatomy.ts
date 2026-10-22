import { prisma, seedMbbsCourse, type LessonSeed, type SbaSeed, type SubjectSeed } from "./spine";

/**
 * ANAT 101 — Human Anatomy.
 *
 * Module 1 ("Foundations & the thoracic limb") is authored in full: 8 lessons
 * in the pilot-report format — outcomes, prerequisites, big idea, explanation,
 * worked clinical examples, common mistakes, check questions, MCQs, summary —
 * one SBA AssessmentItem per concept, all facts drawn from standard anatomical
 * teaching (positional terminology, the brachial plexus C5-T1 root-to-branch
 * order, the costovertebral articulations, the mediastinal compartments).
 *
 * Modules 2-6 (lower limb, abdomen, head & neck, neuroanatomy, embryology)
 * ship as a real concept spine and prerequisite DAG with tracked-placeholder
 * lessons (needsCheck true) — the structure a human author needs to fill in,
 * not 500 thin stubs pretending to be a course.
 *
 * The three pre-clinical courses created by prisma/seed-university.ts are
 * adopted rather than duplicated: this seeder finds Gross Anatomy I by slug and
 * extends it, so the concept DAG and the 5-mark EMQ items already authored in
 * prisma/seed-assessment-anatomy.ts stay attached.
 */

const COURSE_SLUG = "gross-anatomy-i";

const MODULES = [
  { slug: "foundations-thoracic-limb", title: "M1 — Foundations & the thoracic limb" },
  { slug: "lower-limb-pelvis", title: "M2 — Lower limb & pelvis" },
  { slug: "abdomen-retroperitoneum", title: "M3 — Abdomen & retroperitoneum" },
  { slug: "head-neck", title: "M4 — Head & neck" },
  { slug: "neuroanatomy-special-senses", title: "M5 — Neuroanatomy & special senses" },
  { slug: "embryology-development", title: "M6 — Embryology & developmental anatomy" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — Anatomical position & planes of reference (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the anatomical position and explain why every description in anatomy is defined against it; name the three cardinal planes and say which structures each separates; use directional terms (medial/lateral, proximal/distal, superficial/deep, cranial/caudal) correctly in a written description; and read a CT or MRI series confidently, naming the plane each slice is in.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the MBBS pre-clinical anatomy course and needs no prior medical study.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Anatomical position",
        text: "The standard reference pose of the human body: standing erect, facing forward, with the arms at the sides and the palms turned forward, and the feet together and pointing forward. Every anatomical description is written as if the body were in this position, whatever the patient is actually doing.",
      },
      {
        type: "paragraph",
        text: "Anatomy is a language before it is a science, and like any language it needs an agreed dictionary. The agreement is this one pose. Once it is fixed, 'medial', 'anterior' and every other directional word has exactly one meaning, so a surgeon in Lagos and a radiologist in Boston reading 'the tumour lies medial to the humerus' picture the same place. Remove the reference pose and the words become meaningless — picture a lying patient: their 'upper' limb is now level with their trunk, and anything you might call 'left' depends on whose viewpoint you take.",
      },

      { type: "heading", level: 2, text: "The three cardinal planes" },
      {
        type: "paragraph",
        text: "A plane is an imaginary flat slice through the body, and there are three that matter. Each one is named for the kind of boundary it makes, and each is the plane an imaging machine can actually scan along.",
      },
      {
        type: "table",
        headers: ["Plane", "Direction of cut", "What it separates", "What you see in a cross-section"],
        rows: [
          ["Sagittal (median / midsagittal)", "Vertical, down the long axis, front to back", "Left from right", "A side view: one half of the body, in outline"],
          ["Coronal (frontal)", "Vertical, down the long axis, side to side", "Anterior from posterior", "A face-on view: front of the body laid flat"],
          ["Transverse (axial, horizontal)", "Horizontal, across the long axis", "Superior from inferior", "A slice: as if you cut across a carrot and looked at the cut face"],
        ],
      },
      {
        type: "paragraph",
        text: "Two refinements matter in practice. A parasagittal plane is any sagittal plane that does not pass through the midline, so it divides the body into unequal left and right parts; the midsagittal plane is the single sagittal plane that passes exactly through the midline and divides it into equal halves. And imaging reports use 'axial' and 'coronal' more often than 'transverse' and 'frontal', because those are the words on the scanner console — mean the same thing, different vocabulary.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Reading order of a CT scan: axial images are stacked from the patient's feet upward and displayed as if you are looking up at the patient from their feet. So on the viewer's screen the patient's left appears on your right. That single convention explains most learners' first moment of disorientation in radiology.",
      },

      { type: "heading", level: 2, text: "Directional vocabulary" },
      {
        type: "table",
        headers: ["Term", "Meaning", "Worked example"],
        rows: [
          ["Superior (cranial)", "Toward the head", "The heart is superior to the diaphragm"],
          ["Inferior (caudal)", "Toward the feet", "The liver is inferior to the diaphragm's right dome"],
          ["Anterior (ventral)", "Toward the front of the body", "The sternum is anterior to the vertebral column"],
          ["Posterior (dorsal)", "Toward the back of the body", "The scapula lies posterior to the rib cage"],
          ["Medial", "Closer to the midline", "The nose is medial to the eyes"],
          ["Lateral", "Further from the midline", "The thumb is lateral to the little finger in the anatomical position"],
          ["Proximal", "Closer to the limb root or trunk", "The shoulder is proximal to the elbow"],
          ["Distal", "Further from the limb root or trunk", "The wrist is distal to the elbow"],
          ["Superficial / deep", "Closer to / further from the body surface", "Skin is superficial to muscle; bone is deep to muscle"],
          ["Ipsilateral / contralateral", "On the same / the opposite side", "The left arm and left leg are ipsilateral; left arm and right leg are contralateral"],
        ],
      },
      {
        type: "paragraph",
        text: "Note which words are reserved for limbs. Proximal and distal describe position along a limb and are meaningless for the trunk; superior/inferior would be the equivalent there. In the limbs you may hear them used loosely for vessels and nerves — 'the distal radial artery', meaning the part further from the heart — and that usage follows the same logic of distance from the body's centre.",
      },

      { type: "heading", level: 2, text: "Why the reference pose is not optional" },
      {
        type: "paragraph",
        text: "The forearm contains the two bones that make the rule concrete. In the anatomical position the palms face forward, and the radius therefore lies lateral to the ulna. Pronate your forearm — turn the palm backwards — and the radius crosses over the ulna and ends up medial to it. Nothing about the bones changed; the body's pose changed. 'The radius is lateral' is true by definition in the anatomical position, and it is the convention that keeps the statement stable, because it is always written from that pose whatever the patient's forearm is doing. This is also why you will learn the forearm as two named bones in a fixed relationship rather than as a moving arrangement.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "The most common early mistake is describing a patient in bed using anatomical terms as if they were standing. A patient lying supine (face up) has their anterior surface facing the ceiling, but 'anterior' still means toward their own front, not toward you. Left and right in any clinical record always mean the patient's left and right, never the observer's.",
      },

      { type: "heading", level: 2, text: "Planes in clinical practice" },
      {
        type: "paragraph",
        text: "Planes are not classroom decoration — they are how modern medicine looks inside the body. A CT scanner acquires axial slices; the machine can then reconstruct them in any plane, which is why a radiologist speaks of coronal and sagittal reformats. In orthopaedics and neurosurgery the plane determines the approach: a posterolateral approach to an intervertebral disc is described by which plane the incision lies in. In obstetrics the plane of the pelvic inlet and outlet decides whether a vaginal delivery is mechanically possible. And in anatomy practical examinations, a specimen shown to you in a coronal section is testing whether you can re-assemble the three-dimensional relationships you were taught in diagrams.",
      },
      {
        type: "question",
        prompt: "A patient lies face down on the operating table. You are asked to describe the position of their scapula using correct anatomical terms. What do you write?",
        answer: "'The scapula is posterior to the rib cage.' Lying prone (face down) does not make the scapula inferior or change any relationship — posterior still means toward the patient's own back.",
        explanation: "Directional terms are defined against the anatomical position, not against the patient's current pose or the observer's viewpoint. This is the rule that makes 'posterior' unambiguous for the whole team.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating 'midsagittal' and 'sagittal' as synonyms. Every midsagittal plane is sagittal, but most sagittal planes are parasagittal and cut the body unevenly. If a question asks which plane divides the body into equal right and left halves, only midsagittal is correct.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mixing up the coronal and transverse planes when reading an image. Coronal is a vertical cut separating front from back — you are looking at the body face on. Transverse is a horizontal cut separating top from bottom — you are looking at a slice. If the slice shows you a cross-section of the skull with both eyes visible side by side, it is axial; if it shows one eye in section, it is sagittal or coronal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using proximal and distal for the trunk. These terms exist only along a limb. For the trunk use superior/inferior, and for the gut use the specific terms you will learn later: oral and aboral, or rostral and caudal in embryology.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does the anatomical position specify that the palms face forward?",
        answer: "Because with the palms forward the forearm is supinated and the radius lies lateral to the ulna. Without a fixed pose, the radius and ulna would swap medial/lateral relationships every time the forearm rotated, and no directional statement about the forearm would be stable.",
        explanation: "The pose fixes the rotational state of the limbs, which is precisely the degree of freedom that would otherwise make medial/lateral ambiguous at the forearm.",
      },
      {
        type: "question",
        prompt: "Name the plane, and the landmark it passes through, that separates the superior mediastinum from the inferior mediastinum.",
        answer: "A transverse plane through the sternal angle (the manubriosternal joint), at the level of the T4/T5 intervertebral disc.",
        explanation: "The sternal angle is the palpable landmark for this plane and is also where the second rib articulates — the reason you count ribs from there. This is covered properly in the mediastinum lesson.",
      },
      {
        type: "question",
        prompt: "An axial CT slice shows the aorta anterior and to the patient's left. Where does it appear on the screen?",
        answer: "On the patient's left, which is the right side of the image as you look at it — because axial images are viewed from the patient's feet.",
        explanation: "The convention is fixed: axial series are read as if looking up from the feet, so the patient's left is always the viewer's right. Radiology reports therefore state laterality in words, not by pointing at the screen.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement about the anatomical position is correct?",
        options: [
          "The body lies supine with the palms facing backward.",
          "The body stands erect, faces forward, arms at the sides with palms and feet directed forward.",
          "The body stands with the arms raised above the head and palms inward.",
          "The body position is chosen by whoever is describing it, for their own convenience.",
        ],
        correctIndex: 1,
        explanation: "The anatomical position is erect, facing forward, arms at the sides, palms forward and feet pointing forward. Supine with palms back is prone-ish confusion; raised arms and free choice defeat the purpose of a universal reference.",
      },
      {
        type: "mcq",
        stem: "A cuts the body into anterior and posterior parts. B divides it into superior and inferior parts. C divides it into left and right parts. Which pairing is correct?",
        options: [
          "A is transverse, B is coronal, C is sagittal",
          "A is coronal, B is transverse, C is sagittal",
          "A is sagittal, B is coronal, C is transverse",
          "A is coronal, B is sagittal, C is transverse",
        ],
        correctIndex: 1,
        explanation: "Coronal (frontal) separates front from back; transverse (axial) separates top from bottom; sagittal separates left from right. Remember the mnemonic by picturing a crown: coronal, frontal — the face-on plane.",
      },
      {
        type: "mcq",
        stem: "Which single plane divides the body into equal right and left halves?",
        options: ["Any parasagittal plane", "The coronal plane", "The median (midsagittal) plane", "The transverse plane"],
        correctIndex: 2,
        explanation: "Only the median plane passes through the midline itself. Parasagittal planes are sagittal but unequal; coronal and transverse divide along different axes entirely.",
      },
      {
        type: "mcq",
        stem: "In the anatomical position, where does the radius lie relative to the ulna?",
        options: ["Medial to it, because both bones are on the same side", "Lateral to it, because the palm faces forward and supinates the forearm", "Proximal to it, because the radius crosses over the ulna", "Deep to it, because it is covered by muscle"],
        correctIndex: 1,
        explanation: "With the palm forward the forearm is supinated and the radius runs lateral to the ulna. Pronation reverses the relationship, which is exactly why the reference pose is needed.",
      },
      {
        type: "mcq",
        stem: "A patient is lying supine. Using correct anatomical terminology, the patient's umbilicus is ____ to their back and ____ to their head.",
        options: [
          "posterior; inferior", "anterior; superior", "anterior; inferior", "posterior; superior",
        ],
        correctIndex: 2,
        explanation: "The umbilicus is on the front of the body, so anterior to the back, and below the head, so inferior to it. Supine describes the pose, not the direction — the terms still refer to the patient's own body.",
      },
      {
        type: "mcq",
        stem: "Which term correctly describes the relationship between a patient's left hand and their right foot?",
        options: ["Ipsilateral", "Contralateral", "Proximal", "Homolateral"],
        correctIndex: 1,
        explanation: "Ipsilateral means the same side (left hand and left foot); contralateral means opposite sides (left hand and right foot). 'Homolateral' is an occasional synonym for ipsilateral, but contralateral is the precise word for opposite sides.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The anatomical position — erect, facing forward, arms at the sides, palms and feet forward — is the fixed reference against which every directional word in anatomy is defined, so that descriptions survive changes in the patient's pose. The three cardinal planes are sagittal (left/right, midsagittal when it passes exactly through the midline), coronal (anterior/posterior) and transverse (superior/inferior), and these are the planes CT and MRI scan and reconstruct along. Axial images are read from the feet up, so the patient's left appears on the viewer's right.",
      },
      {
        type: "paragraph",
        text: "Next: the skeletal framework of the upper limb. You will meet the clavicle and scapula, the humerus, the radius and ulna, and the carpals — and the common fractures of each, which is where the positional vocabulary you have just learned stops being abstract and starts deciding whether a patient keeps the use of a limb.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Skeletal framework of the upper limb (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: list the bones of the upper limb in proximal-to-distal order and identify the major features of each; explain how the shoulder girdle attaches to the axial skeleton and why the sternoclavicular joint is the only direct bony link; state the nerve most at risk in a fracture of the surgical neck and of the mid-shaft of the humerus; describe the articulations that make pronation and supination possible; and recognise why a scaphoid fracture is the hand injury you must not miss.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Anatomical position & planes). You need medial/lateral, proximal/distal and the cardinal planes to read any of the descriptions below.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pectoral girdle",
        text: "The clavicle and scapula together: the bony scaffolding that suspends the upper limb from the trunk. Unlike the pelvic girdle, which is fused to the spine and built to bear weight, the pectoral girdle is mobile and built to place the hand in space.",
      },
      {
        type: "paragraph",
        text: "One sentence explains the whole design: the upper limb trades stability for reach. The lower limb's bones are massive and its joints constrained, because it must carry your weight. The upper limb's bones are lighter and its joints far more mobile, because its job is to put the hand wherever you want it. Every fracture and nerve injury in this lesson follows from that trade — a joint mobile enough to throw a ball is a joint that can dislocate.",
      },

      { type: "heading", level: 2, text: "From trunk to fingertip: the order of bones" },
      {
        type: "table",
        headers: ["Region", "Bones", "Key features to know"],
        rows: [
          ["Shoulder girdle", "Clavicle, scapula", "Clavicle: sternal and acromial ends; scapula: spine, acromion, coracoid process, glenoid cavity"],
          ["Arm (brachium)", "Humerus", "Head, anatomical and surgical necks, tubercles, intertubercular sulcus, deltoid tuberosity, radial groove, trochlea and capitulum"],
          ["Forearm (antebrachium)", "Radius (lateral), ulna (medial)", "Radius: head with disc, radial tuberosity, styloid process; ulna: olecranon, coronoid process, trochlear notch, head, styloid process"],
          ["Hand", "8 carpals, 5 metacarpals, 14 phalanges", "Carpals in two rows of four; metacarpals numbered 1-5 from the thumb; thumb has two phalanges, the other digits three each"],
        ],
      },
      {
        type: "paragraph",
        text: "The clavicle is the only long bone of the upper limb that articulates directly with the axial skeleton, and it does so at the sternoclavicular joint. The scapula is held to the trunk only by muscle, gliding on the thoracic wall — which is why it is described as a functional (not true synovial) joint at the scapulothoracic interface. Everything else in the limb hangs from that arrangement: the humerus from the glenoid, the two forearm bones from the humerus, and the hand from the radius through the wrist.",
      },

      { type: "heading", level: 2, text: "Worked example 1: the humerus is a map of nerves" },
      {
        type: "paragraph",
        text: "The humerus is worth learning feature by feature, because three of its landmarks are tied directly to three nerves you will be asked about in an examination. Read it from proximal to distal.",
      },
      {
        type: "table",
        headers: ["Humerus landmark", "What it does", "Structure at risk"],
        rows: [
          ["Surgical neck", "Constriction just below the head and tubercles, the commonest fracture site in the elderly", "Axillary nerve — winds around the neck behind the humerus"],
          ["Radial (spiral) groove", "Oblique groove on the posterior shaft", "Radial nerve — runs in the groove with the profunda brachii artery"],
          ["Medial epicondyle", "Bony projection at the distal medial end", "Ulnar nerve — passes behind it in the cubital tunnel"],
        ],
      },
      {
        type: "paragraph",
        text: "A fracture of the surgical neck classically follows a fall on an outstretched hand in an older patient. The axillary nerve is injured, so the deltoid and teres minor are paralysed: the patient cannot abduct the arm from the side, and sensation is lost over the lower part of the shoulder — the 'regimental badge' patch. A fracture of the mid-shaft endangers the radial nerve in the spiral groove, and the signature deficit is different: the wrist drops, because every extensor of the wrist and fingers is supplied by that nerve. The same bone, two different landmarks, two completely different disabilities — this is why examiners test landmarks rather than whole bones.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The anatomical neck is the narrow line where the head meets the tubercles and is rarely fractured. The surgical neck is the constriction below the tubercles and is the fracture that matters clinically — the name tells you which one a surgeon must think about.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the two-bone forearm and pronation" },
      {
        type: "paragraph",
        text: "Pronation and supination are rotations, not bends: the radius and ulna stay parallel in length but cross over each other in space. The hinge at the elbow (humeroulnar) allows flexion and extension only. The rotation happens at the proximal and distal radioulnar joints, where the disc-shaped head of the radius spins inside a ring formed by the annular ligament and radial notch of the ulna. Put those joints together and the forearm becomes a lever you can twist without moving the elbow at all — which is why you can turn a key with your elbow held still.",
      },
      {
        type: "paragraph",
        text: "The muscles that drive it are worth noting because they explain a test you will perform on patients: biceps brachii inserts on the radial tuberosity and is the powerful supinator of the forearm, while pronator teres and pronator quadratus pull the radius across the ulna. Testing supination against resistance with the elbow flexed to ninety degrees isolates biceps — and therefore the musculocutaneous nerve that supplies it.",
      },

      { type: "heading", level: 2, text: "Worked example 3: the scaphoid and its blood supply" },
      {
        type: "paragraph",
        text: "The eight carpals sit in two rows: proximal, from lateral to medial, scaphoid, lunate, triquetrum and pisiform; distal, trapezium, trapezoid, capitate and hamate. The scaphoid is the one that matters, because it is the most commonly fractured carpal, and it is missed at first presentation more often than any other fracture of the hand.",
      },
      {
        type: "paragraph",
        text: "The mechanism is a fall on the outstretched hand, and the reason it is missed is that the initial X-ray looks normal in a substantial minority of cases: the fracture line does not open until the bone resorbs slightly along it. The clinical signs are tenderness in the anatomical snuffbox — the hollow between the tendons at the base of the thumb — and pain on axial compression of the thumb. The consequence of missing it is specific and severe: the scaphoid's blood supply enters distally and runs backwards, so a fracture across the waist cuts off the proximal pole. Avascular necrosis of that fragment follows, and the wrist becomes painful and arthritic. In a young patient with a snuffbox injury and normal films, the wrist is immobilised and re-imaged.",
      },

      { type: "heading", level: 2, text: "Joints: where the mobility comes from" },
      {
        type: "table",
        headers: ["Joint", "Type", "Movement", "Clinical note"],
        rows: [
          ["Sternoclavicular", "Synovial (saddle)", "Elevation, depression, protraction of the shoulder", "The only true articulation between upper limb and axial skeleton"],
          ["Acromioclavicular", "Synovial (plane)", "Small gliding/rotation", "Separated in a shoulder separation — the clavicle rides up"],
          ["Glenohumeral", "Synovial (ball and socket)", "Flexion, extension, abduction, adduction, rotation", "The most mobile and the most commonly dislocated joint in the body; dislocates anteriorly and inferiorly"],
          ["Elbow complex", "Synovial (hinge + pivot)", "Flexion/extension; pronation/supination", "Stable because of the bony fit in the trochlear notch"],
          ["Wrist (radiocarpal)", "Synovial (condyloid)", "Flexion, extension, abduction, adduction, circumduction", "Condyloid joints cannot rotate — rotation comes from the forearm"],
          ["Thumb carpometacarpal", "Synovial (saddle)", "Including opposition", "Opposition is what makes the human hand a precision instrument"],
        ],
      },
      {
        type: "paragraph",
        text: "The glenohumeral joint deserves the emphasis. Its socket — the glenoid cavity — is shallow, so the humeral head is held in place by a cuff of muscle tendons rather than by bone, and that is the reason the shoulder abducts through more than a hundred and eighty degrees while staying unstable. You will meet those muscles, the rotator cuff, in the next module; the point to hold now is that the skeleton buys mobility at the price of stability, and the price is paid in dislocations.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the two humeral necks. Anatomical neck = the groove between head and tubercles, rarely broken. Surgical neck = below the tubercles, the common fracture, and the one whose injury paralyzes the deltoid via the axillary nerve. In any examination question, 'surgical neck' is the phrase that signals axillary nerve injury.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the scapula articulates with the rib cage. It does not; it glides on the thoracic wall held by muscle, which is why a winged scapula is a nerve problem (long thoracic nerve to serratus anterior) and not a joint problem.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Promising a patient with a snuffbox injury and a normal X-ray that nothing is broken. The scaphoid fracture is radiographically occult early; treat the injury, immobilise, and re-image at about two weeks rather than clearing it on the first film.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which joint is the only direct bony articulation between the upper limb and the axial skeleton, and why does it matter?",
        answer: "The sternoclavicular joint, where the medial end of the clavicle meets the sternum. It matters because it is the anchor: through it, forces from the limb reach the trunk, and it is also the reason a fractured clavicle can be listed as the commonest fracture of childhood.",
        explanation: "The scapula is held to the trunk by muscle only, so the clavicle is the single bony strut. This is why a fall onto the shoulder breaks the clavicle in its middle third rather than dislocating the joint.",
      },
      {
        type: "question",
        prompt: "A patient falls onto an outstretched hand and cannot extend their wrist. Name the likely fracture and the nerve injured.",
        answer: "A mid-shaft fracture of the humerus, with the radial nerve caught in the spiral (radial) groove. Wrist drop is the signature, because the radial nerve supplies all the wrist and finger extensors.",
        explanation: "Note the difference from a surgical-neck fracture, which injures the axillary nerve and gives loss of shoulder abduction with a normal wrist.",
      },
      {
        type: "question",
        prompt: "Why does a fracture across the waist of the scaphoid threaten the proximal pole specifically?",
        answer: "Because the scaphoid's blood supply enters at its distal end and runs retrograde, so a waist fracture cuts off the proximal fragment from its supply, producing avascular necrosis.",
        explanation: "This retrograde supply is unusual and clinically decisive — it converts a fracture that looks trivial on the first X-ray into a long-term arthritic wrist.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which set lists the bones of the upper limb in correct proximal-to-distal order?",
        options: [
          "Clavicle and scapula, humerus, radius and ulna, carpals, metacarpals, phalanges",
          "Clavicle and scapula, humerus, tibia and fibula, tarsals, metatarsals, phalanges",
          "Scapula only, humerus, ulna only, carpals, metatarsals, phalanges",
          "Clavicle, femur, patella, tibia, tarsals, metatarsals",
        ],
        correctIndex: 0,
        explanation: "The pectoral girdle carries the arm, the arm carries the two-bone forearm, and the forearm carries the hand: carpals, then metacarpals, then phalanges. Tibia, fibula, femur, patella, tarsals and metatarsals are lower-limb bones.",
      },
      {
        type: "mcq",
        stem: "A fracture of the surgical neck of the humerus is most likely to injure which nerve?",
        options: ["The radial nerve", "The median nerve", "The axillary nerve", "The ulnar nerve"],
        correctIndex: 2,
        explanation: "The axillary nerve winds around the surgical neck with the posterior humeral circumflex artery. Injury paralyses deltoid, so the arm cannot be abducted, and sensation is lost over the regimental badge area.",
      },
      {
        type: "mcq",
        stem: "Which statement about the forearm in the anatomical position is correct?",
        options: [
          "The radius lies medial to the ulna", "The radius lies lateral to the ulna", "The ulna lies lateral to the radius", "The two bones are crossed over at all times",
        ],
        correctIndex: 1,
        explanation: "With the palm facing forward the forearm is supinated and the radius runs lateral to the ulna. Pronation crosses the radius over the ulna — but the anatomical definition is written from the anatomical position.",
      },
      {
        type: "mcq",
        stem: "Which carpal bone is most commonly fractured, and by which mechanism?",
        options: [
          "Lunate, by a direct blow to the hypothenar eminence",
          "Scaphoid, by a fall on the outstretched hand",
          "Pisiform, by a fall onto a flexed wrist",
          "Hamate, by a direct punch injury",
        ],
        correctIndex: 1,
        explanation: "The scaphoid, classically in a fall on the outstretched hand, with snuffbox tenderness. Its retrograde blood supply means a waist fracture risks avascular necrosis of the proximal pole.",
      },
      {
        type: "mcq",
        stem: "Which joint's stability comes almost entirely from muscle rather than bone?",
        options: ["The elbow", "The wrist", "The glenohumeral joint", "The interphalangeal joints"],
        correctIndex: 2,
        explanation: "The glenoid cavity is shallow, so the humeral head is held by the rotator cuff tendons. That is the reason the shoulder is the most mobile and the most frequently dislocated joint in the body.",
      },
      {
        type: "mcq",
        stem: "Which structure rotates the head of the radius during pronation and supination?",
        options: [
          "The capitulum of the humerus", "The annular ligament around the radial head", "The interosseous membrane", "The trochlear notch of the ulna",
        ],
        correctIndex: 1,
        explanation: "The annular ligament forms a ring around the radial head at the proximal radioulnar joint, letting the disc-shaped head spin. The capitulum is a hinge surface, the interosseous membrane ties the shafts together, and the trochlear notch grips the humerus.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The upper limb is clavicle and scapula, humerus, radius and ulna, carpals, metacarpals and phalanges, in that order from the trunk out. The sternoclavicular joint is its only direct link to the axial skeleton, and the glenohumeral joint trades stability for the range that makes the hand useful. Three humeral landmarks map to three nerves — surgical neck to axillary, mid-shaft to radial, medial epicondyle to ulnar — and the scaphoid's retrograde blood supply is why a snuffbox injury is immobilised even when the first film looks clean.",
      },
      {
        type: "paragraph",
        text: "Next: the muscles of the pectoral region. You will meet pectoralis major and minor, serratus anterior and the intercostals, and the long thoracic nerve whose injury turns a pushed-out arm into a winged scapula.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Muscles of the pectoral region (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the muscles of the pectoral region and state the origin, insertion, action and nerve supply of each; explain how a muscle's insertion decides what it moves; describe the arrangement of the intercostal muscles and the position of the intercostal neurovascular bundle; list the muscles that act in quiet and in forced inspiration and expiration; and recognise a winged scapula and explain which nerve lesion produces it.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2. You need the bones of the thoracic limb and shoulder girdle — the clavicle, scapula and ribs that these muscles originate from and insert upon.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Insertion decides action",
        text: "A muscle moves the structure it is attached to that is further from the body's centre — its insertion — and stabilises the one nearer the centre, its origin. Learn the insertions and you can work out the actions without memorising them separately.",
      },
      {
        type: "paragraph",
        text: "You will be asked to learn dozens of muscles. Trying to memorise origin, insertion, action and nerve as four independent facts does not scale. The scalable method is to derive three of the four from one: fix the origin in your mind, then follow the muscle to where it inserts, and the action simply describes what that insertion can do. Pectoralis major runs from the sternum and ribs to the humerus, so it moves the arm — flexion, adduction, medial rotation. Pectoralis minor runs from ribs to the coracoid process of the scapula, so it moves the scapula instead. Same region, same name, entirely different jobs.",
      },

      { type: "heading", level: 2, text: "The muscles of the region" },
      {
        type: "table",
        headers: ["Muscle", "Origin", "Insertion", "Actions", "Nerve supply"],
        rows: [
          ["Pectoralis major (clavicular head)", "Medial half of the clavicle", "Lateral lip of the intertubercular sulcus of the humerus", "Flexes the arm", "Lateral and medial pectoral nerves"],
          ["Pectoralis major (sternocostial head)", "Sternum and upper six costal cartilages", "Same crest, humerus", "Adducts and medially rotates the arm", "Lateral and medial pectoral nerves"],
          ["Pectoralis minor", "Ribs 3-5", "Coracoid process of the scapula", "Protracts and depresses the scapula; steadies it", "Medial pectoral nerve"],
          ["Serratus anterior", "Ribs 1-8 (upper eight)", "Medial border of the scapula", "Protracts the scapula and holds it to the thoracic wall; rotates it upward", "Long thoracic nerve (C5-C7)"],
          ["Subclavius", "First costal cartilage", "Clavicle (middle third, inferior surface)", "Depresses and steadies the clavicle", "Nerve to subclavius"],
        ],
      },
      {
        type: "paragraph",
        text: "Two of these are worth dwelling on because their clinical signs are famous. Serratus anterior pulls the whole medial border of the scapula forward against the chest wall; when the long thoracic nerve is damaged — in an axillary node clearance, or by a direct blow to the lateral chest wall, or as a neuropathy — the scapula lifts away from the ribs when the patient pushes against a wall, giving the winged scapula. Pectoralis minor, in the same region, becomes an accessory muscle of inspiration: with the scapula fixed by other muscles, its contraction elevates the ribs it arises from, which is why patients with obstructive lung disease are seen using it.",
      },

      { type: "heading", level: 2, text: "Worked example: the intercostal space" },
      {
        type: "paragraph",
        text: "Between any two ribs lies a space occupied by three layers of muscle and, tucked along the lower border of the upper rib, a neurovascular bundle. The muscle layers are, from without inwards: external intercostal, internal intercostal, and innermost intercostal. Their fibres run in different directions, which is how you tell the layers apart under a microscope — external fibres pass downwards and forwards, internal fibres run downwards and backwards.",
      },
      {
        type: "paragraph",
        text: "Function follows fibre direction and rib anatomy: the external intercostals raise the ribs, so they are inspiratory; the internal intercostals lower the ribs, so they act in forced expiration. Quiet expiration needs no muscle at all — it is the elastic recoil of the lung and chest wall.",
      },
      {
        type: "table",
        headers: ["Structure", "Position in the intercostal space", "Consequence"],
        rows: [
          ["Intercostal vein", "Superior — immediately below the rib above", "First to be injured by a rib fracture's jagged edge"],
          ["Intercostal artery", "Middle of the bundle", "Collateral branches run along the upper border of the rib below"],
          ["Intercostal nerve", "Inferior — least protected, against the rib below", "Compression by a tumour or a fractured rib gives the band-like pain of shingles or intercostal neuralgia"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The order from top to bottom of the bundle is vein, artery, nerve — VAN. Because the nerve lies lowest and therefore closest to the rib below, a chest drain or a needle is always inserted near the upper border of the rib below the space you want, never over the lower border of the rib above.",
      },

      { type: "heading", level: 2, text: "Muscles of respiration, in order of demand" },
      {
        type: "table",
        headers: ["Phase", "Muscles", "When they matter"],
        rows: [
          ["Quiet inspiration", "Diaphragm (about 75% of the work), external intercostals", "At rest, always"],
          ["Deep / forced inspiration", "Adds scalenes, sternocleidomastoid, pectoralis minor, serratus anterior", "Exercise, or any patient struggling to breathe — visible as accessory muscle use"],
          ["Quiet expiration", "No muscle — passive elastic recoil", "At rest"],
          ["Forced expiration", "Internal and innermost intercostals, plus the abdominal wall", "Coughing, sneezing, blowing — the reason abdominal surgery hurts to cough"],
        ],
      },
      {
        type: "paragraph",
        text: "The diaphragm is innervated by the phrenic nerve from C3, C4 and C5, and it is the reason a complete injury to the cervical spinal cord above that level is fatal without ventilation. A useful bedside rule: if you can see the muscles of the neck and shoulder working to breathe, the patient is spending most of their effort on the mechanics of moving air rather than on their disease.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: the winged scapula and the mastectomy" },
      {
        type: "paragraph",
        text: "A patient who has had an axillary lymph node clearance for breast cancer develops difficulty raising the arm above the head. On examination, when asked to push against a wall with both hands, one medial border of the scapula lifts off the thoracic wall like a wing. The lesion is in the long thoracic nerve to serratus anterior, and the mechanism is traction on the nerve during the axillary dissection.",
      },
      {
        type: "paragraph",
        text: "The explanation is mechanical, not mysterious. Serratus anterior wraps the chest wall and pulls the medial border of the scapula forward, holding it flat against the ribs. Without it, the unopposed pull of the other scapular muscles rotates the scapula so its medial border stands proud. The functional deficit follows: raising the arm above the head requires the scapula to rotate upward, and that rotation is serratus anterior's job. So the patient can abduct to about ninety degrees using deltoid alone, and then stops.",
      },
      {
        type: "question",
        prompt: "Why does a patient with a winged scapula lose the ability to raise the arm above the head but not the first ninety degrees of abduction?",
        answer: "The first phase of abduction is deltoid and supraspinatus acting on the glenohumeral joint. Above ninety degrees the scapula must rotate upward to keep the glenoid facing up, and that rotation is serratus anterior's action — so when serratus fails, abduction stops at the point where the joint runs out of range.",
        explanation: "This is why scapulohumeral rhythm is taught as one concept: limb movement and shoulder-girdle movement are one action, and a nerve lesion reveals which part is broken.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing the winged scapula to pectoralis major or to the axillary nerve. The axillary nerve injury gives a shoulder that cannot abduct, with a sensory patch over the badge area. The wing is serratus anterior and the long thoracic nerve — a different nerve, a different test, a different disability.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying expiration is active at rest. It is passive — elastic recoil. Intercostal and abdominal muscles are recruited only for forced expiration, which is why a patient with broken ribs who is breathing quietly may still be comfortable and will not be once they cough.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Inserting a chest drain over the lower border of the rib above. The neurovascular bundle sits there. Stay at or above the upper border of the rib below.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Pectoralis major and pectoralis minor both arise from the ribs. Why does one move the arm and the other move the scapula?",
        answer: "Because their insertions differ: major inserts on the humerus and therefore moves the arm, while minor inserts on the coracoid process of the scapula and therefore moves the scapula.",
        explanation: "Insertion, not origin, decides the action. The shared origin explains why the two muscles look contiguous without implying they do the same job.",
      },
      {
        type: "question",
        prompt: "In which order do you encounter vein, artery and nerve as you move from the top to the bottom of an intercostal space?",
        answer: "Vein, then artery, then nerve — VAN, running along the costal groove of the rib above, with the nerve lowest and least protected.",
        explanation: "The order also explains why intercostal nerve blocks and chest drains are placed against the upper border of the rib below the target space.",
      },
      {
        type: "question",
        prompt: "Which muscles are recruited first when breathing becomes difficult, and what does their use signify?",
        answer: "The scalenes, sternocleidomastoid and pectoralis minor — accessory muscles of inspiration. Visible use of them means the diaphragm and external intercostals can no longer do the work alone.",
        explanation: "Accessory muscle use is a sign of increased work of breathing and appears early in any disease that stiffens the lungs or narrows the airways.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient cannot keep the medial border of the scapula against the chest wall when pushing against a wall. Which nerve is damaged?",
        options: ["The axillary nerve", "The long thoracic nerve", "The thoracodorsal nerve", "The dorsal scapular nerve"],
        correctIndex: 1,
        explanation: "Serratus anterior, supplied by the long thoracic nerve (C5-C7), holds the scapula flat. Its failure produces the wing. The axillary nerve supplies deltoid; thoracodorsal supplies latissimus dorsi; dorsal scapular supplies the rhomboids.",
      },
      {
        type: "mcq",
        stem: "Which statement correctly separates pectoralis major from pectoralis minor?",
        options: [
          "Both move the arm, and the difference is only their size",
          "Major moves the arm — flexion, adduction and medial rotation — while minor protracts and depresses the scapula",
          "Major rotates the scapula and minor abducts the arm",
          "Neither moves a joint; both tense the chest wall",
        ],
        correctIndex: 1,
        explanation: "Insertion decides the action: major inserts on the humerus, so it moves the arm; minor inserts on the coracoid process, so it moves and steadies the scapula.",
      },
      {
        type: "mcq",
        stem: "In a bench press, which action is pectoralis major performing during the upward phase?",
        options: [
          "Lateral rotation of the arm", "Horizontal adduction of the arm against resistance", "Extension of the arm from a flexed position", "Retraction of the scapula",
        ],
        correctIndex: 1,
        explanation: "Pressing the bar up from the chest is horizontal adduction of the humerus, with medial rotation — the action of the sternocostial fibres of pectoralis major. Scapular retraction is trapezius/rhomboids, not pectoralis.",
      },
      {
        type: "mcq",
        stem: "Which muscle layer of the intercostal space is inspiratory?",
        options: ["The internal intercostals", "The innermost intercostals", "The external intercostals", "The transversus thoracis"],
        correctIndex: 2,
        explanation: "External intercostals raise the ribs and act in inspiration; internal and innermost intercostals lower them and act in forced expiration. Quiet expiration is passive recoil.",
      },
      {
        type: "mcq",
        stem: "Where does the intercostal nerve lie within the space, and why does it matter?",
        options: [
          "Highest in the bundle, so it is the best protected", "Lowest in the bundle, so drains are placed near the upper border of the rib below", "Between the two arteries, so it is spared in chest trauma", "Outside the space, in the costal groove of the rib below",
        ],
        correctIndex: 1,
        explanation: "The neurovascular bundle's order is vein, artery, nerve, so the nerve lies lowest and is the most vulnerable — which is why the safe insertion point is the upper border of the rib below the target space.",
      },
      {
        type: "mcq",
        stem: "Which spinal segments give rise to the phrenic nerve?",
        options: ["C1-C3", "C3-C5", "C5-T1", "T1-T4"],
        correctIndex: 1,
        explanation: "C3, 4 and 5 keep the diaphragm alive — the mnemonic that also tells you a cord lesion above this level is fatal without ventilation. C5-T1 is the brachial plexus; T1-T4 relates to cardiac sympathetic supply.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Pectoralis major flexes, adducts and medially rotates the arm because it inserts on the humerus; pectoralis minor moves the scapula because it inserts on the coracoid process; serratus anterior holds the scapula flat against the chest wall and is the muscle whose nerve — the long thoracic nerve — produces the winged scapula when it is injured. The intercostal spaces hold three muscle layers and a neurovascular bundle ordered vein, artery, nerve, with the nerve lowest, which is why drains go over the upper border of the rib below. The diaphragm, from C3-5, does most of the work of quiet inspiration.",
      },
      {
        type: "paragraph",
        text: "Next: the brachial plexus. You will follow five spinal nerve roots through their trunks, divisions, cords and five terminal branches, and see why each of those branches has the injury pattern it does.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Brachial plexus (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: recite the root-to-branch order of the brachial plexus (roots, trunks, divisions, cords, branches) with the spinal segments of each; name the five terminal branches and the muscles each supplies; state which cord each terminal branch comes from; and predict the motor and sensory deficit produced by injury to the upper trunk, the lower trunk, and each terminal branch.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-3. You need the upper limb skeleton and the pectoral and axillary region, because every muscle named here arises from and inserts upon those bones.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Brachial plexus",
        text: "The network of nerves that supplies the upper limb, formed from the anterior rami of C5, C6, C7, C8 and T1, which reorganise into trunks, then divisions, then cords, and finally into the named branches of the arm.",
      },
      {
        type: "paragraph",
        text: "The reason a five-root network exists at all is worth one sentence. Spinal nerves are laid out segmentally — one nerve per level of the cord — but a limb is not: it is a structure that needs many muscles to be driven by a coordinated set of nerves. A plexus is the sorting office: it takes five incoming deliveries and re-sorts them into five outgoing bundles, each carrying fibres from more than one root, so that a single branch like the radial nerve can drive every extensor of the limb even though those muscles are spread over three segments of the cord.",
      },

      { type: "heading", level: 2, text: "The order, and why it is the whole exam answer" },
      {
        type: "table",
        headers: ["Stage", "What forms", "From", "Memorable landmark"],
        rows: [
          ["Roots (5)", "Anterior rami C5-T1", "Scalene region, between scalenus anterior and medius", "Dorsal scapular and long thoracic nerves leave directly from roots"],
          ["Trunks (3)", "Upper (C5+C6), middle (C7), lower (C8+T1)", "Behind the clavicle, at the base of the neck", "Suprascapular and nerve to subclavius leave from trunks"],
          ["Divisions (6)", "Each trunk splits into an anterior and a posterior division", "Behind the clavicle", "Anterior divisions supply the former flexor compartment, posterior the extensor compartment"],
          ["Cords (3)", "Lateral, posterior and medial — named by their position around the axillary artery", "In the axilla", "Lateral and lateral pectoral; posterior gives subscapulars, thoracodorsal; medial gives medial pectoral and the cutaneous nerves of the arm and forearm"],
          ["Branches (5)", "Musculocutaneous, median, ulnar, radial, axillary", "Axilla and arm", "The five nerves you test on every weak arm"],
        ],
      },
      {
        type: "paragraph",
        text: "The reconstructions are the part learners find surprising. The lateral cord is the union of the anterior divisions of the upper and middle trunks; the posterior cord is the union of all three posterior divisions — the only cord to carry fibres from all five roots; and the medial cord is simply the anterior division of the lower trunk, carried on unchanged. So a single cord, the posterior, supplies everything in the extensor compartments, and that is why a lesion of the posterior cord is catastrophic in a specific way: it paralyses the whole extensor surface of the limb.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Root-trunk-division-cord-branch, in that order, is the answer to every written question about the plexus. If you cannot remember it, fix the roots first — the five segments are fixed, and everything downstream is derived from them by splitting and recombining.",
      },

      { type: "heading", level: 2, text: "The five terminal branches" },
      {
        type: "table",
        headers: ["Branch", "Segments", "From", "Muscles supplied", "Signature of injury"],
        rows: [
          ["Musculocutaneous", "C5-C7", "Lateral cord", "Coracobrachialis, biceps brachii, brachialis", "Weak elbow flexion and supination; sensory loss on the lateral forearm"],
          ["Median", "C5-T1", "Lateral root of lateral cord, medial root of medial cord", "All forearm flexors except flexor carpi ulnaris and the ulnar half of flexor digitorum profundus; thenar muscles except adductor pollicis; lumbricals 1 and 2", "Thenar wasting, 'hand of benediction' on making a fist, sensory loss over the palmar lateral 3.5 digits"],
          ["Ulnar", "C8-T1", "Medial cord", "Flexor carpi ulnaris, ulnar half of flexor digitorum profundus, hypothenar muscles, interossei, lumbricals 3 and 4, adductor pollicis", "Claw hand, sensory loss over the medial 1.5 digits, positive Froment's sign"],
          ["Radial", "C5-T1", "Posterior cord", "Triceps, brachioradialis, and all the extensors of the wrist and fingers", "Wrist drop; sensory loss over the dorsum of the first web space"],
          ["Axillary", "C5-C6", "Posterior cord", "Deltoid, teres minor", "Cannot abduct the arm; sensory loss over the regimental badge area"],
        ],
      },
      {
        type: "paragraph",
        text: "Two of those rows explain most of the clinical syndromes you will meet. The median nerve is the only branch formed from both the lateral and medial cords, which is why its innervation spans the full range C5 to T1: it supplies the flexor surface of the forearm and the thenar eminence, and it is the nerve compressed in carpal tunnel at the wrist. The radial nerve supplies every extensor because the posterior cord — its parent — carries all the extensor fibres from every root.",
      },

      { type: "heading", level: 2, text: "Worked example 1: Erb's palsy and the upper trunk" },
      {
        type: "paragraph",
        text: "A newborn with shoulder dystocia is delivered with the neck stretched sideways, and is found afterwards with one arm hanging at the side, turned inward, with the elbow straight and the forearm pronated — the 'waiter's tip' posture. The lesion is in the upper trunk of the plexus, C5 and C6, named Erb-Duchenne palsy.",
      },
      {
        type: "paragraph",
        text: "The posture is not arbitrary; it is the unopposed action of the muscles whose nerves were spared. C5 and C6 supply the abductors and external rotators of the shoulder — deltoid, supraspinatus and infraspinatus — and the flexors of the elbow, biceps and brachialis. When those are paralysed, what remains is the adductor (pectoralis major, which also has C7-C8 supply) and the internal rotator (subscapularis, C5-C7 but partly spared in many cases), and the arm is pulled into adduction and medial rotation. The elbow extends because the flexors are gone and triceps (C6-C8, partly from lower roots) still works. The same injury occurs in an adult who falls heavily onto the shoulder, or in a motorcyclist whose helmeted head is forced away from the shoulder.",
      },

      { type: "heading", level: 2, text: "Worked example 2: Klumpke's palsy and the lower trunk" },
      {
        type: "paragraph",
        text: "The mirror-image lesion is rarer and tells you something different. Klumpke's palsy is an injury of the lower trunk, C8 and T1, and it occurs when the arm is pulled suddenly upward — a fall from a height onto a hand that catches something, or a birth where the arm is pulled. The deficit is in the intrinsic muscles of the hand: a claw hand, with the fingers Flexed at the interphalangeal joints and hyperextended at the knuckles, because the lumbricals and interossei that would flex the knuckles and extend the interphalangeal joints are paralysed.",
      },
      {
        type: "paragraph",
        text: "The T1 deficit carries an extra consequence that makes the diagnosis. T1 carries the sympathetic outflow to the head and neck on its way through the plexus, so a lower-trunk injury can also produce Horner's syndrome on that side — a drooping eyelid, a constricted pupil, and dryness of the face. If you see a claw hand with a drooping eyelid, think lower trunk — and in an adult, think of an apical lung tumour (Pancoast tumour) invading the plexus before you think of trauma.",
      },
      {
        type: "table",
        headers: ["Feature", "Erb-Duchenne (upper trunk, C5-C6)", "Klumpke (lower trunk, C8-T1)"],
        rows: [
          ["Mechanism", "Neck forced away from the shoulder; shoulder dystocia", "Arm forced upward; fall onto a caught hand"],
          ["Muscles lost", "Shoulder abductors/external rotators; elbow flexors", "Intrinsic hand muscles"],
          ["Posture", "Waiter's tip: arm adducted, medially rotated, elbow extended, forearm pronated", "Claw hand: knuckles hyperextended, finger joints flexed"],
          ["Associated sign", "Sensory loss over the lateral arm and forearm", "Horner's syndrome if the T1 sympathetic fibres are caught"],
          ["Adult cause", "Motorcycle fall; forceful shoulder depression", "Apical lung tumour; cervical rib; rarely trauma"],
        ],
      },

      { type: "heading", level: 2, text: "Reading a weak arm at the bedside" },
      {
        type: "paragraph",
        text: "Nerve examination of a weak arm can be reduced to four tests, each isolating one branch. Ask the patient to flex the elbow against resistance — musculocutaneous. Ask them to make a fist and feel the bulk of the thenar eminence, then oppose the thumb — median. Ask them to spread the fingers against your fingers, or hold a card between two fingers — ulnar. Ask them to extend the wrist and hold your hand away — radial. And ask them to lift the arm from the side with your hand resting on the shoulder — axillary. The pattern that fails tells you the nerve; the nerve tells you the cord, the trunk, and finally the segment of the cord that is injured.",
      },
      {
        type: "question",
        prompt: "A patient has a claw hand, weakness of finger abduction, and a partial Horner's syndrome on the same side. Where is the lesion, and which cord of the plexus is involved?",
        answer: "The lower trunk (C8-T1) — carried in the medial cord — and the sympathetic fibres travelling with T1. In an adult without trauma, an apical lung tumour invading the plexus is the likely cause.",
        explanation: "The hand's intrinsic muscles are mostly T1, so a claw hand plus Horner's localises to the root of T1 itself rather than to a peripheral branch.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the cords are named for the structures they lie between rather than around the axillary artery. They are literal: lateral, medial and posterior to the second part of the axillary artery. This is the single fact that makes the cords memorable, and it is how you identify them in a dissection or on an image.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing the claw hand to median nerve injury. Median nerve injury causes thenar wasting and difficulty opposing the thumb; the claw hand of ulnar nerve injury arises because the lumbricals that extend the interphalangeal joints are lost — this is an ulnar sign, and Froment's sign confirms it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that the radial nerve supplies the triceps and therefore elbow extension. Wrist drop is the headline of radial nerve injury, but a high lesion — above the spiral groove — also weakens the triceps, and that difference localises the lesion along the nerve's course.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which spinal nerve roots form the brachial plexus?",
        answer: "C5, C6, C7, C8 and T1.",
        explanation: "Five roots. If the plexus appears to start at C4 it is 'prefixed'; if it includes T2 it is 'postfixed' — both are anatomical variants worth knowing exist.",
      },
      {
        type: "question",
        prompt: "Which single cord contains fibres from all five roots, and why?",
        answer: "The posterior cord, because it is formed from the posterior divisions of all three trunks — upper, middle and lower — and therefore carries fibres from the whole range C5 to T1.",
        explanation: "That is why the posterior cord's two main branches, the radial and axillary nerves, both span the full root range and supply extensor and shoulder abducting musculature.",
      },
      {
        type: "question",
        prompt: "Why is the median nerve formed from two cords while the radial and axillary nerves are formed from one?",
        answer: "The median nerve carries fibres from the whole root range C5-T1, which requires a contribution from both the lateral cord (upper roots) and the medial cord (lower roots). The radial and axillary nerves carry only posterior-division fibres, which have all already been consolidated into the posterior cord.",
        explanation: "The number of cords a branch draws from is a direct readout of how wide its root range is — a useful way to check your memory of any branch.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is the correct order of components in the brachial plexus?",
        options: [
          "Roots, divisions, trunks, cords, branches", "Roots, trunks, divisions, cords, branches", "Trunks, roots, cords, divisions, branches", "Cords, trunks, divisions, roots, branches",
        ],
        correctIndex: 1,
        explanation: "Roots (C5-T1) join into trunks, each trunk splits into anterior and posterior divisions, the divisions recombine into cords, and the cords give rise to the branches.",
      },
      {
        type: "mcq",
        stem: "A newborn presents with the arm adducted, internally rotated, elbow extended and forearm pronated after a difficult delivery. Which structure is injured?",
        options: ["The lower trunk of the brachial plexus", "The upper trunk of the brachial plexus", "The axillary nerve alone", "The radial nerve in the spiral groove"],
        correctIndex: 1,
        explanation: "This is Erb-Duchenne palsy: injury of the upper trunk (C5-C6), typically from shoulder dystocia. The posture is the unopposed action of the spared adductors and internal rotators.",
      },
      {
        type: "mcq",
        stem: "Which branch of the brachial plexus supplies the deltoid and teres minor?",
        options: ["The axillary nerve", "The suprascapular nerve", "The radial nerve", "The musculocutaneous nerve"],
        correctIndex: 0,
        explanation: "The axillary nerve (C5-C6) leaves the posterior cord, passes through the quadrangular space and around the surgical neck of the humerus — which is why a surgical-neck fracture paralyses it.",
      },
      {
        type: "mcq",
        stem: "A patient cannot extend the wrist or fingers and has sensory loss over the dorsum of the first web space. Which nerve is most likely injured?",
        options: ["The median nerve", "The ulnar nerve", "The radial nerve", "The musculocutaneous nerve"],
        correctIndex: 2,
        explanation: "The radial nerve supplies all the extensors of the wrist and fingers, and its superficial branch supplies the dorsum of the first web space — the classic 'wrist drop' of a mid-humeral fracture.",
      },
      {
        type: "mcq",
        stem: "Which statement about the cords of the brachial plexus is correct?",
        options: [
          "They are named for the axillary artery they surround", "They are named for the muscles they supply", "They lie distal to the terminal branches", "There are four cords, one per division",
        ],
        correctIndex: 0,
        explanation: "The three cords are named literally — lateral, posterior and medial — for their position relative to the second part of the axillary artery. There are three, not four, and they lie proximal to the branches they give rise to.",
      },
      {
        type: "mcq",
        stem: "Which nerve supplies flexor carpi ulnaris and the interossei of the hand?",
        options: ["The median nerve", "The radial nerve", "The ulnar nerve", "The axillary nerve"],
        correctIndex: 2,
        explanation: "The ulnar nerve (C8-T1) supplies flexor carpi ulnaris, the ulnar half of flexor digitorum profundus and the intrinsic hand muscles apart from the thenar lateral two lumbricals — giving the claw hand and positive Froment's sign when injured.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The brachial plexus reorganises the anterior rami of C5-T1 into three trunks, six divisions and three cords, which lie around the axillary artery and give rise to five terminal branches. The posterior cord, carrying all three posterior divisions, supplies the entire extensor surface through the radial nerve and the shoulder abductors through the axillary nerve; the lateral and medial cords together form the median nerve. Upper-trunk injury gives the waiter's tip posture of Erb-Duchenne palsy; lower-trunk injury gives the claw hand of Klumpke's palsy, sometimes with Horner's syndrome.",
      },
      {
        type: "paragraph",
        text: "Next: the axilla. You will map the pyramid-shaped space that carries the plexus, the axillary vessels and the lymph nodes that drain the breast — the region every mastectomy and every shoulder operation must respect.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Axilla and its contents (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define the axilla as a pyramid and name its boundary walls; list its contents and state the position of the axillary artery and vein within them; describe the three parts of the axillary artery and the branches arising from each; name the five groups of axillary lymph nodes and explain their clinical levels in breast cancer; and identify the structures that pass through the quadrangular and triangular spaces.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-4. You need the brachial plexus (roots through cords) and the pectoral muscles, because the axilla is where the plexus reorganises into its cords.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Axilla",
        text: "The pyramid-shaped space between the upper limb and the chest wall — apex superiorly at the cervicoaxillary canal, base inferiorly at the axillary fascia — through which every structure travelling between the trunk and the upper limb must pass.",
      },
      {
        type: "paragraph",
        text: "The word 'gateway' is used so often in anatomy that it should be treated with suspicion, but here it is literally true. The axilla is a single funnel: structures enter at its apex, above the first rib and behind the clavicle, and leave through its base into the arm. There is no other route. That is why a lesion inside the axilla — a tumour, a haematoma, an enlarged lymph node — produces symptoms in the limb, and why a surgeon operating on an axillary lymph node is operating in a space crowded with the nerves that move the hand.",
      },

      { type: "heading", level: 2, text: "The walls of the pyramid" },
      {
        type: "table",
        headers: ["Wall", "Structures forming it"],
        rows: [
          ["Apex (opening)", "Cervicoaxillary canal: the first rib, the clavicle, and the superior border of the scapula — the route in from the neck"],
          ["Base (floor)", "Axillary fascia and the skin of the armpit"],
          ["Anterior wall", "Pectoralis major, overlying pectoralis minor and the clavipectoral fascia between them"],
          ["Posterior wall", "Subscapularis above; teres major and latissimus dorsi below"],
          ["Medial wall", "Serratus anterior over ribs 1-4, with the intercostal muscles between them"],
          ["Lateral wall", "The intertubercular sulcus of the humerus, with the short head of biceps and coracobrachialis"],
        ],
      },
      {
        type: "paragraph",
        text: "Two of the walls carry a clinical consequence you will meet. The anterior wall holds pectoralis minor, and its medial border is the line that divides the axillary artery into three surgical parts and the axillary lymph nodes into three clinical levels. The medial wall is serratus anterior, the muscle whose nerve — the long thoracic nerve — runs down it; a surgeon clearing axillary nodes for breast cancer meets that nerve where it lies on the wall, and injury to it produces the winged scapula you met in the previous lesson.",
      },

      { type: "heading", level: 2, text: "Worked example: the axillary artery in three parts" },
      {
        type: "paragraph",
        text: "The axillary artery is divided by pectoralis minor into three parts, and each part has its branches. Learning the parts in order is the difference between remembering this and forgetting it.",
      },
      {
        type: "table",
        headers: ["Part", "Extent", "Branches"],
        rows: [
          ["First part", "From the first rib to the upper border of pectoralis minor", "Superior thoracic artery"],
          ["Second part", "Deep to pectoralis minor", "Thoraco-acromial (pectoral, acromial, clavicular and deltoid branches) and lateral thoracic artery"],
          ["Third part", "From the lower border of pectoralis minor to the lower border of teres major", "Subscapular artery (which gives off the circumflex scapular and the thoracodorsal), anterior humeral circumflex, posterior humeral circumflex"],
        ],
      },
      {
        type: "paragraph",
        text: "The third part is the surgical part: it is the segment nearest the arm, where an injury to the artery is ligated and where the subscapular artery gives off the branch that supplies latissimus dorsi. The thoracodorsal artery is worth remembering on its own, because it is the pedicle a surgeon raises to move latissimus dorsi as a flap. The two circumflex arteries encircle the surgical neck of the humerus and anastomose around it — which is also why a surgical-neck fracture bleeds and injures the axillary nerve in the same region.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The axillary artery becomes the brachial artery at the lower border of teres major. That is the boundary you should hold: the name changes once the arm proper begins, and the branches of the brachial artery — profunda brachii, superior and inferior ulnar collateral, nutrient — are named for the arm and forearm, not the shoulder.",
      },

      { type: "heading", level: 2, text: "Axillary lymph nodes and breast cancer levels" },
      {
        type: "paragraph",
        text: "About twenty to thirty lymph nodes lie in the axilla, arranged in five groups that follow the blood vessels they drain with: anterior (pectoral) nodes along the lateral thoracic vessels drain the breast and anterior chest wall; posterior (subscapular) nodes drain the back; lateral nodes along the distal axillary vein drain most of the upper limb; central nodes sit in the fat of the axilla proper; and apical nodes, at the apex, receive from all the others and drain onward into the subclavian trunk.",
      },
      {
        type: "paragraph",
        text: "Clinically the nodes are grouped into three levels using pectoralis minor as the dividing line, and the level decides prognosis and treatment. Level I nodes lie lateral to (below) the lateral border of pectoralis minor; level II nodes lie behind it; level III nodes lie medial to its medial border, at the apex. A sentinel node biopsy — injecting a blue dye or a radioactive tracer at the tumour and removing the first node it reaches — is now the standard way to stage the axilla without clearing it completely.",
      },
      {
        type: "table",
        headers: ["Level", "Position relative to pectoralis minor", "Significance in breast cancer"],
        rows: [
          ["Level I", "Lateral to the lateral border", "First involved by drainage from most of the breast; removed in a level clearance"],
          ["Level II", "Posterior / deep to the muscle", "Involved as disease spreads; the interpectoral (Rotter's) nodes may be involved directly"],
          ["Level III", "Medial to the medial border, at the apex", "Involved late; the strongest adverse prognostic sign; drains into the subclavian trunk"],
        ],
      },

      { type: "heading", level: 2, text: "The two small spaces" },
      {
        type: "paragraph",
        text: "Two gaps in the posterior wall of the axilla are worth memorising because each carries one structure you can then identify by elimination. The quadrangular space is bounded by teres minor above, teres major below, the long head of triceps medially, and the surgical neck of the humerus laterally; the axillary nerve and the posterior humeral circumflex artery pass through it. The triangular space lies below, bounded by teres minor, teres major and the long head of triceps, and carries the circumflex scapular artery.",
      },
      {
        type: "question",
        prompt: "Why does a fracture of the surgical neck of the humerus injure the axillary nerve specifically, and not the radial nerve?",
        answer: "Because the axillary nerve and the posterior humeral circumflex artery wrap around the surgical neck in the quadrangular space, whereas the radial nerve lies in the mid-shaft spiral groove further down. Same bone, different landmark, different nerve.",
        explanation: "It is the landmark that determines the nerve, and the surgical neck is the landmark where the axillary nerve lies directly against the bone.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Putting the axillary vein inside the axillary artery's sheath or confusing their relations. The vein lies medial to the artery, and the three cords of the brachial plexus are named for their position around the second part of the artery — lateral, medial and posterior to it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying that a breast tumour drains first to the apical nodes. It drains first to the anterior (pectoral) group along the lateral thoracic vessels, and only then centrally and apically. The apical group is late.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Describing the long thoracic nerve as lying inside the axillary sheath with the plexus. It runs on the medial wall of the axilla over serratus anterior, outside the sheath, and it can be injured in isolation — which is exactly why an axillary clearance can produce a winged scapula with the limb otherwise intact.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A surgeon enters the axilla. Which structures must she be aware of among its contents?",
        answer: "The axillary artery and its branches, the axillary vein and its tributaries, the cords and branches of the brachial plexus inside the axillary sheath, the five groups of axillary lymph nodes, and the fat surrounding them.",
        explanation: "The axilla is the single funnel between trunk and limb, so every vessel and nerve of the upper limb passes through it — which is what makes an axillary operation both useful and dangerous.",
      },
      {
        type: "question",
        prompt: "Name the boundaries of the quadrangular space and what passes through it.",
        answer: "Teres minor superiorly, teres major inferiorly, the long head of triceps medially, and the surgical neck of the humerus laterally. The axillary nerve and the posterior humeral circumflex artery pass through.",
        explanation: "Memorising this four-sided space is how you identify both structures at once, and it explains the pattern of a surgical-neck fracture.",
      },
      {
        type: "question",
        prompt: "Why is the pectoralis minor muscle so important in describing this region?",
        answer: "Because it divides the axillary artery into three surgical parts and the axillary lymph nodes into three clinical levels, and it is the wall against which a surgeon recognises what level they are operating at.",
        explanation: "One small muscle turns the anatomy of the axilla into a coordinate system — which is why examiners ask about it rather than about the fat.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which structure forms the anterior wall of the axilla?",
        options: [
          "Subscapularis and teres major", "Serratus anterior over ribs 1-4", "Pectoralis major overlying pectoralis minor and the clavipectoral fascia", "The intertubercular sulcus of the humerus with biceps and coracobrachialis",
        ],
        correctIndex: 2,
        explanation: "The anterior wall is pectoralis major over pectoralis minor. Subscapularis/teres major form the posterior wall, serratus anterior the medial wall, and the intertubercular sulcus the lateral wall.",
      },
      {
        type: "mcq",
        stem: "Which branch of the axillary artery supplies latissimus dorsi?",
        options: ["The superior thoracic artery", "The lateral thoracic artery", "The thoracodorsal artery", "The anterior humeral circumflex artery"],
        correctIndex: 2,
        explanation: "The subscapular artery gives off the thoracodorsal artery, which runs down the posterior wall to latissimus dorsi — the pedicle used in a latissimus dorsi flap.",
      },
      {
        type: "mcq",
        stem: "In breast cancer staging, level II axillary nodes are defined by their position:",
        options: ["Lateral to the lateral border of pectoralis minor", "Deep to pectoralis minor", "Medial to the medial border of pectoralis minor, at the apex", "Within the breast substance itself"],
        correctIndex: 1,
        explanation: "Level I is lateral to pectoralis minor, level II is deep (posterior) to it, level III is medial to its medial border at the apex. The levels are measured against pectoralis minor, not against the pectoralis major or the breast.",
      },
      {
        type: "mcq",
        stem: "Which nerves and artery pass through the quadrangular space?",
        options: [
          "The radial nerve and profunda brachii artery", "The axillary nerve and posterior humeral circumflex artery", "The musculocutaneous nerve and anterior humeral circumflex artery", "The suprascapular nerve and circumflex scapular artery",
        ],
        correctIndex: 1,
        explanation: "The quadrangular space — teres minor, teres major, long head of triceps, surgical neck of the humerus — carries the axillary nerve and posterior humeral circumflex artery. The suprascapular nerve passes through the suprascapular notch, a different space entirely.",
      },
      {
        type: "mcq",
        stem: "At which structure does the axillary artery become the brachial artery?",
        options: ["The first rib", "The upper border of pectoralis minor", "The lower border of pectoralis minor", "The lower border of teres major"],
        correctIndex: 3,
        explanation: "The axillary artery ends, and the brachial artery begins, at the lower border of teres major. Pectoralis minor's borders divide the axillary artery into its three parts but do not rename it.",
      },
      {
        type: "mcq",
        stem: "Which is correct about the relation of the axillary vein to the axillary artery?",
        options: ["It lies lateral to the artery", "It lies posterior to the artery", "It lies medial to the artery", "It lies anterior and superior to the artery in the axillary sheath"],
        correctIndex: 2,
        explanation: "The vein lies medial to the artery, and the brachial plexus cords take their names from their positions around the second part of that artery — lateral, medial and posterior.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The axilla is a pyramid — apex above the first rib behind the clavicle, base at the axillary fascia — through which everything between trunk and limb passes. Pectoralis minor divides the axillary artery into three parts, each with its own branches, and divides the axillary lymph nodes into the three clinical levels used to stage breast cancer. The quadrangular space carries the axillary nerve and the posterior circumflex humeral artery, which is why a surgical-neck fracture injures that nerve.",
      },
      {
        type: "paragraph",
        text: "Next: the thoracic wall. You will count the twelve ribs and their two vertebral joints, find the neurovascular bundle in the costal groove, and learn why the sternal angle is the most useful landmark in the whole of clinical examination.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Thoracic wall and intercostal space (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: classify the twelve ribs as true, false or floating and describe the articulations of a typical rib; identify the atypical ribs 1, 2, 10, 11 and 12 by their distinguishing features; state the contents and order of the intercostal neurovascular bundle and the rule it gives for safe chest drain insertion; describe the pump-handle and bucket-handle movements of the ribs and which breaths each serves; and explain why the sternal angle is the most useful surface landmark in clinical examination.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-3. You need the pectoral muscles and intercostal spaces from lesson 3, and the planes and directional terms from lesson 1.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Typical rib",
        text: "A rib with the full set of parts: a head with two articular facets, a neck, a tubercle with an articular facet, and a long shaft carrying a costal groove along its lower border. Ribs 3-9 are typical; everything else is atypical in some way.",
      },
      {
        type: "paragraph",
        text: "The thorax is built as a pump, and the ribs are its bellows' frame. Each rib articulates with the spine at two points — the head with the bodies of two adjacent vertebrae, the tubercle with the transverse process of its own vertebra — and those two joints define an axis about which the rib rotates. Rotate it and the front of the rib lifts: the sternum moves forward and upward, and the volume of the chest changes. Everything in this lesson is a variation on that single mechanical idea.",
      },

      { type: "heading", level: 2, text: "Counting and classifying the ribs" },
      {
        type: "table",
        headers: ["Group", "Ribs", "Defining feature"],
        rows: [
          ["True ribs", "1-7", "Each costal cartilage articulates directly with the sternum"],
          ["False ribs", "8-10", "Each costal cartilage joins the cartilage of the rib above, so they reach the sternum indirectly"],
          ["Floating ribs", "11-12", "No sternal connection at all; the anterior end lies free in the abdominal wall"],
        ],
      },
      {
        type: "paragraph",
        text: "Learn the atypical ribs as exceptions to the typical pattern, because they are asked for individually. Rib 1 is flat and broad, with a scalene tubercle on its upper surface carrying a groove for the subclavian vein in front and the subclavian artery behind — and the lower trunk of the brachial plexus runs above the artery, so all three structures are crowded in the space between the scalene muscles. A cervical rib, an extra rib arising from C7, narrows that same space and compresses the lower trunk, producing weakness of the intrinsic hand muscles and paraesthesia in the C8-T1 distribution: thoracic outlet syndrome.",
      },
      {
        type: "table",
        headers: ["Rib", "What makes it atypical"],
        rows: [
          ["Rib 1", "Broad and flat; scalene tubercle with grooves for subclavian vein and artery; no angle; subclavian artery and lower trunk of the plexus above it"],
          ["Rib 2", "Rough tuberosity for part of serratus anterior; its head articulates with T1 and T1/T2"],
          ["Rib 10", "Often a single articular facet on the head, articulating with T10 alone"],
          ["Rib 11", "Single facet, no neck, no tubercle, and a blunt anterior end — no costotransverse joint"],
          ["Rib 12", "Same as rib 11 but shorter; no costotransverse joint and no costal groove worth the name"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: the joints of a typical rib" },
      {
        type: "paragraph",
        text: "A rib is not hinged at one point; it articulates with the vertebral column at two joints, and the axis of rotation passes through both. At the costovertebral joint, the head of the rib sits between the demifacet of its own numbered vertebra and the demifacet of the vertebra above, separated from them by an intra-articular ligament. At the costotransverse joint, the tubercle of the rib articulates with the transverse process of the same-numbered vertebra. Two synovial joints, one fixed axis, and therefore one controlled movement: the rib swings up and out like a bucket handle.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The ribs 11 and 12 have no tubercles and therefore no costotransverse joints — which is exactly why they are called floating: they have no rotation axis, only the single head articulation, and they barely move at all.",
      },

      { type: "heading", level: 2, text: "The intercostal bundle, and the rule it gives you" },
      {
        type: "paragraph",
        text: "Remember from lesson 3 that between any two ribs lie three muscle layers and the neurovascular bundle lying along the costal groove of the rib above. The order, from the top of the space to the bottom, is vein, artery, nerve. The nerve lies lowest, against the upper border of the rib below, and is therefore the structure most exposed to a broken rib's end.",
      },
      {
        type: "paragraph",
        text: "This single anatomical fact generates a rule that every student uses from the first day of clinical placement: when you insert a needle or a drain into the chest, aim for the upper border of the rib below the space you want to enter. Insert over the lower border of the rib above and you will meet the bundle.",
      },
      {
        type: "table",
        headers: ["Movement", "Ribs involved", "Effect on chest volume", "Phase"],
        rows: [
          ["Pump handle", "Upper ribs 2-6", "Sternum moves forward and up, increasing the front-to-back (anteroposterior) diameter", "Inspiration"],
          ["Bucket handle", "Lower ribs 7-10", "Ribs swing outward and upward, increasing the side-to-side (transverse) diameter", "Inspiration"],
          ["Recoil", "All ribs", "Both diameters fall back as the lung and chest wall recoil elastically", "Quiet expiration"],
        ],
      },

      { type: "heading", level: 2, text: "The sternal angle: the landmark that answers four questions" },
      {
        type: "paragraph",
        text: "The sternal angle (of Louis) is the joint between the manubrium and the body of the sternum. It is palpable as a ridge across the front of the chest, and four important facts hang off it.",
      },
      {
        type: "table",
        headers: ["Question", "Answer"],
        rows: [
          ["Where does the second costal cartilage attach?", "Here — so you count ribs from the sternal angle, not from the clavicle"],
          ["What vertebral level is this?", "The T4/T5 intervertebral disc"],
          ["What divides the mediastinum?", "A horizontal plane through this point, separating the superior from the inferior mediastinum"],
          ["Where does the trachea divide into the two bronchi (the carina)?", "At about the level of this same plane; the azygos vein arches over the right main bronchus to drain into the superior vena cava"],
        ],
      },
      {
        type: "paragraph",
        text: "That is why you will see clinicians palpating down from the sternal notch before auscultating. If you cannot count ribs you cannot describe where you heard a sound, and a note reading 'crepitations at the right base' means nothing without knowing how the examiner found the base.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the head of a typical rib articulates with only one vertebra. It articulates with two — the demifacets of its own vertebra and the one above — separated by the intra-articular ligament. Ribs 1, 10, 11 and 12 are the exceptions with a single facet.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Placing the aortic hiatus at T10. The three great diaphragmatic openings are: vena caval at T8, oesophageal at T10, aortic at T12. The oesophageal hiatus is the one at T10; the aorta passes behind the diaphragm at T12 with the thoracic duct and azygos vein.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking the intercostal nerve is protected because it is deep. It is the least protected structure in the space, lying lowest against the rib below. That is why a rib fracture produces the radiating, band-like pain of intercostal neuralgia.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Where does a typical rib articulate with the vertebral column?",
        answer: "Its head with the demifacets of its own vertebra and the one above, and its tubercle with the transverse process of its own vertebra.",
        explanation: "Two synovial joints per rib, defining one axis of rotation — which is why the rib's movement is a controlled swing rather than a hinge.",
      },
      {
        type: "question",
        prompt: "What is the safest place to insert a chest drain, and why?",
        answer: "At or just above the upper border of the rib below the target space, within the safe triangle. The neurovascular bundle (vein, artery, nerve) runs along the upper rib's costal groove, so approaching over the lower border of the rib above risks injuring it.",
        explanation: "The safe triangle is bounded in front by the lateral edge of pectoralis major, behind by the anterior edge of latissimus dorsi, below by the fifth intercostal space, and above by a horizontal line at the level of the nipple.",
      },
      {
        type: "question",
        prompt: "Which vertebral level corresponds to the sternal angle, and what three other landmarks share it?",
        answer: "T4/T5. It is also the attachment of the second costal cartilage, the plane dividing the superior from the inferior mediastinum, and the level at which the trachea bifurcates and the azygos vein arches into the superior vena cava.",
        explanation: "One palpable landmark that fixes four internal structures — this is why clinical anatomy begins with the surface landmarks of the chest.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which ribs are classified as floating ribs?",
        options: ["Ribs 1-7", "Ribs 8-10", "Ribs 11-12", "Ribs 1, 11 and 12"],
        correctIndex: 2,
        explanation: "Ribs 11 and 12 have no costal cartilages reaching the sternum and no costotransverse joints, so their anterior ends are free — hence floating. True ribs 1-7 reach the sternum directly; false ribs 8-10 do so indirectly.",
      },
      {
        type: "mcq",
        stem: "Which statement about the neurovascular bundle of an intercostal space is correct?",
        options: [
          "The nerve lies highest, so it is best protected", "The artery lies lowest, against the rib below", "The order from above downward is vein, artery, nerve", "The three structures lie in random order",
        ],
        correctIndex: 2,
        explanation: "VAN from top to bottom: vein, artery, nerve. The nerve is the lowest and least protected, which is why drains and needles are inserted at the upper border of the rib below.",
      },
      {
        type: "mcq",
        stem: "A rib is described as articulating with the demifacets of two adjacent vertebral bodies. Which rib is least likely to be described this way?",
        options: ["Rib 4", "Rib 7", "Rib 11", "Rib 6"],
        correctIndex: 2,
        explanation: "Rib 11 (like rib 12) has a single articular facet, no neck and no tubercle. Ribs 3-9 are typical and articulate at two points; rib 10 may have one or two facets.",
      },
      {
        type: "mcq",
        stem: "Which chest movement increases the transverse (side-to-side) diameter during inspiration?",
        options: ["Pump-handle movement of the upper ribs", "Bucket-handle movement of the lower ribs", "Contraction of the abdominal wall", "Reversed action of pectoralis major"],
        correctIndex: 1,
        explanation: "Lower ribs swing outward like bucket handles and increase the transverse diameter; upper ribs move forward like pump handles and increase the anteroposterior diameter. The abdominal wall contracts in forced expiration.",
      },
      {
        type: "mcq",
        stem: "Which structures are correct for the diaphragmatic openings at T8, T10 and T12?",
        options: [
          "Oesophagus at T8, aorta at T10, vena cava at T12", "Aorta at T8, vena cava at T10, oesophagus at T12", "Vena cava at T8, oesophagus at T10, aorta at T12", "Oesophagus at T8, vena cava at T10, aorta at T12",
        ],
        correctIndex: 2,
        explanation: "The inferior vena cava passes through the central tendon at T8, the oesophagus through the muscular part at T10, and the aorta passes behind the diaphragm at T12 with the thoracic duct and azygos vein.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Twelve pairs of ribs — seven true, three false, two floating — articulate with the spine at two synovial joints each (except 11 and 12, which articulate at one), and their rotation about the axis through those joints produces the pump-handle and bucket-handle movements of breathing. Between them lie the intercostal spaces with the bundle ordered vein, artery, nerve from top to bottom, the nerve lowest and least protected, which is why drains go over the upper border of the rib below. The sternal angle fixes the second rib, the T4/T5 plane, the boundary between superior and inferior mediastinum, and the level of the tracheal bifurcation.",
      },
      {
        type: "paragraph",
        text: "Next: the mediastinum and pericardium. You will divide the chest into compartments using the same sternal-angle plane and see what lives in each, and why a fluid collection in the pericardial sac stops the heart.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Mediastinum and pericardium (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define the mediastinum and divide it into its compartments using the sternal-angle plane; list the contents of each compartment; describe the two layers of the pericardium, the pericardial cavity and the oblique and transverse sinuses; explain the mechanism of cardiac tamponade and name Beck's triad; and identify which part of the mediastinum an abnormality lies in from a chest radiograph.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-6. You need the sternal angle and its level, the aortic arch and its branches, and the diaphragm and its openings.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Mediastinum",
        text: "The median compartment of the thoracic cavity: everything that lies between the two pleural sacs, from the thoracic inlet above to the diaphragm below — including the heart, the great vessels, the trachea and oesophagus, and the thoracic duct.",
      },
      {
        type: "paragraph",
        text: "Take the chest, remove both lungs and their pleural coverings, and what remains in the middle is the mediastinum. It is not an organ so much as a busy anatomical neighbourhood: the heart and its vessels, the airways and the swallowing tube, the lymphatics of the whole body, the sympathetic chains and the vagus nerves. Learning its compartments is how you answer the question a radiologist answers every day — 'the abnormality is in the mediastinum — which part?'",
      },

      { type: "heading", level: 2, text: "Dividing the mediastinum" },
      {
        type: "paragraph",
        text: "Two divisions are used, and they are applied in that order. A horizontal plane through the sternal angle (the manubriosternal joint) and the T4/T5 disc separates the superior mediastinum above from the inferior mediastinum below. The inferior mediastinum is then divided by the pericardium into three: anterior, middle and posterior. So the four compartments are superior, anterior, middle and posterior.",
      },
      {
        type: "table",
        headers: ["Compartment", "Boundaries", "Principal contents"],
        rows: [
          ["Superior mediastinum", "Above the transverse thoracic plane, below the thoracic inlet", "Aortic arch and its three branches; brachiocephalic veins forming the superior vena cava; trachea; oesophagus; thoracic duct; thymus (or its remnants); vagus and phrenic nerves; cardiac nerves; sympathetic trunks; lymph nodes"],
          ["Anterior mediastinum", "Between the pericardium and the sternum, below the plane", "Fat, lymph nodes, small vessels, and the lower part of the thymus in children"],
          ["Middle mediastinum", "The pericardium and its contents", "Heart; roots of the great vessels; the phrenic nerves with the pericardiacophrenic vessels"],
          ["Posterior mediastinum", "Between the pericardium and the vertebral column", "Thoracic duct; azygos and hemiazygos veins; oesophagus; descending thoracic aorta; sympathetic trunks; posterior intercostal vessels and nerves"],
        ],
      },
      {
        type: "paragraph",
        text: "One structure jumps between compartments deliberately and is worth calling out: the oesophagus runs down through the superior mediastinum and then through the posterior mediastinum, so a posterior-mediastinal lesion — a lymph node, a diverticulum, an oesophageal tumour — can press on it and cause difficulty swallowing. That is why dysphagia is on the list of symptoms to ask about when a posterior mediastinal mass is found.",
      },

      { type: "heading", level: 2, text: "Worked example: the aortic arch and the recurrent laryngeal nerve" },
      {
        type: "paragraph",
        text: "The ascending aorta leaves the left ventricle, arches backwards over the root of the left lung, and becomes the descending aorta. From the top of the arch arise three branches, in order: the brachiocephalic trunk (which divides into the right common carotid and the right subclavian), the left common carotid, and the left subclavian. The arch begins and ends at the transverse thoracic plane — so the arch itself is in the superior mediastinum, and the descending aorta is in the posterior mediastinum.",
      },
      {
        type: "paragraph",
        text: "The left recurrent laryngeal nerve is the clinical reason to memorise the arch. The vagus nerves give off their recurrent laryngeal branches, which loop under the aortic arch on the left and under the right subclavian artery on the right, and run back up into the neck beside the trachea to supply the larynx. Aneurysmal dilatation of the arch, or an aortic dissection, or a mediastinal tumour, can stretch that nerve — and the patient presents with a hoarse voice, because one vocal cord is paralysed. This is the reason every newly hoarse patient with chest symptoms gets a chest radiograph.",
      },

      { type: "heading", level: 2, text: "The pericardium, layer by layer" },
      {
        type: "paragraph",
        text: "The heart sits inside a sac, and the sac has two layers with a space between. The fibrous pericardium is the tough outer layer; it is inelastic, it blends with the outer coat of the great vessels where they enter and leave, and it is anchored to the central tendon of the diaphragm so the heart moves with the diaphragm during breathing. Inside it lies the serous pericardium, itself in two parts: a parietal layer lining the fibrous pericardium, and a visceral layer (the epicardium) lying on the heart muscle. Between those two serous layers is the pericardial cavity, a potential space holding 10 to 50 mL of serous fluid that lets the heart beat with almost no friction.",
      },
      {
        type: "paragraph",
        text: "The reflections of the serous layer create two named sinuses. The transverse sinus lies behind the ascending aorta and pulmonary trunk and in front of the superior vena cava and left atrium; the oblique sinus lies behind the left atrium, bounded by the four pulmonary veins and the inferior vena cava. The transverse sinus is used surgically as a clamp site: a finger passed through it encircles the aorta and pulmonary trunk, which is how a surgeon controls inflow during cardiac surgery.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The pericardium is inelastic, and that single fact is the whole pathology. Fluid that accumulates inside a rigid sac has nowhere to go except inwards — against the heart.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: cardiac tamponade" },
      {
        type: "paragraph",
        text: "Blood or fluid collecting in the pericardial cavity compresses the heart from outside, so the chambers cannot fill in diastole. Stroke volume falls, and the body tries to compensate with tachycardia and vasoconstriction. The classical triad — Beck's triad — is falling arterial pressure, rising jugular venous pressure with distended neck veins, and muffled heart sounds on auscultation. A paradoxus is also typical: the pulse fades on inspiration, because the extra venous return cannot be accommodated by a compressed right ventricle and the septum bulges into the left.",
      },
      {
        type: "paragraph",
        text: "Tamponade is a cause of obstructive shock and is treated by draining the sac — pericardiocentesis, usually through a subxiphidal approach with the needle aimed towards the left shoulder — and then by treating the cause. The commonest causes are trauma with a penetrating wound, malignancy, uraemia, viral pericarditis, and rupture of the heart or aorta after myocardial infarction. On a chest radiograph the silhouette of the heart is globular and enlarged when a substantial effusion has accumulated.",
      },
      {
        type: "question",
        prompt: "Why does the jugular venous pressure rise in cardiac tamponade, and why does that combination rule out simple heart failure as the explanation?",
        answer: "The heart cannot fill because it is compressed from outside, so blood backs up into the venous system, raising the jugular venous pressure. In tamponade the neck veins are distended and the arterial pressure is falling at the same time — pump failure from inside the heart usually depresses output with a raised venous pressure too, but the combination with muffled heart sounds and pulsus paradoxus localises the problem to the sac, not the muscle.",
        explanation: "The point of the triad is that it separates a mechanical, reversible cause of shock from three other categories — hypovolaemic, cardiogenic and septic — because the treatment is drainage, not fluid, drugs or antibiotics.",
      },

      { type: "heading", level: 2, text: "Reading a mediastinal abnormality" },
      {
        type: "table",
        headers: ["Finding", "Compartment", "Typical causes"],
        rows: [
          ["Widened mediastinum", "Superior", "Aortic dissection or traumatic rupture, lymphoma, a mediastinal mass, a retrosternal goitre"],
          ["Anterior mediastinal mass", "Anterior", "Thymoma, teratoma and germ-cell tumours, lymphoma, retrosternal thyroid — the '4 Ts'"],
          ["Air-fluid level behind the sternum with dysphagia", "Posterior", "Oesophageal rupture or a pharyngeal pouch"],
          ["Mass at the aortic arch with hoarseness", "Superior", "Aortic aneurysm stretching the left recurrent laryngeal nerve"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the thymus sits in the mediastinum of an adult. It is largest in childhood, lies in the anterior mediastinum, and involutes after puberty into a remnant of fat and fibrous tissue. Anterior mediastinal masses in adults are not normal thymus.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Placing the tracheal bifurcation too low. It is at the level of the sternal angle, the T4/T5 plane. Learners often place it at the level of the heart's base instead, and then misread a chest radiograph.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the two sinuses. The transverse sinus lies behind the great arteries and in front of the atria; the oblique sinus lies behind the left atrium itself. Only the transverse one is used for clamping.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which plane divides the mediastinum into superior and inferior parts, and what landmark marks it in the living patient?",
        answer: "A horizontal plane through the sternal angle — the manubriosternal joint — at the level of the T4/T5 intervertebral disc.",
        explanation: "The sternal angle is palpable, which is what makes this plane usable at the bedside rather than only in a dissection room.",
      },
      {
        type: "question",
        prompt: "Name the three branches of the aortic arch in order.",
        answer: "The brachiocephalic trunk, the left common carotid artery, and the left subclavian artery.",
        explanation: "Brachiocephalic on the right, then the two arteries of the left side. The brachiocephalic trunk subsequently divides into the right common carotid and right subclavian arteries.",
      },
      {
        type: "question",
        prompt: "Why does a large pericardial effusion impair the pulse during inspiration?",
        answer: "Because the rigid pericardium limits total cardiac volume: inspiration increases venous return to the right heart, the interventricular septum bulges leftwards, and left ventricular filling — and therefore the pulse pressure — falls.",
        explanation: "This is pulsus paradoxus, an exaggeration of a small normal respiratory swing. It points to a mechanical constraint of the heart, not to lung disease.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which structure does NOT lie in the superior mediastinum?",
        options: ["The aortic arch", "The trachea", "The descending thoracic aorta", "The thoracic duct"],
        correctIndex: 2,
        explanation: "The descending thoracic aorta lies in the posterior mediastinum, below the transverse thoracic plane. The arch, trachea and thoracic duct all pass through the superior mediastinum.",
      },
      {
        type: "mcq",
        stem: "A patient with an aneurysm of the aortic arch develops a hoarse voice. Which nerve is most likely affected?",
        options: ["The left vagus nerve itself", "The left recurrent laryngeal nerve", "The right phrenic nerve", "The left sympathetic trunk"],
        correctIndex: 1,
        explanation: "The left recurrent laryngeal nerve loops under the aortic arch beside the trachea and supplies the larynx, so arch disease stretches or compresses it and paralyses a vocal cord — hoarseness without a throat illness.",
      },
      {
        type: "mcq",
        stem: "Which set of findings is Beck's triad for cardiac tamponade?",
        options: [
          "Hypertension, raised jugular venous pressure, muffled heart sounds",
          "Hypotension, raised jugular venous pressure, muffled heart sounds",
          "Hypotension, raised jugular venous pressure, loud pericardial rub",
          "Hypotension, bounding pulse, muffled heart sounds",
        ],
        correctIndex: 1,
        explanation: "Falling arterial pressure, rising venous pressure and muffled heart sounds — the heart is compressed and cannot fill. A rub suggests pericarditis without compression, and a bounding pulse is opposite to the damped pulse of tamponade.",
      },
      {
        type: "mcq",
        stem: "Which statement about the pericardial cavity is correct?",
        options: [
          "It is a real space containing about 500 mL of fluid", "It is a potential space between the parietal and visceral serous layers", "It lies between the fibrous pericardium and the parietal serous layer", "It contains air in the normal state",
        ],
        correctIndex: 1,
        explanation: "The pericardial cavity is the potential space between the parietal and visceral layers of serous pericardium, holding a thin film of serous fluid. The fibrous pericardium is bound to the parietal serous layer and contains no space of its own.",
      },
      {
        type: "mcq",
        stem: "Which compartment of the mediastinum contains the azygos vein, the oesophagus and the thoracic duct?",
        options: ["The superior mediastinum", "The anterior mediastinum", "The middle mediastinum", "The posterior mediastinum"],
        correctIndex: 3,
        explanation: "The posterior mediastinum, between the pericardium and the vertebral column, holds the descending aorta, the oesophagus, the azygos and hemiazygos veins, the thoracic duct and the sympathetic trunks.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The mediastinum is the middle compartment of the chest, divided by the sternal-angle plane into a superior part, and an inferior part that the pericardium divides into anterior, middle and posterior compartments. The pericardium is a fibrous sac lined by serous membrane, with a potential cavity holding a small volume of lubricating fluid — which is why fluid accumulating in it compresses the heart and produces tamponade with falling arterial pressure, rising venous pressure and muffled heart sounds. The aortic arch gives three branches and is crossed by the left recurrent laryngeal nerve, so arch disease presents with hoarseness.",
      },
      {
        type: "paragraph",
        text: "Next: the clinical correlation lesson, where pneumothorax and the nerve injuries of the upper limb are used to show how the anatomical relationships you have learned predict a patient's presentation and treatment.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Clinical correlation: pneumothorax & nerve injuries (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define pneumothorax and explain the mechanics of pleural cavity pressure; distinguish simple, open and tension pneumothorax clinically; state the emergency management of tension pneumothorax and the correct site for needle decompression; name the nerve injured in each of the common upper-limb injuries and the deficit it produces; and explain why tension pneumothorax kills faster than any other thoracic emergency.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-7. You need the brachial plexus (lesson 4), the intercostal bundle and safe drain site (lesson 6), and the mediastinum (lesson 7).",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pneumothorax",
        text: "Air in the pleural cavity — the potential space between the parietal and visceral pleura — which breaks the negative pressure that keeps the lung expanded, so the lung collapses away from the chest wall.",
      },
      {
        type: "paragraph",
        text: "The lung is not stuck to the chest wall; it is held against it by suction. The pleural cavity is a sealed potential space with a negative pressure inside, so the lung, which is elastic and would rather collapse, is pulled open by the chest wall. Let air into that space and the suction is lost: the lung collapses to a fraction of its size, and the chest wall springs outward. Everything about pneumothorax follows from that single mechanism — and the reason tension pneumothorax is an emergency is that the air, once in, keeps arriving.",
      },

      { type: "heading", level: 2, text: "Classifying pneumothorax" },
      {
        type: "table",
        headers: ["Type", "Mechanism", "Tracheal position", "Haemodynamics"],
        rows: [
          ["Simple pneumothorax", "A small leak — a ruptured apical bleb, or a broken rib tearing the lung pleura — that is self-limiting", "Central", "Stable; the patient is breathable and the air is reabsorbed slowly over days"],
          ["Open pneumothorax", "A wound through the chest wall, so air moves in and out through the hole with breathing", "Central, unless tension develops", "Compromised, because the lung on that side cannot inflate"],
          ["Tension pneumothorax", "A one-way leak: air enters the pleural cavity with each breath but cannot leave, so pressure rises with every breath", "Deviated AWAY from the affected side", "Obstructive shock — the mediastinum is pushed across, kinking the great veins, so venous return falls"],
        ],
      },
      {
        type: "paragraph",
        text: "Two causes of spontaneous pneumothorax are worth separating. Primary spontaneous pneumothorax occurs in tall, thin, young people, usually smokers, from rupture of a subpleural bleb at the apex — the disease is mechanical and the patient is otherwise well. Secondary spontaneous pneumothorax occurs in a diseased lung, classically emphysema, and is far more dangerous because the patient has no reserve: the same volume of collapsed lung matters enormously more when the rest of the lung was already damaged.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The clinical triad to check for in tension pneumothorax: a deviated trachea pushed AWAY from the silent side, absent breath sounds over the silent side, and hypotension with distended neck veins. The side with no breath sounds and hyper-resonance to percussion is the side to decompress.",
      },

      { type: "heading", level: 2, text: "Clinical correlation: why tension kills" },
      {
        type: "paragraph",
        text: "Picture the chest as a rigid box divided into two by a septum — the mediastinum. A one-way valve in one pleural cavity means that each inspiration adds air that cannot escape, so pressure in that cavity rises above atmospheric. Three things then happen in sequence: the lung on that side collapses completely; the mediastinum is pushed towards the other side; and the superior and inferior venae cavae, which are thin-walled, are kinked where they enter the chest. Venous return to the heart falls, cardiac output falls, and the patient becomes hypotensive and then loses consciousness.",
      },
      {
        type: "paragraph",
        text: "The treatment follows the mechanism directly. You do not wait for a radiograph — the diagnosis is clinical and the patient is dying. A large-bore needle is inserted into the second intercostal space in the mid-clavicular line, or the fifth intercostal space in the anterior axillary line, and a rush of air confirms the diagnosis. A formal chest drain is then placed in the fifth intercostal space in the mid-axillary line, within the safe triangle, aimed at the apex to drain the air.",
      },
      {
        type: "question",
        prompt: "Why is the trachea deviated away from the affected side in tension pneumothorax, and what happens to it in a simple pneumothorax?",
        answer: "In tension pneumothorax the rising pressure in the affected pleural cavity pushes the mediastinum across, so the trachea is displaced away. In a simple pneumothorax the leak is self-limiting, the pressure in the cavity is not raised, and the trachea remains central.",
        explanation: "The direction of tracheal deviation is the fastest bedside discriminator between a simple and a tension pneumothorax — and the one most often missed in a hurried examination.",
      },

      { type: "heading", level: 2, text: "Nerve injuries of the upper limb, consolidated" },
      {
        type: "paragraph",
        text: "Every nerve in the table below has already appeared in this module. This is the summary that an examination will draw from, and the pattern of each injury is dictated by the anatomy that protects or exposes the nerve.",
      },
      {
        type: "table",
        headers: ["Nerve", "Muscles paralysed", "Clinical sign", "Commonest injury"],
        rows: [
          ["Axillary (C5-C6)", "Deltoid, teres minor", "Cannot abduct the arm from the side; sensory loss over the regimental badge area", "Fracture of the surgical neck; anterior dislocation of the shoulder"],
          ["Radial (C5-T1)", "Triceps, brachioradialis, all wrist and finger extensors", "Wrist drop; sensory loss over the dorsum of the first web space", "Mid-shaft humeral fracture; compression of the nerve against the humerus ('Saturday night palsy')"],
          ["Median (C5-T1)", "Forearm flexors except flexor carpi ulnaris and the ulnar half of flexor digitorum profundus; thenar muscles except adductor pollicis", "Thenar wasting; inability to oppose the thumb; sensory loss over the palmar lateral 3.5 digits", "Carpal tunnel compression at the wrist; supracondylar fracture in a child"],
          ["Ulnar (C8-T1)", "Flexor carpi ulnaris; ulnar half of flexor digitorum profundus; all intrinsic hand muscles except the thenar lateral two lumbricals", "Claw hand; positive Froment's sign; sensory loss over the medial 1.5 digits", "Fracture of the medial epicondyle; compression in the cubital tunnel; laceration at the wrist"],
          ["Musculocutaneous (C5-C7)", "Coracobrachialis, biceps, brachialis", "Weak and painless elbow flexion and supination; sensory loss on the lateral forearm", "Rarely injured alone; seen in penetrating trauma"],
          ["Long thoracic (C5-C7)", "Serratus anterior", "Winged scapula; cannot raise the arm above the head", "Axillary node clearance for breast cancer; a direct blow to the lateral chest wall"],
          ["Suprascapular (C5-C6)", "Supraspinatus, infraspinatus", "Weak initiation of abduction and weak external rotation", "Entrapment in the suprascapular notch; shoulder joint pathology"],
          ["Dorsal scapular (C5)", "Rhomboids", "Slight winging with difficulty retracting the scapula", "Cervical root injury, often in a root lesion"],
        ],
      },
      {
        type: "paragraph",
        text: "Note which nerves are injured by which mechanism, because the mechanism is what you will be told about in a question. Fractures of the humerus injure nerves named for the landmark: surgical neck — axillary; mid-shaft — radial; medial epicondyle — ulnar. Dislocations injure nerves according to the direction of the dislocation: an anterior dislocation of the shoulder stretches the axillary nerve; a knee dislocation risks the common peroneal nerve in the lower limb. Penetrating wounds at the wrist or forearm injure median and ulnar nerves in a pattern determined by what each supplies in the hand.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a chest radiograph in suspected tension pneumothorax. It is a clinical diagnosis, treated before imaging — and a supine chest film can look deceptively normal because the air rises anteriorly rather than to the apex.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Deviating the trachea towards the affected side. It deviates away. (In a large pleural effusion or a collapsed lobe, the trachea can be pulled towards the lesion, so read the signs together rather than in isolation.)",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Calling an ulnar nerve injury a median nerve injury because the hand looks deformed. Median nerve injury gives a 'hand of benediction' or a thenar wasting pattern with loss of thumb opposition; the claw — hyperextended knuckles, flexed fingers — is ulnar.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "In a tension pneumothorax, why does the patient deteriorate so fast?",
        answer: "Air enters the pleural cavity through a one-way wound but cannot escape, so rising pressure collapses the lung, shifts the mediastinum and kinks the great veins — venous return to the heart falls and the patient develops obstructive shock.",
        explanation: "The one-way valve is the danger: each breath adds air. This is the mechanism that makes it an immediate-decompression emergency rather than a drain-in-the-morning problem.",
      },
      {
        type: "question",
        prompt: "Where is an emergency needle decompression inserted, and why that site?",
        answer: "The second intercostal space in the mid-clavicular line (or the fifth intercostal space in the anterior axillary line). At the second space the needle enters the pleural cavity above the great vessels and away from the heart, and the site is easy to find on a struggling patient.",
        explanation: "A formal drain then follows in the fifth space in the mid-axillary line, inside the safe triangle and above the upper border of the rib below, to avoid the intercostal bundle.",
      },
      {
        type: "question",
        prompt: "A patient with a fractured clavicle cannot abduct the arm and has lost sensation over the lower shoulder. Which nerve, and why does the fracture do this?",
        answer: "The axillary nerve, because a fractured clavicle's lateral fragment can be driven downwards and the shoulder can be dislocated anteriorly, stretching the nerve where it passes through the quadrangular space and around the surgical neck.",
        explanation: "The nerve is fixed at the quadrangular space while the humerus moves away from it — a traction injury, which is why it is the nerve injured in anterior shoulder dislocations as well.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which clinical finding best distinguishes tension pneumothorax from simple pneumothorax?",
        options: [
          "Absent breath sounds on the affected side", "Tracheal deviation away from the affected side with hypotension", "Pleuritic chest pain", "A history of tall thin build",
        ],
        correctIndex: 1,
        explanation: "Absent breath sounds and pleuritic pain occur in both. Tracheal deviation away from the affected side, with falling blood pressure, is the sign of a one-way valve with rising pressure compressing the great veins.",
      },
      {
        type: "mcq",
        stem: "A patient 24 hours after a stab wound to the chest is found with a deviated trachea, absent breath sounds on the left, and a blood pressure of 80/50. What is the immediate management?",
        options: [
          "Urgent chest radiograph to confirm the diagnosis", "Large-bore needle decompression of the left second intercostal space, mid-clavicular line", "Intravenous fluids and reassessment in an hour", "Insertion of a chest drain in the eighth intercostal space",
        ],
        correctIndex: 1,
        explanation: "Tension pneumothorax is a clinical diagnosis treated before imaging. Needle decompression is followed by a formal drain in the fifth space, mid-axillary line.",
      },
      {
        type: "mcq",
        stem: "Which nerve is injured in a fracture of the surgical neck of the humerus?",
        options: ["The radial nerve", "The axillary nerve", "The ulnar nerve", "The median nerve"],
        correctIndex: 1,
        explanation: "The axillary nerve passes through the quadrangular space and around the surgical neck with the posterior humeral circumflex artery, so it is stretched or torn in this fracture.",
      },
      {
        type: "mcq",
        stem: "A patient has wrist drop after a mid-shaft humeral fracture. Which nerve is injured, and what is the sensory loss?",
        options: [
          "The ulnar nerve; the medial 1.5 digits", "The radial nerve; the dorsum of the first web space", "The median nerve; the palmar lateral 3.5 digits", "The axillary nerve; the regimental badge area",
        ],
        correctIndex: 1,
        explanation: "The radial nerve runs in the spiral groove of the mid-shaft and supplies all the extensors; its sensory area is the dorsum of the first web space.",
      },
      {
        type: "mcq",
        stem: "Which nerve lesion produces a winged scapula after an axillary lymph node clearance?",
        options: ["The dorsal scapular nerve", "The long thoracic nerve", "The thoracodorsal nerve", "The median pectoral nerve"],
        correctIndex: 1,
        explanation: "The long thoracic nerve to serratus anterior lies on the medial wall of the axilla, outside the axillary sheath, and is damaged during axillary clearance — the classic cause of a winged scapula.",
      },
      {
        type: "mcq",
        stem: "Which statement about primary spontaneous pneumothorax is correct?",
        options: [
          "It occurs most often in older patients with emphysema", "It occurs in tall, thin, usually young people from rupture of an apical bleb", "It requires a penetrating chest wound to occur", "It always presents with tracheal deviation",
        ],
        correctIndex: 1,
        explanation: "Primary spontaneous pneumothorax is a disease of tall thin young people — usually smokers — from a subpleural apical bleb. Secondary spontaneous pneumothorax is the one associated with emphysema, and tracheal deviation is a sign of tension, not of a simple pneumothorax.",
      },

      { type: "heading", level: 2, text: "Module summary and next" },
      {
        type: "paragraph",
        text: "This first module has taken you from the reference pose that makes anatomical language possible, through the skeleton of the upper limb and the muscles that hold it, into the nerve network that drives it, and out into the clinic. The pattern in every lesson has been the same: structure dictates function, and dysfunction follows the structure exactly. The axillary nerve goes where the surgical neck puts it at risk; the serratus anterior fails where its nerve runs exposed along the axillary wall; the lung collapses when the pleural suction is lost, and the mediastinum is pushed across when that suction turns into pressure.",
      },
      {
        type: "paragraph",
        text: "Next module: the lower limb and pelvis. The same method applies — bones first, then muscles, then nerves, then the clinical correlations — and you will find that the limb's job of bearing weight rather than placing the hand changes the whole design.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module 1 SBA items — one per concept, authored and machine-checked.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 9 — Bones of the lower limb & hip bone (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the three bones that fuse to form the hip bone and the landmarks that mark each one; describe the pelvic brim and how it divides the true from the false pelvis; identify the parts of the femur, patella, tibia, fibula and the seven tarsals together with their clinically important features; explain the neck-shaft angle and how its disturbance produces coxa vara and coxa valga; and state the mechanical role of the arches of the foot and the structures that maintain them.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1 and 2. You need the directional vocabulary and the bones of the upper limb, because the lower limb is best learned by contrast: it is built to bear weight rather than to place a hand in space.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pelvic girdle",
        text: "The hip bone on each side, fused with the sacrum posteriorly at the sacroiliac joints and with the opposite hip bone anteriorly at the pubic symphysis. Unlike the pectoral girdle, which hangs from the trunk by muscle, the pelvic girdle is a closed bony ring built to transmit the weight of the whole body into the lower limbs.",
      },
      {
        type: "paragraph",
        text: "One sentence carries the whole design: the lower limb trades reach for stability. The arms are longer and the shoulder girdle is deliberately loose, because the hand must be placed anywhere in space; the legs are shorter, heavier and aligned to stand on, because they must support the entire body against gravity. Every consequence follows from that trade. The hip is a deep ball-and-socket joint rather than the shallow one of the shoulder; the bones are larger and rougher where ligaments and tendons grip them; and the joints are far less mobile but far more secure.",
      },

      { type: "heading", level: 2, text: "The hip bone: three bones, one thickening" },
      {
        type: "paragraph",
        text: "Each hip bone starts as three bones — ilium, ischium and pubis — which meet at a Y-shaped growth plate in the concavity of the acetabulum and fuse in the mid-to-late teens. Learning where the three parts sit is what turns a flat irregular bone into a readable structure.",
      },
      {
        type: "table",
        headers: ["Component", "Position", "Landmarks you must know", "Clinical relevance"],
        rows: [
          ["Ilium", "Superior, the broad blade you feel at the waist", "Iliac crest, anterior superior iliac spine (ASIS), iliac fossa, arcuate line, greater sciatic notch", "Donor site for bone graft; the iliac crest is the surface landmark for the L4 lumbar puncture level"],
          ["Ischium", "Posteroinferior, the bone you sit on", "Ischial tuberosity, ischial spine, lesser sciatic notch, ischial ramus", "The tuberosity carries the whole body's weight when sitting; bursitis here is the classic 'weaver's bottom'"],
          ["Pubis", "Anteroinferior, the midline bone", "Body, superior and inferior pubic rami, pubic tubercle, obturator crest", "The pubic symphysis separates in late pregnancy and in high-impact sport"],
          ["Acetabulum", "Where all three meet, laterally", "Lunate articular surface, acetabular notch and fossa", "The socket of the hip; the notch is bridged by the transverse acetabular ligament"],
        ],
      },

      { type: "heading", level: 2, text: "True pelvis, false pelvis, and the brim" },
      {
        type: "paragraph",
        text: "The pelvic brim (the linea terminalis) is the oblique ridge that separates the greater or false pelvis above from the lesser or true pelvis below. The false pelvis is really the lower part of the abdominal cavity and supports the abdominal contents; the true pelvis is the short muscular cylinder through which a baby must pass, which is why every obstetric measurement is taken here. The brim runs from the sacral promontory posteriorly, along the arcuate line of the ilium and the pectineal line of the pubis, to the pubic symphysis anteriorly.",
      },
      {
        type: "callout",
        variant: "info",
        text: "In a woman the brim is round-oval and the subpubic angle is wide; in a man it is heart-shaped and the angle is narrow. When you are asked which pelvic feature lets you sex a skeleton, the subpubic angle, the greater sciatic notch and the shape of the inlet together settle it.",
      },

      { type: "heading", level: 2, text: "The femur, and the angle that matters" },
      {
        type: "paragraph",
        text: "The femur is the longest and strongest bone in the body, and its anatomy is a single lesson in mechanical design. The head with its central fovea points medially and is held in place mainly by the ligamentum teres, whose artery supplies only a small part of the adult head. The neck passes medially and superiorly, and the angle at which it meets the shaft — the neck-shaft angle — is normally about 125 degrees in an adult, and higher in an infant because the newborn hip has not yet taken its share of standing.",
      },
      {
        type: "table",
        headers: ["Landmark", "What is attached or adjacent", "Why an examiner asks"],
        rows: [
          ["Head with fovea", "Ligamentum teres (to the acetabular notch and fossa)", "The artery of the ligament is a minor supply in the adult; the retinacular vessels matter, which is why an intracapsular fracture kills the head"],
          ["Greater and lesser trochanters", "The rotators of the hip insert here", "The index of the hip joint in the lateral thigh"],
          ["Linea aspera (posterior shaft)", "Muscles and the medial and lateral intermuscular septa", "Ties fascia, muscle and bone into one structure"],
          ["Medial and lateral condyles", "The cruciate ligaments and the menisci", "The site of the knee; the femoral condyles are what the tibial plateau receives"],
          ["Adductor tubercle (medial epicondyle)", "Adductor magnus inserts here", "The bony landmark of the distal end of the adductor canal"],
        ],
      },
      {
        type: "definition",
        term: "Coxa vara and coxa valga",
        text: "Coxa vara is a neck-shaft angle reduced below about 120 degrees, so the limb shortens and abducts; coxa valga is an angle increased above about 135 degrees, so the limb lengthens and adducts. Both are measured on an AP radiograph and both alter how load crosses the hip.",
      },

      { type: "heading", level: 2, text: "Worked example: why an intracapsular neck fracture is a different disease" },
      {
        type: "paragraph",
        text: "The blood supply of the femoral head arrives at it from behind, not from within. The medial and lateral circumflex femoral arteries, branches of the profunda femoris, anastomose at the base of the neck and send retinacular branches up along it beneath the synovial reflection. Those vessels cross exactly the fracture line of an intracapsular neck of femur fracture. Tear them and the head is cut off.",
      },
      {
        type: "table",
        headers: ["Fracture type", "Broken through", "Blood supply to the head", "Usual treatment"],
        rows: [
          ["Intracapsular", "The joint capsule surrounds the neck, so the break is inside the capsule", "Retinacular arteries torn — the head dies", "Hemiarthroplasty or total hip replacement"],
          ["Extracapsular (trochanteric)", "The capsules attaches below the fracture, between the trochanters", "Retinacular vessels intact — the head lives", "Dynamic hip screw or intramedullary nail"],
        ],
      },
      {
        type: "question",
        prompt: "A patient with a displaced intracapsular neck of femur fracture is offered a partial hip replacement rather than an internal fixation. Why is the head not simply screwed back together?",
        answer: "Because the fracture has torn the retinacular arteries that ascend the neck, so the head has no blood supply and cannot heal. Fixing a dead bone gives a non-union and later a collapse, so the head is replaced.",
        explanation: "This is the reason for the split between intracapsular and extracapsular fracture management: one destroys the head's supply, the other leaves it intact.",
      },

      { type: "heading", level: 2, text: "The patella and the two shin bones" },
      {
        type: "paragraph",
        text: "The patella is the largest sesamoid bone — a bone formed inside a tendon. It sits in the quadriceps tendon and works like a pulley, lengthening the lever arm so the quadriceps can extend the knee with far less force. That is also why a fractured or painful patella is so disabling: the knee cannot extend against resistance and gives way on stairs.",
      },
      {
        type: "paragraph",
        text: "The tibia and fibula are the two-bone forearm's lower-limb equivalent, but with opposite emphasis. The tibia is the weight-bearer: it is the only shin bone that articulates with the femur at the knee, and it carries the whole load down to its medial malleolus. The fibula is a strut that takes almost no vertical load. It forms the lateral wall of the ankle mortise and provides the surface against which the peroneal muscles relax; it is a favourite source of bone graft because a segment can be removed with little consequence.",
      },
      {
        type: "table",
        headers: ["Bone", "Key features", "Clinical landmine"],
        rows: [
          ["Tibia", "Medial and lateral condyles, intercondylar eminence, tibial tuberosity, soleal line, medial malleolus", "The anterior surface is subcutaneous, so it is the commonest site of open fracture and slow-healing non-union"],
          ["Fibula", "Head with an apex for biceps femoris, shaft, lateral malleolus", "The common fibular nerve wraps around the neck, so a fracture at the neck gives foot drop"],
          ["Patella", "Base superiorly, apex inferiorly, articular facets on the posterior surface", "Dislocation goes laterally after a direct blow; a fractured patella cannot extend the knee"],
        ],
      },

      { type: "heading", level: 2, text: "The tarsals and the arches" },
      {
        type: "paragraph",
        text: "Seven tarsals form the hindfoot and midfoot: the talus and calcaneus, then the navicular, cuboid and the three cuneiforms. Two matter more than the rest. The talus has no muscular attachments at all and transmits the whole weight of the body from the leg into the foot; it is supplied by a retrograde arterial network entering distally, so a fracture across its neck, classically in a forced dorsiflexion injury, risks avascular necrosis. The calcaneus is the largest tarsal and bears the heel strike of every step; it is the bone fractured by a fall from a height.",
      },
      {
        type: "definition",
        term: "Arches of the foot",
        text: "The foot is not a flat board but a sprung structure. The medial longitudinal arch runs from the calcaneus along the talus, navicular and cuneiforms to the first three metatarsals; the lateral arch is the lower, flatter arch from the calcaneus to the fifth metatarsal; and a transverse arch runs across the midfoot. The talus is the keystone at the summit of the medial arch, and the loads on the arches are absorbed by the plantar fascia and the tendons beneath.",
      },
      {
        type: "paragraph",
        text: "The passive supports are the bones themselves and the plantar fascia and ligaments — especially the plantar (spring) ligament holding up the head of the talus. The active supports are the muscles of the sole and the tendons that sling the arch from either side: tibialis anterior, tibialis posterior, fibularis longus and the muscles of the sole, whose combined action converts the foot from a rigid lever to a shock-absorbing spring. That is why flat feet are not merely cosmetic — if the arch collapses the whole chain of the lower limb changes.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling the fibula a weight-bearing bone. It bears almost none of the vertical load — it is a strut and an origin for muscle. A fibular shaft fracture is therefore compatible with weight-bearing through the tibial shaft, while the reverse is not true.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the acetabulum is part of the ilium. It receives contributions from all three hip bones — ilium superiorly, ischium posteriorly, pubis anteriorly — and that three-way meeting is why a child's acetabular injury has consequences well into adult life.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating the 'false pelvis' as a sham structure. The greater pelvis is real — it is the lower abdominal cavity — it simply is not the birth canal. Obstetric diameters are taken inside the true pelvis, and confusing the two leads to the wrong measurement.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Which structure defines the boundary between the true and the false pelvis, and which bone does it begin with posteriorly?",
        answer: "The pelvic brim, or linea terminalis; posteriorly it begins at the sacral promontory, the most prominent anterior edge of the first sacral vertebra.",
        explanation: "Everything above the brim is the greater pelvis, part of the abdominal cavity; everything below is the lesser pelvis, the birth canal.",
      },
      {
        type: "question",
        prompt: "Why is the talus, among all the tarsals, uniquely vulnerable to avascular necrosis after fracture?",
        answer: "Because it has no muscle attachments and its arteries enter distally and run backwards, so a fracture through the neck cuts off the body from its supply.",
        explanation: "Same principle as the scaphoid in the hand: a retrograde arterial supply converts a fracture that looks trivial into a non-union.",
      },
      {
        type: "question",
        prompt: "A footballer falls and cannot extend the knee, with a palpable defect over the front of the joint. Which structure is disrupted and why does the injury disable extension?",
        answer: "The quadriceps tendon or the patella itself is disrupted, so the quadriceps no longer has a functioning lever. Without the patella the tendon's line of pull runs straight into the joint without the mechanical advantage the sesamoid provides.",
        explanation: "This is why patellar fracture and quadriceps tendon rupture present identically: no active extension of the knee.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which grouping correctly describes the bones that fuse to form the adult hip bone?",
        options: [
          "Ilium, ischium and pubis meeting in the acetabulum",
          "Ilium, sacrum and coccyx meeting at the sacroiliac joint",
          "Ischium, pubis and femur meeting at the hip joint",
          "Ilium, pubis and the lumbar spine meeting at the pelvic brim",
        ],
        correctIndex: 0,
        explanation: "The ilium, ischium and pubis are the three parts, and the Y-shaped growth plate between them lies in the acetabular floor and closes in adolescence. The sacrum and coccyx are separate bones joined at the sacroiliac and sacrococcygeal joints.",
      },
      {
        type: "mcq",
        stem: "Which statement about the true pelvis is correct?",
        options: [
          "It lies above the pelvic brim and holds the abdominal viscera",
          "It is bounded superiorly by the sacral promontory, the arcuate line and the pectineal line",
          "It is the same as the greater pelvis and is only an obstetric term",
          "Its only diameter of use is the transverse diameter",
        ],
        correctIndex: 1,
        explanation: "The linea terminalis — promontory, arcuate line, pectineal line — is the brim that bounds the true pelvis superiorly. The false pelvis lies above it; obstetricians use several diameters, not one.",
      },
      {
        type: "mcq",
        stem: "A patient's neck-shaft angle is measured at 110 degrees. Which term applies, and what is the mechanical consequence?",
        options: [
          "Coxa valga, with a lengthened, adducted limb",
          "Coxa vara, with a shortened, abducted limb and increased load on the femoral head",
          "Coxa vara, with a shortened, adducted limb",
          "Coxa valga, with a shortened, adducted limb",
        ],
        correctIndex: 1,
        explanation: "Below about 120 degrees is coxa vara: the shaft runs more horizontally, so the limb appears short and abducted and the shearing force across the head of the femur rises. Above about 135 degrees is coxa valga.",
      },
      {
        type: "mcq",
        stem: "Which bone among the tarsals carries no muscular attachments and is supplied by retrograde arteries that make neck fractures dangerous?",
        options: ["The calcaneus", "The navicular", "The cuboid", "The talus"],
        correctIndex: 3,
        explanation: "The talus is unique for this: no muscles attach to it, and its vessels enter distally. A fracture through its neck can leave the body avascular. The calcaneus, in contrast, is the largest tarsal and the one broken by a fall from height.",
      },
      {
        type: "mcq",
        stem: "Which pair of bone and structural role is correctly matched?",
        options: [
          "Fibula — bears the vertical load through the ankle mortise",
          "Patella — a sesamoid bone that lengthens the lever arm of the quadriceps tendon",
          "Tibia — forms the lateral malleolus and has no weight-bearing role",
          "Calcaneus — a short bone that articulates with the metatarsal heads directly",
        ],
        correctIndex: 1,
        explanation: "The patella is the largest sesamoid bone and increases the quadriceps' moment arm. The tibia, not the fibula, bears the load and forms the medial malleolus; the metatarsals articulate with the talus only through the navicular and cuneiforms.",
      },
      {
        type: "mcq",
        stem: "Which description best matches the medial longitudinal arch of the foot?",
        options: [
          "A flat platform from calcaneus to the five metatarsal heads",
          "A high arch whose keystone is the talus, supported by the plantar fascia and the plantar ligament",
          "A low arch formed by the tibia and fibula together",
          "An arch that crosses the midfoot transversely and has no passive support",
        ],
        correctIndex: 1,
        explanation: "The talus is the keystone at the summit, and the spring (plantar calcaneonavicular) ligament plus the plantar fascia stop it collapsing. The transverse arch is the one that runs across the midfoot.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The lower limb is a weight-bearing machine built to a different rule from the upper limb. The hip bone fuses from ilium, ischium and pubis in the acetabulum; the pelvic brim divides the abdominal cavity above from the true pelvis below; and the femur, patella, tibia, fibula and seven tarsals form a column with two shock-absorbing arches whose keystone is the talus. The femoral neck-shaft angle of about 125 degrees determines the load across the hip, the fibula is a strut rather than a bearer, and the retinacular arteries that climb the neck are what an intracapsular fracture destroys.",
      },
      {
        type: "paragraph",
        text: "Next: the muscles that move this skeleton. You will meet the glutei, the tensor of the thigh and the deep lateral rotators — and the one bedside test, the Trendelenburg test, that tells you whether a patient can stand on one leg.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 10 — Gluteal region & hip abductors (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the muscles of the gluteal region, grouped by innervation and by action; state the origin, insertion, action and nerve supply of gluteus maximus, gluteus medius, gluteus minimus and tensor fasciae latae; describe the deep lateral rotators and the order in which they insert on the greater trochanter; explain how the Trendelenburg test works and what a positive sign means; and give the safe site for an intramuscular injection in the buttock with the reason it is chosen.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 3, 4, 9 and 10 in the case of Module 1 — specifically the pectoral muscles and the brachial plexus, whose insertion-decides-action method and roots-to-branches reasoning are used again here — plus Lesson 9 for the bones these muscles hold.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Insertion dominates the action",
        text: "A muscle's action is determined far more by where it inserts than by where it originates. Gluteus medius and gluteus maximus both arise from the ilium and sacrum, yet one abducts the hip and steadies the pelvis while the other extends and rotates it, because their insertions differ: one on the greater trochanter, the other on the femur and the iliotibial tract.",
      },
      {
        type: "paragraph",
        text: "The gluteal region divides neatly into two territories, and the nerve supply tells you which is which. The superior gluteal nerve approaches from above the piriformis and supplies the abductors — gluteus medius and minimus and tensor fasciae latae. The inferior gluteal nerve passes below the piriformis and supplies the extensor, gluteus maximus. Learn the two nerves and the two groups and you have the region organised.",
      },

      { type: "heading", level: 2, text: "The superficial abductors" },
      {
        type: "table",
        headers: ["Muscle", "Origin", "Insertion", "Action", "Nerve supply"],
        rows: [
          ["Gluteus maximus", "Posterior ilium behind the posterior gluteal line, the sacrum and coccyx, and the sacrotuberous ligament", "Iliotibial tract and the gluteal tuberosity of the femur", "Powerful extension and lateral rotation of the hip; rises from sitting and climbs stairs", "Inferior gluteal nerve (L5, S1, S2)"],
          ["Gluteus medius", "Outer surface of the ilium between the anterior and posterior gluteal lines", "Lateral surface of the greater trochanter", "Abducts the hip and holds the pelvis level on one leg; anterior fibres flex and medially rotate", "Superior gluteal nerve (L4, L5, S1)"],
          ["Gluteus minimus", "Outer surface of the ilium between the anterior and inferior gluteal lines", "Anterior facet of the greater trochanter", "Abducts and medially rotates the hip", "Superior gluteal nerve (L4, L5, S1)"],
          ["Tensor fasciae latae", "Anterior superior iliac spine and the lip of the iliac crest", "Iliotibial tract", "Tenses the tract, and flexes, abducts and medially rotates the hip", "Superior gluteal nerve (L4, L5, S1)"],
        ],
      },
      {
        type: "paragraph",
        text: "Gluteus maximus is the largest muscle in the body, and it earns its size. It is silent on level ground and only needed when the hip fights gravity — climbing, running, rising from a chair. That is why a patient with a paralysed gluteus maximus can walk on the flat but can neither climb stairs nor rise from a chair unaided, and why the buttock is never merely decoration.",
      },

      { type: "heading", level: 2, text: "The deep lateral rotators" },
      {
        type: "paragraph",
        text: "Beneath the glutei lies a row of small muscles that pass from inside the pelvis outwards through the greater sciatic foramen to the greater trochanter. They are, in the order of their contact with the trochanter from above down: piriformis, obturator internus with the gemelli, and quadratus femoris.",
      },
      {
        type: "table",
        headers: ["Muscle", "Origin", "Insertion", "Action", "Nerve supply"],
        rows: [
          ["Piriformis", "Anterior sacrum", "Superior border of the greater trochanter", "Lateral rotation, and abduction when the hip is flexed", "Branches of the anterior rami of S1 and S2"],
          ["Obturator internus", "Obturator membrane and the bone around the foramen", "Medial surface of the greater trochanter", "Lateral rotation, and abduction when the hip is flexed", "Nerve to obturator internus (L5, S1, S2)"],
          ["Gemelli, superior and inferior", "Ischial spine and ischial tuberosity", "With the tendon of obturator internus", "Assist lateral rotation", "Superior gemellus from the obturator internus nerve; inferior from the nerve to quadratus femoris"],
          ["Quadratus femoris", "Ischial tuberosity", "Quadrate tubercle of the femur", "Lateral rotation and adduction", "Nerve to quadratus femoris (L4, L5, S1)"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Piriformis is the landmark the whole region is organised around. The sciatic nerve usually emerges from the greater sciatic foramen just below it, and every structure leaving the pelvis is described as above or below piriformis. That is the anatomy behind piriformis syndrome: an enlarged or spastic piriformis rubs the nerve where it passes.",
      },

      { type: "heading", level: 2, text: "Worked example: the Trendelenburg test" },
      {
        type: "paragraph",
        text: "When you stand on both legs the pelvis is held level by the abductors of each hip pulling down on the fixed side. Ask the patient to stand on one leg and the pelvis on the unsupported side should stay level, because the stance-side abductors are doing the work. If they cannot hold it, the pelvis drops on the swing side — a positive Trendelenburg sign, the signature of weak hip abductors.",
      },
      {
        type: "table",
        headers: ["Position of the body", "Force required", "Muscle that supplies it"],
        rows: [
          ["Standing on the right leg", "The left side of the pelvis must stay level against gravity pulling it down", "Right gluteus medius and minimus"],
          ["Positive sign", "The left side sags, so the trunk lurches to the right to bring the centre of gravity over the supporting hip", "The right abductors are failing, or the right superior gluteal nerve is injured"],
          ["Common causes", "Superior gluteal nerve injury, poliomyelitis, slipped upper femoral epiphysis, or simple deconditioning", "Any interruption of the abductor chain"],
        ],
      },
      {
        type: "paragraph",
        text: "This is worth pausing on, because the compensation is as famous as the sign. The patient leans the trunk over the stance limb; that shifts the centre of gravity so the pelvis is steadied without the abductors. Seen walking, the lurch is unmistakable, and the side of the lean tells you which hip is at fault. A superior gluteal nerve lesion classically follows hip surgery or an iliac bone graft, because the nerve runs on the inner surface of the ilium where a graft is taken.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The safe place for an intramuscular injection in the buttock is the upper outer quadrant, and the reason is anatomy rather than superstition. The sciatic nerve passes below the piriformis through the lower middle of the buttock; an injection in the upper outer quadrant puts the needle well away from that nerve, from the gluteal vessels and from the hip joint itself.",
      },

      { type: "heading", level: 2, text: "Worked example: what the iliotibial tract does" },
      {
        type: "paragraph",
        text: "The lateral thigh is a single tendinous sheet, the iliotibial tract, which gluteus maximus and tensor fasciae latae pull into tension from above while the quadriceps tenses it through the patella below. Because it passes in front of the axis of the knee it acts as a lateral stabiliser: during running or cycling it rubs against the lateral femoral epicondyle, and the resulting friction is what iliotibial band syndrome is.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the Trendelenburg sign is the weakness itself. The sign is the visible consequence — the pelvis dropping on the swing side — and it is named for the direction of the drop. Students frequently invert it: if the patient stands on the painful leg and the opposite pelvis sags, the problem is in the stance leg.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing piriformis with a gluteal muscle. It is a deep lateral rotator, supplied by its own branches from S1 and S2, and it is the one that matters because the sciatic nerve usually emerges just below it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing abduction to gluteus maximus. It is mainly an extensor and lateral rotator; abduction above about 15 degrees is taken over by gluteus medius and minimus.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient stands on the left leg and the right side of the pelvis drops. Which muscles have failed, and what will the gait look like?",
        answer: "The left hip abductors — left gluteus medius and minimus — have failed. The gait will show a lurch of the trunk towards the left, because that is the compensation that brings the centre of gravity over the supporting hip.",
        explanation: "This is the positive Trendelenburg sign. The side of the lesion is the side of the single-leg stance, not the side of the drop.",
      },
      {
        type: "question",
        prompt: "Two nerves supply the gluteal region and they divide it exactly. Which supplies gluteus medius and which supplies gluteus maximus, and how do they pass in relation to piriformis?",
        answer: "The superior gluteal nerve supplies gluteus medius, gluteus minimus and tensor fasciae latae, and it leaves the pelvis above piriformis. The inferior gluteal nerve supplies gluteus maximus, and it leaves below piriformis.",
        explanation: "Above and below piriformis: the pattern of the entire region, and of the sciatic nerve that travels with them.",
      },
      {
        type: "question",
        prompt: "Why is gluteus maximus largely silent when a person walks on the flat, but essential when rising from a chair?",
        answer: "It is a muscle that fights gravity at the hip. Walking on the level is mostly balanced and forward; rising from a chair requires powerful extension of the flexed hip against the body's weight, which is exactly the moment gluteus maximus works hardest.",
        explanation: "Its size — the largest in the body — reflects the peak force it has to generate, not a constant background activity.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient stands on the right leg and the left iliac crest falls below the level of the right. Which structure is responsible for the failure?",
        options: [
          "The left gluteus medius and the left superior gluteal nerve",
          "The left gluteus maximus and the left inferior gluteal nerve",
          "The right sciatic nerve",
          "The right femoral nerve",
        ],
        correctIndex: 2,
        explanation: "The pelvis drops on the side of the unsupported leg, so the abductors of the stance leg — right gluteus medius and minimus, supplied by the right superior gluteal nerve — have failed. Note that the drop is on the left but the fault is on the right.",
      },
      {
        type: "mcq",
        stem: "Which of these muscles does NOT insert on the greater trochanter?",
        options: ["Gluteus medius", "Gluteus minimus", "Piriformis", "Quadratus femoris"],
        correctIndex: 3,
        explanation: "Quadratus femoris inserts on the quadrate tubercle of the femur, below the trochanter. Medius, minimus, piriformis and obturator internus all reach the trochanteric region.",
      },
      {
        type: "mcq",
        stem: "Which combination correctly matches nerve to muscle?",
        options: [
          "Superior gluteal nerve to gluteus maximus",
          "Inferior gluteal nerve to gluteus medius",
          "Inferior gluteal nerve to gluteus maximus",
          "Nerve to quadratus femoris to gluteus minimus",
        ],
        correctIndex: 2,
        explanation: "The division is strict: superior gluteal nerve to medius, minimus and tensor fasciae latae; inferior gluteal nerve to maximus. Everything else in the region has its own small branch.",
      },
      {
        type: "mcq",
        stem: "An intramuscular injection is given into the buttock. Which quadrant is chosen, and what is the structure it avoids?",
        options: [
          "Lower inner quadrant, avoiding the femoral artery",
          "Upper outer quadrant, avoiding the sciatic nerve",
          "The centre of the buttock, avoiding the gluteal vessels",
          "Lower outer quadrant, avoiding the pudendal nerve",
        ],
        correctIndex: 1,
        explanation: "The upper outer quadrant keeps the needle away from the sciatic nerve, which passes through the lower medial part of the buttock below piriformis.",
      },
      {
        type: "mcq",
        stem: "Which statement about piriformis is correct?",
        options: [
          "It is supplied by the superior gluteal nerve like the other abductors",
          "It is supplied by its own branches from the sacral plexus and the sciatic nerve usually emerges below it",
          "It inserts on the medial femoral condyle",
          "It is the abductor tested by the Trendelenburg sign",
        ],
        correctIndex: 1,
        explanation: "Piriformis is a deep lateral rotator supplied directly from S1 and S2, and it is clinically important because the sciatic nerve usually passes below it — the anatomical basis of piriformis syndrome.",
      },
      {
        type: "mcq",
        stem: "A runner with lateral knee pain is diagnosed with iliotibial band syndrome. Which structures tension the band from above?",
        options: [
          "The hamstrings and sartorius",
          "Gluteus maximus and tensor fasciae latae",
          "Biceps femoris and gracilis",
          "The adductors alone",
        ],
        correctIndex: 1,
        explanation: "Gluteus maximus and tensor fasciae latae both insert into the iliotibial tract; the quadriceps also tenses it from below through the patella. Its friction over the lateral femoral epicondyle is what produces the runner's knee pain.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The gluteal region is divided by two nerves: the superior gluteal nerve supplies the abductors — gluteus medius and minimus and tensor fasciae latae — above piriformis, and the inferior gluteal nerve supplies gluteus maximus below. The deep lateral rotators lie underneath, and the sciatic nerve travels with them. The Trendelenburg test is the bedside test of the abductors: when the pelvis drops on the swing side the stance-side abductors have failed, and the trunk lurches to compensate. The upper outer quadrant is the safe site for a buttock injection because of where the sciatic nerve runs.",
      },
      {
        type: "paragraph",
        text: "Next: the front of the thigh. You will enter the femoral triangle, meet its contents in the NAVEL order, and see why the femoral artery at the groin is the vessel a physician reaches for first in an emergency.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 11 — Femoral triangle & adductor canal (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the boundaries, floor and roof of the femoral triangle and list its contents in the NAVEL order; explain the significance of the femoral canal as the site of a femoral hernia and why such a hernia is commoner in women; identify where the femoral pulse is palpable and what structure lies behind the artery at that point; describe the boundaries and contents of the adductor canal and the vessel's fate in the adductor hiatus; and name the purely sensory nerve of the leg that travels with the great saphenous vein.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 9 and 10. You need the hip bone and the lower limb skeleton, and the gluteal attachments that determine where the muscles of the anterior thigh run.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The femoral triangle",
        text: "The triangular depression in the upper front of the thigh, bounded superiorly by the inguinal ligament, laterally by the medial border of sartorius and medially by the medial border of adductor longus. It is the crossroads where the vessels, nerves and lymphatics of the abdomen reach the limb, and it is the reason blood can be taken from the groin.",
      },
      {
        type: "paragraph",
        text: "Think of the femoral triangle as the doorway between the abdomen and the lower limb. Everything that crosses the inguinal ligament into the leg passes through it, and the things that pass through it do so in a strictly repeatable order. Once you know the order and the boundaries you can find any of them without seeing them — which is what an arterial puncture, a femoral nerve block and a hernia examination each require.",
      },
      {
        type: "table",
        headers: ["Feature", "Structure", "Note"],
        rows: [
          ["Superior border (base)", "The inguinal ligament", "Runs from the anterior superior iliac spine to the pubic tubercle"],
          ["Lateral border", "The medial border of sartorius", "Sartorius forms the lateral wall"],
          ["Medial border", "The medial border of adductor longus", "The adductor is the medial border"],
          ["Floor", "Iliopsoas laterally and pectineus medially", "The floor is muscle, not bone"],
          ["Roof", "Fascia lata, and the cribriform fascia over the saphenous opening", "The great saphenous vein pierces the roof here"],
        ],
      },

      { type: "heading", level: 2, text: "The contents in NAVEL order" },
      {
        type: "paragraph",
        text: "From lateral to medial across the triangle the structures are: nerve, artery, vein, empty space, lymphatics — NAVEL. The mnemonic is worth learning because it fixes the whole anatomy of the groin and because it is asked repeatedly in examinations.",
      },
      {
        type: "table",
        headers: ["Position, lateral to medial", "Structure", "What is inside", "Clinical use"],
        rows: [
          ["Nerve", "Femoral nerve", "Nerve only, lying outside the femoral sheath", "Femoral nerve block for leg surgery; injury gives no knee extension and no patellar reflex"],
          ["Artery", "Femoral artery", "Artery inside the femoral sheath", "Palpated for the pulse; the site of arterial puncture and cannulation"],
          ["Vein", "Femoral vein", "Vein inside the femoral sheath", "Central venous access and cardiac catheterisation"],
          ["Empty space", "Femoral canal", "A space with fat and a lymph node", "The site of a femoral hernia"],
          ["Lymphatics", "Deep inguinal nodes and lymphatic vessels", "Draining vessels", "The route by which lower limb drainage crosses into the pelvis"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The femoral sheath is the sleeve of fascia enclosing the artery, the vein and the canal — but NOT the nerve. That single fact separates the nerve from everything else in the triangle, and it is why a femoral nerve block must be placed outside the sheath.",
      },

      { type: "heading", level: 2, text: "Worked example: finding the femoral pulse" },
      {
        type: "paragraph",
        text: "The femoral artery is palpated below the inguinal ligament at the mid-inguinal point — roughly halfway between the anterior superior iliac spine and the pubic symphysis, where the head of the femur sits directly behind the vessel. Note carefully that a pulse felt at the midpoint of the ligament is often a pulsation you have dragged medially over an inguinal node. In shock the femoral pulse is one of the first to disappear, and the ability to find it quickly is why the landmark is drilled into every student.",
      },
      {
        type: "question",
        prompt: "During cardiac catheterisation a needle is inserted into the right femoral artery below the inguinal ligament. Why is this site chosen, and what is the danger of puncturing too high?",
        answer: "The artery is large, superficial and easily compressed against the femoral head below the ligament, so bleeding can be controlled. A puncture above the ligament risks the external iliac artery, which lies in the pelvis and cannot be compressed — so a bleed becomes an uncontrolled retroperitoneal haematoma.",
        explanation: "The compressibility of the femoral artery depends on the femoral head sitting directly behind it; that support is also what makes the site attractive for closure devices.",
      },

      { type: "heading", level: 2, text: "The femoral canal and femoral hernia" },
      {
        type: "definition",
        term: "Femoral hernia",
        text: "A protrusion of abdominal contents — usually a loop of small bowel — through the femoral ring into the femoral canal. It appears as a lump in the groin below the inguinal ligament and is commoner in women, because the wider female pelvis leaves a bigger femoral ring.",
      },
      {
        type: "table",
        headers: ["Property", "Femoral hernia", "Inguinal hernia"],
        rows: [
          ["Relation to the pubic tubercle", "Below and lateral", "Above and medial"],
          ["Route taken", "Through the femoral ring and canal", "Through the inguinal canal"],
          ["Sex ratio", "Commoner in women", "Commoner in men"],
          ["Risk of strangulation", "High — the femoral ring is rigid and unforgiving", "Lower — the canal is a softer passage"],
          ["Surgical approach", "From below, or through the same low incision", "From above, through the inguinal canal"],
        ],
      },
      {
        type: "paragraph",
        text: "A femoral hernia's narrow ring — bounded by the inguinal ligament in front, the pectineal line behind, the lacunar ligament medially and the femoral vein laterally — is a trap. Content that enters can be squeezed, and strangulated femoral hernias are a surgical emergency in which the mortality comes from the delay, not the operation.",
      },

      { type: "heading", level: 2, text: "The adductor canal" },
      {
        type: "definition",
        term: "Adductor (subsartorial) canal",
        text: "A muscular tunnel in the middle third of the thigh, bounded by sartorius anteriorly, vastus medialis laterally and adductor longus and magnus posteriorly, which carries the femoral vessels to the back of the knee. Its distal opening is the adductor hiatus, through which the femoral artery and vein pass to become the popliteal artery and vein.",
      },
      {
        type: "table",
        headers: ["Content", "Detail", "Clinical relevance"],
        rows: [
          ["Femoral artery", "Runs deep to sartorius through the middle of the thigh", "Becomes popliteal at the hiatus; the site of arterial injury in a supracondylar fracture"],
          ["Femoral vein", "Passes from a lateral to a posterior position within the canal", "The posterior position makes it vulnerable in surgery"],
          ["Saphenous nerve", "The largest cutaneous branch of the femoral nerve, purely sensory", "Leaves the canal to join the great saphenous vein; the nerve at risk in vein stripping and in ankle surgery"],
          ["Nerve to vastus medialis", "A branch of the femoral nerve", "Supplies the quadriceps component that steadies the patella"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The saphenous nerve is the longest sensory nerve of the lower limb and it is not a motor nerve: it carries sensation from the medial leg and ankle but moves nothing. It is therefore the nerve that can be sacrificed with only a patch of numbness as the price, and the nerve at risk in surgery along the great saphenous vein.",
      },

      { type: "heading", level: 2, text: "The profunda femoris" },
      {
        type: "paragraph",
        text: "The femoral artery gives off its largest branch, the deep femoral (profunda femoris) artery, in the femoral triangle; it passes posteriorly between pectineus and adductor longus and runs down the medial side of the femur. It gives the medial and lateral circumflex femoral arteries, which reunite around the hip in the cruciate anastomosis, and three or four perforating arteries that pierce the adductors along the linea aspera to supply the posterior compartment. Its importance is collateral: if the femoral artery is blocked, that ring of small anastomoses can keep the limb alive.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "An artery that passes into a compartment through a hiatus can keep pumping blood into it with nowhere to return. If the popliteal artery is severed at the hiatus, the bleeding point is hard to find and the calf can swell catastrophically — which is why the adductor hiatus is a landmark a surgeon must name when operating here.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Placing the femoral nerve inside the femoral sheath. The sheath encloses the artery, the vein and the canal only. A block that misses this fact injects into the sheath and anaesthetises nothing.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying a femoral hernia is commoner in men. It is the inguinal hernia that is commoner in men; the femoral hernia is commoner in women, and much more dangerous, because the ring through which it emerges is narrow and rigid.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the femoral pulse point with the mid-point of the inguinal ligament. The artery crosses the ligament at the mid-inguinal point, and the head of the femur directly behind it is what allows the artery to be compressed after catheterisation.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the contents of the femoral triangle from lateral to medial.",
        answer: "Nerve (femoral), artery, vein, empty space (the femoral canal), and lymphatics — NAVEL.",
        explanation: "The order is the same whether you are opening the triangle surgically or being asked which side the nerve lies on.",
      },
      {
        type: "question",
        prompt: "A woman presents with a groin lump below the inguinal ligament, medial to the femoral pulse, that is tender and cannot be reduced. What is it and why the urgency?",
        answer: "It is a femoral hernia, and it is urgent because the femoral ring is rigid: the herniated contents can be compressed and strangulated, so the bowel loses its blood supply and can perforate.",
        explanation: "Its low position, below the ligament, and its medial relation to the pulse distinguish it from an inguinal hernia.",
      },
      {
        type: "question",
        prompt: "Where exactly does the femoral artery become the popliteal artery, and why does that transition matter to a structure behind the knee?",
        answer: "Through the adductor hiatus, the opening in adductor magnus, at the lower end of the adductor canal. It matters because from there the artery lies deep in the popliteal fossa, closest to the bone, which is why it is a vulnerable structure in distal femoral fractures.",
        explanation: "The hiatus is the transition point from the front of the thigh to the back of the knee.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which list gives the contents of the femoral triangle from lateral to medial?",
        options: [
          "Nerve, artery, vein, empty space, lymphatics",
          "Artery, nerve, vein, lymphatics, canal",
          "Vein, artery, nerve, canal, lymphatics",
          "Empty space, nerve, artery, vein, lymphatics",
        ],
        correctIndex: 0,
        explanation: "NAVEL: nerve, artery, vein, empty space (femoral canal), lymphatics. The nerve stands alone outside the femoral sheath.",
      },
      {
        type: "mcq",
        stem: "Which statement about the femoral canal is correct?",
        options: [
          "It contains the femoral nerve and nothing else of note",
          "It is the medial part of the femoral sheath and is the site of a femoral hernia",
          "It lies lateral to the femoral artery and contains the deep inguinal nodes only",
          "It is inside the femoral sheath together with the femoral nerve",
        ],
        correctIndex: 1,
        explanation: "The canal is the medial compartment of the femoral sheath and the passage a femoral hernia takes. The femoral nerve lies outside the sheath entirely.",
      },
      {
        type: "mcq",
        stem: "Where is the femoral artery best palpated, and what lies directly behind it there?",
        options: [
          "At the mid-point of the inguinal ligament, with the psoas behind it",
          "At the mid-inguinal point below the ligament, with the head of the femur behind it",
          "In the mid-thigh, with the femoral shaft behind it",
          "Behind the medial knee, with the tibial plateau behind it",
        ],
        correctIndex: 1,
        explanation: "The artery crosses the ligament at the mid-inguinal point, and the head of the femur directly behind it provides firm support for compression after catheterisation.",
      },
      {
        type: "mcq",
        stem: "Which structure passes through the adductor hiatus to become the popliteal artery?",
        options: ["The profunda femoris artery", "The femoral artery", "The saphenous artery", "The deep external pudendal artery"],
        correctIndex: 1,
        explanation: "The femoral artery continues through the adductor canal and then through the adductor hiatus in adductor magnus, where it becomes the popliteal artery. The profunda is a branch, not the continuation.",
      },
      {
        type: "mcq",
        stem: "A patient has lost sensation over the medial side of the leg but has normal power in the quadriceps. Which nerve has been injured?",
        options: ["The femoral nerve itself", "The obturator nerve", "The saphenous nerve", "The common fibular nerve"],
        correctIndex: 2,
        explanation: "The saphenous nerve is the sensory branch of the femoral nerve that runs in the adductor canal and down the medial leg; it carries no motor fibres, so power is normal. Injury to the femoral nerve itself would also paralyse knee extension.",
      },
      {
        type: "mcq",
        stem: "In a strangulated femoral hernia, which boundaries form the rigid ring that traps the contents?",
        options: [
          "Inguinal ligament in front, pectineal line behind, lacunar ligament medially and the femoral vein laterally",
          "The inguinal canal, the conjoint tendon and the internal oblique",
          "The pectineal line, the rectus sheath and the umbilicus",
          "The adductor longus, the vastus medialis and the sartorius",
        ],
        correctIndex: 0,
        explanation: "The femoral ring — ligament, pectineal line, lacunar ligament and femoral vein — is narrow and unforgiving. That is the structural reason strangulation is so much commoner in a femoral than an inguinal hernia.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The femoral triangle is the doorway between abdomen and leg: inguinal ligament above, sartorius laterally, adductor longus medially, with the contents running lateral to medial as nerve, artery, vein, empty space, lymphatics. The artery is palpated at the mid-inguinal point, against the femoral head; the canal is the medial compartment and the site of the more dangerous groin hernia, commoner in women; and the artery then passes through the adductor canal and the adductor hiatus to become the popliteal artery, carrying the saphenous nerve with it as far as the medial leg.",
      },
      {
        type: "paragraph",
        text: "Next: the back of the knee and the muscular compartments of the leg — the popliteal fossa with its artery, vein, tibial nerve and common fibular nerve, the three compartments of the leg, and the nerve whose injury at the fibular neck produces foot drop.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 12 — Popliteal fossa, leg compartments & foot (fully authored)
// ---------------------------------------------------------------------------
function lesson12() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the boundaries and contents of the popliteal fossa and give the order of its contents from deep to superficial; name the muscles of the anterior, lateral and posterior compartments of the leg and the action of each group; list the order of the tendons and the neurovascular bundle behind the medial malleolus and in front of the ankle; explain why the common fibular nerve is the nerve most often injured in the lower limb; and describe the arches of the foot and the structures that support each.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 11 (the femoral triangle and adductor canal), because the popliteal artery and vein are the direct continuation of the structures whose course you have just followed down the thigh.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Compartments",
        text: "The leg is wrapped in deep fascia that divides the muscles into closed compartments — anterior, lateral and posterior. Each compartment is a fibrous box, and the box is the whole explanation of two clinical facts: compartment syndrome, in which swelling inside a closed box strangles its contents, and the classical pattern of nerve injury, in which a lesion of the nerve supplying a compartment produces exactly the movement that compartment is responsible for.",
      },
      {
        type: "paragraph",
        text: "One idea links everything: each compartment has a muscle group, a motor nerve and a principal artery. Anterior compartment — dorsiflexors, deep fibular nerve, anterior tibial artery. Lateral compartment — evertors, superficial fibular nerve. Posterior compartment — plantarflexors, tibial nerve, posterior tibial artery. Learn the triads and the territory of every nerve injury falls out without further memorisation.",
      },

      { type: "heading", level: 2, text: "The popliteal fossa" },
      {
        type: "paragraph",
        text: "The popliteal fossa is the diamond-shaped hollow behind the knee. Its four borders are the hamstrings above — biceps femoris superolaterally, semimembranosus and semitendinosus superomedially — and the two heads of gastrocnemius below. The floor is the popliteal surface of the femur and the posterior capsule of the knee; the roof is the popliteal fascia.",
      },
      {
        type: "table",
        headers: ["Content, deepest to most superficial", "Course", "Clinical note"],
        rows: [
          ["Popliteal artery", "The deepest structure; continues from the femoral artery and ends by dividing into the anterior and posterior tibial arteries", "Deep to the vein, so an aneurysm here compresses the vein first"],
          ["Popliteal vein", "Lies between the artery and the tibial nerve", "Becomes the femoral vein at the adductor hiatus"],
          ["Tibial nerve", "Runs superficial to the vessels, in the midline", "Continues into the posterior compartment and ends as the medial and lateral plantar nerves"],
          ["Common fibular nerve", "Superolateral, along the border of biceps femoris", "The nerve most at risk in the whole lower limb"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Remember that the popliteal artery is the deepest structure in the fossa. That is why an expanding popliteal aneurysm or a Baker's cyst causes venous swelling of the leg before anything else: the vessel compresses its neighbour, the popliteal vein, and the return of blood from the calf is obstructed.",
      },

      { type: "heading", level: 2, text: "The leg compartments" },
      {
        type: "paragraph",
        text: "Below the knee the deep fascia of the leg, together with the interosseous membrane and the fibula, forms three impermeable compartments. Each has its own nerve and artery, and each performs one class of movement.",
      },
      {
        type: "table",
        headers: ["Compartment", "Muscles", "Principal action", "Nerve", "Artery"],
        rows: [
          ["Anterior", "Tibialis anterior, extensor hallucis longus, extensor digitorum longus, fibularis tertius", "Dorsiflexion and extension of the toes", "Deep fibular (peroneal) nerve", "Anterior tibial artery"],
          ["Lateral", "Fibularis (peroneus) longus and brevis", "Eversion of the foot; steady the lateral arch", "Superficial fibular (peroneal) nerve", "Branches of the fibular artery"],
          ["Posterior, superficial layer", "Gastrocnemius, soleus and plantaris, joining in the tendo calcaneus", "Plantarflexion of the foot", "Tibial nerve", "Posterior tibial artery through its sural branches"],
          ["Posterior, deep layer", "Tibialis posterior, flexor digitorum longus, flexor hallucis longus, popliteus", "Inversion, plantarflexion and flexion of the toes; popliteus unlocks the knee", "Tibial nerve", "Posterior tibial and fibular arteries"],
        ],
      },
      {
        type: "paragraph",
        text: "The tendo calcaneus — the Achilles tendon — is the largest and strongest tendon in the body, and it is the only tendon that gastrocnemius and soleus share, so its rupture removes plantarflexion power while leaving the deep flexors intact. It receives no synovial sheath and has a relatively poor blood supply about two fingers' breadths above the heel, which is exactly where it tears.",
      },

      { type: "heading", level: 2, text: "The ankle: the tendons you must name" },
      {
        type: "paragraph",
        text: "At the ankle the tendons and vessels are held down by retinacula, thickened bands of deep fascia that act as pulleys and stop the tendons bowstringing. There are two useful orderings, one for each side of the ankle.",
      },
      {
        type: "paragraph",
        text: "Behind the medial malleolus, from anterior to posterior, lie tibialis posterior, flexor digitorum longus, the posterior tibial artery and its venae comitantes, the tibial nerve, and flexor hallucis longus. This is the same principle as the carpal tunnel, and the same surgical logic: a tunnel that can be released to decompress its contents.",
      },
      {
        type: "table",
        headers: ["Side of the ankle", "Order of structures", "Nerve at risk"],
        rows: [
          ["Posterior to the medial malleolus, anterior to posterior", "Tibialis posterior; flexor digitorum longus; posterior tibial artery and vein; tibial nerve; flexor hallucis longus", "Tibial nerve — tarsal tunnel syndrome"],
          ["Anterior to the ankle, medial to lateral", "Tibialis anterior; extensor hallucis longus; anterior tibial artery, vein and deep fibular nerve; extensor digitorum longus", "Deep fibular nerve"],
          ["Posterior to the lateral malleolus", "Fibularis longus and brevis, with the sural nerve posterior to the small saphenous vein", "Sural nerve"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The posterior tibial pulse is palpated behind the medial malleolus, halfway between it and the heel. If the pulse is absent and the foot is cold and pale, the problem is arterial inflow, not the nerves in the tunnel; if sensation over the sole is lost with a normal pulse, it is tarsal tunnel syndrome.",
      },

      { type: "heading", level: 2, text: "The common fibular nerve: the injury to expect" },
      {
        type: "definition",
        term: "Foot drop",
        text: "Inability to dorsiflex the ankle, caused by paralysis of the anterior compartment of the leg. The foot hangs down, and the patient lifts the knee high so the toes clear the ground — the high-stepping or steppage gait. The cause is almost always injury to the common fibular nerve as it winds around the neck of the fibula, where it lies directly against bone, unprotected by muscle.",
      },
      {
        type: "paragraph",
        text: "The common fibular nerve divides into a superficial branch, which supplies the lateral compartment (the evertors), and a deep branch, which supplies the anterior compartment (the dorsiflexors). Because the nerve is so superficial where it crosses the fibular neck — one of the few places a nerve lies directly on bone — it is damaged by a fibular neck fracture, by a plaster cast that is too tight, by prolonged bed rest with the knees flexed and the legs crossed, and by a direct blow. Sensation is lost over the dorsum of the foot and the lateral side of the leg, but the sole is spared because that is tibial nerve territory.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A patient who cannot lift the foot after a total hip replacement has not had a stroke. The traction of hip surgery injures the common fibular division, and foot drop after a hip operation is a far commoner explanation than a central lesion.",
      },

      { type: "heading", level: 2, text: "The arches of the foot" },
      {
        type: "paragraph",
        text: "Three structures maintain the medial longitudinal arch passively and several actively. Passively it is the shape of the bones themselves, the plantar calcaneonavicular (spring) ligament, and the plantar fascia. Actively it is the tendon of tibialis anterior, which supports the arch from above, and the tendons of tibialis posterior, fibularis longus and flexor hallucis longus, which sling it from below.",
      },
      {
        type: "table",
        headers: ["Feature", "Detail"],
        rows: [
          ["Medial longitudinal arch", "Calcaneus, talus, navicular, cuneiforms and the first three metatarsals; the talus is the keystone"],
          ["Lateral longitudinal arch", "Calcaneus, cuboid and fifth metatarsal; lower, flatter, and lands on the ground first"],
          ["Transverse arch", "Across the midfoot at the cuneiforms and cuboid; flattens on standing"],
          ["Keystone", "The talus, at the summit of the medial arch, receives weight from above and passes it to the calcaneus and navicular"],
        ],
      },
      {
        type: "paragraph",
        text: "Because the talus is the keystone, a fall that drives it downwards flattens the medial arch and forces the row of bones wider. In a long-standing flat foot the muscles that actively support the arch tire first, and then the ligaments stretch. Flat feet are common and usually asymptomatic; what matters is the reverse, a high and rigid arch, which concentrates load on the heads of the metatarsals and causes pain.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the tibial nerve supplies the dorsum of the foot. The dorsum and the lateral side of the leg are common fibular nerve territory, and the sole is tibial nerve territory. Two nerves, two completely separate surfaces — get this wrong and every foot-drop interpretation is inverted.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Describing the popliteal artery as the most superficial structure in the fossa. The tibial nerve lies most superficially; the artery is deepest. That order is what makes an aneurysm compress the vein and cause a swollen calf before it does anything to the nerve.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing plantar fasciitis with a nerve entrapment. Plantar fasciitis is a degenerative tear in the fascia and gives heel pain on the first steps of the morning; tarsal tunnel syndrome is compression of the tibial nerve behind the malleolus and gives burning numbness in the sole, worse on standing.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the order of the contents of the popliteal fossa from the deepest to the most superficial.",
        answer: "Popliteal artery (deepest), popliteal vein, tibial nerve, and the common fibular nerve, which lies superolaterally.",
        explanation: "The nerve lying most superficially is also why a posterior knee dislocation can injure the tibial nerve without interrupting the arterial pulse.",
      },
      {
        type: "question",
        prompt: "A patient falls and fractures the neck of the fibula. Which nerve is injured and which movements are lost?",
        answer: "The common fibular nerve, which winds around the fibular neck. Dorsiflexion of the ankle and extension of the toes are lost (anterior compartment, deep fibular branch), and eversion is lost (lateral compartment, superficial fibular branch). The sole keeps normal sensation because that is tibial nerve territory.",
        explanation: "The result is foot drop with a high-stepping gait and sensory loss over the dorsum of the foot.",
      },
      {
        type: "question",
        prompt: "Which tendon supports the head of the talus, and what happens to the arch if it fails?",
        answer: "The tendon of tibialis posterior, together with the plantar calcaneonavicular (spring) ligament, supports the talus. When it fails the talus collapses medially and downwards and the medial arch flattens — a painful acquired flat foot.",
        explanation: "This is why a torn tibialis posterior classically presents in a middle-aged patient with a flattening arch and difficulty rising onto the toes on one foot.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is the deepest structure in the popliteal fossa?",
        options: ["The tibial nerve", "The common fibular nerve", "The popliteal artery", "The popliteal vein"],
        correctIndex: 2,
        explanation: "The popliteal artery lies deepest, on the bone and the capsule, which is why it is injured in a distal femoral fracture and why an aneurysm there compresses the vein before anything else.",
      },
      {
        type: "mcq",
        stem: "A patient cannot dorsiflex the foot and sensation is lost on the dorsum of the foot. Which nerve has been injured and where is the lesion?",
        options: [
          "The tibial nerve in the popliteal fossa",
          "The common fibular nerve at the neck of the fibula",
          "The saphenous nerve at the knee",
          "The sural nerve at the ankle",
        ],
        correctIndex: 1,
        explanation: "Foot drop with sensory loss over the dorsum of the foot is the lesion of the common fibular nerve, classically where it winds around the fibular neck. The tibial nerve supplies the posterior compartment and would have given loss of plantarflexion instead.",
      },
      {
        type: "mcq",
        stem: "Which grouping of muscles, action and nerve is correct for the leg?",
        options: [
          "Anterior compartment — plantarflexion — tibial nerve",
          "Lateral compartment — eversion — superficial fibular nerve",
          "Posterior compartment — dorsiflexion — deep fibular nerve",
          "Anterior compartment — inversion — tibial nerve",
        ],
        correctIndex: 1,
        explanation: "The lateral compartment everts the foot and is supplied by the superficial fibular nerve. Anterior is dorsiflexion and the deep fibular nerve; posterior is plantarflexion and the tibial nerve.",
      },
      {
        type: "mcq",
        stem: "Which order lists the structures behind the medial malleolus from anterior to posterior?",
        options: [
          "Tibial nerve; tibialis posterior; flexor hallucis longus; posterior tibial artery; flexor digitorum longus",
          "Tibialis posterior; flexor digitorum longus; posterior tibial artery and vein; tibial nerve; flexor hallucis longus",
          "Flexor digitorum longus; tibialis posterior; tibial nerve; posterior tibial artery; flexor hallucis longus",
          "Flexor hallucis longus; tibialis posterior; tibial nerve; flexor digitorum longus; artery",
        ],
        correctIndex: 1,
        explanation: "Tom, Dick and a nervous Harry: tibialis posterior, then flexor digitorum longus, then the artery, the vein and the tibial nerve, with flexor hallucis longus posterior to them all.",
      },
      {
        type: "mcq",
        stem: "Which surface of the foot keeps sensation after a common fibular nerve injury?",
        options: ["The dorsum of the foot", "The dorsum of the toes", "The sole of the foot", "The lateral side of the leg"],
        correctIndex: 2,
        explanation: "The sole is tibial nerve territory, so a common fibular lesion spares it; the dorsum, the lateral leg and the dorsum of the toes are lost.",
      },
      {
        type: "mcq",
        stem: "Which is the keystone bone at the summit of the medial longitudinal arch?",
        options: ["The calcaneus", "The navicular", "The talus", "The cuboid"],
        correctIndex: 2,
        explanation: "The talus sits at the summit of the medial arch and distributes weight to the calcaneus behind and the navicular in front; if it drops, the arch collapses.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The popliteal fossa is a diamond behind the knee whose contents, from deep to superficial, are popliteal artery, popliteal vein, tibial nerve and the lateral common fibular nerve. Below the knee the leg divides into three closed compartments — anterior for dorsiflexion, lateral for eversion, posterior for plantarflexion — each with its own nerve and artery, and the tendons are held down behind the medial malleolus and in front of the ankle where they can be palpated and compressed. The common fibular nerve, lying on the neck of the fibula, is the nerve most often injured in the lower limb, and its injury gives foot drop.",
      },
      {
        type: "paragraph",
        text: "Next: the joints themselves. You will see why the knee needs menisci and cruciate ligaments to be a stable hinge, why an anterior cruciate ligament tear is so disabling, and how the ankle mortise is a weight-bearing socket whose stability depends on bones rather than on ligaments.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 13 — Knee & ankle joints (fully authored)
// ---------------------------------------------------------------------------
function lesson13() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the articulations that make up the knee and explain why it is a compound synovial joint; state the attachments of the cruciate and collateral ligaments and the movement each resists; describe the shape, attachment and function of the menisci and explain why the medial meniscus tears more often; identify the ligaments that stabilise the ankle and say which is most commonly damaged in an inversion injury; explain the concept of the ankle mortise and why its weight-bearing socket depends on bones rather than on ligaments; and distinguish an anterior cruciate ligament injury from a posterior cruciate injury at the bedside.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 9 and 12. You need the bones of the lower limb, the popliteal fossa and the compartments whose tendons cross the joints described here.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Compound synovial joint",
        text: "A joint in which more than two bones articulate inside a single joint capsule, and more than one type of movement occurs. The knee is the classic example: the medial and lateral tibiofemoral articulations and the patellofemoral articulation share one capsule and one synovial space.",
      },
      {
        type: "paragraph",
        text: "The knee is the largest and most complex joint in the body, and also the most vulnerable. Its problem is fundamental: a hinge that has to carry the whole weight of the body while allowing flexion, extension and a small amount of rotation, and which is held together largely by ligaments and menisci rather than by the shape of the bones. Every major knee injury is the consequence.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The hip is a ball-and-socket joint held by bone; the knee is a hinge held by soft tissue. The shoulder bought mobility at the price of stability, and the hip bought stability at the price of mobility; the knee was built for both, so it fails more often than either.",
      },

      { type: "heading", level: 2, text: "The parts of the knee" },
      {
        type: "table",
        headers: ["Structure", "Description", "Function or clinical note"],
        rows: [
          ["Articular surfaces", "Two convex femoral condyles on the two shallow tibial condyles, plus the patella on the trochlea of the femur", "Three paired surfaces: patellofemoral, and medial and lateral tibiofemoral"],
          ["Fibrous capsule", "Attached to the margins of the tibial and femoral surfaces; deficient posteriorly where it blends with the oblique popliteal ligament", "Encloses the whole joint and is strengthened by the ligaments and the patellar retinacula"],
          ["Synovial membrane", "Lines the capsule and covers the cruciate ligaments; forms the suprapatellar bursa", "The cruciate ligaments are intracapsular but extrasynovial, which is why they can be repaired surgically"],
          ["Bursae", "Prepatellar, infrapatellar, suprapatellar and several around the patellar tendon", "Inflamed by kneeling — housemaid's knee and clergyman's knee"],
          ["Fat pads", "Infrapatellar (Hoffa's) and others", "Can be nipped between the patella and the femur, causing pain"],
        ],
      },

      { type: "heading", level: 2, text: "The ligaments" },
      {
        type: "paragraph",
        text: "The cruciate ligaments cross inside the joint and control forward and backward sliding of the tibia under the femur. The collateral ligaments guard the sides. Learn the movement each resists and you can build the clinical test backwards.",
      },
      {
        type: "table",
        headers: ["Ligament", "Attachment", "Resists", "Injury"],
        rows: [
          ["Anterior cruciate (ACL)", "Anterior part of the intercondylar eminence of the tibia to the medial surface of the lateral femoral condyle", "Forward sliding of the tibia on the femur, and hyperextension", "A twisting injury with the foot planted; a pop and an immediate haemarthrosis"],
          ["Posterior cruciate (PCL)", "Posterior part of the intercondylar eminence to the lateral surface of the medial femoral condyle", "Backward sliding of the tibia", "A direct blow to the front of the bent knee, as on a dashboard"],
          ["Medial collateral (MCL)", "Medial femoral epicondyle to the medial condyle of the tibia and the capsule", "A force forcing the knee into valgus", "A blow to the lateral side of the knee; the commonest knee ligament injury"],
          ["Lateral collateral (LCL)", "Lateral femoral epicondyle to the head of the fibula", "A force forcing the knee into varus", "Less common; an isolated blow to the medial side"],
          ["Oblique popliteal", "An expansion of semimembranosus across the back of the capsule", "Hyperextension", "Stretches with the capsule"],
        ],
      },
      {
        type: "paragraph",
        text: "The medial side is reinforced by the deep part of the medial collateral ligament, which is bound to the medial meniscus; that is why a valgus blow tears the medial collateral ligament and the medial meniscus together, and why the unhappy triad is exactly that — anterior cruciate, medial collateral and medial meniscus — the classic injury from a blow to the lateral side of the knee with the foot planted.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The Lachman test is the most sensitive examination for an anterior cruciate ligament tear: with the knee at 20 to 30 degrees of flexion, pull the tibia forwards and feel for a firm stop with no excess translation. The anterior drawer test at 90 degrees is still useful but less sensitive, especially in an acute, painful and swollen knee.",
      },

      { type: "heading", level: 2, text: "The menisci" },
      {
        type: "definition",
        term: "Menisci (semilunar cartilages)",
        text: "Two crescent-shaped wedges of fibrocartilage between the femoral and tibial condyles. They deepen the shallow tibial surface, distribute the load, and allow the rolling and gliding that the condyles need.",
      },
      {
        type: "table",
        headers: ["Property", "Medial meniscus", "Lateral meniscus"],
        rows: [
          ["Shape", "C-shaped, larger, and covering about two thirds of the plateau", "Almost a complete ring (O-shaped), smaller"],
          ["Attachment", "Firmly bound to the medial collateral ligament and the capsule", "Loosely attached; the popliteus tendon crosses its posterior horn"],
          ["Mobility", "Moves less, so it is trapped and torn", "Moves more, so it escapes"],
          ["Tear frequency", "More common — several times as often as the lateral", "Less common"],
          ["Blood supply", "The outer third only, so a peripheral tear can heal", "Similar, and one reason a repair can be attempted"],
        ],
      },
      {
        type: "paragraph",
        text: "A meniscal tear is a twisting injury in a weight-bearing joint — a young footballer pivoting, or a middle-aged patient squatting down. It presents as a mechanical problem, not simply pain: catching, locking, giving way, and sometimes a block to full extension. The locked knee, unable to straighten, is a bucket-handle tear flipped into the joint.",
      },

      { type: "heading", level: 2, text: "The ankle" },
      {
        type: "paragraph",
        text: "The ankle is a hinge between the tibia, fibula and talus. Its stability comes overwhelmingly from bone, not ligament: the two malleoli and the tibial plafond form a three-sided socket — the ankle mortise — which the wider anterior part of the talus fits snugly into. That is why a stable ankle needs dorsiflexion, with the wide part of the bone seated in the socket, and why the ankle is most unstable in plantarflexion, when the narrow part of the talus sits in the mortise and the bones rattle.",
      },
      {
        type: "table",
        headers: ["Ligament", "Bones joined", "Clinical note"],
        rows: [
          ["Deltoid (medial)", "Medial malleolus to the talus, calcaneus and navicular — the strongest ligament at the ankle", "So strong that its injury usually means the malleolus is broken rather than the ligament torn"],
          ["Anterior talofibular", "Lateral malleolus to the talus", "The commonest ankle ligament injury, from an inversion sprain"],
          ["Calcaneofibular", "Lateral malleolus to the calcaneus", "Torn with the anterior talofibular ligament in a severe inversion"],
          ["Posterior talofibular", "Lateral malleolus to the talus", "The strongest of the lateral group; torn only in dislocation"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "An inversion injury of the ankle reaches the ligaments in a predictable order: the anterior talofibular first, then the calcaneofibular. If the patient cannot take four steps and there is bone tenderness over the posterior edge of either malleolus, an X-ray is indicated — the Ottawa ankle rules tell you when a radiograph is worth it.",
      },
      {
        type: "paragraph",
        text: "Beneath the ankle mortise sits the subtalar joint between talus and calcaneus, and that is where inversion and eversion happen. That separation of duties — hinge for up and down, subtalar for side to side — is why an ankle fused after severe arthritis still allows the foot to adapt to uneven ground.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Reversing the cruciates. The anterior cruciate ligament resists forward movement of the tibia; the posterior cruciate resists backward movement. A patient whose tibia slides forward excessively has an anterior cruciate ligament injury, and this is the drawer test: anterior drawer equals ACL, posterior drawer equals PCL.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the deltoid ligament is the most commonly torn. The lateral ligaments — the anterior talofibular in particular — are; the medial deltoid is so strong that it usually tears the bone instead.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that the ankle is most stable in dorsiflexion. Because the talus is wedge-shaped with its widest part anterior, dorsiflexion locks the joint and plantarflexion loosens it. A recurrent sprain usually happens from a foot in plantarflexion and inversion.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A footballer twists the knee with the foot planted, hears a pop, and has immediate swelling. Which three structures form the classic unhappy triad?",
        answer: "The anterior cruciate ligament, the medial collateral ligament and the medial meniscus.",
        explanation: "The mechanism is a valgus force with a twisting component: the valgus loads the medial collateral ligament and the medial meniscus, and the rotation tears the anterior cruciate.",
      },
      {
        type: "question",
        prompt: "How do you distinguish an anterior cruciate injury from a posterior cruciate injury at the bedside?",
        answer: "With the knee flexed to 90 degrees, pull and push the tibia. Excessive forward slide is an anterior cruciate ligament tear, and excessive backward slide is a posterior cruciate tear. The Lachman test at 30 degrees is more sensitive for the anterior cruciate.",
        explanation: "If the tibia sags backwards at rest with the knee at 90 degrees, that is the posterior sag sign of a posterior cruciate ligament injury.",
      },
      {
        type: "question",
        prompt: "A patient in high heels inverts the ankle and feels a popping sensation laterally. Which ligament is injured first, and what is the clinical significance of that order?",
        answer: "The anterior talofibular ligament. The order of injury — anterior talofibular first, then calcaneofibular — means that if the calcaneofibular ligament is also involved, the injury is severe and the ankle is genuinely unstable.",
        explanation: "This is also why rehabilitation for an ankle sprain focuses on proprioception and the peroneal muscles, which are the dynamic guards of the lateral ligaments.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which ligament prevents forward displacement of the tibia on the femur?",
        options: ["The posterior cruciate ligament", "The medial collateral ligament", "The anterior cruciate ligament", "The lateral collateral ligament"],
        correctIndex: 2,
        explanation: "The anterior cruciate ligament resists forward sliding of the tibia and is therefore torn in a pivoting injury; the posterior cruciate resists backward sliding and is injured by a force pushing the tibia backwards.",
      },
      {
        type: "mcq",
        stem: "A patient's knee gives way in valgus and there is tenderness over the medial joint line. Which structures are most likely injured together?",
        options: [
          "The lateral collateral ligament and the lateral meniscus",
          "The medial collateral ligament and the medial meniscus",
          "The anterior cruciate ligament alone",
          "The patellar ligament",
        ],
        correctIndex: 1,
        explanation: "The deep fibres of the medial collateral ligament are firmly attached to the medial meniscus, so the valgus load injures them together — which is why a medial collateral ligament injury so often involves the medial meniscus.",
      },
      {
        type: "mcq",
        stem: "Which statement about the menisci is correct?",
        options: [
          "The lateral meniscus is C-shaped and is torn three times as often as the medial",
          "The medial meniscus is C-shaped, less mobile, and torn more often because it is tethered to the medial collateral ligament",
          "Both are entirely avascular discs, so neither can ever heal",
          "The lateral meniscus is more mobile only because it is larger",
        ],
        correctIndex: 1,
        explanation: "The medial meniscus is C-shaped, firmly attached to the capsule and the medial collateral ligament, and therefore trapped and torn more often. The outer third of each has a blood supply, so a peripheral tear can be repaired.",
      },
      {
        type: "mcq",
        stem: "Which feature makes the ankle most stable?",
        options: [
          "The strong deltoid ligament pulling the talus upwards",
          "The three-sided mortise of the malleoli and the tibial plafond gripping the wider anterior part of the talus",
          "The subtalar joint between the talus and calcaneus",
          "The many tendons passing behind the malleoli",
        ],
        correctIndex: 1,
        explanation: "The socket is bony, so dorsiflexion, which brings the wide part of the talus into the mortise, is the position of greatest stability; plantarflexion is the least stable position.",
      },
      {
        type: "mcq",
        stem: "Which ligament is injured first in a typical inversion sprain of the ankle?",
        options: ["The calcaneofibular ligament", "The posterior talofibular ligament", "The anterior talofibular ligament", "The deltoid ligament"],
        correctIndex: 2,
        explanation: "The anterior talofibular ligament is weakened first and most often; as the force continues, the calcaneofibular ligament follows. Medial (deltoid) injury means the bone has failed first.",
      },
      {
        type: "mcq",
        stem: "Why can an anterior cruciate ligament tear be repaired surgically when a lateral collateral ligament tear heals poorly?",
        options: [
          "Because the anterior cruciate is stronger than the collateral ligament",
          "Because the cruciate ligaments are extrasynovial, so their fibres are not bathed in synovial fluid, while the collateral ligament lies against bone and its ends retract",
          "Because the anterior cruciate has a synovial covering that delivers the blood supply needed",
          "Because the collateral ligament has no blood supply at all",
        ],
        correctIndex: 1,
        explanation: "The cruciate ligaments are intracapsular but extrasynovial — a synovial fold covers them but synovial fluid does not bathe them — which favours surgical repair; the collateral ligaments heal poorly because they lie against bone and their ends retract.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The knee is a compound synovial joint whose stability comes from ligaments and menisci rather than from bone: the anterior cruciate resists forward sliding of the tibia, the posterior cruciate resists backward sliding, the collateral ligaments resist sideways angulation, and the menisci — C-shaped and tethered medially, O-shaped and mobile laterally — deepen the tibial surface and share the load. The ankle is the opposite: a hinge inside a bony mortise whose widest grip occurs in dorsiflexion, and whose lateral ligaments — the anterior talofibular first — tear in inversion injuries.",
      },
      {
        type: "paragraph",
        text: "Next: the lumbosacral plexus. You will trace every nerve of the lower limb back to its roots, and see why a nerve lesion produces exactly the pattern of weakness and numbness that its roots' territory predicts.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 14 — Lumbosacral plexus & lower limb innervation
// (fully authored)
// ---------------------------------------------------------------------------
function lesson14() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the origins of the lumbar and sacral plexuses and the root values of each; name the major branches of each plexus and the muscles and skin each supplies; identify the nerves that supply the quadriceps and the adductors respectively and give the reflexes that test them; describe the pattern of a complete sciatic nerve lesion and contrast it with a common fibular nerve lesion; explain why the common fibular division of the sciatic nerve is injured more often than the tibial division; and predict the sensory loss of a lesion of the lateral cutaneous nerve of the thigh.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 10 to 13. You need the gluteal region and the compartments of the leg, because a nerve is best understood by the group of muscles whose weakness it produces.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The lumbosacral plexus",
        text: "A network of lumbar and sacral spinal nerve roots, L1 to S4, together with the lumbosacral trunk joining L4 and L5 to the sacral plexus. Its purpose is to mix fibres so that each muscle gets a root that moves it and each patch of skin gets a root that senses it, so a single root can be lost without losing a movement.",
      },
      {
        type: "paragraph",
        text: "The logic of the plexus is easiest to see in the brachial plexus, where roots became trunks, divisions, cords and branches. The lower limb follows the same reasoning from the lumbar plexus: roots split into anterior and posterior divisions, and those divisions recombine into nerves. Learn the pattern rather than the list, because you can then derive any nerve's root value from whether it lies in front of or behind the plane of the limb — the flexor and extensor compartments.",
      },
      {
        type: "table",
        headers: ["Division", "Origin", "Supplies, by compartment pattern"],
        rows: [
          ["Anterior divisions", "Lumbar plexus L2-L4 and the sacral contributions L4-S3", "The flexor and adductor compartments: quadriceps and adductors, hamstrings and the posterior compartment of the leg"],
          ["Posterior divisions", "Lumbar L2-L3 and sacral L4-S3", "The extensor and abductor compartments: the glutei, the lateral rotators, and the anterior and lateral compartments of the leg"],
        ],
      },

      { type: "heading", level: 2, text: "The lumbar plexus" },
      {
        type: "paragraph",
        text: "The lumbar plexus, L1 to L4, forms within the psoas major. Its branches emerge from the muscle's borders and cross the pelvis and the thigh.",
      },
      {
        type: "table",
        headers: ["Nerve", "Roots", "Motor supply", "Sensory supply"],
        rows: [
          ["Iliohypogastric and ilioinguinal", "L1", "Internal oblique and transversus abdominis", "The groin and the upper medial thigh"],
          ["Genitofemoral", "L1, L2", "Cremaster", "The femoral triangle and the scrotum or labium"],
          ["Lateral cutaneous of the thigh", "L2, L3", "None — a pure sensory nerve", "The lateral thigh"],
          ["Femoral", "L2, L3, L4", "The quadriceps, sartorius and pectineus", "The anterior thigh and, through the saphenous nerve, the medial leg and foot"],
          ["Obturator", "L2, L3, L4", "The adductors of the thigh", "The medial thigh"],
          ["Accessory obturator, when present", "L3, L4", "Pectineus", "The hip joint"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The femoral and obturator nerves between them cover the quadriceps and the adductors, and their root values are adjacent but distinct. Testing one and not the other is how a lumbar root lesion is localised on the ward: an L3 versus L4 deficit is separated by which of the two has failed.",
      },

      { type: "heading", level: 2, text: "The sacral plexus and the sciatic nerve" },
      {
        type: "paragraph",
        text: "The sacral plexus, L4 to S4, lies on the posterior wall of the pelvis, in front of piriformis. Its branches leave the pelvis largely through the greater sciatic foramen — either above or below piriformis — which is why piriformis itself is such a useful landmark: everything above it belongs to one group, everything below to another.",
      },
      {
        type: "table",
        headers: ["Nerve", "Roots", "Motor supply", "Clinical note"],
        rows: [
          ["Superior gluteal", "L4, L5, S1", "Gluteus medius and minimus and tensor fasciae latae", "A lesion gives a positive Trendelenburg sign"],
          ["Inferior gluteal", "L5, S1, S2", "Gluteus maximus", "A lesion gives difficulty rising from a chair or climbing stairs"],
          ["Nerve to quadratus femoris", "L4, L5, S1", "Quadratus femoris and the inferior gemellus", "Rarely injured alone"],
          ["Posterior cutaneous of the thigh", "S1, S2, S3", "None", "Supplies a strip down the back of the thigh"],
          ["Pudendal", "S2, S3, S4", "The external anal and urethral sphincters", "Injury causes faecal and urinary incontinence"],
          ["Sciatic", "L4, L5, S1, S2, S3", "The hamstrings and, through its two divisions, every muscle below the knee", "The largest nerve in the body"],
        ],
      },
      {
        type: "definition",
        term: "Sciatic nerve",
        text: "Two nerves in one sheath — the tibial division, from the anterior divisions of the plexus, and the common fibular division, from the posterior divisions. They leave the pelvis below piriformis, pass through the gluteal region and the back of the thigh, and usually separate in the lower thigh to become the tibial and common fibular nerves.",
      },
      {
        type: "paragraph",
        text: "The sciatic nerve is vulnerable in two situations, and in both the fibular division is the one that suffers. First, a posterior hip dislocation transmits force through the gluteal region. Second, a badly placed intramuscular injection in the lower medial buttock, or a direct wound, reaches it directly. In either case the common fibular division is damaged more often than the tibial division, because it is lateral, tethered and physically separate: the fibular fibres sit at the outside of the nerve and therefore take the first and worst of a blow.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Nerve divisions, not nerve roots, explain the clinical pattern. The common fibular division is made of fibres from the posterior divisions of the plexus — L4 to S2 — and they are largely responsible for dorsiflexion and eversion. So an injury that spares the tibial division spares plantarflexion and inversion, and the foot hangs while the sole is intact.",
      },

      { type: "heading", level: 2, text: "Worked example: a complete sciatic nerve lesion" },
      {
        type: "paragraph",
        text: "Take a patient who has lost the whole sciatic nerve at the hip. The hamstrings are paralysed, so the knee cannot be flexed — and that is the one sign that distinguishes a hip-level lesion from a common fibular lesion at the fibular neck. Below the knee, both the tibial and common fibular distributions are lost, so plantarflexion and dorsiflexion and inversion and eversion are all gone. Sensation is lost over the whole leg below the knee except a narrow strip on the medial side, which the saphenous branch of the femoral nerve supplies, and the sole is lost too — which contrasts with the common fibular lesion, in which the sole is intact.",
      },
      {
        type: "table",
        headers: ["Examination", "Sciatic nerve lesion at the hip", "Common fibular nerve lesion at the fibular neck"],
        rows: [
          ["Knee flexion", "Weak or absent, because the hamstrings are paralysed", "Normal"],
          ["Ankle dorsiflexion", "Lost", "Lost — foot drop"],
          ["Ankle plantarflexion", "Lost", "Normal, because the tibial division is intact"],
          ["Foot sensation", "Lost below the knee except the medial strip, which the saphenous nerve spares", "Lost on the dorsum only; the sole is spared"],
          ["Ankle jerk", "Depressed or absent", "Normal, because it is largely S1 through the tibial nerve"],
        ],
      },

      { type: "heading", level: 2, text: "Reflexes and root values" },
      {
        type: "paragraph",
        text: "The deep tendon reflexes of the lower limb anchor the root values you have learned. The patellar reflex is quadriceps and therefore femoral, L3 and L4. The Achilles reflex is plantarflexion and therefore tibial, S1 and S2. So a dropped ankle jerk with a normal knee jerk is the sign of an S1 level problem, and a dropped knee jerk with a normal ankle jerk points to an L3 or L4 level.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Thinking the sciatic nerve supplies the skin over the sole through its fibular division. The sole is tibial nerve territory, through the medial and lateral plantar nerves. In a common fibular lesion the sole is spared, and in a tarsal tunnel lesion the dorsum is spared.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Labelling meralgia paresthetica as a femoral nerve lesion. The lateral cutaneous nerve of the thigh is a separate, purely sensory nerve that passes under the inguinal ligament near the ASIS; compression there causes burning over the lateral thigh with no weakness and no reflex change.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that hamstring paralysis means a hip-level sciatic lesion. If knee flexion is weak, the lesion cannot be a common fibular lesion at the fibular neck; it must involve the sciatic nerve proximally.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has foot drop but has normal knee flexion, normal plantarflexion and normal sensation on the sole. Where is the lesion, and which muscle group has been spared?",
        answer: "The common fibular nerve at the neck of the fibula. The spared groups are the hamstrings, so the sciatic trunk is intact proximally, and the posterior compartment of the leg, which is tibial nerve territory.",
        explanation: "The combination of foot drop, preserved plantarflexion and an intact sole localises the lesion precisely to the common fibular nerve and away from either the sciatic trunk or the tibial nerve.",
      },
      {
        type: "question",
        prompt: "Which nerve is injured when a patient cannot adduct the thigh after a pelvic operation, and which nerve's injury would produce the opposite problem of a lurching gait?",
        answer: "The obturator nerve injury gives loss of adduction and instability on the medial side. The opposite — a positive Trendelenburg and a lurching gait — is injury of the superior gluteal nerve.",
        explanation: "The adductors and the abductors are the two opposing groups whose nerves lie on opposite sides of the pelvis, and each has a gait that gives it away.",
      },
      {
        type: "question",
        prompt: "State the root values of the femoral and obturator nerves and the reflex that tests the femoral.",
        answer: "Femoral L2-L4 and obturator L2-L4. The femoral nerve is tested by the patellar reflex, L3-L4, and by knee extension; the obturator nerve by hip adduction.",
        explanation: "Their overlapping root values mean a single root lesion cannot be separated from the two nerves alone — which is why the reflex and the muscle test are read together.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which combination correctly matches nerve to root values?",
        options: [
          "Femoral L5 to S2, and obturator L2 to L4",
          "Femoral L2 to L4, and obturator L2 to L4",
          "Femoral L4 to S1, and pudendal S1 to S3",
          "Femoral L1 to L2, and sciatic L5 to S3",
        ],
        correctIndex: 1,
        explanation: "Both the femoral and the obturator nerves are L2 to L4. The femoral nerve tests quadriceps through the patellar reflex and the obturator nerve tests adduction; they share roots, which is why a lumbar root lesion separates them clinically.",
      },
      {
        type: "mcq",
        stem: "A patient has a positive Trendelenburg sign after pelvic surgery. Which nerve has been injured?",
        options: ["The inferior gluteal nerve", "The superior gluteal nerve", "The obturator nerve", "The femoral nerve"],
        correctIndex: 1,
        explanation: "The superior gluteal nerve supplies gluteus medius and minimus, whose failure produces the pelvic drop on the swing side and the compensatory lurch. The inferior gluteal nerve lesion would give difficulty extending the hip but a level pelvis.",
      },
      {
        type: "mcq",
        stem: "In a complete sciatic nerve lesion at the level of the hip, which finding distinguishes it from a common fibular lesion at the fibular neck?",
        options: [
          "The foot is dropped and the sole is numb",
          "Knee flexion is weak and plantarflexion is also weak",
          "Sensation is lost only over the dorsum of the foot",
          "The ankle jerk is normal",
        ],
        correctIndex: 1,
        explanation: "A hip-level lesion paralyses the hamstrings as well, so knee flexion is weak, and plantarflexion is weak because the tibial division is involved. In a common fibular lesion the hamstrings, plantarflexion and the ankle jerk are all preserved.",
      },
      {
        type: "mcq",
        stem: "Which nerve, when compressed below the inguinal ligament, produces burning pain over the lateral thigh without any motor loss?",
        options: ["The femoral nerve", "The obturator nerve", "The lateral cutaneous nerve of the thigh", "The saphenous nerve"],
        correctIndex: 2,
        explanation: "Meralgia paresthetica is entrapment of the purely sensory lateral cutaneous nerve, L2 and L3, classically in obesity or from a tight belt. The femoral and obturator nerves are motor nerves too; the saphenous nerve goes to the medial leg.",
      },
      {
        type: "mcq",
        stem: "Which statement about the pudendal nerve is correct?",
        options: [
          "It is a branch of the lumbar plexus and supplies the quadriceps",
          "It arises from S2, S3 and S4 and supplies the external anal and urethral sphincters",
          "It arises from L2 to L4 and supplies the adductors",
          "It has no motor fibres and supplies only the perineal skin",
        ],
        correctIndex: 1,
        explanation: "The pudendal nerve is a sacral plexus branch, S2 to S4, and it carries somatic motor fibres to the external sphincters and sensory fibres from the perineum — it is the nerve injured in a prolonged second stage of labour, causing incontinence.",
      },
      {
        type: "mcq",
        stem: "Which nerve crosses the front of the ankle between the extensor tendons alongside the anterior tibial artery?",
        options: [
          "The tibial nerve behind the medial malleolus",
          "The deep fibular nerve on the front of the ankle",
          "The sural nerve behind the lateral malleolus",
          "The saphenous nerve on the medial leg",
        ],
        correctIndex: 1,
        explanation: "The deep fibular nerve crosses the front of the ankle between the extensor tendons with the anterior tibial artery, which is why it is at risk in anterior ankle surgery and why its injury there spares the evertors, who are supplied by the superficial fibular nerve.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The lumbosacral plexus runs from L1 to S4 in two parts. The lumbar plexus gives the femoral nerve to the quadriceps and the obturator nerve to the adductors; the sacral plexus gives the gluteal nerves, the pudendal nerve and the sciatic nerve. The sciatic nerve carries two physically separate divisions, of which the common fibular division is the more vulnerable, and a lesion of the whole nerve is recognised by the loss of knee flexion that a fibular-neck lesion would never cause. The reflexes — patellar L3-L4 and Achilles S1-S2 — anchor every root value you have learned.",
      },
      {
        type: "paragraph",
        text: "Next: the blood supply of the lower limb. You will follow the femoral artery to the popliteal and its two terminal branches, find the pulses you can palpate, and see how the veins and lymphatics of the leg return what the arteries deliver.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 15 — Arterial supply & venous drainage (fully authored)
// A new concept in the spine: lower-limb-vasculature.
// ---------------------------------------------------------------------------
function lesson15() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: trace the arterial tree from the external iliac to the dorsalis pedis and the plantar arteries, naming the pulses you can palpate; describe the anastomoses around the hip and the knee and their collateral function; state the course of the great and small saphenous veins and where each terminates; explain the clinical difference between the superficial and the deep venous systems and how varicose veins arise; and name the superficial and deep inguinal lymph node groups and what each drains.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 11 and 12, because the arteries run alongside the compartments whose containment explains their injuries, and Lesson 14 for the nerves that share their course.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The arterial tree of the lower limb",
        text: "A single unbranched line: the external iliac artery becomes the femoral artery at the inguinal ligament, the femoral artery becomes the popliteal artery at the adductor hiatus, and the popliteal artery divides into the anterior and posterior tibial arteries below the knee. Everything else is a branch of it.",
      },
      {
        type: "paragraph",
        text: "There is one main road down the leg, and the branches around it behave like ring roads: if the main road is blocked, traffic goes around the ring. That is the collateral circulation, and its strength determines whether a blocked artery kills a limb or is merely inconvenient.",
      },

      { type: "heading", level: 2, text: "From pelvis to foot" },
      {
        type: "table",
        headers: ["Artery", "Course", "Gives rise to", "Pulse palpable?"],
        rows: [
          ["External iliac", "Runs along the pelvic brim and passes under the inguinal ligament", "The femoral artery", "No — it lies deep in the pelvis"],
          ["Femoral artery", "Femoral triangle to adductor canal, then through the adductor hiatus", "Profunda femoris and its branches; continues as the popliteal artery", "Yes, at the mid-inguinal point"],
          ["Popliteal artery", "Deep in the popliteal fossa, on the bone and capsule", "Genicular branches around the knee; ends as the anterior and posterior tibial arteries", "Yes, in the popliteal fossa"],
          ["Anterior tibial", "Passes through the interosseous membrane into the anterior compartment", "Ends as the dorsalis pedis on the dorsum of the foot", "Yes, on the dorsum of the foot"],
          ["Posterior tibial", "Runs in the deep posterior compartment, behind the medial malleolus", "The fibular artery; ends as the medial and lateral plantar arteries", "Yes, behind the medial malleolus"],
          ["Dorsalis pedis", "Continuation of the anterior tibial artery over the dorsum of the foot", "The arcuate artery and the dorsal metatarsal arteries", "Yes — the classic pulse of the foot"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The profunda femoris is the great collateral trunk. It gives the medial and lateral circumflex femoral arteries, which join the inferior gluteal and the first perforating artery in the cruciate anastomosis around the hip, and then three or four perforating branches that supply the whole posterior compartment. If the femoral artery is blocked, this ring can keep the limb perfused.",
      },
      {
        type: "question",
        prompt: "A patient has a blocked femoral artery, a palpable popliteal pulse, and no foot pulse. What does the palpable popliteal pulse prove, and what would the ankle-brachial index add?",
        answer: "The popliteal pulse proves that the collateral network around the hip and the knee has bridged the obstruction, since the popliteal artery lies distal to the blockage. The ankle-brachial index compares ankle systolic pressure to brachial systolic pressure, and a value below about 0.9 confirms functionally significant arterial disease.",
        explanation: "A pulse that appears after a blockage is the clinical signature of collateral flow; the ankle-brachial index quantifies how much flow is actually arriving.",
      },

      { type: "heading", level: 2, text: "The veins" },
      {
        type: "paragraph",
        text: "The venous drainage has two systems, and the relationship between them is a single practical point. The deep veins run alongside the arteries and share their names — anterior tibial, posterior tibial, popliteal, femoral. The superficial veins run in the subcutaneous tissue and drain into the deep system at only a few points.",
      },
      {
        type: "table",
        headers: ["Vein", "Course", "Termination", "Clinical note"],
        rows: [
          ["Great (long) saphenous", "From the medial end of the dorsal venous arch, in front of the medial malleolus and up the medial side of the leg and thigh", "Into the femoral vein at the saphenous opening in the groin", "Harvested for coronary bypass grafting; the site of saphenous cutdown; ligated in varicose vein surgery"],
          ["Small (short) saphenous", "From the lateral end of the dorsal venous arch, behind the lateral malleolus, up the back of the calf", "Into the popliteal vein", "May communicate with the deep veins through a mid-calf perforator, so its varicosities are harder to treat"],
          ["Deep veins", "Paired venae comitantes around the arteries, joining into the popliteal and femoral veins", "The external iliac vein", "The site of deep vein thrombosis"],
          ["Perforating veins", "Pierce the deep fascia and connect the superficial to the deep system", "Through the deep fascia at multiple points", "The valves here fail first — the cause of varicose veins"],
        ],
      },
      {
        type: "definition",
        term: "Varicose veins",
        text: "Dilated, tortuous, elongated superficial veins, produced by failure of the valves that normally stop blood refluxing downwards. The calf muscle normally squeezes the deep veins and pumps blood upwards, and the valves ensure the flow goes one way. When the perforator valves fail, the deep pumping pressure is transmitted outwards into the superficial veins and they dilate.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The soleus muscle is sometimes called the peripheral heart, because each contraction of that large muscle mass squeezes blood up the deep veins of the leg. Immobility, long flights, paralysis or bed rest after surgery stop the pump, and the resulting stasis is the first leg of Virchow's triad for venous thrombosis.",
      },

      { type: "heading", level: 2, text: "Lymphatics" },
      {
        type: "table",
        headers: ["Group", "Location", "Drains", "Clinical note"],
        rows: [
          ["Superficial inguinal nodes", "In the subcutaneous tissue along the inguinal ligament and along the great saphenous vein", "The skin of the lower limb, the lower abdominal wall, and the perineum and external genitalia", "Enlarged in foot and leg infection, so a foot ulcer produces swollen groin glands"],
          ["Deep inguinal nodes", "Deep to the fascia lata, alongside the femoral vein", "The deep structures of the limb and, in turn, the internal iliac nodes", "Includes the node of Cloquet in the femoral canal"],
          ["Popliteal nodes", "In the fat of the popliteal fossa", "A strip of the deep tissues of the calf", "Enlarged in deep infection of the calf"],
        ],
      },
      {
        type: "paragraph",
        text: "The single most useful fact is the watershed: the superficial inguinal nodes drain the territory below the umbilicus as well as the limb, so a lesion of the vulva or scrotum or of the lower abdomen spreads to the inguinal region, while a lesion of the testes drains instead to the para-aortic nodes. That asymmetry follows the developmental path along which those organs descended.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the great saphenous vein drains the whole leg superficially. It drains the medial side of the foot, leg and thigh; the small saphenous drains the lateral side. Each drains only a part, which is why a varicosity in one system requires treatment of that system.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Believing the great saphenous vein carries arterial blood. It is a vein; it carries deoxygenated blood from the skin. What it offers the injured limb is not blood but a wall — it is harvested for a bypass graft precisely because it is a vessel whose wall can be used as a tube elsewhere.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that a foot infection enlarges the superficial inguinal nodes. A patient with an infected toe and a lump in the groin has reactive lymphadenopathy, not a second disease.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Where does the femoral artery pass into the popliteal fossa, and which named structure does it cross to do so?",
        answer: "Through the adductor hiatus in adductor magnus, at the lower end of the adductor canal.",
        explanation: "This is the transition from the front of the thigh to the back of the knee, and it is also where the femoral vein becomes the popliteal vein.",
      },
      {
        type: "question",
        prompt: "A patient has a deep vein thrombosis after an operation. Which mechanism in the calf would have been protective, and why is the injury itself a thrombosis risk?",
        answer: "Regular calf contraction, because the soleus acts as a peripheral heart squeezing blood up the deep veins. Prolonged immobility after an operation stops that pump, and the surgical injury also releases clotting factors and damages vessel walls, completing Virchow's triad.",
        explanation: "All three legs of the triad — stasis, hypercoagulability and vessel wall damage — are set up at once by an operation.",
      },
      {
        type: "question",
        prompt: "A patient has an infected cut on the foot and now has tender lumps in the groin. Which group of nodes is enlarged and what is their drainage territory?",
        answer: "The superficial inguinal nodes, whose drainage territory includes the skin of the lower limb, the lower abdominal wall and the perineum.",
        explanation: "The great saphenous vein terminates in the saphenous opening and the lymphatics that follow it bring infected material to these nodes.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Where is the femoral artery palpated?",
        options: [
          "At the mid-point of the inguinal ligament",
          "At the mid-inguinal point below the ligament, over the head of the femur",
          "Behind the medial malleolus",
          "In the popliteal fossa against the tibial plateau",
        ],
        correctIndex: 1,
        explanation: "The artery crosses the ligament at the mid-inguinal point, with the head of the femur directly behind it, so the vessel can be compressed. The pulses behind the malleolus and in the fossa belong to other arteries.",
      },
      {
        type: "mcq",
        stem: "Which artery continues on the dorsum of the foot as the dorsalis pedis?",
        options: ["The posterior tibial artery", "The fibular artery", "The anterior tibial artery", "The popliteal artery"],
        correctIndex: 2,
        explanation: "The anterior tibial artery passes through the interosseous membrane and continues over the dorsum as the dorsalis pedis. The posterior tibial artery divides into the plantar arteries instead, and the fibular artery supplies the lateral compartment.",
      },
      {
        type: "mcq",
        stem: "Where does the great saphenous vein drain?",
        options: [
          "Into the small saphenous vein behind the knee",
          "Into the femoral vein at the saphenous opening",
          "Into the popliteal vein through the adductor hiatus",
          "Into the anterior tibial vein at the ankle",
        ],
        correctIndex: 1,
        explanation: "The great saphenous vein pierces the cribriform fascia at the saphenous opening in the groin and drains into the femoral vein. The small saphenous vein drains into the popliteal vein.",
      },
      {
        type: "mcq",
        stem: "A patient has an infected cut on the foot and tender lumps in the groin. Which nodes are these, and what is their drainage?",
        options: [
          "Popliteal nodes, draining only the deep calf",
          "Deep inguinal nodes, draining the uterus",
          "Superficial inguinal nodes, draining the lower limb plus the lower trunk and perineum",
          "Iliac nodes, draining the external genitalia alone",
        ],
        correctIndex: 2,
        explanation: "The superficial inguinal nodes drain the skin of the lower limb, the abdominal wall below the umbilicus and the perineum. The testes drain to the para-aortic nodes instead.",
      },
      {
        type: "mcq",
        stem: "Which mechanism explains why calf immobility causes deep vein thrombosis?",
        options: [
          "The arterial supply is reduced so the vein wall dies",
          "The soleal muscle pump stops emptying the deep veins, so stasis allows clotting",
          "The valves of the great saphenous vein contract",
          "The lymphatics dilate and obstruct the vein",
        ],
        correctIndex: 1,
        explanation: "The soleus squeezes the deep veins during contraction; without it, stasis supervenes and, together with post-injury hypercoagulability, thrombosis follows.",
      },
      {
        type: "mcq",
        stem: "Which group of arteries unites in the cruciate anastomosis around the hip?",
        options: [
          "The anterior and posterior tibial arteries",
          "The medial and lateral circumflex femoral arteries with the inferior gluteal and the first perforating arteries",
          "The genicular arteries around the knee",
          "The deep plantar arch and the dorsalis pedis",
        ],
        correctIndex: 1,
        explanation: "The cruciate anastomosis is the hip's ring: medial and lateral circumflex femoral from the profunda, the inferior gluteal from the internal iliac, and the first perforating artery. It is the collateral route that can save a limb if the femoral artery is blocked.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The lower limb is supplied by one arterial line — external iliac, femoral, popliteal, anterior tibial and posterior tibial — with a collateral ring around the hip from the circumflex and gluteal branches, and another around the knee from the genicular branches. The deep veins run with the arteries and the superficial veins drain into them at only two main points, the saphenous opening and the popliteal vein, and their valves — which the calf pump depends on — are what fail in varicose disease. The inguinal nodes drain the limb and the territory below the umbilicus.",
      },
      {
        type: "paragraph",
        text: "Next: the pelvis. You will take the diameters the obstetrician measures, and see how a bony ring with fixed dimensions is built to let one thing pass and to support everything else.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 16 — Pelvic girdle, pelvic floor & perineum (fully authored)
// A new concept in the spine: pelvis-pelvic-floor.
// ---------------------------------------------------------------------------
function lesson16() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the joints and ligaments of the pelvic girdle and explain why the ring can sustain force without collapsing; describe the diameters of the pelvic inlet used in obstetrics and give their approximate values; distinguish the obstetric conjugate from the diagonal conjugate and say which one is measured on examination; name the muscles of the pelvic floor and their nerve supply; outline the boundaries of the urogenital and anal triangles and the structures they contain; and state the boundaries and significance of the greater and lesser sciatic foramina.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 9, because the whole lesson is about the ring those bones form, and Lesson 14, because the nerves described here leave the pelvis through the foramina you are about to learn.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The bony ring",
        text: "The pelvis is a closed ring: the two hip bones joined at the pubic symphysis in front, and each joined to the sacrum behind at the sacroiliac joints. Like any ring, if it breaks in one place it breaks in another — which is the reason pelvic fracture patterns are described as pairs.",
      },
      {
        type: "paragraph",
        text: "Everything about the pelvis follows from its double life. It must be a rigid ring that transmits the weight of the body into the legs, and it must be a canal wide enough to deliver a baby. Those two demands pull in opposite directions, and the skeleton compromises: a strong ring, reinforced by several of the body's strongest ligaments, around a passage that is as generous as bone can manage.",
      },

      { type: "heading", level: 2, text: "Joints and ligaments" },
      {
        type: "table",
        headers: ["Joint", "Type", "Ligaments", "Note"],
        rows: [
          ["Sacroiliac, two of them", "Plane synovial anteriorly, fibrous posteriorly", "Anterior, interosseous and posterior sacroiliac ligaments", "Weight transfer from the spine to the leg; most stable in compression, unstable in rotation"],
          ["Pubic symphysis", "Secondary cartilaginous", "Superior and inferior pubic ligaments", "Softens in late pregnancy; separates in severe trauma"],
          ["Sacrococcygeal", "Secondary cartilaginous", "Sacrotuberous, sacrospinous and anterior sacrococcygeal ligaments", "The sacrotuberous and sacrospinous ligaments convert two notches into the sciatic foramina"],
          ["Lumbosacral", "A pair of synovial joints plus the L5-S1 disc and its ligaments", "The iliolumbar ligaments", "Where the motion of the spine is transferred into the ring"],
        ],
      },
      {
        type: "paragraph",
        text: "Two ligaments in this list are disproportionately important. The sacrotuberous ligament runs from the sacrum to the ischial tuberosity, and the sacrospinous ligament from the sacrum to the ischial spine; between them they close the sciatic notches and turn them into the greater and lesser sciatic foramina. Those two ligaments are also what the gluteal vessels and nerves leave the pelvis around — the superior gluteal nerve above and the inferior gluteal nerve below piriformis, and the pudendal nerve sweeping around the sacrospinous ligament.",
      },

      { type: "heading", level: 2, text: "The obstetric diameters" },
      {
        type: "paragraph",
        text: "The inlet of the true pelvis is not a circle but a short cylinder with its widest side transverse and its shortest side from front to back. Four measurements matter, and only one of them can be taken on a living patient.",
      },
      {
        type: "table",
        headers: ["Diameter", "Measurement", "Approximate value", "Notes"],
        rows: [
          ["Anteroposterior (obstetric conjugate)", "Sacral promontory to the posterior surface of the pubic symphysis", "About 11 cm", "Cannot be measured directly on examination"],
          ["Obstetric conjugate to the bulging point", "Sacral promontory to the point on the pubis that projects most into the canal", "About 10.5 to 11 cm", "The clinically effective AP diameter of the canal"],
          ["Diagonal conjugate", "Sacral promontory to the inferior border of the pubic symphysis, measured on examination", "About 12.5 cm", "The one a clinician can reach; roughly 1.5 cm longer than the obstetric conjugate"],
          ["Transverse", "The widest distance across the inlet", "About 13.5 cm", "The largest diameter, at right angles to the AP"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A diagonal conjugate of less than about 11.5 cm suggests the inlet is contracted, because the obstetric conjugate is roughly 1.5 cm shorter than the diagonal. If the head cannot get through the inlet the labour will not progress, which is why the pelvis is measured at all.",
      },
      {
        type: "paragraph",
        text: "The midcavity is measured at the level of the ischial spines — the plane of least pelvic dimensions — and the interspinous diameter is about 10.5 cm. The outlet is measured between the ischial tuberosities and by the subpubic angle; in a woman the angle is about 90 degrees or more, in a man much narrower.",
      },

      { type: "heading", level: 2, text: "The pelvic floor" },
      {
        type: "definition",
        term: "The pelvic diaphragm",
        text: "The muscular floor of the pelvis, formed by levator ani — puborectalis, pubococcygeus and iliococcygeus — and coccygeus. It closes the pelvic outlet, and its opening, the urogenital hiatus, is the gap through which the urethra and, in women, the vagina pass.",
      },
      {
        type: "table",
        headers: ["Muscle", "Origin", "Insertion", "Function"],
        rows: [
          ["Puborectalis", "The posterior aspect of the pubis", "The junction of the rectum with the anal canal, looping around it", "Maintains faecal continence and creates the anorectal angle"],
          ["Pubococcygeus", "The posterior aspect of the pubis", "The perineal body, the anal canal, the anococcygeal ligament and the coccyx", "Supports the pelvic viscera; its anterior fibres compress the sphincters and the vagina"],
          ["Iliococcygeus", "The ischial spine and the fascia over obturator internus", "The anococcygeal body and the coccyx", "Forms a sheet that supports the viscera"],
          ["Coccygeus", "The ischial spine", "The lower sacrum and the coccyx", "A minor contributor, and a landmark in the lesser sciatic foramen"],
        ],
      },
      {
        type: "paragraph",
        text: "The pelvic floor's most important answer is to the question of continence. The puborectalis loops around the back of the rectum and pulls the anal canal forwards, creating an acute angle between rectum and canal; that angle, with the sphincters, is the mechanism that keeps the rectum closed. Blocking or injuring puborectalis is the difference between continence and leakage, which is why cauda equina lesions, pelvic surgery and forceps delivery all threaten that angle.",
      },

      { type: "heading", level: 2, text: "The perineum" },
      {
        type: "paragraph",
        text: "The perineum is the diamond-shaped region below the pelvic floor, bounded by the pubic symphysis in front, the ischial tuberosities on either side and the coccyx behind. A line between the ischial tuberosities divides it into two triangles: the urogenital triangle in front, containing the external genitalia, and the anal triangle behind, containing the anus.",
      },
      {
        type: "table",
        headers: ["Triangle", "Contents", "Structures of note"],
        rows: [
          ["Urogenital triangle", "The external urethral opening and, in the female, the vaginal opening; the erectile tissue and the perineal muscles", "The perineal body between them, and the perineal membrane"],
          ["Anal triangle", "The anal canal and the ischioanal fossae filled with fat", "The external anal sphincter, which is skeletal muscle, and the ischioanal fossa, the space that fills with an abscess"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The pudendal nerve, S2 to S4, passes out of the greater sciatic foramen below piriformis, around the ischial spine into the lesser sciatic foramen, and then runs forward in the pudendal canal on the medial surface of obturator internus to supply the perineum. A pudendal block at the ischial spine therefore anaesthetises the entire perineum, which is what makes it useful to an obstetrician.",
      },
      {
        type: "paragraph",
        text: "The ischioanal fossa deserves a sentence of its own, because it is the commonest site of a perianal abscess. It is a wedge of fat between the levator ani above and the skin below; an infected anal gland seeds it, the infection collects because there is no drainage through the fat, and the result is a painful swelling that must be incised.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the greater and lesser sciatic foramina. Piriformis leaves through the greater foramen; the pudendal nerve and the internal pudendal vessels go around the ischial spine and through the lesser foramen. If a nerve leaves the pelvis below piriformis and passes around the ischial spine, it belongs to the pudendal group.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the obstetric conjugate can be measured on examination. It cannot; the obstetrician measures the diagonal conjugate and subtracts about 1.5 cm, because the palpable landmark on the pubis is further forward than the point that matters inside the canal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing the pelvic floor entirely to the pudendal nerve. Levator ani is supplied principally by the pudendal nerve and also by direct branches from S4, and coccygeus by its own small branches, so an injury in childbirth is not always a single-nerve story.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why must a fracture of the pelvis often involve a second break?",
        answer: "Because the pelvis is a closed bony ring. A single impact applies force all round the ring, and if one part yields the opposing part fails too — the same physics as a key ring or a pretzel.",
        explanation: "That is why pelvic fractures are described as pairs, anterior and posterior, and why the second break is the one a radiograph report warns you to look for.",
      },
      {
        type: "question",
        prompt: "Which diameter of the pelvic inlet can a clinician actually measure, and which value is inferred from it?",
        answer: "The diagonal conjugate is measured, from the sacral promontory to the inferior border of the pubic symphysis. The obstetric conjugate is inferred by subtracting about 1.5 cm.",
        explanation: "The obstetric conjugate is the effective anteroposterior diameter of the canal and is about 11 cm; the diagonal is about 12.5 cm.",
      },
      {
        type: "question",
        prompt: "Name the muscle that builds faecal continence by creating an angle at the anorectal junction.",
        answer: "Puborectalis, the medial muscle of the pelvic diaphragm, which loops around the back of the rectum and pulls the anal canal forwards.",
        explanation: "Injuring puborectalis — by surgery, by childbirth, or by a cauda equina lesion — removes the anorectal angle and the patient leaks faeces.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which ligament converts the lesser sciatic notch into the lesser sciatic foramen?",
        options: ["The iliolumbar ligament", "The sacrotuberous ligament", "The sacrospinous ligament", "The inguinal ligament"],
        correctIndex: 2,
        explanation: "The sacrospinous ligament spans the lesser notch from the ischial spine to the sacrum and closes it; the sacrotuberous ligament closes the greater notch from the tuberosity to the sacrum. The pudendal canal runs along the lesser foramen.",
      },
      {
        type: "mcq",
        stem: "Which diameter of the pelvic inlet is measured on clinical examination?",
        options: ["The obstetric conjugate", "The true conjugate", "The diagonal conjugate", "The transverse diameter"],
        correctIndex: 2,
        explanation: "The diagonal conjugate — from the sacral promontory to the inferior border of the pubis — is what a gloved finger can reach; the obstetric conjugate is derived from it by subtracting about 1.5 cm.",
      },
      {
        type: "mcq",
        stem: "What is the root value of the pudendal nerve?",
        options: ["L2, L3 and L4", "L4, L5 and S1", "S2, S3 and S4", "S4 and the coccygeal plexus only"],
        correctIndex: 2,
        explanation: "The pudendal nerve is S2 to S4, and it carries somatic motor fibres to the external sphincters and sensory fibres from the perineum — which is also why cauda equina lesions at these roots cause bladder and bowel incontinence.",
      },
      {
        type: "mcq",
        stem: "Which muscle maintains the anorectal angle and is therefore central to faecal continence?",
        options: ["Iliococcygeus", "Coccygeus", "Puborectalis", "Obturator internus"],
        correctIndex: 2,
        explanation: "Puborectalis loops around the back of the rectum and pulls the anal canal forwards, creating the anorectal angle. Losing it — by a cauda equina lesion, by surgery, or by forceps delivery — produces incontinence.",
      },
      {
        type: "mcq",
        stem: "Which statement about the cruciate anastomosis's ligamentous counterpart is correct?",
        options: [
          "The sacrotuberous ligament bounds the greater sciatic foramen",
          "The sacrotuberous ligament runs from sacrum to ischial spine and closes the lesser notch",
          "The sacrospinous ligament runs from the sacrum to the ischial spine and closes the lesser notch",
          "The inguinal ligament converts the greater sciatic notch into a foramen",
        ],
        correctIndex: 2,
        explanation: "The sacrospinous ligament runs from sacrum to ischial spine; the sacrotuberous ligament runs from sacrum to ischial tuberosity. Together they convert the two notches into the two foramina, and the pudendal canal passes between them.",
      },
      {
        type: "mcq",
        stem: "In which space does a perianal abscess most commonly collect?",
        options: [
          "The ischioanal fossa between the levator ani and the skin",
          "The peritoneal cavity",
          "The adductor canal",
          "The femoral canal",
        ],
        correctIndex: 0,
        explanation: "The ischioanal fossa is a wedge of fat in the anal triangle with no natural drainage, so infection from an anal gland collects there and must be incised. The femoral canal is the site of a femoral hernia.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The pelvis is a closed bony ring: two hip bones joined at the pubic symphysis in front and at the sacrum behind, reinforced by the sacroiliac and sacrotuberous and sacrospinous ligaments, which convert the notches into the sciatic foramina. Its diameters — the obstetric conjugate of about 11 cm, the transverse of about 13.5 cm, and the diagonal of about 12.5 cm that can be measured — are the ones that decide whether a baby can pass. Below the ring the pelvic diaphragm of levator ani and coccygeus, with the puborectalis creating the anorectal angle, holds continence, and the perineum below it is split into a urogenital and an anal triangle.",
      },
      {
        type: "paragraph",
        text: "Next: how the bones actually move. You will follow the gait cycle from heel strike to toe off, and see how a failure in any one of the muscle groups you have learned shows up as a recognisable limp.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 17 — Posture, gait & the biomechanics of walking
// (fully authored). A new concept in the spine: gait-biomechanics.
// ---------------------------------------------------------------------------
function lesson17() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: divide the gait cycle into its stance and swing phases and name their subdivisions; state the approximate proportion of the cycle spent in each phase and in double support; describe the three rockers that take the body over the foot in stance; name the four classic abnormal gaits and the muscle or nerve lesion behind each; explain the quadriceps angle and how an excessive angle predisposes to anterior knee pain; and explain why the line of gravity must pass in front of the hip, the knee and the ankle rather than through the centre of any of them.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 9 to 16. This lesson is where every muscle group, nerve and joint of the module is used at once, so all of it is a prerequisite.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The gait cycle",
        text: "One complete cycle of a single limb, from the moment one foot strikes the ground to the moment the same foot strikes it again. It divides into a stance phase, while the foot is on the ground, and a swing phase, while it is in the air.",
      },
      {
        type: "paragraph",
        text: "Walking is controlled falling. Each step transfers the body over a limb that must then swing through and land again without toppling you. Almost the whole of normal walking can be explained by two things: the segments of the stance phase that let the body pass forwards over the foot, and the reflexes by which gravity is used rather than fought.",
      },
      {
        type: "table",
        headers: ["Phase", "Proportion of the cycle", "Events"],
        rows: [
          ["Stance", "About 60 per cent", "Heel strike, foot flat, mid stance, heel off, toe off"],
          ["Swing", "About 40 per cent", "Acceleration, mid swing and deceleration before the next heel strike"],
          ["Double support", "About 20 per cent of the whole cycle, in two bouts", "Both feet are on the ground at once — the moment walking is least like running"],
          ["Single limb support", "The remainder", "The body is balanced entirely on one leg, which is why the hip abductors matter"],
        ],
      },

      { type: "heading", level: 2, text: "The three rockers of stance" },
      {
        type: "paragraph",
        text: "In stance the foot rotates about three successive axes, and the rotation is what carries the body forwards efficiently without lifting it. Physiotherapists call these the rockers, and each one is driven by a different mechanism.",
      },
      {
        type: "table",
        headers: ["Rocker", "Axis", "What moves the body over it", "Consequence if it fails"],
        rows: [
          ["Heel rocker", "The heel at heel strike", "The tibia rotates forwards over the planted heel, controlled by eccentric work in the dorsiflexors", "The foot slaps down at heel strike instead of lowering smoothly"],
          ["Ankle rocker", "The ankle joint in mid stance", "The tibia advances over a fixed foot, controlled by eccentric work in the plantarflexors", "The body vaults stiffly over the foot, and the knee hyperextends"],
          ["Forefoot rocker", "The heads of the metatarsals in terminal stance", "The heel rises and the metatarsal heads become the pivot, driven by the plantarflexors", "Heel rise is delayed and the push-off that generates forward speed is lost"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "One of the most important reasons we walk rather than shuffle is the quadriceps moment at heel strike: the knee is slightly flexed, so the line of ground reaction force falls behind the joint and tends to flex it further. The quadriceps must act to stop the knee collapsing — which is why pain or weakness in the quadriceps makes a patient avoid bending the knee at heel strike.",
      },

      { type: "heading", level: 2, text: "The line of gravity" },
      {
        type: "paragraph",
        text: "Standing is not passive. The line of gravity passes behind the hip, in front of the knee and in front of the ankle, so at rest each of those joints has a tendency that must be actively resisted: the hip tends to extend, the knee to hyperextend, and the ankle to dorsiflex. Muscles hold the line, not ligaments, which is why a person with no muscle tone cannot stand.",
      },
      {
        type: "table",
        headers: ["Joint", "Where the line of gravity passes", "Tendency this creates", "What resists it"],
        rows: [
          ["Hip", "Behind the axis of the joint", "To extend the hip and tilt the pelvis backwards", "Iliopsoas and the anterior capsule resist passive extension"],
          ["Knee", "In front of the axis of the joint", "To hyperextend the knee", "The hamstrings and the posterior capsule resist hyperextension"],
          ["Ankle", "In front of the axis of the joint", "To dorsiflex and fall forwards", "The plantarflexors — soleus above all — hold the tibia back"],
        ],
      },

      { type: "heading", level: 2, text: "Worked example: the quadriceps angle" },
      {
        type: "paragraph",
        text: "The quadriceps muscle group pulls along a line that is not straight: the rectus femoris and vastus lateralis run from above, while the patellar tendon leaves the patella vertically. The angle between those two lines is the quadriceps angle, or Q angle, and it is typically about 13 to 15 degrees in men and about 15 to 18 degrees in women, because a wider pelvis leaves the hip more lateral to the knee.",
      },
      {
        type: "paragraph",
        text: "An excessive Q angle pulls the patella laterally each time the quadriceps contracts, and if the individual has patellar maltracking this is the biomechanical basis of anterior knee pain. That is why strengthening the vastus medialis — the part of the quadriceps that pulls the patella medially — is the cornerstone of rehabilitation, and why the Q angle is one of the few biomechanical measurements you are expected to know.",
      },

      { type: "heading", level: 2, text: "The four classic abnormal gaits" },
      {
        type: "table",
        headers: ["Gait", "Cause", "What you see", "Why the body does it"],
        rows: [
          ["Trendelenburg", "Gluteus medius weakness, or superior gluteal nerve injury", "The pelvis drops on the swing side and the trunk lurches towards the stance limb", "It brings the centre of gravity over the supporting hip, so the failing abductor is no longer needed"],
          ["Gluteus maximus (lurching)", "Gluteus maximus weakness, or inferior gluteal nerve injury", "The trunk is thrown backwards at heel strike, hyperextending the hip", "It places the line of gravity behind the hip axis, so the joint is passively locked instead of extending by muscle"],
          ["Steppage (foot drop)", "Common fibular nerve injury at the fibular neck", "The knee is lifted high so the toes clear the ground and the foot slaps down", "It compensates for a lost dorsiflexor: the toe would otherwise catch the floor"],
          ["Antalgic", "Pain in a joint or limb on weight bearing", "The stance phase on the painful side is shortened", "It minimises the time the painful joint is loaded"],
        ],
      },
      {
        type: "paragraph",
        text: "Read the list backwards and it is also the map of every muscle and nerve in this module. The glutei and the common fibular nerve each produce a gait so characteristic that the diagnosis can be made from across the room, which is why the gait examination is performed before the patient even lies on the couch.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying the swing phase is longer than the stance phase. It is the other way round: about 60 per cent of the cycle is stance and 40 per cent swing. The opposite arrangement would leave the unsupported limb in the air for longer than the supported one, which is closer to running than to walking.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Describing double support as a single episode. It occurs twice in every cycle — once at the start of stance and once when the opposite limb lands — which is why it accounts for about 20 per cent of the whole cycle in two bouts of about 10 per cent each.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the Trendelenburg and gluteus maximus gaits. In the Trendelenburg gait the trunk lurches over the stance hip; in the gluteus maximus gait the trunk lurches backwards at heel strike. One side lurch and one backwards lurch, and each is a different muscle.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What proportion of a normal gait cycle is spent in stance, and how is that proportion divided among single and double support?",
        answer: "About 60 per cent is stance phase; of the whole cycle, roughly 40 per cent is single limb support and about 20 per cent is double support, in two separate bouts.",
        explanation: "The swing phase takes the remaining 40 per cent. This is also the point at which running differs — in running there is no double support at all.",
      },
      {
        type: "question",
        prompt: "A patient with a paralysed right superior gluteal nerve is observed walking. Describe the gait and the compensation, and say which side the lurch is towards.",
        answer: "The right pelvis drops when the right leg is in swing, so the trunk lurches to the right over the stance leg to bring the centre of gravity over the right hip and spare the failing abductors.",
        explanation: "The lurch is towards the side of the lesion, which is the opposite of the direction of the pelvic drop — and that inversion is what catches students out.",
      },
      {
        type: "question",
        prompt: "Why does an injury to the common fibular nerve produce a high-stepping gait specifically?",
        answer: "Because the dorsiflexors of the anterior compartment are paralysed, so the toe drags unless the knee is lifted high enough for it to clear the ground; the foot then slaps down because the dorsiflexors cannot lower it under control.",
        explanation: "The high step and the foot slap are two halves of the same sign, and both come from failing to control the forefoot.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which partition of a normal gait cycle is correct?",
        options: [
          "Stance about 40 per cent and swing about 60 per cent",
          "Stance about 60 per cent and swing about 40 per cent",
          "Stance and swing are equal at 50 per cent each",
          "Swing is about 75 per cent of the cycle",
        ],
        correctIndex: 1,
        explanation: "Stance is about 60 per cent of the cycle and swing about 40 per cent, with double support occupying about 20 per cent of the whole cycle in two bouts.",
      },
      {
        type: "mcq",
        stem: "A patient's trunk lurches to the left each time the left foot is on the ground and the right pelvis is seen to sag. Which muscle has failed?",
        options: [
          "The right gluteus medius",
          "The left gluteus medius",
          "The left gluteus maximus",
          "The right common fibular nerve",
        ],
        correctIndex: 1,
        explanation: "The sag is on the swing side, the right, so the fault is in the stance side, the left gluteus medius. The lurch is the compensation, and it is towards the side of the lesion.",
      },
      {
        type: "mcq",
        stem: "Which gait is produced by paralysis of the dorsiflexors?",
        options: ["Trendelenburg gait", "Gluteus maximus gait", "Steppage gait", "Antalgic gait"],
        correctIndex: 2,
        explanation: "Steppage gait, from common fibular nerve injury, lifts the knee high so the paralysed toes clear the ground. Antalgic gait is caused by pain, and the Trendelenburg and gluteus maximus gaits are caused by abductor and extensor weakness respectively.",
      },
      {
        type: "mcq",
        stem: "Which statement about the quadriceps angle is correct?",
        options: [
          "It is normally larger in men than in women and pulls the patella medially",
          "It is the angle between the quadriceps line and the patellar tendon, is typically about 15 degrees, and an excessive angle pulls the patella laterally",
          "It is the angle of the femoral neck and is normally about 125 degrees",
          "It is measured at the ankle and is normally zero",
        ],
        correctIndex: 1,
        explanation: "The Q angle is between the quadriceps line of pull and the patellar tendon, is typically about 13 to 15 degrees in men and 15 to 18 in women, and an excessive angle contributes to lateral patellar tracking and anterior knee pain.",
      },
      {
        type: "mcq",
        stem: "In normal standing, where does the line of gravity lie relative to the knee?",
        options: [
          "Directly through the centre of the joint, so no muscle is needed",
          "In front of the axis of the joint, creating a tendency to hyperextension that the hamstrings resist",
          "Behind the axis of the joint, creating a tendency to flex that the quadriceps resist",
          "Behind the axis of the joint at the knee but in front of it at the hip",
        ],
        correctIndex: 1,
        explanation: "The line of gravity passes in front of the knee, so the knee tends to hyperextend and the hamstrings and posterior capsule resist. At the hip and ankle it passes behind and in front of the joint respectively.",
      },
      {
        type: "mcq",
        stem: "A patient with painful arthritis shortens the time spent on the painful leg. Which gait is this?",
        options: ["Trendelenburg gait", "Antalgic gait", "Steppage gait", "Ataxic gait"],
        correctIndex: 1,
        explanation: "Antalgic gait is the limp of pain: the stance phase on the affected side is shortened to reduce the load. It is not caused by weakness, which is what the other three in this list share.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The gait cycle divides into about 60 per cent stance and 40 per cent swing, with double support occupying about a fifth of the whole cycle. In stance the body passes over the foot through three rockers — heel, ankle and forefoot — driven in sequence by the dorsiflexors, the plantarflexors and the push-off, and at rest the line of gravity leaves each joint with a tendency its muscles must resist. Four gaits give away four lesions: the Trendelenburg lurch for gluteus medius, the backward thrust for gluteus maximus, the high step for the common fibular nerve, and the shortened stance for pain.",
      },
      {
        type: "paragraph",
        text: "Next: the module closes with a clinical correlation that puts compartment syndrome, the fractures and the nerve injuries of the lower limb into a single working diagnosis.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODULE 2 — LESSON 18 — Clinical correlation: joint injuries & compartment
// syndrome (fully authored). A new concept in the spine:
// clinical-lower-limb-injury.
// ---------------------------------------------------------------------------
function lesson18() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define compartment syndrome, list the six Ps, and name the earliest and the latest; state which compartment of the leg is most often affected and why; explain the threshold of intracompartmental pressure that prompts a fasciotomy; describe the features and management of a fractured neck of femur and how it differs from a trochanteric fracture; interpret a positive Thompson test and state what structure it tests; and apply the Ottawa ankle rules to decide whether an ankle injury needs an X-ray.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 12, 13 and 15. You need the compartments of the leg, the joints of the lower limb and the arterial supply, because the diagnosis is made from all three.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Compartment syndrome",
        text: "A rise in pressure inside a closed osteofascial compartment that reduces the perfusion gradient across the capillary bed, so muscle and nerve are starved of blood while the arterial pulse continues. It is the single most time-critical diagnosis in the lower limb.",
      },
      {
        type: "paragraph",
        text: "The leg is a set of closed boxes, and that design is its weakness. Swelling inside a rigid box cannot expand sideways, so it raises the pressure inside, and the first structures to feel it are the capillaries — they are compressed shut and tissue is then starved of oxygen at exactly the moment its metabolic demand rises with the injury.",
      },
      {
        type: "table",
        headers: ["Sign", "What it means", "How early"],
        rows: [
          ["Pain", "Out of proportion to the injury, and worse on passive stretch of the muscles in the compartment", "The earliest and the only reliable one"],
          ["Paresthesia", "Nerve ischaemia, felt as pins and needles in the nerve's territory", "Early"],
          ["Pallor", "The skin is pale because flow to it is failing", "Late"],
          ["Paralysis", "The muscles can no longer contract because they are ischaemic", "Late"],
          ["Pulselessness", "The arterial pulse is gone, which happens only after the compartment pressure exceeds the arterial pressure", "Last of all"],
          ["Poikilothermia", "The limb takes the temperature of the room because it is not being perfused", "Late"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The most important teaching point is the order. Pain on passive stretch is the sign to act on, and pulselessness is the sign that the limb is already lost. A patient with a tight tibial fracture whose pain escalates and whose toes are becoming numb needs a fasciotomy now — waiting for the pulse to disappear is waiting too long.",
      },
      {
        type: "paragraph",
        text: "The anterior compartment of the leg is most commonly affected, because it is the tightest of the three and sits right against the subcutaneous tibia that fractures most often. The definitive treatment is fasciotomy: the fascia over the compartment is split long enough to let the contents expand, and the wound is left open until the swelling settles. If the pressure is not relieved, muscle dies and is replaced by scar, so the foot becomes fixed in flexion — Volkmann's contracture.",
      },

      { type: "heading", level: 2, text: "Worked example: fracture of the neck of femur" },
      {
        type: "paragraph",
        text: "The commonest reason an elderly patient is admitted with a fractured hip is a fall, and the injury divides according to where the fracture lies in relation to the joint capsule. This distinction is not academic: it decides the operation.",
      },
      {
        type: "table",
        headers: ["Feature", "Intracapsular fracture", "Extracapsular (trochanteric) fracture"],
        rows: [
          ["Position", "Within the capsule, across the femoral neck", "Between the trochanters, outside the capsule"],
          ["Blood supply to the head", "Torn retinacular arteries — the head becomes avascular", "Preserved, so the head survives"],
          ["Typical patient", "Older and often osteoporotic", "Older and often osteoporotic"],
          ["Operation", "Hemiarthroplasty or total hip replacement", "Dynamic hip screw or intramedullary nail"],
          ["Complication to fear", "Non-union and avascular necrosis of the head", "Failure of the fixation, especially in unstable patterns"],
        ],
      },
      {
        type: "paragraph",
        text: "The limb lies shortened and externally rotated in both, and the reason is the same: the shaft is no longer held by the femoral head and neck, so the pull of iliopsoas and the short rotators shortens and turns it outwards. The mortality that follows a fractured hip is not usually from the fracture itself but from the immobility, the chest infection and the pressure sores that come with a long convalescence, which is why rapid surgery and early mobilisation are the standard of care.",
      },

      { type: "heading", level: 2, text: "Worked example: the ruptured Achilles tendon" },
      {
        type: "paragraph",
        text: "A middle-aged patient who has not played sport for years takes one sudden step, feels a pop at the back of the heel, and falls. The tendo calcaneus has torn, usually a few centimetres above its insertion where the blood supply is poorest. The patient cannot rise onto the toes of that foot. The Thompson test settles it: with the patient kneeling or prone, squeeze the calf; a normal tendon transmits the squeeze into a visible plantarflexion of the foot, and a ruptured one does not.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A ruptured Achilles tendon is missed more often than any other tendon injury, because the foot can still plantarflex using the tibialis posterior, the peroneals and the deep flexors. The test is not 'can the foot move' — it is 'does the foot move when you squeeze the calf'.",
      },

      { type: "heading", level: 2, text: "Worked example: is it a sprain or a fracture?" },
      {
        type: "paragraph",
        text: "The Ottawa ankle rules were written to answer that question without an X-ray for every twisted ankle. A radiograph is indicated if there is pain in the malleolar zone and either bone tenderness over the posterior edge or the tip of either malleolus, or the patient cannot take four steps both at the time and in the emergency department. For the foot, a film is indicated if there is pain in the midfoot zone with tenderness at the base of the fifth metatarsal or at the navicular, or the patient again cannot bear weight.",
      },
      {
        type: "table",
        headers: ["Finding", "X-ray of the ankle indicated?", "Why"],
        rows: [
          ["Bony tenderness over the posterior edge or tip of either malleolus", "Yes", "It localises pain to bone, not just to ligament"],
          ["Inability to take four steps immediately after the injury and at assessment", "Yes", "Weight-bearing excludes most fractures by itself"],
          ["Tenderness only over the lateral ligament with normal weight-bearing", "No", "A ligament sprain needs no radiograph, only management"],
          ["Tenderness at the base of the fifth metatarsal after an inversion injury", "Yes, a foot radiograph", "An avulsion fracture of the tuberosity is commonly missed there"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Relying on the presence of a pulse to exclude compartment syndrome. The pulse disappears last, after muscle and nerve have already died. The correct sign is pain out of proportion, and passive stretch of the affected compartment is the manoeuvre that elicits it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a plaster that has become uncomfortable as a nuisance rather than a warning. A cast that is too tight is a closed compartment syndrome, and the first thing a patient reports is pain, not numbness — which is why a tight cast is split or removed rather than the patient reassured.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that the fibular neck fracture, the tight cast and the high knee flexion in bed can all produce the same foot drop. The mechanism is always the same nerve, the common fibular nerve, wherever you choose to injure it.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with a tibial fracture has escalating pain and is losing sensation in the first web space. What is the diagnosis, which compartment is compressed, and what is the treatment?",
        answer: "Acute anterior compartment syndrome, compressing the anterior compartment of the leg where the deep fibular nerve and the anterior tibial vessels run. The treatment is immediate fasciotomy to release the fascia over the compartment.",
        explanation: "Sensation in the first dorsal web space is the earliest sensory sign, because the deep fibular nerve supplies that patch and ischaemia of nerve precedes that of muscle.",
      },
      {
        type: "question",
        prompt: "How does a Thompson test work, and what does a negative result indicate?",
        answer: "The patient kneels with the feet over the edge of the couch, and the examiner squeezes the calf. In an intact tendon the squeeze transmits to the foot and produces visible plantarflexion; a foot that does not move indicates a ruptured tendo calcaneus.",
        explanation: "The test works because the gastrocnemius and soleus share the Achilles tendon, so squeezing either muscle must move the foot if the tendon is continuous.",
      },
      {
        type: "question",
        prompt: "Which two features of an ankle injury make a radiograph necessary under the Ottawa rules?",
        answer: "Bony tenderness over the posterior edge or tip of either malleolus, and inability to take four steps both at the time of injury and at assessment. For the foot, tenderness at the base of the fifth metatarsal.",
        explanation: "The rules exist because the overwhelming majority of ankle injuries are ligament sprains, and they let you spare the unnecessary film without missing the fracture.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which is the earliest and most reliable sign of compartment syndrome?",
        options: ["Pulselessness of the dorsalis pedis", "Pallor of the distal limb", "Pain out of proportion to the injury, worse on passive stretch", "Paralysis of the muscles in the compartment"],
        correctIndex: 2,
        explanation: "Pain on passive stretch comes first, because the ischaemic muscle and nerve complain before they fail. Pulselessness and paralysis are late, and a normal pulse must never be taken as reassurance.",
      },
      {
        type: "mcq",
        stem: "Which compartment of the leg is most often affected by compartment syndrome, and why?",
        options: [
          "The lateral compartment, because it is the largest",
          "The posterior compartment, because it contains the two big plantarflexors",
          "The anterior compartment, because it is the tightest and lies against the subcutaneous tibia that fractures most often",
          "The adductor canal, because it is a closed box",
        ],
        correctIndex: 2,
        explanation: "The anterior compartment is the tightest and is directly adjacent to the tibia, which is the commonest site of fracture in the lower limb. The resulting swelling raises pressure in a space that cannot expand.",
      },
      {
        type: "mcq",
        stem: "A patient cannot rise onto the toes after a sudden step and the foot does not move when the calf is squeezed. What has happened?",
        options: [
          "A rupture of the tendo calcaneus",
          "A lateral ankle ligament sprain",
          "A fracture of the base of the fifth metatarsal",
          "A tibial nerve lesion in the popliteal fossa",
        ],
        correctIndex: 0,
        explanation: "A negative Thompson test — no plantarflexion when the calf is squeezed — is a ruptured Achilles tendon. The other options produce swelling, bony point tenderness or a sensory change, not this.",
      },
      {
        type: "mcq",
        stem: "Which finding under the Ottawa ankle rules mandates a radiograph?",
        options: [
          "Tenderness over the lateral ligament with full weight-bearing",
          "Bony tenderness over the posterior edge of the lateral malleolus, or inability to take four steps",
          "Swelling of the whole ankle without any focal bony tenderness",
          "A previous ankle sprain on the same side",
        ],
        correctIndex: 1,
        explanation: "Bony tenderness over the posterior edge or the tip of either malleolus, and inability to take four steps, are the two indications. Ligament tenderness with normal weight-bearing does not require a film.",
      },
      {
        type: "mcq",
        stem: "Why is an intracapsular fracture of the femoral neck treated by replacement rather than by internal fixation?",
        options: [
          "Because the fracture line is too oblique for any screw to hold",
          "Because the fracture has torn the retinacular vessels, so the head loses its blood supply and cannot heal",
          "Because the capsule has to be opened anyway to reduce it",
          "Because the trochanteric fracture patterns always heal poorly",
        ],
        correctIndex: 1,
        explanation: "Tearing the retinacular arteries renders the head avascular, so fixing a dead bone gives a non-union or later collapse. Extracapsular fractures spare those vessels and are therefore fixed rather than replaced.",
      },
      {
        type: "mcq",
        stem: "A patient with circumferential burns of both legs is noted to be losing sensation over the dorsum of both feet. Which mechanism explains this?",
        options: [
          "Direct thermal injury to the sural nerves at the lateral malleolus",
          "Compression of the common fibular nerves in the burns eschar, producing bilateral foot drop",
          "Bilateral sciatic nerve transection at the level of the hip",
          "Stretching of the tibial nerves in the popliteal fossae",
        ],
        correctIndex: 1,
        explanation: "A tight circumferential burn eschar acts like a too-tight plaster: the common fibular nerve at the fibular neck is compressed, so dorsiflexion and the dorsum of the foot are lost. Escharotomy relieves it.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "The lower limb's closed compartments are its greatest vulnerability: compartment syndrome, whose earliest sign is pain on passive stretch and whose latest is pulselessness, is relieved only by fasciotomy. Fracture management divides at the capsule of the hip, because the retinacular vessels decide whether the femoral head survives; a ruptured Achilles tendon is a negative Thompson test rather than a loss of all plantarflexion; and the Ottawa rules let a sprain be told from a fracture by two findings, bone tenderness and the ability to take four steps.",
      },
      {
        type: "paragraph",
        text: "This completes Module 2. Next module moves to the abdomen and the retroperitoneum, where the same principles — closed spaces, arterial supply and named nerve lesions — explain the inguinal canal and the gastrointestinal tract.",
      },
    ],
  };
}

const MODULE_ONE_SBAS = [
  {
    slug: "gross-anatomy-i--anatomical-position-planes--sba",
    concept: "anatomical-position-planes",
    stem: "A surgeon describes a tumour as lying 'medial to the humerus and lateral to the sternum'. Which plane best separates these two structures?",
    options: [
      "The sagittal plane, because medial and lateral describe relationships toward or away from the midline",
      "The coronal plane, because medial and lateral describe anterior-posterior relationships",
      "The transverse plane, because medial and lateral describe superior-inferior relationships",
      "The midsagittal plane only, because only it can separate medial from lateral",
    ],
    correctAnswer:
      "The sagittal plane, because medial and lateral describe relationships toward or away from the midline",
    explanation:
      "Medial means closer to the body's midline and lateral means further from it, so the surface between them is sagittal. The midsagittal plane is the specific sagittal plane passing through the midline itself; the coronal plane separates anterior from posterior, and the transverse plane separates superior from inferior.",
  },
  {
    slug: "gross-anatomy-i--upper-limb-skeleton--sba",
    concept: "upper-limb-skeleton",
    stem: "A patient falls onto an outstretched hand and cannot abduct the arm, with sensory loss over the lower shoulder. Which fracture and nerve explain this?",
    options: [
      "A mid-shaft humeral fracture injuring the radial nerve",
      "A surgical neck fracture injuring the axillary nerve",
      "A medial epicondyle fracture injuring the ulnar nerve",
      "A fractured clavicle injuring the long thoracic nerve",
    ],
    correctAnswer: "A surgical neck fracture injuring the axillary nerve",
    explanation:
      "The axillary nerve winds around the surgical neck of the humerus in the quadrangular space, so a fracture there paralyses deltoid (loss of abduction) and produces sensory loss over the regimental badge area. A mid-shaft fracture injures the radial nerve and gives wrist drop; a medial epicondyle fracture injures the ulnar nerve.",
  },
  {
    slug: "gross-anatomy-i--pectoral-muscles--sba",
    concept: "pectoral-muscles",
    stem: "Which statement correctly separates the actions of pectoralis major and pectoralis minor?",
    options: [
      "Both muscles move the arm, and the difference is only their size",
      "Pectoralis major flexes, adducts and medially rotates the arm, while pectoralis minor protracts and depresses the scapula",
      "Pectoralis major rotates the scapula and pectoralis minor abducts the arm",
      "Neither moves a joint — they both tense the chest skin",
    ],
    correctAnswer:
      "Pectoralis major flexes, adducts and medially rotates the arm, while pectoralis minor protracts and depresses the scapula",
    explanation:
      "Insertion decides the action: major inserts on the humerus so it moves the arm; minor inserts on the coracoid process of the scapula so it moves and steadies the scapula. Same origin region, different insertions, different jobs.",
  },
  {
    slug: "gross-anatomy-i--brachial-plexus--sba",
    concept: "brachial-plexus",
    stem: "Which spinal nerve roots form the brachial plexus?",
    options: ["C1, C2, C3 and C4", "C5 through T5, including five thoracic roots", "C5, C6, C7, C8 and T1", "Only C6, C7 and T1"],
    correctAnswer: "C5, C6, C7, C8 and T1",
    explanation:
      "The five roots C5-T1 join into upper, middle and lower trunks, which split into anterior and posterior divisions, recombine as the lateral, posterior and medial cords, and end as the branches to the limb — the root-trunk-division-cord-branch order this course follows.",
  },
  {
    slug: "gross-anatomy-i--axilla-contents--sba",
    concept: "axilla-contents",
    stem: "A surgeon enters the axilla. Which structures must she be aware of among its contents?",
    options: [
      "The axillary artery, the axillary vein, the cords of the brachial plexus, lymph nodes and fat",
      "Only the axillary artery — nothing else of importance lies there",
      "The heart and the great vessels",
      "The intercostal nerves running along the ribs",
    ],
    correctAnswer:
      "The axillary artery, the axillary vein, the cords of the brachial plexus, lymph nodes and fat",
    explanation:
      "The axilla is the single funnel between trunk and upper limb: artery, vein and the three cords of the plexus travel through it wrapped in the axillary sheath, together with the axillary lymph nodes that drain the breast and chest wall — the reason axillary node status matters in breast cancer.",
  },
  {
    slug: "gross-anatomy-i--thoracic-wall--sba",
    concept: "thoracic-wall",
    stem: "Where does a typical rib articulate with the vertebral column?",
    options: [
      "Its head with the demifacets of its own vertebra and the one above, and its tubercle with the transverse process of its own vertebra",
      "Its head only with the body of a single vertebra",
      "Its shaft directly with the spinous processes",
      "It does not articulate with vertebrae — only with the sternum",
    ],
    correctAnswer:
      "Its head with the demifacets of its own vertebra and the one above, and its tubercle with the transverse process of its own vertebra",
    explanation:
      "Two synovial joints per rib: the costovertebral joint (head, sharing the disc above via demifacets) and the costotransverse joint (tubercle with the transverse process). Together they define the axis about which the rib swings up and out in breathing.",
  },
  {
    slug: "gross-anatomy-i--mediastinum--sba",
    concept: "mediastinum",
    stem: "Which plane divides the mediastinum into superior and inferior parts, and what landmark marks it in the living patient?",
    options: [
      "A horizontal plane through the sternal angle (the manubriosternal joint), level with the T4/T5 intervertebral disc",
      "A vertical plane through the xiphoid process",
      "A coronal plane through the midclavicular lines",
      "The diaphragm itself, with no surface landmark",
    ],
    correctAnswer:
      "A horizontal plane through the sternal angle (the manubriosternal joint), level with the T4/T5 intervertebral disc",
    explanation:
      "The sternal angle is the palpable landmark of the transverse thoracic plane: above it lies the superior mediastinum (aortic arch, trachea, oesophagus); below, the anterior, middle and posterior compartments. The diaphragm forms the floor of the whole mediastinum, not its internal divider.",
  },
  {
    slug: "gross-anatomy-i--clinical-pneumothorax-nerve-injuries--sba",
    concept: "clinical-pneumothorax-nerve-injuries",
    stem: "In a tension pneumothorax, why does the patient deteriorate so fast?",
    options: [
      "Air enters the pleural cavity through a one-way wound but cannot escape, so rising pressure collapses the lung, shifts the mediastinum and blocks venous return",
      "Air slowly leaks in over days and the lung collapses by scarring",
      "Blood fills the pleural cavity and clots around the heart",
      "The injury severs only the phrenic nerve and breathing stops",
    ],
    correctAnswer:
      "Air enters the pleural cavity through a one-way wound but cannot escape, so rising pressure collapses the lung, shifts the mediastinum and blocks venous return",
    explanation:
      "The one-way valve is the danger: each breath adds air, pressure pushes the mediastinum across, kinking the great veins — it is obstructive shock that must be decompressed on the spot, not at imaging.",
  },
];

// ---------------------------------------------------------------------------
// Deeper modules 2-6: a real concept spine, tracked-placeholder lessons.
// ---------------------------------------------------------------------------
const DEEPER_LESSONS: LessonSeed[] = [
  // --- M2 Lower limb & pelvis ---
  { title: "Bones of the lower limb & hip bone", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Lower limb skeleton and the hip bone", slug: "lower-limb-skeleton", summary: "The hip bone (ilium, ischium, pubis), femur, patella, tibia and fibula, and the weight-bearing design of the joint line.", blooms: "understand", minutes: 40, prereq: ["upper-limb-skeleton"] }, content: lesson9() as never },
  { title: "Gluteal region & hip abductors", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Gluteal muscles and hip abductors", slug: "gluteal-muscles", summary: "Gluteus maximus, medius, minimus and the small lateral rotators; the Trendelenburg test and the superior gluteal nerve.", blooms: "understand", minutes: 35, prereq: ["lower-limb-skeleton"] }, content: lesson10() as never },
  { title: "Femoral triangle & adductor canal", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Femoral triangle and adductor canal", slug: "femoral-triangle", summary: "Boundaries, contents and the NAVEL order of the femoral canal; venous access, femoral hernia and adductor-canal contents.", blooms: "apply", minutes: 40, prereq: ["lower-limb-skeleton"] }, content: lesson11() as never },
  { title: "Popliteal fossa, leg compartments & foot", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Popliteal fossa, leg compartments and the foot", slug: "popliteal-fossa-leg", summary: "The popliteal fossa; anterior, lateral and posterior compartments of the leg; the arches of the foot and common peroneal nerve injury.", blooms: "apply", minutes: 40, prereq: ["femoral-triangle"] }, content: lesson12() as never },
  { title: "Knee & ankle joints", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Joints of the lower limb", slug: "lower-limb-joints", summary: "The knee as a compound synovial joint with menisci and cruciate ligaments; the ankle mortise and its ligamentous stability.", blooms: "analyze", minutes: 35, prereq: ["lower-limb-skeleton"] }, content: lesson13() as never },
  { title: "Lumbosacral plexus & lower limb innervation", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Lumbosacral plexus", slug: "lumbosacral-plexus", summary: "The lumbar and sacral plexuses (L1-S4) and their branches to the lower limb, with the pattern of root lesions and sciatic nerve injury.", blooms: "analyze", minutes: 45, prereq: ["lower-limb-skeleton", "brachial-plexus"] }, content: lesson14() as never },

  // --- M3 Abdomen & retroperitoneum ---
  { title: "Abdominal wall & inguinal canal", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Abdominal wall and inguinal canal", slug: "abdominal-wall-inguinal-canal", summary: "The flat muscles and rectus sheath, the arcuate line, and the inguinal canal's rings, walls and contents that explain inguinal hernia.", blooms: "understand", minutes: 40, prereq: ["thoracic-wall"] }, content: { blocks: [] } },
  { title: "Peritoneum & peritoneal cavity", module: 3, estimatedMinutes: 35, authored: false, concept: { title: "Peritoneum and peritoneal cavity", slug: "peritoneum", summary: "Intraperitoneal versus retroperitoneal organs, the mesenteries and omenta, and the pouches that determine where fluid or infection collects.", blooms: "understand", minutes: 35, prereq: ["abdominal-wall-inguinal-canal"] }, content: { blocks: [] } },
  { title: "Gastrointestinal tract", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Gastrointestinal tract", slug: "gastrointestinal-tract", summary: "Oesophagus, stomach, duodenum, small and large bowel — their segments, arterial supply, venous drainage and lymphatic fields.", blooms: "understand", minutes: 45, prereq: ["peritoneum"] }, content: { blocks: [] } },
  { title: "Liver, biliary tree & pancreas", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Liver, biliary tree and pancreas", slug: "hepatobiliary-pancreas", summary: "The liver's lobes and segments, the biliary tree and sphincter of Oddi, the pancreas and the ampulla of Vater.", blooms: "understand", minutes: 40, prereq: ["gastrointestinal-tract"] }, content: { blocks: [] } },
  { title: "Kidneys, ureters & suprarenal glands", module: 3, estimatedMinutes: 40, authored: false, concept: { title: "Urinary tract and suprarenal glands", slug: "kidneys-retroperitoneum", summary: "The retroperitoneal kidney, its fascial coverings and relations, the ureter's course and constrictions, and the suprarenal glands.", blooms: "understand", minutes: 40, prereq: ["abdominal-wall-inguinal-canal"] }, content: { blocks: [] } },
  { title: "Abdominal vasculature & autonomic supply", module: 3, estimatedMinutes: 45, authored: false, concept: { title: "Abdominal vasculature and autonomic innervation", slug: "abdominal-vasculature-autonomic", summary: "The coeliac, superior and inferior mesenteric arteries, the portal system and anastomoses, and the vagal and sympathetic supply of the gut.", blooms: "analyze", minutes: 45, prereq: ["gastrointestinal-tract"] }, content: { blocks: [] } },

  // --- M4 Head & neck ---
  { title: "Skull, cervical fascia & muscles", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Skull and cervical fascia", slug: "skull-cervical-fascia", summary: "The cranial fossae and their foramina, the cervical fascia and the compartments that decide where infection spreads in the neck.", blooms: "understand", minutes: 40, prereq: ["upper-limb-skeleton"] }, content: { blocks: [] } },
  { title: "Muscles of facial expression & mastication", module: 4, estimatedMinutes: 30, authored: false, concept: { title: "Muscles of the face and of mastication", slug: "facial-mastication-muscles", summary: "The muscles of facial expression supplied by the facial nerve, and the muscles of mastication supplied by the mandibular nerve.", blooms: "remember", minutes: 30, prereq: ["skull-cervical-fascia"] }, content: { blocks: [] } },
  { title: "Cranial nerves", module: 4, estimatedMinutes: 50, authored: false, concept: { title: "The twelve cranial nerves", slug: "cranial-nerves", summary: "The twelve cranial nerves by name, number, function and foramen, and the pattern of deficit produced by each lesion.", blooms: "analyze", minutes: 50, prereq: ["skull-cervical-fascia"] }, content: { blocks: [] } },
  { title: "Neck triangles, vessels & glands", module: 4, estimatedMinutes: 45, authored: false, concept: { title: "Triangles of the neck and the great vessels", slug: "neck-triangles-vessels", summary: "Anterior and posterior neck triangles, the carotid sheath, the internal jugular vein and the thyroid and parathyroid glands.", blooms: "understand", minutes: 45, prereq: ["skull-cervical-fascia"] }, content: { blocks: [] } },
  { title: "Orbit, eye & special senses", module: 4, estimatedMinutes: 40, authored: false, concept: { title: "Orbit, eye and extraocular muscles", slug: "orbit-eye", summary: "The bones and contents of the orbit, the extraocular muscles and their actions, the visual pathway and the pupillary reflexes.", blooms: "understand", minutes: 40, prereq: ["cranial-nerves"] }, content: { blocks: [] } },
  { title: "Ear, nose & pharynx", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Ear, nose and pharynx", slug: "ear-nose-pharynx", summary: "External, middle and inner ear, the nasal cavity and paranasal sinuses, and the pharynx and its connections.", blooms: "understand", minutes: 35, prereq: ["cranial-nerves"] }, content: { blocks: [] } },

  // --- M5 Neuroanatomy & special senses ---
  { title: "Spinal cord & ascending/descending tracts", module: 5, estimatedMinutes: 50, authored: false, concept: { title: "Spinal cord tracts", slug: "spinal-cord-tracts", summary: "Cord anatomy, the dorsal column-medial lemniscus and spinothalamic pathways, and the corticospinal tract with the signs of cord hemisection.", blooms: "analyze", minutes: 50, prereq: ["brachial-plexus"] }, content: { blocks: [] } },
  { title: "Brainstem & cranial nerve nuclei", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Brainstem and cranial nerve nuclei", slug: "brainstem", summary: "Midbrain, pons and medulla surface and cross-section, the cranial nerve nuclei and the crossing of the ascending and descending pathways.", blooms: "analyze", minutes: 45, prereq: ["spinal-cord-tracts"] }, content: { blocks: [] } },
  { title: "Cerebral cortex, basal ganglia & cerebellum", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Cerebral cortex, basal ganglia and cerebellum", slug: "cortex-basal-ganglia-cerebellum", summary: "Lobes and functional areas of the cortex, the extrapyramidal system, and the cerebellar role in coordination.", blooms: "analyze", minutes: 45, prereq: ["brainstem"] }, content: { blocks: [] } },
  { title: "Meninges, ventricles & CSF", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Meninges, ventricles and cerebrospinal fluid", slug: "meninges-ventricles-csf", summary: "The three meningeal layers, the dural venous sinuses, the ventricular system and CSF production and flow — the anatomy of raised intracranial pressure.", blooms: "understand", minutes: 40, prereq: ["brainstem"] }, content: { blocks: [] } },
  { title: "Blood supply of the central nervous system", module: 5, estimatedMinutes: 45, authored: false, concept: { title: "Cerebral circulation and the circle of Willis", slug: "cerebral-circulation", summary: "The internal carotid and vertebrobasilar systems, the circle of Willis, and the cortical territories lost in each arterial stroke.", blooms: "apply", minutes: 45, prereq: ["brainstem", "axilla-contents"] }, content: { blocks: [] } },
  { title: "Special senses: vision, hearing & balance", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Visual, auditory and vestibular pathways", slug: "special-senses-pathways", summary: "The retina and visual pathway with its field defects, the auditory pathway, and the vestibular system.", blooms: "analyze", minutes: 40, prereq: ["orbit-eye", "ear-nose-pharynx"] }, content: { blocks: [] } },

  // --- M6 Embryology & developmental anatomy ---
  { title: "Gametogenesis & the first weeks", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Gametogenesis and early development", slug: "embryo-first-weeks", summary: "Gamete formation and maturation, fertilisation, cleavage and implantation of the blastocyst in the first two weeks.", blooms: "remember", minutes: 40, prereq: [] }, content: { blocks: [] } },
  { title: "Placentation & fetal membranes", module: 6, estimatedMinutes: 35, authored: false, concept: { title: "Placentation and fetal membranes", slug: "placentation", summary: "The chorionic villi and placental barrier, the formation of the placenta, and the fetal circulation with its shunts.", blooms: "understand", minutes: 35, prereq: ["embryo-first-weeks"] }, content: { blocks: [] } },
  { title: "Body cavities & the diaphragm", module: 6, estimatedMinutes: 35, authored: false, concept: { title: "Formation of the body cavities and diaphragm", slug: "embryo-body-cavities", summary: "The intra-embryonic coelom, the partitioning of the pericardial, pleural and peritoneal cavities, and the congenital diaphragmatic hernia.", blooms: "understand", minutes: 35, prereq: ["mediastinum"] }, content: { blocks: [] } },
  { title: "Pharyngeal arches & derivatives", module: 6, estimatedMinutes: 40, authored: false, concept: { title: "Pharyngeal arches", slug: "pharyngeal-arches", summary: "The arches, pouches and clefts with their cartilage, muscle, nerve and artery derivatives, and the anomalies they produce.", blooms: "analyze", minutes: 40, prereq: ["skull-cervical-fascia"] }, content: { blocks: [] } },
  { title: "Limb development & congenital malformations", module: 6, estimatedMinutes: 35, authored: false, concept: { title: "Limb development and congenital malformations", slug: "limb-development", summary: "The apical ectodermal ridge and the developmental anatomy of the limb bud and its axial arteries, with the common congenital anomalies.", blooms: "analyze", minutes: 35, prereq: ["upper-limb-skeleton", "lower-limb-skeleton"] }, content: { blocks: [] } },
];

// ---------------------------------------------------------------------------
// MODULE 2 — SBA items, one per authored concept.
// ---------------------------------------------------------------------------
const MODULE_TWO_SBAS: SbaSeed[] = [
  {
    slug: "gross-anatomy-i--lower-limb-skeleton--sba",
    concept: "lower-limb-skeleton",
    stem: "A patient has a displaced fracture of the femoral neck inside the joint capsule and is offered a hemiarthroplasty. What is the anatomical reason the femoral head cannot be fixed and expected to heal?",
    options: [
      "The head of the femur is supplied only by the artery of the ligamentum teres, which is always inadequate",
      "The retinacular vessels that climb the femoral neck from the circumflex femoral arteries are torn, so the head becomes avascular",
      "The acetabulum has been fractured as well, so no socket remains to receive the head",
      "The femoral head has no blood supply of its own in the adult, and never had one",
    ],
    correctAnswer:
      "The retinacular vessels that climb the femoral neck from the circumflex femoral arteries are torn, so the head becomes avascular",
    explanation:
      "The greater part of the femoral head is supplied by retinacular branches of the medial and lateral circumflex femoral arteries that ascend the neck beneath the synovial reflection. The artery of the ligamentum teres supplies only a small part in the adult. Tearing the retinacular vessels is why intracapsular fractures are replaced while extracapsular fractures are fixed.",
    difficulty: "medium",
  },
  {
    slug: "gross-anatomy-i--gluteal-muscles--sba",
    concept: "gluteal-muscles",
    stem: "A patient stands on the right leg and the left side of the pelvis is seen to sag, with the trunk lurching to the right. Which structure has failed, and on which side?",
    options: [
      "The left gluteus medius, supplied by the left superior gluteal nerve",
      "The right gluteus medius, supplied by the right superior gluteal nerve",
      "The left gluteus maximus, supplied by the left inferior gluteal nerve",
      "The right sciatic nerve, supplying the hamstrings of the stance leg",
    ],
    correctAnswer: "The right gluteus medius, supplied by the right superior gluteal nerve",
    explanation:
      "This is the positive Trendelenburg sign. The pelvis drops on the side of the unsupported limb, but the failure is in the stance leg's abductors — here the right gluteus medius and minimus, supplied by the right superior gluteal nerve. The trunk lurches towards the stance side to spare the failing abductors.",
    difficulty: "medium",
  },
  {
    slug: "gross-anatomy-i--femoral-triangle--sba",
    concept: "femoral-triangle",
    stem: "During catheterisation the right femoral artery is punctured at the mid-inguinal point. Why is this site safe for compression, and what lies immediately behind the artery there?",
    options: [
      "The psoas major lies behind the artery and absorbs the pressure",
      "The head of the femur lies behind the artery and provides a firm surface to compress it against",
      "The femoral vein lies behind the artery and can be compressed instead",
      "The inguinal canal lies behind the artery, so bleeding can drain into it",
    ],
    correctAnswer: "The head of the femur lies behind the artery and provides a firm surface to compress it against",
    explanation:
      "The femoral artery crosses the inguinal ligament at the mid-inguinal point, roughly a third of the way from the anterior superior iliac spine to the pubic symphysis, with the head of the femur directly behind it. That bony backing is what allows the artery to be compressed after the catheter is withdrawn. A puncture above the ligament enters the external iliac artery, which cannot be compressed.",
    difficulty: "medium",
  },
  {
    slug: "gross-anatomy-i--popliteal-fossa-leg--sba",
    concept: "popliteal-fossa-leg",
    stem: "A patient fractures the neck of the fibula and now cannot dorsiflex the ankle. Which nerve is injured, and which surface of the foot retains normal sensation?",
    options: [
      "The tibial nerve, and the dorsum of the foot",
      "The common fibular nerve, and the sole of the foot",
      "The common fibular nerve, and the dorsum of the foot",
      "The superficial fibular nerve, and the sole of the foot",
    ],
    correctAnswer: "The common fibular nerve, and the sole of the foot",
    explanation:
      "The common fibular nerve winds around the neck of the fibula, where it lies on bone unprotected by muscle, and its injury gives foot drop. The sole is spared because it is tibial nerve territory through the medial and lateral plantar nerves; the dorsum and the lateral side of the leg are lost.",
    difficulty: "medium",
  },
  {
    slug: "gross-anatomy-i--lower-limb-joints--sba",
    concept: "lower-limb-joints",
    stem: "A footballer twists the knee with the foot planted, hears a pop and develops a haemarthrosis. Which three structures form the classic unhappy triad?",
    options: [
      "The anterior cruciate ligament, the medial collateral ligament and the medial meniscus",
      "The posterior cruciate ligament, the lateral collateral ligament and the lateral meniscus",
      "The anterior cruciate ligament, the lateral collateral ligament and the lateral meniscus",
      "The posterior cruciate ligament, the medial collateral ligament and the patellar tendon",
    ],
    correctAnswer: "The anterior cruciate ligament, the medial collateral ligament and the medial meniscus",
    explanation:
      "A valgus force with a twisting component loads the medial side: the medial collateral ligament is torn, and because its deep fibres are bound to the medial meniscus that tears too, while the rotation tears the anterior cruciate. The lateral meniscus escapes because it is loosely attached and mobile.",
    difficulty: "medium",
  },
  {
    slug: "gross-anatomy-i--lumbosacral-plexus--sba",
    concept: "lumbosacral-plexus",
    stem: "A patient has lost the whole sciatic nerve at the hip. Which finding distinguishes this from a common fibular nerve lesion at the fibular neck?",
    options: [
      "The loss of sensation over the dorsum of the foot, which is spared in a fibular neck lesion",
      "The normal sensation over the sole of the foot, which is lost in a fibular neck lesion",
      "Weak knee flexion, because the hamstrings are paralysed in a hip-level lesion",
      "Normal ankle dorsiflexion, because the anterior compartment is spared in a hip-level lesion",
    ],
    correctAnswer: "Weak knee flexion, because the hamstrings are paralysed in a hip-level lesion",
    explanation:
      "A hip-level sciatic lesion paralyses the hamstrings as well as both divisions below the knee, so knee flexion is weak and plantarflexion is also lost. A common fibular lesion at the fibular neck spares the tibial division entirely, so plantarflexion, the sole and the ankle jerk all remain intact.",
    difficulty: "hard",
  },
  {
    slug: "gross-anatomy-i--lower-limb-vasculature--sba",
    concept: "lower-limb-vasculature",
    stem: "A patient has a blocked femoral artery, a palpable popliteal pulse and no foot pulse. What does the palpable popliteal pulse demonstrate?",
    options: [
      "That the popliteal artery is simply inflated by venous pressure from below",
      "That the collateral network around the hip and the knee has bridged the obstruction",
      "That the blockage is in the posterior tibial artery rather than the femoral artery",
      "That the popliteal artery is a branch of the obstructed femoral artery and cannot be palpated",
    ],
    correctAnswer: "That the collateral network around the hip and the knee has bridged the obstruction",
    explanation:
      "The popliteal artery lies distal to the blockage, so its pulse proves that blood is reaching that point by collateral routes — the cruciate anastomosis around the hip and the genicular ring around the knee. The ankle-brachial index then quantifies how much flow is actually arriving at the foot.",
    difficulty: "medium",
  },
  {
    slug: "gross-anatomy-i--pelvis-pelvic-floor--sba",
    concept: "pelvis-pelvic-floor",
    stem: "On vaginal examination an obstetrician measures the diagonal conjugate of the pelvic inlet. How is this related to the obstetric conjugate, and why is the diagonal the one measured?",
    options: [
      "The diagonal is about 1.5 cm shorter, and it is measured because the obstetric conjugate cannot be reached",
      "The diagonal is about 1.5 cm longer, and it is measured because the obstetric conjugate ends on a point that is not palpable",
      "The two are identical in length, but the diagonal is easier to name",
      "The diagonal is about 2 cm shorter, and it is measured because the obstetric conjugate reaches beyond the pelvic brim",
    ],
    correctAnswer:
      "The diagonal is about 1.5 cm longer, and it is measured because the obstetric conjugate ends on a point that is not palpable",
    explanation:
      "The diagonal conjugate runs from the sacral promontory to the inferior border of the pubic symphysis and is about 12.5 cm; the obstetric conjugate runs to the nearest bulging point on the posterior surface of the pubis and is about 11 cm. A gloved finger cannot reach that internal point, so the diagonal is measured and 1.5 cm subtracted.",
    difficulty: "hard",
  },
  {
    slug: "gross-anatomy-i--gait-biomechanics--sba",
    concept: "gait-biomechanics",
    stem: "A patient with a paralysed right superior gluteal nerve is observed walking. Which gait is produced, and in which direction does the trunk lurch?",
    options: [
      "A gluteus maximus gait, with the trunk thrust backwards at heel strike",
      "A Trendelenburg gait, with the trunk lurching towards the right stance leg",
      "A steppage gait, with the knee lifted high to clear the ground",
      "An antalgic gait, with the stance phase shortened on the right",
    ],
    correctAnswer: "A Trendelenburg gait, with the trunk lurching towards the right stance leg",
    explanation:
      "The right gluteus medius cannot hold the pelvis level, so the pelvis drops on the swing side when the right leg is off the ground. The trunk lurches towards the stance leg to bring the centre of gravity over the right hip and spare the failing abductor; the lurch is towards the side of the lesion.",
    difficulty: "medium",
  },
  {
    slug: "gross-anatomy-i--clinical-lower-limb-injury--sba",
    concept: "clinical-lower-limb-injury",
    stem: "A patient with a tibial fracture has escalating pain and is losing sensation in the first web space of the foot. Which compartment is compressed and what is the definitive treatment?",
    options: [
      "The posterior compartment, treated by elevating the limb and splitting the cast",
      "The lateral compartment, treated by observation until a pulse is lost",
      "The anterior compartment, treated by immediate fasciotomy",
      "The adductor canal, treated by releasing the saphenous nerve",
    ],
    correctAnswer: "The anterior compartment, treated by immediate fasciotomy",
    explanation:
      "Sensation in the first dorsal web space is the territory of the deep fibular nerve, which runs in the anterior compartment — the tightest compartment and the one lying against the subcutaneous tibia that fractures most often. Compartment syndrome is relieved only by surgically releasing the fascia over the compartment; the pulse disappears last and must never be waited for.",
    difficulty: "medium",
  },
];

// ---------------------------------------------------------------------------
// MODULE 2 — four further concepts authored in this round: lower-limb
// vasculature, pelvis and pelvic floor, gait biomechanics, and the closing
// clinical correlation on lower-limb injury.
//
// They are listed LAST in this array on purpose. CourseLesson ids are
// positional (\`\${courseId}-lesson-\${orderIndex + 1}\`), so inserting new
// lessons among the existing placeholder rows would re-point ids that already
// exist in the live database and silently move another lesson's content onto a
// row a learner may already have progress against. Appending keeps the re-seed
// purely additive. Module membership is carried by ConceptNode.moduleId, and
// the lesson page groups the spine by that field rather than by contiguity, so
// these concepts still teach in correct order inside Module 2.
// ---------------------------------------------------------------------------
const MODULE_TWO_EXTRA_LESSONS: LessonSeed[] = [
  { title: "Arterial supply & venous drainage of the lower limb", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Arterial supply and venous drainage of the lower limb", slug: "lower-limb-vasculature", summary: "The arterial line from external iliac to dorsalis pedis, the collateral rings around hip and knee, the great and small saphenous veins with the perforators, and the inguinal lymph node groups.", blooms: "understand", minutes: 40, prereq: ["femoral-triangle", "popliteal-fossa-leg"] }, content: lesson15() as never },
  { title: "The pelvic girdle, pelvic floor & perineum", module: 2, estimatedMinutes: 45, authored: true, concept: { title: "Pelvic girdle, pelvic floor and perineum", slug: "pelvis-pelvic-floor", summary: "The joints and ligaments of the pelvic ring, the obstetric diameters and their values, the pelvic diaphragm with the anorectal angle, and the urogenital and anal triangles.", blooms: "analyze", minutes: 45, prereq: ["lower-limb-skeleton"] }, content: lesson16() as never },
  { title: "Posture, gait & the biomechanics of walking", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Posture, gait and the biomechanics of walking", slug: "gait-biomechanics", summary: "The gait cycle and its phases, the three rockers of stance, the line of gravity at the hip, knee and ankle, the quadriceps angle, and the four classic abnormal gaits.", blooms: "apply", minutes: 35, prereq: ["lower-limb-joints", "gluteal-muscles"] }, content: lesson17() as never },
  { title: "Clinical correlation: joint injuries & compartment syndrome", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Clinical correlation: joint injuries and compartment syndrome", slug: "clinical-lower-limb-injury", summary: "The six Ps of compartment syndrome with fasciotomy, intracapsular against extracapsular hip fracture, the Thompson test for a ruptured Achilles tendon, and the Ottawa ankle rules.", blooms: "apply", minutes: 40, prereq: ["popliteal-fossa-leg", "lower-limb-joints"] }, content: lesson18() as never },
];

export async function seedMbbsAnatomy() {
  return seedMbbsCourse(ANATOMY);
}

export const ANATOMY: SubjectSeed = {
  id: "course-anatomy",
  existingSlug: "gross-anatomy-i",
  slug: "gross-anatomy-i",
  title: "Human Anatomy — Gross & Developmental",
  code: "ANAT 101",
  department: "Human Anatomy",
  level: 100,
  credits: 5,
  semester: "first",
  description:
    "Regional and systems anatomy taught in the sequence a clinician uses: positional terminology, the upper limb and thorax first, then the lower limb, abdomen, head and neck, neuroanatomy and embryology. Every region ends in the clinical signature its anatomy explains.",
  faculty: "basic-medical-sciences",
  modules: MODULES,
  lessons: [
    { title: "Anatomical position & planes of reference", module: 1, estimatedMinutes: 25, authored: true, concept: { title: "Anatomical position and planes of reference", slug: "anatomical-position-planes", summary: "The standard reference pose that makes every directional term unambiguous, the three cardinal planes, and the conventions by which CT and MRI images are viewed.", blooms: "remember", minutes: 25, prereq: [] }, content: lesson1() as never },
    { title: "Skeletal framework of the upper limb", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Skeletal framework of the upper limb", slug: "upper-limb-skeleton", summary: "The pectoral girdle, humerus, radius and ulna, carpals, metacarpals and phalanges, with the nerves injured at each named fracture site.", blooms: "understand", minutes: 35, prereq: ["anatomical-position-planes"] }, content: lesson2() as never },
    { title: "Muscles of the pectoral region", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Muscles of the pectoral region", slug: "pectoral-muscles", summary: "Pectoralis major and minor, serratus anterior and the intercostals; how insertion decides action; the intercostal neurovascular bundle; the muscles of breathing.", blooms: "understand", minutes: 35, prereq: ["upper-limb-skeleton"] }, content: lesson3() as never },
    { title: "Brachial plexus", module: 1, estimatedMinutes: 45, authored: true, concept: { title: "Brachial plexus", slug: "brachial-plexus", summary: "The five roots, three trunks, six divisions and three cords that reorganise the upper limb's nerve supply, and the five terminal branches each gives rise to.", blooms: "analyze", minutes: 45, prereq: ["pectoral-muscles"] }, content: lesson4() as never },
    { title: "Axilla and its contents", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Axilla and its contents", slug: "axilla-contents", summary: "The pyramid-shaped route between trunk and limb: its walls, the three parts of the axillary artery, and the axillary lymph nodes in their clinical levels.", blooms: "analyze", minutes: 40, prereq: ["brachial-plexus"] }, content: lesson5() as never },
    { title: "Thoracic wall and intercostal space", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Thoracic wall and intercostal space", slug: "thoracic-wall", summary: "The twelve ribs and their two vertebral joints, the intercostal spaces and bundle, and the four facts that hang off the sternal angle.", blooms: "understand", minutes: 40, prereq: ["anatomical-position-planes"] }, content: lesson6() as never },
    { title: "Mediastinum and pericardium", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Mediastinum and pericardium", slug: "mediastinum", summary: "The four mediastinal compartments and their contents, the pericardial sac and its sinuses, and the mechanics of cardiac tamponade.", blooms: "analyze", minutes: 40, prereq: ["thoracic-wall"] }, content: lesson7() as never },
    { title: "Clinical correlation: pneumothorax & nerve injuries", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Clinical correlation: pneumothorax and nerve injuries", slug: "clinical-pneumothorax-nerve-injuries", summary: "Simple, open and tension pneumothorax with their emergency management, and the consolidation of every upper-limb nerve injury into one table.", blooms: "apply", minutes: 40, prereq: ["mediastinum", "axilla-contents"] }, content: lesson8() as never },
    ...DEEPER_LESSONS,
    ...MODULE_TWO_EXTRA_LESSONS,
  ],
  sbas: [...MODULE_ONE_SBAS, ...MODULE_TWO_SBAS],
  prereqCourses: [],
};

/**
 * Idempotent: safe to run repeatedly. Upserts on stable keys, so re-running
 * updates the spine in place and never duplicates rows.
 */
export async function seedAnatomy(): Promise<void> {
  await seedMbbsAnatomy();
}

export default ANATOMY;

// CLI usage: npx ts-node prisma/seed-courses/mbbs/anatomy.ts
if (process.argv[1] && process.argv[1].includes("mbbs/anatomy")) {
  seedAnatomy()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

