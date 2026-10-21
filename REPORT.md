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


---

# Agent 4 — ROUND 3 — "never lost" structure pass (branch `agent-4/uni-structure-r1`)

**No seed was run, no production database was touched, no secrets written.**
Two commits on top of `d38f741`. Lane: `src/app/university/**`,
`src/components/university/**`, `prisma/seed-courses/mbbs/**`, university libs/tests.

Owner directive: *"Students shouldn't get lost on studies — make every interface
understandable and friendly."* Round 3 fixes the STRUCTURE and FRIENDLINESS of
the 13-course / 307-lesson spine where only MBBS Module 1 is authored per subject.

## 1. What was verified before changing anything

- **No half-empty placeholder bodies exist.** `spine.ts` `pendingLesson()`
  already writes an honest "In preparation" page (planned scope + note that the
  spine position is real). Live smoke confirmed every tail lesson in all nine
  MBBS courses renders `/In preparation/i` + `/still being written/i` — 200, no
  RSC digest.
- **Progress widgets already read real data** (`ProgressOverview` and the
  per-course counts query `prisma.progress` rows; index progress bars likewise).
- **A real defect was proven: placeholder lessons WERE completable.** The API
  (`/api/courses/[courseId]/complete`) never looked at `needsCheck`, and the
  lesson page hard-passed `locked={false}` — a student could earn fake progress
  on unwritten lessons. Fixed below.

## 2. What changed

**Placeholders can no longer be completed** (`src/app/api/courses/[courseId]/complete/route.ts`):
the route now rejects a `needsCheck` lesson with an honest 409 *before* any
progress write; the lesson page branches on `needsCheck` — placeholder lessons
show "Completion opens once the teaching content is published" instead of the
button, and anonymous visitors get a sign-in CTA instead of a 401 surprise.

**Lesson navigation is module-scoped** (`.../lessons/[lesson]/page.tsx`): prev/next
walk the module spine first ("Next lesson · <title>"), then cross a module
boundary with the destination named ("Next module · <module>") — the old
course-wide `orderIndex ± 1` jump is gone. Ungrouped lessons keep a trailing
group so no lesson is unreachable.

**The course page is honest about progress** (`[course]/page.tsx` +
`ModuleLessonNav.tsx`): each module header now reads "X of Y authored · M done";
the first uncompleted lesson is labelled **Next up** in the spine; the primary
action is "Start here — lesson 1" / "Continue — lesson N of 37" with the target
named beneath it.

**A course with nothing published says so plainly**: when `authoredCount === 0`
the page replaces the start CTA with a "This course is being written" panel and
a **Get notified when lessons open** action (anchor `/university#waitlist`; the
index now also shows the notify aside while lessons are in preparation, so the
anchor always resolves). No current course triggers this — it is a guard, not a
workaround.

**Dead ends repaired:** the exam hall route (`/university/[course]/exams`) was
**orphaned** — no page linked to it and it had no breadcrumb; it is now linked
from the course-page assessment row and carries a University → course breadcrumb.
The transcript sign-in state said "Sign in…" as plain text (dead end) — now a
real link to `/login` plus a University breadcrumb. The revision queue had no way
back and no next step — now a University breadcrumb and a "Browse the courses"
CTA in the empty state.

**Design language untouched**: dark + gold + serif, the existing LessonRenderer
and module accordion — shells upgraded, not redesigned.

## 3. Content-invariant repair (flagged — see §6)

`prisma/seed-courses/applied-statistics.ts` wrote assessment items with
`reviewStatus: "draft"` — the governance rule is *never verified, never draft*.
Both write paths restored to `needs-human-review`; the new structure test now
walks **all** of `prisma/seed-courses/**` so it cannot regress. This file is my
round-2 lane; no other agent owns it.

## 4. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npx next lint` (changed dirs) | clean |
| `npx next build` | OK — all university routes ƒ dynamic |
| `node --test` all 8 suites | **169/169 pass** (new `tests/university-structure.test.mjs`: 19 checks) |
| Live smoke (pre-merge code, all 11 courses) | every route 200, zero RSC digests; lesson 1 + last lesson of each MBBS course verified |
| Completion API contract (live) | anonymous → 401 JSON with error; placeholder → 409 (unit-tested + code path reviewed) |

New machine checks: placeholders never completable (guard precedes any write),
module-scoped nav, per-module authored progress, no orphaned routes, the
**RSC onClick-on-Link rule** (the exact bug that crashed the course page in an
earlier round) enforced across every university server component, and seed
governance across the whole seed tree.

**Local smoke limitation (infra, not code):** this sandbox has no `DATABASE_URL`
(the Supabase pooler URL is not on disk anywhere; local PostgreSQL cannot run —
the proot sandbox lacks SysV shared memory, so `initdb` fails). Agent 3 reports
the identical block. Local-smoke was replaced by (a) the static structure test
suite above and (b) a full live smoke of every touched route against the
deployed artifact (`tools/uni/smoke.mjs`, runs against any base URL). The
signed-in progress round-trip (mark-complete → widget) still needs a
`DATABASE_URL`; the write path and the read path were verified independently
(API contract live; widget queries against real `Progress` rows by code review).

## 5. Placeholder inventory — the authoring queue

**235 placeholder lessons (`needsCheck: true`) of 303 university lessons; 68
authored.** Machine-generated by `node tools/uni/placeholder-list.mjs`. Live
lesson ids were confirmed from production for the three adopted courses:

- Anatomy lessons: `cmv2dbopc0012j0hncm76l4q5-lesson-N`
- Physiology lessons: `cmv2dbvmy0022j0hn6lz6ht3l-lesson-N`
- Biochemistry lessons: `cmv2dc0i9002sj0hnniasmo1r-lesson-N`
- Fresh-seeded courses use the deterministic ids below (`course-pathology`,
  `course-pharmacology`, `course-internal-medicine`, `course-surgery`,
  `course-obgyn`, `course-paediatrics`, `course-statistics`).

Per-course: ANAT 29/37, PHYS 30/36, BCHM 23/28, PATH 24/30, PHRM 23/29,
MED 26/32, SURG 22/28, OBGY 24/30, PEDS 23/29 placeholders; STA 11/12; CSC 0/12.

### Exact ids (full list)

=== PLACEHOLDER LESSONS (needsCheck) ===
STA 101	applied-statistics	lesson 2	Describing distributions	id: course-statistics-lesson-2
STA 101	applied-statistics	lesson 3	Probability basics	id: course-statistics-lesson-3
STA 101	applied-statistics	lesson 4	Random variables & expectation	id: course-statistics-lesson-4
STA 101	applied-statistics	lesson 5	The normal distribution	id: course-statistics-lesson-5
STA 101	applied-statistics	lesson 6	Sampling & sampling distributions	id: course-statistics-lesson-6
STA 101	applied-statistics	lesson 7	Confidence intervals	id: course-statistics-lesson-7
STA 101	applied-statistics	lesson 8	Hypothesis testing — means	id: course-statistics-lesson-8
STA 101	applied-statistics	lesson 9	Inference for proportions	id: course-statistics-lesson-9
STA 101	applied-statistics	lesson 10	Chi-square tests	id: course-statistics-lesson-10
STA 101	applied-statistics	lesson 11	ANOVA	id: course-statistics-lesson-11
STA 101	applied-statistics	lesson 12	Linear regression	id: course-statistics-lesson-12
ANAT 101	gross-anatomy-i	lesson 9 (module 2/6)	Bones of the lower limb & hip bone	id: course-anatomy-lesson-9 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 10 (module 2/6)	Gluteal region & hip abductors	id: course-anatomy-lesson-10 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 11 (module 2/6)	Femoral triangle & adductor canal	id: course-anatomy-lesson-11 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 12 (module 2/6)	Popliteal fossa, leg compartments & foot	id: course-anatomy-lesson-12 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 13 (module 2/6)	Knee & ankle joints	id: course-anatomy-lesson-13 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 14 (module 2/6)	Lumbosacral plexus & lower limb innervation	id: course-anatomy-lesson-14 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 15 (module 3/6)	Abdominal wall & inguinal canal	id: course-anatomy-lesson-15 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 16 (module 3/6)	Peritoneum & peritoneal cavity	id: course-anatomy-lesson-16 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 17 (module 3/6)	Gastrointestinal tract	id: course-anatomy-lesson-17 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 18 (module 3/6)	Liver, biliary tree & pancreas	id: course-anatomy-lesson-18 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 19 (module 3/6)	Kidneys, ureters & suprarenal glands	id: course-anatomy-lesson-19 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 20 (module 3/6)	Abdominal vasculature & autonomic supply	id: course-anatomy-lesson-20 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 21 (module 4/6)	Skull, cervical fascia & muscles	id: course-anatomy-lesson-21 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 22 (module 4/6)	Muscles of facial expression & mastication	id: course-anatomy-lesson-22 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 23 (module 4/6)	Cranial nerves	id: course-anatomy-lesson-23 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 24 (module 4/6)	Neck triangles, vessels & glands	id: course-anatomy-lesson-24 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 25 (module 4/6)	Orbit, eye & special senses	id: course-anatomy-lesson-25 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 26 (module 4/6)	Ear, nose & pharynx	id: course-anatomy-lesson-26 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 27 (module 5/6)	Spinal cord & ascending/descending tracts	id: course-anatomy-lesson-27 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 28 (module 5/6)	Brainstem & cranial nerve nuclei	id: course-anatomy-lesson-28 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 29 (module 5/6)	Cerebral cortex, basal ganglia & cerebellum	id: course-anatomy-lesson-29 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 30 (module 5/6)	Meninges, ventricles & CSF	id: course-anatomy-lesson-30 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 31 (module 5/6)	Blood supply of the central nervous system	id: course-anatomy-lesson-31 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 32 (module 5/6)	Special senses: vision, hearing & balance	id: course-anatomy-lesson-32 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 33 (module 6/6)	Gametogenesis & the first weeks	id: course-anatomy-lesson-33 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 34 (module 6/6)	Placentation & fetal membranes	id: course-anatomy-lesson-34 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 35 (module 6/6)	Body cavities & the diaphragm	id: course-anatomy-lesson-35 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 36 (module 6/6)	Pharyngeal arches & derivatives	id: course-anatomy-lesson-36 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
ANAT 101	gross-anatomy-i	lesson 37 (module 6/6)	Limb development & congenital malformations	id: course-anatomy-lesson-37 [course row adopted from "gross-anatomy-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 6 (module 2/5)	Monosaccharides, disaccharides & polysaccharides	id: course-biochemistry-lesson-6 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 7 (module 2/5)	Lipids: fatty acids, glycerol & sterols	id: course-biochemistry-lesson-7 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 8 (module 2/5)	Cell membranes & membrane transport	id: course-biochemistry-lesson-8 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 9 (module 2/5)	Vitamins & trace elements	id: course-biochemistry-lesson-9 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 10 (module 2/5)	Chemical messengers & signal transduction	id: course-biochemistry-lesson-10 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 11 (module 3/5)	Bioenergetics & high-energy phosphates	id: course-biochemistry-lesson-11 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 12 (module 3/5)	Glycolysis & its control	id: course-biochemistry-lesson-12 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 13 (module 3/5)	Citric acid cycle & oxidative phosphorylation	id: course-biochemistry-lesson-13 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 14 (module 3/5)	Gluconeogenesis, glycogen & the pentose phosphate pathway	id: course-biochemistry-lesson-14 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 15 (module 3/5)	Fatty acid oxidation & ketogenesis	id: course-biochemistry-lesson-15 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 16 (module 3/5)	Fatty acid synthesis & cholesterol	id: course-biochemistry-lesson-16 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 17 (module 3/5)	Amino acid metabolism & the urea cycle	id: course-biochemistry-lesson-17 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 18 (module 4/5)	DNA structure, replication & repair	id: course-biochemistry-lesson-18 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 19 (module 4/5)	Transcription & RNA processing	id: course-biochemistry-lesson-19 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 20 (module 4/5)	Translation & the genetic code	id: course-biochemistry-lesson-20 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 21 (module 4/5)	Regulation of gene expression	id: course-biochemistry-lesson-21 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 22 (module 4/5)	Molecular genetic techniques & PCR	id: course-biochemistry-lesson-22 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 23 (module 4/5)	Recombinant DNA, cloning & gene therapy	id: course-biochemistry-lesson-23 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 24 (module 5/5)	Liver function tests & jaundice	id: course-biochemistry-lesson-24 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 25 (module 5/5)	Renal tests & the plasma acid-base disturbances	id: course-biochemistry-lesson-25 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 26 (module 5/5)	Endocrine biochemistry	id: course-biochemistry-lesson-26 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 27 (module 5/5)	Inherited metabolic disease & nutrition	id: course-biochemistry-lesson-27 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
BCHM 101	medical-biochemistry-i	lesson 28 (module 5/5)	Tumour markers & cancer biochemistry	id: course-biochemistry-lesson-28 [course row adopted from "medical-biochemistry-i" — live prefix resolved from DB]
MED 301	internal-medicine-foundations	lesson 7 (module 2/6)	Approach to the cardiac patient	id: course-internal-medicine-lesson-7
MED 301	internal-medicine-foundations	lesson 8 (module 2/6)	Ischaemic heart disease	id: course-internal-medicine-lesson-8
MED 301	internal-medicine-foundations	lesson 9 (module 2/6)	Heart failure	id: course-internal-medicine-lesson-9
MED 301	internal-medicine-foundations	lesson 10 (module 2/6)	Arrhythmias & conduction disease	id: course-internal-medicine-lesson-10
MED 301	internal-medicine-foundations	lesson 11 (module 2/6)	Valvular & structural heart disease	id: course-internal-medicine-lesson-11
MED 301	internal-medicine-foundations	lesson 12 (module 3/6)	Approach to the respiratory patient	id: course-internal-medicine-lesson-12
MED 301	internal-medicine-foundations	lesson 13 (module 3/6)	Asthma & chronic obstructive pulmonary disease	id: course-internal-medicine-lesson-13
MED 301	internal-medicine-foundations	lesson 14 (module 3/6)	Pneumonia & pleural disease	id: course-internal-medicine-lesson-14
MED 301	internal-medicine-foundations	lesson 15 (module 3/6)	Thromboembolic disease & pulmonary hypertension	id: course-internal-medicine-lesson-15
MED 301	internal-medicine-foundations	lesson 16 (module 3/6)	Interstitial & neoplastic lung disease	id: course-internal-medicine-lesson-16
MED 301	internal-medicine-foundations	lesson 17 (module 4/6)	Approach to the GI & abdominal patient	id: course-internal-medicine-lesson-17
MED 301	internal-medicine-foundations	lesson 18 (module 4/6)	Peptic ulcer & upper GI disease	id: course-internal-medicine-lesson-18
MED 301	internal-medicine-foundations	lesson 19 (module 4/6)	Inflammatory bowel disease & the colon	id: course-internal-medicine-lesson-19
MED 301	internal-medicine-foundations	lesson 20 (module 4/6)	Liver disease	id: course-internal-medicine-lesson-20
MED 301	internal-medicine-foundations	lesson 21 (module 4/6)	Pancreas & biliary disease	id: course-internal-medicine-lesson-21
MED 301	internal-medicine-foundations	lesson 22 (module 5/6)	Endocrine assessment & the thyroid	id: course-internal-medicine-lesson-22
MED 301	internal-medicine-foundations	lesson 23 (module 5/6)	Diabetes mellitus	id: course-internal-medicine-lesson-23
MED 301	internal-medicine-foundations	lesson 24 (module 5/6)	Adrenal, pituitary & gonadal disorders	id: course-internal-medicine-lesson-24
MED 301	internal-medicine-foundations	lesson 25 (module 5/6)	Lipid disorders & metabolic bone disease	id: course-internal-medicine-lesson-25
MED 301	internal-medicine-foundations	lesson 26 (module 5/6)	Endocrine emergencies	id: course-internal-medicine-lesson-26
MED 301	internal-medicine-foundations	lesson 27 (module 6/6)	Renal disease & acute kidney injury	id: course-internal-medicine-lesson-27
MED 301	internal-medicine-foundations	lesson 28 (module 6/6)	Urinary tract disease	id: course-internal-medicine-lesson-28
MED 301	internal-medicine-foundations	lesson 29 (module 6/6)	Haematology: anaemia & haemostasis	id: course-internal-medicine-lesson-29
MED 301	internal-medicine-foundations	lesson 30 (module 6/6)	Haematological malignancy	id: course-internal-medicine-lesson-30
MED 301	internal-medicine-foundations	lesson 31 (module 6/6)	Infectious disease & tropical medicine	id: course-internal-medicine-lesson-31
MED 301	internal-medicine-foundations	lesson 32 (module 6/6)	Rheumatology, neurology & dermatology in general medicine	id: course-internal-medicine-lesson-32
OBGY 302	obstetrics-gynaecology	lesson 7 (module 2/5)	Fertilisation, implantation & the placenta	id: course-obgyn-lesson-7
OBGY 302	obstetrics-gynaecology	lesson 8 (module 2/5)	Physiology of pregnancy	id: course-obgyn-lesson-8
OBGY 302	obstetrics-gynaecology	lesson 9 (module 2/5)	Antenatal care & assessment	id: course-obgyn-lesson-9
OBGY 302	obstetrics-gynaecology	lesson 10 (module 2/5)	Nutrition, medication & lifestyle in pregnancy	id: course-obgyn-lesson-10
OBGY 302	obstetrics-gynaecology	lesson 11 (module 2/5)	Prenatal diagnosis & fetal monitoring	id: course-obgyn-lesson-11
OBGY 302	obstetrics-gynaecology	lesson 12 (module 2/5)	Labour, delivery & the normal puerperium	id: course-obgyn-lesson-12
OBGY 302	obstetrics-gynaecology	lesson 13 (module 3/5)	The mechanism of normal labour	id: course-obgyn-lesson-13
OBGY 302	obstetrics-gynaecology	lesson 14 (module 3/5)	Monitoring labour & fetal distress	id: course-obgyn-lesson-14
OBGY 302	obstetrics-gynaecology	lesson 15 (module 3/5)	Induction, augmentation & assisted delivery	id: course-obgyn-lesson-15
OBGY 302	obstetrics-gynaecology	lesson 16 (module 3/5)	Caesarean section	id: course-obgyn-lesson-16
OBGY 302	obstetrics-gynaecology	lesson 17 (module 3/5)	The puerperium & postpartum problems	id: course-obgyn-lesson-17
OBGY 302	obstetrics-gynaecology	lesson 18 (module 3/5)	Jaundice & newborn care	id: course-obgyn-lesson-18
OBGY 302	obstetrics-gynaecology	lesson 19 (module 4/5)	Haemorrhage in obstetrics	id: course-obgyn-lesson-19
OBGY 302	obstetrics-gynaecology	lesson 20 (module 4/5)	Hypertensive disease & pre-eclampsia	id: course-obgyn-lesson-20
OBGY 302	obstetrics-gynaecology	lesson 21 (module 4/5)	Preterm labour & premature rupture	id: course-obgyn-lesson-21
OBGY 302	obstetrics-gynaecology	lesson 22 (module 4/5)	Malpresentation & abnormal labour	id: course-obgyn-lesson-22
OBGY 302	obstetrics-gynaecology	lesson 23 (module 4/5)	Medical complications of pregnancy	id: course-obgyn-lesson-23
OBGY 302	obstetrics-gynaecology	lesson 24 (module 4/5)	Maternal mortality & clinical skills	id: course-obgyn-lesson-24
OBGY 302	obstetrics-gynaecology	lesson 25 (module 5/5)	Abnormal uterine bleeding	id: course-obgyn-lesson-25
OBGY 302	obstetrics-gynaecology	lesson 26 (module 5/5)	Fibroids, polyps & adenomyosis	id: course-obgyn-lesson-26
OBGY 302	obstetrics-gynaecology	lesson 27 (module 5/5)	Prolapse & urinary incontinence	id: course-obgyn-lesson-27
OBGY 302	obstetrics-gynaecology	lesson 28 (module 5/5)	Cervical cancer & screening	id: course-obgyn-lesson-28
OBGY 302	obstetrics-gynaecology	lesson 29 (module 5/5)	Endometrial & ovarian cancer	id: course-obgyn-lesson-29
OBGY 302	obstetrics-gynaecology	lesson 30 (module 5/5)	Vulval & vaginal disease, sexual health	id: course-obgyn-lesson-30
PATH 201	pathology-cell-injury-repair	lesson 7 (module 2/6)	Hyperaemia, congestion & haemorrhage	id: course-pathology-lesson-7
PATH 201	pathology-cell-injury-repair	lesson 8 (module 2/6)	Thrombosis: mechanism & outcomes	id: course-pathology-lesson-8
PATH 201	pathology-cell-injury-repair	lesson 9 (module 2/6)	Embolism: types & fates	id: course-pathology-lesson-9
PATH 201	pathology-cell-injury-repair	lesson 10 (module 2/6)	Infarction & ischaemia	id: course-pathology-lesson-10
PATH 201	pathology-cell-injury-repair	lesson 11 (module 2/6)	Disseminated intravascular coagulation	id: course-pathology-lesson-11
PATH 201	pathology-cell-injury-repair	lesson 12 (module 3/6)	Definitions & nomenclature	id: course-pathology-lesson-12
PATH 201	pathology-cell-injury-repair	lesson 13 (module 3/6)	Hallmarks of cancer & molecular changes	id: course-pathology-lesson-13
PATH 201	pathology-cell-injury-repair	lesson 14 (module 3/6)	Carcinogenesis: mutation & environment	id: course-pathology-lesson-14
PATH 201	pathology-cell-injury-repair	lesson 15 (module 3/6)	Grading, staging & tumour markers	id: course-pathology-lesson-15
PATH 201	pathology-cell-injury-repair	lesson 16 (module 3/6)	Paraneoplastic syndromes & tumour immunology	id: course-pathology-lesson-16
PATH 201	pathology-cell-injury-repair	lesson 17 (module 4/6)	Mendelian, chromosomal & multifactorial disease	id: course-pathology-lesson-17
PATH 201	pathology-cell-injury-repair	lesson 18 (module 4/6)	Autoimmune mechanisms	id: course-pathology-lesson-18
PATH 201	pathology-cell-injury-repair	lesson 19 (module 4/6)	Amyloidosis	id: course-pathology-lesson-19
PATH 201	pathology-cell-injury-repair	lesson 20 (module 5/6)	Environmental & occupational pathology	id: course-pathology-lesson-20
PATH 201	pathology-cell-injury-repair	lesson 21 (module 5/6)	Nutritional disorders	id: course-pathology-lesson-21
PATH 201	pathology-cell-injury-repair	lesson 22 (module 5/6)	Toxicology & adverse drug reactions	id: course-pathology-lesson-22
PATH 201	pathology-cell-injury-repair	lesson 23 (module 5/6)	Infectious disease pathology	id: course-pathology-lesson-23
PATH 201	pathology-cell-injury-repair	lesson 24 (module 5/6)	Ageing & death	id: course-pathology-lesson-24
PATH 201	pathology-cell-injury-repair	lesson 25 (module 6/6)	Cardiovascular pathology	id: course-pathology-lesson-25
PATH 201	pathology-cell-injury-repair	lesson 26 (module 6/6)	Respiratory pathology	id: course-pathology-lesson-26
PATH 201	pathology-cell-injury-repair	lesson 27 (module 6/6)	Renal & urinary pathology	id: course-pathology-lesson-27
PATH 201	pathology-cell-injury-repair	lesson 28 (module 6/6)	Gastrointestinal & hepatobiliary pathology	id: course-pathology-lesson-28
PATH 201	pathology-cell-injury-repair	lesson 29 (module 6/6)	Endocrine & haematological pathology	id: course-pathology-lesson-29
PATH 201	pathology-cell-injury-repair	lesson 30 (module 6/6)	Nervous system, skin & musculoskeletal pathology	id: course-pathology-lesson-30
PEDS 302	paediatrics-child-health	lesson 7 (module 2/5)	Neonatal resuscitation & transitional problems	id: course-paediatrics-lesson-7
PEDS 302	paediatrics-child-health	lesson 8 (module 2/5)	Respiratory distress in the newborn	id: course-paediatrics-lesson-8
PEDS 302	paediatrics-child-health	lesson 9 (module 2/5)	Neonatal jaundice & haemolytic disease	id: course-paediatrics-lesson-9
PEDS 302	paediatrics-child-health	lesson 10 (module 2/5)	Prematurity & neonatal intensive care	id: course-paediatrics-lesson-10
PEDS 302	paediatrics-child-health	lesson 11 (module 2/5)	Congenital anomalies & syndromes	id: course-paediatrics-lesson-11
PEDS 302	paediatrics-child-health	lesson 12 (module 2/5)	Neonatal infection & sepsis	id: course-paediatrics-lesson-12
PEDS 302	paediatrics-child-health	lesson 13 (module 3/5)	Asthma & wheezing disorders	id: course-paediatrics-lesson-13
PEDS 302	paediatrics-child-health	lesson 14 (module 3/5)	Bronchiolitis, croup & upper airway	id: course-paediatrics-lesson-14
PEDS 302	paediatrics-child-health	lesson 15 (module 3/5)	Congenital heart disease	id: course-paediatrics-lesson-15
PEDS 302	paediatrics-child-health	lesson 16 (module 3/5)	Heart murmurs, myocarditis & arrhythmias	id: course-paediatrics-lesson-16
PEDS 302	paediatrics-child-health	lesson 17 (module 3/5)	Gastroenterology of childhood	id: course-paediatrics-lesson-17
PEDS 302	paediatrics-child-health	lesson 18 (module 3/5)	Dehydration & fluid management	id: course-paediatrics-lesson-18
PEDS 302	paediatrics-child-health	lesson 19 (module 4/5)	Urinary tract infection, nephrotic & nephritic syndromes	id: course-paediatrics-lesson-19
PEDS 302	paediatrics-child-health	lesson 20 (module 4/5)	Diabetes mellitus in childhood	id: course-paediatrics-lesson-20
PEDS 302	paediatrics-child-health	lesson 21 (module 4/5)	Growth, thyroid & adrenal disorders	id: course-paediatrics-lesson-21
PEDS 302	paediatrics-child-health	lesson 22 (module 4/5)	Anaemia, bleeding & haemoglobinopathies	id: course-paediatrics-lesson-22
PEDS 302	paediatrics-child-health	lesson 23 (module 4/5)	Childhood cancer & oncological emergencies	id: course-paediatrics-lesson-23
PEDS 302	paediatrics-child-health	lesson 24 (module 5/5)	Paediatric neurology & seizures	id: course-paediatrics-lesson-24
PEDS 302	paediatrics-child-health	lesson 25 (module 5/5)	Infectious disease, tuberculosis & imported disease	id: course-paediatrics-lesson-25
PEDS 302	paediatrics-child-health	lesson 26 (module 5/5)	Neurodisability, rehabilitation & the multidisciplinary team	id: course-paediatrics-lesson-26
PEDS 302	paediatrics-child-health	lesson 27 (module 5/5)	Paediatric emergencies	id: course-paediatrics-lesson-27
PEDS 302	paediatrics-child-health	lesson 28 (module 5/5)	Adolescent medicine & mental health	id: course-paediatrics-lesson-28
PEDS 302	paediatrics-child-health	lesson 29 (module 5/5)	Chronic illness, palliative care & the family	id: course-paediatrics-lesson-29
PHRM 202	pharmacology-foundations	lesson 7 (module 2/5)	Cholinergic drugs & cholinesterase inhibitors	id: course-pharmacology-lesson-7
PHRM 202	pharmacology-foundations	lesson 8 (module 2/5)	Anticholinergic drugs	id: course-pharmacology-lesson-8
PHRM 202	pharmacology-foundations	lesson 9 (module 2/5)	Sympathomimetics in detail	id: course-pharmacology-lesson-9
PHRM 202	pharmacology-foundations	lesson 10 (module 2/5)	Beta-blockers in detail	id: course-pharmacology-lesson-10
PHRM 202	pharmacology-foundations	lesson 11 (module 2/5)	Skeletal muscle relaxants & neuromuscular blockers	id: course-pharmacology-lesson-11
PHRM 202	pharmacology-foundations	lesson 12 (module 3/5)	Drugs for hypertension	id: course-pharmacology-lesson-12
PHRM 202	pharmacology-foundations	lesson 13 (module 3/5)	Drugs for heart failure & arrhythmias	id: course-pharmacology-lesson-13
PHRM 202	pharmacology-foundations	lesson 14 (module 3/5)	Lipid-lowering drugs	id: course-pharmacology-lesson-14
PHRM 202	pharmacology-foundations	lesson 15 (module 3/5)	Diuretics	id: course-pharmacology-lesson-15
PHRM 202	pharmacology-foundations	lesson 16 (module 3/5)	Anticoagulants & thrombolytics	id: course-pharmacology-lesson-16
PHRM 202	pharmacology-foundations	lesson 17 (module 3/5)	Drugs for angina, shock & resuscitation	id: course-pharmacology-lesson-17
PHRM 202	pharmacology-foundations	lesson 18 (module 4/5)	Principles of antimicrobial chemotherapy	id: course-pharmacology-lesson-18
PHRM 202	pharmacology-foundations	lesson 19 (module 4/5)	Cell wall and protein synthesis inhibitors	id: course-pharmacology-lesson-19
PHRM 202	pharmacology-foundations	lesson 20 (module 4/5)	DNA synthesis & folate antagonists	id: course-pharmacology-lesson-20
PHRM 202	pharmacology-foundations	lesson 21 (module 4/5)	Antifungal, antiviral & antiparasitic drugs	id: course-pharmacology-lesson-21
PHRM 202	pharmacology-foundations	lesson 22 (module 4/5)	Antituberculous therapy & leprosy	id: course-pharmacology-lesson-22
PHRM 202	pharmacology-foundations	lesson 23 (module 4/5)	Antimicrobial resistance & stewardship	id: course-pharmacology-lesson-23
PHRM 202	pharmacology-foundations	lesson 24 (module 5/5)	General anaesthesia	id: course-pharmacology-lesson-24
PHRM 202	pharmacology-foundations	lesson 25 (module 5/5)	Analgesics: opioids and non-opioids	id: course-pharmacology-lesson-25
PHRM 202	pharmacology-foundations	lesson 26 (module 5/5)	Epilepsy, neurodegeneration, migraine	id: course-pharmacology-lesson-26
PHRM 202	pharmacology-foundations	lesson 27 (module 5/5)	Psychiatric drugs	id: course-pharmacology-lesson-27
PHRM 202	pharmacology-foundations	lesson 28 (module 5/5)	Endocrine pharmacology	id: course-pharmacology-lesson-28
PHRM 202	pharmacology-foundations	lesson 29 (module 5/5)	Chemotherapy, special systems & biopharmaceuticals	id: course-pharmacology-lesson-29
PHYS 101	physiology-cell-and-general	lesson 7 (module 2/6)	Blood composition & plasma	id: course-physiology-lesson-7 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 8 (module 2/6)	Haemoglobin & oxygen carriage	id: course-physiology-lesson-8 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 9 (module 2/6)	Erythrocytes, iron & anaemia	id: course-physiology-lesson-9 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 10 (module 2/6)	Haemostasis & coagulation	id: course-physiology-lesson-10 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 11 (module 2/6)	Immunity: innate & adaptive	id: course-physiology-lesson-11 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 12 (module 3/6)	Cardiac cycle & heart sounds	id: course-physiology-lesson-12 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 13 (module 3/6)	Excitation-contraction coupling in the heart	id: course-physiology-lesson-13 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 14 (module 3/6)	The ECG	id: course-physiology-lesson-14 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 15 (module 3/6)	Haemodynamics: pressure, flow & resistance	id: course-physiology-lesson-15 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 16 (module 3/6)	Regulation of arterial pressure	id: course-physiology-lesson-16 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 17 (module 3/6)	Microcirculation, capillaries & lymphatics	id: course-physiology-lesson-17 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 18 (module 3/6)	Special circulations	id: course-physiology-lesson-18 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 19 (module 4/6)	Ventilation & mechanics of breathing	id: course-physiology-lesson-19 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 20 (module 4/6)	Gas exchange & diffusion	id: course-physiology-lesson-20 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 21 (module 4/6)	Gas transport & acid-base in blood	id: course-physiology-lesson-21 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 22 (module 4/6)	Control of breathing	id: course-physiology-lesson-22 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 23 (module 4/6)	Non-respiratory lung functions	id: course-physiology-lesson-23 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 24 (module 4/6)	Clinical: hypoxia & respiratory failure	id: course-physiology-lesson-24 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 25 (module 5/6)	Renal blood flow & filtration	id: course-physiology-lesson-25 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 26 (module 5/6)	Tubular reabsorption & secretion	id: course-physiology-lesson-26 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 27 (module 5/6)	Water balance & urine concentration	id: course-physiology-lesson-27 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 28 (module 5/6)	Acid-base regulation by the kidney	id: course-physiology-lesson-28 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 29 (module 5/6)	Electrolyte regulation	id: course-physiology-lesson-29 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 30 (module 5/6)	Clinical: acute & chronic kidney injury	id: course-physiology-lesson-30 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 31 (module 6/6)	GI motility & secretion	id: course-physiology-lesson-31 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 32 (module 6/6)	Digestion & absorption	id: course-physiology-lesson-32 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 33 (module 6/6)	Hepatic physiology	id: course-physiology-lesson-33 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 34 (module 6/6)	Endocrine control & the hypothalamus-pituitary axis	id: course-physiology-lesson-34 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 35 (module 6/6)	Metabolic regulation & diabetes	id: course-physiology-lesson-35 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
PHYS 101	physiology-cell-and-general	lesson 36 (module 6/6)	Reproductive physiology	id: course-physiology-lesson-36 [course row adopted from "physiology-cell-and-general" — live prefix resolved from DB]
SURG 301	surgery-principles	lesson 7 (module 2/5)	The acute abdomen & gastrointestinal bleeding	id: course-surgery-lesson-7
SURG 301	surgery-principles	lesson 8 (module 2/5)	Oesophagus, stomach & duodenum surgery	id: course-surgery-lesson-8
SURG 301	surgery-principles	lesson 9 (module 2/5)	Small bowel & emergency surgery	id: course-surgery-lesson-9
SURG 301	surgery-principles	lesson 10 (module 2/5)	Colorectal surgery	id: course-surgery-lesson-10
SURG 301	surgery-principles	lesson 11 (module 2/5)	Appendicectomy & the appendix	id: course-surgery-lesson-11
SURG 301	surgery-principles	lesson 12 (module 2/5)	Hepatobiliary & pancreatic surgery	id: course-surgery-lesson-12
SURG 301	surgery-principles	lesson 13 (module 3/5)	Approach to the vascular patient	id: course-surgery-lesson-13
SURG 301	surgery-principles	lesson 14 (module 3/5)	Aneurysmal & occlusive arterial disease	id: course-surgery-lesson-14
SURG 301	surgery-principles	lesson 15 (module 3/5)	Acute limb ischaemia	id: course-surgery-lesson-15
SURG 301	surgery-principles	lesson 16 (module 3/5)	Venous disease & lymphatics	id: course-surgery-lesson-16
SURG 301	surgery-principles	lesson 17 (module 3/5)	Cardiac surgery	id: course-surgery-lesson-17
SURG 301	surgery-principles	lesson 18 (module 4/5)	Approach to the urological patient	id: course-surgery-lesson-18
SURG 301	surgery-principles	lesson 19 (module 4/5)	Stones & obstruction of the urinary tract	id: course-surgery-lesson-19
SURG 301	surgery-principles	lesson 20 (module 4/5)	Prostate & bladder disease	id: course-surgery-lesson-20
SURG 301	surgery-principles	lesson 21 (module 4/5)	External genitalia & the scrotum	id: course-surgery-lesson-21
SURG 301	surgery-principles	lesson 22 (module 4/5)	Renal transplantation	id: course-surgery-lesson-22
SURG 301	surgery-principles	lesson 23 (module 5/5)	Fractures & dislocations	id: course-surgery-lesson-23
SURG 301	surgery-principles	lesson 24 (module 5/5)	Limb orthopaedics	id: course-surgery-lesson-24
SURG 301	surgery-principles	lesson 25 (module 5/5)	Spinal orthopaedics	id: course-surgery-lesson-25
SURG 301	surgery-principles	lesson 26 (module 5/5)	Paediatric surgery	id: course-surgery-lesson-26
SURG 301	surgery-principles	lesson 27 (module 5/5)	Neurosurgery	id: course-surgery-lesson-27
SURG 301	surgery-principles	lesson 28 (module 5/5)	Hand, plastic, reconstructive & transplant surgery	id: course-surgery-lesson-28


## 6. Human-review flags

1. **`reviewStatus: "draft"` repair in `applied-statistics.ts`** (above) —
   production rows written before the invariant existed may still carry
   `reviewStatus: 'draft'`; a manual `update` to `needs-human-review` on
   `AssessmentItem` for `courseId = course-statistics` is needed when the
   seeder next runs (I did not touch the database).
2. **Enrolment gating**: completion of non-premium users is limited to the first
   lesson per course by the API's premium check — unchanged this round; UX now
   explains sign-in instead of failing silently. Owner should confirm the
   intended paywall for lessons 2+.
3. **"Continue" points at the first uncompleted lesson even when it is a
   tracked placeholder** (honest "In preparation" landing page, never a fake
   start). If the owner prefers the CTA to skip ahead to the next *authored*
   lesson, that is a one-line change in the course page.
4. **The 68 authored lessons await a clinician's read** (`needsCheck: false`,
   `reviewStatus: "needs-human-review"`) — the authoring queue above is
   orchestrator-owned; nothing was authored in round 3 beyond what already
   shipped in round 2.

## 7. Commits on `agent-4/uni-structure-r1`

| Commit | What |
|---|---|
| `4431912` | placeholders not completable (API 409 + UI lock), module-scoped lesson nav with named boundaries, per-module authored counts + Next-up marker, Start here / Continue — lesson N, being-written + Get notified state, exam hall de-orphaned, transcript/revision/exams breadcrumbs + sign-in fix, index notify anchor while in preparation |
| `0b3c6da` | `tools/uni/placeholder-list.mjs` (authoring-queue manifest), `tools/uni/smoke.mjs` (lane smoke suite), `tests/university-structure.test.mjs` (19 checks), `applied-statistics.ts` draft-status invariant repair, `test:university-structure` script |
