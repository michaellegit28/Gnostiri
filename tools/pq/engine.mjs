/**
 * PQ engine — seeded primitives for the two-track authoring pipeline.
 * Everything is deterministic: a family + a seed always reproduces the same
 * questions, so any batch can be re-verified or regenerated bit-for-bit.
 */

/** mulberry32 — small, fast, seedable. Warmed up so nearby seeds (e.g. family
 * indices 1,2,3) do not produce correlated first outputs. */
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < 8; i++) next();
  return next;
}

/** FNV-1a — stable string seed, so a family+slug+hint reproduces anywhere. */
export function seedFrom(...parts) {
  let h = 0x811c9dc5;
  for (const part of parts.join("\u0001")) {
    h ^= part.charCodeAt(0);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function int(r, min, max) {
  return min + Math.floor(r() * (max - min + 1));
}

export function pick(r, items) {
  return items[Math.floor(r() * items.length)];
}

export function shuffled(r, items) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Difficulty ladder — targets the 30/40/30 mix at scale. */
export const DIFFICULTIES = ["easy", "medium", "hard"];

export function difficultyFor(r) {
  const roll = r();
  return roll < 0.3 ? "easy" : roll < 0.7 ? "medium" : "hard";
}
