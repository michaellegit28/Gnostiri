# BOARD GOVERNANCE — copyright posture, syllabus gate, cross-board rules

reviewStatus: needs-human-review

## 1. Pool + Papers economics (the owner's 1,000-question rule)

- ONE master pool per subject (never duplicated per board). Every board's papers DRAW from the same pool — shuffled per paper, mixed-topic, syllabus-filtered.
- Target: **1,000 questions for mathematics** (currently 100 — grows by waves of 150–250). At 1,000, we can render UNLIMITED distinct papers per board (each paper = a 40–50-question DRAW) without ever rendering the whole pool in one exam.
- No board ever "owns" pool questions; boards own FORMAT (styleBoard + BoardBlueprint) and their SYLLABUS filter.

## 2. Syllabus-strict gate (per board)

- Every paper carries `syllabusStrict: true`. Assembly may only draw questions whose topics appear in THAT board's published syllabus.
- Governance file to maintain per board: `syllabus-<board>.json` mapping board → allowed master topics. Papers drawing outside it are rejected at build time.
- WAEC and NECO syllabi overlap ~90%+ — which is why WAEC-style content legitimately serves NECO candidates (see §4).

## 3. Copyright posture per board (verified posture, owner to confirm before "official" labels)

| Board | Past questions status | What we do |
|---|---|---|
| **JAMB** (Nigeria) | COPYRIGHTED — JAMB sells its official past questions | Original board-style items + disclaimer. Never "official". |
| **WAEC** (West Africa) | COPYRIGHTED — WAEC asserts copyright, sells past papers | Original board-style items + disclaimer. |
| **NECO** | COPYRIGHTED (sells past questions) | REMOVED from platform for now (owner decision). Cross-prep note below covers NECO candidates via WAEC-style content. |
| **WASSCE-Ghana** | Same WAEC copyright regime | Original style only. |
| **KCSE** (Kenya — KNEC) | KNEC asserts copyright despite wide circulation | Original style only. |
| **NSC-Matric** (South Africa — DBE) | **STRONGEST FREE-USE CANDIDATE**: the Department of Basic Education publishes past NSC papers openly on its official website for learner revision | Candidate for "official past questions" labelling WITH attribution ("Official past paper of the South African Department of Basic Education") — owner/legal to confirm before the bold claim goes live. |
| **NECTA** (Tanzania) | Publishes past papers openly on its official site | Second candidate for official-labelling with attribution. |
| **BECE** | WAEC-Ghana copyright regime | Original style only for now. |

Rule: the "official past questions of [Board]" label may ONLY be attached once a board's own free publication status is confirmed (NSC-Matric and NECTA lead the queue). `provenance: "official"` stays reserved until then; everything today is `provenance: "original"`.

## 4. Cross-board prep notices (bold, per owner)

- On every WAEC-style paper: **"Writing NECO? The WAEC and NECO syllabi cover the same material — these questions prepare you for both."** (NECO candidates are explicitly invited to use WAEC-style content.)
- When provenance "official" goes live for a board: **"These are official past questions of [Board], and may be shuffled with other examinations."**

## 5. Provenance & styleBoard separation

- `sourceExam`: provenance of the item — strictly "original-exam-style" today; "official-<board>" reserved for verified-free boards.
- `styleBoard`: the FORMAT the item follows — "WAEC", "JAMB", future boards. One pool, many boards: the same item can appear in papers of several boards (shuffled per paper).
- `provenance` (paper level): "original" today; "official" reserved per §3.

## 6. Implementation status

- `content/questions/<subject>.json` — 5 pools (373 questions total), one per subject, seeded-shuffled options, no topic-split files.
- `content/exams/exam-papers.json` — 21 paper blueprints: 2 boards × 5 subjects × (free practice mini 24Q + premium full mock 40–50Q) + WAEC Biology P2 theory paper (30 marks, expanding).
- Every paper: `syllabusStrict: true`, disclaimer flag, provenance "original", H:MM:SS-ready durations, tier-tagged for the freemium funnel.
- Pending A1/A4: render papers from blueprints; H:MM:SS timer; disclaimer component; NECO removal pass; option shuffling at DB import; curriculum seed on prod.
