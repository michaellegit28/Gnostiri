/**
 * Template families — one CONCEPT x seeded parameters = a family of distinct
 * questions. Every family carries an INDEPENDENT verifier that re-derives the
 * answer from the problem statement, so a generated key can never be
 * hallucinated: if the key is wrong, verification fails and the item is
 * dropped, not shipped.
 *
 * Family contract:
 *   params(r, difficulty)     -> parameter object
 *   answer(p)                 -> the correct option string
 *   stem(p, locale)           -> question text
 *   distractors(p, r)         -> exactly 3 wrong option strings (distinct)
 *   explanation(p, locale)    -> worked solution
 *   hint(p)                   -> nudge
 *   verify(p, chosen)         -> re-derive and compare; boolean
 */

import { int, pick, shuffled } from "./engine.mjs";
import { localeFor } from "./locales.mjs";

/** "solve ax + b = cx + d" — verified by substituting x back into both sides. */
export const linearFamily = {
  id: "linear-two-sided",
  topicSlug: "algebra-foundations",
  label: "Linear equation, variable on both sides",
  params(r, difficulty) {
    const spread = difficulty === "easy" ? [1, 3] : difficulty === "medium" ? [2, 5] : [3, 7];
    const a = int(r, spread[0], spread[1]);
    const x = int(r, difficulty === "hard" ? -9 : 1, 12);
    const b = int(r, -20, 20);
    // c must differ from a, or the equation degenerates (ax+b=ax+...) and every
    // value of x "verifies" — which would make the key unverifiable.
    let c = int(r, 1, spread[1]);
    for (let guard = 0; guard < 20 && c === a; guard++) c = int(r, 1, spread[1]);
    if (c === a) c = a + 1;
    const d = a * x + b - c * x;
    return { a, b: `${b >= 0 ? "+ " + b : "\u2212 " + Math.abs(b)}`, c, d, x };
  },
  answer(p) {
    return String(p.x);
  },
  stem(p, locale) {
    const who = pick(globalThis.__pq_rng, locale.names);
    return `${who} solves the equation ${p.a}x ${p.b} = ${p.c}x ${p.d >= 0 ? "+ " + p.d : "\u2212 " + Math.abs(p.d)}. What is the value of x?`;
  },
  distractors(p, r) {
    const base = p.x;
    const offsets = shuffled(r, [1, 2, -1, -2, 3, 5, -4]).slice(0, 3);
    return offsets.map((o) => String(base + o));
  },
  explanation(p) {
    return `Collect terms: ${p.a}x \u2212 ${p.c}x = ${p.b.includes("+") ? "" : ""}${p.d >= 0 ? "\u2212 " + p.d : "+ " + Math.abs(p.d)} \u2212 ${p.b.replace(/[+\u2212]\s*/, "")} \u00b7 substitute x = ${p.x} to check both sides are equal.`;
  },
  hint: () => "Gather x terms on one side and numbers on the other.",
  verify(p, chosen) {
    const b = Number(p.b.replace(/[+\u2212]\s*/, "")) * (p.b.trim().startsWith("\u2212") ? -1 : 1);
    const dd = Number(p.d);
    const x = Number(chosen);
    const left = p.a * x + b;
    const right = p.c * x + dd;
    return Math.abs(left - right) < 1e-9;
  },
};

/**
 * Rectangular-area word problem leading to a quadratic — the core problem that
 * anchors the NSC/NECTA demo pair. Solved, then verified by substitution into
 * the area product.
 */
export const areaFamily = {
  id: "rectangle-area-quadratic",
  topicSlug: "algebra-foundations",
  label: "Rectangle area as a quadratic word problem",
  params(r, difficulty) {
    const width = int(r, difficulty === "easy" ? 4 : 2, difficulty === "hard" ? 12 : 9);
    const more = int(r, 2, difficulty === "hard" ? 9 : 6);
    const area = width * (width + more);
    return { width, more, area };
  },
  answer(p) {
    return `${p.width} metres`;
  },
  stem(p, locale) {
    const who = pick(globalThis.__pq_rng, locale.names);
    return `${who} lays out a rectangular display. Its length is ${p.more} metres more than its width, and the total area is ${p.area} square metres. What is the width of the display?`;
  },
  distractors(p, r) {
    const key = `${p.width} metres`;
    // Pool of plausible-but-wrong widths. widths can collide (e.g. w+more ===
    // w+2 when more is 2), so dedupe and top up until exactly 3 distinct values.
    const pool = [
      p.width + p.more,
      p.width + 2,
      Math.max(1, p.width - 1),
      p.width + p.more + 1,
      p.width + 1,
      p.width + p.more + 2,
      Math.max(1, p.width - 2),
    ]
      .filter((w) => w > 0 && w !== p.width)
      .map((w) => `${w} metres`);
    const out = [];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (c !== key && !out.includes(c)) out.push(c);
    }
    for (let extra = 1; out.length < 3; extra++) {
      const c = `${p.width + extra} metres`;
      if (c !== key && !out.includes(c)) out.push(c);
    }
    return out;
  },
  explanation(p) {
    return `Let width = w, so length = w + ${p.more}. Area: w(w + ${p.more}) = ${p.area} \u2192 w\u00b2 + ${p.more}w \u2212 ${p.area} = 0 \u2192 (w + ${p.width + p.more})(w \u2212 ${p.width}) = 0 \u2192 w = ${p.width} (a width cannot be negative). Check: ${p.width} \u00d7 ${p.width + p.more} = ${p.area}.`;
  },
  hint: () => "Translate the sentence into length = width + k, then use area = width \u00d7 length.",
  verify(p, chosen) {
    const w = Number(String(chosen).replace(/[^0-9.]/g, ""));
    return w * (w + p.more) === p.area;
  },
};

/** Percentage change on a money amount — currency follows the target locale. */
export const percentFamily = {
  id: "percent-increase-money",
  topicSlug: "statistics-probability",
  label: "Percentage increase on an amount of money",
  params(r, difficulty) {
    const base = int(r, difficulty === "easy" ? 2 : 3, difficulty === "hard" ? 40 : 12) * 100;
    const pct = pick(r, difficulty === "easy" ? [10, 20, 25, 50] : [15, 12, 35, 45, 60, 75]);
    return { base, pct };
  },
  answer(p) {
    return `${Math.round(p.base * (1 + p.pct / 100))}`;
  },
  stem(p, locale) {
    const who = pick(globalThis.__pq_rng, locale.names);
    return `${who} pays ${p.base} ${locale.currencyWord === "units of money" ? "units" : locale.currencyWord} for a school set. The price rises by ${p.pct}%. What is the new price?`;
  },
  distractors(p, r) {
    const key = Math.round(p.base * (1 + p.pct / 100));
    const increase = Math.round((p.base * p.pct) / 100);
    // Deterministic candidate pool, then fill until we hold exactly 3 valid,
    // distinct, non-key values (candidates can collide on small numbers).
    const candidates = [
      increase,
      Math.round(p.base * (1 + p.pct / 200)),
      key + p.base,
      key - increase,
      key + increase,
      Math.round(p.base * (1 - p.pct / 100)),
      key + 2 * increase,
      key - 2 * increase,
    ].filter((v) => v > 0 && v !== key);
    const out = [];
    for (const c of shuffled(r, candidates)) {
      if (out.length === 3) break;
      if (!out.includes(c)) out.push(c);
    }
    for (let extra = 1; out.length < 3; extra++) {
      const v = key + extra * Math.max(1, Math.round(increase / 2) || 1);
      if (v > 0 && v !== key && !out.includes(v)) out.push(v);
    }
    return out.slice(0, 3).map(String);
  },
  explanation(p, locale) {
    return `Increase = ${p.pct}% of ${p.base} = ${Math.round((p.base * p.pct) / 100)}. New price = ${p.base} + ${Math.round((p.base * p.pct) / 100)} = ${Math.round(p.base * (1 + p.pct / 100))} ${locale.currencyWord}.`;
  },
  hint: () => "Find the increase first, then add it to the original amount.",
  verify(p, chosen) {
    return Number(chosen) === Math.round(p.base * (1 + p.pct / 100));
  },
};

export const FAMILIES = [linearFamily, areaFamily, percentFamily];

export function familyById(id) {
  const f = FAMILIES.find((x) => x.id === id);
  if (!f) throw new Error(`unknown family: ${id}`);
  return f;
}
