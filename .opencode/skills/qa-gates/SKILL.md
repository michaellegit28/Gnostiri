---
name: qa-gates
description: Use before any commit, PR, merge, or "done" claim on Gnostiri — runs the full verification gate suite (prisma generate, tsc, lint, node --test, python checks, build, runtime smoke). Trigger keywords: qa, gate, test, tsc, lint, build, smoke test, before merge, CI, verification.
---

# QA gates (run before every "done")

CI (`.github/workflows/ci.yml`) runs: `prisma generate` → `tsc --noEmit` → `next lint` → 3 named test files → `next build`. **CI is a subset — run everything locally, in this order:**

```bash
npx prisma generate
npx tsc --noEmit
npx next lint
node --test tests/alignment-engine.test.mjs tests/spaced-repetition.test.mjs tests/assessment.test.mjs tests/lesson-python.test.mjs tests/assessment-seed.test.mjs tests/mbbs-spine.test.mjs tests/mbbs-module-two.test.mjs tests/statistics-python.test.mjs tests/university-structure.test.mjs tests/board-taxonomy.test.mjs tests/one-count.test.mjs tests/qa-tools.test.mjs tests/qa-tools-e2e.test.mjs
npm run build
```

Then, for any change touching dynamic routes: **runtime smoke against the deployed URL** (preview or production) — `tools/smoke.mjs` — because `next build` does not exercise force-dynamic pages.

Additional gates by change type:
- Question banks → family verifiers + `node tools/pq/audit-banks.mjs`
- Seeds → count verification (`one-count.test.mjs`) + production drift sweep
- Python/statistics content → every generated snippet executed via python3
- Accessibility-sensitive UI → study-content-accessibility checklist

A gate failure is never "flaky" by default — reproduce it, or say explicitly that it is unverified. Never claim tests pass without running them.
