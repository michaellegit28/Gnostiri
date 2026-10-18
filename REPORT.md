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
