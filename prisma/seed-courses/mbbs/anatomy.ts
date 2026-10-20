import { prisma, seedMbbsCourse, type LessonSeed, type SubjectSeed } from "./spine";

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
  { title: "Bones of the lower limb & hip bone", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Lower limb skeleton and the hip bone", slug: "lower-limb-skeleton", summary: "The hip bone (ilium, ischium, pubis), femur, patella, tibia and fibula, and the weight-bearing design of the joint line.", blooms: "understand", minutes: 40, prereq: ["upper-limb-skeleton"] }, content: { blocks: [] } },
  { title: "Gluteal region & hip abductors", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Gluteal muscles and hip abductors", slug: "gluteal-muscles", summary: "Gluteus maximus, medius, minimus and the small lateral rotators; the Trendelenburg test and the superior gluteal nerve.", blooms: "understand", minutes: 35, prereq: ["lower-limb-skeleton"] }, content: { blocks: [] } },
  { title: "Femoral triangle & adductor canal", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Femoral triangle and adductor canal", slug: "femoral-triangle", summary: "Boundaries, contents and the NAVEL order of the femoral canal; venous access, femoral hernia and adductor-canal contents.", blooms: "apply", minutes: 40, prereq: ["lower-limb-skeleton"] }, content: { blocks: [] } },
  { title: "Popliteal fossa, leg compartments & foot", module: 2, estimatedMinutes: 40, authored: false, concept: { title: "Popliteal fossa, leg compartments and the foot", slug: "popliteal-fossa-leg", summary: "The popliteal fossa; anterior, lateral and posterior compartments of the leg; the arches of the foot and common peroneal nerve injury.", blooms: "apply", minutes: 40, prereq: ["femoral-triangle"] }, content: { blocks: [] } },
  { title: "Knee & ankle joints", module: 2, estimatedMinutes: 35, authored: false, concept: { title: "Joints of the lower limb", slug: "lower-limb-joints", summary: "The knee as a compound synovial joint with menisci and cruciate ligaments; the ankle mortise and its ligamentous stability.", blooms: "analyze", minutes: 35, prereq: ["lower-limb-skeleton"] }, content: { blocks: [] } },
  { title: "Lumbosacral plexus & lower limb innervation", module: 2, estimatedMinutes: 45, authored: false, concept: { title: "Lumbosacral plexus", slug: "lumbosacral-plexus", summary: "The lumbar and sacral plexuses (L1-S4) and their branches to the lower limb, with the pattern of root lesions and sciatic nerve injury.", blooms: "analyze", minutes: 45, prereq: ["lower-limb-skeleton", "brachial-plexus"] }, content: { blocks: [] } },

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
  ],
  sbas: MODULE_ONE_SBAS,
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

