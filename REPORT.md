# Pilot Course Seed — Introduction to Programming (Python)

Built as requested: `prisma/seed-courses/introduction-to-programming.ts`, a new
idempotent seed file with an exported function `seedIntroductionToProgramming()`
for Agent 1 to wire in. **No seed was run, no production was touched, nothing
committed to main.**

## What was built

**Course spine** — 4 modules x 3 lessons = 12 lessons, ids `course-programming-lesson-1..12`:

| Module | Lessons |
|---|---|
| M1 — Thinking like a programmer | 1. What a program is · 2. Variables & types · 3. Input, output & operators |
| M2 — Control flow | 4. Conditions · 5. Loops · 6. Logic & debugging basics |
| M3 — Organizing code | 7. Functions · 8. Lists & dictionaries · 9. Strings & files |
| M4 — Building | 10. Decomposition · 11. Testing & debugging · 12. Mini project |

- **12 ConceptNodes** — one per lesson, same `orderIndex`, each carrying
  `bloomsLevel` and `estMinutes`, linked to its module, with 11 prerequisite
  edges forming a DAG across the course.
- **12 SBA AssessmentItems** — one per concept, following the
  `seed-university.ts` convention (`${courseSlug}--${conceptSlug}--sba`,
  `negativeMarks` 0.25, difficulty derived from Bloom's level).
- **12 CourseLessons** — lessons 1 and 2 replace the template filler from
  `prisma/seed.ts` via `upsert` update (their stable ids are reused); the
  remaining 10 are created.

**Lesson 1 is fully authored** in the complete format: learning outcomes →
prerequisites → big idea → concept explanation (why before how) → 2 worked
examples with runnable code and exact output → common mistakes (3 callouts) →
3 inline check questions → 8 MCQs with explanations → summary & next lesson.

## Lesson format support

Added new block types to `src/types/lesson.ts`:

```ts
| { type: "code"; language: "python" | "text"; code: string; output?: string; caption?: string }
| { type: "question"; prompt: string; answer: string; explanation?: string }
| { type: "mcq"; stem: string; options: string[]; correctIndex: number; explanation: string }
```

`code` carries the source, its exact output, and a caption — so a renderer can
show a verified input/output pair. `question` and `mcq` carry the inline checks
and MCQs inline in the lesson content.

⚠️ **Renderer gap:** the university course page
(`src/app/university/[course]/page.tsx:147-160`) only renders `heading`,
`paragraph` and `definition`. Lesson 1's `code`/`callout`/`question`/`mcq`
blocks will store correctly but **will not display** until that renderer is
extended. Flagging as the follow-up task.

## Governance fields

Added to `prisma/schema.prisma` on **CourseLesson** and **AssessmentItem**:

```prisma
reviewStatus  String   @default("needs-human-review") // needs-human-review | draft | verified
needsCheck    Boolean  @default(false)
```

Migration: `prisma/migrations/20261010170000_lesson_governance_fields/migration.sql`
— two additive `ADD COLUMN` statements with defaults. **RLS n/a**: both tables
already carry `ENABLE ROW LEVEL SECURITY` (verified in
`20260926070000_enable_content_rls` and `20261010155500_assessment_layer`).

Per the rules: every seeded row has `reviewStatus: "needs-human-review"`, never
`"verified"`. Lessons 2-12 additionally set `needsCheck: true` since their full
content is pending.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` (whole project) | **0 errors** |
| `next lint` on new files | clean |
| `npm run test:lesson-python` | **8/8 pass** |
| `npm run test:assessment` | 7/7 pass |
| `npm run test:spaced-repetition` | 7/7 pass |
| `npm run test:alignment` | 13/13 pass |

`tests/lesson-python.test.mjs` (new) runs each lesson-1 snippet and MCQ claim
through real `python3` and asserts the exact output the lesson states. All
examples and answers are verified against Python 3.11, not eyeballed. Skips
cleanly when `python3` is absent.

## Correctness notes

- Every code example is original writing and **runnable**; outputs are real.
- Lesson 1 uses `needsCheck: false` (fully authored); lessons 2-12 use
  `needsCheck: true` with placeholder content so the spine is complete and the
  exam builder works, but nothing pretends to be finished.

## Files

- `prisma/seed-courses/introduction-to-programming.ts` — the seed (new)
- `src/types/lesson.ts` — `code`/`question`/`mcq` block types (modified)
- `prisma/schema.prisma` — governance fields on 2 models (modified)
- `prisma/migrations/20261010170000_lesson_governance_fields/migration.sql` (new)
- `tests/lesson-python.test.mjs` — Python output verification (new)
- `package.json` — `test:lesson-python` script (modified)

## Stopping here

Per instructions: **lesson 1 is complete and I'm stopping for your review**
before authoring lessons 2-12. Please review lesson 1's content, format and the
new block types; on your go-ahead I'll author the remaining 11 in the same
style.

### ⚠️ Multi-agent incident (for your awareness)

During this session another agent ran `git reset --hard HEAD`
(reflog `5f26c2c HEAD@{0}: reset: moving to HEAD`), which discarded uncommitted
changes to tracked files. It reverted my `src/types/lesson.ts` `code`-block
addition and momentarily appeared to destroy the new seed file. I recovered
both — the seed file was untracked and survived, and I re-applied the type. No
work was lost. Flagging because it means uncommitted shared-file edits in this
checkout are not safe from peer agents; wiring this seed in via a commit would
protect it.

---

# Agent 3 — Discovery Builder (branch `agent-3/discovery-r1`)

Two commits. `node_modules` was re-linked from the main clone after the
interrupted session's fresh install; **no seed was run and no database was
touched** — the seeder is authored only.

## 1. Block renderer extension — commit `73ce147`

`src/app/discovery/[topic]/DiscoveryReader.tsx` and `src/app/discovery/[topic]/page.tsx`.

### Coverage — all 10 `LessonBlock` types

| Type | Renderer | Notes |
|---|---|---|
| `heading` | inline | `level` 2 → `<h2>` slate-100 serif; 3 → `<h3>` gold |
| `paragraph` | inline | `font-reading`, 1.8 leading |
| `definition` | inline | gold "Key idea" card, bold term + text |
| `example` | inline | violet left-rule "See it in action" |
| `callout` | inline | **now iconified** — `Info` (sky) for `info`, `AlertTriangle` (rose) for `warning`, each with a labelled heading |
| `table` | inline | overflow-x scroll, `thead`/`tbody` divide |
| `code` | `CodeCard` | language chip, `caption`, `<pre><code>`, separate emerald "Output" panel |
| `question` | `QuestionCard` | hidden until "Reveal the answer" is pressed; then answer + `explanation`; `aria-expanded`/`aria-controls` on a `useId` region |
| `mcq` | `McqCard` | options are selectable buttons; on pick, per-option correct/picked tone, `role="status"` live region announces "Correct —" / "Not quite —" plus the key letter and explanation |
| `diagram` | inline | dashed placeholder with `diagramId` + always-rendered `caption` |

### Accessibility

- `QuestionCard` reveal is a real disclosure: `aria-expanded` tracks state and
  `aria-controls` points at the answer region (id from `useId`).
- `McqCard` options sit in a `role="group"` labelled with the stem, each button
  carries `aria-pressed`, and the post-pick feedback is a polite live region so
  a screen reader hears the result without focus moving.
- All interactive targets keep the 44px minimum hit height used elsewhere on the
  discovery pages.

### Robustness

- `Block`'s `default` branch is now an exhaustiveness guard
  (`const exhaustive: never = block`). If a type is added to `LessonBlock` the
  build fails until a case handles it — this is what stops the renderer gap
  described in the section above from recurring.
- `MCQ_LETTERS` was replaced by `letterFor(index)` (`String.fromCharCode`), so
  an mcq with more than four options no longer silently loses its last options.
- `correctIndex` is clamped into range before use, so a legacy row with an
  out-of-range key shows a letter rather than crashing.
- `page.tsx`'s inline 6-type allowlist was extracted to
  `toLessonBlocks()` and extended to all 10 types — the filter itself is
  unchanged in spirit, still dropping unknown shapes from legacy rows.

`npx tsc --noEmit`: 0 errors. `next lint` on both changed files: clean.

## 2. Discovery seed — commit `4dd5445`

`prisma/seed-courses/discovery-curiosity.ts` (new, ~1400 lines).

### Field

| Row | Id | Notes |
|---|---|---|
| Field topic | `discovery-curiosity` | title "Curiosity Trails", slug `curiosity-trails`, `parentId: null`, `orderIndex: 5`, `isPublished: true` |

`orderIndex 5` lands it last: the five generic extras roots occupy 0–4.

### Trails

| Row | Id | Parent | Order |
|---|---|---|---|
| Trail | `discovery-curiosity-scale` | `discovery-curiosity` | 0 |
| Trail | `discovery-curiosity-sky` | `discovery-curiosity` | 1 |

### Lessons — 8, `orderIndex` carries the depth level

| Id | Depth | Title |
|---|---|---|
| `discovery-curiosity-scale-lesson` | 0 Understand | How small is small? |
| `discovery-curiosity-scale-lesson-explore` | 1 Explore | The planet you are standing on |
| `discovery-curiosity-scale-lesson-deeper` | 2 Go Deeper | Stars and the spaces between |
| `discovery-curiosity-scale-lesson-research` | 3 Research | Galaxies, light-years, and looking back in time |
| `discovery-curiosity-sky-lesson` | 0 Understand | What light is made of |
| `discovery-curiosity-sky-lesson-explore` | 1 Explore | The air between us and space |
| `discovery-curiosity-sky-lesson-deeper` | 2 Go Deeper | Why blue wins, and why not violet |
| `discovery-curiosity-sky-lesson-research` | 3 Research | Sunsets, red moons, and other skies |

**Every one of the 8 lessons contains all 10 block types**, so each depth
exercises every renderer from commit `73ce147`.

### Quiz questions — 6 (extras domain, `type: "mcq"`)

`discovery-curiosity-scale-q1`, `-q2`, `-q3`;
`discovery-curiosity-sky-q1`, `-q2`, `-q3`.
Three per trail, easy/medium/hard. 18 inline `mcq` blocks are also carried
inside the lesson content (2–3 per depth).

### Totals

1 field + 2 trails + **8 published lessons** + **6 quiz questions**.

### Conventions followed from `introduction-to-programming.ts`

- Exported `seedDiscoveryCuriosity()` plus the `process.argv[1]` CLI guard.
- Every write is an `upsert` with identical `update` and `create` payloads on a
  stable id, so re-running refreshes in place and never duplicates.
- No hardcoded `id` outside the seed constants; `content` cast via `as never`
  because `Lesson.content` is `Json`.
- Answer-key drift is a `throw`, not a silent overwrite —
  `balancedContent`/`rotatedOptions` prove the key survives rotation before
  writing.

### Factual verification

A temporary harness (deleted before commit) ran **189 checks, 0 failures**:

- **9 Python snippets executed against `python3`**; every claimed `output`
  matched byte for byte. The light-travel-time, Rayleigh 1/λ⁴, air-mass
  (Kasten–Young) and light-year derivations are all computed, not typed.
- **All 18 inline `mcq` keys** confirmed to point at the true statement.
- **All 6 quiz keys** confirmed present in their own options.
- Structural checks on every block: heading `level ∈ {2,3}`, callout variants,
  table row widths equal to header counts, `correctIndex` in range, `diagram`
  ids present, block counts.

Answer-position spread: stored positions come out **A5 B9 C4 D6** via a
deterministic FNV-1a rotation (the authoring bias over the 18 inline MCQs was
A2 B10 C6 D0). No explanation in the file names an option letter, so rotation
cannot break a key — and `QuizClient` matches on the trimmed, case-folded
option *text*, not an index, which is why this is safe for the question rows
too.

### ⚠️ Human-review flags

- `needsVerification: true` on the field topic and **both trail topics**. The
  seeder never marks a row verified.
- **Note for A1:** `Lesson` and `Question` have **no `reviewStatus` column** in
  `prisma/schema.prisma` — only `CourseLesson` and `AssessmentItem` do (added
  in the university lane above). So the topic-level `needsVerification` flag is
  the single human-review marker for the extras domain, and it is deliberately
  set while `isPublished` is true: the trail is browsable now, and review is
  tracked separately. **If you want per-lesson/per-question review status in
  extras, that is a schema migration** — not something this seeder can express.
- `lastAuditedDate` is deliberately left unset on the discovery rows: there has
  been no audit to date it.

---

# Agent 3 — Discovery Builder, Round 2 (branch `agent-3/discovery-physics-r2`)

Owner directive: discovery rebuilt as physics-first research. Three commits.
**No seed was run, no database was touched** — the seeder is authored only.

## 1. Theory block + TheoryPrompt — commit `a5f152c`

| File | Change |
|---|---|
| `src/types/lesson.ts` | new `LessonBlock` variant: `{ type: "theory"; prompt: string; modelAnswer: string; explanation?: string }` |
| `src/components/discovery/TheoryPrompt.tsx` | **new component** |
| `src/app/discovery/[topic]/DiscoveryReader.tsx` | `case "theory"` in the `Block` switch, next to the exhaustiveness guard; quiz door gated on `hasQuiz` |
| `src/app/discovery/[topic]/page.tsx` | `theory` added to `LESSON_BLOCK_TYPES`; `prisma.question.count` per topic passed as `hasQuiz` |

**TheoryPrompt** mirrors the highschool theory wall (`TheoryEditor.tsx` +
`AnswerBooklet.tsx`): a real `<textarea>` with generous keyboard space
(`rows={12}`, `min-h-[280px]`, `spellCheck`) and a live word/char count, plus
the QuestionCard disclosure pattern — "Reveal model answer" with
`aria-expanded`/`aria-controls` on a `useId` region, toggle back to "Hide".
Discovery's dark cosmic + gold language throughout (gold-tinted panel,
`font-reading`, focus-visible gold ring, 44px hit height). The other two
`LessonBlock` consumers (`LessonRenderer`, `StudyReaderClient`) already
`return null` on unknown types, so the shared type addition compiles clean
in their lanes — tsc 0 errors, lint clean.

**Quiz gating:** discovery carries no quizzes, so the "Test yourself" door now
renders only when the topic actually owns Question rows (`hasQuiz`). The
rebuilt Curiosity Trails own none → no door. Legacy extras topics that still
have question rows keep theirs (flagging below: this is the deliberate
minimal-fit to the directive).

## 2. Rebuilt seed — commit `ed2b2ee` — `prisma/seed-courses/discovery-curiosity.ts`

### Trail map — 7 trails × 4 depths = 28 published lessons

| # | Trail (id) | Physics branch | Research-depth primer centres on |
|---|---|---|---|
| 1 | The Scale Ladder (`-scale`) | astrophysics & cosmology | 46 Gly comoving radius; Hubble's law; critical density ρc = 3H²/8πG |
| 2 | Why the Sky Is Blue (`-sky`) | waves & optics (light) | Rayleigh (λ⁻⁴) vs Mie; Beer–Lambert reddening model; polarisation (Arago) |
| 3 | The Rules of Motion (`-motion`) | mechanics | Newton's Moon test: a = 4π²r/T² = 2.724×10⁻³ m/s² vs g/(r/R)² = 3,605 vs 3,640 |
| 4 | Why Heat Never Flows Uphill (`-heat`) | thermodynamics | Kelvin–Planck/Carnot ceiling; Boltzmann S = k ln W; Landauer kT ln 2; Maxwell's demon resolved |
| 5 | The Life of a Wave (`-wave`) | waves (mechanical) | d'Alembert's wave equation; deep-water dispersion; Fourier harmonics; Schrödinger's debt |
| 6 | The Invisible Current (`-current`) | electricity & magnetism | Maxwell's displacement current; c = 1/√(ε₀μ₀) = 2.998×10⁸ m/s; Hertz 1887 |
| 7 | Why the Atom Is Not a Tiny Solar System (`-quantum`) | modern/quantum | Planck→Bohr→de Broglie→Schrödinger; α = 1/137.036; Bell 1964 / Aspect 1982 |

- **No quizzes.** The six round-1 quiz Question rows
  (`discovery-curiosity-scale-q1..q3`, `-sky-q1..q3`) are retired by stable id
  via `question.deleteMany` on every seed run (no-op on a fresh DB). Every
  lesson is kept.
- **28 theory prompts** (one per lesson, plus extras), 18 inline `question`
  blocks and 24 inline `mcq` blocks are the only question carriers.
- **Research depths** carry derivations, orders of magnitude and primary
  references (Principia 1687, Carnot 1824, Boltzmann 1877, Maxwell 1865,
  Schrödinger 1926, Bell 1964 …) — not school summaries.
- **Block-type coverage:** all 11 block types are exercised in every lesson
  except that the research depths of trails 3–7 deliberately carry **no `mcq`**
  — a research primer does not end in multiple choice; the theory prompt is
  the check there. Trails 1–2 kept their round-1 research-depth mcqs.
- Idempotent upserts on stable ids throughout (unchanged convention);
  `needsVerification: true` on the field topic and all 7 trail topics.

## 3. Verification counts

Temporary harness (`prisma/seed-courses/verify-curiosity.ts`, deleted before
commit) + project checks:

| Check | Result |
|---|---|
| Python code blocks executed via `python3` | **31/31** byte-identical to the claimed output |
| Computed prose claims (recomputed in python3, matched to text) | **29/29** |
| Structural checks (heading levels, callout variants, table row widths, `correctIndex` range, diagram ids, theory shapes) | **0 failures** across 28 lessons |
| Trails / lessons / theory prompts | 7 / 28 / 28 |
| `npx tsc --noEmit` (whole project) | **0 errors** |
| `next lint` on changed files | clean |
| `npm run test:assessment` | **7/7 pass** |
| `npm run test:spaced-repetition` | **7/7 pass** |
| `npm run test:alignment` | **13/13 pass** |

The harness caught six real errors before commit, all fixed: a wrong Hubble-rate
digit (2.269e-18 → 2.268e-18), the fine-structure constant to six decimals
(0.007297, not 0.007296 — my typo), a sound-speed code block using M = 0.029
instead of 0.0289642 (342.9 vs 343.2 m/s, and the temperature rows), the
1 C "weight" comparison (916,208 tonnes, not 900 — 9000× typo), Mach 1 at
cruising altitude (299 m/s/87%, not 295/86%), and the human-scale log-midpoint
claim in Trail 1 (humans sit 10 powers above an atom and 26 below the
observable universe — nearer the small end, not at the midpoint; the
midpoint of 10⁻¹⁵…10²⁶ is 10⁸ m).

## ⚠️ Human-review flags

- `needsVerification: true` on the field topic and **all seven trail topics**.
  The seeder never marks a row verified. `Lesson` has no `reviewStatus`
  column, so topic-level `needsVerification` remains the single review flag
  for extras (schema migration if per-lesson flags are wanted).
- **The retired quiz rows only disappear when this seeder is next run.**
  Production still holds the six Question rows until A1 runs it; nothing was
  executed here.
- **Quiz-door gating is my minimal reading of "no quizzes in discovery":**
  `DiscoveryReader`'s "Test yourself" link now renders only for topics that
  still own Question rows (the legacy `disco-*` chain in `prisma/seed.ts`
  keeps theirs). If the owner wants the discovery quiz page/route removed
  wholesale, that is a one-line follow-up in the reader and route.
- Research depths of trails 3–7 omit `mcq` by design (see above); if the
  reviewer prefers strict per-lesson block parity, adding one mcq per depth
  is mechanical.
- `lastAuditedDate` remains unset on all discovery rows: no audit has
  happened. All physics content needs a domain-expert read before the
  `needsVerification` flags come off.

