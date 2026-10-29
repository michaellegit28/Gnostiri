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

## Integration fix session (2026-10-20, A1 — cont.)

Root causes found and fixed:

1. **JAMB questions invisible (the "same issue")** — the highschool pages resolve
   topics by constructed id (`jamb-{subject}` / `jamb-{subject}-{topic}`); the
   round-2 integration had mapped bank slugs onto master-syllabus topics, so all
   6,000 sat OUTSIDE the jamb hierarchy (0 questions reachable on JAMB pages).
   Fixed: repoint-raw/IN-list migration placed all 6,000 into the hierarchy
   (existing jamb children matched by concept, new children created for
   unmatched families, monolithic subjects got jamb-{subject}-full-syllabus);
   4 orphan topics removed. tools/pq/integrate-banks.mjs rewritten (v2) to
   encode the hierarchy so future bank runs seed correctly.
2. **University course pages broken (the "same issue")** —
   src/app/university/[course]/page.tsx rendered <Link onClick> in a server
   component ("Event handlers cannot be passed to Client Component props"),
   which aborted the course page render after the header (digest error, no
   module/lesson nav anywhere). Fixed by removing the handler; FilterChips.tsx
   marked "use client" to match its actual semantics. Verified locally:
   0 digest errors, modules render, lesson/concepts pages 200.
3. Lesson: next build does NOT exercise force-dynamic pages — runtime smoke
   tests against the deployed URL are now part of the A1 integration checklist.

## Exam bank rebuild (2026-10-20, A1)

- Owner's global board registry implemented in src/lib/exam-bank.ts — the single
  source of truth: three format classes (CBT · Objective+Theory · Written Theory+Short Answer).
- Seed (prisma/seed-exam-boards.ts): 9 boards created (Digital SAT, AP, MANEB, CBSE,
  ICSE, NECTA, Cambridge, AQA, Edexcel — preparing, no blueprint until formats verified);
  KNEC (KCSE) + DBE (NSC / Matric) renamed; **demo + wassce-ghana retired (cascade)**.
  Production now carries exactly the 14 registry boards.
- Hub (/highschool/exams) rebuilt: class-grouped sections with honest coverage
  (practice Qs / papers), format chips, written-paper classification chips on board pages.
- CBT flow aligned: /cbt grid mirrors the CBT class (JAMB live; Digital SAT + AP preparing);
  practice prefixes extended to all new board codes.

## Night session (orchestrator, 2026-10-21)

- Repaired 42 AssessmentItem rows in production from reviewStatus "draft" →
  needs-human-review (seed had been fixed by agent 4; live rows had not been).
- cbt/data.ts subject detection rewritten: parent-edge BFS replaces hyphen
  counting (subject roots) and prefix matching (descendant topics). The old
  logic hid agricultural-science + literature-in-english as subjects (10 of 12
  in pickers) AND hid agriculture's 500 questions from CBT entirely, because
  jamb-agriculture-full-syllabus does not share its parent's id prefix.
  All 12 subjects x 500 = 6,000 now reachable; JAMB CBT card reports 12.
- Killed a day-long hung tag-boards dry-run (per-row upserts over the pooler are
  unusable at this scale; single-statement approach documented for agent 5).

## opencode integration (2026-10-24, orchestrator)

- Repo cloned to /root/Gnostiri; project config `/root/Gnostiri/opencode.json` (schema-tagged,
  pure JSON). Conventions in `AGENTS.md` (loaded via `instructions`).
- MCP servers (verified working): github (remote, bearer via {env:GITHUB_TOKEN}; initialize probe
  OK), context7 (remote docs, no auth), postgres (local `@modelcontextprotocol/server-postgres` —
  npm-deprecated but functional; reads `$DATABASE_URL` from shell env; initialize + tools/list OK,
  exposes read-only `query`), playwright, sequential-thinking, memory.
- Vercel MCP is OAuth-only (PAT rejected: www-authenticate → authorization_servers vercel.com).
  Config carries no header; run `opencode mcp auth vercel` once after restart. `VERCEL_TOKEN`
  retained in .env for CLI/API use only.
- markitdown MCP disabled (`enabled: false`): PyPI unreachable from this box; venv exists at
  /root/mcp-venvs/markitdown. Re-enable after `/root/mcp-venvs/markitdown/bin/pip install markitdown-mcp`.
- Secrets: `.env` (chmod 600, gitignored) + exports in `~/.zshrc` and `~/.profile`. No secret values
  in repo or opencode.json. Chat-exposed creds (GitHub PAT, Vercel token, Supabase DB password)
  remain on the rotation list (blocker #5).
- Agent roster (.opencode/agent/, all subagents): questions-lane, curriculum-lane, db-lane,
  app-lane, tutor-lane, payments-lane, e2e-lane, audit-lane (read-only), reviewer-lane (read-only),
  scribe-lane. Mailbox: /tmp/opencode/mailbox/agent-agents/AGENT-MESSAGES.md.
- Skills (.opencode/skills/): dual-version-question-banks, sm2-spaced-repetition, assessment-items,
  prisma-supabase-pooler, nextjs-repo-conventions, qa-gates, study-content-accessibility,
  seo-public-pages, secrets-and-env-hygiene, vercel-github-ops.
- Commands: /qa, /ship-check.
- Ops notes: run opencode from /root/Gnostiri (restart required after config changes). Playwright
  browsers need `npx playwright install chromium` before e2e-lane can run.

## Board clearance (2026-10-24, orchestrator — owner directive)

Owner directive: clone/variant questions stay as original Gnostiri content; leave JAMB for now;
clear all other Nigeria exams (WAEC, NECO) and all other-country boards; return to JAMB later;
build university (MBBS) in parallel.

- Provenance audit first: the shipped 6,000 JAMB questions are original-text variants
  (provenance "original", variant B, no board names/years in text, zero duplicate stems in the 12
  banks) — ZERO verbatim board questions live in production. The only official-text artifacts were
  JSON-side (nsc-official.batch1.json ×6, nsc-necta.dual-version.json ×3) and are quarantined.
- Production cleared (transactional, backups at .backups/pre-clear-2026-10-24/): Examination 13→1
  (jamb only) · Questions 7,096→6,640 (jamb 6,000 + master 640 original) · Topics 92 waec/neco
  deleted · QuestionBoardTag 909 deleted · TopicBoardAlignment 663 deleted (all pointed to cleared
  boards) · CurriculumBoard 27→0 · ExaminationPaper 11 deleted · StudyTrack 3 + PracticeSession 5 +
  Lesson 1 user-data rows removed with cleared content.
- Repo: exam-bank.ts + seed-exam-boards.ts now JAMB-only (retirement list re-enforces on re-seed);
  content/exams/exam-papers.json filtered to JAMB (21→10 papers); NSC/NECTA official files +
  a4-generated batches (unlocalized multi-country variants) quarantined to .backups/.
- Content defects found for the JAMB rework queue (later round): a4-batch2 had 41 duplicate stems
  (quarantined); 9 english passage-comprehension items are self-contained (inline passage) — OK;
  physics bank has 1 needsCheck item.
- Master 640 questions KEPT (owner call): original exam-style content incl. non-board topics
  (e.g. master-ai-emerging-tech) — not board past-questions.
- MBBS status at clearance: 13 courses · 57 modules · 321 lessons · 317 concepts · 139 assessment
  items — all needs-human-review. Item depth is the gap: medicine/pathology/obgyn/pharmacology/
  paediatrics/surgery at 6 items vs biochem 25 / physio 26 / anatomy 28. Deepening underway.

## MBBS deepening round 1 (2026-10-24, orchestrator)

- New seed `prisma/seed-assessment-internal-medicine.ts` (20 original SBA items, MED 201):
  internal-medicine-foundations 6 → 26 items, orderIndex offset 6 to preserve pre-existing
  items, marks 1 / negativeMarks 1.25 / isPublished / reviewStatus needs-human-review (post-repair
  convention — no draft rows). Concepts covered: fluid/acid-base, sepsis, ischaemic heart disease,
  heart failure, arrhythmia, valvular disease, asthma/COPD, pneumonia/pleural, PE, GI approach,
  peptic ulcer, IBD, liver, pancreatic, thyroid, diabetes, endocrine emergencies, AKI, anaemia,
  infectious disease. Registered in tests/assessment-seed.test.mjs (structural invariants).
- Platform totals: 139 → 159 assessment items, all needs-human-review (0 draft).
- Gates green: assessment-seed 4/4 · tsc clean · mbbs-spine + mbbs-module-two + alignment-engine +
  assessment 43/43.
- Next deepening targets (same pattern, ~20 items each): pathology-cell-injury-repair (6),
  obstetrics-gynaecology (6), pharmacology-foundations (6), paediatrics-child-health (6),
  surgery-principles (6), then introduction-to-programming (12) + applied-statistics (12), then
  stubs data-foundations + academic-writing (0 modules).

## AIIMS MBBS reconstruction (2026-10-24, orchestrator + parallel agent lanes)

Owner directive: rebuild the university on the real AIIMS MBBS syllabus (owner-supplied condensed
transcription of "syllabus - MBBS.pdf" — marks still OCR-unverified, validate before hard-coding
any assessment weight); rebuild in parallel with the board clearance.

- **Spec**: `prisma/seed-courses/mbbs/AIIMS-SYLLABUS-SPEC.md` — 3 phases, 9 semesters, 3
  professional exams, subject×semester map, postings, internship block table, skills layer.
- **9 missing subjects seeded** (`prisma/seed-courses/mbbs/allied-specialities.ts`, spines only —
  modules + concept DAG + tracked-placeholder lessons, no placeholder items; SUBJECTS env filter
  for resumable runs): MIC 201 microbiology · CMED 301 community medicine · FOR 202 forensic
  medicine · PSYT 306 psychiatry · DERM 307 dermatology · ANAES 307 anaesthesiology · OPHT 307
  ophthalmology · ORTH 307 orthopaedics · OTOR 308 ENT. University totals: 13 → 22 courses ·
  57 → 94 modules · 321 → 409 lessons · 317 → 424 concepts.
- **Assessment depth (parallel agent lanes, all verified)**: pathology 6→26, pharmacology 6→26,
  obstetrics-gynaecology 6→26 (new seeds `prisma/seed-assessment-{pathology,pharmacology,
  obstetrics-gynaecology}.ts`, registered in tests/assessment-seed.test.mjs). Platform items:
  139 → 219, ALL needs-human-review, 0 draft, 0 verified.
- **negativeMarks normalised**: the seed template had drifted to 1.25 while every live row shipped
  0.25 — all 219 rows normalised to 0.25 and all 7 seed-assessment-*.ts files corrected, so
  re-runs cannot reintroduce the split.
- **Post-clearance code repair (audit → parallel fix lanes, all green)**: 20+ retired-board
  references removed across prisma/seed.ts (WAEC/NECO resurrection risk — examsData now JAMB-only,
  WAEC quadratic block deleted), src/lib/cbt/config.ts (presets trimmed, WAEC_GRADES deleted),
  cbt/scoring.ts (waecGrade → gradeForPercent), battle-plan chain (API guard + page + homepage now
  jamb-only), homepage/highschool/study-plan SEO copy, BioDiagrams label, CsvImporter example,
  highschool exam route guard (`if (!registryBoard) notFound()` — a stray DB row can never render a
  board page again), practice-page EXAM_CODE_PREFIXES → ["jamb"], tools/audit-counts.mjs +
  tools/smoke.mjs + tools/pq/{tag-boards,verify-unification,audit-surfaces,locales}.mjs, tests
  fixtures (qa-fixtures/qa-tools/board-taxonomy/one-count), and
  `tools/pq/unify-boards.mjs` DELETED (destructive re-duplication script).
- **Gates**: tsc clean · next lint clean · full suite 218/218 pass.
- **Known follow-ups**: (1) content/questions/{biology,chemistry}.json still carry styleBoard
  "WAEC" on 173 rows and relabel-sourceExam.json is unapplied; (2) tools/pq/audit-surfaces.mjs
  flags 6,000 jamb-tree vs 6,330 tag-served questions (330 master-* rows tagged jamb CORE by
  design — contradiction matrix needs an owner ruling); (3) verify-unification.mjs:178 prose still
  references the deleted unify-boards.mjs; (4) curriculum-alignment seed still carries foreign
  CurriculumBoard rows (country-alignment feature — owner to confirm scope); (5) MBBS authoring
  queue: 409 placeholder lessons + 0 items on the 9 new subjects, plus paediatrics/surgery/
  programming/statistics depth pass.

## Authoring wave 1 (2026-10-24, 6 parallel agent lanes — all verified)

- **Depth passes**: paediatrics 6→26, surgery 6→26. **New subjects**: medical-microbiology 0→22,
  community-medicine 0→23, psychiatry 0→18, dermatology 0→16. New seeds:
  prisma/seed-assessment-{paediatrics,surgery,microbiology,community-medicine,psychiatry,
  dermatology}.ts — all registered in tests/assessment-seed.test.mjs, all negativeMarks 0.25,
  all needs-human-review.
- **Repair caught by the psychiatry lane**: production had zero ConceptNodes for `mbbs-psychiatry`
  (its spine seed had silently failed in the first allied run). The lane re-ran the idempotent
  spine seeder scoped to `SUBJECTS=psychiatry` — 5 modules, 16 concepts, 13 prereq edges, 16
  placeholder lessons restored from repo source. Lesson for the orchestrator: after any allied
  spine run, verify concepts-per-course, not just course rows.
- **allied-specialities.ts split** into 9 per-subject files (microbiology.ts … otorhinolaryngology.ts)
  + a barrel, so lesson-authoring agents can own one file each without collisions. Barrel verified
  end-to-end (SUBJECTS=dermatology re-run clean), SUBJECTS env filter retained for resumable runs.
- **Gates**: tsc clean · lint clean · full suite 224/224 (was 218).
- **Platform totals**: 22 courses · 338 assessment items — ALL needs-human-review, 0 draft, 0
  verified. Core nine subjects now uniform at 25–28 items each (ANAT 28, PHYS 26, BCHM 25, PATH
  26, PHRM 26, MED 26, SURG 26, OBGY 26, PEDS 26).
- **Next queue**: item batches for forensic-medicine, ophthalmology, orthopaedics, anaesthesiology,
  otorhinolaryngology (0 items each — 5 lanes), then lesson authoring (one subject-file per agent,
  house format: outcomes/prereqs/big idea/worked examples/common mistakes/check questions/MCQs),
  then programming/statistics depth, then stubs data-foundations + academic-writing (retire or build).

## Authoring wave 2 + highschool exam fixes (2026-10-24)

- **Power-cut recovery**: lanes for forensic/ortho/anaes/ENT completed before the outage
  (16/16/14/14 items); ophthalmology was mid-write and was re-run clean (16 items). Verified no
  partial writes, no duplicate slugs, all rows needs-human-review. Stray hung ts-node killed.
- **Bank hygiene** (tools/pq/dedupe-banks.mjs, idempotent, backups in .backups/pre-dedupe-2026-10-24/):
  the 4 expansion files were fully absorbed into their base banks → content/questions 6,140 → 6,000
  rows (12 banks × 500, zero duplicate stems); 173 items relabelled styleBoard WAEC → JAMB (bank is
  now uniformly 6,000 JAMB-styled, zero WAEC labels); 5 diagram/figure refs all verified
  answerable inline (kept, reasons logged); one needsCheck item remains (physics/exp1-waves-q2).
- **Count contradiction — resolved as a STALE MIRROR + one real leak.** Live audit of
  gnostiri.vercel.app proved every surface already prints 6,000 (tree basis); the "3 DIFFERENT
  COUNTS" came from tools/pq/audit-surfaces.mjs modelling tag counts the shipped code no longer
  runs. Real leak: 330 master-* questions tagged jamb CORE were servable by hand-typed URL
  (/api/questions and /api/practice/manifest both answered a master topic). Fix (a) src/app/api/
  questions/route.ts — topic lookup now gated by boardTreeTopicIds (out-of-tree topic → 404) and
  no tag-admission branch remains; (b) src/lib/exam-manifest.ts — topic resolution tree-gated;
  (c) tools/pq/audit-surfaces.mjs — mirror corrected to the shipped tree basis + manifest summed
  per topic + new "out-of-tree tags (hygiene)" row; (d) tools/pq/verify-unification.mjs — stale-tag
  warning is loud but non-fatal (deletion needs owner sign-off) + false "SOURCE copies" comment
  replaced with measured facts (329/330 have no in-tree twin; 60 have no JAMB destination).
  Matrix now prints JAMB ONE COUNT.
- **Platform totals**: 22 courses · 414 assessment items — ALL needs-human-review, 0 draft, 0
  verified. Item depth uniform: the nine core subjects 25-28 each, allied subjects 14-23 each,
  programming/statistics 12 each.
- **Gates**: tsc clean · lint clean · full suite 229/229.
- **OWNER RULINGS PENDING**: (1) the 3 in-tree theory questions (theory-bio-q1/2/3) are excluded
  from board-format practice because JAMB P1 is MCQ-only — manifest serves 5,997 vs tree 6,000.
  Tag them NOT_EXAMINED (single count 5,997) or keep CORE (6,000 + documented 3-question
  divergence)? (2) the 330 stale out-of-tree jamb tags are now inert — approve deletion
  (DELETE FROM QuestionBoardTag ... topic LIKE 'master-%') or keep for tag-hygiene history?
- **Next queue**: lesson authoring for the 9 allied subjects (409 placeholder lessons, one agent
  per subject file), then programming/statistics depth, then stubs.

## Production deployment (2026-10-26, orchestrator)

- PR #9 (`release/board-clearance-university-rebuild`, 5 commits, 98 files, ~9.9k insertions)
  merged to main (849bce2) with CI green (tsc + lint + 226/226 tests + build) and a passing
  Vercel preview. Production deploy dpl_ByNhMnZKj1MtBZjyZiNHLKMszegU READY.
- DB-side changes were applied directly earlier (board clearance, 414 items, placeholder-lesson
  deletion, ContentReport migration with FK+RLS); this merge shipped the matching code.
- Live verification on gnostiri.vercel.app: /highschool/exams/jamb shows 5,997 as the single
  count on every surface; battle-plan and the exams hub are JAMB-only; /university renders no
  review scaffolding ("open to study" copy live); the ContentReport tab ("Spotted a problem with
  this content?") renders on university lesson pages, highschool study pages and quiz pages;
  POST /api/content-reports returns 401 unauthenticated.
- Known nuance: retired-board URLs (e.g. /highschool/exams/waec) render the not-found PAGE but
  answer HTTP 200 (force-dynamic streaming) — content is correct, status code is cosmetic.
- Next queue: lesson authoring for the 9 allied subjects (concept spines only, no lesson rows),
  then programming/statistics depth (12 items each), then the two stubs.

## University wave 1 + study crosswalk (2026-10-26)

- **Lesson authoring** (house format, all gates green): microbiology 0→15 lessons, forensic
  medicine 0→12, community medicine 0→10, pathology 6→15. Second-Professional-bound subjects
  now carry real teaching content; M4-M5 remain tracked spines for the next wave.
- **Item depth**: introduction-to-programming 12→26, applied-statistics 1→26 (both now at the
  house standard; platform items 414→442).
- **Study crosswalk** (src/lib/study-crosswalk.ts): the 67 highschool study notes live on
  master-* curriculum topics while JAMB study pages resolve the {code}-* tree, so exam study
  pages showed an empty state. The crosswalk maps 32 JAMB topics to their master counterparts
  (incl. the two semantic fixes the naive suffix matcher got wrong: english-punctuation →
  master-punctuation-mechanics, physics-fields → master-further-mechanics-fields); the JAMB
  study page falls back to the mapped note. Topics unique to JAMB keep the honest empty state.
- Fixed the CLI guards in the split allied seed files to the sibling `mbbs/<name>` pattern.
- Gates: tsc clean · lint clean · full suite 226/226.
- **Remaining queue (December launch)**: wave 2 — dermatology, psychiatry, ophthalmology,
  orthopaedics, anaesthesiology, ENT lessons (0 each); wave 3 — paediatrics/medicine/surgery/
  obgyn lessons 6→~14 each; then the AI-era interface pass (owner flagged the current UI).

## University wave 2 (2026-10-27)

- Lesson authoring wave 2 complete (connection dropped mid-wave; all six files had completed
  their writes, re-seeded and verified): psychiatry 12, dermatology 11, ophthalmology 11,
  orthopaedics 11, anaesthesiology 10, otorhinolaryngology 9 — 64 lessons.
- University lessons 102 → 166 across 15 courses; only pharmacology, medicine, surgery,
  obstetrics-gynaecology and paediatrics remain thin (6 lessons each) for wave 3, plus
  applied-statistics (1 lesson vs 26 items).
- CLI guards fixed in all six split seed files (sibling mbbs/<name> pattern).
- Gates: tsc clean · lint clean · 228/228 tests.

## University wave 3 (2026-10-27) — content complete

- Wave 3 delivered: medicine 6→14, surgery 6→14, paediatrics 6→14, obstetrics-gynaecology 6→14,
  pharmacology 6→14, applied-statistics 1→10 authored lessons (all house format, seeded, verified).
- **Every course now carries real teaching content**: 263 authored lessons across 20 courses
  (lowest: otorhinolaryngology 9; only the two stubs data-foundations/academic-writing remain at 2).
- Gates: tsc clean · lint clean · 228/228 tests · both waves merged to main and deployed.
- Remaining content queue (optional depth): M4-M5 placeholders in microbiology (8), community
  medicine (8), forensic medicine (2), pathology (~15), psychiatry (4) and the two stubs' module
  structure. Then the AI-era interface pass (owner's next priority).

## Phase 1 build (2026-10-27): shell, notifications, Merit League

- Schema: Notification, NotificationPreference, Competition, CompetitionMember, LeagueBadge,
  LeagueCredit (migration 20261027130000 applied to production with FKs + RLS; client generated).
- App shell: SiteMenu restructured into six zones (Study / Your workspace / Compete & share /
  Membership) with NotificationBell + PrimeBadge in the menu header; /arena permanently redirects
  to /league; Desk and Library land as honest "opening soon" pages (no dead links).
- Notification centre: single writer src/lib/notify.ts (muted types, quiet-hours email deferral,
  Resend env-gated no-throw email), bell with unread badge, /notifications feed + preferences
  (emailOptIn, quietHours, per-type mutes), /api/notifications + /api/notifications/preferences,
  plus a contract test (tests/notify.test.mjs, 6/6).
- Merit League: lobby (season banner, format explainers, eligibility panel), create flow,
  invite/join flows, public + private cups; Speed Cup live play with the derived question set
  (seeded FNV-1a → mulberry32 → Fisher-Yates, byte-identical per competition, NO answer key in
  the payload — verified: 20 questions, deterministic, no correctAnswer leak), server-side scoring
  with best-of + rank reconciliation + overtaken notifications, results page and leaderboard.
- Gnostiri Prime badge: /api/entitlements/prime (tier + consecutive months) + PrimeBadge chrome.
- Demo cup seeded ("Launch Cup — Speed", live, public, free) so the lobby is not empty on deploy.
- Gates: tsc clean · lint clean · 234/234 tests.
