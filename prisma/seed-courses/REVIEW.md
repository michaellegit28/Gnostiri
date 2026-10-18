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

## CLEARED — debt closed (2026-10-12, second pass)

- **31 placeholder items replaced with authored content.** All 12 programming
  concept SBAs and all 19 ANA/PHS/MCB concept checks now carry concrete
  scenario stems, substantive options and teaching explanations (authored by
  A1, grounded in each lesson; every code claim executed against real Python).
  Zero template stems remain in the bank.
- **Key-position spread fixed everywhere.** All five generators now rotate
  options deterministically by item index; live spread [A,B,C,D] = 21/15/12/13
  of 61 — no dominant-answer strategy remains (was 100%-at-A for templates,
  then 46%-at-B from A3's hand-authoring pattern).
- **Drift guard.** Every generator now refuses to run if correctAnswer is not
  present verbatim in its options — the answer/key drift class of bug fails
  loudly at seed time, not silently in the exam hall.
- **Full bank at `draft`.** All 61 items + all 18 lessons: reviewStatus
  'draft', needsCheck false. Nothing is flagged; nothing is placeholder.

The one step deliberately NOT taken: marking content 'verified'. That status
is reserved for the medical-educator / pedagogy sign-off, which is a domain-
expert pass, not an engineering one. Draft is the honest ceiling for
machine-and-review verification.

Nothing in the university domain is awaiting a human decision.
