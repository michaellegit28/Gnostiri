# AGENTS.md — Gnostiri operating rules

Gnostiri is an AI-powered learning platform: highschool exam banks (JAMB/WAEC/boards), university
curriculum (MBBS spine, SM-2 mastery), AI tutor (Atria-Dawn), and payments wiring.
Stack: Next.js 14 App Router · TypeScript (strict) · Tailwind · Prisma + Supabase Postgres (pooler 6543) ·
Supabase Auth (Google OAuth + email/password, @supabase/ssr) · Vercel (gnostiri.vercel.app) · opencode
multi-agent workflow.

## Source of truth
- `STATE.md` — architecture, key paths, env var NAMES registry (names only), blockers, session log. Update after lane work.
- `README.md` — setup, stack, webhooks, PWA.
- This file + `.opencode/` — agent/skill/convention set for the orchestrator and lanes.

## Hard rules (violations block merge)
1. **Secrets never enter the repo — all secrets live in `.env`.** `.env` is gitignored and `chmod 600`; it is the single store for every secret (DATABASE_URL, GITHUB_TOKEN, Vercel/Supabase/Atria keys, webhook secrets) and is loaded at runtime only. `.env.example` carries NAMES only; STATE.md records values as "set (sensitive)" and never the value itself. opencode config references variables only (`{env:VAR}` or sourcing `./.env`) — never an inline value. Verify with `git status` before every commit. Rotation list: chat-shared PAT/Vercel/Supabase/Atria/Firebase creds (STATE.md blocker #5).
2. **Never push directly to main.** Branch (`agent-*/...` for lanes) → PR → CI green → merge → Vercel auto-deploy.
3. **Verifier-first questions.** Unverifiable keys are dropped. All generated rows `reviewStatus: needs-human-review`; agents never mark "verified".
4. **Server components by default** — no event handlers in server components; no DB client in client bundles; middleware launch gate is not to be weakened.
5. **Green build ≠ working site** — force-dynamic routes need runtime smoke (tools/smoke.mjs) against a deployed URL.
6. **Pooler rules**: scripted DB access carries `?pgbouncer=true&connection_limit=1`; no per-row upserts at scale; production migrations via Supabase SQL editor in file order.
7. **DB access goes through the Prisma CLI, not a Postgres MCP server.** Use `npx prisma ...` (`migrate`, `db push`, `db execute`, `generate`) and `prisma/seed-*` scripts for all schema, migration, seed and data work. Do **not** configure, rely on, or ask for a `postgres` MCP server — it is not a supported DB path in this setup. Read-only investigation may use the Supabase MCP (`execute_sql`); writes go through Prisma or the Supabase SQL editor per rule 6.
8. **Gate before "done"**: prisma generate → tsc → next lint → all node --test → build (+ smoke for dynamic routes). Paste real output.

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
`supabase` (read-only SQL/logs via `execute_sql` — the sanctioned read path; writes still go through
Prisma or the SQL editor, rule 7) · `playwright` (browser flows) ·
`sequential-thinking` (planning) · `memory` (cross-session knowledge) · `markitdown` (PDF/DOCX → markdown for
official-paper transcription — **disabled**: PyPI is unreachable from this box; enable after
`/root/mcp-venvs/markitdown/bin/pip install markitdown-mcp` succeeds).

There is deliberately **no Postgres MCP server** — DB access is the Prisma CLI plus the Supabase MCP for
reads (rule 7). Do not add one back.

Requirements: local MCP servers source their secrets from `./.env` at launch (see the `sh -c` wrappers in
`opencode.json`), so `.env` is the only place env vars need to live. Note that `~/.zshrc` / `~/.profile`
exports are **not** reliable — they are absent on the Termux/Android box this project is also run from,
which is why the shell itself often shows an empty `DATABASE_URL`. Any command needing the DB URL must
source `.env` explicitly (`set -a; . ./.env; set +a`). `VERCEL_TOKEN` is kept for CLI/API use, not MCP.
Playwright needs browsers: `npx playwright install chromium`.

## Skills (`.opencode/skills/`)
dual-version-question-banks · sm2-spaced-repetition · assessment-items · prisma-supabase-pooler ·
nextjs-repo-conventions · qa-gates · study-content-accessibility · seo-public-pages ·
secrets-and-env-hygiene · vercel-github-ops. Lanes must read the skills that match their work.
## Mailbox protocol

Lanes append findings to `/tmp/opencode/mailbox/agent-agents/AGENT-MESSAGES.md` (one file, dated
entries, lane-tagged). The orchestrator digests via scribe-lane. Keep entries short: what, counts,
blockers, next.

Cross-session visibility (all four sessions, any machine): **`AGENT_CHAT.md`** in the repo —
append-only, newest entry on top, lane-tagged. Start/blocker/review-request/done posts go there;
the /tmp mailbox stays for same-machine quick notes. Per-session boundaries and merge protocol:
`AGENTS-WORKFLOW.md`.
