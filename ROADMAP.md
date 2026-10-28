# Gnostiri ROADMAP — December launch

Status: **PLANNED, decisions locked (2026-10-27)**. No code until Phase 1 kickoff.
Principles: mobile-first (students are phone-first) · everything on-platform (no external
messaging channels; email only as an opt-in backup) · content stays real (authored + machine-verified)
· AI runs must be cheap per student (cache, dedupe, cap) — see §7.

## Locked decisions (owner, 2026-10-27)

1. **Free tier keeps:** 1 PDF/month + free Speed Cups. Library previews free.
2. **Free users JOIN private cups by invite link** — only *creating* a cup is gated.
3. **Library rewards are dual:** 🏆 badges (recognition/participation) **and** 🎁 credits redeemable
   for Prime days.
4. **Seasons (owner numbering):** Season 3 = Sep–Dec · Season 1 = Jan–Apr · Season 2 = May–Aug.
   Launch lands mid–Season 3: Season 3 runs as the soft-launch season (mid-season entry allowed),
   Season 1 (Jan–Apr) is the first full season with finals + certificates.
5. **Notifications: in-app is primary** (bell + feed + live toasts), **email included as opt-in
   backup per notification type.** Nothing leaves the platform.

## 1. Architecture — one shell, six zones

Top nav: Home · Study · Desk · Library · League · Tutor · Progress. Bell + Prime badge top-right.

| Zone | Route | Contents |
|---|---|---|
| Home | `/` | Today's plan, streak (+freeze), live cup ticker, library picks, notification digest |
| Study | `/highschool/*`, `/university/*` | CBT, practice, study notes, courses, mastery |
| Desk | `/desk` **(new)** | PDF uploads → processed notes/quizzes, personal plans, revision queue |
| Library | `/library` **(new)** | Public study artifacts, contributor rewards, moderation |
| League | `/league` **(renames `/arena`, redirect kept)** | Cups, brackets, leaderboards, seasons, spectator mode |
| Tutor | `/tutor` | AI chat, Desk-document grounding, (phase 2) voice viva |
| Progress | `/progress`, `/certificates` | Mastery, streaks, verified season certificates |

## 2. Notification centre (in-app primary, email backup)

- **Surfaces:** bell with unread count, `/notifications` feed (grouped, read/unread), live toasts
  during cups, optional email per type with quiet hours.
- **Types:** cup starting in 1h · streak at risk (freeze available) · position overtaken ·
  bracket invite · milestone reached · artifact reward earned (badge/credit) · season results ·
  report resolved.
- **Delivery:** event-driven writes + a scheduled pass (Vercel cron) for streak-risk and cup-start.
  One `Notification` model, preferences in a JSON column; no external channel except opt-in email.

## 3. Merit League (replaces Global Arena)

- **Create-cup eligibility (server-enforced):** Prime ≥4 consecutive months **AND** ≥60% subject
  mastery **AND** ≥85% quiz accuracy **AND** no upheld content reports. Tenure displayed as
  *Prime · 4 months* next to names — tenure is status.
- **Four cups:** Speed (timed accuracy) · Endurance (7/14/30-day streaks) · Mastery (reach target
  first) · Cohort Bracket (4/8/16 teams, elimination).
- **Groups:** private (invite link, WhatsApp-native sharing *by the student*, not us) or public
  (open listing + spectator mode). Free cups open to everyone; paid cups Prime-only.
- **Seasons:** owner calendar (§Decisions-4). Finals week, season leaderboard, verified shareable
  certificates (Certificate model) + generated win cards for stories.
- **Integrity:** server-timed, answers never client-side (existing invariant), server-reconciled
  scores, anonymous handles by default, extended-time accessibility mode.
- **Data model:** `Competition` (host, format, subject, window, entryRule, maxMembers, status) ·
  `CompetitionMember` (joinedAt, score, rank, anonymous flag) · results derived from existing
  session/attempt tables — no new scoring path to trust.

## 4. Public Library

- **Public = processed artifacts only** (extracted summaries, generated quizzes, study plans,
  phase-2 transcripts). **The source PDF is never public** — students upload copyrighted textbooks;
  the library shares the derivative (original work) with private-by-default visibility per upload.
- **Rewards (dual):** 🏆 badges for milestones (first artifact, N reuses, quality picks) ·
  🎁 credits redeemable for Prime days, granted when peers use your artifact.
- **Flywheel:** first uploader of a popular textbook earns when classmates reuse it — viral
  distribution **and** the hash-dedupe cost lever (one textbook processed once per cohort).
- **Safety:** takedown workflow reusing the ContentReport admin, duplicate/quality auto-flags,
  moderation queue before anything trends.

## 5. Desk — the PDF pipeline

Upload → local text extraction (free) → diagram extraction → selective VLM analysis (batched,
capped, low-res) → **hash-dedupe check** (same textbook processed once) → hard conceptual SBAs
through the existing verifier → auto-scheduled reading in the user's plan (30 min–2 h/day × 3/7-day
streaks) folded into SM-2. Hard caps per user/day; heavy users buy usage packs rather than block.

## 6. Monetisation

**Gnostiri Prime** — $3.99/mo, $39.90/yr (annual pushed; founder-annual test at $29 validates
willingness to pay before spend). Gating map: free = 1 PDF/mo, free Speed Cups, library previews ·
Prime = Desk full, Tutor, paid cups, email notifications · Prime + 4-month tenure + performance =
create cups. Breakeven ≈ 25–50 paying users.

## 7. Build order (League leads the redesign)

1. **Shell + notification centre + Prime badge + arena→League rename** — the frame everything hangs on
2. **Speed Cup** + private/public groups on the existing scoring engine — one live format first
3. **Desk (PDF pipeline)** — extract, diagrams selectively, dedupe, SBA generation, scheduling
4. **Library** — artifacts, rewards (badges + credits), moderation, takedowns
5. **Endurance + Mastery + Bracket cups**, seasons, certificates
6. **AI-era visual pass** — League and Desk lead (live tickers, motion, denser dashboards);
   gold/dark identity evolves, unified typography + card system
7. **Phase 2:** voice lectures → same pipeline, tutor viva mode

## Open follow-ups

- Payment wiring (Stripe + Paystack) before any paid tier is exposed — currently blocker #2
- Email provider choice (Resend vs Postmark) at Phase 1
- League-creation performance thresholds to be monitored monthly; adjust if too strict/loose
- Legal: takedown policy + NDPA-compliant privacy copy before Library goes public
