# DUAL-VERSION WORKFLOW — the hybrid past-questions model

reviewStatus: needs-human-review. Owner directive: official papers from South Africa (NSC/Matric — DBE) and Tanzania (NECTA) are used as REAL, UNEDITED text in their own tracks; every other global track receives a CLONED VARIANT of the same core problem.

## The two versions

| | Version A — Official | Version B — Cloned Variant |
|---|---|---|
| Where it renders | South Africa and Tanzania tracks ONLY | ALL other tracks (JAMB, WAEC, US, UK, future boards) |
| Text | REAL, unedited official question text | Completely rewritten — original wording |
| Attribution | "Official past question — © [DBE / NECTA], reproduced for educational practice" | None needed (original text) |
| Numbers | The paper's original numbers | NEW numbers (seeded variation) — the key is recomputed and machine-verified |
| Concept/structure/difficulty | unchanged | SAME concept, SAME structure, SAME difficulty — the shuffle loop holds |
| Metadata | provenance: "official", variant: "A", track: ["ZA","TZ"] | provenance: "original", variant: "B", track: ["global"] |

## The binding

- Both versions carry the SAME `coreId` — the shared core problem — so analytics, syllabus mapping and the shuffle loop treat them as one logical question with two skins.
- LEGAL GUARDRAIL (refinement flagged to the owner): Version B changes the NUMBERS as well as the wording. Same structure + same numbers + swapped names/currency is a thin-veil derivative; fresh numbers + fresh wording is genuinely original. The verification pipeline recomputes every new key, so nothing breaks.
- Version A additionally requires the attribution line above (free publication ≠ no attribution — best practice and the owner's earlier instruction).

## Processing template (per transcribed official question)

1. Transcribe the official item EXACTLY → Version A (provenance: "official", variant: "A", track: ZA/TZ, attribution set).
2. Identify the CORE (concept, structure, difficulty) → assign coreId.
3. Generate Version B: re-seed numbers and context (currency: R → ₦/$ as the target track requires; names: localised), rewrite wording fully original, recompute the answer, machine-verify, position-shuffle options (provenance: "original", variant: "B", track: global).
4. Both versions enter the pools bound by coreId; papers in ZA/TZ draw A; papers elsewhere draw B.
