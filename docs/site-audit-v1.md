# Site audit v1 — IA, store-readiness & roadmap (feature/overhaul-v1)

Status: **in progress** — this is the running audit + roadmap for the whole-site
restructure. Each finding is filed here; fixes land on `feature/overhaul-v1`
(feeds PR #95). Process: inventory → structure → fix, per the IA skill.

## Content inventory (route map)
Primary lanes: **High School** (`/highschool/**`, GSE `/highschool/exams`, `/cbt`,
`/battle-plan`) and **University** (`/university/**`, `/university/ai`, `/desk`,
`/university/revision`). Shared: `/study`, `/discovery`, `/tutor`, `/league`,
`/library`, `/progress`, `/certificates`, `/notifications`, `/settings`, `/profile`,
`/pricing`. Utility: `/login`, `/verify`, `/offline`, `/manifest.webmanifest`.
Admin: `/admin/*`. Legacy/redirect: `/arena` → `/league`.

## Findings
- **Lane isolation (done, #95):** nav/menu + `/study` + `/practice` filter by lane;
  Timed CBT is HS-only; routes stay separate. ✅
- **Orphans / redundancy:** `/arena` = `redirect("/league")` (fine). `/study-plan`
  is a distinct **manual** plan builder, reachable from `/progress` — keep, but
  it is a candidate to fold into the tiered Battle Plan later. No hard orphans. ✅
- **Copy / theming (#95):** student-facing descriptions removed; explanations live
  only in the tour; GPE rename + dual light/dark theme system. ✅
- **Top navigation (#95):** removed; minimalist top-left menu popover. ✅

## Store-readiness (Play / F-Droid / GitHub / Komi / Apple — eventually)
Goal: an installable, offline-capable, accessible, responsive **PWA** now, so it
ships to store wrappers (TWA/Bubblewrap for Play, F-Droid PWA or wrapper, Apple
Add-to-Home/PWA) without a native rewrite.
- **Fixed this pass:** real **PNG icons** (`icon-192/512`, `icon-maskable-512`,
  `apple-touch-icon.png`) + manifest wired with any+maskable PNG/SVG; manifest
  `shortcuts` (GPE/CBT/AI Studio/Progress), `categories`, `lang/dir`, `id/scope`;
  iOS `appleWebApp` + `apple-touch-icon`. Service worker already caches study
  content + serves `/offline` on failed navigations.
- **Remains (later):** Play Store via TWA/Bubblewrap needs the PNG icons (now
  present) + Digital Asset Links; F-Droid PWA wrapper or native; Apple via PWA or
  native shell. Route-by-route **responsive + a11y** pass (next).

## Roadmap (prioritized)
1. Route-by-route **responsive/mobile + a11y** sweep (keyboard, focus, contrast,
   44px targets, offline) across the primary study/exam surfaces.
2. Uni **AI-lane feature surfaces** (transcription, auto-correction, assessments)
   — schema ready (PR-B), UI next.
3. Fold `/study-plan` manual builder into the tiered Battle Plan.
4. Store packaging when native/desired: TWA (Play), PWA wrappers (F-Droid/Komi),
   Apple shell. Keep PWA as the portable core.

## Store/IA notes
Every route must remain: standalone-installable, offline-graceful, lane-correct,
description-free, WCAG-AA contrast, 44px touch targets.