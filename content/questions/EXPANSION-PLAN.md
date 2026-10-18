# EXPANSION PLAN — the road to 1,000 questions per subject (5,000 total)

reviewStatus: needs-human-review. Owner target: ≥1,000 questions per subject, one shared pool per subject, all boards drawing from it (shuffled per paper, never duplicated per board).

## 1. Where we stand

| Subject | Now | Target | Gap |
|---|---|---|---|
| Mathematics | 150 | 1 000 | 850 |
| Biology | 93 | 1 000 | 907 |
| Chemistry | 100 | 1 000 | 900 |
| Physics | 120 | 1 000 | 880 |
| English | 120 | 1 000 | 880 |
| **Total** | **583** | **5 000** | **≈4 417** |

## 2. The two-track authoring engine (how 4,400 questions is achievable)

Hand-writing 4,400 items is months of waves. The scalable pipeline is TWO tracks:

**Track A — Parameterised generation (mathematics, physics, chemistry computational topics).**
One CONCEPT TEMPLATE × seeded parameter variations = a family of genuinely distinct questions.
Example family: "solve ax + b = c" with seeded (a, b, c) → 30 original instances, each
independently SOLVED AND VERIFIED by the checking script (the machine recomputes every
answer — zero hallucinated keys). Speed: ~5-10× hand authoring, with machine-verified keys.

**Track B — Hand-authored batches (biology, English, theory items, definitional chemistry/physics).**
The existing pipeline: authored → blind-solved → position-normalised → needs-human-review.

Every question from either track passes the same gates: 4 distinct options, one key,
explanation, hint, styleBoard, reviewStatus. No exceptions at scale.

## 3. Per-subject topic quota maps (to 1,000)

### Mathematics — 1,000 across 5 topics (current 30/topic)
algebra-foundations 200 · geometry-trigonometry 220 · calculus 200 · statistics-probability 200 · further-mathematics 180

### Biology — 1,000 across 6 topics (current ~15/topic)
cell-biology 170 · bioenergetics-biochemistry 170 · genetics-molecular-biology 170 · human-physiology 170 · ecology-evolution 160 · plant-biology 160

### Chemistry — 1,000 across 6 topics (current ~15-25/topic)
atomic-structure-periodic-table 160 · chemical-bonding 170 · stoichiometry-mole 180 · thermodynamics-kinetics 160 · organic-chemistry 170 · electrochemistry 160

### Physics — 1,000 across 6 topics (current ~20/topic)
mechanics 180 · waves-optics 160 · electricity-magnetism 180 · thermodynamics 150 · nuclear-quantum-physics 160 · further-mechanics-fields 170

### English — 1,000 across 9 topics (current ~10-30/topic)
grammar-foundations 120 · concord 110 · tenses-and-aspect 110 · punctuation-mechanics 100 · lexis-structure 130 · reading-comprehension 130 · summary-writing 90 · continuous-writing 100 · oral-english 140

### Difficulty mix at scale: 30% easy · 40% medium · 30% hard (per topic, per subject).

## 4. Wave schedule (Track A + Track B batches of ~500)

Wave W1: maths Track A family batch (250) + biology Track B (100) + chemistry Track A (150)
Wave W2: physics Track A (250) + English Track B (100) + maths Track A (150)
... alternating until 5,000. Each wave: generate → verify → shuffle → commit → push → report.
Estimated: 9–11 waves of this size to reach 5,000.

## 5. Exam sizing — the recommendation (owner's "overwhelming/hard exams" question)

**Do NOT render 200+ questions in one sitting.** Fatigue destroys assessment validity and the
UX dies halfway. The professional ladder:

| Tier | Size | Duration | Purpose | Availability |
|---|---|---|---|---|
| Topic drill | 10–15 | 10–15 min | Learn + immediate recall | Free (study mode) |
| Practice mini | 24 | 30 min | Board-style taste | FREE (the funnel hook) |
| Full mock | 40–50 | 50–60 min | Authentic board simulation | PREMIUM |
| **The Gauntlet** | **100** | **120 min** | Full-syllabus endurance paper — every topic, mixed difficulty, topic-balanced draw | PREMIUM (the "overwhelming" exam, done professionally) |
| Marathon Series | 4 × 50 staged | 4 sittings | 200+ questions of coverage WITHOUT one sitting — cumulative scoring across stages | PREMIUM |

Coverage of "all hard required topics" is achieved by TOPIC-BALANCED assembly from the pool
(every topic guaranteed represented), not by raw length. With 1,000/subject pools, every
Gauntlet draw is a different paper — unlimited regenerations, no repetition fatigue.

## 6. Board coverage (unchanged register v2)

One pool per subject serves ALL boards: JAMB, WAEC/NECO (combined), WASSCE-Ghana, KCSE,
NSC-Matric (official-past-questions candidate), NECTA (candidate), + future regions.
`syllabusStrict` assembly filters each board's draw to its syllabus. BECE removed.
