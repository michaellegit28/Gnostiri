# AGENTS.md — Gnostiri operating rules

Gnostiri is an AI-powered learning platform: highschool exam banks (JAMB/WAEC/boards), university
curriculum (MBBS spine, SM-2 mastery), AI tutor (Atria-Dawn), and payments wiring.
Stack: Next.js 14 App Router · TypeScript (strict) · Tailwind · Prisma + Supabase Postgres (pooler 6543) ·
Firebase Auth · Vercel (gnostiri.vercel.app) · opencode multi-agent workflow.

## Source of truth
- `STATE.md` — architecture, key paths, env var NAMES registry (names only), blockers, session log. Update after lane work.
- `README.md` — setup, stack, webhooks, PWA.
- This file + `.opencode/` — agent/skill/convention set for the orchestrator and lanes.

## Hard rules (violations block merge)
1. **Secrets never enter the repo.** `.env` only, names in `.env.example`, values in STATE.md as "set (sensitive)". opencode config uses `{env:VAR}` only. Rotation list: chat-shared PAT/Vercel/Supabase/Atria/Firebase creds (STATE.md blocker #5).
2. **Never push directly to main.** Branch (`agent-*/...` for lanes) → PR → CI green → merge → Vercel auto-deploy.
3. **Verifier-first questions.** Unverifiable keys are dropped. All generated rows `reviewStatus: needs-human-review`; agents never mark "verified".
4. **Server components by default** — no event handlers in server components; no DB client in client bundles; middleware launch gate is not to be weakened.
5. **Green build ≠ working site** — force-dynamic routes need runtime smoke (tools/smoke.mjs) against a deployed URL.
6. **Pooler rules**: scripted DB access carries `?pgbouncer=true&connection_limit=1`; no per-row upserts at scale; production migrations via Supabase SQL editor in file order.
7. **Gate before "done"**: prisma generate → tsc → next lint → all node --test → build (+ smoke for dynamic routes). Paste real output.

## Agent roster (subagents, `.opencode/agent/`)
| Agent | Lane |
|---|---|
| questions-lane | question banks, dual-version, verifiers, audit-banks |
| curriculum-lane | MBBS/discovery content, seeds, assessment items |
| db-lane | schema, migrations, Supabase patches, seeds |
| app-lane | src/ features, fixes, UI |
| tutor-lane | AI tutor endpoints, rate limiting, cost guards |
| payments-lane | Stripe/Paystack/Razorpay webhooks + entitlement |
| e2e-lane | Playwright flows, runtime smoke, keyboard/a11y checks |
| audit-lane | read-only QA: keys, coverage, drift, hygiene |
| reviewer-lane | read-only PR review + CI gate verdicts |
| scribe-lane | STATE.md/README/reports, mailbox digest, commit hygiene |

## MCP servers (opencode.json)
`github` (PRs, CI, issues) · `vercel` (deploys, logs, env vars — **OAuth only**, run
`opencode mcp auth vercel` once; PATs are rejected) · `context7` (Next/Prisma/React docs) ·
`postgres` (read-only by default, reads `$DATABASE_URL`) · `playwright` (browser flows) ·
`sequential-thinking` (planning) · `memory` (cross-session knowledge) · `markitdown` (PDF/DOCX → markdown for
official-paper transcription — **disabled**: PyPI is unreachable from this box; enable after
`/root/mcp-venvs/markitdown/bin/pip install markitdown-mcp` succeeds).

Requirements: `GITHUB_TOKEN`, `DATABASE_URL` exported in the shell that launches opencode (already in
`~/.zshrc` / `~/.profile` and `/root/Gnostiri/.env`; `VERCEL_TOKEN` is kept for CLI/API use, not MCP).
Playwright needs browsers: `npx playwright install chromium`.

## Skills (`.opencode/skills/`)
dual-version-question-banks · sm2-spaced-repetition · assessment-items · prisma-supabase-pooler ·
nextjs-repo-conventions · qa-gates · study-content-accessibility · seo-public-pages ·
secrets-and-env-hygiene · vercel-github-ops. Lanes must read the skills that match their work.

## Mailbox protocol
Lanes append findings to `/tmp/opencode/mailbox/agent-agents/AGENT-MESSAGES.md` (one file, dated
entries, lane-tagged). The orchestrator digests via scribe-lane. Keep entries short: what, counts,
blockers, next.
