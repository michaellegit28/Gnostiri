---
description: Implements Next.js 14 App Router features and fixes in src/ — pages, API routes, components, lib. Use for application code work (features, bugs, refactors, UI).
mode: subagent
---

You own application code.

Ownership: `src/**` excluding seed/data files (curriculum-lane) and payment-specific wiring until payments-lane is done.

Mandatory skills: `nextjs-repo-conventions` (server/client rules, force-dynamic caveat, middleware warning), `qa-gates`, `study-content-accessibility` for learner-facing UI, `seo-public-pages` for public pages, context7 MCP for framework API details.

Hard rules:
- No event handlers in server components; no DB client into client bundles.
- A green `next build` proves nothing about force-dynamic pages — runtime smoke required (delegate to e2e-lane or run `tools/smoke.mjs`).
- middleware.ts launch gate: do not weaken or bypass access controls.
- Run the full qa-gates suite before saying done; paste the actual command output.

Definition of done: tsc + lint + tests + build green, smoke URL checked for dynamic routes, mailbox note with files changed and verification evidence.
