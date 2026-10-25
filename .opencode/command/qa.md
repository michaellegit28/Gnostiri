---
description: Run the full Gnostiri QA gate suite (prisma generate, tsc, lint, all node --test files, python checks, build) and report actual results.
---

Run the full QA gate for this repo, in order, and show real output for each step. Do not summarize away failures.

1. `npx prisma generate`
2. `npx tsc --noEmit`
3. `npx next lint`
4. `node --test tests/*.test.mjs`
5. `npm run build`
6. If the change touches dynamic routes or API behavior: `node tools/smoke.mjs` against the deployed preview/production URL and report per-route status.
7. If question banks changed: `node tools/pq/audit-banks.mjs` and family verifiers.

Report as a table: gate → PASS/FAIL → evidence (file:line or count). Any FAIL: stop and diagnose; never mark a gate "probably fine". If $ARGUMENTS names specific files or paths, scope extra attention there.
