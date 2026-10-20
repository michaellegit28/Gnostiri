/**
 * Shared family helpers — kept in its own module so family modules never import
 * the registry (families.mjs) itself (that would be a cycle).
 */

/** Pull the numeric value out of an option string ("0.25 s" -> 0.25). */
export const parseNum = (s) => Number(String(s).replace(/[^0-9.\-]/g, ""));

/** Deterministic distractor builder: a pool of plausible wrong values, topped
 * up with tie-spaced offsets if the pool collides (small numbers can). */
export function pool3(r, key, pool, fmt) {
  const keyStr = fmt ? fmt(key) : String(key);
  const out = [];
  for (const c of shuffled_(r, pool.filter((v) => Number.isFinite(v) && v > 0))) {
    if (out.length === 3) break;
    const s = fmt ? fmt(c) : String(c);
    if (s !== keyStr && !out.includes(s)) out.push(s);
  }
  for (let e = 1; out.length < 3; e++) {
    const step = Math.max(1, Math.round(Math.abs(key) / 3) || 1);
    const c = key + e * step;
    const s = fmt ? fmt(c) : String(c);
    if (s !== keyStr && !out.includes(s)) out.push(s);
  }
  return out.slice(0, 3);
}

function shuffled_(r, items) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Recall family factory — curated knowledge tables (non-computational
 * subjects: biology facts, English lexis, government, literature...).
 *
 * A recall item cannot re-derive its answer arithmetically the way a
 * computational family does, so the independent check is a SECOND, separately
 * authored answer copy (proofKey): the generator only ever sees `key` while the
 * verifier compares against `proofKey`. A disagreement drops the item — an
 * inconsistent or hallucinated key can never ship. Structural guarantees
 * (exactly 3 distinct distractors, never the key, non-empty explanation) are
 * enforced at family-build time, not at generation time.
 *
 * rows: [stemText, key, [distractor, distractor, distractor], explanation, proofKey]
 */
export function recallFamily({ id, topicSlug, label, hint, rows }) {
  const built = [];
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 5) continue;
    const [stemText, key, ds, expl, proofKey] = row;
    const distractors = [...new Set(ds ?? [])];
    if (typeof stemText !== "string" || !stemText.trim()) continue;
    if (typeof key !== "string" || !key.trim()) continue;
    if (typeof expl !== "string" || !expl.trim()) continue;
    if (distractors.length !== 3 || distractors.includes(key)) continue;
    built.push({ stemText, key, distractors, expl, proofKey });
  }
  return {
    id,
    topicSlug,
    label,
    kind: "recall",
    rowCount: built.length,
    params(r) {
      return { row: pick_(r, built) };
    },
    answer(p) {
      return p.row.key;
    },
    stem(p) {
      return p.row.stemText;
    },
    distractors(p) {
      return p.row.distractors;
    },
    explanation(p) {
      return p.row.expl;
    },
    hint: () => hint ?? "",
    verify(p, chosen) {
      // Independent re-derivation: the answer must match the separately
      // authored proof copy, and must never be one of the distractors.
      return chosen === p.row.proofKey && !p.row.distractors.includes(chosen);
    },
  };
}

function pick_(r, items) {
  return items[Math.floor(r() * items.length)];
}
