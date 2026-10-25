---
description: Pre-merge checklist for a Gnostiri branch — verify branch state, QA gates, CI, runtime smoke, and PR readiness before merging to main.
---

Pre-merge check for the current branch (or $ARGUMENTS if given). Walk the checklist and report each item with evidence:

1. `git status` + `git log --oneline -5` — working tree clean, commits scoped, no direct-to-main.
2. Secrets scan of the diff: `git diff main...HEAD` must contain no tokens, keys, .env content, or NEXT_PUBLIC_ secrets.
3. QA gates: run the `qa` command suite (generate, tsc, lint, all node --test, build).
4. Migration check: if schema/migrations changed, confirm Supabase application plan and STATE.md migration log updated.
5. Content check: any generated content ships `reviewStatus: needs-human-review`; question keys verifier-passed; Python snippets executed.
6. Runtime: preview deployment smoke results for changed routes (delegate to e2e-lane if needed).
7. CI: via github MCP, confirm checks green on the PR (or "no PR yet — reasons").
8. PR body: what changed, counts, gate evidence, follow-ups.

Final verdict: READY TO MERGE or NOT READY with the blocking list.
