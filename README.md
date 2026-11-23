# Gnostiri

AI-powered learning platform. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and Supabase Auth.

## Setup

1. Copy `.env.example` to `.env` and fill in real secrets (never commit `.env`).
2. Install dependencies: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. For a fresh local database, apply schema changes with `npx prisma migrate deploy`. The connected Supabase production database is managed with Supabase migrations; apply production SQL from the matching files in `prisma/migrations/` through Supabase so its migration history stays in sync.
5. Seed the curriculum and catalogs: `npx prisma db seed`
6. Run dev server: `npm run dev`

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM
- Supabase Auth (Google OAuth + email/password) with `@supabase/ssr` cookie sessions, validated server-side through `src/lib/server-auth.ts`; the OAuth callback is `/auth/callback`
- Supabase PostgreSQL through Prisma; the server is the only database access layer
- Upstash Redis rate limits, OpenAI Tutor, Stripe, Paystack, and Razorpay (configure keys in `.env`)

## Payment webhooks

Configure provider webhooks at `/api/payments/webhook/stripe`, `/api/payments/webhook/paystack`, and `/api/payments/webhook/razorpay`. Premium access is activated only from verified payment events. Add the matching provider credentials and webhook secrets to the server environment before enabling checkout. Paystack signatures use its secret key; Stripe and Razorpay use their configured webhook secrets.

## PWA

The app manifest and service worker make Gnostiri installable and cache viewed `/study` pages for offline reading. Quiz submissions, sign-in, and checkout require a connection.

## Disaster recovery runbook

If the box, the repo checkout, or the database is lost, bring everything back in this order:

1. **Code** — all on GitHub: `git clone https://github.com/michaellegit28/Gnostiri && cd Gnostiri`. Lane worktrees are disposable: `git worktree add /root/Gnostiri-wt-agent-N -b agent-N/<branch>`. Agent config (AGENTS.md, AGENTS-WORKFLOW.md, STATE.md, .opencode/, opencode.json) is all in the repo — agents self-bootstrap from it.
2. **Dependencies** — `npm ci` · `npx prisma generate` · `npx playwright install chromium` (e2e lane) · markitdown venv if needed: `python3 -m venv /root/mcp-venvs/markitdown && /root/mcp-venvs/markitdown/bin/pip install markitdown-mcp`.
3. **Secrets** — copy `.env.example` to `.env` (chmod 600, gitignored) and fill from the Vercel dashboard / Supabase dashboard. Never paste secrets into chat or commits. Rotation list: STATE.md blocker #5.
4. **Database** — Supabase keeps daily backups; enable **PITR** (Dashboard → Database → Point in time recovery) for sub-day restore. For a fresh project: run `prisma/migrations/*/migration.sql` in file order in the SQL editor (or `npx prisma migrate deploy` with DATABASE_URL in .env), then the `_prisma_migrations` backfill block, then re-run seeders (`prisma/seed*.ts`) for content. All exam-bank/curriculum content also lives in `content/**` + `prisma/seed-courses/**` in the repo.
5. **Verify** — gates: `npx prisma generate && npx tsc --noEmit && npx next lint && node --test tests/*.test.mjs && npm run build`, then `SMOKE_URL=<deployed-url> SMOKE_GATE=1 node tools/smoke.mjs`.
6. **Deploy** — Vercel auto-deploys on merge to main; preview deploys per PR. Env vars live in the Vercel project (never in the repo).

## opencode updates

Config (`opencode.json`) is schema-tagged pure JSON and committed, so updates don't break it. Update **between work windows**, not mid-session — running agent sessions keep the old binary until restarted. After updating, restart opencode from `/root/Gnostiri` and re-run `opencode mcp auth vercel` if the Vercel MCP complains.

## MCP / tools reference

Configured in `opencode.json`: github (PAT via {env:GITHUB_TOKEN}), vercel (OAuth — `opencode mcp auth vercel`; PATs rejected), context7 (docs), postgres (read-only SQL via $DATABASE_URL), playwright, sequential-thinking, memory, markitdown (PDF/DOCX→md, now enabled), **supabase (added, disabled — enable with SUPABASE_ACCESS_TOKEN, --read-only)**. CLI tools worth having global: `gh`, `vercel` (`npm i -g vercel`), `supabase` (`npm i -g supabase` — for dashboard-side ops; migrations go through Prisma/SQL editor because the pooler blocks direct schema push).
