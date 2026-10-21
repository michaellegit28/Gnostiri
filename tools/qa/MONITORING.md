# Gnostiri QA — Monitoring & Standing Procedure

Round 4 · owner: Agent 7 (QA & live monitoring) · repo: `tools/qa/`, `tools/smoke.mjs`,
`tools/audit-counts.mjs`, `tests/qa-tools*.test.mjs`

## Why this exists

Two production defects shipped **green**:

| Defect | What shipped | Why nothing caught it |
| --- | --- | --- |
| JAMB count mismatch (shipped twice) | `/api/questions` + practice picker served ~340 tagged questions, `/cbt` served the 6,000-question topic tree, the board page counted 0 and printed "Papers are being digitized" | `next build` passed, `tsc` passed, 141 unit tests passed. **Build success ≠ working pages**, and nobody compared the counts across surfaces. |
| University RSC crash | A route threw during render and still returned a 200 shell | No probe ever rendered the page. |

So the standing rule is: **every shipped route is probed over HTTP, and every per-board count is
cross-checked across all the surfaces that publish it.** Nothing below reads a database to decide
whether the site works — it reads what a student would read.

## The tools

Both are zero-dependency (Node 18+ built-in `fetch`), work against any origin, and exit `1` on any
disagreement. Run them from the repo root.

```bash
SMOKE_URL=http://localhost:3000        node tools/smoke.mjs          # local prod server
SMOKE_URL=https://gnostiri.vercel.app  node tools/smoke.mjs          # production
SMOKE_URL=https://gnostiri.vercel.app  node tools/audit-counts.mjs   # count cross-check

node tools/smoke.mjs --url http://localhost:3223 --json               # machine-readable
node tools/audit-counts.mjs --url http://localhost:3000 --boards jamb # one board
node tools/audit-counts.mjs --db                                      # + direct Postgres surface
```

### `tools/smoke.mjs` — does the page work?

Per route: HTTP 200 (a redirect where 200 is expected fails), zero RSC error digests
(`"digest":"…"`, `NEXT_NOT_FOUND`, `NEXT_REDIRECT`, `NEXT_HTTP_ERROR_FALLBACK`, "Internal Server
Error"), zero soft-404 body copy, required content markers, and — where content is mandatory — the
question count the page advertises. API probes assert JSON shape, minimum array length and the
`correctAnswer`-never-crosses-the-wire invariant.

Markers are deliberately loose (never an exact count) so content edits do not produce flaky alarms.

### `tools/audit-counts.mjs` — do the counts agree?

For all 14 registry boards it reads the per-board question count off five surfaces and fails on any
disagreement:

| Surface | Read from |
| --- | --- |
| `board-html` | `/highschool/exams/[board]` — hero count, subject cards, per-topic cards |
| `picker-html` | `/highschool/practice/[board]` — tag-scoped totals and per-topic type counts |
| `hub` | `/highschool/exams` — per-board "N practice Qs" chip |
| `api` | `/api/questions?boardId=&topicId=` — one probe per topic in the tree |
| `cbt` | `/cbt` board payload + `POST /api/cbt/session` |
| `db` | Postgres topic tree (requires `DATABASE_URL`, else skipped and labelled) |
| `quiz` | the topic quiz page's "Question 1 of N" |

Checks run: board-page self-consistency (hero vs subject cards vs topic cards), per-topic
`board card == /api/questions`, tree-family agreement (board page == /cbt == db), tag-family
agreement (practice engine sentence == picker == hub), CBT buildability, the soft-404/RSC guards, and
`TREE_VS_TAG` — the tree count the board page advertises versus the tag-scoped count the practice
picker advertises. That last one **is** the JAMB bug, and it is the reason the tool exists.

Every defect printed as `route · symptom · hypothesis` so it can be pasted straight into a mailbox.

## Schedule

| When | Command | Gate |
| --- | --- | --- |
| Before every merge (all agents) | `node tools/qa-tools.test.mjs` → `npx tsc --noEmit` → `npx next lint` → `npx next build` | all exit 0 |
| Before every merge, local server | `npx next build && npx next start`, then `node tools/smoke.mjs` + `node tools/audit-counts.mjs --db` | smoke 26/26, audit `AUDIT PASS` |
| Immediately after every push | poll the deploy until READY, then `SMOKE_URL=https://gnostiri.vercel.app node tools/smoke.mjs` | 26/26 |
| Immediately after every push | `SMOKE_URL=https://gnostiri.vercel.app node tools/audit-counts.mjs` | `AUDIT PASS`, or a written owner assignment for each defect |
| Nightly, unattended | both tools against production; fail → notify the lane owner | exit 0 |
| After any change to `src/lib/exam-bank.ts`, the board/practice/cbt pages, or the question bank | both tools live | exit 0 |

`--allow-tag-gap` downgrades `TREE_VS_TAG` from a failure to a warning. It exists only for a
deliberate, documented transition; it is **not** part of the standing schedule.

### Production tuning (measured)

Production is slow — DB-backed routes take 2–12s depending on cold-start state. At the default
concurrency of 8, requests queue behind each other and the 30s timeout trips, producing
`request failed — TypeError: fetch failed` flakes that are **not** defects. Use:

```bash
SMOKE_CONCURRENCY=4 SMOKE_TIMEOUT_MS=60000 SMOKE_URL=https://gnostiri.vercel.app node tools/smoke.mjs
```

Local `next start` is the opposite: it is fast but every DB route fails without `DATABASE_URL`, and
the suite reports those as RSC digests — which is correct, that is the detector doing its job
against a real production server rather than a fixture.

## Required environment

- `SMOKE_URL` — the origin under test (defaults to `http://localhost:3000`).
- `DATABASE_URL` — Supabase pooler on port 6543, **must** carry
  `?pgbouncer=true&connection_limit=1` or scripted calls hang. Without it the `db` surface is
  skipped (labelled in the output) and everything else still runs.
- `SMOKE_TIMEOUT_MS` / `AUDIT_TIMEOUT_MS`, `SMOKE_CONCURRENCY` / `AUDIT_CONCURRENCY` — tune only for
  a slow origin.

## On failure

1. **Never** edit another agent's files. Copy the printed `route · symptom · hypothesis` block into
   that agent's mailbox (`/tmp/opencode/mailbox/agent-N/AGENT-MESSAGES.md`).
2. Lane ownership: agent 5 = exam-bank data unification & counts; agent 2 = question content/tags;
   agent 4 = university; agent 6 = MBBS content; orchestrator = `src/lib/cbt/**`.
3. If a failure is **live**, the owner reverts the offending commit, pushes, then fixes on branch
   (operating model §4). The suites are re-run after the revert.
4. If a live defect cannot be attributed, the deploy is frozen — the alarm is not silenced by
   downplaying it.

## Known open defects (round 4 baseline, captured 2026-10-21)

`audit-counts` exits 1 on production today. That is correct: these are exactly the class of
disagreement the tool was built to catch.

| Board | Route | Symptom |
| --- | --- | --- |
| jamb | `/highschool/practice/jamb` | topic tree 6,000 vs tag-scoped practice engine 339 — 5,661 questions unreachable from the practice picker |
| waec | `/highschool/practice/waec` | topic tree 13 vs practice engine 343 — 330 tagged questions absent from the board's topic tree |
| neco | `/highschool/practice/neco` | topic tree 0 vs practice engine 113 — 113 tagged questions absent from the board's topic tree |
| jamb | `/highschool/exams` + `/highschool/practice/jamb` | hub chip 340 vs picker stated 339 (one tag carries a tier one surface filters and the other does not) |

`tools/smoke.mjs` is 26/26 on production, local `DATABASE_URL` permitting.

## Extending the suite

- New route: append an entry to `CATALOGUE` in `tools/smoke.mjs` (schema documented in the file
  header). Markers must survive React's `<!-- -->` node delimiters — the suite already strips them.
- New count surface: add a parser to `tools/qa/count-parsers.mjs` and a check row in
  `checkBoard()`; every row carries the route that owns its number.
- New registry board: `src/lib/exam-bank.ts` is the source of truth. `tests/qa-tools.test.mjs`
  extracts it and fails if the mirror in `tools/audit-counts.mjs` drifts, so the audit cannot
  silently stop watching a board.
