## [2026-11-16 04:10] lead/orchestrator — BLOCKED — production DB credentials stale; auth code healthy
- Migrated auth (PR #42) + probe v2/v3 (#43, #44) merged to main and deployed (2e47d94+). Live verification on gnostiri.vercel.app: /login 200 with Google button, /auth/callback?code=bogus 307 to /login?error=auth_failed, Supabase key accepted, Google provider + callback URLs correct (authorize 302s to accounts.google.com).
- **BLOCKER (owner action)**: /api/health/auth reports db-unreachable — "Authentication failed against database server at aws-1-eu-west-1.pooler.supabase.com". The DB password in Vercel DATABASE_URL (updated to the chat-provided string) is stale — likely reset again in Supabase Dashboard during today's setup. Every Prisma route is down (/api/boards 500, /university empty). Fix: Supabase Dashboard -> Project Settings -> Database -> set a new password, update DATABASE_URL in Vercel for production+preview; the probe will confirm in minutes.
- Probe v3 disambiguates: db-reachable+supabaseUid (healthy) vs schema-error:P2022 (migration SQL not applied) vs db-unreachable (this state). The 20261115120000_supabase_auth migration may still be pending — probe will say once the DB connects.
- next: after DB password lands, redeploy, curl /api/health/auth for healthy:true, then remove the 9 dead FIREBASE_* env vars from Vercel.

---
# AGENT_CHAT — shared status log (all four sessions)

Append-only. **Newest entry at the top** (easy to read on a phone). One entry
per event: start, blocker, review-request, done, merged, note.

**Boundaries + merge protocol live in `AGENTS-WORKFLOW.md`** — this file is
only for status and coordination. Never paste secrets here (env NAMES only).

## Format

```
## [YYYY-MM-DD HH:MM] lane/agent — STATUS — one-line summary
- what changed / counts (PR #, files, rows)
- blocker: <exact error or dashboard step> (or "none")
- next: <one line>
```

STATUS: STARTED · BLOCKED · REVIEW-REQUESTED · DONE · MERGED · NOTE

---

## [2026-11-16 00:45] lead/orchestrator — DONE — Supabase auth migration staged on PR #42
- Firebase fully removed (deps, src/lib/firebase/, /api/auth/session); @supabase/ssr stack + /auth/callback + server-auth seam swap; User.supabaseUid migration 20261115120000_supabase_auth (zero-downtime, firebaseUid kept nullable).
- Added /api/health/auth probe (env + Supabase reachability + supabaseUid column, no values leaked) — the post-deploy auth check for every lane.
- Gates: tsc clean · lint clean · 279/279 · build OK · local smoke OK. CI green on PR #42. Supabase-side pre-merge checks: Google provider live (authorize → accounts.google.com with the new client), fresh key accepted by /auth/v1/*.
- blocker: none — waiting on merge (owner confirmed dashboard steps).
- next: merge PR #42 → verify gnostiri.vercel.app /api/health/auth + /login → remove dead FIREBASE_* env vars.