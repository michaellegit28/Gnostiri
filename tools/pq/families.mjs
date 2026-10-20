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
import { families as mathsFamilies } from "./families-maths.mjs";
import { families as physicsFamilies } from "./families-physics.mjs";
import { families as chemistryFamilies } from "./families-chemistry.mjs";
import { families as biologyFamilies } from "./families-biology.mjs";
import { families as englishFamilies } from "./families-english.mjs";
import { families as economicsFamilies } from "./families-economics.mjs";
import { families as governmentFamilies } from "./families-government.mjs";
import { families as commerceFamilies } from "./families-commerce.mjs";
import { families as accountingFamilies } from "./families-accounting.mjs";
import { families as geographyFamilies } from "./families-geography.mjs";
import { families as agricultureFamilies } from "./families-agriculture.mjs";
import { families as literatureFamilies } from "./families-literature.mjs";
export { recallFamily, parseNum, pool3 } from "./families-support.mjs";

/** "1 metre" not "1 metres" — the area family prints option labels. */
const unit = (n) => (n === 1 ? "metre" : "metres");

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
    return `${p.width} ${unit(p.width)}`;
  },
  stem(p, locale) {
    const who = pick(globalThis.__pq_rng, locale.names);
    return `${who} lays out a rectangular display. Its length is ${p.more} ${unit(p.more)} more than its width, and the total area is ${p.area} square metres. What is the width of the display?`;
  },
  distractors(p, r) {
    const key = `${p.width} ${unit(p.width)}`;
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
      .map((w) => `${w} ${unit(w)}`);
    const out = [];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (c !== key && !out.includes(c)) out.push(c);
    }
    for (let extra = 1; out.length < 3; extra++) {
      const c = `${p.width + extra} ${unit(p.width + extra)}`;
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

/** Distance = speed x time — verified by recomputing the product. */
export const motionFamily = {
  id: "speed-distance-time",
  topicSlug: "mechanics",
  label: "Uniform motion: distance from speed and time",
  params(r, difficulty) {
    const speed = int(r, difficulty === "easy" ? 4 : 5, difficulty === "hard" ? 14 : 9) * 10;
    const time = int(r, difficulty === "easy" ? 2 : 1, difficulty === "hard" ? 6 : 4) * (r() < 0.5 ? 1 : 0.5);
    return { speed, time: time === 0.5 ? "30 minutes" : `${time} hours`, timeHours: time };
  },
  answer(p) {
    return `${p.speed * p.timeHours} km`;
  },
  stem(p, locale) {
    return `A ${pick(globalThis.__pq_rng, ["bus", "lorry", "train", "car"])} leaves ${pick(
      globalThis.__pq_rng,
      locale.places,
    )} travelling at a steady ${p.speed} km/h for ${p.time}. How far does it travel?`;
  },
  distractors(p, r) {
    const key = p.speed * p.timeHours;
    const pool = [
      p.speed + p.timeHours,
      p.speed - p.timeHours,
      Math.round(p.speed * p.timeHours * 1.5),
      Math.max(1, Math.round(p.speed * p.timeHours * 0.5)),
      key + p.speed,
      Math.max(1, key - p.speed),
    ].filter((v) => v > 0 && v !== key);
    const out = [];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (!out.includes(c)) out.push(c);
    }
    for (let extra = 1; out.length < 3; extra++) {
      const v = key + extra * 10;
      if (v > 0 && !out.includes(v)) out.push(v);
    }
    return out.slice(0, 3).map((v) => `${v} km`);
  },
  explanation(p) {
    return `Distance = speed x time = ${p.speed} km/h x ${p.timeHours} h = ${p.speed * p.timeHours} km.`;
  },
  hint: () => "Keep the units consistent: km/h multiplied by hours gives km.",
  verify(p, chosen) {
    const v = Number(String(chosen).replace(/[^0-9.]/g, ""));
    return Math.abs(v - p.speed * p.timeHours) < 1e-9;
  },
};

/** V = IR — verified by dividing the supply voltage by the resistance. */
export const ohmsLawFamily = {
  id: "ohms-law",
  topicSlug: "electricity-magnetism",
  label: "Ohm's law: current from voltage and resistance",
  params(r) {
    const current = int(r, 1, 9);
    const resistance = int(r, 2, 12) * current * 5;
    return { voltage: current * resistance, resistance, current };
  },
  answer(p) {
    return `${p.current} A`;
  },
  stem(p) {
    return `A ${p.voltage} V supply is connected across a ${p.resistance} \u03a9 resistor. What current flows through the circuit?`;
  },
  distractors(p, r) {
    const out = [];
    const pool = [p.current + 1, Math.max(1, p.current - 1), p.current * 2, p.current + 2, Math.max(1, p.current - 2)];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (c > 0 && c !== p.current && !out.includes(c)) out.push(c);
    }
    for (let extra = 1; out.length < 3; extra++) {
      const v = p.current + 2 + extra;
      if (!out.includes(v)) out.push(v);
    }
    return out.slice(0, 3).map((v) => `${v} A`);
  },
  explanation(p) {
    return `Ohm's law: I = V / R = ${p.voltage} V \u00f7 ${p.resistance} \u03a9 = ${p.current} A.`;
  },
  hint: () => "Current = voltage divided by resistance.",
  verify(p, chosen) {
    const v = Number(String(chosen).replace(/[^0-9.]/g, ""));
    return Math.abs(v - p.voltage / p.resistance) < 1e-9;
  },
};

/** n = m / M — verified by dividing mass by molar mass. */
export const moleFamily = {
  id: "mole-mass",
  topicSlug: "stoichiometry-mole",
  label: "Moles from mass and molar mass",
  params(r) {
    const molarMass = pick(r, [24, 32, 40, 56, 64, 100, 18]);
    const moles = int(r, 1, 8);
    return { molarMass, mass: molarMass * moles, moles };
  },
  answer(p) {
    return `${p.moles} mol`;
  },
  stem(p) {
    return `A sample of a compound with molar mass ${p.molarMass} g/mol has a mass of ${p.mass} g. How many moles does the sample contain?`;
  },
  distractors(p, r) {
    const out = [];
    const pool = [p.moles + 1, Math.max(1, p.moles - 1), p.moles * 2, p.moles + 2, Math.max(1, p.moles - 2)];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (c > 0 && c !== p.moles && !out.includes(c)) out.push(c);
    }
    for (let extra = 1; out.length < 3; extra++) {
      const v = p.moles + 2 + extra;
      if (!out.includes(v)) out.push(v);
    }
    return out.slice(0, 3).map((v) => `${v} mol`);
  },
  explanation(p) {
    return `n = m / M = ${p.mass} g \u00f7 ${p.molarMass} g/mol = ${p.moles} mol.`;
  },
  hint: () => "Number of moles = mass divided by molar mass.",
  verify(p, chosen) {
    const v = Number(String(chosen).replace(/[^0-9.]/g, ""));
    return Math.abs(v - p.mass / p.molarMass) < 1e-9;
  },
};

/**
 * Pythagorean triples — built from exact integer triples so verification is
 * integer arithmetic, never floating point.
 */
export const pythagorasFamily = {
  id: "pythagoras-triple",
  topicSlug: "geometry-trigonometry",
  label: "Right-triangle side from an integer Pythagorean triple",
  params(r) {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 40, 41]];
    const [a, b, c] = pick(r, triples);
    const k = int(r, 1, 4);
    return { a: a * k, b: b * k, c: c * k };
  },
  answer(p) {
    return `${p.c} units`;
  },
  stem(p) {
    return `A right-angled triangle has the two shorter sides measuring ${p.a} units and ${p.b} units. What is the length of the hypotenuse?`;
  },
  distractors(p, r) {
    const out = [];
    const pool = [
      `${p.a + p.b} units`,
      `${p.c + 1} units`,
      `${Math.max(1, p.c - 1)} units`,
      `${p.a + p.b + 1} units`,
      `${p.b} units`,
      `${p.c + 2} units`,
    ];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (c !== `${p.c} units` && !out.includes(c)) out.push(c);
    }
    return out;
  },
  explanation(p) {
    return `Hypotenuse\u00b2 = ${p.a}\u00b2 + ${p.b}\u00b2 = ${p.a * p.a} + ${p.b * p.b} = ${p.c * p.c}, so the hypotenuse is ${p.c} units.`;
  },
  hint: () => "Square both shorter sides, add, then take the square root.",
  verify(p, chosen) {
    const v = Number(String(chosen).replace(/[^0-9]/g, ""));
    return v * v === p.a * p.a + p.b * p.b;
  },
};

/** Two linear equations, unique solution — verified by substituting BOTH. */
export const simultaneousFamily = {
  id: "simultaneous-linear-pair",
  topicSlug: "algebra-foundations",
  label: "Simultaneous linear equations",
  params(r, difficulty) {
    const x = int(r, 1, difficulty === "hard" ? 15 : 9);
    const y = int(r, 1, difficulty === "hard" ? 15 : 9);
    let a1 = int(r, 1, 5);
    let b1 = int(r, 1, 5);
    let a2 = int(r, 1, 5);
    let b2 = int(r, 1, 5);
    // Unique solution requires a non-zero determinant.
    for (let guard = 0; guard < 30 && a1 * b2 - a2 * b1 === 0; guard++) {
      a2 = int(r, 1, 5);
      b2 = int(r, 1, 5);
    }
    if (a1 * b2 - a2 * b1 === 0) b2 = b1 + 1;
    return { a1, b1, c1: a1 * x + b1 * y, a2, b2, c2: a2 * x + b2 * y, x, y };
  },
  answer(p) {
    return `x = ${p.x}, y = ${p.y}`;
  },
  stem(p) {
    return `Solve the simultaneous equations: ${p.a1}x + ${p.b1}y = ${p.c1} and ${p.a2}x + ${p.b2}y = ${p.c2}.`;
  },
  distractors(p, r) {
    const key = `x = ${p.x}, y = ${p.y}`;
    const out = [];
    const pool = [
      `x = ${p.y}, y = ${p.x}`,
      `x = ${p.x + 1}, y = ${p.y}`,
      `x = ${p.x}, y = ${p.y + 1}`,
      `x = ${p.x + p.y}, y = ${p.x}`,
      `x = ${Math.max(1, p.x - 1)}, y = ${p.y}`,
      `x = ${p.x}, y = ${Math.max(1, p.y - 1)}`,
    ];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (c !== key && !out.includes(c)) out.push(c);
    }
    // Top up deterministically if the pool collapsed (small x/y values can).
    for (let extra = 1; out.length < 3; extra++) {
      const c = `x = ${p.x + extra}, y = ${p.y}`;
      if (c !== key && !out.includes(c)) out.push(c);
    }
    return out;
  },
  explanation(p) {
    return `Elimination or substitution gives x = ${p.x} and y = ${p.y}. Check both: ${p.a1}(${p.x}) + ${p.b1}(${p.y}) = ${p.c1} and ${p.a2}(${p.x}) + ${p.b2}(${p.y}) = ${p.c2}.`;
  },
  hint: () => "Make one variable match, subtract the equations, then back-substitute.",
  verify(p, chosen) {
    const nums = String(chosen).match(/-?\d+/g) ?? [];
    if (nums.length < 2) return false;
    const x = Number(nums[0]);
    const y = Number(nums[1]);
    return p.a1 * x + p.b1 * y === p.c1 && p.a2 * x + p.b2 * y === p.c2;
  },
};

/** Compound growth — verified with a tolerance against the power formula. */
export const compoundInterestFamily = {
  id: "compound-growth",
  topicSlug: "statistics-probability",
  label: "Compound growth on an investment",
  params(r) {
    const principal = int(r, 2, 20) * 500;
    const rate = pick(r, [5, 10, 20, 4, 8]);
    const years = int(r, 2, 5);
    return { principal, rate, years };
  },
  answer(p) {
    return `${Math.round(p.principal * Math.pow(1 + p.rate / 100, p.years))}`;
  },
  stem(p, locale) {
    return `${pick(globalThis.__pq_rng, locale.names)} invests ${p.principal} at ${p.rate}% compound interest per year. What is the value after ${p.years} years? (nearest whole unit)`;
  },
  distractors(p, r) {
    const key = Math.round(p.principal * Math.pow(1 + p.rate / 100, p.years));
    const simple = Math.round(p.principal * (1 + (p.rate / 100) * p.years));
    const pool = [simple, key + p.principal, Math.round(key * 1.1), Math.max(1, key - p.principal)];
    const out = [];
    for (const c of shuffled(r, pool)) {
      if (out.length === 3) break;
      if (c > 0 && c !== key && !out.includes(c)) out.push(c);
    }
    for (let extra = 1; out.length < 3; extra++) {
      const v = key + extra * 100;
      if (v !== key && !out.includes(v)) out.push(v);
    }
    return out.slice(0, 3).map(String);
  },
  explanation(p) {
    return `A = P(1 + r)^n = ${p.principal}(1 + ${p.rate / 100})^${p.years} = ${Math.round(
      p.principal * Math.pow(1 + p.rate / 100, p.years),
    )} (rounded).`;
  },
  hint: () => "Compound interest multiplies the amount by (1 + rate) each year — it is not linear.",
  verify(p, chosen) {
    const v = Number(String(chosen).replace(/[^0-9.]/g, ""));
    const exact = p.principal * Math.pow(1 + p.rate / 100, p.years);
    return Math.abs(v - exact) <= 0.5;
  },
};

export const FAMILIES = [
  linearFamily,
  areaFamily,
  percentFamily,
  motionFamily,
  ohmsLawFamily,
  moleFamily,
  pythagorasFamily,
  simultaneousFamily,
  compoundInterestFamily,
  ...mathsFamilies,
  ...physicsFamilies,
  ...chemistryFamilies,
  ...biologyFamilies,
  ...englishFamilies,
  ...economicsFamilies,
  ...governmentFamilies,
  ...commerceFamilies,
  ...accountingFamilies,
  ...geographyFamilies,
  ...agricultureFamilies,
  ...literatureFamilies,
];

export function familyById(id) {
  const f = FAMILIES.find((x) => x.id === id);
  if (!f) throw new Error(`unknown family: ${id}`);
  return f;
}
