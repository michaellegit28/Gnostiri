# REPORT — Phase 7: Global Ranking engine

**Lane:** `lane/ranking` (worktree `/root/opencode-lanes/ranking`) · **PR:** [#28](https://github.com/michaellegit28/Gnostiri/pull/28) — **MERGED** into `main` (`be96489`) at 2026-11-01T01:13Z, CI green, branch deleted.
**Commit:** `8b2cb3c` — 16 files, **+3489 / −0 lines**. Schema diff is `+149 / −0` — append-only, no existing model touched.

---

## 1. Per-file summary (line counts)

| File | Lines | What it is |
|---|---|---|
| `prisma/schema.prisma` | 1158 (+149) | 8 **new** models: `Season`, `StarLedger`, `RankState`, `LeagueGroup`, `LeagueGroupMember`, `PodMatch`, `PodMember`, `HallOfFameEntry`. No existing model modified. |
| `prisma/migrations/20261031120000_global_ranking_engine/migration.sql` | 137 | DDL for the 8 tables, all indexes, 6 in-graph FKs, `ENABLE ROW LEVEL SECURITY` on each. Applied to production via the **direct 5432 connection** in one transaction. |
| `src/lib/ranking.ts` | 456 | The pure engine. No imports, no I/O — every function deterministic given its arguments, so `tests/ranking.test.mjs` runs it with no DB. |
| `src/lib/ranking-pool.ts` | 406 | The category-agnostic pool (`championshipPool`), the server-only answer key (`resolveChampionshipKey`), plus the season/group store accessors both routes need (`activeSeason`, `findOrCreateGroup`, `groupLeaderboard`). |
| `src/app/api/ranking/queue/route.ts` | 84 | `POST /api/ranking/queue` — get-or-create `RankState`, tier from stars, find-or-create a group with room, ready flag set. |
| `src/app/api/ranking/pods/open/route.ts` | 177 | `POST /api/ranking/pods/open` — window now→+20 min, ≤4 seats in join order, seeds = `hash(matchId+userId)`, readiness consumed. Idempotent. |
| `src/app/api/ranking/pods/[matchId]/session/route.ts` | 62 | `GET .../session` — the member's derived paper; rejects non-members (404, same as a missing pod) and a closed window. |
| `src/app/api/ranking/pods/[matchId]/submit/route.ts` | 184 | `POST .../submit` — re-derives the paper, scores `+1/0`, one settlement pass over every seat, idempotent awards, tier-up notification. |
| `src/app/api/ranking/state/route.ts` | 138 | `GET /api/ranking/state` — stars, tier progress, group + position, group leaderboard with pod scores, open pods with live windows. |
| `src/app/api/ranking/season/close/route.ts` | 259 | `POST /api/ranking/season/close` — REVALIDATE_SECRET-guarded; Hall of Fame top 3/tier, badge + 30 Prime days per winner, `promotionPlan`, next season + groups. |
| `src/app/league/ladder/page.tsx` | 327 | The ladder surface: tier, progress bar, six-rung ladder, roster + pod scores, open pods with `Countdown`, join CTA. Anonymous → ladder + sign-in. |
| `src/app/league/ladder/play/page.tsx` | 68 | Server context for the pod play surface. |
| `src/components/ranking/PodPlayClient.tsx` | 482 | Async-simultaneous pod play: join→session→one question at a time→radio cards→submit-all-at-end, server-anchored clock, standings polled every 15s. |
| `src/components/ranking/JoinQueueButton.tsx` | 52 | The "Join the queue" CTA as a client action. |
| `src/app/league/hall-of-fame/page.tsx` | 121 | Past seasons' winners per tier, `rosterJson` display names only; the specified empty state. |
| `tests/ranking.test.mjs` | 387 | 21 pure-engine tests, no DB. |

---

## 2. Locked decisions — implemented exactly

- **Stars, six tiers** — 0 / 50 / 150 / 400 / 900 / 2000, tested at every exact boundary and one either side.
- **Async-simultaneous pods** — 2–4 members, one shared 20-minute window, same paper, own pace, scoreboard fills on submit, no websockets.
- **Groups of 20 per tier, season-scoped** — `GROUP_CAPACITY = 20`; auto-assignment by tier on the queue call; a tier opening its next group is `groupName(tier, index)` ("Vanguard III").
- **Category-agnostic pool** — highschool JAMB bank as the deepest source; tiers 4–6 mix university assessment-equivalent items via `AssessmentItem` → `ConceptNode`/`Course`. Measured in production: tier 4 = 24 assessment items, tier 5 = 30, tier 6 = 36 of 60. Question **and** option order randomised per user from `hash(matchId+userId)`.
- **Rewards at season close** — `LeagueBadge` + `+30` Prime days (active premium sub extended by 30 days, else created `premium`/`active`/`monthly`, `expiresAt = now+30d`) + Hall of Fame entry.
- **New tables only** — verified: the merge diff is `+3489 / −0`.

---

## 3. Verification

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **exit 0** |
| `npx next lint` | **✔ No ESLint warnings or errors** |
| `node --test tests/ranking.test.mjs` | **21 / 21 pass, 0 fail** |
| `node --test tests/*.test.mjs` | **303 pass, 0 fail, 0 skipped** (repo-wide) |
| `npx next build` (CI env, placeholder DB) | **success** — `/league/ladder`, `/league/ladder/play`, `/league/hall-of-fame` and all six `/api/ranking/*` routes emitted |
| CI (`gh pr checks`) | `check` **pass 2m24s** · `Vercel` **pass** · `Vercel Preview Comments` **pass** · `Supabase Preview` skipping |

The suite covers everything asked: tier boundaries at exact thresholds, `groupName` formatting, `promotionPlan` determinism (including tie-breaks and the closed ends), the paper never including answers, determinism for the same seed, differing per user seed, `nextBalance` — plus pod placements, the 20-minute window, the idempotency key, handles and the season calendar.

---

## 4. Database smoke (production, direct 5432 connection)

Run with two real users (`qa2-verify-20261011@gnostiri.test` and `michaelfortune026@gmail.com`) through queue → open → session → submit → settle, plus a solo pod, mirroring the routes' Prisma calls.

```
── STEP 1 · POST /api/ranking/queue ──
  PASS  rank state for cmv3lsbf — existing stars kept: 0
  PASS  rank state for cmv3qe6q — created with 0 stars
  PASS  group found or created for the tier — Initiate I (tier 1, capacity 20)
  PASS  tier is derived from stars, not the client — stars=0 → tier 1 (Initiate)
  PASS  membership created — 2 member(s) in Initiate I
── STEP 2 · POST /api/ranking/pods/open ──
  ·  window: 2026-11-01T00:32:42.569Z → 2026-11-01T00:52:42.569Z
  PASS  window is exactly 20 minutes — 1200s
  ·  ready members in the group: 2
  PASS  each seat's seed is hash(matchId + userId) — seats=2, distinct seeds=2
── STEP 3 · GET /api/ranking/pods/[matchId]/session ──
  PASS  championship pool for the tier — 60 entries, tier 1
  PASS  paper for cmv3lsbf is answer-free — 3390 bytes, 0 answer fields
  PASS  paper for cmv3lsbf is full — 15 questions
  PASS  paper for cmv3lsbf has playable options
  PASS  paper for cmv3lsbf is reproducible from its seed
  PASS  paper for cmv3qe6q is answer-free — 3268 bytes, 0 answer fields
  PASS  paper for cmv3qe6q is full — 15 questions
  PASS  paper for cmv3qe6q has playable options
  PASS  paper for cmv3qe6q is reproducible from its seed
  PASS  two members of one pod hold different question orders
  PASS  two members of one pod hold shuffled options
  ·  caller Q1: A plant cell fully inflated with water i…
  ·  partner Q1: A farm budget compares…
── STEP 4 · POST /api/ranking/pods/[matchId]/submit ──
  ·  answer key resolved: 27 question id(s), 27 with an answer
  ·  score for cmv3lsbf: perfect paper → 15/15
  ·  score for cmv3qe6q: blank paper → 0/15
  ·  first settlement wrote: cmv3lsbf +3, cmv3qe6q +2
  PASS  first settlement pays every seat — 2 row(s)
  ·  ledger row for cmv3lsbf: placement 1 → 3 star(s), reason "smoke-mvx3itfe:cmv3lsbfy0000tondrwtnhnnt"
  PASS  idempotency key is matchId:userId
  PASS  row's balanceAfter matches the new stars
  ·  ledger row for cmv3qe6q: placement 2 → 2 star(s), reason "smoke-mvx3itfe:cmv3qe6qn0000tr49g71a9gze"
  PASS  idempotency key is matchId:userId
  PASS  row's balanceAfter matches the new stars
  PASS  award follows the locked ladder (3 / 2 / 1 / 1) — cmv3lsbf=#1→+3, cmv3qe6q=#2→+2
  PASS  stars moved for the submitter — caller 0 → 3
  PASS  re-settling the same scores writes nothing — 2 row(s) before, 2 after
  ·  reconciliation wrote: cmv3qe6q +1, cmv3lsbf -1
  PASS  a flipped placement writes only the difference — 2 → 4 row(s) (deltas, not duplicates)
  ·  pod total for cmv3lsbf: 2 star(s), score 15
  PASS  paid total equals the placement's award for cmv3lsbf
  ·  pod total for cmv3qe6q: 3 star(s), score 15
  PASS  paid total equals the placement's award for cmv3qe6q
  PASS  no ledger row was duplicated by the re-run — one row per genuine change
── STEP 5 · a pod with a single seat ──
  PASS  a one-seat pod ranks
  ·  solo pod settlement wrote: +3
  PASS  a solo pod pays first place to its only member — +3 star(s)
  PASS  re-running the solo settlement is a no-op — 1 row
── cleanup ──
  ·  leftover smoke seasons / groups / ledger rows: 0 / 0 / 0
  ·  rankState for cmv3lsbf restored: stars=0 tier=1
  PASS  member cmv3lsbf matches the snapshot
  ·  rankState for cmv3qe6q restored: stars=0 tier=1
  PASS  member cmv3qe6q matches the snapshot
```

**Production left clean** (verified after the merge):

```
PRODUCTION NEW-TABLE ROW COUNTS: {Season:0, StarLedger:0, RankState:0, LeagueGroup:0,
  LeagueGroupMember:0, PodMatch:0, PodMember:0, HallOfFameEntry:0}
RLS ENABLED TABLES: 8 / 8
```

Every smoke row was removed by the script itself; two `RankState` rows left by an earlier smoke run (whose `podReadyAt` pre-dated the successful run) were deleted by hand and re-verified. Both members' rank states were restored from a snapshot taken before they were touched.

---

## 5. No-leak + determinism proof

**No-leak.** The paper payload is built field-by-field from a pool type that has no answer field, and both seats' papers were scanned as JSON for `correctAnswer`/`explanation`:

- `PASS paper for cmv3lsbf is answer-free — 3390 bytes, 0 answer fields`
- `PASS paper for cmv3qe6q is answer-free — 3268 bytes, 0 answer fields`
- `tests/ranking.test.mjs` goes further: it **poisons** a pool entry with `correctAnswer` and `explanation`, then asserts the served question objects contain exactly `["difficulty", "id", "options", "questionText"]` — so a leak is impossible even if a future bug puts an answer into a pool row.
- The answer key lives behind `resolveChampionshipKey`, which only `/submit` calls, and only after the window has started — the same invariant as `question-set.ts`.

**Determinism.** `PASS paper for … is reproducible from its seed` — the same `(tier, seed, pool)` re-derived on a second call is byte-identical, which is what makes the session and the grade agree. `PASS two members of one pod hold different question orders` / `PASS … shuffled options` — `podMemberSeed(matchId, userId)` gives each seat its own draw, so two members in the same window sit the same questions in a different order with shuffled options. `matchSeed` folds to signed int32; the unit suite asserts a seed always fits a Postgres INT4.

---

## 6. Defects the smoke caught (both fixed before commit)

1. **Seed width (real, production-blocking).** `podMemberSeed` returned an unsigned 32-bit FNV-1a tail (e.g. `2573885440`); Postgres rejected it writing `PodMember.seed` (`INT4`). Seeds are now `hash | 0`, with a unit test asserting the signed range. This would have broken every pod write in production.
2. **`podAwardKey` prefix.** The ledger reason was `pod:${matchId}:${userId}` rather than the locked `${matchId}:${userId}`; the smoke's key assertion caught it and the key now matches the owner's specification exactly.

---

## 7. What v1.1 needs (honest list)

- **Persistent pod scheduling.** Pods open only when a member calls `/pods/open` and ≥2 are ready; there is no worker, no cron, no background matcher, and readiness is consumed by a single draw. A member who readies up and never returns waits forever.
- **Websockets / real-time.** The scoreboard is a 15-second poll of `/api/ranking/state`. Submits appear within one poll, not instantly; there is no push, no live toast, no spectator mode while a pod runs.
- **Offline/queue sync.** Out of scope for this lane by owner decision, so the play client has no local queue: a dropped connection mid-window loses the answers in memory, and the clock is server-anchored so a member cannot finish later.
- **Season lifecycle automation.** `POST /api/ranking/season/close` is a secret-guarded manual call. Nothing schedules it at season end, so a season that passes `endsAt` stays "active" until someone runs it.
- **Anti-abuse depth.** Scoring is server-trusted and answer choices are validated against the served options, but there is no rate limit on submits, no per-member pod cooldown (bounded only by readiness being consumed), and no attempt telemetry to review suspicious papers after the fact.
- **Tier-1/2 paper depth.** The pool is capped per tier by `POOL_TARGET = 60` and `SPREAD_ROWS = 400`; a tier's bank is deep enough today, but the per-process 10-minute cache means a bank import takes up to 10 minutes to reach a warm process, and pods across a whole tier can repeat questions until the cache rolls.
- **`RankState` hygiene.** A member's `groupId` is only rewritten when they queue, so a promoted or relegated member keeps pointing at a closed season's group until their next queue call; `/state` is scoped to the running season, so it is masked rather than wrong.
