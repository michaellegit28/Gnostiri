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