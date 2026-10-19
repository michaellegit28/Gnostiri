# Discovery Lab — Rebuild Plan (Agent 3)

**Domain:** `extras` → `discovery`  
**Owner:** Agent 3 (PQ Assistant / Content)  
**Constraint:** Do not touch any other agent's work tree (`sandbox/agent2-*`, `sandbox/agent4-*`, `orchestrator/`, shared agent files).

---

## 1. Vision

Discovery is the reason Gnostiri is alive. It is not a curriculum — it is a **research lab**. Physics is the first lab; neuroscience is the second. Chemistry, Biology, Mathematics, Astronomy, Computer Science can be added later as new labs. All current "junk topics" (electives, certifications, miscellaneous skills) are wiped out.

The lab has four research modes:
1. **Principles** — established laws, theories, fundamentals (what we know)
2. **Projects** — hands-on experiments, builds, recreations (what we can do)
3. **Hypotheses** — open questions, frontier ideas, thought experiments (what we don't know yet)
4. **News** — latest scientific developments, papers, breakthroughs (what's happening now)

---

## 2. Suggested Names

| Option | Tagline | Best for |
|--------|---------|----------|
| **The Discovery Lab** | "Where physics is researched, not just taught" | Main brand |
| **Discovery Lab: Physics** | "The first lab. Everything physics, every level." | Physics department |
| **Physics Lab** | "Principles · Projects · Hypotheses · News" | Short form |
| **The Observatory** | "Watch the universe at work" | Poetic alt |
| **Field Notes** | "From first principles to the frontier" | Journalistic alt |

**Recommendation:** Go with **The Discovery Lab** → **Physics Lab** as the first department.

---

## 3. Information Architecture

### Root: `/discovery`
Lab overview page. Shows:
- Hero: "The Discovery Lab — Physics first"
- Active research frontiers (cards: Principles, Projects, Hypotheses, News)
- Physics department entry card (prominent, first)
- Placeholder slots for future labs (greyed out: Chemistry, Biology, Mathematics, …)
- Latest news ticker (3 headlines)

### Department: `/discovery/physics` (Physics Lab)
The main physics department. Four mode tabs:
- **Principles** — branches of physics (classical mechanics, thermodynamics, EM, optics, quantum, relativity, nuclear, astrophysics, condensed matter, mathematical physics)
- **Projects** — hands-on labs and builds
- **Hypotheses** — open questions and frontier ideas
- **News** — latest physics news feed

### Branch: `/discovery/physics/<branch>` (e.g. classical-mechanics)
Each branch contains:
- **Levels** — Novice → Foundations → Intermediate → Advanced → Research
- Each level has lessons (principles), project ideas, hypothesis prompts

### Lesson: `/discovery/physics/<branch>/<lesson>`
Research-lab reader with depth selector (Understand / Explore / Go Deeper / Research), same as existing `DiscoveryReader` but rethemed for physics lab.

---

## 4. Physics Content Tree (all levels)

```
Physics (department)
├── Foundations (Level 0 — Novice)
│   ├── Measurement & Units
│   ├── Vectors & Scalars
│   ├── Scientific Method in Physics
│   └── Order-of-Magnitude Thinking
├── Classical Mechanics (Level 1)
│   ├── Kinematics
│   ├── Newton's Laws
│   ├── Work, Energy & Power
│   ├── Momentum & Collisions
│   ├── Rotation & Angular Momentum
│   ├── Oscillations & Waves
│   └── Gravitation
├── Thermodynamics (Level 2)
│   ├── Temperature & Heat
│   ├── Laws of Thermodynamics
│   ├── Entropy & the Arrow of Time
│   └── Statistical Mechanics
├── Electromagnetism (Level 3)
│   ├── Electrostatics
│   ├── Electric Circuits
│   ├── Magnetism
│   ├── Electromagnetic Induction
│   └── Maxwell's Equations
├── Optics & Waves (Level 4)
│   ├── Geometric Optics
│   ├── Wave Optics
│   ├── Spectroscopy
│   └── Lasers & Photonics
├── Quantum Mechanics (Level 5)
│   ├── Wave-Particle Duality
│   ├── The Schrödinger Equation
│   ├── Quantum States & Operators
│   ├── Spin & Identical Particles
│   └── Quantum Information
├── Relativity (Level 6)
│   ├── Special Relativity
│   ├── General Relativity
│   ├── Black Holes
│   └── Cosmology
├── Nuclear & Particle Physics (Level 7)
│   ├── Radioactivity
│   ├── The Standard Model
│   ├── Particle Detectors
│   └── Beyond the Standard Model
├── Condensed Matter (Level 8)
│   ├── Crystal Structure
│   ├── Band Theory
│   ├── Superconductivity
│   └── Soft Matter
├── Mathematical Physics (Level 9)
│   ├── Vector Calculus
│   ├── Differential Equations
│   ├── Group Theory
│   └── Numerical Methods
└── Astrophysics & Cosmology (Level 10)
    ├── Stellar Evolution
    ├── Galaxies
    ├── Dark Matter & Dark Energy
    └── The Early Universe
```

Each branch carries: principles (established), projects (hands-on), hypotheses (open), news (current).

---

## 5. Data Model (uses existing Prisma `Topic` + `Lesson`)

- `Topic.domain = "extras"`, parentId chains build the lab hierarchy
- Root topic: `physics` (department, parentId = null)
- Branch topics: `classical-mechanics`, `thermodynamics`, … (parentId = physics)
- Level topics: nested under branches or flat with `orderIndex`
- Lesson content: `Lesson.content` JSON with `LessonBlock[]` blocks (heading, paragraph, definition, example, callout, table) — already supported by `DiscoveryReader`

**New LessonBlock types to support lab mode:**
- `principle` — a law/theorem with statement + conditions + mathematical form
- `project` — materials list, procedure, expected result, safety note
- `hypothesis` — question + current status + suggested test
- `news-item` — headline + source + date + one-line significance

---

## 6. Wipe Strategy (junk topics)

Current `extras` domain topics (junk: electives, certs, skills) must be:
1. `isPublished = false` (soft delete, preserve history)
2. Or hard-delete if no user progress references them
3. Replace root `extras` topics with only: `physics` department

No other agent's content is in `extras/discovery` — this is Agent 3's lane.

---

## 7. UI / Naming Conventions

| Element | Name | Accent |
|---------|------|--------|
| Domain | Discovery Lab | violet/gold |
| Department | Physics Lab | gold/amber |
| Modes | Principles / Projects / Hypotheses / News | teal / emerald / rose / sky |
| Levels | Foundations → Research | gradient by depth |

**Tone:** Research lab, not classroom. "Principle" not "topic". "Experiment" not "quiz". "Frontier" not "advanced".

---

## 8. Next Steps (implementation order)

1. ✅ Plan document (this file)
2. ✅ Create `sandbox/agent3-pq-assistant/discovery-physics-content.json` — full content tree (v2.0.0, 11 branches, 28 lessons)
3. ✅ Rebuild `src/app/discovery/page.tsx` — lab overview
4. ✅ Rebuild `src/app/discovery/layout.tsx` — lab metadata
5. ✅ Rebuild `src/app/discovery/[topic]/page.tsx` — branch/lesson reader with lab modes
6. ✅ Add `principle`/`project`/`hypothesis`/`news-item` content blocks + reader
7. ✅ Soft-delete junk `extras` topics (set `isPublished = false`) — `retireLegacyExtras()`
8. ✅ Add `research` block type — real, citable studies (verified DOIs) per lesson
9. ✅ Neuroscience Lab content (`discovery-neuroscience-content.json`) — second lab
10. ✅ Integrate seeding into canonical `prisma/seed.ts` via `prisma/discovery-seed-lib.ts`
11. ✅ Verify no other agent files modified

### Real studies (step 8)

Every physics lesson carries a `research` block citing an actual, web-verified study
(`doi` + `url`), e.g. Bérut 2012 (Landauer), Hensen 2015 (loophole-free Bell),
Tonomura 1989 (single-electron double slit), LIGO 2016, Riess 1998/2019, Planck 2018,
BCS 1957, EHT 2019, ATLAS 2012, Super-Kamiokande 1998. 31 blocks, 30 with DOIs;
1 primary historical source (Dirac 1933) linked by stable URL. No fabricated citations.

### Seeding integration (step 10)

- `prisma/discovery-seed-lib.ts` — side-effect-free `seedDiscoveryPhysics()`,
  `seedDiscoveryNeuroscience()`, `retireLegacyExtras()`.
- `prisma/seed.ts` (canonical `prisma db seed`) now retires legacy extras and seeds both labs.
- Standalone runners retained: `prisma/seed-discovery-physics.ts`, `seed-discovery-neuroscience.ts`.
- Content stays the single source of truth in this sandbox; the lib reads it by relative path.

