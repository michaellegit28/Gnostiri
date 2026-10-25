---
name: vercel-github-ops
description: Use for deployment, PR, branch, and CI operations on Gnostiri — Vercel deploys, GitHub PR review, env var management, preview vs production. Trigger keywords: deploy, Vercel, PR, pull request, branch, CI, merge, preview deployment, production deploy, env vars Vercel.
---

# Vercel + GitHub operations

- **Flow**: work on a branch (`agent-*/...` for lanes) → PR to `main` → CI must pass → merge → Vercel auto-deploys production (gnostiri.vercel.app, single project). Never push directly to main.
- **Vercel MCP** (`vercel` server): deployment status, runtime logs, function errors, env var reads.
  Set/change env vars via Vercel — never in the repo. After env changes, redeploy the affected scope
  (env changes don't apply to old deployments). Auth is OAuth-only (PATs rejected) — run
  `opencode mcp auth vercel` once when the server shows as unauthenticated.
- **Preview deployments**: every PR branch gets a preview URL — run the runtime smoke (`tools/smoke.mjs`) against it before merge; dynamic routes only surface problems at runtime.
- **GitHub MCP** (`github` server): PR diffs, review comments, CI check runs, issues. Read CI failure logs before touching code; re-run only after a real fix.
- **One-shot seeders**: deploy with the seeder route → trigger with `REVALIDATE_SECRET` → delete the route in a cleanup commit. Never leave a one-shot route on main.
- **Rollback**: Vercel instant rollback to the previous deployment is the first response to production breakage; fix forward after.
- Production DB deploys do NOT auto-migrate — see prisma-supabase-pooler for migration handling.
