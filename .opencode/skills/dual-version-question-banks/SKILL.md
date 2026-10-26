---
name: dual-version-question-banks
description: Use when authoring, editing, or auditing multiple-choice questions in content/questions/**, tools/pq/**, or any question-bank JSON — covers the dual-version (coreId A/B) workflow, verifier rules, and reviewStatus requirements. Trigger keywords: MCQ, question bank, JAMB, WAEC, coreId, Version A, Version B, dual version, past questions, integrate-banks.
---

# Dual-version question banks

Every past question exists in TWO versions bound by one `coreId` (owner directive, round 2):

- **Version A — Official**: unedited NSC (Matric, ZA) / NECTA (TZ) text. Rendered ONLY in ZA/TZ tracks. Tagged "Official past question" with DBE/NECTA attribution. Currently 0 of 6,000 JAMB coreIds have Version A — the official transcription queue is lane work.
- **Version B — Cloned variant**: fully rewritten original wording, fresh numbers, local currency skin. Rendered in ALL other tracks (JAMB, WAEC, US, UK). Same concept, structure, difficulty.

## Hard rules

1. **Verifier-first.** Families carry independent verifiers. A wrong key is DROPPED, never shipped. Run the family verifier before any commit; if a key cannot be verified, the question does not go in.
2. **reviewStatus**: every generated row ships as `needs-human-review`. Nothing is ever marked `verified` by an agent.
3. **Hierarchy**: topic mapping encodes the jamb hierarchy (`jamb-{subject}`, `jamb-{subject}-{topic}`). Banks integrate via `tools/pq/integrate-banks.mjs` (v2) — never hand-place rows outside the hierarchy (that bug hid 6,000 questions once).
4. **Audit before claiming done**: `node tools/pq/audit-banks.mjs` — counts, key distribution, per-subject coverage, duplicate stems.
5. Dual-version metadata (coreId/variant/provenance/track) lives JSON-side; `Question` has no columns for it. Do not add schema columns without a migration + seed repair plan.
