# REPORT — round r1: agent-2/hs-questions-r1

reviewStatus of everything produced here: **needs-human-review** (nothing marked "verified").
Branch: `agent-2/hs-questions-r1` · Worktree: `/tmp/opencode/gnostiri-wt/agent-2` · main untouched · no push (A1 pushes) · no DB access · no secrets printed.

## 1. Ambiguity fixes (2 flagged questions from the previous run's audit)

### 1.1 `exp1-waves-q2` — FIXED and committed (0d19e10)

Verified the uncommitted diff myself before touching anything:

- Old stem: "A ray strikes a plane mirror at 35° to the mirror surface" — two readings: 35° to the **surface** (→ 55° to normal → 110° between rays) or 35° to the **normal** (→ 70° between rays). The old explanation even contained a visible self-argument ("110°? No — wait…"), so the record was genuinely ambiguous AND disputed.
- New stem: "…strikes a plane mirror at an angle of incidence of 35° (measured from the normal)". Angle of incidence is defined from the normal, so the reading is now single-valued.
- Key **70° is correct**: 35° + 35° = 70°. Options 35 / 55 / 70 / 110, key 70°.
- Distractor map (all real, documented misconceptions):
  - 35° — names the angle of incidence and forgets that reflection doubles it.
  - 55° — the complement 90° − 35°, the classic surface-vs-normal confusion.
  - 110° — what you get by measuring 35° from the mirror **surface** (55° + 55°).
- Verdict: **fix accepted as-is**, explanation now clean (no self-argument), 4 distinct options, reviewStatus `needs-human-review`. Committed to `content/questions/physics.json`.

### 1.2 `master-stats-q2` — STILL AMBIGUOUS: reworded, delivered as a patch file (c60bc38)

- **The question's canonical record is not in the repo.** `grep -rn master-stats-q2` matches only `content/questions/audit.json` and `content/questions/REPORT.md`; the master bank (380 questions) was seeded straight into the DB and its text lives nowhere in git (checked `git log --all -S`, all historical file lists, and `prisma/seed-courses/`). With no DB access allowed this run, the row cannot be edited in place.
- Fix delivered instead in **`content/questions/master-stats-q2-reword.json`** (patch data file in my lane, same pattern as the existing `relabel-sourceExam.json`): the reworded stem, options, key, explanation, and an `applyInstructions` SQL patch for A1.
- Rewording: the stem now states the **exclusive (median-excluded) convention explicitly** — "the median itself is excluded before the data is split into lower and upper halves", IQR of 1, 3, 5, 7, 9 → Q1 = 2, Q3 = 8, IQR = **6**.
- Key **unchanged** (6, recorded at option position A in audit.json) so the correct answer is identical for any learner who used the exclusive convention; `needsCheck: true` retained; `difficulty: "medium"` is inferred (the audit record carries no difficulty) — flagged in the file to preserve the DB value if it differs.
- `content/questions/audit.json` verdict updated (both occurrences) to record RESOLUTION (r1): rewording DELIVERED, not yet applied to the DB, needsCheck stays true.

## 2. Chemistry expansion 2 — `content/questions/chemistry.expansion-2.json` (34ad926)

60 original exam-style MCQs. 6 families × 10 questions each; **3 easy / 4 medium / 3 hard** per family.

| Family (topicSlug) | n | E/M/H | key positions A/B/C/D |
|---|---|---|---|
| stoichiometry-mole | 10 | 3/4/3 | 3/3/2/2 |
| atomic-structure | 10 | 3/4/3 | 2/2/3/3 |
| periodicity | 10 | 3/4/3 | 3/3/2/2 |
| acids-bases-salts | 10 | 3/4/3 | 2/2/3/3 |
| electrochemistry | 10 | 3/4/3 | 3/3/2/2 |
| organic-chemistry | 10 | 3/4/3 | 2/2/3/3 |
| **Total** | **60** | **18/24/18** | **15/15/15/15 (A = 25%)** |

## 3. Biology expansion 2 — `content/questions/biology.expansion-2.json` (5d2d5b4)

60 original exam-style MCQs. 6 families × 10; 3 easy / 4 medium / 3 hard each.

| Family (topicSlug) | n | E/M/H | key positions A/B/C/D |
|---|---|---|---|
| cell-biology | 10 | 3/4/3 | 3/3/2/2 |
| genetics-molecular-biology | 10 | 3/4/3 | 2/2/3/3 |
| ecology-evolution | 10 | 3/4/3 | 3/3/2/2 |
| human-physiology | 10 | 3/4/3 | 2/2/3/3 |
| plant-biology | 10 | 3/4/3 | 3/3/2/2 |
| bioenergetics-biochemistry | 10 | 3/4/3 | 2/2/3/3 |
| **Total** | **60** | **18/24/18** | **15/15/15/15 (A = 25%)** |

**Topic-slug decision (documented, not silent):** the brief named ecology, plants-photosynthesis and evolution-diversity as separate families, but those slugs do not exist in the syllabus mapping (rule: "topicSlug from existing syllabus mapping only"). The six canonical biology slugs are cell-biology, genetics-molecular-biology, human-physiology, ecology-evolution, plant-biology, bioenergetics-biochemistry (`src/lib/curriculum.ts`, confirmed against `biology.json`'s 93 seeded questions). So ecology AND evolution/selection/speciation are both covered inside `ecology-evolution` (5 ecology + 5 evolution items), plants AND photosynthesis inside `plant-biology`, and respiration/ATP/enzymes/macromolecule tests inside `bioenergetics-biochemistry`. No new topics were created, none of the brief's intended content was dropped.

## 4. Self-check method (how correctness was attempted)

1. **Template schema.** Both files use exactly the field set of `physics.expansion-1.json`: `id, domain, topicSlug, type, questionText, options, correctAnswer, explanation, difficulty, sourceExam, reviewStatus, selfCheck` (all 12, in that order, on every question). Recovered from git (`git show afdbe76:content/questions/physics.expansion-1.json`) because commit 542859e consolidated the standalone expansion files into the per-subject banks.
2. **Structural validation** on all 120: 4 options, all distinct, `correctAnswer` present in `options`, `domain: "highschool"`, `type: "mcq"`, `sourceExam: "original-exam-style"`, `reviewStatus: "needs-human-review"` on every item, explanation length ≥ 60 chars, unique ids, no duplicate stems (both files: 0 duplicates).
3. **Independent numeric re-solve** — every computational answer recomputed from the stem parameters by a checker script written separately from the explanations, then compared with the key:
   - Chemistry: **19 checks** (mole/mass/concentration, empirical formula, limiting reagent, % yield, equation stoichiometry, nucleon counts, isotope weighted mean, pH, titration, CO₂ volume, purity %, Faraday electrolysis) — **0 mismatches**.
   - Biology: **3 checks** (cube SA:V = 6:1, √0.16 = 0.4, chromosome halving 46→23) — **0 mismatches**. Biology's set is deliberately conceptual, so 3 is the honest count of computational items.
   - Comparator tolerances: exact match, or within 1% for keys rounded for exam style (`1.0 × 10⁻²` etc.), with scientific-notation/subscript normalisation. The only non-content artefacts during this check were floating-point noise in my own checker (e.g. 0.39999999999999997 vs 0.40) — content untouched.
4. **Distractor audit** — every distractor must be the product of a documented real student mistake, and the explanation must say why. Mechanical pass over all 180 distractors per file found 67/180 (chemistry) and 14/180 (biology) "gaps"; on manual read, **all were token-match artefacts** — the rationale is present but phrased in words rather than quoting the option verbatim (e.g. pair formulas instead of element names). Where the rationale was genuinely thin, the explanation was rewritten rather than left.
5. **Answer-position balance** — computed afterwards by the build scripts (keys were permuted into place deterministically): 15 A / 15 B / 15 C / 15 D in each file, **A = 25%** (limit is 30%), so no positional giveaway.
6. **Second-pass factual audit** — re-derived each distractor's number to confirm the explanation's stated mistake is arithmetically reachable. This caught **4 real explanation errors in chemistry** (all fixed and rebuilt): `35%` mis-described as "halving" (it is 14 ÷ 40), `28.4 g` mis-described as an inverted ratio (it is ×2 instead of ×1.5), `0.025 mol/dm³` described vaguely instead of as a misplaced decimal, and the `stoich-q6` distractor units muddled. One biology error also found and fixed: a Hardy–Weinberg explanation mislabelled 0.32 as 2pq (2pq = 0.48; 0.32 is 2 × 0.16).

## 5. Flags for human review

1. **`exp1-waves-q2`** — fix is correct and unambiguous, but it is still only *my* determination; human read recommended (was already flagged ambiguous by the prior audit).
2. **`master-stats-q2`** — rewording is delivered but **NOT applied**; the master question's text is DB-only. A1 must apply `content/questions/master-stats-q2-reword.json`. `needsCheck: true`. Difficulty inferred (medium).
3. **All 120 new questions** carry `reviewStatus: "needs-human-review"` — none marked verified, none seen by a human.
4. **`content/questions/biology.expansion-1.json` uses a topicSlug that is not in the syllabus mapping** — its 10 questions are tagged `cell-structure`, which does not exist in the curriculum (the canonical slug is `cell-biology`). Pre-existing content, outside this round's scope; flagged rather than silently edited, because renaming a slug affects slug → topicId mapping at integration.
5. **Key-position balance was engineered by me** (15/15/15/15 in both files) — this reverses the older bank's systemic bias direction but does not fix the historical bank; the seeded shuffle already applied by 542859e remains the integration-level fix.
6. **Editorial/curricular judgement calls** worth a human eye: the biology topic-slug mapping in §3; `electro-q7` key `1.04 g` is rounded from 1.035 g; `acidbase-q9` distractor `8%` assumes a misplaced-decimal route. None of these change the correct answer.

## 6. Counts

- Questions authored this round: **120** (60 chemistry + 60 biology).
- Questions fixed/reworded: **2** (`exp1-waves-q2` applied and committed; `master-stats-q2` delivered as patch).
- Independent numeric re-solves: **22** (19 chemistry + 3 biology), 0 mismatches.
- Structural validations: **120/120 pass** + the 2 fixed records.
- Distractor-rationale audit: 360 distractors checked, all explained.
- Commits this round: **4** (`0d19e10` waves fix · `c60bc38` stats rewording · `34ad926` chemistry · `5d2d5b4` biology).
- Files written: `content/questions/physics.json` (modified), `content/questions/master-stats-q2-reword.json` (new), `content/questions/chemistry.expansion-2.json` (new), `content/questions/biology.expansion-2.json` (new), `content/questions/audit.json` (verdict updated), this report.
- Edits outside `content/questions/**`: **none**. main untouched, no push, no production action, no secrets.

## 7. Environment note (blocker encountered, resolved)

The main clone's shared `node_modules` was mid-reinstall at session start; I waited and only ran tooling after `node_modules/.bin` was populated, then symlinked it into the worktree (`ln -s`). No `rm -rf node_modules` was run anywhere, as instructed.
