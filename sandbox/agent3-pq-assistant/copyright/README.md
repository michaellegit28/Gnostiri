# Agent 3 — Copyright & Attestation Domain

Owns: copyright attestations, attribution metadata, official-past-question source URLs, region-legal tagging.
Bound per `WORK_DIVISION.md:19` — Agent 3 only; does not touch `src/questions.js`, `src/integrator.js`, or `src/boards.js`.

## Files
- `attestations.json` — per-board copyright status, source URLs, risk tier, attribution text, exclusion list
- `region-legal-tags.json` — region → legal tag, official-track eligibility, use conditions

## Handoff to Agent 2
Agent 3 supplies attested official text (SA `sa`, TZ `tz`) → Agent 2 injects into `versions.official` with `provenance: "official"` and `sourceExam` set to the board name.

## Rule
No board enters the `official` provenance track without an Agent 3 attestation. All other boards (NG, GH, KE, …) use the `original` track with board-style generation only.
