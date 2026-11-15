# Multi-Agent Workflow — Gnostiri (4 sessions)

Owner runs **four OpenCode sessions** on one machine: this Orchestrator + three
parallel lane agents. Boundaries are fixed by **file ownership + branch + git
worktree** so no two sessions ever edit the same file or fight over `main`.

## Golden rules (apply to every session)

1. **Never push to `main`.** Branch → PR → CI green → Orchestrator review →
   squash merge → Vercel deploys. (Only the Orchestrator merges.)
2. **Work in a git worktree**, never the main checkout:
   `git -C ~/Gnostiri worktree add ~/Gnostiri-wt-<agent> <branch>`
   Sessions that share a checkout corrupt each other's index — this is a
   documented failure mode in this project.
3. **Stay in your file territory.** Cross a boundary → STOP, write a mailbox
   entry, let the Orchestrator arbitrate. No "quick fixes" in another lane.
4. **Never touch `prisma/schema.prisma` or `package.json`** (shared blast
   radius) — propose the change to the Orchestrator instead.
5. **Gates before "done"** (paste real output): `npx prisma generate` →
   `npx tsc --noEmit` → `npx next lint` → `node --test tests/*.test.mjs` →
   `npm run build`. Force-dynamic routes additionally need a runtime smoke
   (`tools/smoke.mjs`) against a deployed URL.
6. **Secrets**: env names in `.env.example` only; values live in Vercel and
   the local gitignored `.env`. Never paste keys into PRs or commits.
7. **Mailbox**: append dated, lane-tagged entries to
   `/tmp/opencode/mailbox/agent-agents/AGENT-MESSAGES.md` (what, counts,
   blockers, next). The Orchestrator digests and updates STATE.md.

## Session 1 — Orchestrator (this session)

- **Branch pattern**: `agent-1/*`
- **Owns**: repo-root infra — `middleware.ts`, `package.json`,
  `prisma/schema.prisma` (+ migration SQL for the owner's SQL editor),
  `.github/`, `.opencode/`, `opencode.json`, `AGENTS.md`, `README.md`,
  `STATE.md`, `tools/smoke.mjs`, cross-cutting `src/lib/{server-auth,auth}.ts`
  and `src/lib/supabase/**` (auth seam), Vercel env vars, deploy verification.
- **Duties**: review every PR diff, run/verify CI, squash-merge to main,
  verify the production deploy (curl `gnostiri.vercel.app`), apply DB DDL
  through the owner, keep STATE.md current, arbitrate lane conflicts.
- **Never**: edits `content/**`, `prisma/seed-courses/**`, `src/app/**`
  page/component feature code, or `tests/**` (except smoke wiring).

## Session 2 — Content lane (question banks + curriculum authoring)

- **Branch pattern**: `agent-2/<wave>-rN` (e.g. `agent-2/mbbs-deepening-r4`)
- **Owns**: `content/**` (question banks, JSON, dual-version metadata),
  `prisma/seed-courses/mbbs/<subject>.ts` (one subject file per session —
  files are pre-split for collision-free parallel authoring), `tools/pq/**`.
- **Next queue (STATE.md)**: assessment-item deepening for allied subjects;
  lesson authoring for remaining placeholders; Version A (official ZA/TZ)
  transcription queue — pending the owner's ruling on tags.
- **Rules**: every generated row ships `reviewStatus: needs-human-review`;
  agents never mark anything "verified"; question keys are machine-verified
  only, a wrong key is dropped not shipped.
- **Delivers**: PR with seed-file diffs + `npm run test:assessment-seed`
  output + production row counts from the Orchestrator's DB run.

## Session 3 — App lane (features & UI)

- **Branch pattern**: `agent-3/<feature>-rN`
- **Owns**: `src/app/**` routes/pages, `src/components/**`,
  `src/styles`/Tailwind tokens, feature libs under `src/lib/**` EXCEPT
  `server-auth.ts` / `auth.ts` / `supabase/**` (Orchestrator-locked while
  the auth migration is live).
- **Next queue (STATE.md)**: Phase 5 seasons + certificates win cards;
  AI-era interface pass; payments wiring only after the owner supplies keys
  and lifts the blocker.
- **Rules**: server components by default (no event handlers in server
  components, no Prisma client in client bundles); the middleware launch
  gate is not weakened; honest empty states over fabricated data.

## Session 4 — QA lane (tests, tools, runtime verification)

- **Branch pattern**: `agent-4/<suite>-rN`
- **Owns**: `tests/**`, `tools/**` (audit, smoke, counts),
  `.github/workflows/**`, a11y + keyboard checks, runtime smoke of deployed
  URLs.
- **Rules**: never edits `src/**` or `content/**` — QA writes failing tests
  and hands them to the owning lane; the Orchestrator assigns the fix.
- **Delivers**: gate verdict per PR (copy the table into the PR), smoke
  evidence against the deployed URL for any force-dynamic route.

## Merge protocol (Orchestrator only)

1. `gh pr diff` review — scope, boundaries, secrets scan.
2. CI green (`tsc · lint · 279/279 tests · build`).
3. Squash-merge → Vercel auto-deploy → verify production routes (public
   domain; previews are SSO-protected and need the owner's browser).
4. Update STATE.md (session log + env table) on the same day.

## Escalation

Anything touching two lanes (schema, shared components, env vars) or any
production DB DDL → Orchestrator decides. Owner rulings pending: stale
out-of-tree JAMB tags, JAMB theory-question count divergence, board-clearance
foreign alignment rows (see STATE.md).