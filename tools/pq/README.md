# PQ pipeline — tools for the two-track authoring engine (A4 build partner)

Built for A2's `EXPANSION-PLAN.md` Track A: one concept template x seeded
parameter variations = a family of genuinely distinct, machine-verified
questions. Nothing here authorises content or touches the DB — it only emits
bank JSON in the exact schema already used by the content pipeline.

## Files

| File | Purpose |
|---|---|
| `engine.mjs` | Seeded PRNG (mulberry32, warmed up), FNV seeds, deterministic helpers |
| `locales.mjs` | Currency/name/place skins per track (NG, ZA, TZ, GH, KE, US, UK) + neutral |
| `families.mjs` | Template families. Each carries an **independent verifier** that re-derives the answer from the problem statement |
| `generate.mjs` | Track A generator — emits N verified questions for a family |
| `dual-version.mjs` | Version A (official, verbatim + attribution) + Version B (cloned variant) bound to one `coreId` |
| `validate.mjs` | The gates: structure, key-in-options, coreId pairing, ZA/TZ-only official, A→B leakage, locale markers, answer-position bias, difficulty mix |
| `pq.test.mjs` | 9 regression tests (`node --test tools/pq/pq.test.mjs`) |

## Usage

```bash
# Generate 40 verified questions for the linear-equation family (Naira locale)
node tools/pq/generate.mjs --family linear-two-sided --n 40 --seed 7 --locale NG \
  --out content/questions/linear.ng.json

# Build a dual-version pair (official A slots + generated B, same coreId)
node tools/pq/dual-version.mjs --family rectangle-area-quadratic \
  --locale NG --seed 3 --core-suffix ns1 \
  --official-file content/questions/official.json \
  --out content/questions/ns1.dual.json

# Gate any batch (exits non-zero on failure — wire this into CI)
node tools/pq/validate.mjs content/questions/*.json

# Tests
node --test tools/pq/pq.test.mjs
```

## Current families

| Family | Topic | Verified by |
|---|---|---|
| `linear-two-sided` | algebra-foundations | substituting x back into both sides |
| `rectangle-area-quadratic` | algebra-foundations | w(w + k) = area product |
| `percent-increase-money` | statistics-probability | recomputing base x (1 + p%) |
| `speed-distance-time` | mechanics | recomputing speed x time |
| `ohms-law` | electricity-magnetism | recomputing V / R |
| `mole-mass` | stoichiometry-mole | recomputing m / M |
| `pythagoras-triple` | geometry-trigonometry | a\u00b2 + b\u00b2 = c\u00b2 on exact integer triples |
| `simultaneous-linear-pair` | algebra-foundations | substituting BOTH equations (unique solution enforced) |
| `compound-growth` | statistics-probability | P(1 + r)\u207f with tolerance |

## Guarantees the pipeline enforces

- Every key is re-derived by an **independent** verifier, so a wrong key drops
  the item instead of shipping (constant — "linear-two-sided" must never let
  a === c, or the equation degenerates and every answer verifies).
- Exactly 3 distractors, distinct, never the key.
- Answer positions are shuffled per item; the validator flags any batch where
  >70% of keys sit at one position (the 100% position-A bias the bank audit found).
- Version A may only live on ZA/TZ and must carry attribution; Version B must
  never contain Version A text and carries no attribution at all.
- Version B currency follows the target track (no cross-contamination).
- Determinism: family + seed + index reproduces the identical batch.

## Adding a family

Write the contract above in `families.mjs` (params / answer / stem / distractors /
explanation / hint / **verify**) and add a case to `pq.test.mjs`. The verifier is
the contract with the reader: if it cannot re-derive the answer independently, the
family is not ready to generate.
