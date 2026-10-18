# Gnostiri — STATE.md (2026-10-11)

Live URL: gnostiri.vercel.app · Repo: github.com/michaellegit28/Gnostiri · Branch: main

## Architecture

Next.js 14 (App Router) · TypeScript · Prisma + Supabase PostgreSQL ·
Firebase Auth (email/password) · Vercel deploy (single project) ·
Atria-Dawn-Preview for AI (OpenAI-compatible base URL) · Tailwind CSS

Three domains: highschool (exam bank + study), university (academic
structure + mastery/SM-2), extras (discovery). 1st-launch token gate
(BUILT, OFF, ready for Dec 1 activation).

## Key file paths

- `src/lib/access.ts` — preview/launch switches (LAUNCH_GATE, UNIVERSITY_OPEN)
- `src/lib/exam-manifest.ts` — blueprint engine (boards, sections, scoring)
- `src/lib/launch.ts` — token mint/redeem/access
- `src/lib/spaced-repetition.ts` — SM-2 scheduling
- `src/app/api/practice/` — manifest, session, draft, submit, ai-mark
- `src/app/api/admin/launch-tokens/generate/` — owner token mint (secret-guarded)
- `middleware.ts` — launch gate (edge HMAC) + IP rate limiting
- `prisma/schema.prisma` — all models
- `prisma/migrations/` — migration history (applied via Supabase SQL editor)

## Environment variable NAMES (never commit values)

| Name | Status | Notes |
|---|---|---|
| DATABASE_URL | set (sensitive) | Supabase PostgreSQL |
| FIREBASE_ADMIN_PROJECT_ID | set | |
| FIREBASE_ADMIN_CLIENT_EMAIL | set | |
| FIREBASE_ADMIN_PRIVATE_KEY | set (sensitive) | |
| NEXT_PUBLIC_FIREBASE_API_KEY | set | |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | set | |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | set | |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | set | |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | set | |
| NEXT_PUBLIC_FIREBASE_APP_ID | set | |
| OPENAI_API_KEY | set (sensitive) | Atria Dawn key |
| OPENAI_BASE_URL | set | https://api.atria-asi.ai/v1 |
| OPENAI_TUTOR_MODEL | set | Atria-Dawn-Preview |
| LAUNCH_SECRET | set (sensitive) | HMAC signing for launch cookies |
| REVALIDATE_SECRET | set (sensitive) | Guards temp/admin routes |
| UPSTASH_REDIS_REST_URL | EMPTY | Rate limiter fail-open — cost risk |
| UPSTASH_REDIS_REST_TOKEN | EMPTY | Same |
| STRIPE_SECRET_KEY | EMPTY | Payments not wired |
| STRIPE_WEBHOOK_SECRET | EMPTY | Same |
| PAYSTACK_SECRET_KEY | EMPTY | Same |
| RAZORPAY_KEY_ID | NOT SET | Same |
| RAZORPAY_KEY_SECRET | NOT SET | Same |
| RAZORPAY_WEBHOOK_SECRET | NOT SET | Same |
| ADMIN_EMAILS | EMPTY | Admin alignment panel unusable |
| NEXTAUTH_SECRET | EMPTY | Vestigial — no next-auth in codebase |
| NEXTAUTH_URL | EMPTY | Vestigial |
| SUPABASE_URL | set | Vestigial — code uses DATABASE_URL |
| SUPABASE_ANON_KEY | set | Vestigial |
| SUPABASE_JWT_SECRET | EMPTY | Vestigial |
| SUPABASE_SERVICE_ROLE_KEY | EMPTY | Vestigial |
| SUPABASE_PUBLISHABLE_KEY | set | Vestigial |
| NEXT_PUBLIC_SUPABASE_URL | set | Vestigial |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | set | Vestigial |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | set | Vestigial |
| POSTGRES_URL | EMPTY | Vestigial |
| POSTGRES_PRISMA_URL | EMPTY | Vestigial |
| POSTGRES_URL_NON_POOLING | EMPTY | Vestigial |
| POSTGRES_USER | set | Vestigial |
| POSTGRES_HOST | set | Vestigial |
| POSTGRES_PASSWORD | EMPTY | Vestigial |
| POSTGRES_DATABASE | set | Vestigial |

## Deploy steps

1. All work happens on branches, not main
2. PR to main → CI runs (tsc + lint + tests + build) — newly enabled
3. Merge PR → Vercel auto-deploys
4. For DB migrations: A1 creates a temp route or the user pastes SQL into
   Supabase's SQL editor (temp routes are preferred now)
5. One-shot seeders: deploy → trigger with REVALIDATE_SECRET → cleanup commit

## Agent ownership

| Agent | Lane | Branch |
|---|---|---|
| A1 (orchestrator) | open-exam, deployment, migrations, CI | agent-1/* |
| A2 (study expert) | curriculum content, past papers | agent-2/* |
| A3 (university) | university/**, mastery, assessment | agent-3/* |
| A4 (UI/UX) | patches only → queue → A1 applies | patches-ready-for-agent1/ |

Mailboxes: /tmp/Gnostiri/inbox/agent[1-4]/AGENT-MESSAGES.md

## Open blockers

1. **Rate limiting NOT ENFORCED** — Upstash env vars empty; all AI endpoints
   are unlimited (cost risk on Atria quota)
2. **Payments not wired** — all provider keys empty; no revenue possible
3. **Google sign-in DISABLED** — Firebase provider not enabled; domain auth
   fixed by A1 but user must enable the provider in Firebase console
4. **A4 patches 06 + 07 need rebase** — they target a pre-AI-marking
   PracticeRunner.tsx; A4 notified
5. **No real past-paper content** — exam bank has only demo papers + 50
   pilot maths questions; S-5 (WAEC transcription) is the November critical path
6. **Secrets exposed in chat** — GitHub PAT, Vercel token, Atria key,
   Firebase service-account key all need rotation at project completion
7. **Admin alignment panel dead** — ADMIN_EMAILS is empty
8. **No CI history yet** — workflow just created, needs one PR to validate

## Content that went live without independent review

All A2 content (22 topic rebuilds, 55 rapid-revision summaries, 50 pilot
questions) was committed by A2 and pushed by A1 after automated checks
(tsc, lint, test:alignment) but with no human reading the lesson text.
All A3 code was committed by A1 after automated checks but without line-by-line
review of A3's business logic. A4's patches 01-05 were applied by A1 after
`git apply --check` and tsc — no visual browser testing of any A4 component.
