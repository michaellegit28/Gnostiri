---
name: sm2-spaced-repetition
description: Use when touching spaced repetition, SM-2 scheduling, mastery, or university progress logic in src/lib/spaced-repetition.ts, src/app/progress/**, or the spaced-repetition/alignment tests. Trigger keywords: SM-2, spaced repetition, mastery, ease factor, interval, scheduling, retention, progress.
---

# SM-2 spaced repetition & mastery

Gnostiri's university domain schedules concept review with SM-2. The scheduling core is `src/lib/spaced-repetition.ts`; mastery/progress surfaces live under `src/app/progress/` and `src/app/university/`.

## Rules

1. **Scheduling changes are behavior changes.** Any edit to interval/ease-factor/reps logic requires updating `tests/spaced-repetition.test.mjs` in the same change. The scheduler is load-bearing for learner trust — silent drift is worse than a bug.
2. Keep SM-2 semantics honest: ease factor floor, interval growth on repeat/lapse, reps counting. If you need different semantics, add a new, named algorithm — do not quietly mutate SM-2 constants.
3. Never schedule a lesson whose `reviewStatus` is not `needs-human-review` or better; unreviewed content must not block mastery paths.
4. Progress math (percent complete, streak, mastery %) must agree with the alignment engine: `tests/alignment-engine.test.mjs` guards the mapping between curriculum nodes and progress rollups. Change one, update the other.
5. Runtime cost: mastery recomputation runs per request on server-rendered pages. Prefer reading cached rollup rows over recomputing per view.
