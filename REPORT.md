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
