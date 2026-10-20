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
type, and is used by both the course page (`src/app/university/[course]/page.tsx:151`)
and the per-lesson study page (`.../lessons/[lesson]/page.tsx:100`):

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

| Check | Result |
|---|---|
| `npx tsc --noEmit` (whole project) | **0 errors** |
| `npx next build` | succeeds (university routes compile as ƒ dynamic) |
| `npx next lint` on changed files | clean |
| `npm run test:lesson-python` | **85 / 85 pass** |
| `npm run test:assessment` | 7/7 pass |
| `npm run test:spaced-repetition` | 7/7 pass |
| `npm run test:alignment` | 13/13 pass |
| `npm run test:assessment-seed` | 3/3 pass |
| `npm run test:statistics-python` | 7/7 pass |

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

## Files

- `prisma/seed-courses/introduction-to-programming.ts` — the seed (new)
- `src/types/lesson.ts` — `code`/`question`/`mcq` block types (modified)
- `src/components/university/LessonRenderer.tsx` — full block renderer (modified)
- `prisma/schema.prisma` — governance fields on 2 models (modified)
- `prisma/migrations/20261010170000_lesson_governance_fields/migration.sql` (new)
- `tests/lesson-python.test.mjs` — Python output verification (new)
- `package.json` — `test:lesson-python` script (modified)

## Stopping here

The course is content-complete and machine-verified. Outstanding (not mine to
do): wiring `seedIntroductionToProgramming()` into `prisma/seed.ts` (Agent 1),
and extending the high-school study reader to the new block types.

### ⚠️ Historical multi-agent incident (earlier session, resolved)

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

