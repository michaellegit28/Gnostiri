# University content — review state (single source of truth)

Updated 2026-10-12 by A1 after the full-course verification pass. This file
replaces ad-hoc reminders: everything that needs a decision is listed here
exactly once, with its current state.

## VERIFIED — machine-checked, serving, no action needed

- **Introduction to Programming — all 12 lessons.** Every code snippet and
  output claim is executed against real Python 3 (tests/lesson-python.test.mjs,
  78/78 passing). Lessons graduated `needs-human-review -> draft`,
  `needsCheck -> false`.
- **Assessment item positional bias — fixed at the source.** Template SBAs were
  generated with the correct answer always in position A (37/61 items). Both
  generators (seed-university, seed-courses) now rotate options by a
  deterministic per-slug hash; the live spread is 15/61 at A (~25%, i.e.
  statistically random for 4-option items).
- **7 flagged medical items — reviewed and graduated.** Each was checked
  against standard references:
  - ANA: pectoralis-minor relations; intercostal VAN bundle; aortic arch in
    the superior mediastinum (isthmus at the arch/descending junction)
  - MCB: Henderson-Hasselbalch 20:1 (10^1.3); Km vs affinity
  - PHS: zero net driving force at the Nernst potential

## FIXED — an error the flag caught

- **mcb101-ph-neutral-definition** (MCB 101, Water & pH): the draft claimed
  "the ion product of water gives a hydrogen ion concentration of about
  2.5 x 10^-7" and "pH about 6.6" — it conflated Kw with [H+]. Correct:
  Kw(37C) ~= 2.4 x 10^-14, so [H+] = [OH-] ~= 1.6 x 10^-7 and pH ~= 6.8.
  Stem, key option and explanation corrected; flag cleared. This is the
  governance model working as designed.

## OPEN — the only remaining content debt

- **12 template SBAs (Introduction to Programming, one per concept).** These
  are generated placeholders ("A precise, correct description of X...").
  Structurally sound, bias-corrected, and serving as the course's only
  assessment — but the stems are generic. Real authoring = one worked session:
  give each concept a concrete scenario stem + 4 substantive options.
  Until then they stay `needsCheck: true` by design (honest signal, not a bug).
- **SBA/EMQ authoring for ANA/PHS/MCB concept depth.** The 30 medical items
  are live and reviewed; deeper banks (multiple items per concept, EMQ
  themes) are the natural next wave when university content resumes.

Nothing else in the university domain is awaiting a human decision.
