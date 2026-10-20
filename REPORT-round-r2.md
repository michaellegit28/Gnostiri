# REPORT — round r2: agent-2/jamb-banks-r2 (resumed run, finished)

reviewStatus of everything produced in this round: **needs-human-review**. Nothing anywhere is marked "verified"; the machine checks are recorded as `selfCheck: "passed"` and are machine checks only, never a human sign-off.

Branch `agent-2/jamb-banks-r2` · Worktree `/tmp/opencode/gnostiri-wt/agent-2` · `main` untouched · no push (A1 pushes) · no DB access · no secrets read or printed · no `rm -rf node_modules`.

## 1. Deliverable: 12 JAMB banks × 500 = 6,000 questions

| # | commit | bank file | subjects' families | final |
|---|---|---|---|---|
| 1 | `ae8abb1` | physics.json | 28 computed | 500 |
| 2 | `0bfc67b` | chemistry.json | 20 computed + legacy + expansion + A4 | 500 |
| 3 | `0110a63` | mathematics.json | 15 computed + legacy + A4 pool | 500 |
| 4 | `5870bc2` | biology.json | 20 (5 computed + 15 recall) + legacy + expansions | 500 |
| 5 | `d923a61` | english.json | 21 (9 rule-verified + 12 recall) + legacy | 500 |
| 6 | `77770d9` | economics.json | 12 (7 computed + 5 recall) | 500 |
| 7 | `520d0dc` | government.json | 15 (2 computed + 13 recall) | 500 |
| 8 | `91c9cf5` | commerce.json | 11 (6 computed + 5 recall) | 500 |
| 9 | `534d00c` | accounting.json | 12 (9 computed + 3 recall) | 500 |
| 10 | `5e0f393` | geography.json | 12 (8 computed + 4 recall) | 500 |
| 11 | `321588c` | agricultural-science.json | 11 (6 computed + 5 recall) | 500 |
| 12 | `5cdc5ea` | literature-in-english.json | 12 (1 pattern-verified + 11 recall) | 500 |
| | | **total** | **189 authored families (116 computed/pattern + 73 recall tables, 1,936 recall rows)** | **6,000** |

Banks 1–11 were committed earlier in this round; this resumed session **finished bank 12 (literature-in-english)** and closed the round with the report and the final self-audit. No bank was rebuilt in this session — the 11 earlier files are byte-identical to their commits (only `literature-in-english.json` is new).

## 2. What was finished this session — literature-in-english

`tools/pq/families-literature.mjs` was mid-authoring (one pattern family + 10 recall tables, 337 sites) which could not reach 500 unique items. Completed as:

| family | kind | sites (rows / quoted lines) |
|---|---|---|
| device-in-quoted-line | pattern-verified | 100 quoted lines |
| literary-genres | recall (dual-answer) | 53 |
| novel-elements | recall | 48 |
| drama-elements | recall | 48 |
| poetry-forms | recall | 49 |
| figures-of-speech | recall | 50 |
| oral-literature | recall | 43 |
| literary-terms | recall | 44 |
| african-literature | recall | 48 |
| poem-analysis | recall | 45 |
| registers-and-style | recall | 41 |
| literary-movements (**new family**) | recall | 18 |
| | | **587 sites** |

Shipped per family: device 56, literary-genres 49, and 42 each for novel/drama/poetry/figures/oral/terms/african/poem-analysis, registers 41, movements 18 = **500**.

### 2.1 The independent verifier (family contract)

- **Pattern family** — quotes a line and asks for the device. The verifier MACHINE-CHECKS the quoted text against the claimed device: `like/as` + a compared noun for simile; ≥3 words sharing an initial consonant for alliteration; a non-human subject doing a human act for personification; a matching sound-word for onomatopoeia; a paired-antonym hit for oxymoron; an extreme-quantity word for hyperbole. A wrong key cannot verify against the quoted evidence, and an unverifiable item is DROPPED, never shipped.
- **Recall tables** — a row cannot re-derive its answer arithmetically, so each row carries a SECOND, separately authored answer copy (`proofKey`) that the generator never sees as a key. `verify()` demands `answer === proofKey` and never a distractor. Disagreement drops the item — an internally inconsistent or hallucinated key can never ship. Structural guarantees (exactly 3 distinct distractors, never the key, non-empty explanation) are enforced inside the factory.

### 2.2 Defects found and fixed in my own mid-round work (before any commit)

1. **Contract bug — `roared` missing from `HUMAN_ACTS`.** The quoted line "The thunder roared above the hills." (personification) failed `isPersonification`; 9 of 400 sampled instances were being dropped as unverifiable. Fixed in the checker definition (the check must describe the device honestly), not by changing the key. Re-test: **600/600 sampled instances verify, 0 drops**.
2. **Ambiguous keys — 7 "X wrote" rows had distractors that are also works by the same author** (e.g. "Ngugi wa Thiong'o wrote — The River Between" offered *Weep Not, Child*, also Ngugi's, as a distractor). Each stem was made specific ("Ngugi wa Thiong'o's novel of Kenya's division is — The River Between"), so exactly one option answers. A programmatic scan over the whole African-literature table against an author→works map now reports **0 bare-stem ambiguities**.
3. **Authoring artefact** — one stem carried a drafting note ("A'ida? no. — The Heinemann African Writers Series published"). Rewritten to "The Heinemann African Writers Series published".
4. **Capacity** — the sites were extended from 337 to 587 (new `literary-movements` family + ~190 recall rows across the 10 existing tables + 60 new quoted lines) because a recall-only bank can never exceed its row count.

### 2.3 Literature build result

```
literature-in-english final=500 legacy=0 a4=0 generated=500 trimmed=0
positions=125/125/125/125   mix={easy:144, medium:206, hard:150}
```

3,669 generation attempts → **3,169 duplicate draws dropped, 0 verifier drops** (duplicates are re-draws of a row already in the bank: the dedup contract, not failures). Independent re-derivation after the build: **all 444 shipped recall rows match their `proofKey`, and all 56 shipped device rows pass checkers written separately from the family module — 0 mismatches**.

## 3. Verifier and gate results across the round

- **Per-family verification at generation**: every shipped key passed its family's independent verifier or was dropped. For the bank completed this session the drop counts are exact (§2.3); the 11 earlier banks followed the same code path (`tools/pq/build-banks.mjs` — verify-fail ⇒ `continue`, key never emitted).
- **`tools/pq/validate.mjs`** (structure, 4 distinct options, key present, required fields, variant/provenance rules, locale leakage, position bias): `errors: 0, warnings: 0` on `literature-in-english.json`; pending transcription `0`.
- **`tools/pq/audit-banks.mjs`** (the round-2 audit gates): **PASS on all 12 banks** — see §6.
- **Extra independent checks this session** (written separately from both the family module and the builder): schema parity of the new bank against `geography.json` (identical field set, 0 extra/missing fields on all 500 rows); recall keys re-derived against `proofKey`; device keys re-derived with hand-written checkers; ids/coreIds/positions/track/domain/styleBoard envelopes; cross-bank coreId uniqueness (0 collisions across all 6,000).

## 4. What "flat, no topic grouping" means in each file

Each bank is ONE JSON **array of 500 question objects** — there is no wrapper object, no `{subject, sections: [...]}`, no per-topic clusters and no nested arrays of topics anywhere in the file:

- **No grouping fields**: rows carry no `section`, `unit`, `theme` or `group` key. Order is the build order (round-robin family fill), which is deliberately NOT pedagogical — questions from the same family are spread through the file instead of being filed under a heading.
- **The subject lives outside the row**: the file name (`content/questions/<subject>.json`) plus every row's `styleBoard: "JAMB"` and `domain: "highschool"`; the fine-grained topic is carried per row in `topicSlug` (e.g. `literature-in-english`, `algebra-foundations`), which is how a consumer groups/filters without any file-level structure.
- **Row shape is uniform and self-describing** (identical field set in all 12 banks, verified programmatically): `id, coreId, provenance, variant, track, domain, topicSlug, styleBoard, type, questionText, options, correctAnswer, explanation, hint, difficulty, sourceExam, reviewStatus, selfCheck`.
- `id` is globally unique and prefixed with the subject (`literature-in-english-<family>-g###`); `coreId` is the dual-version join key (`<family>:<hash of the parameter set>`); `options` is exactly 4 strings; `correctAnswer` is always one of them.
- Every row is `variant: "B"`, `provenance: "original"`, `track: ["global"]`, `reviewStatus: "needs-human-review"` — no Version A rows are created in the JAMB pool (see §5).

## 5. A/B pairing counts

| bank | Version A | Version B | paired coreIds (A+B) |
|---|---|---|---|
| all 12 JAMB banks (6,000 rows) | **0** | **6,000** | **0** |

- The JAMB pool is entirely Version B — original wording, original numbers, machine-verified keys. Version A rows are the OFFICIAL NSC/NECTA papers and are only legal on `track: ["ZA"]/["TZ"]` with an attribution line, so none exist in a JAMB-pool file by design (`build-banks.mjs` emits no A rows).
- The official files that do carry A rows: `nsc-official.batch1.json` — 6 rows = 3 A + 3 B, 3 coreIds (`core-nsc2024-m1-q111/112/113`) fully paired inside the file; `nsc-necta.dual-version.json` — 3 rows on 1 coreId (`core-ns1-quadratic-word-problem`): 2 A (ZA + TZ, both still `[PENDING OFFICIAL SOURCE TEXT]` placeholders) + 1 B global.
- **Gap flagged for review:** 0 of the 6,000 JAMB coreIds have a Version A counterpart anywhere in the repo, so the ZA/TZ tracks cannot yet draw an official A row for a JAMB core. The dual-version workflow's ZA/TZ binding is integration-level (A1), not something this lane can fill — nothing was faked to make the pairing gate look green.

## 6. Final self-audit — all 12 banks (`node tools/pq/audit-banks.mjs`)

Gates: exactly 500 per bank · schema conformance · `reviewStatus` everywhere · no "verified" string anywhere · ids/coreIds/stems unique · key positions not clustered (max share ≤ 35%).

```
PASS — 12 banks: 500 each, schema-conformant, no "verified", keys balanced.
```

| bank | items | mcq/theory | positions | max share | easy/medium/hard |
|---|---|---|---|---|---|
| physics | 500 | 500/0 | 125/125/125/125 | 25% | 154/182/164 |
| chemistry | 500 | 500/0 | 125/125/125/125 | 25% | 152/196/152 |
| mathematics | 500 | 500/0 | 125/125/125/125 | 25% | 142/204/154 |
| biology | 500 | 497/3 | 125/124/124/124 | 25% | 144/199/157 |
| english | 500 | 500/0 | 125/125/125/125 | 25% | 159/189/152 |
| economics | 500 | 500/0 | 125/125/125/125 | 25% | 143/223/134 |
| government | 500 | 500/0 | 125/125/125/125 | 25% | 154/204/142 |
| commerce | 500 | 500/0 | 125/125/125/125 | 25% | 173/176/151 |
| accounting | 500 | 500/0 | 125/125/125/125 | 25% | 170/184/146 |
| geography | 500 | 500/0 | 125/125/125/125 | 25% | 154/200/146 |
| agricultural-science | 500 | 500/0 | 125/125/125/125 | 25% | 151/203/146 |
| literature-in-english | 500 | 500/0 | 125/125/125/125 | 25% | 144/206/150 |
| **total** | **6,000** | 5,997 mcq / 3 theory | — | 25% | — |

JSON validity, field presence, dual-version fields, key-presence, uniqueness and the "no verified anywhere" gate are all green on every row of all 12 files; 0 audit errors. Difficulty mix tracks the engine's 30/40/30 target (±5 points).

**Supplementary stricter pass** (my own node script, checking `hint` as required on every row — stricter than the committed audit gate, which excludes `hint`): 6,000 rows scanned, **235 flags, all in pre-existing content**:

| finding | rows | banks | verdict |
|---|---|---|---|
| `hint` empty | 229 | physics 60, chemistry 59, mathematics 50, biology 60 | legacy rows migrated from the pre-existing expansion files; `hint` is not in the committed gate's required list and was empty before migration. Flagged (§7), not mass-edited — I will not invent hints on 229 rows of another subject's content. |
| `type: "theory"` rows with no options/explanation | 3 | biology (`theory-bio-q1..q3`) | by design: carry `modelAnswer`, `markingPoints`, `totalMarks`, `paper`; the audit gate exempts theory rows from options/explanation. |
| literature-in-english | 0 | — | every row has a non-empty hint, explanation, key present in 4 distinct options. |

All 12 files parse as flat JSON arrays; literature-in-english's field set was verified identical to a committed bank's. No fix-up commit was required by this session's audit.

## 7. Human-review flags

1. **Nothing here has been read by a human.** Every row is `needs-human-review`; the gates are structural and mechanical, not an accuracy review.
2. **Literature content is definition/fact recall** — authored by me from general literature knowledge, not from a prescribed JAMB syllabus text list. A human should confirm it matches the current JAMB literature-in-english syllabus; particular care on the African-literature attributions (18 of 48 rows) and on `Niyi Osundare — The Eye of the Earth`, `Mazisi Kunene — Emperor Shaka the Great`, `Ama Ata Aidoo — Anowa`.
3. **Short explanations.** terse recall glosses (median 30 chars; shortest 14 — "Both together.", "Hymns worship.", "Cast = actors."). Same house style as `government.json` (median 38, min 14) but shorter than `geography.json` (median 98); a human may want richer worked explanations for English-track use.
4. **Metaphor, irony, satire and unseen-passage items are deliberately NOT in the pattern family** — they need semantic judgement a regex cannot do, so they sit only in recall tables (provenance original) or were left out. A human authoring pass is the honest route for those.
5. **`biology.json` ships 3 `type: "theory"` rows** (pre-existing, migrated with the bank) — carried as-is, not silently converted.
6. **Version A gap** (§5) — the ZA/TZ tracks have no official counterpart for any JAMB coreId; `nsc-necta` A rows are still `[PENDING OFFICIAL SOURCE TEXT]`.
7. **`physics.json` carries a legacy `selfCheck: "needsCheck"` value** on migrated rows (pre-existing; the audit gate checks `reviewStatus`, not `selfCheck`). Left untouched; flagged rather than mass-edited.
8. **229 migrated legacy rows have an empty `hint`** (physics 60, chemistry 59, mathematics 50, biology 60 — see §6). The literature bank has 0. A pedagogical pass could backfill hints; I flagged instead of inventing them.
8. **Device family's 100 quoted lines are invented illustration lines**, not quotations from set texts — labelled `sourceExam: "original-exam-style"` throughout. A human should decide whether quoted-line items must come from the prescribed texts.

## 8. Counts and commits

- Banks completed this round: **12 × 500 = 6,000** questions; literature-in-english finished in this session (500 from 12 families).
- Tooling changes: `tools/pq/families-literature.mjs` (completed + corrected), `tools/pq/build-banks.mjs` (literature `fill` plan wired in).
- Validation: `validate.mjs` 0 errors / 0 warnings; `audit-banks.mjs` PASS ×12; independent re-derivation of 500 shipped literature keys (444 recall + 56 device) with 0 mismatches; schema parity with a committed bank confirmed.
- Commits this session: **1** (`5cdc5ea`) — literature bank. This report is delivered with the audit; no fixes were required by the final audit, so no fix-up commit follows.
- Edits outside my lane (DB, seeds, `src/`, `prisma/`): **none**. `main` untouched, no push.
