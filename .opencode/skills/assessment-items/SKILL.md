---
name: assessment-items
description: Use when creating or editing AssessmentItem rows, seed-assessment-* files, competency templates, concept summaries, or quiz/assessment engine code. Trigger keywords: assessment item, AssessmentItem, quiz, MCQ engine, competency, seed assessment, IQR, reviewStatus, needs-human-review.
---

# Assessment items & seeds

Assessment items back the practice/CBT/quiz flows. Shape and seeding rules:

1. **Authoring format**: follow the existing `prisma/seed-assessment-*.ts` patterns (anatomy, biochemistry, physiology). One concern per seed file; idempotent upserts keyed by stable ids; re-runnable without duplicating rows.
2. **reviewStatus discipline**: seeds ship `draft` → then repaired to `needs-human-review`. Production rows have drifted from seed before (42 draft rows found live while seed was fixed) — after ANY seed change, sweep production rows, don't trust the seed.
3. **Stem ambiguity**: state conventions explicitly in the stem. Example fix: "master-statistics-probability-q2 IQR ambiguity patched (stem states exclusive convention, key unchanged)". If a key is disputed, change the stem's wording, not the key.
4. **Counts are verified, not assumed**: after seeding, check counts against `tests/one-count.test.mjs` and `tests/assessment-seed.test.mjs`; log actual inserted/skipped numbers in the commit message.
5. **NEVER** generate a Python/statistics example without running it — `tests/statistics-python.test.mjs` and `tests/lesson-python.test.mjs` execute generated code; broken output fails CI.
6. Engine changes (scoring, marking, ai-mark) require `tests/assessment.test.mjs` to stay green and an a11y check on feedback UI (see study-content-accessibility).
