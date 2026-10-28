import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

// ---------------------------------------------------------------------------
// LESSON 1 — Fractures & dislocations (fully authored)
// ---------------------------------------------------------------------------
function lesson1() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a fracture and use the standard descriptors (site, pattern, displacement, open or closed) to describe one accurately; distinguish closed from open injury and say why the prefix 'compound' no longer belongs in the notes; list the common fracture patterns and the mechanisms that produce them; describe the classic deformity of shoulder and posterior hip dislocation and the nerves at risk in each; state the three aims of fracture management — reduce, hold, rehabilitate — and match each to the options you actually have; and recognise the immediately dangerous injuries that hide behind a broken bone.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Gross Anatomy I (bones, joints, peripheral nerves of the limbs) — you need the skeletal framework and the course of the radial, ulnar, median, axillary, sciatic and common fibular nerves. No prior clinical orthopaedics is assumed.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Fracture",
        text: "A break in the continuity of a bone. It is a loss of structural integrity, not merely a crack on a film: a bone fails when the load applied to it exceeds the strength of the tissue at that moment, which is why the same fall breaks a child's wrist and an elderly woman's hip.",
      },
      {
        type: "paragraph",
        text: "The single most useful reframing in orthopaedics is this: a fracture is a soft-tissue injury with a broken bone inside it. The bone is the part that shows on the radiograph and gets the name, but the pain, the blood loss, the swelling and the risk to the limb all come from the surrounding muscle, fascia, periosteum and vessels. That reframing explains almost every rule you are about to learn. It is why a swollen, tense limb is a surgical emergency rather than a reason to wait. It is why a long-bone fracture can lose two litres of blood into the thigh without a drop appearing outside. And it is why an open wound over a fracture is a contaminated injury treated as a wound first and a fracture second.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Fracture healing needs three things delivered to the fracture site: mechanical stability, an adequate blood supply, and apposition of viable bone ends (or a graft). Fail stability and you get a hypertrophic non-union; fail blood supply and you get a dry, atrophic non-union or avascular necrosis; fail apposition and the gap never bridges. Keep those three in mind and the whole of the next lesson follows.",
      },

      { type: "heading", level: 2, text: "How to describe a fracture properly" },
      {
        type: "paragraph",
        text: "A description is not administrative box-ticking — it is how the next surgeon, reading your note six hours later, reconstructs what you saw. Six descriptors are the minimum, and in examinations they are the marks.",
      },
      {
        type: "table",
        headers: ["Descriptor", "What you record", "Example"],
        rows: [
          ["Which bone", "Name the bone precisely, including side", "Left tibia"],
          ["Where in the bone", "Proximal, middle (shaft) or distal third — or the named anatomical part", "Distal third of the shaft"],
          ["Pattern", "Transverse, oblique, spiral, segmental, comminuted, impacted, compression (wedge/ crush), greenstick", "Oblique"],
          ["Displacement", "The position of the distal fragment: translation, angulation (and its direction), rotation, shortening or distraction", "Lateral angulation of 20°, 1 cm shortening"],
          ["Open or closed", "Whether the skin over or near the site is broken — and whether the fracture communicated with it", "Closed"],
          ["Joint involvement", "Whether the fracture enters a joint (intra-articular) — this changes the prognosis", "Extra-articular"],
        ],
      },
      {
        type: "paragraph",
        text: "Two refinements matter. Angulation is described by the direction the distal fragment points, or by the direction of the apex of the deformity — check which convention your unit uses, because the two give opposite words for the same picture. Rotation is not visible on a radiograph at all: it is found on clinical examination, by comparing the limb's rotational profile with the other side, and it is the deformity most often missed and least often forgiven, because a malunion in rotation cannot be corrected later by anything except deliberate re-fracture.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not write 'compound fracture'. The word is obsolete and imprecise. 'Open fracture' is the term: it means the fracture has communicated with the outside environment. That distinction is not pedantry — an open fracture is a surgical emergency requiring wound excision, antibiotics and tetanus cover, whatever the size of the wound.",
      },

      { type: "heading", level: 2, text: "Open fractures" },
      {
        type: "definition",
        term: "Open fracture",
        text: "A fracture in which the break in the bone has communicated with the external environment through a break in the skin. Graded by the Gustilo-Anderson system, which is a wound classification that drives treatment — not simply a description of size.",
      },
      {
        type: "table",
        headers: ["Grade", "Wound and soft-tissue injury", "Contamination", "Typical treatment"],
        rows: [
          ["I", "Clean wound under 1 cm, minimal soft-tissue damage, simple fracture pattern", "Minimal", "Wound excision, thorough debridement, IV antibiotics, stable fixation"],
          ["II", "Wound 1-10 cm, moderate soft-tissue injury, no extensive flap or avulsion", "Moderate", "As above, with closer soft-tissue assessment"],
          ["III", "Wound over 10 cm or high-energy injury with extensive soft-tissue damage whatever its size", "Heavy", "Debridement (often repeated), antibiotics, urgent orthopaedic and plastic input; fix or span depending on the zone of injury"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The open-fracture rules that are never negotiable: photograph and cover the wound with a saline-soaked dressing, give IV antibiotics and tetanus prophylaxis, take the patient to theatre for wound excision and debridement (usually within six hours), and never let a wound closed in the emergency department over a fracture. Never probe or irrigate a wound before the surgeon sees it — you can drive contamination deeper and destroy the tissue you need to assess.",
      },

      { type: "heading", level: 2, text: "Common patterns and how they are made" },
      {
        type: "paragraph",
        text: "The pattern on the film tells you the mechanism, and the mechanism tells you what else to look for. A transverse fracture from a direct blow looks nothing like a spiral fracture from a twisting injury, and the second one carries the added risk that the same rotary force tore a ligament somewhere else.",
      },
      {
        type: "table",
        headers: ["Pattern", "Mechanism", "Typical setting", "What to look for"],
        rows: [
          ["Transverse", "Direct blow, three-point bending", "Blunt trauma; a fall onto a hard edge", "Compartment syndrome; the other bone of the pair"],
          ["Oblique", "Angulation plus compression", "Fall from a height, motorcycle crash", "Adjacent bones and the joint above"],
          ["Spiral", "Torsional (rotational) force on a fixed foot", "Skiing, football tackle, a foot caught in a hole", "The child under walking age: non-accidental injury"],
          ["Comminuted", "High-energy direct force", "Road traffic collision, fall from height", "Chest, abdomen and pelvis — a triage problem"],
          ["Segmental", "A direct blow at a point where the bone is fixed at both ends", "Direct impact to a long bone", "The intervening fragment loses its blood supply"],
          ["Stress (fatigue)", "Repetitive submaximal load, normal bone", "Marching, running, the second metatarsal", "Normal early films; MRI or bone scan"],
          ["Pathological", "Trivial force through diseased bone", "Metastasis, myeloma, osteoporosis, a simple cyst", "The underlying disease — the fracture is the symptom"],
          ["Greenstick", "Bending of pliable paediatric bone; one cortex breaks, the other buckles", "Falls in young children", "Plastic deformation: the bone bends without any visible crack"],
        ],
      },
      {
        type: "example",
        text: "A two-month-old is brought in with a crying, swollen thigh, and the film shows a spiral fracture of the femoral shaft. In an infant who is not yet walking there is no mechanism for this — a fall from a surface cannot spin a femur. A spiral long-bone fracture in a non-ambulant child remains one of the classic sentinel injuries of physical abuse, and it triggers a safeguarding referral and a skeletal survey in a centre equipped for it, alongside the obvious differential of osteogenesis imperfecta.",
      },

      { type: "heading", level: 2, text: "Dislocations and fracture-dislocations" },
      {
        type: "definition",
        term: "Dislocation",
        text: "Complete loss of congruity between the two articular surfaces of a joint, so that the joint surfaces no longer contact each other at all. A subluxation is a partial loss, where some contact remains, and a fracture-dislocation is a dislocation that has taken a piece of bone with it.",
      },
      {
        type: "paragraph",
        text: "A dislocated joint is an emergency for one reason that has nothing to do with the joint: the structures that cross it — nerves, and in some joints the artery — are stretched over the displaced bone. Reduction relieves that stretch, and every minute counts, because a nerve compressed for a day behaves differently from a nerve stretched for an hour.",
      },
      {
        type: "table",
        headers: ["Joint", "Mechanism", "Deformity", "Structure at risk", "The tell-tale sign"],
        rows: [
          ["Shoulder (anterior, subcoracoid)", "Abduction, external rotation and extension — a fall or a tackle", "Loss of the rounded shoulder contour; the arm held slightly abducted", "Axillary nerve (and the posterior humeral circumflex artery)", "Numb over the regimental badge patch; deltoid cannot contract"],
          ["Hip (posterior)", "Dashboard injury — a flexed knee hits the dashboard", "Limb shortened, adducted, internally rotated", "Sciatic nerve, especially its common fibular division", "Foot drop; 10-20% of posterior dislocations injure the nerve"],
          ["Knee (posterior)", "Dashboard injury with a hyperextension force", "Fixed flexion, gross deformity", "Popliteal artery — a limb-threatening injury", "Distal pulses, capillary refill, and a CT angiogram if any doubt"],
          ["Elbow (posterior)", "Fall onto an outstretched hand with the elbow extended", "Swollen, fixed elbow; the olecranon prominent", "Brachial artery and the median, ulnar and radial nerves", "Hand perfusion and each nerve's territory and movement"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A posterior hip dislocation with absent foot pulses or a sciatic palsy must be reduced as an emergency, ideally under general anaesthesia within six hours. The reason is the blood supply: the retinacular vessels that climb the femoral neck are kinked by the displaced head, and every hour of displacement converts another proportion of patients onto the avascular-necrosis pathway.",
      },
      {
        type: "question",
        prompt: "A 70-year-old woman falls on her outstretched right hand and cannot use the arm. On examination the shoulder contour is flattened and there is a patch of numbness over the regimental badge area. What has happened, and what will you find on testing?",
        answer: "An anterior (subcoracoid) dislocation of the shoulder, which has injured the axillary nerve. Testing will show no contraction of the deltoid against resistance, and loss of sensation over the badge patch, because the axillary nerve supplies both.",
        explanation: "The axillary nerve winds around the surgical neck of the humerus posteriorly and is tethered there, so a head displaced anteriorly and inferiorly stretches it directly. The nerve is also at risk in any fracture of the surgical neck, which is why the same two tests — contraction and sensation — are asked for in both injuries.",
      },

      { type: "heading", level: 2, text: "Examining a suspected fracture" },
      {
        type: "paragraph",
        text: "The examination answers four questions in order, and the order matters. You look before you touch, and you feel before you move, because the movement is where you can do the damage.",
      },
      {
        type: "table",
        headers: ["Step", "What you do", "What it tells you"],
        rows: [
          ["Look", "Expose both limbs fully; compare with the other side", "Deformity, swelling, bruising, wounds, colour, and the rotational profile that a film cannot show"],
          ["Feel", "Palpate gently from the periphery inwards, then the pulses", "Warmth, capillary refill, and the point of maximal tenderness — which localises the fracture better than the radiograph"],
          ["Move", "Active movement first, then gentle passive; never force a deformity", "Whether the patient can use the limb, and the tendon and nerve function you must document"],
          ["Neurovascular", "Name each nerve's motor and sensory territory and test it; palpate the pulses", "The record that protects the limb: it is the baseline against which a later deterioration is judged"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The first examination you do is a baseline, not a diagnosis. A limb documented as having intact sensation in the first dorsal web space, normal extension of the wrist and fingers, and a palpable dorsalis pedis pulse at 09:00 gives the next clinician something to compare against at 21:00. An unrecorded limb gives them nothing, and the diagnosis of compartment syndrome is then argued from memory.",
      },

      { type: "heading", level: 2, text: "Management: reduce, hold, rehabilitate" },
      {
        type: "paragraph",
        text: "Every fracture treatment, from a buddy-strapped finger to a pelvic fixator, answers the same three questions in the same order. Nothing else in this subject is needed to organise your thinking on the ward.",
      },
      {
        type: "table",
        headers: ["Aim", "What it means", "How it is achieved", "When it is wrong"],
        rows: [
          ["Reduce", "Restore length, alignment and rotation; restore the joint surface if the fracture enters it", "Closed manipulation under anaesthesia; open reduction; or no reduction at all for an acceptable position", "Surgery to a position you could have reached with a cast — exposing the patient to the risks of an operation for no gain"],
          ["Hold", "Keep the reduction until the bone heals", "Cast or slab; sling; traction; external fixator; internal fixation (plate, screw, wire, intramedullary nail)", "A fixation that is too stiff to allow the micro-movement that drives callus, or a cast that is not split in a swelling limb"],
          ["Rehabilitate", "Bring back the joints, the muscles and the patient's function", "Early joint movement and physiotherapy, walking aids, graded return to load, occupational therapy", "Immobilising the joint that is not broken — the commonest cause of a stiff limb after a healed fracture"],
        ],
      },
      {
        type: "paragraph",
        text: "The decision to operate is not a decision to treat better; it is a decision that the position cannot be reached or held by closed means, or that the joint surface is stepped, or that early movement of the joint is worth an operation. Absolute indications for internal fixation are the ones where the outcome is predictably unacceptable without it: open fractures, intra-articular fractures with a step in the joint surface, displaced fractures of the femoral neck and of the scaphoid, and fractures with an associated vascular injury.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The word 'acceptable' is doing enormous work in that table. A fracture of the shaft of the humerus with 15° of angulation and full overlap heals into a perfectly functionable arm — the shoulder is a ball joint that compensates. The same 15° of angulation in the tibia, where the bone lies directly under the skin and the ankle is a hinge, is an unacceptable malunion. Acceptability is decided by the bone, the joint above, the joint below, and the patient's demands — never by a universal number.",
      },
      {
        type: "theory",
        prompt: "Why does a diaphyseal fracture of the radius and ulna in an adult usually need operative fixation while a closed fracture of the humeral shaft usually does not, when both are shaft fractures of upper-limb long bones?",
        modelAnswer: "Forearm rotation depends on the radius and ulna staying straight and maintaining their exact relative length and curvature; even a modest angulation or rotational malunion blocks pronation and supination, because the bowed radius cannot rotate about the straight ulna. The humerus, by contrast, is encased in a large muscle envelope and sits between two very mobile joints — the shoulder can be raised and the trunk leaned to hide residual angulation, and shortening is invisible. So the same radiographic deformity has a functional consequence in the forearm and almost none in the humerus.",
        explanation: "This is the principle behind the concept of acceptable reduction: the tolerance for deformity is set by the function the bone serves, not by the degree of the angulation alone.",
      },

      { type: "heading", level: 2, text: "The five complications that must not be missed" },
      {
        type: "table",
        headers: ["Complication", "How it presents", "What is lost by waiting"],
        rows: [
          ["Compartment syndrome", "Pain out of proportion, pain on passive stretch, tense swelling, paraesthesia — pulses late", "Irreversible muscle necrosis within hours, myoglobinuric renal failure, Volkmann's contracture"],
          ["Vascular injury", "Absent pulse, pallor, cold limb, expanding haematoma, bruit", "Limb ischaemia: irreversible damage after roughly six hours of warm ischaemia"],
          ["Nerve injury", "Numbness in a named territory, or a lost movement", "The distinction neuropraxia versus axonotmesis versus neurotmesis, which is only examinable at the time of injury"],
          ["Open fracture contamination", "A wound near or over the fracture", "Established deep infection of bone; a wound closed over a fracture is the classic error"],
          ["Deep vein thrombosis", "Calf pain and swelling, low-grade fever after admission", "Pulmonary embolism — the commonest cause of preventable death after hip fracture"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never accept a pulse as evidence that there is no compartment syndrome. Intracompartmental pressure rises from below the systolic at which the pulse disappears; the pulse is the last thing to go, and it usually vanishes only after the muscle is already dead. The five clinical Ps — pain (especially on passive stretch), pallor, paraesthesia, paralysis and pulselessness — are useful, but the first two are the ones you act on.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Describing a fracture only by its pattern. 'Spiral fracture of the tibia' is not a description; 'closed spiral fracture of the distal third of the left tibial shaft with 20° lateral angulation and no joint involvement' is. The pattern is one of six descriptors, and in a written answer the other five are where the marks are.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming a small wound over a fracture means a small injury. An open fracture grade is determined by the energy and the soft-tissue damage, not by the size of the hole in the skin — a 1.5 cm puncture wound over a grossly comminuted tibial fracture from a bumper is a grade III injury, whatever it looks like.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Moving a grossly deformed limb to 'test the joint' before the radiograph or the nerve exam. You can convert a closed fracture into an open one, and you can convert a recovering nerve injury into a permanent one. The rule is look, feel, move — in that order, and gently.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to examine the joint above and below the fracture. A transverse fracture of the tibial shaft from a twisting injury has usually torn a knee or ankle ligament in the same accident, and a fracture of the calcaneus has usually broken a lumbar vertebra. Fractures travel.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is the description 'comminuted fracture' insufficient, and what is the minimum you should record?",
        answer: "'Comminuted' only names the pattern. You should record which bone and side, which third of the bone, the pattern, the displacement (angulation, rotation, shortening, translation), whether it is open or closed, and whether it enters a joint.",
        explanation: "A description is a reconstruction for the next clinician: it must let them picture the injury without seeing the film, and the pattern alone does not do that.",
      },
      {
        type: "question",
        prompt: "A patient has an anterior dislocation of the shoulder. What is the specific nerve you must test, what motor and sensory findings its injury produces, and why this joint in particular?",
        answer: "The axillary nerve. Motor: the deltoid cannot abduct the shoulder from a resting position. Sensory: numbness over the regimental badge patch on the lateral shoulder. The shoulder is the joint most frequently dislocated and the axillary nerve is tethered around the surgical neck of the humerus as the head leaves its socket, so it is the structure that is stretched.",
        explanation: "Test the nerve at the time of injury: axillary nerve function before reduction, and again immediately after, is the only way to know whether the nerve was injured by the dislocation or by your reduction.",
      },
      {
        type: "question",
        prompt: "A fracture is described as 'unacceptably displaced'. Who decides what is unacceptable, and on what grounds?",
        answer: "The treating surgeon decides, on functional grounds for that bone in that patient: the bone's normal role (rotation of the forearm versus a strut), the range of the joints above and below that can compensate, the patient's age and demands, and whether the fracture is intra-articular. There is no universal angulation threshold.",
        explanation: "Acceptable reduction is a functional judgement, which is why the same 15° of angulation is a good result in the humeral shaft and an unacceptable malunion in the tibia.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A restrained passenger in a head-on collision has a hip held in flexion, adduction and internal rotation. Which nerve is most at risk, and what deficit would its injury produce?",
        options: [
          "The femoral nerve, with weak knee extension and numbness over the medial leg",
          "The obturator nerve, with weak hip adduction and numbness over the medial thigh",
          "The sciatic nerve, with foot drop and numbness on the dorsum of the foot",
          "The superior gluteal nerve, with a Trendelenburg lurch towards that side",
        ],
        correctIndex: 2,
        explanation: "This is a posterior hip dislocation from a dashboard injury; the femoral head sits behind and below the acetabulum and stretches the sciatic nerve that runs directly behind the hip. Around 10-20% injure the nerve, most often the common fibular division, giving foot drop. Urgent closed reduction protects both the nerve and the femoral head's blood supply.",
      },
      {
        type: "mcq",
        stem: "Which of the following is the correct description of an open fracture?",
        options: [
          "A fracture in which the bone is visible in the wound",
          "A fracture in which the break in the bone communicates with the outside environment",
          "A fracture with a wound anywhere on the same limb",
          "A fracture produced by a high-energy mechanism, whether or not the skin is broken",
        ],
        correctIndex: 1,
        explanation: "An open (formerly 'compound') fracture is defined by communication between the fracture haematoma and the exterior — the wound may be a puncture no larger than a tooth. The definition drives the emergency treatment of wound excision, antibiotics and tetanus cover, and the energy mechanism is graded separately.",
      },
      {
        type: "mcq",
        stem: "A patient has a fracture but a palpable distal pulse. Which statement about compartment syndrome is correct?",
        options: [
          "A palpable pulse excludes compartment syndrome and observation is safe",
          "Pulselessness is the final sign, so its absence is not reassuring and early clinical signs should be acted on",
          "The diagnosis requires an intracompartmental pressure above 30 mmHg in every patient before acting",
          "Elevating the limb above the heart is the first step in management",
        ],
        correctIndex: 1,
        explanation: "Compartment syndrome is a clinical diagnosis on pain out of proportion, pain on passive stretch and a tense compartment; the pulse is the last casualty of rising pressure. Pressure measurement is only used when the clinical examination is unreliable. Definitive treatment is urgent fasciotomy, with the limb held at heart level rather than elevated.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Fracture healing & complications (fully authored)
// ---------------------------------------------------------------------------
function lesson2() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the stages of fracture healing and the difference between primary (direct) and secondary (callus) healing; define delayed union, non-union and malunion, give a time threshold for each, and list the causes you can actually influence; list the local and systemic complications of fracture; recognise acute compartment syndrome clinically, name the six Ps, and say why fasciotomy is the only definitive treatment; explain the mechanism and timing of fat embolism syndrome; and describe avascular necrosis, Volkmann's ischaemic contracture and myositis ossificans.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Fractures & dislocations): the descriptors, the open-fracture rules and the five complications that must not be missed. You should also recall from Gross Anatomy I the blood supply of the femoral head and the compartments of the leg.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Secondary (callus) bone healing",
        text: "The natural healing of a fracture by formation of a bridging callus of woven bone around the fracture site, which is later remodelled into lamellar bone. It requires motion at the fracture site and is the mechanism by which a limb in a cast heals.",
      },
      {
        type: "paragraph",
        text: "Bone is the one tissue in the body that heals by forming scar tissue and then replacing it with exactly the tissue that was there — no fibrosis, no loss of architecture. That is remarkable, and it happens because bone has a two-part system: the hard tissue does the mechanical work, and the living cells on every internal and external surface keep measuring load and rebuilding the tissue accordingly. When you break a bone, you unleash the mesenchymal stem cells of the periosteum and endosteum, and they lay down woven bone as quickly and as strongly as the local strain allows.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The three requirements for healing, again: mechanical stability, adequate blood supply, and contact between viable bone surfaces. Everything in this lesson is a failure of one of those three, or a complication of the force that caused the fracture. Diagnose which of the three failed and you have diagnosed why the bone did not join.",
      },

      { type: "heading", level: 2, text: "The stages of healing" },
      {
        type: "paragraph",
        text: "Healing is continuous, but it is worth naming the stages because each has a clinical signature on the radiograph and in the room.",
      },
      {
        type: "table",
        headers: ["Stage", "Timing", "What is happening", "What you see"],
        rows: [
          ["Impact", "Immediate", "Cells at the fracture site die; the haematoma forms and organises", "A radiolucent line that looks wider than it was on day one"],
          ["Inflammation", "First 48 hours to ~2 weeks", "Haematoma organisation, vascular ingrowth, inflammatory cells clear debris", "Soft-tissue swelling; bony change is not yet visible"],
          ["Repair (soft then hard callus)", "~2 weeks to ~3 months", "Periosteal and endosteal cells lay down cartilage and then woven bone, bridging the gap", "Fuzzy periosteal new bone and a visible callus cuff on serial films"],
          ["Remodelling", "Months to years", "Woven bone is replaced by lamellar bone along the lines of stress; the medulla is re-established", "The fracture line becomes indistinct and the bone resumes its normal contour"],
        ],
      },
      {
        type: "paragraph",
        text: "Two points on timing that are examinable. A fracture is 'sticky' at around six to eight weeks, when clinical union is declared — no pain on loading, no movement at the site, no tenderness. Radiographic union lags behind clinical union by weeks, and remodelling continues for a year or more. That gap is why a child with a broken wrist is told to remove the cast at six weeks even though the film still shows the line clearly.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Children heal faster (roughly half the adult time), the elderly heal more slowly, and healing at the metaphysis — with its rich blood supply and cancellous bone — is far faster than healing at the mid-diaphysis, where the cortical bone is dense and the blood supply is segmental. That is why a mid-shaft scaphoid or tibial fracture is a therapeutic headache while a Colles' fracture is not.",
      },

      { type: "heading", level: 2, text: "Primary versus secondary healing" },
      {
        type: "definition",
        term: "Primary (direct) bone healing",
        text: "Healing across a fracture that has been rigidly fixed in direct contact, with no callus formation: osteoclasts cut across the fracture line ('cutting cones') and new bone is laid directly behind them, and Haversian systems are re-established across the gap.",
      },
      {
        type: "table",
        headers: ["", "Primary (direct) healing", "Secondary (callus) healing"],
        rows: [
          ["How it is achieved", "Rigid internal fixation with absolute stability and anatomical contact", "Plaster, splint, cast, or a less rigid construct that permits controlled micro-motion"],
          ["What forms", "No callus; the gap is crossed by cutting cones and new Haversian bone", "A cuff of woven callus around and across the fracture"],
          ["Speed of radiographic union", "Slower to show on a film — there is no callus to see", "Faster to show, because the callus is visible"],
          ["Where you want it", "Intra-articular fractures, where a step in the joint surface must be abolished", "Diaphyseal fractures of long bones in a cast"],
          ["What failure looks like", "A persistent radiolucent line, or a broken plate with no callus (instability)", "A hypertrophic, 'elephant's foot' non-union (instability with movement)"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The counter-intuitive exam answer: a fracture fixed with a plate and screws that is 'perfectly' rigid may show no callus at all at six weeks and yet be healed, while a fracture in a cast shows a large callus and is still not load-bearing. Callus is not the only proof of union — its absence under rigid fixation is expected.",
      },

      { type: "heading", level: 2, text: "Delayed union, non-union and malunion" },
      {
        type: "definition",
        term: "Delayed union",
        text: "A fracture that has failed to unite within the time expected for its site and patient, but is still capable of doing so with more time or with correction of the mechanical or biological fault.",
      },
      {
        type: "definition",
        term: "Non-union",
        text: "A fracture at which the healing process has ceased completely, with no further clinical or radiographic evidence of progress. Classified biologically as hypertrophic (viable, 'elephant's foot' ends with instability) or atrophic (inert, dry, rounded ends with no biology).",
      },
      {
        type: "definition",
        term: "Malunion",
        text: "A fracture that has healed in a position that is outside the functional tolerance for that bone — angulated, rotated, shortened or translated — and which consequently produces a functional problem.",
      },
      {
        type: "table",
        headers: ["Diagnosis", "Definition", "Commonest causes", "Treatment principle"],
        rows: [
          ["Delayed union", "No union by the expected time, but the site is still biologically active", "Inadequate immobilisation, distraction of the fragments, poor blood supply, smoking, infection", "Continue immobilisation and remove the cause — most will unite"],
          ["Non-union (hypertrophic)", "Healing has stopped; the ends are sclerotic and flared, with no bridging bone", "Excessive motion or distraction — a biology that is fine but mechanics that are not", "Provide stability (exchange nailing or plate) — often no bone graft is needed"],
          ["Non-union (atrophic)", "Healing has stopped; the ends are rounded, osteoporotic and dry", "Loss of blood supply, a gap, infection, poor soft-tissue cover", "Biological stimulation — open reduction, bone graft, and stable fixation"],
          ["Malunion", "Healed in a functionally unacceptable position", "Reduction never achieved, reduction lost, or the fracture was never immobilised properly", "Osteotomy to correct the deformity if the functional loss justifies it; cosmetic correction in children rarely indicated"],
        ],
      },
      {
        type: "example",
        text: "A 34-year-old has a tibial shaft fracture nailed eleven months ago. The knee is comfortable, there is no pain on walking, but the fracture line is still clearly visible with sclerotic, slightly flared ends and no callus. This is a hypertrophic non-union: the biology is intact (which is why there is callus attempting to form) but the mechanics are wrong — the nail is not providing enough stability. The treatment is exchange nailing to a larger-diameter nail. Add bone graft and you have operated for no biological reason; add electrical stimulation alone and the construct will still move.",
      },
      {
        type: "question",
        prompt: "Why does a fracture with a large gap (for example after a segmental fracture, or after a badly displaced comminuted fracture) fail to unite even with perfect fixation?",
        answer: "Because healing requires apposition of viable bone surfaces across a distance that bone can bridge. Beyond a critical gap, the regenerative tissue cannot span it, so a non-union results no matter how rigid the fixation. Treatment is to reduce the gap — by open reduction, or by bone grafting to fill it.",
        explanation: "This is the third of the three requirements: mechanical stability and blood supply are not enough. A patient with a large bone defect needs biological reconstruction, not only a longer plate.",
      },

      { type: "heading", level: 2, text: "Local complications" },
      {
        type: "paragraph",
        text: "Local complications are the ones that affect the limb: they are the reason a broken bone in a skilled pair of hands can still cost a patient the use of their arm.",
      },
      {
        type: "table",
        headers: ["Complication", "Mechanism", "Typical site", "The clinical lesson"],
        rows: [
          ["Avascular necrosis", "Interruption of the bone's blood supply; the dead bone collapses and later shows as increased density", "Femoral head after intracapsular neck fracture or posterior hip dislocation; scaphoid proximal pole; talus", "Displaced intracapsular hip fractures are replaced, not fixed — the head cannot survive"],
          ["Volkmann's ischaemic contracture", "Muscle necrosis after untreated compartment syndrome; the dead muscle is replaced by fibrosis that contracts", "Flexor compartment of the forearm after a supracondylar fracture; the calf", "Fasciotomy done late prevents the contracture but the muscle is already necrotic — so act early"],
          ["Myositis ossificans", "Heterotopic bone forming in muscle after trauma or surgery, or after forceful reduction", "Elbow (posterior), thigh, hip", "Do not forcibly manipulate an elbow repeatedly; reserve surgery until the mass is mature and alkaline phosphatase has fallen"],
          ["Joint stiffness", "Immobilising the joint that was not broken; adhesion formation", "Knee, elbow, shoulder, hand", "Stiffness is prevented by early movement of the uninjured joints, not by cautious waiting"],
          ["Complex regional pain syndrome", "Disproportionate, burning pain with swelling, sweating and colour change after injury", "Distal limb, often after a Colles' fracture or distal radius surgery", "Recognise early; the treatment is analgesia, graded desensitisation and active movement, not rest"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Avascular necrosis of the femoral head is the classic late sequela of an intracapsular fracture of the neck of femur. The retinacular vessels that supply the head climb the femoral neck from the circumflex femoral arteries, and an intracapsular fracture tears them, while the intra-articular haematoma tamponades them further. Extracapsular fractures lie outside the capsule and leave those vessels intact, which is why the two are treated by entirely different operations.",
      },

      { type: "heading", level: 2, text: "Compartment syndrome" },
      {
        type: "definition",
        term: "Compartment syndrome",
        text: "A rise in pressure within an unyielding osteofascial compartment that falls below the perfusion pressure of the tissue within it, causing ischaemia and, untreated, necrosis of muscle and nerve. It is a surgical emergency.",
      },
      {
        type: "paragraph",
        text: "The mechanism is a closed loop. Bone bleeding or swelling raises the pressure inside a compartment whose walls are bone, interosseous membrane and inelastic fascia. As pressure rises, the thin-walled veins compress first, so venous outflow stops and capillary pressure rises, which adds more oedema, which raises the pressure further. Arterial inflow continues until the pressure approaches the arterial pressure, so the limb keeps its pulse until very late — and the tissue dies while the pulse is still there.",
      },
      {
        type: "table",
        headers: ["The six Ps", "Significance"],
        rows: [
          ["Pain (out of proportion to the injury)", "The earliest and most reliable sign — especially pain on passive stretch of the muscle that runs through the compartment"],
          ["Pallor", "A late sign; the limb may look normal for hours"],
          ["Paraesthesia", "Nerve ischaemia; the first web space of the foot for the anterior compartment, the sole for the posterior"],
          ["Paralysis", "Late; by the time the muscle cannot move, it is already necrotic"],
          ["Pulselessness", "The very last sign — waiting for it costs the limb"],
          ["Perishing cold / poikilothermia", "A terminal sign; the limb has lost its perfusion"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treatment is immediate fasciotomy of every compartment involved, after splitting any cast or dressing that is constricting the limb and removing circumferential dressings. Do not elevate the limb above the heart (it lowers the perfusion pressure), do not apply ice, and do not wait for a pressure measurement when the clinical diagnosis is clear. Pressure monitoring is only for the patient whose examination you cannot trust — the sedated, the head-injured, the child.",
      },
      {
        type: "theory",
        prompt: "A patient has a tibial shaft fracture in a plaster and develops severe pain, numbness in the first web space of the foot and pain on dorsiflexion of the toes. Why is the first dorsal web space the sign you are told to look for, and what does it tell you about which compartment is involved?",
        modelAnswer: "Sensation in the first dorsal web space is the territory of the deep fibular nerve, which lies in the anterior compartment of the leg. Pain on passive dorsiflexion of the toes stretches the muscles of that same compartment, the anterior compartment is bounded by the two bones of the leg, the interosseous membrane and the deep fascia, and it lies directly against the subcutaneous surface of the tibia — the commonest fracture site. So the two findings together identify the compartment that is both commonest to fracture and commonest to develop the syndrome. The leg has four compartments (anterior, lateral, superficial posterior, deep posterior), and treatment requires decompression of all four.",
        explanation: "Naming the nerve territory converts a vague symptom into an anatomical localisation, and the same trick works for the posterior compartment (the sole, from the tibial nerve) and the lateral compartment (dorsum and lateral border, from the superficial fibular nerve).",
      },

      { type: "heading", level: 2, text: "Systemic complications" },
      {
        type: "table",
        headers: ["Complication", "Mechanism", "Timing", "Recognition"],
        rows: [
          ["Hypovolaemic shock", "Blood loss into the tissues; a femur can lose 1.5-2 L, a pelvis 2-3 L or more", "Immediate", "The blood loss is hidden — look at the fracture, not the wound"],
          ["Fat embolism syndrome", "Fat droplets and marrow content enter the venous circulation after long-bone or pelvic trauma, causing a systemic inflammatory and mechanical lung injury", "24-72 hours after injury (not immediately)", "The triad: respiratory distress with hypoxaemia, petechiae over the chest and axillae, and cerebral signs; plus tachycardia and fever"],
          ["Deep vein thrombosis and pulmonary embolism", "Stasis, immobility and the prothrombotic response to trauma", "Days to weeks; after hip fracture from the first day", "Prophylaxis is mandatory: low-molecular-weight heparin, early mobilisation, mechanical compression"],
          ["Sepsis", "Open fracture contamination, or conversion of closed to open", "Any time; the first exposure is at injury", "Prophylactic antibiotics, wound excision, tetanus cover"],
          ["Crush syndrome / rhabdomyolysis", "Muscle necrosis releasing myoglobin and potassium", "After prolonged entrapment or late fasciotomy", "Hyperkalaemia, myoglobinuric renal failure — a medical, not a surgical, problem"],
          ["Tetanus / gas gangrene", "Contamination with Clostridium tetani or Clostridium perfringens", "Days after injury", "Tetanus prophylaxis for every open wound; this is not optional"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The classic exam patient for fat embolism is a young man with a femoral shaft fracture who was well on admission, and 36 hours later becomes confused, tachypnoeic and hypoxic, with petechiae on his chest, axillae and conjunctivae. The petechiae are the discriminating sign, and the treatment is supportive: oxygen, ventilation if needed, and careful fluid resuscitation. Early and stable fixation of the long-bone fracture reduces the incidence.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling a 4-month-old fracture 'delayed' when it is a non-union. Delayed union is still biologically active — it has not stopped, it is merely slow. Non-union means the healing process has ceased: no radiographic progress on two consecutive films at least 4-6 weeks apart, and no clinical change. The distinction matters because one is treated by waiting and the other by surgery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a hypertrophic non-union with bone graft. A hypertrophic non-union has abundant biology attempting to bridge the gap and failing because the construct moves. The treatment is stability — exchange nailing or a better plate. Bone graft is for the atrophic non-union, where the biology has run out. Grafting a mobile non-union is operating for the wrong reason.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Watching a compartment syndrome until the pulse disappears. The pulse disappears at pressures above arterial systolic, by which time both nerve and muscle are necrotic. The investigation to act on is pain on passive stretch with a tense compartment — the pulse is only useful for confirming a vascular injury, not for excluding a compartment syndrome.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Immobilising the joints above and below a fracture and then being surprised when they are stiff. The joint that was not broken should be moved from day one — fingers in a forearm plaster, the shoulder in a humeral cast, the ankle and knee in a tibial cast. Stiffness is a complication of treatment, and it is the one you are personally responsible for.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the definitions of delayed union, non-union and malunion, with the time threshold for the first two.",
        answer: "Delayed union: failure to unite within the expected time for the site and patient, but the process is still active and will progress if the fault is corrected — generally no union at 3-6 months in a long bone of an adult. Non-union: the healing process has ceased, with no radiographic progress on two serial films at least 4-6 weeks apart and no clinical sign of union — usually declared at 6-9 months. Malunion: the fracture has healed, but in a position outside the functional tolerance for that bone.",
        explanation: "The three are points on one axis of failure — not healed, not healed yet, and healed badly. Only the middle one is a race against the patient's expectations that needs a plan.",
      },
      {
        type: "question",
        prompt: "Why does an intracapsular fracture of the femoral neck risk avascular necrosis of the head, while an extracapsular (intertrochanteric) fracture does not?",
        answer: "The femoral head is supplied by retinacular branches of the medial and lateral circumflex femoral arteries that run up the femoral neck beneath the synovial reflection. An intracapsular fracture tears these vessels and the intracapsular haematoma tamponades them, so the head becomes avascular. An extracapsular fracture lies outside the capsule, so the retinacular vessels escape, and the head keeps its blood supply.",
        explanation: "This single anatomical fact decides the operation: intracapsular fractures in the elderly are replaced (hemiarthroplasty), while extracapsular fractures are fixed with a plate and screw.",
      },
      {
        type: "question",
        prompt: "What is the single most important clinical sign that should prompt you to call for an urgent fasciotomy, and why is a palpable pulse not reassuring?",
        answer: "Pain out of proportion to the injury, and especially pain on passive stretch of the muscles running through the tense compartment. A palpable pulse is not reassuring because arterial inflow continues until the compartment pressure approaches arterial systolic, by which point the muscle and nerve within the compartment have already been ischaemic for hours and are necrotic.",
        explanation: "The pulse is the last of the six Ps to vanish. The diagnosis is clinical, made from pain on passive stretch and compartments tense to touch, and the treatment is decompression within hours.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Eight hours after nailing of a tibial shaft fracture a patient has pain out of proportion, pain on passive stretch of the toes, paraesthesia and a tense calf. The pulses are present and capillary refill is brisk. What is the correct immediate management?",
        options: [
          "Elevate the limb above the level of the heart and review in the morning",
          "Increase analgesia, keep the leg elevated on pillows and observe overnight",
          "Split the cast, dressings and any constricting bandage, and arrange an urgent four-compartment fasciotomy",
          "Measure the intracompartmental pressure and wait until it exceeds the arterial diastolic pressure before operating",
        ],
        correctIndex: 2,
        explanation: "This is acute compartment syndrome, diagnosed clinically. Treatment is removal of all constricting dressings and immediate fasciotomy of all four compartments of the leg. The limb must be kept at heart level, not elevated, and pressure measurement is only for patients whose examination cannot be trusted. Presence of pulses is expected and is falsely reassuring.",
      },
      {
        type: "mcq",
        stem: "A tibial fracture fixed with a plate eleven months ago still shows a clear fracture line with sclerotic, slightly flared bone ends and no bridging callus. Which is the most appropriate treatment?",
        options: [
          "Bone grafting of the non-union site alone, because the gap has no callus",
          "Exchange of the fixation for a more stable construct, because the biology is intact and the mechanics are not",
          "Continued immobilisation in a below-knee cast for a further three months",
          "Electrical stimulation of the fracture site without changing the fixation",
        ],
        correctIndex: 1,
        explanation: "Flared, sclerotic ends attempting to bridge the gap describe a hypertrophic non-union: the biology is viable and the failure is mechanical instability. The treatment is to provide stability — exchange nailing or revision plating. Grafting, waiting or stimulation all address the biology, which is not the problem.",
      },
      {
        type: "mcq",
        stem: "A 22-year-old with a femoral shaft fracture is comfortable on admission, and 36 hours later becomes tachypnoeic, hypoxic and confused, with petechiae over the chest, axillae and conjunctivae. Which complication has occurred?",
        options: [
          "Hypovolaemic shock from ongoing bleeding into the thigh",
          "Fat embolism syndrome",
          "Post-traumatic sepsis with septic emboli",
          "Tension pneumothorax from a rib fracture sustained in the same accident",
        ],
        correctIndex: 1,
        explanation: "The 24-72 hour delay distinguishes fat embolism from shock, which is immediate, and the triad of respiratory distress, petechiae and cerebral signs is characteristic. The mechanism is marrow fat and venous embolisation with a systemic inflammatory response after long-bone trauma; early and stable fixation of the fracture reduces its incidence. Treatment is supportive respiratory care.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Upper limb injuries (fully authored)
// ---------------------------------------------------------------------------
function lesson3() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the common fractures of the clavicle, proximal humerus, humeral shaft, elbow, forearm, distal radius and hand, with the mechanism of each; state the nerve injured in a fracture of the surgical neck and of the mid-shaft of the humerus, and explain the different deficits; describe the three named fractures of this lesson — Colles', supracondylar and scaphoid — and the specific complication of each; explain why a scaphoid fracture must be suspected, immobilised and re-imaged despite a normal initial film; recognise the acute complications of a supracondylar fracture of the humerus in a child; and describe the examination and management of a wrist injury in the emergency department.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Fractures & dislocations) and Lesson 2 (healing and complications). From Gross Anatomy I: the brachial plexus and its five terminal branches, the course of the radial, ulnar and median nerves, and the bones and joints of the upper limb.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Fall onto the outstretched hand (FOOSH)",
        text: "The classic mechanism of upper-limb injury: the patient lands on an extended, dorsiflexed wrist, transmitting an axial and hyperextension force up the hand and forearm. It is responsible for the great majority of upper-limb fractures in the young.",
      },
      {
        type: "paragraph",
        text: "One mechanism explains most of this lesson. Land on an outstretched hand and the force has to go somewhere: it breaks the distal radius in an adult (Colles'), the supracondylar region in a child, the scaphoid in a young adult, or the clavicle if the force is transmitted through the shoulder instead. The reason the same mechanism produces different fractures at different ages is that each age has a different weakest link — the weak metaphysis of a child, the dense bone of an athlete, or the osteoporotic cortex of an older adult.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The upper limb is built for placement of the hand, not for load bearing. That is why an upper-limb malunion is tolerated far better than a lower-limb one: the shoulder and trunk can compensate for angulation in the humerus in a way the knee and ankle cannot for angulation in the tibia. The exception is the forearm, where rotation has no compensating mechanism — see the theory question below.",
      },

      { type: "heading", level: 2, text: "Shoulder girdle and humerus" },
      {
        type: "table",
        headers: ["Injury", "Mechanism", "Characteristic", "Nerve at risk"],
        rows: [
          ["Fracture of the clavicle (middle third)", "Fall onto the shoulder or an outstretched hand; a direct blow in sport", "The commonest fracture in children; the distal fragment drops under the weight of the arm; the patient supports the elbow", "Rarely a nerve; brachial plexus and subclavian vessels if displaced"],
          ["Acromioclavicular dislocation", "Direct blow to the point of the shoulder — a fall onto the acromion", "A step at the AC joint; the 'piano key' sign on downward pressure", "None"],
          ["Fracture of the proximal humerus", "Fall onto the outstretched hand in an older patient", "Bruising tracks down the arm; Neer classification by parts and displacement", "Axillary nerve (as in shoulder dislocation)"],
          ["Fracture of the surgical neck", "Fall onto the shoulder", "Treated by the nerve, not the fracture, in most cases", "Axillary nerve — badge-patch numbness and deltoid paralysis"],
          ["Fracture of the humeral shaft", "Fall onto the arm; a direct blow; a twisting injury in a child", "Radial nerve palsy is the classic association; most unite in a functional brace", "Radial nerve in the spiral (radial) groove — wrist drop and loss over the first dorsal web space"],
          ["Supracondylar fracture (extension type)", "Fall onto an outstretched hand with the elbow extended, in a child aged 5-8", "The swollen, deformed elbow; the commonest fracture of the child's elbow", "Brachial artery and the median nerve — see below"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The distinction to memorise: a fracture of the surgical neck of the humerus risks the axillary nerve (deltoid, badge patch), a fracture of the mid-shaft risks the radial nerve in the spiral groove (wrist drop, first dorsal web space), and a supracondylar fracture risks the brachial artery and median nerve. The same bone, three different levels, three different injuries — and each one must be tested for and documented.",
      },
      {
        type: "paragraph",
        text: "Most closed humeral shaft fractures are treated without surgery, in a functional brace. This is one of the few places in orthopaedics where a large radiographic deformity is genuinely acceptable, because the shoulder compensates. The reason to operate is the nerve that has been lacerated rather than bruised (an acute, complete radial palsy with an open fracture or a spiral Holstein-Lewis pattern), a vascular injury, or a fracture that has failed in a brace.",
      },

      { type: "heading", level: 2, text: "The elbow and forearm" },
      {
        type: "definition",
        term: "Supracondylar fracture of the humerus",
        text: "A fracture of the distal humerus just above the condyles, through the thin metaphysis of a child's elbow. The extension type, from a fall onto an outstretched hand, is by far the commoner and the one that threatens the brachial artery.",
      },
      {
        type: "paragraph",
        text: "The supracondylar fracture is the reason paediatric elbow injuries are taken seriously. Two things can go wrong, and both go wrong fast. The brachial artery is stretched across the displaced proximal fragment or kinked by it, so the limb loses its perfusion; and the median nerve, which lies in front of the elbow, is compressed. Both must be assessed at the first examination and after every manipulation.",
      },
      {
        type: "table",
        headers: ["Complication", "How it shows", "What you do"],
        rows: [
          ["Brachial artery injury", "Absent radial pulse, pallor, cold hand, pain, a slowly filling capillary refill", "Urgent reduction; the pulse usually returns with the reduction. If it does not, surgical exploration of the artery"],
          ["Median nerve injury", "Loss of flexion of the index finger (flexor digitorum profundus and superficialis), loss of opposition of the thumb, numbness in the radial 3½ digits", "Document before and after reduction; most are neurapraxias that recover"],
          ["Volkmann's ischaemic contracture", "The late sequel — a clawed, insensate hand with fixed flexion of the wrist and fingers", "Prevention by recognizing and treating compartment syndrome early; established contracture cannot be reversed"],
          ["Malunion / cubitus varus", "The classic 'gunstock' deformity when reduction is lost", "Accurate reduction and percutaneous pinning rather than a cast alone for displaced fractures"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The three signs of a vascular injury in a child's supracondylar fracture are absent pulse, pain and pallor — and the two that matter most are pain and pallor. An absent pulse that does not return after reduction is a surgical emergency. A pulse that returns and then disappears again is the pattern of an expanding haematoma or a traumatised, spasming artery, and it demands exploration, not another wait-and-see.",
      },
      {
        type: "question",
        prompt: "A seven-year-old falls on an outstretched hand and has a swollen, deformed elbow with no radial pulse and a pale hand. After reduction under anaesthesia the hand remains pale and pulseless. What do you do next and why?",
        answer: "Surgical exploration of the brachial artery. The fracture reduction has not restored perfusion, which means the artery is not merely compressed by the displaced bone but is damaged — kinked over a spike of bone, intimal tear, or spasm. A limb with no perfusion for more than a few hours is at risk of irreversible ischaemia and subsequent contracture.",
        explanation: "The rule: reduce the fracture first (most pulses come back), and if the pulse does not return, or returns and then is lost again, explore the artery. Never simply observe a pulseless pale limb after reduction.",
      },

      { type: "heading", level: 2, text: "Wrist and hand: the three named injuries" },
      {
        type: "paragraph",
        text: "Three fractures of the wrist and forearm are so heavily examined that each has its own entry. Learn the mechanism, the deformity, the complication and the pitfall of each."
      },

      {
        type: "table",
        headers: ["", "Colles' fracture", "Scaphoid fracture"],
        rows: [
          ["Mechanism", "Fall onto an outstretched hand in an older woman with osteoporotic bone", "Fall onto an outstretched hand in a young adult, or a forced dorsiflexion of the wrist"],
          ["Where", "Distal radius, within 2.5 cm of the articular surface", "Waist of the scaphoid in most cases"],
          ["Deformity", "Dorsal displacement and angulation — the 'dinner fork' deformity; radial shortening gives ulnar styloid prominence", "No deformity; the only sign is tenderness in the anatomical snuffbox"],
          ["Complication", "Malunion with dorsal tilt; carpal malalignment; median nerve symptoms; stiffness of the fingers; rupture of extensor pollicis longus", "Avascular necrosis of the proximal pole; non-union; radiographically occult early on"],
          ["Treatment", "Manipulation and plaster, or a volar locking plate in a younger patient; early finger movement", "Thumb-spica cast or surgical fixation; the cast is applied on clinical suspicion, not on the film"],
          ["The exam answer", "'Dinner fork' is the description; the failure to move the fingers from day one is the commonest cause of a poor result", "Snuffbox tenderness equals scaphoid fracture until proven otherwise"],
        ],
      },
      {
        type: "example",
        text: "A 68-year-old woman trips on a kerb, lands on her right hand, and has a dinner-fork deformity with a dorsally displaced distal radius on the film. She is manipulated under haematoma block or a Bier's block and put in a cast from below the elbow to the metacarpal heads. The most important instruction she is given is not about the cast but about her fingers: she must move them from the first day, because a stiff hand after a healed Colles' fracture is the commonest cause of an unhappy patient.",
      },
      {
        type: "paragraph",
        text: "The scaphoid deserves its own emphasis because it is the most commonly missed injury in the emergency department, and the missed injury is the one that costs the patient most.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A scaphoid fracture is invisible on the first radiograph in roughly 20-25% of cases. The rule is therefore not a radiological rule but a clinical one: if there is tenderness in the anatomical snuffbox, treat as a scaphoid fracture. Immobilise the wrist in a scaphoid (thumb-spica) cast and repeat the radiographs — or obtain an MRI/CT if you need certainty now — in 10-14 days. Reviewing the original films is not the same as re-imaging the patient.",
      },
      {
        type: "definition",
        term: "Anatomical snuffbox",
        text: "The triangular depression on the radial side of the wrist, seen when the thumb is extended, bounded by the extensor pollicis longus tendon medially, the abductor pollicis longus and extensor pollicis brevis laterally, and the scaphoid at its floor.",
      },
      {
        type: "table",
        headers: ["Why the scaphoid is different", "Consequence"],
        rows: [
          ["It has a retrograde blood supply — vessels enter the distal half and run backwards", "A fracture of the waist or proximal pole cuts off the proximal fragment: avascular necrosis and non-union"],
          ["Its articular cartilage covers most of its surface, leaving a small area for vessels to enter", "There is little capacity to heal, so the fracture is slow and easily missed"],
          ["It is the most commonly fractured carpal bone", "It is the fracture you think of first in every young adult with a wrist injury"],
          ["A missed fracture may declare itself months later with wrist pain and arthritis", "A late diagnosis is treated surgically; the late diagnosis is the avoidable harm"],
        ],
      },
      {
        type: "paragraph",
        text: "The rest of the hand follows the same logic of mechanism: a fall on an outstretched hand with axial load drives the capitate or lunate, giving a perilunate dislocation; a direct blow to the tip of the finger gives a mallet finger (extensor tendon avulsion) or a flexor digitorum profundus rupture (a jersey finger); and a punch thrown at a wall gives a fracture of the neck of the fifth metacarpal, the boxer's fracture. And remember that a hand swollen from a wrist injury is stiff unless the fingers are moved.",
      },

      { type: "heading", level: 2, text: "Examining the upper limb" },
      {
        type: "paragraph",
        text: "The upper-limb nerve examination is not a list to recite; it is a set of movements and patches of skin you test in a fixed order so that you do not forget one. The order that saves time is from proximal to distal, matching the arrangement you learned in anatomy.",
      },
      {
        type: "table",
        headers: ["Nerve", "Motor test", "Sensory patch"],
        rows: [
          ["Axillary (C5-C6)", "Abduct the shoulder against resistance (deltoid)", "Regimental badge patch on the lateral shoulder"],
          ["Radial (C5-C8)", "Extend the wrist and fingers (wrist drop if lost)", "First dorsal web space"],
          ["Median (C6-T1)", "Flex the index finger; oppose the thumb (loin — 'LOAF': lateral lumbricals, opponents, abductor pollicis brevis, flexor pollicis brevis)", "Radial side of the index finger, or the palmar thenar eminence"],
          ["Ulnar (C8-T1)", "Abduct the little finger (first dorsal interosseous) / cross the fingers", "Little finger"],
          ["Musculocutaneous (C5-C6)", "Flex the elbow against resistance (biceps)", "Lateral forearm"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A single, quick way to test three nerves at once: ask the patient to make a fist, extend the wrist, and spread the fingers. The fist tests the long flexors (median and ulnar), wrist extension tests the radial nerve, and finger spread tests the ulnar nerve. Two seconds, three nerves, and it is the same set you will repeat at every review.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Discharging a young adult with wrist pain after FOOSH because the radiograph is normal. In a snapshot of 20-25% the fracture is occult. Tenderness in the snuffbox is a positive clinical finding and mandates immobilisation and repeat imaging, not reassurance. This is the single most common medicolegally significant miss in upper-limb practice.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Testing the nerve and then reducing the fracture without testing it again. Document sensation and movement before and after every manipulation, because you must be able to say whether the nerve injury happened on the football pitch or on your examination couch. An undocumented pre-reduction examination cannot protect you.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing the nerve injured at the surgical neck of the humerus with the nerve injured at the mid-shaft. Surgical neck: axillary nerve, deltoid and the badge patch. Mid-shaft: radial nerve, wrist drop and the first dorsal web space. The level of the fracture on the film tells you the nerve before you touch the patient.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Putting an upper-limb fracture in a cast and forgetting the fingers. A stiff hand or a frozen shoulder after a healed forearm or humeral fracture is a complication of the treatment, not of the injury, and it is the one that determines whether the patient returns to work. Move the uninjured joints from day one and write that instruction in the notes and in the discharge letter.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 24-year-old falls onto his outstretched hand and has tenderness in the anatomical snuffbox with a normal radiograph. What is the correct management, and what is the risk if it is ignored?",
        answer: "Treat as a scaphoid fracture: immobilise the wrist in a scaphoid (thumb-spica) cast and re-image in 10-14 days (or obtain MRI/CT if early certainty is needed). If ignored, the fracture may go on to non-union and to avascular necrosis of the proximal pole, because the scaphoid's retrograde blood supply leaves the proximal fragment dependent on vessels entering distally.",
        explanation: "Roughly a quarter of scaphoid fractures are invisible on the first film. The clinical sign — snuffbox tenderness — is the diagnostic criterion, not the radiograph.",
      },
      {
        type: "question",
        prompt: "How do you distinguish a fracture of the surgical neck from one of the mid-shaft of the humerus by nerve examination alone, and why does the level of the fracture predict the nerve?",
        answer: "At the surgical neck the axillary nerve is tethered around the humeral neck, so the deficit is deltoid paralysis and loss over the badge patch. At the mid-shaft the radial nerve lies against the bone in the spiral groove, so the deficit is wrist drop with loss over the first dorsal web space. The fracture level on the film tells you which nerve is lying in the path of the break.",
        explanation: "The radial nerve also runs in the anterior compartment at the mid-humeral level and can be injured by a direct blow even without a fracture — but for a fracture, the level is the predictor.",
      },
      {
        type: "question",
        prompt: "Why does a forearm (radius and ulna) fracture require a much more accurate reduction than a humeral shaft fracture, when both are upper-limb long bones?",
        answer: "Pronation and supination require the radius to rotate around the straight, fixed ulna. Any angulation or rotational malunion of either bone blocks that motion, because a bowed bone cannot rotate about a straight one. The humerus sits between the very mobile shoulder and the trunk, which can compensate for residual angulation and shortening.",
        explanation: "The tolerance for deformity is set by function. The forearm has one function with no compensating mechanism, and therefore a much smaller margin of acceptable malunion.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 22-year-old falls onto an outstretched hand and has tenderness in the anatomical snuffbox. The initial wrist radiographs are normal. What is the most appropriate next step?",
        options: [
          "Discharge with analgesia and review only if the pain persists in three weeks",
          "Immobilise in a wrist splint and repeat the radiographs in 10-14 days",
          "Request CT or MRI because the plain films are normal and no cast is needed",
          "Excise the distal pole of the scaphoid prophylactically",
        ],
        correctIndex: 1,
        explanation: "A scaphoid fracture is radiographically occult in about a quarter of cases. With snuffbox tenderness the fracture must be assumed, immobilised in a scaphoid (thumb-spica) cast, and re-imaged in 10-14 days. Advanced imaging is used when early certainty changes management. Discharging the patient risks non-union and avascular necrosis of the proximal pole.",
      },
      {
        type: "mcq",
        stem: "A seven-year-old falls onto an outstretched hand and has a displaced extension-type supracondylar fracture with a swollen elbow. Which is the most feared acute complication?",
        options: [
          "Ulnar nerve injury producing a claw hand",
          "Brachial artery injury producing ischaemia of the forearm and hand",
          "Radial nerve injury producing wrist drop",
          "Interosseous membrane bleeding producing a compartment syndrome of the forearm",
        ],
        correctIndex: 1,
        explanation: "The anteriorly displaced proximal fragment of an extension-type supracondylar fracture stretches or kinks the brachial artery, which lies directly in front of the elbow, and can also injure the median nerve. This is a limb-threatening complication. The hand must be assessed for perfusion before and after reduction, and a pulse that does not return demands surgical exploration.",
      },
      {
        type: "mcq",
        stem: "A patient with a mid-shaft fracture of the humerus cannot extend the wrist and has numbness over the first dorsal web space. Which nerve is injured, and where does it lie?",
        options: [
          "The axillary nerve, which winds around the surgical neck",
          "The radial nerve, which lies against the bone in the spiral (radial) groove",
          "The median nerve, which lies in the cubital fossa in front of the elbow",
          "The musculocutaneous nerve, which passes through the coracobrachialis",
        ],
        correctIndex: 1,
        explanation: "Wrist drop with loss of sensation in the first dorsal web space is the radial nerve. At the mid-shaft the radial nerve lies directly against the bone in the spiral groove, which is why a mid-shaft fracture injures it, whereas the surgical neck injury above injures the axillary nerve.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Lower limb & knee injuries (fully authored)
// ---------------------------------------------------------------------------
function lesson4() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish intracapsular (femoral neck) from extracapsular (intertrochanteric) fracture of the proximal femur and state the operation used for each; recognise posterior hip dislocation and its emergency management; describe the assessment of the acutely injured knee — the Lachman test, the pivot-shift, the posterior drawer and the meniscal signs; explain the 'unhappy triad' and the significance of a haemarthrosis; describe the Ottawa ankle rules and when to radiograph a twisted ankle; recognise slipped upper femoral epiphysis in an adolescent and say why the knee must be examined in every child with a limp; and explain why a tibial shaft fracture carries the highest risk of compartment syndrome of any injury in this course.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2 (fractures, healing and compartment syndrome). From Gross Anatomy I: the ligaments and menisci of the knee, the cruciate and collateral ligaments, the femoral blood supply, the common fibular nerve at the fibular neck, and the tendons and nerves around the ankle.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Fracture of the neck of femur",
        text: "A fracture of the proximal femur. Divided by its relationship to the hip joint capsule into intracapsular (subcapital, transcervical) and extracapsular (basal, intertrochanteric, subtrochanteric) — a division that determines the operation, because it determines whether the femoral head will keep its blood supply.",
      },
      {
        type: "paragraph",
        text: "The lower limb is built to bear weight, and that changes everything about its injuries. There is no compensation for angulation here — the ankle is a hinge, the knee is a hinge, and a limb that heals even 5° out of true transmits force abnormally for the rest of the patient's life. So the standards for reduction are higher, the operations are more invasive, and the consequences of a missed injury are measured in decades of osteoarthritis rather than in a season of discomfort.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The single most useful fact about the hip: the femoral head's blood supply runs backwards. The retinacular branches of the medial and lateral circumflex femoral arteries climb the femoral neck beneath the synovial reflection, so a fracture inside the capsule that tears them leaves the head avascular, and a fracture outside the capsule leaves them intact. That one sentence explains both operations and both prognoses.",
      },

      { type: "heading", level: 2, text: "Fractures of the hip" },
      {
        type: "table",
        headers: ["", "Intracapsular (neck of femur)", "Extracapsular (intertrochanteric)"],
        rows: [
          ["Relationship to capsule", "Inside the hip joint capsule", "Outside the capsule"],
          ["Blood supply to the head", "Retinacular vessels torn; head becomes avascular", "Retinacular vessels intact; head retains its supply"],
          ["Typical patient", "Older woman with osteoporosis; a fall from standing height", "Older patient, often with a higher-energy fall"],
          ["Limb position", "Shortened, externally rotated (usually less markedly than extracapsular)", "Shortened, externally rotated, often dramatically so"],
          ["Operation", "Hemiarthroplasty or total hip replacement — the head is replaced because it cannot heal", "Dynamic hip screw or intramedullary nail — fracture is reduced and fixed, and the head is kept"],
          ["Why the difference", "Fixation of an avascular head leads to non-union and avascular necrosis", "The bone is well vascularised, so it heals when stably fixed"],
        ],
      },
      {
        type: "paragraph",
        text: "The externally rotated and shortened limb in a fall from standing height in an elderly patient is a fracture of the proximal femur until proven otherwise. This is one of the fractures where the radiograph can be misleadingly normal in an undisplaced intracapsular fracture, so if the clinical picture is there and the film is not, obtain an MRI or repeat imaging rather than discharging the patient. A missed undisplayed intracapsular fracture displaces on the way home and becomes a problem that cannot be fixed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A young patient with a femoral neck fracture is a different problem entirely: the bone is normal, so the energy was high, and the fracture is usually grossly displaced. Anatomical reduction and internal fixation with the head still viable is the priority — a replacement in a 30-year-old is a life sentence of revision operations. Age alters the operation, and the mechanism alters the urgency.",
      },
      {
        type: "question",
        prompt: "An 82-year-old woman cannot get up after a fall at home. Her leg is shortened and externally rotated and she cannot bear weight. Why is the radiograph not the last word, and what would you do if the first film is normal?",
        answer: "An undisplaced intracapsular fracture can be invisible on the plain film. If the clinical signs — a fall, inability to bear weight, external rotation and shortening of the limb — are present, obtain a CT or MRI, which will show the fracture line and any trabecular impaction. Treat it as a fracture, not as a sprain, until proven otherwise.",
        explanation: "The consequence of a missed undisplaced intracapsular fracture is displacement, displacement converts a clean operation into an emergency one, and the patient's hip is at risk.",
      },

      { type: "heading", level: 2, text: "Femoral shaft and below" },
      {
        type: "table",
        headers: ["Injury", "Mechanism and site", "Key points"],
        rows: [
          ["Femoral shaft fracture", "High-energy trauma in the young; a trivial fall in the osteoporotic elderly", "Blood loss of 1.5-2 L into the thigh — this is a haemorrhagic injury, not just a fracture. Treat with an intramedullary nail; traction is the temporary splint"],
          ["Fracture of the patella", "Direct blow to the knee (dashboard) or a resisted extension", "The knee cannot extend against gravity; an avulsion of the extensor mechanism must be fixed surgically"],
          ["Tibial shaft fracture", "Direct blow, often in a road traffic collision or sport; the commonest open fracture of a long bone", "The anterior compartment lies against the subcutaneous tibia: watch for compartment syndrome. Commonest site of non-union of a long bone"],
          ["Ankle fracture (bimalleolar / trimalleolar)", "An inversion or eversion injury with rotational force", "Assess stability: the mortise must be congruent. Talar shift is the sign of an unstable mortise that needs fixation"],
          ["Fracture of the calcaneus", "Fall from a height onto the heels", "Look for the associated lumbar burst fracture — falls are axial, and they break both ends"],
          ["Tarsometatarsal (Lisfranc) injury", "Axial load through a plantarflexed foot, or a crushing injury", "The foot is swollen and the patient cannot bear weight; frequently missed on plain films and a frequent source of litigation"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Every fall from a height is examined at both ends. A patient who lands on their heels has taken an axial load through the spine, and roughly 10% have a lumbar (or thoracolumbar) spine fracture that the painful heels completely mask. A patient who jumped with the intention of self-harm should also be assessed for the cervical spine before the heels are interpreted.",
      },
      {
        type: "paragraph",
        text: "Tibial shaft fractures are the fracture to know in this lesson. The subcutaneous border of the tibia means a direct blow readily opens the fracture, so it is the commonest site of open fracture of a long bone. The tibia's blood supply is segmental, so a mid-shaft fracture can deprive a fragment. And the anterior compartment lies directly against the bone and is the tightest compartment in the leg, so it is here that compartment syndrome is most often seen.",
      },

      { type: "heading", level: 2, text: "The acutely injured knee" },
      {
        type: "paragraph",
        text: "A knee swells within about two hours of a ligament rupture, and the swelling is a haemarthrosis — blood in the joint from a torn structure inside it. That observation alone narrows the differential enormously: in a haemarthrosis after a twisting injury, you are looking for a torn anterior cruciate ligament, an osteochondral fracture, or a peripheral meniscal tear. The examination is then four tests, done in an order, and compared with the other knee.",
      },
      {
        type: "table",
        headers: ["Test", "What it tests", "What a positive test means"],
        rows: [
          ["Lachman test (knee at 30°, femur stabilised, tibia drawn forward)", "The anterior cruciate ligament — the most sensitive and specific test", "Increased forward translation of the tibia with a soft or absent endpoint: ACL rupture. This is the test to trust"],
          ["Anterior drawer (knee at 90°)", "The anterior cruciate ligament", "Forward translation with a soft endpoint; less reliable than Lachman, especially in the acutely painful or swollen knee"],
          ["Pivot shift", "The anterior cruciate ligament, functionally", "The tibia reduces with a clunk as the knee is extended; a positive test is the rotatory instability that patients feel as 'the knee gives way'"],
          ["Posterior drawer", "The posterior cruciate ligament", "Backward translation of the tibia; a posterior sag is best seen with the hips and knees at 90° looking from the side"],
          ["Valgus / varus stress at 0° and 30°", "The medial and lateral collateral ligaments", "At 30° the ligament is isolated; at 0° opening suggests a capsular or cruciate injury in addition"],
          ["Joint-line tenderness and McMurray's test", "The medial or lateral meniscus", "Tenderness at the joint line; a click or pain at the extremes of flexion-extension with rotation. Less specific than MRI"],
        ],
      },
      {
        type: "definition",
        term: "Haemarthrosis",
        text: "Blood within a synovial joint. In a knee that swells within two hours of injury it indicates intra-articular structural damage — a torn cruciate ligament, an osteochondral fracture, or a peripheral meniscal tear — and it distinguishes acute ligament rupture from the slower, effusive swelling of a meniscal injury or a synovitis.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The unhappy triad is the anterior cruciate ligament, the medial collateral ligament and the medial meniscus, injured by a valgus force with a twisting component — a foot planted and a blow to the lateral side of the knee. The medial meniscus is involved because its deep fibres are bound to the medial collateral ligament, so a valgus force that tears the ligament tears the meniscus too. The lateral meniscus escapes because it is loosely attached and mobile.",
      },
      {
        type: "example",
        text: "A 22-year-old footballer twists a planted knee, hears a pop, and is off the pitch within minutes. The knee swells over the next two hours. Lachman is positive with a soft endpoint, and the pivot shift is positive. The diagnosis is a rupture of the anterior cruciate ligament; the haemarthrosis confirms that something inside the joint has torn. The management question is not the diagnosis but the patient's demands — a young athlete who wants to return to pivoting sport will need reconstruction, while a patient who is content with a straight-line life may be managed with rehabilitation and a brace.",
      },

      { type: "heading", level: 2, text: "The adolescent with a painful knee: SCFE" },
      {
        type: "definition",
        term: "Slipped upper femoral epiphysis (SCFE)",
        text: "A displacement of the proximal femoral epiphysis (the femoral head) off the metaphysis through the growth plate, typically in an overweight or rapidly growing adolescent. It is a disorder of the growth plate, not a fracture, and it is a common cause of a limp.",
      },
      {
        type: "table",
        headers: ["Feature", "What it looks like"],
        rows: [
          ["Patient", "An obese or rapidly growing adolescent, 10-16 years, boys more than girls; the commonest hip disorder of adolescence"],
          ["Pain", "Groin, thigh or knee pain — referred to the knee by the obturator nerve, which is why it is missed so often"],
          ["Gait", "A limp with the leg externally rotated; the patient cannot stand on the affected leg"],
          ["Signs", "Fixed external rotation that is obligatory on hip flexion; loss of internal rotation are the earliest findings"],
          ["Radiographs", "AP and frog-leg (lateral) views of both hips: the epiphysis slips posteriorly and medially, so the AP view can be normal and the frog-leg view essential"],
          ["Complications", "Avascular necrosis of the femoral head (the most feared); chondrolysis; contralateral slip in up to 20-40%"],
          ["Treatment", "Non-weight-bearing on diagnosis, then surgical fixation in situ (usually with a single screw). Do NOT attempt closed reduction"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Every child or adolescent with knee pain must have the hip examined. The obturator nerve refers pain from the hip to the medial thigh and knee, so a slipped capital femoral epiphysis, a Perthes' disease or a septic arthritis of the hip all can present as nothing more than a painful knee in a child who walks with a limp. Examining only the knee is the classic error, and the missed slip goes on to avascular necrosis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A suspected slip is made non-weight-bearing immediately and fixed surgically. Forcing the hip — as in a closed reduction to 'improve' the position of the head — risks tearing the retinacular vessels and precipitating avascular necrosis. The aim is to prevent further slip and to stabilise, not to restore the epiphysis to its original position.",
      },

      { type: "heading", level: 2, text: "The twisted ankle" },
      {
        type: "definition",
        term: "Ottawa ankle rules",
        text: "A validated decision rule that determines whether an ankle or foot radiograph is needed after an injury, by identifying the patients in whom a fracture is likely enough to be worth imaging.",
      },
      {
        type: "table",
        headers: ["Rule", "Radiograph the ankle if...", "Radiograph the foot if..."],
        rows: [
          ["Bony tenderness", "Posterior edge or tip of either malleolus (the lateral and medial malleoli), distal 6 cm of bone", "Tenderness at the navicular or the base of the fifth metatarsal"],
          ["Inability to bear weight", "The patient cannot take four steps both immediately after the injury and at the time of examination", "The same test applies to the foot series"],
          ["Point of the rule", "Sensitivity approaching 100% for clinically significant fractures", "Identifies the avulsion fracture of the base of the fifth metatarsal and the Lisfranc patterns"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The Ottawa rules are a safety net, not a substitute for judgement: they do not tell you there is no fracture, they tell you the chance of a clinically important fracture is low enough that imaging is not needed in the first visit. Apply them to an injury within the last ten days, in a patient who is not intoxicated and has no other painful injury, and who is able to cooperate. And they do not apply to the obviously deformed ankle — that is radiographed and reduced, not decided upon by a rule.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Operating on every proximal femur fracture the same way. The capsule decides the operation: an intracapsular fracture gets a replacement because the head is avascular; an extracapsular fracture gets a hip screw or nail because the head is viable and bone heals when fixed. Applying the wrong operation to the wrong fracture is the single commonest error made by juniors reading an X-ray on the trauma meeting.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Trusting an AP radiograph to exclude a slipped capital femoral epiphysis. The slip is posterior and medial, so it can be invisible on the AP view and obvious on the frog-leg lateral. Request both hips in both projections, and remember the contralateral hip will be involved in up to 20-40% of cases.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping the knee examination at the cruciates. The collateral ligaments, the menisci and the extensor mechanism all need testing, and the patellar tendon and quadriceps must be checked for continuity — a patient with an extensor mechanism rupture cannot extend the knee against gravity, and that is the one injury the drawer tests will not find.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a compartment syndrome in a tibial fracture. The anterior compartment is the tightest and lies directly against the subcutaneous tibia, so a tibial shaft fracture is the classic setting for the syndrome. Serial examination, and a low threshold for fasciotomy, are the standard — not a single reassuring pulse palpation on admission.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does an intracapsular fracture of the neck of femur in an 80-year-old get a hemiarthroplasty, while an intertrochanteric fracture in a patient of the same age gets a dynamic hip screw?",
        answer: "The intracapsular fracture has torn the retinacular vessels that supply the femoral head, so the head is avascular and cannot heal: it is replaced. The intertrochanteric fracture lies outside the capsule and those vessels survive, so the bone is viable and will unite if it is stably fixed — which a dynamic hip screw or intramedullary nail achieves.",
        explanation: "The division is anatomical — inside or outside the capsule — and it determines both the operation and the prognosis.",
      },
      {
        type: "question",
        prompt: "A 13-year-old boy with a limp complains of knee pain. The knee examination is normal. What have you missed?",
        answer: "You have not examined the hip. Pain from the hip is referred to the knee and medial thigh by the obturator nerve, and a slipped capital femoral epiphysis, Perthes' disease or septic arthritis of the hip all present with knee pain. Examine the hip's range of movement — particularly a loss of internal rotation and obligatory external rotation on flexion — and radiograph both hips in AP and frog-leg lateral views.",
        explanation: "Referral patterns are the commonest reason a serious paediatric hip condition is missed: the patient complains of the joint that hurts, not the joint that is broken.",
      },
      {
        type: "question",
        prompt: "State the two components of the Ottawa ankle rule, and the two sites whose tenderness prompts an ankle radiograph rather than a foot radiograph.",
        answer: "The two components are bony tenderness over defined points and inability to bear weight for four steps both immediately and at examination. An ankle radiograph is indicated by tenderness over the posterior edge or tip of either malleolus (within the distal 6 cm); a foot series by tenderness over the navicular or the base of the fifth metatarsal.",
        explanation: "The rules identify the fractures that change management: a mortise that is unstable because of a malleolar fracture, and the foot fractures that need a different treatment from a sprain.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "An obese 13-year-old boy has a limp with groin and referred knee pain and an externally rotated gait; frog-leg radiographs confirm a stable slipped upper femoral epiphysis. What is the correct management?",
        options: [
          "Urgent closed reduction under general anaesthesia to restore the epiphysis to its anatomical position",
          "Non-weight-bearing crutches and in situ surgical fixation with a screw",
          "Open reduction and osteotomy to correct the alignment of the femoral neck",
          "Observation with serial radiographs until the growth plate closes, since the slip is stable",
        ],
        correctIndex: 1,
        explanation: "A slipped capital femoral epiphysis is made non-weight-bearing immediately (to prevent further slip) and then fixed in situ, usually with a single screw. The aim is stabilisation, not anatomical reduction — attempting reduction risks tearing the retinacular vessels and precipitating avascular necrosis, which is the most feared complication.",
      },
      {
        type: "mcq",
        stem: "A footballer twists a planted knee, hears a pop and develops rapid swelling. Lachman shows increased anterior tibial translation with a soft endpoint, the pivot shift is positive and the posterior drawer is normal. Which structure is torn?",
        options: [
          "The posterior cruciate ligament",
          "The anterior cruciate ligament",
          "The medial collateral ligament alone",
          "The medial meniscus alone",
        ],
        correctIndex: 1,
        explanation: "Increased anterior translation with a soft endpoint on the Lachman test, a positive pivot shift, a normal posterior drawer and a rapid haemarthrosis is the classic picture of an anterior cruciate ligament rupture. The pop and the two-hour swelling confirm that the injury is intra-articular and acute.",
      },
      {
        type: "mcq",
        stem: "An 80-year-old woman falls and has a shortened, externally rotated leg. Which statement about the fracture of her proximal femur is correct?",
        options: [
          "An intracapsular fracture is fixed with a dynamic hip screw because the head retains its blood supply",
          "An extracapsular intertrochanteric fracture is fixed with a plate or nail because the retinacular vessels and the head survive",
          "Intracapsular and extracapsular fractures are treated identically, with open reduction and internal fixation",
          "Extracapsular fractures require hemiarthroplasty because the femoral head is avascular",
        ],
        correctIndex: 1,
        explanation: "The retinacular vessels that supply the femoral head run up the femoral neck beneath the synovial reflection, so an extracapsular fracture leaves both them and the head viable, and a dynamic hip screw or intramedullary nail stabilises the fracture and allows it to unite. An intracapsular fracture tears those vessels, so the head is avascular and is replaced.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Amputations (fully authored)
// ---------------------------------------------------------------------------
function lesson5() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: list the indications for amputation and separate the absolute from the relative ones; explain how the level of amputation is chosen and why the lowest functional level is not always the best level; describe the commonest levels of amputation in the lower limb and what each is for; outline the conduct of the operation — flap design, myodesis, stump length and the management of the nerves; describe immediate and early stump complications; explain the principles of prosthetic fitting, from the immediate post-operative fitsock to a definitive prosthesis; and recognise phantom limb sensation and phantom limb pain as distinct phenomena.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2 (fractures and their complications, including compartment syndrome and necrosis) and Lesson 4 (lower limb injuries). You also need the vascular anatomy and the peripheral nerve anatomy of the limb from Gross Anatomy I.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Amputation",
        text: "The removal of a limb or part of a limb through bone or across a joint. A disarticulation is an amputation through the joint itself, leaving the articular surface of the proximal bone intact and covered.",
      },
      {
        type: "paragraph",
        text: "Amputation is not a failure of treatment — it is a treatment. The clinical mistake is to think of it as the end of a pathway of reconstructive attempts, because every week spent attempting to save a limb that will not function is a week in which the patient has not been mobilising, not been rehabilitating and not been adapting. The correct framing is forward-looking: an amputation is the first step towards a prosthesis and a return to function, and the decision is made when the limb that would remain after further surgery would be less useful than a prosthesis.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The question to ask is not 'can this limb be saved?' but 'will this limb, after all the operations it would need, walk better than a prosthesis?' A foot with a healed amputation and a good prosthesis is a foot; a foot that has been through six operations and is painful, contracted and cold may not be.",
      },

      { type: "heading", level: 2, text: "Indications and levels" },
      {
        type: "table",
        headers: ["Category", "Indication", "Clinical setting"],
        rows: [
          ["Absolute — dead", "Irreversible ischaemia with non-viable tissue established", "A cold, mottled, insensate limb with no perfusion on investigation and no salvageable tissue"],
          ["Absolute — deadly", "Overwhelming infection threatening the patient's life — gas gangrene, necrotising fasciitis, uncontrolled sepsis", "A septic, deteriorating patient in whom source control is amputation"],
          ["Absolute — intractable", "Malignancy of bone or soft tissue with no other control; uncontrollable pain", "Osteosarcoma or a soft-tissue sarcoma requiring a definitive margin"],
          ["Relative — non-functioning", "A limb that will never function usefully — a flail limb, a severe deformity, or chronic ischaemia with rest pain and no revascularisation option", "Buerger's disease, diabetic foot sepsis, congenital limb deficiency"],
          ["Relative — dangerous", "Recurrent ulceration or sepsis that would not stop, in a limb that was already impaired", "The diabetic foot that has already had several debridements"],
        ],
      },
      {
        type: "paragraph",
        text: "The commonest modern indication in the developed world is a diabetic foot that has reached the point of unreconstructible arterial disease or uncontrollable sepsis, and the second is peripheral arterial disease with critical limb ischaemia. Trauma, once the leading indication, is now the third, because of the advances in vascular and reconstructive surgery.",
      },
      {
        type: "paragraph",
        text: "The level of amputation is decided by three factors together, and they are frequently in tension. The first is viability: the wound must heal, and you can assess that by the level at which the tissue will tolerate the surgery — a transcutaneous oxygen tension, a Doppler signal, or the simple test of where the bleeding is at surgery. The second is function: the more bone you retain, the longer the lever and the less energy the patient spends walking, so the level is set as low as the tissue allows. The third is the prosthesis: a level that is excellent for viability and poor for fitting is not a good level, and vice versa.",
      },
      {
        type: "table",
        headers: ["Level", "Where", "Advantage", "Consequence"],
        rows: [
          ["Toe amputation", "At the metatarsophalangeal joint or through a phalanx", "Minimal disruption to gait; weight-bearing is preserved", "Forefoot stability is lost if the hallux is involved"],
          ["Ray amputation", "Through a metatarsal with its toe", "Removes an infected toe with its ray and preserves the foot's shape", "The remaining metatarsals carry abnormal load and must be accommodated in the shoe"],
          ["Transmetatarsal", "Through the metatarsals", "The classic level for diabetic forefoot sepsis; a good functional stump with a toe filler", "Needs viable heel pad and a preserved long plantar flap"],
          ["Symes (ankle disarticulation)", "Through the ankle joint, retaining the heel pad over the distal tibia", "End-bearing, so the patient can walk short distances without a prosthesis — a real advantage in resource-limited settings", "The bulbous stump is harder to fit cosmetically with a prosthesis"],
          ["Below-knee (transtibial)", "Through the tibia and fibula, at least 8-14 cm below the knee joint", "The energy cost of walking is far lower than above-knee, and most patients walk with a prosthesis", "Needs a viable posterior calf flap and enough tibial length to make a prosthetic fit possible"],
          ["Through-knee disarticulation", "At the knee joint", "Preserves the femoral condyles as an end-bearing surface; long lever", "The knee centre is lower than the contralateral knee, which is cosmetically difficult"],
          ["Above-knee (transfemoral)", "Through the femur", "Reliable healing; a safe level when the tibial tissue is not viable", "Energy cost of walking rises by roughly 50-100% and many patients do not walk"],
          ["Hip disarticulation", "Through the hip joint", "Required for proximal malignancy or extensive trauma", "A very large energy cost; many patients use a wheelchair primarily"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Below-knee is the level to reach for whenever you can, because the difference in the energy cost of walking between a below-knee and an above-knee prosthesis is the difference between a patient who walks to the shops and a patient who does not leave the house. A posterior flap with a long myocutaneous calf flap, based on the gastronemius and soleus, brings a well-vascularised pad of tissue over the end of the tibia, which is what heals a transtibial stump.",
      },

      { type: "heading", level: 2, text: "Conduct of the operation" },
      {
        type: "paragraph",
        text: "Four elements of the technique are consistent at every level, and they are the elements you will be asked about.",
      },
      {
        type: "table",
        headers: ["Element", "What is done", "Why"],
        rows: [
          ["Skin flaps", "The flap is designed to bring mobile, sensate, well-vascularised skin over the end of the stump — a posterior flap for a below-knee, equal anterior and posterior flaps for an above-knee", "A scar adherent to bone, or over the weight-bearing end, breaks down and causes chronic pain"],
          ["Muscle", "The muscles are divided distal to the bone and then stabilised: myodesis (sutured to bone or tendon) or myoplasty (sutured to each other)", "A loose muscle cone retracts and gives a conical, poorly perfused stump; a stabilised muscle keeps the contour and the strength of contraction"],
          ["Nerves", "The nerves are drawn gently distally and divided sharply with a blade so that they retract proximal to the stump", "A nerve tied or crushed, or a nerve left in a scar at the end of the stump, is the source of a painful neuroma"],
          ["Bone", "The bone is cut at a level that allows a good soft-tissue cover, and the edges are bevelled and made smooth", "A sharp spur of bone left under a skin bridge causes a pressure ulcer that never heals"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not ligate or crush the nerves, and do not leave a nerve ending in the weight-bearing end of the stump — a neuroma caught in the scar of the stump tip is one of the commonest and most difficult causes of stump pain. Draw the nerve down, divide it cleanly, and let it retract into muscle where it is protected.",
      },

      { type: "heading", level: 2, text: "Early complications and stump care" },
      {
        type: "table",
        headers: ["Complication", "How it presents", "Management"],
        rows: [
          ["Haematoma", "A swelling and pain under the flap in the first days", "A pressure dressing and a drain; a large haematoma leads to wound breakdown and infection"],
          ["Infection and wound breakdown", "Erythema, discharge, a failing flap", "Antibiotics, drainage and, frequently, a higher revision amputation — this is why the level was chosen by viability"],
          ["Contracture", "A flexion deformity of the hip or knee in the days after surgery", "Prevent by positioning: no pillows under the stump, early extension of the joint above, prone lying"],
          ["Stump oedema", "A soft, swollen, tender stump", "Rigid dressing or a shrinker sock applied immediately after surgery; graduated compression"],
          ["Deep vein thrombosis and pulmonary embolism", "The commonest preventable cause of death", "Pharmacological and mechanical prophylaxis from admission"],
          ["Phantom limb pain", "Pain perceived in the limb that is no longer there, often burning or cramping", "Distinguish it from phantom sensation; treat with analgesics, gabapentinoids, mirror therapy and early prosthetic use; there is no single reliable operation"],
        ],
      },
      {
        type: "definition",
        term: "Phantom limb sensation versus phantom limb pain",
        text: "Phantom sensation is the almost universal feeling that the amputated limb is still present, and it usually diminishes over months. Phantom limb pain is pain perceived in the missing limb — a burning, crushing or cramping quality — and it is the distressing and difficult complication, occurring in a minority and persisting for years in a few.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Rehabilitation begins on the first post-operative day. The patient is taught to move the joints above the stump from the outset, to use the bed and then the walking aid, and to accept the prosthesis as part of the limb. Psychological support for the grief and the altered body image is not an optional extra — patients who do not accept the limb are the patients who never walk.",
      },

      { type: "heading", level: 2, text: "Prosthetics" },
      {
        type: "paragraph",
        text: "A prosthesis does not replace a limb; it replaces a function. That is why the prescription is written by function: what the patient needs to do, and what the residual limb and the prosthetic technology can support.",
      },
      {
        type: "table",
        headers: ["Component", "Function", "What matters"],
        rows: [
          ["Socket", "Transfers load from the stump to the prosthesis and contains it", "Fit and suspension — this is what determines comfort, and comfort is what determines whether the patient wears the prosthesis"],
          ["Suspension", "Holds the prosthesis on the limb", "Suction, sleeve, or a lock into a liner; a poor suspension makes a good foot useless"],
          ["Knee mechanism (below-knee level and above)", "Provides a stable, controlled extension in stance and free flexion in swing", "A manual locking knee for the frail and unstable; a polycentric or hydraulic knee for the active"],
          ["Foot / ankle", "Provides ground contact and a roll-over shape gait", "A single-energy-storing foot for most, a dynamic-response foot for the active, and a safe solid ankle cushion heel for the very frail"],
        ],
      },
      {
        type: "paragraph",
        text: "The sequence is: immediate post-operative pneumatic or rigid dressing; then, from about two weeks, a preparatory prosthesis or shrinker with a walking aid; then a definitive prosthesis once the stump has matured and the volume has stabilised. Sockets are re-made as the stump changes shape, and the limb is re-measured at each stage. A prosthesis is a lifelong process of fitting and reviewing, not a single prescription.",
      },
      {
        type: "question",
        prompt: "Why is a below-knee amputation preferred over an above-knee amputation whenever the tissue permits, and what does that have to do with the way the patient walks?",
        answer: "A below-knee stump preserves the knee joint and gives the patient a long, naturally powered lever, and the energy cost of walking with a transtibial prosthesis is only modestly above normal. An above-knee prosthesis has no knee, so the patient must swing the limb through with hip and trunk movement, and the energy cost is roughly 50-100% higher — which is the difference between walking independently and using a wheelchair.",
        explanation: "The purpose of the level decision is function: you are choosing the most functional level the wound will heal at, not the simplest level to operate on.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Leaving the stump joint in a flexion contracture. A pillow under the stump, or a wheelchair with the knee flexed, produces a hip flexion contracture or a knee flexion contracture within days, and a contracted stump cannot accept a prosthesis and cannot be walked on. Position flat, extend the joint above, and lie prone if you can."
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming that the most distal viable level is the best level. It usually is — but the added consideration is the prosthetic fit: a Symes amputation has a bulbous end that is hard to fit, and a very long below-knee stump may not leave room for a knee mechanism at the right height. Function and prosthetic requirements enter the decision alongside viability."
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing phantom limb sensation with phantom limb pain. The phantom feeling that the limb is present is normal and reassuring, and it usually fades. Phantom pain is a burning, cramping pain in the missing limb, and treating it with ever more analgesics alone, without addressing the prosthetic fit, rehabilitation and the central sensitisation, is not a treatment plan."
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the psychological and social part of the decision. Amputation is a mutilation from the patient's point of view before it is a reconstruction from yours. Consent, explanation of the prosthetic process, the involvement of the family and the physiotherapist, and an honest discussion about what a prosthesis can and cannot do, are part of the operation — not things to be done afterwards."
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "State the absolute indications for amputation.",
        answer: "A dead limb (irreversible ischaemia with established non-viability); a limb that is deadly to the patient (uncontrolled sepsis or gas gangrene); and a limb that is intractable (uncontrolled malignancy or intractable pain where nothing else can be offered). The common relative indication is a limb that would never function usefully, and would function worse than a prosthesis.",
        explanation: "The absolute indications are the three Ds: dead, deadly, and the intolerable. Everything else is a relative judgement balancing the limb's future function against the alternative of a prosthesis.",
      },
      {
        type: "question",
        prompt: "What are the four technical elements you should expect in a well-conducted amputation?",
        answer: "Well-designed skin flaps that bring sensate, vascularised, mobile skin over the end of the stump; muscles divided distal to the bone and then stabilised to bone or to each other (myodesis or myoplasty); nerves drawn distally and divided sharply so they retract into protected muscle; and bone cut at a level that permits good soft-tissue cover, with smooth, bevelled edges.",
        explanation: "Each element answers a different failure mode: a scar on bone ulcerates, an unstabilised muscle cone necks and of itself causes pain, a nerve caught in the scar becomes a neuroma, and a sharp bone spur perforates the flap.",
      },
      {
        type: "question",
        prompt: "Why is the stump managed with a rigid dressing or a shrinker from the first day, and what is the alternative failure mode?",
        answer: "To control oedema and shape the stump into a conical, compact form suitable for a prosthetic socket. Without compression, the stump becomes soft, oedematous and bulbous, which delays fitting and is uncomfortable; and a haematoma under the flap causes wound breakdown.",
        explanation: "Stump shaping is the bridge between the operation and the prosthesis: it is treated as an active part of the care, not as something that happens while you wait.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A diabetic patient has a gangrenous, non-salvageable forefoot with spreading infection that has failed revascularisation and requires amputation. Which principle best guides the level of amputation?",
        options: [
          "The most distal level that the patient will accept",
          "The most distal level at which the tissue will heal and that will accept a functional prosthesis",
          "A standard below-knee level, because foot-level amputations never work in diabetes",
          "The level that is easiest for the surgical team to perform quickly",
        ],
        correctIndex: 1,
        explanation: "The level is decided by the combined requirements of wound healing (viability), function (the longest lever that will work) and prosthetic acceptance. Foot-level amputations do work in diabetic forefoot sepsis when the heel pad and the posterior flap are viable — transmetatarsal and Symes amputations preserve end-bearing and low energy walking.",
      },
      {
        type: "mcq",
        stem: "Which single measure, started on the first post-operative day, most reliably prevents a stump contracture from preventing prosthetic use?",
        options: [
          "Elevating the stump on a pillow to reduce swelling",
          "Positioning the stump flat, without a pillow beneath it, and early active extension of the joint above",
          "Wrapping the stump firmly in an elastic bandage",
          "Keeping the patient in bed for the first week to allow the flap to take",
        ],
        correctIndex: 1,
        explanation: "A contracture forms because the joint above the stump is held in flexion — by a pillow under the stump, or by sitting in a wheelchair. The prevention is to keep the stump flat, extend the joint above actively from day one and lie prone. Compression treats oedema, not contracture, and elevation in flexion makes the contracture more likely.",
      },
      {
        type: "mcq",
        stem: "Which statement correctly distinguishes the two 'phantom' phenomena after amputation?",
        options: [
          "Phantom sensation is a burning pain in the missing limb and phantom pain is a vague feeling that the limb is present",
          "Phantom sensation is a feeling that the limb is still there, which is near-universal and usually fades; phantom pain is pain perceived in the missing limb and is the difficult problem",
          "Both are the same phenomenon described differently by different patients",
          "Phantom limb phenomena only occur after amputations above the knee",
        ],
        correctIndex: 1,
        explanation: "The phantom sensation of the limb's continued presence is an almost universal cortical phenomenon that diminishes with time. Phantom limb pain — burning, cramping, crushing in the absent limb — is the distressing minority that requires a multimodal treatment plan. Phantom phenomena follow amputation at any level, including digits.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Congenital malformations (fully authored)
// ---------------------------------------------------------------------------
function lesson6() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the four elements of congenital talipes equinovarus and distinguish it from the positional, correctable club-foot of the newborn; state the principles and sequence of the Ponseti method and why it is the first-line treatment; describe developmental dysplasia of the hip — its risk factors, its clinical screening with the Ortolani and Barlow tests, and the role and limits of ultrasound; explain why late-diagnosed DDH presents in the walking child with a limp and apparent shortening; describe congenital muscular torticollis and sternocleidomastoid contracture; and list the common congenital limb deficiencies and the principle of early surgical or orthotic management.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Fractures & dislocations) for the vocabulary of deformity. From Gross Anatomy I: the anatomy of the hip joint and its capsule, the femoral head's blood supply, and the muscles of the thigh and the leg. No paediatric orthopaedics assumed.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "Congenital malformation is the one corner of orthopaedics where a single word distinguishes the two halves of the subject: correctable and non-correctable. A club-foot that will correct passively is positional, needs no more than gentle stretching, and has an excellent outcome. A club-foot that will not correct with any amount of gentle pressure is true congenital talipes equinovarus — a structural deformity of the bone, joint and tendon — and needs treatment that begins within days. The same distinction runs through DDH, torticollis and every other congenital condition: the first question is always 'is this a position or a structure?'",
      },
      {
        type: "definition",
        term: "Congenital deformity",
        text: "A structural abnormality present at birth, arising from a disturbance of development rather than from position in utero or the birth process. It is distinguished from a positional or postural deformity, in which the structure is normal and only the resting position is abnormal.",
      },

      { type: "heading", level: 2, text: "Congenital talipes equinovarus (CTEV, club-foot)"      },
      {
        type: "definition",
        term: "Talipes equinovarus",
        text: "A fixed structural deformity of the foot, present at birth, combining four elements: equinus (the ankle is plantarflexed), varus (the heel is turned inward), adductus (the forefoot is turned inward) and cavus (the arch is high). The diagnosis rests on the fact that the deformity cannot be passively corrected to a neutral position.",
      },
      {
        type: "table",
        headers: ["The four elements of CTEV", "What it means"],
        rows: [
          ["Equinus", "The ankle is fixed in plantarflexion, so the toes point down and the foot cannot be brought up to 90°"],
          ["Varus", "The heel is turned inward, so the sole faces towards the other foot"],
          ["Adductus", "The forefoot is turned inward relative to the hindfoot — the medial border of the foot is concave"],
          ["Cavus", "The arch is abnormally high, from the first ray being plantarflexed"],
        ],
      },
      {
        type: "paragraph",
        text: "The diagnosis is clinical and it is made in the delivery room: attempt to bring the foot to a neutral position. If it corrects fully, the foot is positional (the normal result of intrauterine position at term) and needs no treatment beyond stretching. If it does not, and especially if the calf is thin, the heel is small and the medial skin creases are deep, this is true CTEV. Incidence is roughly 1 in 1,000 live births, is twice as common in boys, and is bilateral in about half of cases.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Every child with CTEV must have both hips examined. CTEV and developmental dysplasia of the hip occur together far more often than chance, and the foot deformity distracts even an experienced examiner from the hip. This is the most common way the second diagnosis is missed.",
      },

      {
        type: "definition",
        term: "The Ponseti method",
        text: "The standard first-line treatment of congenital talipes equinovarus: serial weekly manipulation of the foot into a corrected position, held by a long-leg plaster cast, with most deformities corrected in about five casts over four to six weeks and, in the great majority, a small percutaneous tenotomy of the Achilles tendon to correct the residual equinus, followed by a foot-abduction brace worn full-time and then at night until about 4-5 years of age.",
      },
      {
        type: "table",
        headers: ["Stage", "What is done", "Why it is done in this order"],
        rows: [
          ["1. Cavus correction", "The forefoot is supinated to bring the first ray up, correcting the cavus", "The cavus is corrected first because a cavus foot will always adopt an adducted position to keep the ball of the foot on the ground"],
          ["2. Adduction and varus correction", "The foot is abducted at the midfoot around the head of the talus, correcting the adduction and then the varus", "The talus is the pivot; the foot is rotated around it, never pronated or twisted, because the talus is also the bone whose head is the fulcrum"],
          ["3. Equinus correction", "The ankle is brought to dorsiflexion, with an Achilles tenotomy where it will not correct", "Equinus is corrected last; the ankle is not dorsiflexed by forcing the midfoot, which would break through the arch"],
          ["4. Maintenance", "A foot-abduction brace ( Denis Browne bar with the feet turned outwards 60-70°) worn 23 hours a day for three months, then at night until age 4-5", "Recurrence is common and is almost always caused by non-compliance with the brace"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The Ponseti method works because it treats the ligaments and not the bones: in a newborn the tarsal bones are largely cartilaginous, so a sustained gentle load remodels them. It is non-operative in about 90% of cases and it produces a supple, painless, plantigrade foot. Postero-medial soft-tissue release, the operation that preceded it, produced a stiff foot that was painful and degenerated in adult life — which is why the Ponseti method has replaced it as the first-line treatment everywhere.",
      },
      {
        type: "question",
        prompt: "A newborn has a foot that is turned down and in, with a deep medial crease, thin calf, and it cannot be passively corrected to neutral. What is the diagnosis and the first step in treatment?",
        answer: "True congenital talipes equinovarus, not a positional foot, because it will not correct passively. The first step is to start the Ponseti method within the first weeks: weekly manipulation and the first long-leg cast. A percutaneous Achilles tenotomy is usually needed at the end of the casting to correct the equinus, followed by a foot-abduction brace.",
        explanation: "The distinguishing test is passive correctability: a positional foot corrects and needs nothing; a true club-foot needs serial correction before the cartilage stiffens. Waiting past the first months makes correction harder and the result poorer.",
      },

      { type: "heading", level: 2, text: "Developmental dysplasia of the hip (DDH)" },
      {
        type: "definition",
        term: "Developmental dysplasia of the hip",
        text: "A spectrum in which the femoral head is not stably contained within the acetabulum: from mild dysplasia (a shallow acetabulum), through subluxatable (the head can be pushed to the edge but returns), to frankly dislocated (the head is out of the socket). 'Developmental' is the word because the condition evolves through infancy, and 'dysplasia' because the acetabulum may develop inadequately even when the head is in it.",
      },
      {
        type: "table",
        headers: ["Risk factor", "Why it matters"],
        rows: [
          ["Female sex", "Six to eight times more common than in boys; maternal relaxin is the traditional explanation"],
          ["Breech presentation", "The commonest risk factor; the risk is highest for a frank breech (hips flexed, knees extended)"],
          ["Family history", "A first-degree relative with DDH raises the risk substantially"],
          ["Firstborn and oligohydramnios", "A tight uterus restricts the hips in extension, so the head is not seated in the socket"],
          ["Association with other conditions", "CTEV, congenital muscular torticollis, arthrogryposis, and Down syndrome all raise the risk"],
        ],
      },
      {
        type: "paragraph",
        text: "Screening is by clinical examination and by selective ultrasound, and the two answer different questions. The clinical examination asks whether the hip is stable — can it be displaced? Ultrasound asks whether the femoral head is actually seated and the acetabulum is forming — an anatomical question in a hip that is clinically stable but shallow. Ultrasound before about four to six weeks gives false reassurance, because the acetabulum is still cartilaginous and shallow in every normal newborn.",
      },
      {
        type: "table",
        headers: ["Test", "Manoeuvre", "What a positive test means"],
        rows: [
          ["Ortolani", "The hip is flexed to 90° and abducted with gentle lifting pressure on the greater trochanter", "A clunk as the dislocated head reduces over the posterior lip into the socket — the sign of reduction. The Ortolani relocates"],
          ["Barlow", "The hip is flexed to 90° and adducted with gentle posterior pressure along the axis of the femur", "A clunk as the head passes over the posterior lip out of the socket — the sign of provocation. The Barlow dislocates"],
          ["Galeazzi", "With the hips and knees flexed, the knees are compared", "One knee is visibly lower: an apparent shortening of the femur, which in a newborn indicates a dislocated hip"],
          ["Ortolani versus Barlow", "Ortolani: reduce a dislocated hip. Barlow: dislocate a reducible hip", "Confusing the two is the classic error: the Ortolani is an abduction manoeuvre and the Barlow is an adduction and posterior pressure manoeuvre"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The Ortolani and Barlow tests are gentle. They are not a stress test: the hip is flexed to 90°, the knee is flexed, and a gentle pressure is applied with the pads of the fingers. The classic exam error is performing the Barlow as a forceful push — which can injure a hip it was meant to test. The tests are also of their time: they are useful in the first few months and become unreliable after about three months, because the hip becomes less lax and the test then produces nothing more than clicks.",
      },
      {
        type: "paragraph",
        text: "The late-diagnosed hip is a different disease. When the deformity is found after the child has been walking, the head has been walking outside the socket, the false acetabulum has partly formed, and the limb is shorter. These children present with a limp, with apparent shortening of the femur, with a waddling bilateral gait, and — if both hips are dislocated and the femora are driven up — with a lumbar lordosis that grows because the pelvis is tilted forward to keep the feet on the ground.",
      },
      {
        type: "table",
        headers: ["Age at diagnosis", "Presentation", "Treatment"],
        rows: [
          ["Newborn", "A positive Ortolani (reducible) or Barlow (dislocatable) test", "A Pavlik harness: the hip is held flexed and abducted, allowing the head to seat, for weeks to a few months"],
          ["1-6 months", "A hip that does not reduce by Ortolani; ultrasound and a plain film confirm", "Closed reduction under anaesthesia and a spica cast; a hip that will not reduce needs an open reduction"],
          ["After walking age", "A limp, apparent limb shortening, a waddling gait, Trendelenburg, excessive lordosis if bilateral", "Open reduction with femoral and acetabular osteotomies, because the anatomy has changed and no closed method will restore a congruent joint"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The two complications that dominate the outcome of DDH are avascular necrosis of the femoral head and residual dysplasia. Avascular necrosis can follow a reduction that was forced, a reduction that was performed in extreme abduction, or a reduction that was held too tightly for too long — so the reduction is gentle, and the position is not forced. And a hip that is reduced is not always a normal hip: acetabular development lags, and needs radiographic surveillance into childhood.",
      },

      { type: "heading", level: 2, text: "Torticollis and the other congenital conditions" },
      {
        type: "definition",
        term: "Congenital muscular torticollis",
        text: "A fibrosis and contracture of the sternocleidomastoid muscle, present at or shortly after birth, producing a fixed lateral tilt of the head toward the affected side and a rotation of the chin to the opposite side. A firm, non-tender mass is often palpable in the muscle in the first weeks and then disappears.",
      },
      {
        type: "table",
        headers: ["Aspect", "Congenital muscular torticollis"],
        rows: [
          ["Mechanism", "Birth trauma or intrauterine position causing a haematoma and then fibrosis within the sternocleidomastoid"],
          ["Presentation", "The head is tilted to the affected side and the chin points away; a firm mass in the muscle in the infant; the head flattens on one side (positional plagiocephaly) because the child never lies flat"],
          ["Natural history", "Most resolve with stretching physiotherapy in the first year, guided by the parents"],
          ["Surgery", "A sternomastoid release (usually bipolar) if the contracture persists past 12-18 months and facial asymmetry is developing"],
          ["The exam answer", "Always exclude a neurological and an ocular cause: a child with torticollis has to have the eyes (a squint causing a head tilt) and the cervical spine examined, and Klippel-Feil and ocular causes are the differentials, not just the neck"],
        ],
      },
      {
        type: "table",
        headers: ["Other congenital limb conditions", "What it is", "Key point"],
        rows: [
          ["Radial club hand (radial deficiency)", "Absence or hypoplasia of the radius, with the hand deviated radially; a forearm that is short and a thumb that may be absent", "Look for the associated conditions: Holt-Oram (heart), VACTERL, thrombocytopenia (TAR); do not operate the shoulder"],
          ["Ulnar deficiency", "Hypoplasia of the ulna with the hand deviated toward the ulna", "Less common than radial deficiency, less likely to recur, and usually a better functional outcome"],
          ["Cleft hand (lobster claw)", "A longitudinal deficiency of central rays; the hand has a deep cleft and the fingers are fused into two groups", "Reconstruction aims to close the cleft and oppose the two groups, rather than to make a normal number of digits"],
          ["Syndactyly", "Fusion of adjacent digits, cutaneous (skin only) or osseous (bone shared)", "Operate before the child is two, because differential growth changes the deviation of the digits; never separate a syndactyly with both sides at once on the same digit"],
          ["Polydactyly", "Supernumerary digits; pre-axial (radial, thumb side) or post-axial (ulnar, little finger side)", "The extra little finger is commonest, is often a skin tag with no bone, and is amputated in the newborn period, not delayed"],
          ["Trigger thumb", "A nodule in the flexor pollicis longus tendon that catches at the A1 pulley, so the thumb is fixed in flexion", "Present from birth in many cases; observation until about a year, then a release of the A1 pulley"],
          ["Cerebral palsy (the orthopaedic consequences)", "Spasticity produces equinus, adduction and internal rotation of the hip, and later a fixed contracture and hip subluxation", "Early orthopaedic input is to preserve range and monitor the hip; hip surveillance is the highest-yield intervention"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A recurrent theme in congenital orthopaedics is that the operation follows the growth. Syndactyly is separated early because the fingers grow at different lengths and a fused pair will deviate. A congenital trigger thumb is not released in the newborn because it often resolves. A dislocated hip that is reduced in the newborn needs a spica cast for weeks; a hip that is reduced at a year needs a different operation; a hip that is reduced at five years needs an osteotomy. The condition and the age together determine the operation.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling a positional foot a club-foot. The diagnosis of CTEV requires the inability to correct the deformity passively. A newborn whose foot is turned in because of intrauterine position corrects fully, has a normal heel and normal calf, and needs only stretching. Diagnosing it as CTEV commits the family to months of casting that will do nothing, and raising the level of alarm for no reason.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reversing the Ortolani and Barlow manoeuvres. The Ortolani is an abduction manoeuvre: it reduces a dislocated hip, with a clunk. The Barlow is an adduction and posterior pressure manoeuvre: it dislocates a reducible hip, with a clunk. Reversing them will either fail to find the hip or, worse, dislocate a hip that was previously stable.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Casting a club-foot with the equinus corrected first. The Ponseti sequence is cavus, then adduction and varus, then equinus last (with a tenotomy if needed). Correcting the equinus first forces the midfoot to rock through, creating a rocker-bottom foot that cannot be rehabilitated.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to examine the hips of a child with a club-foot, or the neck of a child with a hip condition. CTEV and DDH coexist more often than chance, and congenital muscular torticollis must be separated from a cervical spine abnormality and a squint before the neck is treated. Congenital malformations arrive in groups, not in isolation.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Name the four elements of congenital talipes equinovarus and the single clinical test that distinguishes it from a positional foot.",
        answer: "Equinus (plantarflexed ankle), varus (heel turned inward), adductus (forefoot turned inward) and cavus (a high arch). The test is passive correctability: a true club-foot will not correct to neutral with gentle manipulation, while a positional foot corrects fully and has no deep medial crease, thin heel, or wasted calf.",
        explanation: "The clinical exam is the diagnosis. Radiographs in a newborn add little, because most of the foot is cartilage and the ossific centres have not appeared.",
      },
      {
        type: "question",
        prompt: "Describe the difference between the Ortolani and the Barlow test, and state what each detects.",
        answer: "The Ortolani reduces a dislocated hip: with the hip flexed to 90°, it is gently abducted with lifting pressure, and a clunk is the sensation of the head passing over the posterior lip into the socket. The Barlow dislocates a reducible hip: with the hip flexed and adducted with gentle posterior pressure, a clunk is the sensation of the head passing out of the socket. So the Ortolani detects a dislocated hip and the Barlow detects a hip that will dislocate.",
        explanation: "They are complementary: the Ortolani is the entry to the dislocated hip, the Barlow is the exit. Both must be done gently, both are done in the first weeks of life, and both are largely useless after about three months.",
      },
      {
        type: "question",
        prompt: "Why is ultrasound not used to screen every newborn hip, and when is it useful?",
        answer: "Because in the first weeks of life the acetabulum and femoral head are largely cartilaginous and the normal newborn has a shallow, immature socket, so ultrasound can label a normal hip as dysplastic. Ultrasound is useful from about four to six weeks onwards, and selectively in babies with risk factors (breech, female, family history) or with an abnormal or equivocal clinical examination.",
        explanation: "Screening has to separate 'a cartilage-rich, immature joint' from 'a joint that will not form properly'. The distinction is a matter of age as much as of imaging.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A newborn has a foot that is turned downward and inward with a deep medial crease and cannot be passively corrected to neutral. What is the first-line treatment?",
        options: [
          "Observation and stretching by the parents, since most such feet correct spontaneously in the first year",
          "The Ponseti method: serial weekly manipulation and long-leg plaster casts, usually with a percutaneous Achilles tenotomy, then a foot-abduction brace",
          "Postero-medial soft-tissue release of the foot, performed in the neonatal period",
          "Calcaneal osteotomy to correct the varus after skeletal maturity",
        ],
        correctIndex: 1,
        explanation: "The description is true congenital talipes equinovarus, not a positional foot, and the Ponseti method is the standard first-line treatment: weekly manipulation and casting to correct cavus, then adduction and varus, then equinus last (usually with a tenotomy), then a foot-abduction brace to prevent recurrence. Observation is not treatment for a foot that will not correct, and extensive soft-tissue release is now reserved for the resistant case.",
      },
      {
        type: "mcq",
        stem: "A newborn is screened with Ortolani's and Barlow's manoeuvres. Which description of these two tests is correct?",
        options: [
          "The Ortolani dislocates a reducible hip with adduction and posterior pressure; the Barlow reduces a dislocated hip with abduction",
          "The Ortolani reduces a dislocated hip with abduction and lifting pressure; the Barlow dislocates a reducible hip with adduction and posterior pressure",
          "Both tests measure the acetabular depth on an AP radiograph",
          "The Ortolani and Barlow are valid in children of any age, includingafter they have begun to walk",
        ],
        correctIndex: 1,
        explanation: "The Ortolani is an abduction manoeuvre that reduces a dislocated hip and produces a clunk as the head re-enters the socket. The Barlow is an adduction and posterior pressure manoeuvre that dislocates a hip that will slide out. Both are useful only in the first weeks or months, and both are performed gently — they are provocation and reduction, not force.",
      },
      {
        type: "mcq",
        stem: "A baby girl born in the breech position has a palpable clunk in the right hip on the Ortolani test. What is the initial treatment?",
        options: [
          "Open reduction of the hip and a spica cast",
          "A Pavlik harness, holding the hip flexed and abducted so that the femoral head seats in the acetabulum",
          "Immediate ultrasound to confirm the diagnosis, before any treatment, and review in three months",
          "Traction and then a femoral osteotomy at skeletal maturity",
        ],
        correctIndex: 1,
        explanation: "A reducible dislocated hip (a positive Ortolani) in the first weeks of life is treated with a Pavlik harness, which holds the hips flexed and abducted and allows the head to seat, as the acetabulum continues to develop around it. Surgery is reserved for the hip that does not reduce, and osteotomies are for the late-diagnosed hip where the anatomy has already changed.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Osteomyelitis & septic arthritis (fully authored)
// ---------------------------------------------------------------------------
function lesson7() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain why acute haematogenous osteomyelitis occurs at the metaphysis of a long bone and name the organism; distinguish acute osteomyelitis from septic arthritis by the age of the patient, the joint findings and the blood tests; apply the Kocher criteria to decide which child with a painful hip needs an arthrotomy; describe the investigation and management of both conditions, including why antibiotics must follow cultures; distinguish acute from chronic osteomyelitis and describe the features and treatment of Brodie's abscess; and list the differentials of a single painful joint in a child and in an adult.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2 (fractures and complications) and Lesson 4 (lower limb injuries, including the slipped capital femoral epiphysis and the child with knee pain). From Gross Anatomy I: the cancellous-metaphyseal bone and the growth plate, and the joints of the hip and knee.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Osteomyelitis",
        text: "Infection of the bone and its medullary cavity. Acute haematogenous osteomyelitis — the form of children — is caused by organisms carried in the blood and lodgment in bone; chronic osteomyelitis follows an untreated or inadequately treated acute infection, or infection of an open fracture or orthopaedic implant, and persists for months or years with dead bone (sequestrum) and a discharging sinus.",
      },
      {
        type: "paragraph",
        text: "One anatomical fact explains the biology. The metaphysis of a growing long bone is supplied by the nutrient artery, whose branches run in a hairpin loop towards the growth plate and then turn back — and in doing so, in the child, they empty into venous sinusoids in which the blood is slow and swirling rather than streaming. Anything carried in the bloodstream therefore tends to be dropped exactly there. Add the further fact that the area is relatively avascular on the far (epiphyseal) side of the plate, where the phagocytes cannot easily reach, and you have the reason for both the site and the tendency to become chronic.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The metaphyseal infection also explains a piece of paediatric anatomy that will be examined again and again: in infants under about 18 months, transmitsseal vessels cross the growth plate, so metaphyseal infection can spread into the epiphysis and the joint; after that age, the physis is an avascular barrier, so metaphyseal osteomyelitis stays out of the joint and the joint is only involved if the metaphysis is intracapsular — as in the hip, the shoulder and the elbow, where the metaphysis lies within the capsule.",
      },

      { type: "heading", level: 2, text: "Acute haematogenous osteomyelitis" },
      {
        type: "table",
        headers: ["Feature", "What you see"],
        rows: [
          ["Patient", "Usually a child aged 2-10, boys more than girls; a newborn or an immunocompromised adult in the less typical cases"],
          ["Organism", "Staphylococcus aureus in the great majority; Kingella kingae in the toddler; Salmonella in sickle cell disease; Mycobacterium tuberculosis anywhere tuberculosis is common"],
          ["Route", "Haematogenous — from a skin infection, a dental infection, or sometimes no identifiable source"],
          ["Site", "The metaphysis of a long bone, most often the distal femur, proximal tibia and proximal humerus; rarely the axial skeleton"],
          ["Symptoms", "Sudden onset of fever and malaise with a severe, deep, unrelenting pain in one limb; the child refuses to bear weight or move the limb (pseudoparalysis in the newborn)"],
          ["Signs", "Focal bony tenderness over the metaphysis, which is the earliest and most reliable sign; warmth and swelling develop late; the joint beside it is usually not irritable"],
          ["Investigations", "Raised CRP and ESR; a normal total white count in about half; blood cultures in about half; radiographs are normal in the first 10-14 days and then show periosteal reaction and lytic change. MRI is the imaging of choice for early marrow oedema"],
          ["Treatment", "IV antibiotics after blood cultures have been drawn (flucloxacillin or a cephalosporin; adjust to the organism); drainage of any subperiosteal or intraosseous abscess; splint for comfort; then oral antibiotics for a total of 4-6 weeks"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not wait for radiographic change before starting treatment. The plain film is normal for the first 10-14 days of the disease, by which time irreversible growth-plate and articular damage can have occurred. The diagnosis is clinical — fever, one focal point of bony tenderness, and raised inflammatory markers — and the imaging you need is MRI for early marrow change, not a plain film waiting to catch up.",
      },
      {
        type: "paragraph",
        text: "The natural history explains the urgency. Infection confined within the medullary canal raises the intramedullary pressure, which compresses the vessels that supply the cortex from within and additionally lifts the periosteum so that the cortical bone is deprived from outside as well. The result, if untreated, is a segment of dead bone — a sequestrum — that no antibiotic can reach and no immune cell can find. The infection then becomes a chronic abscess, and the surgery has to be done to remove bone that is already dead.",
      },

      { type: "heading", level: 2, text: "Septic arthritis" },
      {
        type: "definition",
        term: "Septic arthritis",
        text: "Infection within a synovial joint. It is a surgical emergency, because the articular cartilage is destroyed by the enzymatic effect of the pus and the bacterial toxins, and because the raised intra-articular pressure tamponades the epiphyseal blood supply.",
      },
      {
        type: "table",
        headers: ["", "Acute osteomyelitis", "Septic arthritis"],
        rows: [
          ["Age of onset", "Children, rarely adults", "Any age, with a peak in the young child and the elderly"],
          ["Site", "Metaphysis of a long bone", "A large joint — most often the hip in the child, the knee in the adult"],
          ["The joint", "The joint beside the bone is spared, and the child will move it gently (unless the metaphysis is intracapsular)", "The joint itself is the focus: held in a position of comfort, exquisitely tender, and rigid on attempted movement"],
          ["Temperature", "Usually febrile", "Usually febrile, but a newborn or an immunosuppressed patient may not be"],
          ["Organism", "Staphylococcus aureus; Kingella in toddlers; Salmonella in sickle cell", "Staphylococcus aureus in adults; the neonate with group B Streptococcus; Kingella in the child; Neisseria gonorrhoeae in a sexually active adult"],
          ["The emergency", "Drain an abscess", "Drain the joint. Every hour counts"],
        ],
      },
      {
        type: "paragraph",
        text: "In a child the differential diagnosis of the painful hip is the clinical problem that most often goes wrong, because the hip lies deep and the signs are indirect. Septic arthritis must be separated from transient synovitis, which is a benign post-viral inflammation that resolves in days, and from the slipped capital femoral epiphysis and Perthes' disease, which have their own management.",
      },
      {
        type: "table",
        headers: ["Differential", "How it is distinguished"],
        rows: [
          ["Septic arthritis", "Fever, inability to bear weight, systemic toxicity, raised CRP and WCC, an effusion on ultrasound; joint aspiration gives pus or organisms"],
          ["Transient synovitis (irritable hip)", "A mild or absent fever, a well child, a moderate CRP (< 2 mg/dL), a normal or low WCC, a small effusion, and symptoms that improve within days. The classic Kocher-discriminating picture: the child walks, but limps"],
          ["Perthes' disease (Legg-Calvé-Perthes)", "A child of 4-8 years with a painless or mildly painful limp, no fever, and avascular necrosis of the femoral head on the radiograph"],
          ["Slipped capital femoral epiphysis (SCFE)", "An obese adolescent with a limp, referred knee pain and obligatory external rotation on hip flexion; frog-leg radiographs are diagnostic (Lesson 4)"],
          ["Juvenile idiopathic arthritis", "A persistent effusion over weeks without fever; other joints involved; a raised ESR but a sterile aspirate"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A child who will not bear weight on a leg, refuses to move one hip, and has a fever is drained. Septic arthritis of the hip destroys the femoral head's articular cartilage within days, and the subcapital epiphyseal vessels are tamponaded by the intra-articular pressure, so the head also becomes avascular. The management is aspiration (or open arthrotomy), antibiotics, and follow-up radiographs for avascular necrosis — not observation, however well the child seems.",
      },

      { type: "heading", level: 2, text: "The Kocher criteria" },
      {
        type: "definition",
        term: "Kocher criteria",
        text: "Four clinical and laboratory predictors of septic arthritis (as opposed to transient synovitis) in a child with a painful hip: a history of fever, an inability to bear weight, an ESR above 40 mm/h, and a white cell count above 12 × 10⁹/L. The more of the four present, the higher the probability of sepsis, and the lower the threshold for joint aspiration.",
      },
      {
        type: "table",
        headers: ["Number of Kocher criteria present", "Predicted probability of septic arthritis", "Action"],
        rows: [
          ["0", "Under 0.2%", "Discharge with instructions and review; the picture is transient synovitis"],
          ["1", "Approximately 3%", "Consider ultrasound-guided observation or aspirate"],
          ["2", "Approximately 40%", "Aspirate the hip under image guidance"],
          ["3", "Approximately 93%", "Aspirate, and prepare for surgical drainage"],
          ["4", "Essentially 100%", "Immediate joint drainage and IV antibiotics"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The rule works because of two of the four criteria in particular: a history of fever and an inability to bear weight are the pair that separates septic arthritis from transient synovitis in the original study. When a child with an irritable hip walks into the room and is febrile, the ducks are already in a row. The CRP adds the strongest single discriminator in practice, and a CRP above 2 mg/dL with a high WCC pushes hard towards drainage.",
      },
      {
        type: "question",
        prompt: "A four-year-old has a fever of 39 °C, refuses to bear weight, has an ESR of 48 mm/h and a white cell count of 16 × 10⁹/L, and ultrasound confirms a hip effusion. What is the correct management?",
        answer: "Immediate admission, blood cultures, IV antibiotics, and urgent joint aspiration (or open arthrotomy and washout) of the hip. Four Kocher criteria are present, giving a probability of septic arthritis approaching 100%, and a septic hip is a surgical emergency.",
        explanation: "Aspiration both confirms the diagnosis (pus, organisms, and the sensitivity that determines the antibiotic) and drains the joint, which is the treatment. The pus destroys cartilage and the pressure tamponades the epiphyseal blood supply, so neither observation nor antibiotics alone are adequate.",
      },

      { type: "heading", level: 2, text: "Chronic osteomyelitis and Brodie's abscess" },
      {
        type: "definition",
        term: "Chronic osteomyelitis",
        text: "Osteomyelitis persisting for months or years, with necrotic bone (sequestrum), a cavity in which infection is walled off (the involucrum), recurrent discharging sinuses, and the risk of squamous-cell carcinoma developing in a sinus of long standing. It is managed surgically, not by antibiotics alone.",
      },
      {
        type: "definition",
        term: "Brodie's abscess",
        text: "A localised subacute intraosseous abscess, typically a small round lytic lesion in the metaphysis of the distal tibia or proximal femur of a child, with a surrounding rim of sclerosis and a relatively well patient who has weeks of deep, dull, night pain.",
      },
      {
        type: "table",
        headers: ["Feature", "Chronic osteomyelitis", "Brodie's abscess"],
        rows: [
          ["How it arises", "Untreated or inadequately treated acute infection; contamination of an open fracture; infection of an implant", "An acute infection that has been partially contained by a robust host response"],
          ["Radiograph", "Sequestrum (dense dead bone) within a cavity, periosteal new bone (involucrum), sclerosis, sometimes a sinus tract", "A small, round, well-defined lytic lesion with a sclerotic rim"],
          ["Treatment", "Radical debridement of all dead bone and infected tissue, culture-directed antibiotics, and reconstruction of any bone defect. Antibiotics alone cannot sterilise dead bone", "Curettage or drilling of the cavity plus antibiotics; usually it settles"],
          ["Prognosis", "The recurrence risk is high and the management is surgical by definition", "Excellent, provided it is recognised as an infection and not as a tumour"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A Brodie's abscess is the trap in the other direction: it looks like an osteoid osteoma or a eosinophilic granuloma on the film and has been misdiagnosed as a malignancy. But the story of a painful, boring night pain, deep and dull, in a metaphysis, with a rim of sclerosis, should prompt antibiotics and curettage — and the tissue grown on culture. If you are considering a bone biopsy for suspected tumour, chronic and subacute infection must be on the differential list too.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Waiting for a radiograph before treating osteomyelitis. The film is normal for 10-14 days in acute haematogenous osteomyelitis. The decision is made on fever, focal bony tenderness and the inflammatory markers; the imaging you want is an MRI showing marrow oedema. Starting antibiotics on the day of presentation is the difference between treating an infection and removing dead bone later.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Starting antibiotics before cultures are drawn. Once the first dose is in, the yield from blood and from joint aspirate falls dramatically and you are choosing antibiotics blind. Draw blood cultures (and aspirate the joint if the diagnosis is septic arthritis) first, then give the antibiotic — this is the standard 'two from the blood, then the drug' sequence.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a chronically discharging osteomyelitis with courses of oral antibiotics. Chronic osteomyelitis is a surgical disease: dead bone cannot be sterilised by antibiotics, because it has no blood supply to deliver the drug. The treatment is debridement of sequestra and infected tissue, and antibiotics around the surgery.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that a sore joint in an adult with a neuropathy, or a chronically painful joint in an immunocompromised patient, may be infected. The elderly diabetic with a hot, swollen knee and no fever, or the patient with rheumatoid arthritis on a biologic, has septic arthritis until proven otherwise — the absence of a fever is not the absence of pus.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does metastatic infection of bone lodge at the metaphysis of a long bone in a child?",
        answer: "The metaphysis is supplied by the terminal branches of the nutrient artery, which run in a hairpin loop towards the growth plate; in the child these empty into venous sinusoids in which blood flow is slow and turbulent, so circulating organisms settle out there. The area is also a relatively avascular, phagocyte-poor region on the epiphyseal side of the physis, so the infection establishes itself.",
        explanation: "The hairpin loop and the sluggish sinusoids are the anatomical explanation, and the same anatomy explains why the infection begins in the metaphysis and, in the infant with transphyseal vessels, spreads to the epiphysis and joint.",
      },
      {
        type: "question",
        prompt: "Name the four Kocher criteria and state the probability of septic arthritis when three are present.",
        answer: "A history of fever; inability to bear weight; an ESR above 40 mm/h; and a white cell count above 12 × 10⁹/L. When three of the four are present, the predicted probability of septic arthritis is approximately 93%; with all four, essentially 100%.",
        explanation: "The criteria quantify the threshold for joint aspiration, and the fever-plus-inability-to-walk pair does most of the discriminating work — a child with an irritable hip who is febrile and cannot bear weight has sepsis until the aspirate proves otherwise.",
      },
      {
        type: "question",
        prompt: "Why can chronic osteomyelitis not be eradicated with antibiotics alone, even with a prolonged course of culture-directed therapy?",
        answer: "Because the infection is walled off in dead bone that has no blood supply, so the antibiotic cannot reach the bacteria at an adequate concentration, and the host's phagocytes cannot reach them either. The dead bone (sequestrum) is a nidus that must be removed surgically, and antibiotics are given around that surgery.",
        explanation: "This is the same principle as an infected arthroplasty or a dead fragment in a non-union: source control is required, and antibiotics support but cannot replace it.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A four-year-old refuses to bear weight, has a temperature of 39 °C, ESR 48 mm/h and white cell count 16 × 10⁹/L; ultrasound confirms a hip effusion. What is the most appropriate immediate management?",
        options: [
          "Six weeks of oral flucloxacillin with outpatient follow-up and repeat radiographs",
          "Blood cultures followed by urgent joint aspiration (or open arthrotomy and washout) and IV antibiotics",
          "A short course of non-steroidal anti-inflammatory drugs and review in a week",
          "A frog-leg radiograph of the pelvis to exclude a slipped capital femoral epiphysis before treating",
        ],
        correctIndex: 1,
        explanation: "All four Kocher criteria are present, so this is a septic hip with essentially a 100% probability of septic arthritis. The management is cultures first, then urgent drainage of the joint and IV antibiotics. Joint aspiration is both diagnostic and therapeutic; waiting for a response to analgesia or imaging loses the cartilage of the femoral head.",
      },
      {
        type: "mcq",
        stem: "A six-year-old has fever, focal metaphyseal tibial tenderness and refusal to bear weight with raised ESR and CRP; early radiographs are normal but MRI shows marrow oedema with a subperiosteal collection. Which organism and management pairing is most appropriate?",
        options: [
          "Escherichia coli; oral antibiotics alone for two weeks",
          "Staphylococcus aureus; IV antibiotics after blood cultures and surgical drainage of the collection",
          "Kingella kingae; observation and serial radiographs",
          "Salmonella typhi; a course of antituberculous chemotherapy",
        ],
        correctIndex: 1,
        explanation: "Acute haematogenous osteomyelitis of childhood is caused by Staphylococcus aureus in the great majority. The management is blood cultures, then IV antibiotics, and surgical drainage of the proven subperiosteal or intraosseous collection. A normal early radiograph is expected and must not delay treatment; the MRI has shown both the marrow infection and the abscess.",
      },
      {
        type: "mcq",
        stem: "Which statement is correct about a Brodie's abscess compared with chronic osteomyelitis?",
        options: [
          "Both are managed the same way: prolonged oral antibiotics without surgery",
          "Brodie's abscess is a small, circumscribed subacute abscess usually cured by curettage and antibiotics; chronic osteomyelitis contains dead bone (sequestrum) and requires radical surgical debridement",
          "Brodie's abscess is a malignant lesion that requires a wide local resection",
          "Chronic osteomyelitis has no dead bone, whereas Brodie's abscess contains a large sequestrum",
        ],
        correctIndex: 1,
        explanation: "A Brodie's abscess is a localised subacute intraosseous abscess, cured by drainage of the cavity and antibiotics. Chronic osteomyelitis contains sequestrum — necrotic, avascular bone — which cannot be sterilised by any drug and must be removed surgically. Neither is treated with antibiotics alone.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Tuberculosis of spine & poliomyelitis (fully authored)
// ---------------------------------------------------------------------------
function lesson8() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe how tuberculosis spread to the spine and why it is a disease of paradiscal bone and skip lesions; recognise the clinical picture of Pott's disease — the insidious back pain, the night sweats, the constitutional symptoms and the cold abscess; describe the stages of radiographic destruction and the collapse that produces the kyphosis; list the neurological complications, in particular the difference between early- and late-onset paraplegia; state the principles of anti-tuberculous chemotherapy and the indications for surgical decompression and stabilisation; and explain the mechanism of poliomyelitis, the residual deformities it leaves, and the orthotic and surgical principles of its management.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Fractures & dislocations) and Lesson 7 (bone infection). You need the vertebrae and the spinal cord, the segmental innervation of the limbs, and the muscle groups tested at each level, from Gross Anatomy I.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Pott's disease",
        text: "Tuberculosis of the spine: haematogenous infection of the vertebral body, typically beginning in the anterior part of the body adjacent to the disc (paradiscal), spreading to the adjacent disc and then to the next vertebra, with little inflammatory reaction, late destruction and a tendency to form a cold abscess and a kyphotic deformity.",
      },
      {
        type: "paragraph",
        text: "Tuberculosis of bone teaches you a lesson about the difference between infection in bone and infection in a joint. Suppurative osteomyelitis is hot, fast and destructive within days, raising inflammatory markers and producing pus; tuberculous infection is cold, slow and indolent, raising them barely or not at all, producing caseous material rather than frank pus, and taking months to declare itself. That is why the diagnosis is made late, and why the patient presents with a deformity rather than with a fever.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Two words are the examinable core of this lesson. 'Paradiscal' — the infection starts in the anterior vertebral body next to the disc, and the disc is involved early, which distinguishes it from a pyogenic infection of bone, where the disc is resistant and involved late. 'Cold' — the abscess is not hot, red or tender, and it tracks along tissue planes to appear far from its source, which is why a psoas abscess points in the thigh.",
      },

      { type: "heading", level: 2, text: "How tuberculous infection reaches the spine" },
      {
        type: "paragraph",
        text: "The portal is almost always haematogenous, from a pulmonary (or occasionally gastrointestinal or genitourinary) focus, and the organism lodges in the highly vascular cancellous bone of the vertebral body. The pattern that follows has a predictable anatomy.",
      },
      {
        type: "table",
        headers: ["Pattern", "Where the infection starts", "What it destroys"],
        rows: [
          ["Paradiscal (commonest)", "The anterior part of the vertebral body adjacent to the intervertebral disc", "The disc space is destroyed early and the infection crosses into the next vertebra — contiguous involvement of two or more vertebrae with relative disc destruction early"],
          ["Central", "The centre of the vertebral body", "The body may collapse concentrically and be flattened into a vertebra plana, or balloon out"],
          ["Anterior", "The anterior surface of the body beneath the periosteum", "Multiple levels may be involved in a skip pattern, with the discs relatively spared at first"],
          ["Posterior", "The posterior elements — the pedicles, laminae and facets", "The neural arch is involved, so paraplegia can occur without the gross vertebral-body destruction of the other patterns; the pattern that is missed most often"],
          ["Appendiceal", "The transverse or spinous process", "A rare pattern, and a source of diagnostic confusion"],
        ],
      },
      {
        type: "paragraph",
        text: "The word 'cold' explains the path. Caseous material tracks along tissue planes with little reaction at its border, so infection from the dorsolumbar spine enters the psoas sheath and produces a psoas abscess that points below the inguinal ligament and appears as a lump in the groin or thigh; from the thoracic spine, it tracks along the chest wall; from the cervical spine, into the retropharyngeal space; and infection can travel along the perivertebral ligaments for many segments, giving the 'skip lesions' of multiple vertebrae with normal vertebrae between them.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A 'cold abscess' is a clinical description of the temperature of the swelling, not a dismissal of its seriousness. It is an abscess full of caseous material and viable mycobacteria; it will track, it will burst through the skin as a chronic sinus, and its presence in the groin or the flank without a hot, red, painful local reaction is one of the classic discriminating signs in a long-exam question.",
      },

      { type: "heading", level: 2, text: "Clinical features and stages" },
      {
        type: "table",
        headers: ["Stage", "Symptoms and signs", "Radiograph"],
        rows: [
          ["Stage I (stage of onset)", "Insidious back or neck pain, worse on movement and at night, stiffness, and the constitutional symptoms of tuberculosis — evening fever, night sweats, weight loss and anorexia. The child becomes irritable and stops playing", "Normal, or only slight disc-space narrowing and loss of the normal lordotic curve"],
          ["Stage II (stage of destruction)", "Pain increases; muscle spasm; a local tenderness and a palpable step in the spinous processes; abscess appears", "Reduction of the disc space, anterior osteoporosis, and destruction of the anterior vertebral bodies with a late paravertebral shadow"],
          ["Stage III (stage of collapse)", "The kyphotic deformity becomes obvious and fixed; the shoulders round forward in thoracic disease; the gait becomes short-stepped and guarded", "Vertebral collapse with anterior wedging, the angular kyphosis, and a paravertebral cold abscess"],
          ["Stage IV (stage of neural involvement)", "Paraplegia (Pott's paraplegia), with spasticity, hyperreflexia, a sensory level and bladder and bowel dysfunction", "The radiographic destruction that explains it: retropulsion of bone, granulation tissue or a sequestrum in the canal, or the severe kyphotic ridge over the cord"],
        ],
      },
      {
        type: "paragraph",
        text: "The management of the stage depends on the stage, which is the practical value of the classification. Stage I needs chemotherapy and nothing else. Stage II may need drainage of an abscess and, sometimes, surgery to correct a progressive deformity. Stage III usually needs surgical anterior decompression and stabilisation to stop the kyphosis. Stage IV is a surgical emergency.",
      },
      {
        type: "definition",
        term: "Pott's paraplegia",
        text: "Paraplegia complicating tuberculosis of the spine, classified as early-onset (within the first two years of active disease, from active inflammatory tissue, granulation, an abscess or a caseous sequestrum in the canal — a good prognosis with prompt decompression) or late-onset (years after the disease has healed, from a severe, rigid kyphotic ridge over the spinal cord — a poorer prognosis, because the cord is secondarily damaged).",
      },
      {
        type: "callout",
        variant: "info",
        text: "The early/late distinction is the examinable point, and it is a real difference for the patient. Early paraplegia is compression by active, soft, reversible inflammatory material, and prompt surgical decompression plus chemotherapy usually recovers it. Late paraplegia is a stretched, atrophic cord over a bony ridge, and the paralysis is partly irreversible no matter how well the decompression is done. So a paraplegia in a patient with a recent diagnosis and active disease is urgent; a paraplegia decades later in a healed kyphosis is a different and harder problem.",
      },

      { type: "heading", level: 2, text: "Diagnosis and management" },
      {
        type: "table",
        headers: ["Test", "What it gives"],
        rows: [
          ["Blood tests", "ESR is raised in about 80% and is useful for monitoring; CRP is usually normal or only slightly raised (in contrast to a pyogenic infection); anaemia and lymphocytosis are common"],
          ["Imaging — plain radiographs", "Disc-space narrowing, paradiscal vertebral destruction, paravertebral abscess shadows, and the kyphotic deformity. The earliest and cheapest test and the one that documents the deformity for comparison"],
          ["Imaging — MRI", "The investigation of choice: shows the extent of vertebral destruction, the disc involvement, the paravertebral and epidural abscess, and the degree of cord compression. Essential before any surgery"],
          ["Imaging — CT", "Defines the bony destruction and the canal in the later, more sclerotic stages better than any other modality"],
          ["Microbiology", "Aspiration or biopsy of an abscess, or of vertebral tissue; acid-fast smear and culture; nucleic acid amplification testing for rapid species and resistance identification. This is how the diagnosis is confirmed"],
          ["Histology", "Caseating granulomas with Langhans giant cells from the biopsy"],
        ],
      },
      {
        type: "table",
        headers: ["Treatment", "Principle"],
        rows: [
          ["Anti-tuberculous chemotherapy", "The mainstay: a multi-drug regimen (isoniazid, rifampicin, pyrazinamide and ethambutol for the intensive phase, then two drugs for the continuation phase) given for 9-12 months under direct observation. Never treat a suspected case without a specimen where a specimen can be obtained"],
          ["Rest and support", "A spinal brace or, historically, bed rest, in the earlier stages while the spine is at risk of collapse"],
          ["Surgical drainage", "Drainage of a large cold abscess, particularly when it threatens to burst or is causing symptoms"],
          ["Surgical decompression", "For neurological deficit, especially early-onset paraplegia: anterior decompression of the canal to remove the sequestrum, granulation tissue or pus"],
          ["Surgical stabilisation / correction", "For progressive or severe kyphosis: fusion and instrumentation, or corrective osteotomy in a fixed severe deformity. Indicated when the deformity is over about 60° or progressive"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The most important treatment rule: never start anti-tuberculous chemotherapy for a presumed spinal tuberculosis without attempting to obtain material for culture. The organism must be identified and its drug sensitivities known, because a partially treated infection with an unknown organism and unknown resistance is a disease that cannot be managed — and because abscess aspiration and biopsy are the same procedure that decompresses the patient.",
      },
      {
        type: "question",
        prompt: "A patient with back pain for eight months, weight loss and night sweats has a radiograph showing destruction of two adjacent vertebral bodies with early disc-space destruction and a large paravertebral shadow. What clinical feature would confirm your suspicion that this is tuberculosis rather than a pyogenic infection, and why?",
        answer: "The systemic picture: an indolent, months-long course of back pain with constitutional symptoms but little or no fever, a normal or near-normal CRP, and a 'cold' abscess — a swelling without heat, redness or local tenderness that has tracked along a tissue plane (a psoas abscess pointing in the groin). Pyogenic infection is hot, fast, exquisitely painful and floridly inflamed, and it produces systemic toxicity within days.",
        explanation: "The speed, the temperature and the disc: tuberculosis is a cold, slow, paradiscal infection; pyogenic osteomyelitis spares the disc early and raises CRP markedly. Culture confirms it, but the bedside features are the diagnosis.",
      },

      { type: "heading", level: 2, text: "Poliomyelitis" },
      {
        type: "definition",
        term: "Poliomyelitis",
        text: "An acute enteroviral infection, transmitted faeco-orally, which in less than 1% of infections reaches the nervous system and destroys the anterior horn cells of the spinal cord and the equivalent motor nuclei of the brainstem, producing an asymmetric flaccid paralysis with preserved sensation, and in its bulbar form, respiratory failure.",
      },
      {
        type: "paragraph",
        text: "The pathology explains every feature of the disease and every one of its deformities. The virus destroys the anterior horn cell — the final common path for the lower motor neuron — so the muscle it supplies becomes weak and then flaccid, its tendon reflex disappears, and it wastes with fasciculations. Sensation is untouched, because the posterior horn and the dorsal columns are spared. The paralysis is asymmetric because the virus attacks scattered groups of anterior horn cells rather than a whole segment at once. And because growth depends on muscle pull, the limb that is paralysed in childhood grows shorter than its fellow — which is the origin of the limb-length discrepancy that dominates the orthopaedic rehabilitation.",
      },
      {
        type: "table",
        headers: ["Feature", "Why it happens"],
        rows: [
          ["Asymmetric flaccid paralysis", "Scattered groups of anterior horn cells are destroyed, not a whole cord segment; and the lower motor neuron lesion produces flaccid, not spastic, weakness"],
          ["Preserved sensation", "The sensory pathways in the dorsal columns and the spinothalamic tract are spared"],
          ["Absent tendon reflexes and fasciculations", "The final common path is destroyed, so the reflex arc is broken and the surviving motor units are denervated"],
          ["Muscle imbalance", "Paralysis is uneven between agonist and antagonist, so the unopposed muscle wins, and the limb slowly takes up a fixed deformity — most commonly equinus at the ankle from an unopposed tibialis anterior, flexion-adduction at the hip, and recurvatum at the knee"],
          ["Shortening of the limb", "Muscle pull is required for normal growth of the bone: a paralysed limb is also a shorter limb, with the discrepancy growing as the child grows"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Two decades of eradication effort are undone by one missed vaccination schedule. In a region with under-immunised children, a febrile prodrome followed by an asymmetric flaccid weakness with areflexia and preserved sensation is poliomyelitis until proven otherwise, and the differential includes Guillain-Barré syndrome (symmetric, with sensory loss and a raised CSF protein without cells), transverse myelitis, and other enteroviruses. Public health notification is mandatory.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Prevention is the treatment, and it is one of the great public-health successes: oral polio vaccine (Sabin, live attenuated) and inactivated polio vaccine (Salk) have reduced wild poliomyelitis by more than 99% since 1988. The orthopaedic legacy in endemic regions is still a live problem, however, because the patients who were paralysed as children now present as adults with deformity, shortening and degenerative change.",
      },

      { type: "heading", level: 2, text: "Orthopaedic management of the residual paralysis" },
      {
        type: "table",
        headers: ["Problem", "Orthopaedic approach"],
        rows: [
          ["Fixed muscle imbalance", "Tenotomy or tendon transfer to rebalance the joint: transfer an unopposed, still-working muscle to the paralysed side, so that the joint is held in a functional position"],
          ["Equinus deformity of the foot", "A below-knee caliper (ankle-foot orthosis) to hold the ankle at 90°; a tendon lengthening or a triple arthrodesis for a fixed deformity in the older child or adult"],
          ["Genu recurvatum or flexion contracture", "An orthosis, or an osteotomy and fusion; the aim is a plantigrade foot, a straight knee and a hip that extends, so the patient can stand and walk"],
          ["Limb-length discrepancy", "Measured by scanography, and treated by an epiphyseodesis (arrest of the growing side) if the predicted discrepancy is moderate, or by limb lengthening if it is large"],
          ["Flail limb", "An orthosis that holds the joint stable without attempting muscle rebalancing; the patient uses the flail limb as a strut only"],
          ["Wheelchair and seating provision", "For the patient with a bilateral or extensive involvement, a properly fitted chair and a pressure-relief regimen to prevent pressure ulcers — the single most valuable intervention"],
        ],
      },
      {
        type: "paragraph",
        text: "The principle of tendon transfer deserves a sentence, because it is the most distinctive operation in this field. A transfer takes a muscle whose strength is Grade 4 (or better), whose antagonist is irreversibly paralysed, and which can be routed to replace a paralysed muscle of similar function. The transferred muscle loses one grade of power, so it is never done to a muscle that is weaker than Grade 4, and it is never done to a muscle that is already working adequately — the aim is to correct an imbalance, not to add muscle.",
      },
      {
        type: "question",
        prompt: "Why does a limb recovered from poliomyelitis end up shorter than its fellow, and when in the child's life does that discrepancy get worse?",
        answer: "Because longitudinal bone growth is driven by muscle pull across the physis; the more a muscle pulls during growth, the more the bone grows. A paralysed limb therefore grows less, and the discrepancy grows as the child grows, and it accelerates again during the adolescent growth spurt. It is measured, monitored, and treated by epiphyseodesis or lengthening.",
        explanation: "This is the origin of the leg-length discrepancy that dominates the orthopaedic assessment of the adult with old poliomyelitis, and the reason it is measured serially and not once.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Expecting a fever and a raised CRP in spinal tuberculosis. The disease is cold and indolent: the CRP is usually normal or only slightly raised, the ESR is raised in about 80% and is useful only for monitoring the response, and the patient may have had months of night pain with night sweats when they first present. Waiting for the laboratory picture of a pyogenic infection is waiting for something that will not come.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing posterior (neural arch) tuberculosis. The paradiscal pattern is the classic, but when the posterior elements are the site of disease, the cord can be compressed with little vertebral-body destruction and a relatively normal-looking plain film. A patient with a focal spinal tenderness, a neurological deficit, no systemic sign and an unimpressive radiograph still needs an MRI.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a poliomyelitis-like picture as a stroke or a cord lesion. Poliomyelitis is an asymmetric, flaccid, lower-motor-neuron paralysis with preserved sensation and normal CSF in most cases. The combination of asymmetry, flaccidity, areflexia and intact sensation is the diagnosis at the bedside.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Operating on a fixed deformity in a young child before the paralysis is stable. Muscle balance changes over the two years after the acute illness, so a transfer or a tenotomy done too early may be wrong when the paralysis has matured. Assess repeatedly, operate only when the weakness has been static, and protect growth in the meantime with an orthosis.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Give the four clinical stages of Pott's disease with the radiographic finding at each.",
        answer: "Stage I (onset): insidious back pain, stiffness, constitutional symptoms, with a normal film or only slight disc narrowing. Stage II (destruction): increasing pain, spasm, tenderness, a step in the spinous processes and possibly an abscess, with disc-space reduction and anterior vertebral destruction. Stage III (collapse): a fixed angular kyphotic deformity and guarded gait, with vertebral collapse and anterior wedging. Stage IV (neural involvement): paraplegia, with destruction, retropulsed bone or granulation in the canal.",
        explanation: "The stages determine the treatment: Stage I is chemotherapy alone, Stage II may need drainage, Stage III needs surgical stabilisation, and Stage IV is an emergency decompression.",
      },
      {
        type: "question",
        prompt: "How does tuberculous infection reach the psoas sheath and why does a psoas abscess appear in the groin?",
        answer: "The dorsolumbar spine is closely related to the psoas sheath, and tuberculous infection tracking from the anterior vertebral body enters that sheath as a cold abscess. The pus extends along the psoas muscle beneath the inguinal ligament and points below it, presenting as a fluctuant, non-tender swelling in the femoral triangle or the upper thigh.",
        explanation: "This is the classic 'cold abscess' that examines — an abscess with no local heat or tenderness, appearing a long way from its origin, because caseous material tracks with little inflammatory reaction at its border.",
      },
      {
        type: "question",
        prompt: "What are the five orthopaedic consequences of a childhood poliomyelitis?",
        answer: "Fixed deformity from muscle imbalance (equinus, flexion, recurvatum); limb shortening; joint instability from unbalanced forces; a flail limb where paralysis is complete; and secondary degenerative change in later adult life from years of abnormal loading.",
        explanation: "All five come from the same root cause — the asymmetric destruction of anterior horn cells, which leaves some muscles working and others wasted, and slows growth of the affected limb.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 45-year-old with back pain, night sweats and weight loss has MRI showing contiguous involvement of three vertebral bodies with relative sparing of the discs and a large paravertebral cold abscess. Which statement best characterises this disease?",
        options: [
          "It spreads through the bloodstream and lodges in cancellous bone, caseous material tracking with little local reaction",
          "It is a pyogenic infection of the disc that spreads rapidly to the vertebral bodies",
          "It is caused by direct extension from a paravertebral lymph node",
          "It is a metastatic carcinoma that destroys the vertebral bodies and spares the discs",
        ],
        correctIndex: 0,
        explanation: "Spinal tuberculosis is a haematogenous infection that lodges in the cancellous bone of the vertebral body, spreads subligamentously and paradiscally, produces caseous material with little local reaction (a cold abscess), and gives a protracted, indolent course. The relatively spared disc is not universal, but the insidious course with constitutional symptoms and a cold abscess is the characteristic picture, and the diagnosis is confirmed on biopsy and culture.",
      },
      {
        type: "mcq",
        stem: "A 2-year-old in an under-immunised area has a febrile prodrome and then asymmetric flaccid weakness of the legs with absent tendon reflexes, fasciculations and preserved sensation. Which mechanism underlies the paralysis?",
        options: [
          "Destruction of the anterior horn cells of the spinal cord by the poliovirus",
          "Demyelination of the corticospinal tracts in the spinal cord",
          "Autoimmune attack on the neuromuscular junction",
          "Infarction of the spinal cord from a thromboembolic event",
        ],
        correctIndex: 0,
        explanation: "Poliovirus destroys the anterior horn cells — the lower motor neurons — producing an asymmetric, flaccid paralysis with absent reflexes, fasciculations and wasting, and preserved sensation because the sensory pathways are untouched. This is the opposite of the upper-motor-neuron picture produced by corticospinal tract disease, which gives spasticity and hyperreflexia.",
      },
      {
        type: "mcq",
        stem: "Which statement about anti-tuberculous chemotherapy in Pott's disease is correct?",
        options: [
          "A short 6-week course is sufficient if the ESR has fallen to normal by the end of it",
          "It is the mainstay of treatment, given as a multi-drug regimen for 9-12 months, with surgical decompression for neurological deficit and stabilisation for progressive kyphosis",
          "It is only started after surgical debridement, because chemotherapy alone never cures the disease",
          "A single drug is started immediately and further drugs added when the culture and sensitivities are known",
        ],
        correctIndex: 1,
        explanation: "Chemotherapy is the mainstay: an intensive multi-drug phase and a continuation phase, for a total of 9-12 months, with surgery reserved for drainage of abscesses, decompression of the cord in paraplegia, and correction of progressive kyphosis. Monotherapy is never used because it breeds resistance, and the ESR is a monitoring tool, not a treatment endpoint.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Bone tumours (fully authored)
// ---------------------------------------------------------------------------
function lesson9() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the red flags that separate a tumour from infection, injury or arthritis; describe the classic patient, site and radiographic appearance of the common benign bone lesions; describe the two commonest primary malignant bone tumours and their radiographic signatures; explain the significance of a metastasis or myeloma in a patient over 40 with a destructive bone lesion; describe the approach to investigating an undiagnosed bone lesion; and state the principles of biopsy and of surgical treatment of a malignant bone tumour.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Fractures & dislocations) — including pathological fractures — and Lesson 7 (bone infection, which is the main differential). No oncology is assumed.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Bone tumour",
        text: "A neoplasm arising within bone, classified by its cell of origin (osseous, cartilaginous, fibrous, marrow, vascular, unknown), by its behaviour (benign, locally aggressive/ intermediate, malignant), and by its district of origin (intramedullary, intracortical, surface).",
      },
      {
        type: "paragraph",
        text: "The single question that separates a bone tumour from everything else in musculoskeletal disease is time. Infection declares itself over days, a fracture over seconds, arthritis over months with the whole joint involved. A tumour grows over months, produces pain that is constant rather than activity-related, and produces a mass that the patient can feel. When a patient says that the pain is present at rest, wakes them at night, and has nothing to do with what they have been doing, the tumour box has been ticked and it is your job to exclude it.",
      },
      {
        type: "table",
        headers: ["Feature", "Tumour", "Infection", "Injury"],
        rows: [
          ["Duration", "Weeks to months of steadily worsening pain", "Days, with a febrile illness", "Immediate, after an event"],
          ["Pain character", "Constant, boring, night pain, unrelated to activity", "Constant, throbbing and severe, with a fever", "Sharp at the moment, then related to movement"],
          ["Systemic features", "Weight loss in a malignancy; otherwise well", "Fever, malaise and anorexia; raised CRP and WCC", "None"],
          ["Mass", "A growing mass that the patient may have noticed", "Swelling is hot, red and tender", "Swelling is soft-tissue haematoma"],
          ["Inflammatory markers", "Normal (or a mildly raised ALP)", "Raised CRP, ESR and WCC", "Normal"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The four red flags to quote and never to dismiss: night pain that wakes the patient; pain that is constant and unrelated to activity; a palpable, enlarging mass; and a pathological fracture after a trivial mechanism. Any one of them, in a patient over 40, means you are looking for a metastasis or a myeloma before you are looking for anything else.",
      },

      { type: "heading", level: 2, text: "Benign bone lesions" },
      {
        type: "table",
        headers: ["Lesion", "Age and site", "Radiograph", "Clinical point"],
        rows: [
          ["Simple (unicameral) bone cyst", "Children and adolescents; the proximal humerus and proximal femur", "A well-defined central lytic lesion in the metaphysis, expanding the cortex thinly, with a fallen fragment sign after a fracture", "Often presents as a pathological fracture; heals at skeletal maturity; injection or curettage if symptomatic"],
          ["Aneurysmal bone cyst", "Under 20; the metaphysis of a long bone or the spine", "An eccentric, expansile, 'blow-out' lytic lesion with a thin cortical shell and fluid levels on MRI", "Grows aggressively and can be mistaken for a malignancy; treated by curettage and grafting"],
          ["Fibrous cortical defect / non-ossifying fibroma", "Children; the distal femur and distal tibia", "A small eccentric cortical scallop with a sclerotic rim", "Common, incidental and self-limiting — it ossifies and disappears"],
          ["Osteochondroma (exostosis)", "Adolescents; a bony outgrowth from the metaphysis, capped with cartilage", "A pedunculated or sessile exostosis continuous with the cortex and medulla", "Hereditary multiple exostoses when many; the risk is a malignant change (< 1%) heralded by pain and a growing cartilage cap"],
          ["Enchondroma", "Any age; the small bones of the hand and feet", "A central lytic lesion with chondroid ring-and-arc calcification", "Benign but must be watched in a long bone or the pelvis; multiple in Ollier's disease / Maffucci's syndrome"],
          ["Giant cell tumour (osteoclastoma)", "20-40 years; the epiphysis of a long bone, abutting the joint, around the knee", "A purely lytic, expansile epiphyseal lesion reaching the articular surface", "Locally aggressive; complete curettage and grafting or a wide excision; recurs and can metastasise to the lung"],
          ["Osteoid osteoma", "Children and young men; the cortex of a long bone, the femoral neck, the spine", "A small radiolucent nidus under 1.5 cm with dense surrounding sclerosis", "Night pain relieved dramatically by NSAIDs; treated by radiofrequency ablation or excision"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Three 'shortcuts' that are worth memorising. Location tells you the lesion: a cyst is central and metaphyseal, a giant cell tumour is epiphyseal and reaches the joint, a fibrous cortical defect is eccentric and cortical. Shape tells you the behaviour: a well-defined sclerotic rim is benign and slow, an ill-defined permeative margin is aggressive and malignant. Age tells you the age: a lesion in the young is more likely benign; a lesion after 40 is more likely a metastasis.",
      },

      { type: "heading", level: 2, text: "Malignant bone tumours" },
      {
        type: "definition",
        term: "Osteosarcoma",
        text: "A high-grade malignant tumour of bone whose cells produce osteoid. It is the commonest primary malignant tumour of bone, peaks in the second decade around the growth spurt, and classically arises in the metaphysis of a long bone near the knee — the distal femur, the proximal tibia, the proximal humerus.",
      },
      {
        type: "table",
        headers: ["", "Osteosarcoma", "Ewing's sarcoma"],
        rows: [
          ["Cell of origin", "Bone-forming (mesenchymal) cells producing osteoid", "A primitive neuroectodermal cell, of uncertain lineage"],
          ["Typical age", "10-25 years, around the growth spurt", "5-15 years, in the first two decades"],
          ["Typical site", "Metaphysis of a long bone: distal femur, proximal tibia, proximal humerus", "Diaphysis of a long bone, and the flat bones of the pelvis and chest wall"],
          ["Radiograph", "A destructive metaphyseal lesion with mixed sclerosis and lysis, a Codman triangle (periosteum lifted at the margin), sunburst spiculation, cortical destruction and a soft-tissue mass with ossification", "A permeative, 'moth-eaten' medullary lesion in a diaphysis with an onion-skin (lamellated) periosteal reaction and a large soft-tissue mass"],
          ["The serum marker", "Alkaline phosphatase raised in proportion to the tumour burden; a normal value after successful treatment is reassuring, and a rising one suggests recurrence", "LDH often raised; the EWSR1-FLI1 (or ERG) translocation is the molecular signature"],
          ["Metastases", "Lungs, bone, and rarely skip lesions in the same bone; 80% of patients present without visible metastasis", "Lungs, bone and marrow; the marrow involvement is why bone marrow biopsy is done"],
          ["Treatment", "Neoadjuvant chemotherapy, wide surgical resection (limb-salvage where possible), then adjuvant chemotherapy; radiotherapy is only for unresectable or residual disease", "Chemotherapy is the mainstay (the tumour is highly radiosensitive), plus local control by surgery or radiotherapy; radiotherapy is much more central than in osteosarcoma"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The classic trap is treating the first symptom. A teenager with a painful knee and a radiographic 'knee injury' has sometimes been treated for months with physiotherapy before someone radiographs the femur — and the osteosarcoma in the distal femoral metaphysis has been growing the whole time. Any young patient with persistent, unexplained, night-time bone pain needs a radiograph of the site of the pain, not of the knee that hurts.",
      },
      {
        type: "paragraph",
        text: "After 40, the arithmetic changes completely. In a patient over forty with a destructive bone lesion, the diagnosis is a metastasis or myeloma until proven otherwise — primary bone sarcoma in that age group is rare, and a 'bone scan-plus-long-bone-series' work-up comes before any discussion of a primary bone tumour.",
      },
      {
        type: "table",
        headers: ["Tumour", "Patient and site", "Clinical signature"],
        rows: [
          ["Metastatic carcinoma", "Any adult, more often over 40; the axial skeleton, the proximal femur, the humerus and the ribs — anywhere there is red marrow", "Pain, a pathological fracture, and sometimes a raised calcium or alkaline phosphatase. The commonest tumours that metastasise to bone are breast, prostate, lung, kidney and thyroid. A lytic lesion in the proximal femur with a fracture is the classic presentation"],
          ["Multiple myeloma", "A patient over 50, more often men; the spine, ribs, skull, pelvis and proximal femur", "Bone pain, anaemia, renal impairment, hypercalcaemia, recurrent infections and 'punched-out' lytic lesions with no sclerosis — and a normal alkaline phosphatase. Diagnosed on serum protein electrophoresis, a monoclonal band, and marrow biopsy"],
          ["Chondrosarcoma", "Middle-aged and older adults; the pelvis, the shoulder girdle, the proximal femur", "A slowly expanding cartilaginous tumour with ring-and-arc calcification, a bulky soft-tissue mass, and pain; treated by wide resection because it is not chemosensitive or radiosensitive"],
          ["Chordoma", "Adults; the sacrum and the clivus (the residual notochord)", "A midline lesion in the sacrum with bladder and bowel symptoms, or in the clivus with cranial nerve palsies; slowly growing and locally destructive"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The 'blastic and sclerotic' lesion is not always prostate cancer, and the 'purely lytic with no sclerosis and a normal alkaline phosphatase' lesion is not always a myeloma — but they are both worth knowing as the rule rather than the exception. Prostate metastases are osteoblastic; breast, kidney, thyroid and lung metastases are typically lytic; myeloma produces purely lytic lesions with no reactive sclerosis and does not raise alkaline phosphatase, because the tumour is not forming bone.",
      },

      { type: "heading", level: 2, text: "Investigating a bone lesion" },
      {
        type: "paragraph",
        text: "The order of investigation is principled and even a junior should be able to justify it. Radiograph first, because it is cheap and gives the pattern; then MRI, which defines the marrow and soft-tissue extent; then CT for cortical detail and for the chest in a malignancy; then a bone scan for the whole skeleton and for skip lesions; then, and only then, a biopsy.",
      },
      {
        type: "table",
        headers: ["Investigation", "What it tells you", "The rule"],
        rows: [
          ["Plain radiographs in two planes", "The site (central/eccentric, metaphyseal/epiphyseal/diaphyseal), the pattern of destruction (geographic, moth-eaten, permeative), matrix mineralisation, and the periosteal reaction", "Always the first image, and always two views at right angles"],
          ["MRI", "The intramedullary extent, the soft-tissue mass, the relationship to the neurovascular bundle and the joint line — everything that determines whether the limb can be saved", "The staging investigation of a malignant bone tumour"],
          ["CT", "Cortical breach, the matrix, and particularly the lungs and the mediastinum for metastasis", "CT chest for staging; CT pelvis for a lesion the MRI cannot resolve"],
          ["Whole-body bone scan (isotope bone scan)", "Skeletal multplicity and skip lesions", "Once a malignant bone tumour is suspected, before biopsy"],
          ["PET-CT", "Metabolic activity, systemic extent and treatment response", "Increasingly used for both staging and response assessment"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The biopsy is the last step, and it is planned as if it were the first part of the operation. A poorly placed biopsy track can seed a tract that must later be excised with the tumour, and a badly planned biopsy can contaminate a compartment that could have been resected safely. It is done by the surgeon who will do the resection, through the muscle that will be resected with the tumour, and never in a longitudinal incision that sends the track through the joint. Do not biopsy before the imaging is complete and before the referral has been made — a biopsy done in a district hospital has ended more limb-salvage attempts than radiation has.",
      },
      {
        type: "theory",
        prompt: "Why is a biopsy of a suspected osteosarcoma performed by the surgeon who will perform the definitive resection, and why does the route of the biopsy matter as much as the specimen?",
        modelAnswer: "The biopsy track is contaminated tissue: any malignant cell that seeds the needle track or the incision will grow there, and if that tract passes through a compartment that could have been resected cleanly, the possibility of a limb-salvage operation is lost — the whole compartment must be resected, and the limb is amputated instead. For the same reason the biopsy is taken through the muscle that will be removed with the tumour (not between muscles, where the tract cannot be excised), and not in a longitudinal incision that runs along the limb or crosses a joint, because that spreads the contamination across compartments. And because the extent of the tumour and its relationship to the neurovascular bundle and the joint line is what decides the operation, the biopsy comes after the MRI — doing it first risks a second, unnecessary procedure.",
        explanation: "The rule is one sentence: stage, then biopsy, through the muscle, by the operating surgeon. A biopsy that is technically perfect but badly placed is a surgical failure.",
      },

      { type: "heading", level: 2, text: "Pathological fracture" },
      {
        type: "definition",
        term: "Pathological fracture",
        text: "A fracture through bone weakened by a disease process, occurring after a mechanism that would not break normal bone. The diagnoses that must be excluded are osteoporosis (especially in the elderly), metastatic carcinoma, myeloma, a primary bone tumour, an osteomyelitis and a bone cyst.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The practical sequence in an older patient with a fracture of the proximal femur after a trivial fall: the fracture is fixed (that is the immediate problem), and the question 'why did this bone break?' is asked afterwards. A lesion that is clearly lytic on the film, or a fracture at a site with no explanation for the mechanism, warrants oncological staging — and the more common answer in the elderly is a metastasis, not a myeloma or a primary bone tumour.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing night pain to a 'sprain' or to growing pain. Growing pain is bilateral, in the evening, and has a normal examination. Nocturnal pain in a limb that is worse at night, constant, and unrelated to activity is a red flag for a bone tumour, and a radiograph of the site is the minimum response. It is the single most commonly missed serious diagnosis in paediatric orthopaedics.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading the lytic lesion as one or the other. A lytic, mildly expansile lesion with ring-and-arc calcification is a cartilage lesion (enchondroma or chondrosarcoma); a purely lytic lesion with no sclerosis in a patient over 50 with anaemia and renal impairment is a myeloma; a lytic lesion in a patient with a known primary is a metastasis; a sclerotic lesion with sunburst spiculation in a teenager is an osteosarcoma. The matrix is the message.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Biopsying a potentially malignant bone lesion before the imaging is complete, or by the wrong route. Stage the lesion, then biopsy through the muscle that will be resected, by the surgeon doing the resection. A badly planned biopsy has ended more limb-salvage attempts than a late diagnosis has.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming that a normal alkaline phosphatase excludes malignancy, or that a raised alkaline phosphatase proves malignancy. Alkaline phosphatase is raised in osteosarcoma and in Paget's disease, in osteoblastic metastases, and in growing children; it is normal in myeloma, because the plasma cell does not make bone. It is one data point in a differential that includes many.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Name the red flags that separate a bone tumour from infection, injury or arthritis.",
        answer: "Night pain that wakes the patient; constant pain unrelated to activity; a palpable or enlarging mass; a pathological fracture after a trivial mechanism; a lesion in a patient over 40; normal inflammatory markers with persistent symptoms; and no response to rest or to simple analgesia. Weight loss and anaemia add weight to a malignancy.",
        explanation: "Time, pattern and mass are the discriminators, and each of these flags is a reason to obtain a radiograph of the site of the pain rather than of the joint that hurts.",
      },
      {
        type: "question",
        prompt: "How does the radiographic appearance of an osteosarcoma differ from that of a Ewing's sarcoma?",
        answer: "An osteosarcoma is a metaphyseal, mixed lytic and sclerotic lesion with Codman's triangle (periosteum lifted at the tumour edge) and sunburst (radiating) spiculation, with malignant osteoid in a soft-tissue mass. A Ewing's sarcoma is a diaphyseal permeative, 'moth-eaten' lesion with a lamellated, 'onion-skin' periosteal reaction and a large soft-tissue mass without calcification.",
        explanation: "Two things are contrasted: the site (metaphysis versus diaphysis) and the periosteal reaction (spiculated versus laminated). In an MCQ, give the combination.",
      },
      {
        type: "question",
        prompt: "A 62-year-old with a known breast carcinoma and new pain over the proximal femur has a lytic lesion in the lesser trochanter. What is the likely diagnosis, and what are the two things you do?",
        answer: "A metastatic deposit (breast carcinoma is one of the five commonest to metastasise to bone). You stage her (CT chest, abdomen and pelvis; isotope bone scan; and the relevant serum markers and biochemistry including calcium) and you protect the bone — internal fixation for a lesion at high risk of fracture, or referral to the oncology service.",
        explanation: "A lesion in the proximal femur of a patient over 40 with a known primary is a metastasis until proven otherwise, and the immediate risk is a pathological fracture of a bone that is carrying the whole body's weight.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A 15-year-old boy has progressive distal thigh pain with a tender mass and raised alkaline phosphatase; the radiograph shows a destructive metaphyseal lesion with a Codman triangle and sunburst spiculation. Which is the most likely diagnosis?",
        options: [
          "Ewing's sarcoma",
          "Osteosarcoma",
          "Chondrosarcoma",
          "Multiple myeloma",
        ],
        correctIndex: 1,
        explanation: "A metaphyseal, destructive, osteoid-forming lesion with a Codman triangle, sunburst spiculation and a raised alkaline phosphatase in an adolescent is the classic presentation of osteosarcoma. Ewing's sarcoma is diaphyseal and permeative with an onion-skin reaction and typically has a normal alkaline phosphatase with a raised LDH; chondrosarcoma occurs in later adults with ring-and-arc calcification; myeloma is a disease of the over-50s.",
      },
      {
        type: "mcq",
        stem: "Which statement about the primary management of a suspected osteosarcoma is correct?",
        options: [
          "An urgent biopsy in the emergency department, before any further imaging",
          "A plain radiograph of the site, then MRI of the whole affected bone, CT of the chest for metastasis, and only then a planned biopsy by the surgeon who will perform the resection",
          "Immediate wide local excision without staging or biopsy",
          "Empirical chemotherapy for 6 weeks and a repeat radiograph to assess response",
        ],
        correctIndex: 1,
        explanation: "Staging precedes biopsy: the extent in bone and the soft tissue, and the presence of chest metastases, determine whether the limb can be salvaged and what the reconstruction will be. The biopsy is then planned by the operating surgeon and taken through the muscle that will be resected, because an incorrectly placed biopsy track or a needle track through a clean compartment can convert a limb-salvage operation into an amputation.",
      },
      {
        type: "mcq",
        stem: "Which single feature most strongly distinguishes a bone tumour from acute pyogenic osteomyelitis?",
        options: [
          "A raised alkaline phosphatase",
          "A destructive lesion visible on the radiograph",
          "A course of weeks to months of constant, night-time pain with normal inflammatory markers",
          "An age between 10 and 25 years",
        ],
        correctIndex: 2,
        explanation: "Time and pattern are the discriminators. Osteomyelitis declares itself over days, with fever and raised CRP, ESR and WCC; a bone tumour presents over weeks to months with constant night pain, no systemic toxicity and normal inflammatory markers (apart from a raised alkaline phosphatase in osteosarcoma). Age and a destructive film feature occur in both.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Spinal deformity (fully authored)
// ---------------------------------------------------------------------------
function lesson10() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the normal sagittal curves and define kyphosis, lordosis and scoliosis; distinguish structural from non-structural scoliosis at the bedside using the forward-bend test; describe the classification of adolescent idiopathic scoliosis (right thoracic, the Risser scale and curve magnitude) and say when observation, bracing and surgery are indicated; describe the clinical features and management of spondylolisthesis and spondylolysis; explain the red flags of back pain and the categories of differential; and outline the assessment, imaging choice and management of the adult with back pain.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-2 (fractures and their complications) and Lesson 9 (bone tumours, which is the differential for a destructive spinal lesion). From Gross Anatomy I: the vertebrae, the intervertebral disc, the facet joints and the spinal cord.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "The spine is a series of curves that balance each other, and spinal deformity is a disturbance of that balance. In the sagittal plane the curves alternate: the thoracic spine is kyphotic and the cervical and lumbar spines are lordotic, and the sum of the curves keeps the head and the trunk centred over the pelvis. In the coronal plane the spine is straight. When a curve appears in the wrong plane, or a curve in the right plane becomes too large, the whole balance must correct somewhere else — and it is that correction, more than the curve itself, that produces the symptoms.",
      },
      {
        type: "table",
        headers: ["Curve", "Normal", "Too much", "Too little"],
        rows: [
          ["Cervical and lumbar (lordosis)", "Concave posteriorly — the convexity faces anteriorly", "Hyperlordosis — a swayback; from obesity, a spondylolisthesis, a fixed hip flexion contracture, or a compensation for a thoracic kyphosis", "A flat back, from spasm or a rigid posture"],
          ["Thoracic (kyphosis)", "Convex posteriorly, between 20° and 45°", "Hyperkyphosis ('round back'); from Scheuermann's disease, a compression fracture, ankylosing spondylitis, or tuberculosis (Pott's kyphosis)", "Reduced or reversed kyphosis (flat back)"],
          ["Either (scoliosis)", "Straight in the coronal plane", "Lateral curvature of more than 10°, with rotation of the vertebral bodies", "—"],
        ],
      },
      {
        type: "definition",
        term: "Scoliosis",
        text: "A lateral curvature of the spine in the coronal plane, conventionally defined as a curve of more than 10° measured by the Cobb method, and always associated with rotation of the vertebral bodies towards the convexity of the curve, which is what produces the rib hump.",
      },
      {
        type: "definition",
        term: "Kyphosis and lordosis",
        text: "Kyphosis is a posteriorly convex curvature and lordosis a posteriorly concave one. The words describe the direction of the curve, so the same word can be applied correctly to the thoracic spine (which is kyphotic) and to a pathological lumbar curvature that is also posteriorly convex.",
      },

      { type: "heading", level: 2, text: "Scoliosis" },
      {
        type: "paragraph",
        text: "The first clinical question is always whether the curve is structural. A structural curve is fixed: it does not correct when the patient is made to bend, and it rotates. A non-structural (postural) curve corrects completely on forward bending and on side-lying or traction, and has no rotation. The reason they are distinguished at the bedside is that the structural one is the disease and the postural one is only a habit.",
      },
      {
        type: "definition",
        term: "Adam's forward bend test",
        text: "The patient bends forward at the waist with the knees straight and the hands together, while the examiner views the back from behind along the line of the spine. A structural curve shows a rib hump on the convex side (from rotation of the vertebral bodies carrying the ribs backwards), a prominence of the lumbar paravertebral muscles on the concave side, and a curve that remains on bending. A non-structural curve flattens completely.",
      },
      {
        type: "table",
        headers: ["Type of scoliosis", "Proportion", "Cause and pattern"],
        rows: [
          ["Adolescent idiopathic (AIS)", "About 80% of all scoliosis", "A structural curve of unknown cause, appearing at or just after the onset of the pubertal growth spurt; much commoner in girls, and the progressive thoracic curve needing treatment is 8-10 times commoner in girls"],
          ["Neuromuscular", "The next commonest group", "Cerebral palsy, muscular dystrophy, spina bifida, poliomyelitis, spinal muscular atrophy: paralysis and spasticity produce a long, C-shaped curve that progresses throughout growth and often continues after growth ends"],
          ["Congenital", "A small proportion", "A failure of formation (hemivertebra, wedge vertebra) or a failure of segmentation (unsegmented bar, block vertebra); present at birth and diagnosed on radiographs in a child with an asymmetry noticed by the parents"],
          ["Syndromic / postural / compensatory", "A small proportion", "Neurofibromatosis, Marfan's syndrome, a limb-length discrepancy (a non-structural curve that corrects when the pelvis is levelled), and a painful scoliosis that demands a search for a cause (a tumour, infection or an osteoid osteoma)"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A structural scoliosis that is painful, that is progressing rapidly, that is left-sided (a right thoracic curve is the rule; a left thoracic curve is the exception), or that is associated with any neurological sign, is not adolescent idiopathic scoliosis until it has been investigated. A painful curve with normal radiographs in a child is an osteoid osteoma or an infection until proven otherwise — imaging, including MRI of the whole spine, comes before any bracing decision.",
      },
      {
        type: "paragraph",
        text: "The assessment of a structural curve is in three parts. Look at the whole spine in the coronal plane, with the pelvis levelled and the patient undressed, measuring the rib hump and the shoulder asymmetry. Then bend the patient forward to distinguish structural from non-structural, and assess rotation. Then image, and measure by the Cobb method: the angle between the upper end plate of the uppermost vertebra and the lower end plate of the lowermost vertebra of the curve.",
      },
      {
        type: "definition",
        term: "Risser scale",
        text: "A scale of skeletal maturity based on radiographic ossification of the iliac apophysis, from Risser 0 (no ossification) to Risser 5 (complete fusion). It estimates the remaining growth, and therefore the risk that a curve will progress: a curve in a child at Risser 0-1 has the most growth to come, and a curve at Risser 4-5 has almost none.",
      },
      {
        type: "table",
        headers: ["Curve magnitude and maturity", "Management"],
        rows: [
          ["Under 20-25°, in a patient at or near skeletal maturity (Risser 4-5)", "Observation with serial clinical and radiographic reviews; most curves under 25° do not progress in a mature patient"],
          ["20-25° with growth remaining, or a curve that progresses by 5° or more between visits", "Bracing — a thoracolumbosacral orthosis, worn until maturity, to prevent progression rather than to correct the curve"],
          ["Over 45-50° in a skeletally mature patient, or a progressive curve over 45° in a growing one", "Surgical correction and fusion — because a curve of 50° or more continues to progress slowly through adult life and carries the cosmetic and the functional consequences of an untreated deformity"],
          ["Any curve with a neurological deficit, or a curve with an identified cause", "Investigate and treat the cause; instrumentation and fusion as indicated"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The examinable number: a right thoracic curve of about 30° in a pre-menarchal girl at Risser 1 with a persistent rib hump that does not correct on side-bending is an indication for a brace — the curve has growth left to grow into, and bracing stops it. Bracing does not straighten the spine; it holds the curve where it is until growth finishes, and its success depends almost entirely on the hours a day the brace is actually worn.",
      },
      {
        type: "question",
        prompt: "A 13-year-old girl has a right thoracic curve of 30° with a prominent rib hump on forward bending. On side-bending radiographs the curve does not correct. What is the next step in her management and what are you trying to prevent?",
        answer: "A thoracolumbosacral orthosis (brace), worn until skeletal maturity, reviewed at 4-6 monthly intervals. You are preventing progression of the curve: a structural curve that progresses past 45-50° in an adult continues to progress slowly, carries a cosmetic and pulmonary burden, and will need fusion. Bracing is for the growing child with a moderate structural curve, not for the mature patient with a small curve.",
        explanation: "The indicators are the curve's rigidity on side-bending (structural), the size (30°, in the bracing range) and the skeletal immaturity (pre-menarchal, low Risser grade). Observation would be the choice for a curve under 25° in a mature patient.",
      },

      { type: "heading", level: 2, text: "Spondylolysis and spondylolisthesis" },
      {
        type: "definition",
        term: "Spondylolysis",
        text: "A defect in the pars interarticularis of the vertebra — the bridge of bone between the superior and inferior articular processes — usually at the L5 level, and usually a stress fracture from hyperextension at that level rather than a congenital failure of fusion.",
      },
      {
        type: "definition",
        term: "Spondylolisthesis",
        text: "The forward translation of one vertebra on the one below it, most commonly L5 on S1 following a defect in the pars. Graded by the percentage of the vertebral body that has slipped: I under 25%, II 25-50%, III 50-75%, IV 75-100%, and V complete slippage (spondyloptosis).",
      },
      {
        type: "table",
        headers: ["Aspect", "Spondylolysis", "Spondylolisthesis"],
        rows: [
          ["Patient", "An adolescent athlete — a gymnast, fast bowler, dancer or rower; a young adult with hyperextension activities", "Any age; the adolescent with a pars defect, and the adult with degenerative facet arthrosis that permits slippage"],
          ["Symptoms", "Deep low back pain, worse on extension and relieved by flexion; the classic history is pain that is worse in the standing phases of the sport", "Back pain radiating to the buttocks and thighs, and in the higher grades to the legs, with a 'slipping' sensation on walking"],
          ["Signs", "Pain on extension of the spine; a step in the spinous processes in the higher grades", "A palpable step, a shortened gluteal contour, and in the severe case a radicular or cauda equina picture"],
          ["Radiographs", "A 'Scotty dog with a collar' appearance on the oblique view, with the pars defect as a break in the neck", "The forward slip is visible on the lateral view; flexion-extension views detect the instability that determines the treatment"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The treatment of a spondylolysis in a young athlete is non-operative in most cases: activity modification, a flexion-based rehabilitation programme, and physiotherapy for the core and the gluteals. The treatment of a slip of grade III or more, or a slip that is progressing, or one with a neurological deficit, is surgical — decompression and instrumented fusion. The grading matters because slips of grade I-II with a stable, non-progressive pattern almost never need surgery.",
      },

      { type: "heading", level: 2, text: "Back pain and the differential" },
      {
        type: "paragraph",
        text: "Back pain is the commonest musculoskeletal symptom and the one where the differential is the whole job. Mechanical back pain — from disc degeneration, facet joints, muscle and ligament — accounts for over 90% of it, and the red flags are the small group that identifies the rest.",
      },
      {
        type: "table",
        headers: ["Red flag", "What you are looking for", "The action"],
        rows: [
          ["Age under 20 or over 50 at first onset", "A tumour, an infection or an inflammatory condition", "Radiograph, inflammatory markers, and consider MRI"],
          ["Weight loss, fever or night sweats", "M tuberculosis, malignancy, or sepsis", "Inflammatory markers, MRI of the whole spine, cultures"],
          ["Bladder or bowel dysfunction, saddle anaesthesia", "Cauda equina syndrome — a surgical emergency", "Immediate MRI and neurosurgical referral for decompression"],
          ["Progressive neurological deficit in the legs", "A structural (neoplastic, compressive or infective) lesion", "MRI and urgent referral"],
          ["A history of malignancy, or a night-time pain unrelieved by rest", "Metastasis or a primary bone tumour", "Radiograph, MRI, bone scan and chest imaging"],
          ["Morning stiffness for over 30 minutes, improving with exercise", "An inflammatory spondyloarthropathy (ankylosing spondylitis)", "HLA-B27, inflammatory markers, sacroiliac joint imaging"],
          ["Pain after significant trauma, or in an osteoporotic patient on steroids", "A vertebral compression fracture", "Radiograph, and MRI if the pain is out of proportion or persists"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Cauda equina syndrome is the emergency. A patient with back pain who also has urinary retention or overflow incontinence, faecal incontinence, bilateral leg pain or weakness, or numbness in the saddle, perineal or genital distribution needs an MRI immediately and decompression within hours. Bladder function is the treatment deadline: incontinence or retention is irreversible if decompression is delayed, and the history from the patient is taken seriously even when the anal tone is normal on the first attempt.",
      },
      {
        type: "table",
        headers: ["Differential of back pain", "Distinguishing feature"],
        rows: [
          ["Mechanical / degenerative disc and facet disease", "A history of loading-related pain, worse with activity and better at rest, no red flags, and no neurological deficit"],
          ["Disc herniation with radiculopathy", "Leg pain below the knee, in a dermatomal pattern, with a positive straight-leg raise test (radicular, not back, pain is the dominant symptom)"],
          ["Spinal infection (vertebral osteomyelitis or discitis)", "Fever, raised inflammatory markers, night pain, and a high index of suspicion in the immunosuppressed, the diabetic and the intravenous drug user"],
          ["Malignancy (metastasis, myeloma, lymphoma)", "A history of malignancy, weight loss, night pain, and a raised protein or immunoparesis on blood tests"],
          ["Inflammatory (ankylosing spondylitis and the spondyloarthropathies)", "Morning stiffness over 30 minutes, improvement with exercise, and involvement of the spine and the sacroiliac joints"],
          ["Referred visceral pain", "Pain unaffected by spinal posture, with abdominal, pelvic or urological findings that explain it"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a curve as structural because it looks curved. Only the forward bend test tells you: a structural curve persists and rotates on forward bending; a non-structural curve flattens. This distinction is also what separates a limb-length discrepancy that will be treated by a shoe raise from a scoliosis that needs a brace.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Failing to look for a cause in an atypical scoliosis. Pain, a left-sided curve, rapid progression, an abnormal neurological examination or absence of a thoracic curve in an adolescent are all indications for an MRI before any treatment decision. A structural scoliosis with pain in a child is an osteoid osteoma until proven otherwise.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Dismissing back pain in a patient with a history of cancer as mechanical. Night pain, a known primary and weight loss require radiographs and, in most cases, MRI — and a destructive vertebral lesion in a patient with a known carcinoma is a metastasis until proven otherwise.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Missing a cauda equina syndrome because the first examination of the perineal sensation was normal. Ask about bladder and bowel function directly, examine the saddle area, and repeat it. Incontinence is a late and partly irreversible sign, and decompression has to happen before it, not after it.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "How do you distinguish structural from non-structural scoliosis at the bedside, and why does it matter?",
        answer: "Ask the patient to bend forward with the knees straight while you view the spine from behind. A structural curve persists on bending and rotates — producing a rib hump on the convexity — and it does not correct on side-lying or traction. A non-structural curve flattens completely and has no rotation, because it is a postural response (for example to a limb-length discrepancy). The distinction decides whether the patient needs a brace or a shoe raise.",
        explanation: "The rib hump is the physical proof of the vertebral rotation, and rotation is the feature that distinguishes the structural curve from a postural one.",
      },
      {
        type: "question",
        prompt: "State the treatment thresholds for adolescent idiopathic scoliosis.",
        answer: "Observation for a curve under 25° in a patient near or at skeletal maturity. Bracing for a curve of 25-45° in a patient with growth remaining. Surgical correction and fusion for a curve over 45-50°, or a curve that is progressive despite bracing, in a patient approaching maturity.",
        explanation: "The decisions are based on curve magnitude, skeletal maturity (Risser grade and menarchal status) and progression (5° or more between reviews). Bracing prevents progression, it does not correct the curve.",
      },
      {
        type: "question",
        prompt: "List six red flags in a patient with back pain, and the investigation each demands.",
        answer: "Onset under 20 or over 50 (radiograph and further imaging); fever, night sweats or weight loss (inflammatory markers and MRI of the whole spine, and cultures); bladder or bowel dysfunction or saddle anaesthesia (immediate MRI and surgical decompression); a progressive neurological deficit (MRI and urgent referral); a history of malignancy with night pain (radiograph, MRI, bone scan and chest imaging); and morning stiffness over 30 minutes improving with exercise (HLA-B27, inflammatory markers and sacroiliac views).",
        explanation: "Red flags are the small proportion of back pain that has a specific, often serious, cause, and every one of them demands an investigation rather than reassurance.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A pre-menarchal 13-year-old girl (Risser 1) has a 30° right thoracic curve; the rib hump persists on forward bending and does not correct on side-bending. What is the most appropriate management?",
        options: [
          "Observation with annual clinical review and a radiograph only if the curve visibly increases",
          "A thoracolumbosacral orthosis (brace) worn until skeletal maturity, to prevent progression",
          "Posterior spinal fusion and instrumentation at this stage",
          "Physiotherapy alone, specifically targeting the curve",
        ],
        correctIndex: 1,
        explanation: "A rigid structural curve of 25-45° in a patient with substantial growth remaining (pre-menarchal, low Risser grade) is the indication for bracing, which aims to stop progression rather than to correct the deformity. Observation is appropriate for a curve under 25° in a mature patient, and surgery is reserved for a curve over about 45-50° or one that progresses in a brace.",
      },
      {
        type: "mcq",
        stem: "Which combination of findings is most consistent with a structural scoliosis?",
        options: [
          "A curve that flattens completely on forward bending, with no rotation",
          "A curve that persists on forward bending with a rib hump on the convexity and does not correct when the patient lies down or leans",
          "A curve associated with a pelvic obliquity that corrects when the pelvis is levelled",
          "A curve with normal neurological examination and no pain, at any age",
        ],
        correctIndex: 1,
        explanation: "The structural curve persists on forward bending (Adam's test), rotates — producing the rib hump on the side of the convexity — and does not correct when the patient is made to bend to the side. The curve that flattens is postural and non-structural; a curve that corrects when the pelvis is levelled is a limb-length discrepancy.",
      },
      {
        type: "mcq",
        stem: "Which statement about spondylolisthesis is correct?",
        options: [
          "It is a forward translation of a vertebra, graded by the proportion of the vertebral body that has slipped",
          "It is a defect of the pars interarticularis of the vertebra",
          "It is typically treated with spica cast immobilisation in an adolescent",
          "It is a posteriorly directed slip that usually occurs at L5 on S1",
        ],
        correctIndex: 0,
        explanation: "Spondylolisthesis is the forward (anterior) translation of a vertebra on the one below it, most often L5 on S1, and it is graded I-V by the percentage of the vertebral body that has slipped. A defect of the pars interarticularis is spondylolysis, which is the commonest cause of that slip; a slip of grade I-II in a young athlete is treated non-operatively, not in a spica cast.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Rehabilitation, prosthetics, orthotics & imaging (fully authored)
// ---------------------------------------------------------------------------
function lesson11() {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the phases of rehabilitation after musculoskeletal injury and the goals of each; state the principles of an orthotic prescription — comfort, function and a limit on weight — and describe the common orthoses by joint; describe the components of a lower-limb prosthesis and the sequence of fitting; describe the appropriate use of walking aids and how to match the aid to the patient; and outline the choice of imaging in musculoskeletal disease — the plain film first, and when CT, MRI, ultrasound, isotope bone scan and PET-CT are indicated.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "All preceding lessons of this course: the biology of healing (Lesson 2), the regional injuries (Lessons 3-4), the amputation levels (Lesson 5) and the congenital deformities (Lesson 6). Rehabilitation is the common end-point of every one of them.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "The most important sentence in this lesson is that rehabilitation is not the last part of treatment; it is the part that decides whether the treatment achieved anything. A perfect fixation of a wrist fracture in a patient whose fingers have stiffened in the cast has been a failure; an imperfect fixation in a patient who has moved every uninjured joint and is back at work is a success. That reordering of priority is the mindset the physiotherapist and the OT bring to the ward, and it is the mindset the ward team must share.",
      },
      {
        type: "definition",
        term: "Rehabilitation",
        text: "The restoration of function after injury or disease, by a coordinated programme of pain control, joint movement, muscle strengthening, orthotic support, patient education and psychological support, delivered by a multidisciplinary team.",
      },

      { type: "heading", level: 2, text: "The phases of rehabilitation" },
      {
        type: "table",
        headers: ["Phase", "Aims", "What the physiotherapist does", "What the surgical team does"],
        rows: [
          ["Acute (hours to days)", "Control pain and swelling; protect the injury; prevent the complications of immobility", "Positioning, gentle isometric contractions, breathing exercises, and the first movements of the uninjured joints", "Adequate analgesia, elevation, a splint that is not constricting, and DVT prophylaxis"],
          ["Recovery (weeks to months)", "Restore the range of movement, then the strength and the proprioception of the affected limb", "Progressive active and active-assisted exercises, stretching, graded loading, gait re-education, and hydrotherapy", "Remove the immobilisation at the correct time; do not leave a cast on longer than the healing requires"],
          ["Return to function (months)", "Return the patient to their occupation, their sport and their independence", "Task-specific retraining, a graded return to load and to work, and safe use of the equipment the patient owns", "Assess the outcome, plan the further surgery that might be needed, and set the pace with the patient not the fracture"],
          ["Long-term", "Maintain the gains and detect the late complications", "A home exercise programme, review at six and twelve months, and monitoring for osteoarthritis and stiffness", "Report on union, on any malunion, and on the joints above and below"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The three complications of immobilisation that rehabilitation exists to prevent: joint stiffness (prevented by moving the joints not in the cast), muscle wasting (prevented by static contractions from day one), and venous thromboembolism (prevented by early mobilisation, mechanical compression and pharmacological prophylaxis). Each one of the three is a complication of treatment, not of the injury, and each is in the hands of the surgical team as much as the physiotherapist.",
      },
      {
        type: "question",
        prompt: "A patient has a tibial shaft fracture fixed with a nail and is eager to walk. At what point can he bear weight, and who decides?",
        answer: "The decision is a shared one between the surgeon and the physiotherapist, based on the stability of the fixation and the radiological appearance of union. An intramedullary nail is a load-sharing device, so weight-bearing is usually started early and advanced as pain allows; a fracture fixed less rigidly, or an extra-articular fracture consolidated by callus, is progressively loaded over weeks. The surgeon's instruction, the radiographs and the patient's pain together set the pace.",
        explanation: "Weight-bearing is instructed, not guessed, because the wrong instruction either loads a fracture that is not stable enough, or protects one that would have tolerated more, producing unnecessary stiffness and wasting.",
      },

      { type: "heading", level: 2, text: "Orthoses" },
      {
        type: "definition",
        term: "Orthosis (orthotic)",
        text: "An externally applied device used to support, correct or compensate for a deformity or a weakness, applied to a body segment. Named by the joints it controls: an ankle-foot orthosis (AFO) controls the ankle and the foot; a knee-ankle-foot orthosis (KAFO) adds the knee; a wrist-hand orthosis (WHO) supports the wrist and hand; and a cervical orthosis (collar) supports the neck.",
      },
      {
        type: "table",
        headers: ["Orthosis", "Indication", "What it does"],
        rows: [
          ["Ankle-foot orthosis (AFO)", "Foot drop from a common fibular nerve lesion, a stroke, or a flail ankle after polio; an equinus deformity in cerebral palsy", "Holds the ankle at 90° and clears the ground in the swing phase; a posterior leaf spring AFO is the light, active choice, a solid AFO provides more control"],
          ["Knee-ankle-foot orthosis (KAFO)", "Quadriceps weakness, a locked knee for standing, or the stance phase after polio; a spinal orthosis when paired with a thoracic extension", "Locks the knee in extension for standing and releases for sitting — the classic calipers of polio"],
          ["Wrist-hand / cock-up splint", "A radial or median nerve palsy, a wrist injury immobilised for comfort, or a carpal tunnel syndrome", "Holds the wrist in a neutral or slightly extended position; a resting splint for a rheumatoid hand at night"],
          ["Spinal orthosis (brace)", "Scheuermann's kyphosis, an osteoporotic wedge fracture pain, a stable compression fracture, or a spinal tuberculosis", "Limits motion and shares load, giving pain relief; it does not correct a progressive structural curve"],
          ["Heel cup / insole", "Plantar fasciitis, a calcaneal spur, or a foot that sits in pronation", "Absorbs heel-strike force and controls the calcaneal position, relieving the pain of the heel strike"],
          ["Charcot restraint orthotic walker (CROW)", "A Charcot neuroarthropathic foot", "A total-contact boot that immobilises and offloads the ankle and foot, allowing a neuropathic foot to consolidate"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The three questions to ask of any orthosis: does it do the job (does it control the motion it is meant to control), can the patient tolerate it (is it comfortable, light and can they put it on), and does the benefit exceed the burden (an orthosis that needs help to apply, in a patient who cannot rise unaided, may be a hindrance rather than a help)? The commonest reason for an orthosis to be abandoned is not failure of the device but failure of comfort.",
      },

      { type: "heading", level: 2, text: "Prostheses" },
      {
        type: "paragraph",
        text: "The lower-limb prosthesis from Lesson 5 is worth revisiting here in terms of the components, because the prescription is a functional decision, not a catalogue choice.",
      },
      {
        type: "table",
        headers: ["Component", "Options", "Prescribed for"],
        rows: [
          ["Socket", "Total contact vs suction suspension; a liner (silicone or gel) with a pin lock or a sleeve", "The stump's shape and skin condition; suction suspension is for the active patient, a sleeve for the sedentary"],
          ["Knee mechanism (above-knee)", "Manual locking; single-axis weight-activated; polycentric with hydraulic or pneumatic swing control", "The frail patient (locking for safety), the moderately active (weight-activated friction), and the active (polycentric with hydraulic)"],
          ["Foot / ankle", "Solid-ankle cushion heel (SACH); a single-axis articulated ankle; energy-storing dynamic response", "The very frail (SACH is light, safe and cheap), the epileptic or the unsteady (single-axis for stability), and the active walker or runner (dynamic response foot returns energy)"],
          ["Transtibial (below-knee) assembly", "Patellar-tendon-bearing socket, a sleeve or a liner with pin, a keel foot or a dynamic response foot", "The commonest and most successful level for fitting; the energy cost of walking is close to normal"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The prescription is not about technology; it is about the patient. A cheap, solid-ankle cushion heel in a frail patient who can walk to the kitchen safely is a far better prescription than a carbon-fibre dynamic-response foot in the same patient, who will trip over its stored energy. Ask what the patient wants to do before you look at the catalogue, and review the fit repeatedly — a socket fitted once and never renewed is a socket that has been abandoned.",
      },
      {
        type: "definition",
        term: "Upper-limb prosthesis",
        text: "A prosthetic replacement of the hand and arm, from a passive cosmetic prosthesis with no function, through a body-powered prosthesis driven by a harness and cable, to an externally powered myoelectric prosthesis controlled by the electrical signal of the remaining muscles. By contrast with that, the cosmetic and the body-powered limbs still satisfy most users; a myoelectric limb is selected for those who need finer grasp.",
      },

      { type: "heading", level: 2, text: "Walking aids" },
      {
        type: "table",
        headers: ["Aid", "Load through", "Prescribed when", "Limitation"],
        rows: [
          ["Walking stick (held in the opposite hand)", "The wrist and forearm, off-loading the knee or hip on the same side as the aid is held in the opposite hand from the painful limb", "Unilateral joint pain or weakness; a modest increase in stability is needed", "Poor for two-leg involvement or for the patient who cannot use their wrist"],
          ["Elbow crutch (single)", "The forearm through the horizontal handle, with a cuff to allow hand use", "A moderate off-load of one limb; the commonest ward aid", "Slightly less stable than an axillary pattern because of the loading point, but avoids axillary nerve injury"],
          ["Axillary crutch", "Load through the axillary bar onto the chest wall", "Traditionally used for non-weight bearing on a limb", "Can compress the axillary (brachial) nerve against the humerus, causing wrist drop — the reason it is used less now"],
          ["Frame (forearm support / gutter)", "Load through the forearms into the frame", "A patient who cannot weight-bear through the wrists — bilateral upper-limb disease or a rheumatoid hand", "Bulky, and needs good stepping or dragging, but it spares the wrists"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The rule about which hand: the stick is held in the hand opposite to the painful limb, so that the aid and the affected limb advance together — this off-loads the painful side through the aid. A patient with a painful left hip holds the stick in the right hand. And an aid that is the wrong height is worse than no aid: the stick should reach the wrist of the patient standing upright, and a crutch handle should be at the level of the wrist crease, with the elbow flexed about 20-30°",
      },
      {
        type: "callout",
        variant: "warning",
        text: "An axillary crutch must not press into the axilla. The load is taken through the hands on the handles, and the axillary pad is only a rest when standing. A crutch with the pressure in the axilla is a crutch that injures the radial nerve in the axilla and produces a wrist drop — a preventable and oft-forgotten complication of the hospital stay.",
      },

      { type: "heading", level: 2, text: "Imaging of the musculoskeletal system" },
      {
        type: "table",
        headers: ["Modality", "Best for", "First choice when..."],
        rows: [
          ["Plain radiograph", "Fracture, dislocation, alignment, joint space, bone density, periosteal reaction, matrix mineralisation, and the survey of a known bone disease", "Always first for a suspected fracture, dislocation or arthropathy. Two views at right angles, plus oblique views at the hand, ankle and wrist"],
          ["Computed tomography (CT)", "Cortical bone, the calcified matrix, complex fractures (a tibial plateau, an acetabulum, a scaphoid), and staging surgery", "A complex or intra-articular fracture; a bone lesion needing cortical definition; and the lungs and chest for metastatic staging"],
          ["Magnetic resonance imaging (MRI)", "The marrow, the menisci, ligaments, tendons, cartilage, the spinal cord and those soft tissues that contain no calcium at all", "Occult fracture, ligament and meniscal injury, spinal cord compression and cauda equina, occult infection with marrow oedema, and the local staging of any tumour"],
          ["Ultrasound", "Tendons (especially the rotator cuff and the Achilles), fluid in a joint or a bursa, a foreign body, and real-time guided needle placement", "A suspected rotator cuff tear or a joint effusion; ultrasound in the child's irritable hip; and guidance for an injection or an aspiration"],
          ["Isotope bone scan (technetium-99m MDP)", "The whole skeleton at once; sites of increased turnover, metastases, infections and stress fractures", "Prostate or breast cancer staging, occult metastases, multifocal infection, or the painful prosthesis that might be loose or infected"],
          ["PET-CT", "Metabolic activity, the systemic extent of malignancy, and response to treatment", "Staging and follow-up of malignancy; differentiating infection from tumour in a probe"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The universal first rule, which is as much a safety net as a diagnostic one: a plain radiograph is obtained first when evaluating suspected bone or joint pathology — a fracture, a suspected tumour or arthritis. It is cheap, quick, widely available, and it gives the pattern that determines which of the other modalities you need. MRI is powerful but it is also indiscriminate in what it shows, and an MRI of a joint that hurts will always show something.",
      },
      {
        type: "paragraph",
        text: "Two specific Rule-type reminders are worth having. In the acutely injured wrist after FOOSH in a young adult, tenderness in the anatomical snuffbox is treated as a scaphoid fracture and re-imaged after 10-14 days, because CT may show the fracture that the film does not. In the acutely injured knee with a haemarthrosis, an MRI is the investigation of choice for ligament and meniscal injury, and its findings are what decide whether the cruciate ligament is reconstructed or managed with rehabilitation.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Leaving a joint immobilised for longer than the fracture needed, and calling the resulting stiffness 'the fracture's problem'. Stiffness is a complication of treatment: the joint that was not broken should be moved from day one, and the duration of immobilisation should be the minimum the healing requires, not the maximum the surgeon is comfortable with.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing an orthosis by the diagnosis instead of by the function. A foot drop from a stroke, a foot drop from a common fibular nerve lesion, and an equinus from cerebral palsy may all receive an ankle-foot orthosis, but the balance of control versus weight, and the ability of the patient to apply it, are what decide whether it is used.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Requesting an MRI before a plain radiograph. The radiograph is the first image of a musculoskeletal condition; it defines the pattern and narrows the differential. An MRI ordered on the same day often generates findings that are incidental, that change management for the worse, and that delay the imaging that would have been decisive.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using an axillary crutch incorrectly and watching a radial nerve palsy develop. Pressure belongs on the hands, not in the axilla, and an axillary crutch with the pad pressing into the axilla compresses the radial nerve as it winds around the humerus in the axilla, producing a wrist drop that appears during the admission.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why is the walking stick held in the hand opposite a painful hip?",
        answer: "Because the stick and the painful limb then advance together, and the load is taken through the stick and the opposite upper limb, off-loading the painful side during the stance phase. Holding the stick on the same side as the painful hip off-loads neither the hip nor the knee efficiently.",
        explanation: "The paradox that confuses everyone at first: the aid goes on the sound side. It is a gait-mechanics decision, not a gesture of sympathy for the painful limb.",
      },
      {
        type: "question",
        prompt: "Name three complications of prolonged immobilisation and the phase of rehabilitation that prevents each.",
        answer: "Joint stiffness (prevented in the acute phase, by moving the uninjured joints from day one); muscle wasting (prevented by static isometric contractions from the acute phase); and venous thromboembolism (prevented by early mobilisation plus pharmacological and mechanical prophylaxis). Also pressure ulcers in the immobile, and depression and loss of independence in the elderly.",
        explanation: "All three are complications of the treatment rather than of the injury, which is precisely why they are the ones a ward team can prevent.",
      },
      {
        type: "question",
        prompt: "State the rule for choosing the first imaging modality in a patient with a suspected bone or joint condition, and say when each of CT, MRI, ultrasound and a bone scan adds to it.",
        answer: "A plain radiograph is always obtained first, in two planes: it shows the fracture, alignment, joint space, bone density, periosteal reaction and the matrix of a tumour. CT adds cortical bone and complex fracture geometry, and stages the chest. MRI shows the marrow, ligaments, menisci, cartilage, the spinal cord and occult infection. Ultrasound shows tendons and fluid, and guides aspiration and injection. A bone scan shows the whole skeleton for metastases and multifocal infection.",
        explanation: "The order matters: the film tells you what the differential is, and the second test is chosen to answer the question the film raised.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which imaging study should generally be obtained first when evaluating suspected bone or joint pathology such as a fracture, suspected tumour or arthritis?",
        options: [
          "Magnetic resonance imaging, because it shows the marrow and the soft tissues",
          "A plain radiograph, obtained in two planes of the area of concern",
          "A whole-body isotope bone scan",
          "A CT scan of the affected region, before any plain film",
        ],
        correctIndex: 1,
        explanation: "A plain radiograph is always the first modality: it is fast, cheap, widely available and shows the fracture line, the joint space, bone density, periosteal reaction and the matrix of a tumour, which is what determines which second test to order. MRI is ordered when the question is about marrow, ligament or meniscal injury or cord compression; a bone scan for the whole skeleton; and CT for complex cortical geometry.",
      },
      {
        type: "mcq",
        stem: "Which component pairing of a lower-limb prosthesis is correct?",
        options: [
          "A solid-ankle cushion heel foot, for a frail patient who needs safety, and a dynamic response foot for the active walker",
          "A manual locking knee, for a patient who needs a free-swinging knee to climb stairs",
          "A silicone liner without a sleeve, for a stump with poor skin cover",
          "A frame as a walking aid, for a patient who needs to off-load a single painful hip",
        ],
        correctIndex: 0,
        explanation: "The foot is chosen by the patient's activity and stability: a solid-ankle cushion heel is light, stable and cheap and suits the frail patient; a dynamic response foot returns energy and suits the active walker. A locking knee is for safety in standing, not for climbing stairs; a liner needs good skin cover, not poor; and a frame is for a patient who cannot bear weight through the wrists, not for a single painful hip.",
      },
      {
        type: "mcq",
        stem: "Which combination correctly matches the orthosis to the condition it treats?",
        options: [
          "An ankle-foot orthosis, for foot drop from a common fibular nerve lesion or a flail ankle",
          "A knee-ankle-foot orthosis, for carpal tunnel syndrome of the hand",
          "A wrist-hand orthosis, for a Charcot neuroarthropathic foot",
          "A cervical collar, for a lumbar compression fracture",
        ],
        correctIndex: 0,
        explanation: "An ankle-foot orthosis holds the ankle at 90° and clears the foot in the swing phase, and is the correct orthosis for foot drop and flail ankle. A wrist-hand orthosis is for the wrist and hand, a cervical orthosis for the neck, and a spinal brace for the spine. Charcot's foot needs a total-contact offloading boot (a CROW) rather than a conventional brace.",
      },
    ],
  };
}

export const ORTHOPAEDICS: SubjectSeed = {
  id: "mbbs-orthopaedics",
  slug: "orthopaedics",
  title: "Orthopaedics",
  code: "ORTH 307",
  department: "Orthopaedics",
  level: 300,
  credits: 2,
  semester: "second",
  description:
    "The musculoskeletal system: fractures and dislocations, healing and complications, regional injuries, congenital and infectious conditions, bone tumours, spinal deformity, and the skills of splinting, traction and reduction (AIIMS orientation in semester III, three weeks in semester VII).",
  faculty: "clinical-medicine",
  prereqCourses: ["gross-anatomy-i"],
  modules: [
    { slug: "general-principles", title: "M1 — General principles of injury" },
    { slug: "regional-injuries", title: "M2 — Regional injuries & amputations" },
    { slug: "paediatric-infection", title: "M3 — Congenital, infectious & neurological" },
    { slug: "non-traumatic-disease", title: "M4 — Tumours, deformity & rehabilitation" },
  ],
  lessons: [
    { title: "Fractures & dislocations", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Fractures and dislocations", slug: "fractures-dislocations", summary: "Fracture patterns, descriptors, closed versus open injury, displacement, and the principles of reduction, immobilisation and rehabilitation.", blooms: "apply", minutes: 45, prereq: [] }, content: lesson1() as never },
    { title: "Fracture healing & complications", module: 1, estimatedMinutes: 40, authored: true, concept: { title: "Fracture healing and complications", slug: "fracture-healing-complications", summary: "Primary and secondary healing, non-union, malunion, delayed union, compartment syndrome, fat embolism and other systemic complications.", blooms: "analyze", minutes: 40, prereq: ["fractures-dislocations"] }, content: lesson2() as never },
    { title: "Upper limb injuries", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Upper limb injuries", slug: "upper-limb-injuries", summary: "Clavicle, humerus, elbow, forearm, wrist and hand injuries — Colles', supracondylar and scaphoid — their mechanisms and pitfalls.", blooms: "analyze", minutes: 45, prereq: ["fracture-healing-complications"] }, content: lesson3() as never },
    { title: "Lower limb & knee injuries", module: 2, estimatedMinutes: 40, authored: true, concept: { title: "Lower limb and knee injuries", slug: "lower-limb-injuries", summary: "Hip, femoral shaft, tibial, ankle and foot injuries; knee ligament and meniscal injury, and the assessment of the acutely injured joint.", blooms: "analyze", minutes: 45, prereq: ["upper-limb-injuries"] }, content: lesson4() as never },
    { title: "Amputations", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Amputations", slug: "amputations", summary: "Indications, levels and techniques, stump care and complications, and prosthetic fitting after limb loss.", blooms: "apply", minutes: 35, prereq: ["lower-limb-injuries"] }, content: lesson5() as never },
    { title: "Congenital malformations", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Congenital malformations", slug: "congenital-malformations", summary: "CTEV, developmental dysplasia of the hip, congenital muscular torticollis and limb anomalies — detection, screening and early management.", blooms: "apply", minutes: 40, prereq: [] }, content: lesson6() as never },
    { title: "Osteomyelitis & septic arthritis", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Osteomyelitis and septic arthritis", slug: "osteomyelitis-septic-arthritis", summary: "Acute and chronic haematogenous osteomyelitis, Brodie's abscess and septic arthritis — presentation, investigation and drainage.", blooms: "analyze", minutes: 40, prereq: [] }, content: lesson7() as never },
    { title: "TB spine & poliomyelitis", module: 3, estimatedMinutes: 35, authored: true, concept: { title: "Tuberculosis of spine and poliomyelitis", slug: "tuberculosis-spine-poliomyelitis", summary: "Spinal tuberculosis and paraplegia, Pott's spine management, and the residual deformities and orthotic management of poliomyelitis.", blooms: "analyze", minutes: 35, prereq: ["osteomyelitis-septic-arthritis"] }, content: lesson8() as never },
    { title: "Bone tumours", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Bone tumours", slug: "bone-tumours", summary: "Benign and malignant primary tumours, metastases, myeloma and the red flags that separate tumour from infection or injury.", blooms: "analyze", minutes: 40, prereq: [] }, content: lesson9() as never },
    { title: "Spinal deformity", module: 4, estimatedMinutes: 35, authored: true, concept: { title: "Spinal deformity", slug: "spine-deformities", summary: "Scoliosis, kyphosis and spondylolisthesis — assessment, bracing, surgical indications and back-pain differentials.", blooms: "analyze", minutes: 35, prereq: ["bone-tumours"] }, content: lesson10() as never },
    { title: "Rehabilitation, prosthetics & radiology", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Rehabilitation, prosthetics and radiology", slug: "rehabilitation-prosthetics-orthotics", summary: "Physiotherapy principles, orthoses and prostheses, walking aids, and the plain-film and advanced imaging of musculoskeletal disease.", blooms: "apply", minutes: 40, prereq: ["spine-deformities"] }, content: lesson11() as never },
  ],
  sbas: [],
}

export async function seedOrthopaedics(): Promise<void> {
  const counts = await seedMbbsCourse(ORTHOPAEDICS);
  console.log(`✓ ${ORTHOPAEDICS.code} ${ORTHOPAEDICS.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && (process.argv[1].includes("mbbs/orthopaedics") || process.argv[1].includes("seed-assessment-orthopaedics"))) {
  seedOrthopaedics()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
