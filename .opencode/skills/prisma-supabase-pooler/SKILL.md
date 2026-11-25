---
name: prisma-supabase-pooler
description: Use when editing prisma/schema.prisma, writing migrations, running seeds or DB scripts against the Supabase Postgres pooler, or driving the database via the Prisma CLI. Trigger keywords: prisma, migration, Supabase, DATABASE_URL, pooler, pgbouncer, seed, db push, SQL editor.
---

# Prisma + Supabase pooler operations

Production DB is Supabase Postgres behind the **transaction pooler (port 6543)**.

## Rules

1. **Scripted access must carry flags**: `DATABASE_URL` must end with `?pgbouncer=true&connection_limit=1`. Without them, pooled connections break prepared statements. The .env and shell exports already carry these flags — preserve them.
2. **Migrations are applied through Supabase**, not `prisma migrate` against production: generate migration SQL locally, apply via the Supabase SQL editor in matching order so `prisma/migrations/` history stays in sync with production. Record applied migrations in STATE.md.
3. **Per-row upserts over the pooler are unusable at scale** (a day-long hung dry-run proved it). Use single-statement / multi-row operations (one `INSERT ... ON CONFLICT` or one `UPDATE ... FROM` per batch), and document the single-statement approach for big data jobs.
4. **Schema change checklist**: edit schema → `npx prisma generate` (postinstall does it) → `npx tsc --noEmit` → migration SQL → apply via Supabase → sweep production data drift (seeds lie sometimes) → update STATE.md counts.
5. **Production patches**: prefer a temp route guarded by `REVALIDATE_SECRET` (deploy → trigger → cleanup commit) over ad-hoc local scripts when the fix needs app context.
6. **DB access goes through the Prisma CLI, not a Postgres MCP** (AGENTS.md rule 8 — there is no postgres MCP in this setup). Use `npx prisma migrate|db push|db execute|generate` and the `prisma/seed-*` scripts; the Supabase MCP `execute_sql` is sanctioned for read-only investigation only. Get `DATABASE_URL` from `./.env` (`set -a; . ./.env; set +a` in a `sh -c` wrapper) — on the Termux box it is not exported into the shell, so a bare `$DATABASE_URL` is empty. Keep queries read-only unless the user approved a mutation, and batch writes.
