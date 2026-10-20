# Gnostiri — STATE.md (2026-10-20)

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

| Agent | Lane | Branch (round 2) |
|---|---|---|
| A1 (orchestrator) | merges, seeds wiring, DB patches, CI | agent-1/* |
| A2 (questions) | content/questions/**, tools/pq/** — 12 flat JAMB banks × 500 (6,000 dual-version MCQs) | agent-2/jamb-banks-r2 |
| A3 (discovery) | src/app/discovery/**, prisma/seed-courses/discovery-* — physics-first research trails (7 trails × 4 depths), typed theory prompts, NO quizzes | agent-3/discovery-physics-r2 |
| A4 (university) | university/** — 9-subject MBBS spine + UX rebuild | agent-4/university-rebuild-r2 |

Mailboxes: /tmp/opencode/mailbox/agent[1-4]/AGENT-MESSAGES.md

## Hybrid past-question model (owner directive, round 2)

Every past question exists in TWO versions bound by one coreId:
- **Version A — Official**: real unedited NSC (Matric, ZA) / NECTA (TZ) text, rendered only in
  ZA/TZ tracks, tagged "Official past question" with DBE/NECTA attribution.
- **Version B — Cloned variant**: fully rewritten original wording + fresh numbers + local skin
  (₦/$/…), rendered in ALL other tracks (JAMB, WAEC, US, UK). Same concept/structure/difficulty.
Spec: content/questions/DUAL-VERSION-WORKFLOW.md · tooling: tools/pq/* (families carry independent
verifiers — a wrong key is dropped, never shipped) · audit: tools/pq/audit-banks.mjs.

## Discovery = physics-first research (owner directive)

No quizzes in discovery. Logical/conceptual prompts with a keyboard typing space (`theory` block
+ src/components/discovery/TheoryPrompt.tsx). 7 physics trails (mechanics, thermodynamics,
waves, optics, E&M, quantum, cosmology) × 4 research depths. Seeded to production.

## University = MBBS first, US standard (owner directive)

Rebuilt simple/user-friendly, mature & premium. Nine MBBS subjects (ANAT, PHYS, BCHM, PATH, PHRM,
MED, SURG, OBGY, PEDS) + Introduction to Programming and Applied Statistics as core courses.
All seeded to production; all rows needs-human-review, nothing "verified". Seeded 2026-10-20:
13 courses · 57 modules · 303 concept nodes · 307 course lessons · 109 assessment items.

## Open blockers

1. **Rate limiting NOT ENFORCED** — Upstash env vars empty; all AI endpoints
   are unlimited (cost risk on Atria quota)
2. **Payments not wired** — all provider keys empty; no revenue possible
3. **Google sign-in DISABLED** — Firebase provider not enabled; domain auth
   fixed by A1 but user must enable the provider in Firebase console
4. **Version A gap in the JAMB banks** — 0 of 6,000 JAMB coreIds yet have an
   official ZA/TZ Version A counterpart (G13); official NSC/NECTA transcription
   queue owned by A2 next round
5. **Secrets exposed in chat** — GitHub PAT, Vercel token, Atria key,
   Firebase service-account key, Supabase DB password all need rotation at
   project completion
6. **Admin alignment panel dead** — ADMIN_EMAILS is empty
7. **No CI history yet** — workflow just created, needs one PR to validate

## Content that went live without independent review

Round-2 content (6,000 JAMB MCQs, MBBS spine, discovery trails, programming
course) was committed by the agents and pushed by A1 after automated checks
(tsc, lint, full test suite, generator verifiers, python3 output checks) but
with no human reading the text. All rows carry reviewStatus
"needs-human-review" — nothing is marked "verified". Human review queue:
MBBS module-1 lessons, 224 needsCheck placeholders, literature-in-english
syllabus alignment, and every generated MCQ key.

## Session log (2026-10-20, A1)

- Round 2 complete and pushed to main: 12 flat JAMB banks (6,000 MCQs, machine-verified keys, all needs-human-review), 9-subject MBBS spine + university UX rebuild, physics-first discovery (7 trails × 4 depths, typed theory prompts, no quizzes).
- Production DB: master-statistics-probability-q2 IQR ambiguity patched (stem states exclusive convention, key unchanged). All seeds re-run — counts in STATE.md above.
- Discovery legacy quiz cleanup: 12 leftover `extras`/`disco-*` quiz Question rows deleted per owner directive ("no quiz in discovery"). Fresh extras quiz rows: 0.
- Known gap for next round: Version A (official ZA/TZ) counterparts — 0 of 6,000 JAMB coreIds have an official transcription yet; NSC/NECTA transcription queue is A2's next lane.
- Production DB is on the Supabase transaction pooler (port 6543) — all scripted DB access must use `?pgbouncer=true&connection_limit=1` on DATABASE_URL.

## Integration session (2026-10-20, A1 — banks to production)

- tools/pq/integrate-banks.mjs (new, idempotent): seeds the 12 flat JAMB banks
  into questions, mapping topicSlug -> Topic.slug (creating the 4 missing
  topics: atomic-structure, periodicity, acids-bases-salts,
  literature-in-english). **Ran against production: 6,000 inserted, 0 skipped.
  Total highschool questions now 6,653 (653 pre-existing + 6,000 JAMB).**
- Discovery promoted physics-first: discovery-curiosity orderIndex 0 (the face
  of discovery); 7 legacy quiz-based disco-* topics + their 8 lessons removed
  (their quiz rows were already deleted). extras topics remaining: 13.
- Dual-version metadata (coreId/variant/provenance/track) remains JSON-side:
  Question has no columns for it. Version B (all global tracks, incl. JAMB) is
  what ships; Version A needs the schema migration + NSC/NECTA transcription
  queue (A2, next round).
