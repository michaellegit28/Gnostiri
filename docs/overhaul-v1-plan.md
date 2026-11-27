# Overhaul v1 — architecture & UI proposal (ADR)

Status: **PROPOSED — awaiting owner approval before destructive changes.**
Branch: `feature/overhaul-v1` (based on `origin/main` @ `3b9a06b` = merges of #92 UX/IA+themes, #93 Battle Plan).
Note: local `~/Gnostiri` is on a stale lane branch (`agent-app/visual-pass-p0`) and is NOT the base.

## Guiding principles
- Base the shared skeleton (auth, layout shell, tokens, theme system) on what #92/#93 already
  landed (dual-lane nav, 8 themes, Battle Plan foundation). We restructure, not rebuild from zero.
- Strict lane isolation: High School (HS) and University (Uni) never cross-link. Uni is deep/AI-heavy;
  HS is linear/exam-prep. Shared skeleton, different content trees.
- De-AI look: grain texture, layered physical shadows, glassmorphism ONLY on floating chrome.
  High-contrast, desaturated accents. No marketing tone.
- Payments stay excluded (owner directive).

## Phase 4 — Rename GSE → GPE (Gnostiri Proficiency Exam)
Rename the High School exam system from "GSE / Gnostiri Senior Examination" to "GPE / Gnostiri
Proficiency Exam" (avoid UK GCSE confusion; more premium).
- UI text (14 occurrences on main): `src/components/chrome/nav-model.ts`, `src/app/highschool/page.tsx`,
  `src/app/page.tsx`, `src/app/practice/page.tsx`, `src/app/study/page.tsx`,
  `src/components/dashboard/LaneBoard.tsx`, `src/components/practice/PracticeGrid.tsx`,
  `src/lib/feature-tour.ts`.
- Code identity: add a single source constant `GPE` / `GnostiriProficiencyExam` (e.g. `src/lib/exam-brand.ts`)
  and reference it everywhere (label + tour copy), so the name lives in one place.
- DB: `UserPreference.examStandard` comment references "GSE exam" (schema.prisma) — update comment only.
  No stored data value says "GSE" today (boards are jamb/waec/…); verified. If any row later stores a
  "GPE"-branded standard, that is an additive data migration (see destructive list).
- Docs: STATE.md, AGENT_CHAT.md, README references.
- Non-destructive (text/const/comment). Any DB value migration would be destructive → separate approval.

## Phase 2 — Strict gating & routing
- Lane switch ONLY via the top-left menu `LaneSwitch` (already the sole control). Confirm no other
  surface switches lanes.
- Hard isolation (proposed): add a middleware/layout guard so a Uni session cannot render HS-only
  routes (`/highschool/*`, `/cbt`, `/battle-plan` HS logic) and vice-versa — upgrading today's soft IA
  filter to an enforced boundary while keeping direct-URL behaviour predictable. (Decision needed:
  soft-IA vs hard-redirect.)
- Distinct trees on a shared skeleton:
  - HS: Study → textbook topics → GPE papers (/highschool/exams) → Timed CBT → Battle Plan (rules planner).
  - Uni: Programme/Year → Subjects → Courses (/university) → AI Studio cluster + Revision + Battle Plan (AI planner).

## Phase 3 — Feature parity & differentiation
- Remove Timed CBT from University: change `/cbt` to `audience: "highschool"` only (nav-model + LaneBoard
  Uni panel + tour copy). HS keeps CBT; Uni replaces it with the AI cluster below (shared skeleton preserved).
- Uni AI lane (integrate + reserve surfaces):
  - AI PDF Intelligence (existing `/desk`, re-branded Uni-only).
  - AI Live Tutor Transcription (entitlement `voiceTranscription` exists; add Uni surface + model).
  - Auto-correction (entitlement `aiMarking` exists; add Uni surface + model).
  - Note-making (new).
  - AI Assessments (new).
- Proposed additive schema (MySQL→Postgres; cascade to User; indexed on userId+domain):
  - `AiNote(id, userId, courseId?, lessonId?, title, body, sourceRef Json?, createdAt)`
  - `AiTranscriptionSession(id, userId, courseId?, sourceType, sourceRef, transcript, notes, createdAt)`
  - `AiAssessment(id, userId, courseId?, config Json, createdAt)` + `AiAssessmentAttempt(id, assessmentId, responses Json, score Float?, feedback Json?, createdAt)`
  - `AiCorrection(id, userId, courseId?, artifactRef, result Json, createdAt)` (or fold into Assessment feedback)
  - All `domain = university`; migration(s) additive only, applied via Supabase SQL editor (rule 7).

## Phase 1 — UI, theming, de-AI + navigation rebuild
- Design-system audit: verify/extend grain (body::after turbulence), layered `--card-shadow`/`--shadow-lift`,
  glass (`--glass-*` + `gn-glass`) ONLY on floating chrome (sidebar, drawer, palette, TutorPill, tour modal) —
  content surfaces stay flat-token. Cap accent saturation; run contrast check (token floors already enforced by
  tests/a11y.test.mjs) across all new surfaces.
- TOP NAVIGATION REMOVAL: rewrite `AppShell` to delete the entire top header (brand text/logo, command
  palette button, sync, theme toggle, bell, Prime badge). Relocate affordances:
  - Notifications (bell) → a compact entry at the sidebar top.
  - Theme toggle → Settings (Appearance) + keep the pre-paint default; optionally a small control in the menu.
  - Prime badge → Profile / sidebar footer.
  - Sync indicator → sidebar footer status.
- MINIMALIST SIDEBAR (top-left menu): a content-height panel (not full-screen-height), few key links for the
  active lane + shared, with the lane switch at top and **Settings anchored at the bottom**. Mobile keeps a
  compact version.
- This is a large but non-destructive code change (server/client split preserved; no DB).

## Execution sequencing (PRs onto main; each reviewed)
1. **PR-A (non-destructive, safe):** Phase 4 GSE→GPE text/const rename + remove CBT from Uni + top-nav removal
   + minimalist sidebar + theming/contrast audit refinements. No DB migration.
2. **PR-B (destructive → needs approval):** Uni AI-lane additive schema + migration SQL + new surfaces wired;
   optional lane hard-guard middleware; any GPE data migration.
Each runs the standard gates (prisma generate · tsc · next lint · node --test) and, for dynamic routes,
prod smoke post-merge.

## Decisions requested from owner
1. Confirm Phase 4 scope (rename every user-facing "GSE/Senior Examination" → "GPE/Proficiency Exam", code var `GPE`/`GnostiriProficiencyExam`).
2. Lane isolation: **soft IA filter** (today) vs **hard middleware redirect** for cross-lane URLs.
3. Approve PR-A (non-destructive UI/nav/rename) to implement now.
4. Approve/adjust the PR-B additive schema (Uni AI lane) before I write migrations.
5. Where should Notifications / Prime / Sync / Theme-toggle live after the top bar is removed?
   (Proposed: bell+sync in sidebar top/footer, Prime in sidebar footer, theme in Settings.)