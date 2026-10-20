# Agent 4 — Gnostiri University: MBBS spine, degree seeding, and the rebuilt university

Round 2. Built in worktree `/tmp/opencode/gnostiri-wt/agent-4`, branch
`agent-4/university-rebuild-r2`. **No seed was run, no production database was
touched, no secrets were written, and nothing was pushed to main.**

This report covers the MBBS degree spine, how its seeds are wired, the
university UX rebuild, and where the two pre-existing core courses now live.
Round 1 (the Introduction to Programming pilot, the block types it added, the
python verification suite, and the renderer work) is kept at the end because it
is still the reference for those mechanisms.

---

## 1. The MBBS spine — nine subjects

Nine subjects are seeded on one shared engine
(`prisma/seed-courses/mbbs/spine.ts`), in teaching order:

| Code | Course id | Course slug | Level · credits | Title | Modules | Concepts | Authored | Placeholder | SBAs | Concept edges |
|---|---|---|---|---|---|---|---|---|---|---|
| ANAT 101 | `course-anatomy` | `gross-anatomy-i` | 100 · 5 | Human Anatomy — Gross & Developmental | 6 | 37 | 8 | 29 | 8 | 40 |
| PHYS 101 | `course-physiology` | `physiology-cell-and-general` | 100 · 4 | Human Physiology I — Cell, Blood & Systems | 6 | 36 | 6 | 30 | 6 | 5 |
| BCHM 101 | `course-biochemistry` | `medical-biochemistry-i` | 100 · 3 | Medical Biochemistry I — Chemistry of Cells & Proteins | 5 | 28 | 5 | 23 | 5 | 5 |
| PATH 201 | `course-pathology` | `pathology-cell-injury-repair` | 200 · 4 | General & Systemic Pathology — Cell Injury, Inflammation & Disease | 6 | 30 | 6 | 24 | 6 | 27 |
| PHRM 202 | `course-pharmacology` | `pharmacology-foundations` | 200 · 3 | Pharmacology & Therapeutics — From Receptor to Prescription | 5 | 29 | 6 | 23 | 6 | 25 |
| MED 301 | `course-internal-medicine` | `internal-medicine-foundations` | 300 · 8 | Internal Medicine — Foundations & Systems | 6 | 32 | 6 | 26 | 6 | 32 |
| SURG 301 | `course-surgery` | `surgery-principles` | 300 · 8 | Surgery — Principles & General Operation | 5 | 28 | 6 | 22 | 6 | 27 |
| OBGY 302 | `course-obgyn` | `obstetrics-gynaecology` | 300 · 4 | Obstetrics & Gynaecology — Women's Health | 5 | 30 | 6 | 24 | 6 | 28 |
| PEDS 302 | `course-paediatrics` | `paediatrics-child-health` | 300 · 8 | Paediatrics — Child Health | 5 | 29 | 6 | 23 | 6 | 30 |
| **Total** | | | **52** | | **49** | **279** | **55** | **224** | **55** | **219** |

**Every module 1 is fully authored.** 55 lessons (5-8 per subject) are written in
the pilot-report format — learning outcomes → prerequisites → the big idea →
explanation → worked examples/clinical correlation → common mistakes → inline
check questions → MCQs with explanations → summary — with one authored SBA per
concept. Modules 2-5/6 ship as a real concept spine and a closed prerequisite
DAG with `needsCheck: true` tracked placeholders; no placeholder item is ever
created, so nothing is padded to look finished.

Course-level prerequisites (`CoursePrerequisite` edges) link the chain: the
200-level subjects require the 100-level subjects, and the clinical subjects
require the pre-clinical ones plus `obstetrics-gynaecology` for PEDS.

Authoring counts per subject are fixed by the spine test, which fails if any
authored lesson is thinner than 20 blocks, is missing one of the six required
sections, has an unknown block type, an MCQ with a `correctIndex` outside its
options, fewer than four MCQs, fewer than two check questions, a mismatched
table, or a non-info/warning callout.

## 2. How the seeds are wired

`prisma/seed-courses/mbbs/index.ts` is the entry point. It imports all nine
subject seed functions in order and runs them through one idempotent loop:

```ts
const MBBS_SEEDERS = [seedAnatomy, seedPhysiology, seedBiochemistry,
  seedPathology, seedPharmacology, seedMedicine, seedSurgery,
  seedObstetricsGynaecology, seedPaediatrics];
```

- `prisma/seed-courses/mbbs/subjects.ts` is the barrel that re-exports the nine
  `SubjectSeed` objects and the shared types.
- Each subject file keeps its own exported seed function (e.g.
  `seedObstetricsGynaecology()`) and its own CLI guard
  (`process.argv[1].includes("mbbs/<basename>")`), so any single subject can be
  seeded alone without running the rest.
- `package.json` gains `"seed:mbbs": "ts-node prisma/seed-courses/mbbs/index.ts"`.
- Run order in practice: `npx ts-node prisma/seed-university.ts` (faculties,
  departments, programme, MBBS) then `npm run seed:mbbs`. `seed-university.ts`
  is required first: the spine engine resolves (or creates) the faculty,
  department and programme and throws if they are missing.
- **Nothing was run.** No seed was executed in this round.

The spine engine is idempotent throughout: upserts on stable keys (`course.id`,
`courseId+slug` for modules/concepts, the lesson id for course lessons,
`AssessmentItem.slug` for items), so re-running refreshes content in place and
never duplicates rows or edges. Every row it writes is
`reviewStatus: "needs-human-review"` — the engine never writes "verified" and
never writes "draft" — and `needsCheck` is `false` only for authored content,
`true` for tracked placeholders.

MBBS courses are attached to the MBBS programme (`programmeId`), which is what
identifies them in the rebuilt university UI.

## 3. University UX rebuild (`src/app/university/**`, `src/components/university/**`)

**`src/app/university/page.tsx` — the course index.** Replaced the faculty grid,
programme stack and pedagogy promise wall with one quiet catalogue: a hero that
states what the university is, the nine MBBS subjects in teaching order (code,
title, department, lesson/authored counts, estimated hours, credits, and a
progress bar per subject for signed-in learners), then the two foundation
courses in their own section. Empty faculties and "coming soon" noise are gone;
a course is either open to study or it is not listed.

**`src/app/university/[course]/page.tsx` — the course page.** Rebuilt around
three things: what the course is (header with code, department, level, credits,
semester, programme, lesson/authorised/concept/edge counts), where the learner
is (progress overview), and how to reach the next lesson (module → lesson spine
and a single "Continue where you left off" / "Start the first lesson" button).
Assessment routes are one compact row instead of four large buttons.

**`src/components/university/ModuleLessonNav.tsx` (new).** The course →
module → lesson spine. One disclosure section per module with per-module
progress bars, lesson titles with duration, "In preparation" labels on
placeholders, and a completion tick on lessons already done. Keyboard and
a11y: module headers carry `aria-expanded`/`aria-controls` with a roving focus
(Arrow Up/Down, Home, End, Enter/Space to toggle), lessons are real links inside
a panel that is `hidden` while collapsed, the whole nav is labelled
"Course modules and lessons", and every focusable element shows
`focus-visible:ring-gold`.

**`src/components/university/ProgressOverview.tsx` (new).** A server component
that reads the learner's own `Progress` rows (`domain: "university"`,
`entityType: "courseLesson"`, `status: "completed"`) and reports course
completion %, total lessons completed, and degree completion against the whole
catalogue, with a transcript link and a sign-in prompt for anonymous visitors.

**`src/app/university/[course]/lessons/[lesson]/page.tsx`.** Breadcrumb now
carries the module; the header shows position in course and in module, the
concept, the duration, a completion tick, and an honest "tracked placeholder"
notice for lessons that are not yet authored; the study-loop handoff and the
completion button sit in one panel; prev/next are plain labelled links.

Lessons are not attached to modules directly in the schema — the seed aligns
each lesson to the concept at the same `orderIndex`, and the concept carries
`moduleId` — so the course page groups lessons into modules through that
alignment, keeping a trailing group for any lesson without a module so no
lesson is unreachable.

**`LessonRenderer` is reused unchanged.** It already renders every block type,
so no lesson content is dropped and the redesigned pages inherit its accessible
interactive blocks.

**Other changes.** `ConceptSpine` no longer implies lessons are locked (Lock →
Circle, per-node count is unchanged); the concepts page footer no longer claims
the spaced-repetition scheduler is a later phase (it is live); the university
loading skeleton matches the new index structure. The curriculum alignment
widget and the mandatory alignment disclaimer stay on the course page (the
alignment test requires them), now sized to the quieter layout. Dark, gold,
serif design language is unchanged. `src/types/lesson.ts` needed no additions —
every block type the seeds write already existed and renders.

## 4. Where Introduction to Programming and Applied Statistics live

`prisma/seed-courses/introduction-to-programming.ts`
(`slug: introduction-to-programming`, `course-programming`) and
`prisma/seed-courses/applied-statistics.ts` (`slug: applied-statistics`,
`course-statistics`) are the two existing core courses. They are **not** part of
the MBBS spine: the rebuild identifies MBBS subjects by their `programmeId`
(the MBBS programme from `seed-university.ts`) and lists everything else, i.e.
these two, in a **Foundation courses** section below the degree on
`/university`, with a description, lesson counts, progress and a direct course
link. Their existing lesson ids, concept spines and assessment items are
untouched — no MBBS seed writes to them.

## 5. Human-review flags

- **Every row authored in this round ships `reviewStatus: "needs-human-review"`**
  — the engine has no path to "verified" and the spine test fails if any file
  writes "verified" or "draft". The 55 authored lessons and 55 SBA items await a
  subject expert's read; the 224 placeholder lessons are `needsCheck: true` by
  construction.
- **Clinical accuracy.** All medical assertions were kept to standard textbook
  teaching (cycle physiology, the four haemorrhage classes, traffic-light
  febrile assessment, the pubertal and milestone age ranges, contraindications
  to the combined pill, the jaundice thresholds, the DAG of sepsis red flags).
  Anything I could not state with confidence was phrased conservatively rather
  than asserted — e.g. vitamin K is described as "a single intramuscular dose at
  birth" without a dose that would be wrong for a small-for-gestational-age
  infant, and the immunisation tables are labelled illustrative national
  programmes rather than presented as the only schedule. Nothing in the MBBS
  seeds makes a claim I would not defend in a viva, but a clinician must still
  sign every row before a student is examined against it.
- **Interruption repair (OB/GYN).** The lesson 3 function in
  `obstetrics-gynecology.ts` was left unclosed by the system interruption, and
  one MCQ block in lesson 6 was malformed (`type: "mcq":` followed by a stray
  string). Both were repaired to the exact intended content; the file now
  passes the spine test and `tsc`. This is the one place where content could
  have been silently lost, so it is flagged here explicitly rather than buried
  in a commit message.
- **Windows and thresholds.** Where national programmes differ (blood-spot
  day, immunisation schedule rows), the tables are labelled illustrative. A
  human should pin them to one named programme before they are published as
  fact to a learner.

## 6. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` (whole project) | **0 errors** |
| `npx next build` | succeeds — university routes compile as ƒ dynamic |
| `npx next lint` | **clean, no warnings or errors** (whole project) |
| `node --test tests/mbbs-spine.test.mjs` | **12 / 12 pass** (0 skipped — all nine subject files present) |
| `npm run test:lesson-python` | **85 / 85 pass** |
| `npm run test:assessment` | 7 / 7 pass |
| `npm run test:spaced-repetition` | 7 / 7 pass |
| `npm run test:alignment` (alignment-engine) | **13 / 13 pass** |
| `npm run test:assessment-seed` | 3 / 3 pass |
| `npm run test:statistics-python` | 7 / 7 pass |

`npx next build` prints two `prisma:error` lines — `Can't reach database server
at localhost:5432` from an unrelated page's `examination.count()` during static
generation. That is this environment having no database attached (correct, by
the rules), the build still completes, and it is not from the changed files.

The spine test is the guard that caught the interrupted OB/GYN file: it evaluates
each `lessonN()` blocks array, so a lesson with a malformed block or an
unbalanced literal fails immediately. Its checks: required sections, valid
block types, minimum block count, MCQ and check-question invariants, table
integrity, exactly-four non-duplicate SBA options with the key present, closed
concept DAG (every declared prerequisite exists in the subject), unique concept
slugs, CLI guard present, and the governance rules.

## 7. Commits on `agent-4/university-rebuild-r2`

| Commit | What |
|---|---|
| `93ac0dc` … `cea4932` | this round's work, listed below |
| `763efca` | PEDS 302 — module 1 authored (6 lessons, 6 SBAs) |
| `aef8257` | OBGY 302 — module 1 authored + interrupted file repaired |
| `00e9d8b` | SURG 301 — module 1 authored (6 lessons, 6 SBAs) |
| `28f2da4` | MED 301 — module 1 authored (6 lessons, 6 SBAs) |
| `a03c3c8` | PHRM 202 — module 1 authored (6 lessons, 6 SBAs) |
| `68a8b27` | PATH 201 — module 1 authored (6 lessons, 6 SBAs) |
| `b727446` | BCHM 101 — module 1 authored (5 lessons, 5 SBAs) |
| `49040ca` | PHYS 101 — module 1 authored (6 lessons, 6 SBAs) |
| `38734b0` | mbbs spine test (structural + governance invariants) |
| `6755402` | mbbs spine engine + ANAT 101 (8 lessons, 8 SBAs) |

This round added: `aef8257` (OBGY, including the two repairs above), `763efca`
(PEDS), `93ac0dc` (seed entry point wiring), `cea4932` (university UX rebuild).
Round 1 commits are `928bf73`, `818e3a9`, `7ece25e`, `e752b4f`, `fb6ea91`,
`ab5fc44`, `3074ca6`.

## 8. Files touched this round

- `prisma/seed-courses/mbbs/obstetrics-gynecology.ts` — completed (interrupted file repaired)
- `prisma/seed-courses/mbbs/pediatrics.ts` — new
- `prisma/seed-courses/mbbs/index.ts` — new, seed entry point
- `prisma/seed-courses/mbbs/subjects.ts` — new, subject barrel
- `package.json` — `seed:mbbs` script
- `src/app/university/page.tsx` — rebuilt course index
- `src/app/university/[course]/page.tsx` — rebuilt course page
- `src/app/university/[course]/lessons/[lesson]/page.tsx` — module context, completion, keyboard path
- `src/app/university/loading.tsx` — skeleton matches the new index
- `src/app/university/[course]/concepts/page.tsx` — footer claim corrected
- `src/components/university/ModuleLessonNav.tsx` — new
- `src/components/university/ProgressOverview.tsx` — new
- `src/components/university/ConceptSpine.tsx` — Lock → Circle

---

# Round 1 — Introduction to Programming pilot (kept for reference)

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
  `negativeMarks` 0.25, difficulty derived from Bloom's level). Each stem is
  grounded in the lesson it assesses; the code-bearing explanations were
  executed against real Python before being written.
- **12 CourseLessons** — lessons 1 and 2 replace the template filler from
  `prisma/seed.ts` via `upsert` update (their stable ids are reused); the
  remaining 10 are created.

## Lessons-completion status

**All 12 lessons are fully authored** in the complete format: learning outcomes
→ prerequisites → big idea → concept explanation (why before how) → worked
examples with runnable code and exact output → common mistakes (callouts) →
3 inline check questions → 8 MCQs with explanations → summary & next lesson.

| Lesson | code blocks | checks | MCQs | total blocks | status |
|---|---|---|---|---|---|
| 1 What a program is | 2 | 3 | 8 | 38 | authored |
| 2 Variables & types | 4 | 3 | 8 | 49 | authored |
| 3 Input, output & operators | 4 | 3 | 8 | 49 | authored |
| 4 Conditions | 4 | 3 | 8 | 48 | authored |
| 5 Loops | 5 | 3 | 8 | 52 | authored |
| 6 Logic & debugging basics | 4 | 3 | 8 | 48 | authored |
| 7 Functions | 4 | 3 | 8 | 48 | authored |
| 8 Lists & dictionaries | 4 | 3 | 8 | 49 | authored |
| 9 Strings & files | 4 | 3 | 8 | 50 | authored |
| 10 Decomposition | 2 | 3 | 8 | 40 | authored |
| 11 Testing & debugging | 3 | 3 | 8 | 44 | authored |
| 12 Mini project | 4 | 3 | 8 | 48 | authored |

**44 python code blocks, every one run against python3 (3.11) and asserted to
print exactly the output the lesson states.** Lesson 9 and 12 read a
`words.txt` the lesson prints as a "create this file" table, so the suite
creates that file in a scratch directory before running — nothing is written
into the checkout.

### Lesson content format support

Added new block types to `src/types/lesson.ts`:

```ts
| { type: "code"; language: "python" | "text"; code: string; output?: string; caption?: string }
| { type: "question"; prompt: string; answer: string; explanation?: string }
| { type: "mcq"; stem: string; options: string[]; correctIndex: number; explanation: string }
```

`code` carries the source, its exact output, and a caption — so a renderer can
show a verified input/output pair. `question` and `mcq` carry the inline checks
and MCQs inline in the lesson content.

## Renderer work

`src/components/university/LessonRenderer.tsx` renders **every** LessonBlock
type, and is used by both the course page
(`src/app/university/[course]/page.tsx**) and the per-lesson study page
(`.../lessons/[lesson]/page.tsx**):

- `heading` (h4/h5), `paragraph`, `definition` (teal key-idea panel), `example`
- `callout` — `info` (sky) and `warning` (amber) variants with icons
- `table` — real `<table>` with `<th scope>`-style header row
- `code` — language label, caption, and the **verified output** in a separate
  emerald "Output" pane, so input/output pairs read like a transcript
- `question` — "Show answer" reveal wired with `aria-expanded`/`aria-controls`
- `mcq` — selectable options (real `<button>`s with `aria-pressed`) that lock
  after answering, reveal the correct option, and announce feedback through a
  polite live region; every option renders (no silent truncation past four)
- `diagram` — graceful "unavailable" fallback instead of a blank gap

Accessibility: keyboard-focusable controls with `focus-visible:ring-gold/70`,
options grouped under `role="group"` with an `sr-only` label, feedback in
`role="status" aria-live="polite"`. Strict TypeScript, exhaustive `switch` over
the union so a new block type fails compilation until it is rendered.

⚠️ Still open (out of lane, flagging for the owners):
`src/app/highschool/[exam]/[subject]/[topic]/study/StudyReaderClient.tsx` has its
own renderer that stops at `table` — no `code`/`question`/`mcq`. High-school
study readers cannot display the new block types yet.

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

Per the rules: every seeded row ships `reviewStatus: "needs-human-review"` —
**never "verified"** (12 lessons + 12 SBA items = 24 rows). `needsCheck` is
`false` on all 24 because the content is fully authored and every code output
claim is machine-checked; the rows still await a human read.

## Verification

`tests/lesson-python.test.mjs` runs **every** worked-example snippet and every
prose claim (check-question answers, MCQ explanations) through real `python3`
and asserts the exact stated output — including two snippets whose stated
output *is* an interpreter error message (asserted against real stderr, message
for message).

Three guard tests keep the suite honest:

1. **Coverage** — parses the seed's `lessonN()` blocks and fails if any python
   code block is not run by this suite. This is what caught the drift below.
2. **Format** — each of the 12 lessons must carry outcomes, prerequisites, big
   idea, common mistakes, checks, MCQs and summary.
3. **Sanity** — python3 must be Python 3, and every declared snippet/claim is
   actually declared.

File-reading snippets run in a `mkdtemp` scratch directory that is removed on
exit, so the suite no longer leaves a stray `words.txt` in the checkout.

## Correctness notes — two defects found and fixed

Verifying all 44 blocks against real python3 surfaced two places where a
lesson stated an output its own snippet could not produce:

1. **Lesson 6, worked example 2** — the syntax-error example's code block
   *contained* the colon (`for i in range(3):`) while claiming a
   `SyntaxError`, so the snippet ran fine and printed 0/1/2. The colon is now
   absent and the quoted message is Python 3.11's actual
   `SyntaxError: expected ':'` with the caret position and `File "<stdin>"`
   a reader really gets when piping the snippet in.
2. **Lesson 11, worked example 2** — the failing-test snippet omitted the
   `def add(...)` it was asserting about, so running it raised `NameError`
   instead of the stated `AssertionError`. The `def` is now included, making
   the snippet self-contained and the stated `caught: expected 6` real.

Also added a paragraph to lesson 3 explaining that the `input()` example's
output block is a terminal transcript — the prompt line shows `Ada` because
the terminal echoes keystrokes, not because the program writes them back.

Every code example is original writing and **runnable**; all outputs are real.

## Round 1 files

- `prisma/seed-courses/introduction-to-programming.ts` — the seed (new)
- `src/types/lesson.ts` — `code`/`question`/`mcq` block types (modified)
- `src/components/university/LessonRenderer.tsx` — full block renderer (modified)
- `prisma/schema.prisma` — governance fields on 2 models (modified)
- `prisma/migrations/20261010170000_lesson_governance_fields/migration.sql` (new)
- `tests/lesson-python.test.mjs` — Python output verification (new)
- `package.json` — `test:lesson-python` script (modified)

## Stopping here

The pilot course is content-complete and machine-verified. Outstanding in
round 2 and now done: the MBBS spine, the seed entry point, and the university
UX rebuild above.
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

