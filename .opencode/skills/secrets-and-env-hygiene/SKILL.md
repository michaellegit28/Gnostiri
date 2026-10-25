---
name: secrets-and-env-hygiene
description: Use when adding environment variables, handling tokens/webhook secrets, or touching .env/.env.example/opencode.json for Gnostiri. Trigger keywords: secrets, env vars, .env, token, API key, webhook secret, rotation, NEXT_PUBLIC, ENV, credentials.
---

# Secrets & env hygiene

1. **Never commit secrets.** `.env` is gitignored; `.env.example` holds NAMES only. Verify with `git status` before every commit — a leaked key costs a rotation.
2. **The registry of env var NAMES lives in STATE.md** ("Environment variable NAMES (never commit values)"). When you add/remove a variable, update that table. Note which values are set in production vs. EMPTY (blockers) — Upstash, payment keys, ADMIN_EMAILS are currently empty.
3. **NEXT_PUBLIC_ = public by definition.** Only prefix variables that are safe in the browser bundle. Firebase client keys are fine; service-account/admin keys never are.
4. **opencode.json config carries no secrets** — MCP servers reference `{env:VAR}` only. Same rule for anything shared to GitHub.
5. **Webhook secrets are server-only** and read at request time (Stripe/Paystack/Razorpay endpoints already expect this). Never log request bodies of webhook handlers.
6. **Rotation policy**: the GitHub PAT, Vercel token, Supabase DB password, Atria key, and Firebase service-account key were shared in chat and MUST be rotated at project completion (STATE.md blocker #5). If a new secret is shared in chat, add it to the rotation list the same day.
7. Local-only secrets for opencode MCP live in `.env` (chmod 600) and are exported in `~/.zshrc` / `~/.profile` so local MCP servers inherit them.
