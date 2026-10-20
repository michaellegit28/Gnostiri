/**
 * Chemistry families (round 2, JAMB pool).
 * Every key is re-derived from the formula/reacting amounts — the verifier
 * recomputes the chemistry; it never re-reads a stored answer.
 */

import { int, pick, shuffled } from "./engine.mjs";
import { parseNum, pool3 } from "./families-physics.mjs";

/** Canonical K/L/M configuration for proton numbers up to 20. */
function canonicalConfig(z) {
  if (z <= 18) return [2, 8, z - 10];
  return [2, 8, 8, z - 18];
}

/** Reduce percentage composition by relative atomic masses to atom counts.
 * Finds the smallest integer multiplier that makes every scaled ratio an
 * integer (robust to the float noise in percentage data). */
export function reduceEmpirical(pcts, ars) {
  const raw = pcts.map((p, i) => p / ars[i]);
  const min = Math.min(...raw);
  const scaled = raw.map((v) => v / min);
  for (let k = 1; k <= 12; k++) {
    const vals = scaled.map((v) => v * k);
    if (vals.every((v) => Math.abs(v - Math.round(v)) < 0.01)) return vals.map((v) => Math.round(v));
  }
  return scaled.map((v) => Math.round(v));
}

/** Parse "CH2O" -> { C: 1, H: 2, O: 1 } */
export function parseFormula(f) {
  const out = {};
  for (const m of String(f).matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    out[m[1]] = (out[m[1]] ?? 0) + (m[2] ? Number(m[2]) : 1);
  }
  return out;
}

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

export const families = [
  {
    id: "mass-from-moles",
    topicSlug: "stoichiometry-mole",
    label: "Mass from moles: m = nM",
    params(r) {
      const m = pick(r, [18, 24, 32, 40, 56, 64, 100, 120]);
      const n = int(r, 1, 8);
      return { m, n, mass: m * n };
    },
    answer: (p) => `${p.mass} g`,
    stem(p) {
      return `What is the mass of ${p.n} moles of a compound of molar mass ${p.m} g/mol?`;
    },
    distractors(p, r) {
      return pool3(r, p.mass, [p.n, p.m + p.n, p.mass * 2, Math.round(p.mass / 2), p.mass + p.m], String).map((v) => `${v} g`);
    },
    explanation(p) {
      return `m = nM = ${p.n} x ${p.m} = ${p.mass} g. Quote the relative MASS as the answer means the mole count was confused with the mass.`;
    },
    hint: () => "Mass = moles x molar mass.",
    verify(p, chosen) {
      return parseNum(chosen) === p.m * p.n;
    },
  },
  {
    id: "moles-from-gas-volume",
    topicSlug: "stoichiometry-mole",
    label: "Moles from gas volume at STP: n = V/22.4",
    params(r) {
      const n = int(r, 1, 8);
      return { n, v: 22.4 * n };
    },
    answer: (p) => `${p.n} mol`,
    stem(p) {
      return `A gas occupies ${trim(p.v, 1)} dm³ at s.t.p. How many moles of gas are present? (molar volume = 22.4 dm³/mol)`;
    },
    distractors(p, r) {
      return pool3(r, p.n, [p.v, p.n * 2, p.v / 2, p.n + 1, Math.round(p.v / 24)], String).map((v) => `${v} mol`);
    },
    explanation(p) {
      return `n = V/22.4 = ${trim(p.v, 1)}/22.4 = ${p.n} mol. Quoting the volume as a mole count is the classic slip.`;
    },
    hint: () => "Divide the volume by the molar gas volume.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.v / 22.4) < 1e-9;
    },
  },
  {
    id: "volume-from-moles",
    topicSlug: "stoichiometry-mole",
    label: "Gas volume from moles at STP: V = 22.4n",
    params(r) {
      const n = int(r, 1, 8);
      return { n, v: 22.4 * n };
    },
    answer: (p) => `${trim(p.v, 1)} dm³`,
    stem(p) {
      return `What volume does ${p.n} mol of a gas occupy at s.t.p.? (molar volume = 22.4 dm³/mol)`;
    },
    distractors(p, r) {
      return pool3(r, p.v, [p.n * 24, p.v * 2, Math.round(p.v / 2), p.n, 22.4 * (p.n + 1)], (v) => `${trim(v, 1)} dm³`);
    },
    explanation(p) {
      return `V = 22.4n = 22.4 x ${p.n} = ${trim(p.v, 1)} dm³. Using 24 dm³/mol is the rounded-molar-volume trap.`;
    },
    hint: () => "Multiply the moles by the molar gas volume.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - 22.4 * p.n) < 1e-9;
    },
  },
  {
    id: "molar-concentration",
    topicSlug: "stoichiometry-mole",
    label: "Molar concentration: C = n/V",
    params(r) {
      const n = int(r, 1, 6);
      const v = pick(r, [0.5, 1, 2, 2.5, 4, 5]);
      return { n, v, c: n / v };
    },
    answer: (p) => `${trim(p.c, 2)} mol/dm³`,
    stem(p) {
      return `${p.n} mol of solute is dissolved in ${trim(p.v, 1)} dm³ of solution. What is the concentration?`;
    },
    distractors(p, r) {
      return pool3(r, p.c, [p.n * p.v, p.n + p.v, p.c * 2, p.c / 2, p.v / p.n], (v) => `${trim(v, 2)} mol/dm³`);
    },
    explanation(p) {
      return `C = n/V = ${p.n}/${trim(p.v, 1)} = ${trim(p.c, 2)} mol/dm³. Multiplying instead of dividing gives mol dm3, not a concentration.`;
    },
    hint: () => "Concentration = moles divided by volume in dm³.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.n / p.v) < 5e-3;
    },
  },
  {
    id: "titration-moles",
    topicSlug: "stoichiometry-mole",
    label: "Titration: n = CV",
    params(r) {
      const c = pick(r, [0.5, 1, 2]);
      const v = pick(r, [0.5, 1, 1.5, 2]);
      return { c, v, n: c * v };
    },
    answer: (p) => `${trim(p.n, 2)} mol`,
    stem(p) {
      return `A ${trim(p.c, 1)} mol/dm³ base of volume ${trim(p.v, 1)} dm³ neutralises an acid. How many moles of base were used?`;
    },
    distractors(p, r) {
      return pool3(r, p.n, [p.c + p.v, p.n * 2, Math.round(p.n / 2 * 100) / 100, p.v / p.c, p.c * p.v * 10], (v) => `${trim(v, 2)} mol`);
    },
    explanation(p) {
      return `n = CV = ${trim(p.c, 1)} x ${trim(p.v, 1)} = ${trim(p.n, 2)} mol. Volumes in titrations must be in dm³ — using cm³ inflates the answer by 1000.`;
    },
    hint: () => "Moles = concentration x volume; convert cm³ to dm³ first.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.c * p.v) < 5e-3;
    },
  },
  {
    id: "dilution-molarity",
    topicSlug: "stoichiometry-mole",
    label: "Dilution: M1V1 = M2V2",
    params(r) {
      const m1 = pick(r, [1, 2, 4]);
      const v1 = pick(r, [0.25, 0.5, 1]);
      const m2 = pick(r, [0.1, 0.25, 0.5]);
      return { m1, v1, m2, v2: (m1 * v1) / m2 };
    },
    answer: (p) => `${trim(p.v2, 2)} dm³`,
    stem(p) {
      return `${trim(p.v1, 2)} dm³ of a ${trim(p.m1, 1)} mol/dm³ acid is diluted to ${trim(p.m2, 1)} mol/dm³. What is the final volume?`;
    },
    distractors(p, r) {
      return pool3(r, p.v2, [(p.v1 * p.m2) / p.m1, p.v2 * 2, Math.round((p.v2 / 2) * 100) / 100, p.m1 * p.v1 * p.m2, p.v1 - p.m2], (v) => `${trim(v, 2)} dm³`);
    },
    explanation(p) {
      return `Moles are conserved: M1V1 = M2V2 so V2 = ${trim(p.m1, 1)} x ${trim(p.v1, 2)}/${trim(p.m2, 1)} = ${trim(p.v2, 2)} dm³. Inverting the ratio shrinks instead of grows the volume.`;
    },
    hint: () => "Dilution conserves moles: the moles before equal the moles after.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.m1 * p.v1) / p.m2) < 5e-3;
    },
  },
  {
    id: "percent-composition",
    topicSlug: "stoichiometry-mole",
    label: "Percentage composition of a compound",
    params(r) {
      const compounds = [
        { name: "water", mr: 18, parts: [["H", 1, 2], ["O", 16, 1]] },
        { name: "carbon dioxide", mr: 44, parts: [["C", 12, 1], ["O", 16, 2]] },
        { name: "ammonia", mr: 17, parts: [["N", 14, 1], ["H", 1, 3]] },
        { name: "calcium carbonate", mr: 100, parts: [["Ca", 40, 1], ["C", 12, 1], ["O", 16, 3]] },
        { name: "sodium chloride", mr: 58.5, parts: [["Na", 23, 1], ["Cl", 35.5, 1]] },
        { name: "magnesium oxide", mr: 40, parts: [["Mg", 24, 1], ["O", 16, 1]] },
        { name: "iron(III) oxide", mr: 160, parts: [["Fe", 56, 2], ["O", 16, 3]] },
      ];
      const c = pick(r, compounds);
      const part = pick(r, c.parts);
      return { c, part, pct: (100 * part[1] * part[2]) / c.mr };
    },
    answer: (p) => `${trim(p.pct, 1)}%`,
    stem(p) {
      return `What is the percentage by mass of ${p.part[0]} in ${p.c.name}? (${p.c.name.split(" ").map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1) : w)).join(" ")}, Mr = ${p.c.mr})`;
    },
    distractors(p, r) {
      const base = p.pct;
      return pool3(r, base, [100 - base, (100 * p.part[1]) / p.c.mr, base * 2, Math.max(1, base - 10), Math.min(99, base + 12)], String).map((v) => `${v}%`);
    },
    explanation(p) {
      return `% ${p.part[0]} = (${p.part[1]} x ${p.part[2]})/${p.c.mr} x 100 = ${trim(p.pct, 1)}%. Taking the complement (100 − %${p.part[0]}) answers for the OTHER elements.`;
    },
    hint: () => "Mass fraction of an element = (atoms x Ar) / Mr, as a percentage.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (100 * p.part[1] * p.part[2]) / p.c.mr) < 0.06;
    },
  },
  {
    id: "empirical-formula",
    topicSlug: "stoichiometry-mole",
    label: "Empirical formula from percentage composition",
    params(r) {
      const rows = [
        { pcts: [40.0, 6.67, 53.33], els: ["C", "H", "O"], ars: [12, 1, 16], formula: "CH2O" },
        { pcts: [11.11, 88.89], els: ["H", "O"], ars: [1, 16], formula: "H2O" },
        { pcts: [27.27, 72.73], els: ["C", "O"], ars: [12, 16], formula: "CO2" },
        { pcts: [75.0, 25.0], els: ["C", "H"], ars: [12, 1], formula: "CH4" },
        { pcts: [54.55, 9.09, 36.36], els: ["C", "H", "O"], ars: [12, 1, 16], formula: "C2H4O" },
        { pcts: [52.17, 13.04, 34.78], els: ["C", "H", "O"], ars: [12, 1, 16], formula: "C2H6O" },
        { pcts: [82.35, 17.65], els: ["N", "H"], ars: [14, 1], formula: "NH3" },
        { pcts: [50.0, 50.0], els: ["S", "O"], ars: [32, 16], formula: "SO2" },
        { pcts: [40.0, 60.0], els: ["S", "O"], ars: [32, 16], formula: "SO3" },
        { pcts: [70.0, 30.0], els: ["Fe", "O"], ars: [56, 16], formula: "Fe2O3" },
        { pcts: [40.0, 12.0, 48.0], els: ["Ca", "C", "O"], ars: [40, 12, 16], formula: "CaCO3" },
        { pcts: [39.32, 60.68], els: ["Na", "Cl"], ars: [23, 35.5], formula: "NaCl" },
        { pcts: [52.94, 47.06], els: ["Al", "O"], ars: [27, 16], formula: "Al2O3" },
        { pcts: [43.66, 56.34], els: ["P", "O"], ars: [31, 16], formula: "P2O5" },
        { pcts: [5.88, 94.12], els: ["H", "O"], ars: [1, 16], formula: "HO" },
        { pcts: [63.64, 36.36], els: ["N", "O"], ars: [14, 16], formula: "N2O" },
      ];
      const row = pick(r, rows);
      return row;
    },
    answer: (p) => p.formula,
    stem(p) {
      return `A compound contains ${p.els.map((e, i) => `${p.pcts[i]}% ${e}`).join(", ")} by mass. What is its empirical formula?`;
    },
    distractors(p, r) {
      const want = reduceEmpirical(p.pcts, p.ars);
      const same = (f) => JSON.stringify(Object.entries(parseFormula(f)).sort()) === JSON.stringify(Object.entries(parseFormula(p.formula)).sort());
      const over = p.els.map((e, i) => `${e}${want[i] * 2}`).join("");
      const half = p.els.map((e, i) => `${e}${Math.max(1, Math.round(want[i] / 2))}`).join("");
      const double = p.els.map((e, i) => `${e}${want[i] + 2}`).join("");
      const gross = p.els.map((e) => e).join("");
      const reversed = [...p.els].reverse().map((e, i) => `${e}${want[i]}`).join("");
      const candidates = [over, half, double, gross, reversed, `${p.formula}2`];
      const pool = candidates.filter((c) => c !== p.formula && !same(c));
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (!out.includes(c)) out.push(c);
      }
      // Deterministic top-up: perturb one element's count.
      for (let e = 1; out.length < 3 && e < 20; e++) {
        const idx = out.length % p.els.length;
        const c = p.els.map((el, i) => `${el}${i === idx ? want[i] + e : want[i]}`).join("");
        if (c !== p.formula && !same(c) && !out.includes(c)) out.push(c);
      }
      return out.slice(0, 3);
    },
    explanation(p) {
      const ratio = reduceEmpirical(p.pcts, p.ars);
      return `Divide each percentage by its Ar: ${p.els
        .map((e, i) => `${p.pcts[i]}/${p.ars[i]}`)
        .join(", ")} -> ratio ${ratio.join(":")} -> ${p.formula}. The answer must be the SIMPLEST whole-number ratio.`;
    },
    hint: () => "Percent / Ar, then divide by the smallest value.",
    verify(p, chosen) {
      const got = parseFormula(chosen);
      const want = reduceEmpirical(p.pcts, p.ars);
      const els = Object.keys(got);
      if (els.length !== want.length) return false;
      return p.els.every((e, i) => got[e] === want[i]) && want.reduce((a, b) => a + b, 0) > 1;
    },
  },
  {
    id: "limiting-reagent",
    topicSlug: "stoichiometry-mole",
    label: "Limiting reagent from moles and coefficients",
    params(r) {
      const rows = [
        { name: "H2", amount: 2, coef: 2, other: "O2", amountOther: 4, coefOther: 1, eq: "2H2 + O2 → 2H2O" },
        { name: "O2", amount: 1, coef: 1, other: "H2", amountOther: 1, coefOther: 2, eq: "2H2 + O2 → 2H2O" },
        { name: "H2", amount: 1, coef: 1, other: "Cl2", amountOther: 2, coefOther: 1, eq: "H2 + Cl2 → 2HCl" },
        { name: "N2", amount: 2, coef: 1, other: "H2", amountOther: 6, coefOther: 3, eq: "N2 + 3H2 → 2NH3" },
        { name: "C", amount: 1, coef: 1, other: "O2", amountOther: 0.8, coefOther: 1, eq: "C + O2 → CO2" },
        { name: "O2", amount: 0.5, coef: 3, other: "Fe", amountOther: 1, coefOther: 4, eq: "4Fe + 3O2 → 2Fe2O3" },
        { name: "HCl", amount: 0.8, coef: 2, other: "CaCO3", amountOther: 0.5, coefOther: 1, eq: "CaCO3 + 2HCl → CaCl2 + H2O + CO2" },
        { name: "Zn", amount: 0.2, coef: 1, other: "HCl", amountOther: 1, coefOther: 2, eq: "Zn + 2HCl → ZnCl2 + H2" },
        { name: "HCl", amount: 0.6, coef: 2, other: "NaOH", amountOther: 1, coefOther: 1, eq: "HCl + NaOH → NaCl + H2O" },
      ];
      let row = pick(r, rows);
      for (let g = 0; g < 60 && !(row.amount / row.coef < row.amountOther / row.coefOther); g++) row = pick(r, rows);
      return row;
    },
    answer: (p) => p.name,
    stem(p) {
      return `For the reaction ${p.eq}, ${p.amount} mol of ${p.name} is mixed with ${p.amountOther} mol of ${p.other}. Which reactant is the limiting reagent?`;
    },
    distractors(p, r) {
      const pool = [p.other, "both reactants run out together", "the product is the limiting reagent", "neither reactant is consumed"];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== p.name && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) {
        const c = `${p.other} (in excess by ${e} mol)`;
        if (c !== p.name && !out.includes(c)) out.push(c);
      }
      return out.slice(0, 3);
    },
    explanation(p) {
      const ra = p.amount / p.coef;
      const rb = p.amountOther / p.coefOther;
      return `Dividing by the coefficient: ${p.name} gives ${trim(ra, 2)}, ${p.other} gives ${trim(rb, 2)}. The SMALLER quotient runs out first, so ${p.name} limits the reaction (${p.other} is in excess).`;
    },
    hint: () => "Moles divided by coefficient — the smaller quotient limits.",
    verify(p, chosen) {
      if (chosen !== p.name) return false;
      const ra = p.amount / p.coef;
      const rb = p.amountOther / p.coefOther;
      return ra !== rb && ra < rb;
    },
  },
  {
    id: "percentage-yield",
    topicSlug: "stoichiometry-mole",
    label: "Percentage yield: actual/theoretical x 100",
    params(r) {
      const theoretical = pick(r, [10, 20, 25, 40, 50, 80, 100]);
      const pct = pick(r, [80, 90, 75, 60, 45, 25, 50, 96]);
      return { theoretical, actual: (theoretical * pct) / 100, pct };
    },
    answer: (p) => `${p.pct}%`,
    stem(p) {
      return `A reaction with a theoretical yield of ${p.theoretical} g actually produces ${trim(p.actual, 2)} g. What is the percentage yield?`;
    },
    distractors(p, r) {
      return pool3(r, p.pct, [100 - p.pct, (100 * p.theoretical) / p.actual, p.pct * 2, Math.max(1, p.pct - 10), Math.min(200, p.pct + 15)], String).map((v) => `${v}%`);
    },
    explanation(p) {
      return `% yield = actual/theoretical x 100 = ${trim(p.actual, 2)}/${p.theoretical} x 100 = ${p.pct}%. The complement (100 − yield) is the loss fraction, not the yield.`;
    },
    hint: () => "Percentage yield = (actual mass / theoretical mass) x 100.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (100 * p.actual) / p.theoretical) < 0.01;
    },
  },
  {
    id: "ph-from-h-plus",
    topicSlug: "thermodynamics-kinetics",
    label: "pH from hydrogen-ion concentration",
    params(r) {
      const k = int(r, 2, 11);
      return { k, h: Math.pow(10, -k) };
    },
    answer: (p) => `${p.k}`,
    stem(p) {
      return `What is the pH of a solution containing 1.0 x 10^-${p.k} mol/dm³ of hydrogen ions?`;
    },
    distractors(p, r) {
      return pool3(r, p.k, [14 - p.k, p.k + 1, Math.max(0, p.k - 1), p.k * 2, p.k + 2], String);
    },
    explanation(p) {
      return `pH = -log10[H+] = -log10(10^-${p.k}) = ${p.k}. (14 - pH) is the pOH, not the pH; pH + 1 means a tenth of the concentration.`;
    },
    hint: () => "pH = -log10 of the hydrogen-ion concentration.",
    verify(p, chosen) {
      return Math.abs(Math.pow(10, -parseNum(chosen)) - p.h) < 1e-12 && parseNum(chosen) === p.k;
    },
  },
  {
    id: "neutralisation-enthalpy",
    topicSlug: "thermodynamics-kinetics",
    label: "Calorimetry: Q = mc dT",
    params(r) {
      const m = int(r, 2, 6) * 50; // grams
      const dT = int(r, 5, 40);
      return { m, dT, q: 4.2 * m * dT };
    },
    answer: (p) => `${p.q} J`,
    stem(p) {
      return `${p.m} g of solution is warmed by ${p.dT} °C in a reaction. How much heat was released? (c = 4.2 J/g/°C)`;
    },
    distractors(p, r) {
      return pool3(r, p.q, [p.m * p.dT, (4.2 * p.m) / p.dT || 1, p.q * 2, Math.round(p.q / 2), 4.2 * p.dT], String).map((v) => `${v} J`);
    },
    explanation(p) {
      return `Q = mc dT = ${p.m} x 4.2 x ${p.dT} = ${p.q} J. Dropping c treats mass alone as heat; the temperature RISE (not the total) drives the sign of dT.`;
    },
    hint: () => "Heat = mass x specific heat capacity x temperature change.",
    verify(p, chosen) {
      return parseNum(chosen) === 4.2 * p.m * p.dT;
    },
  },
  {
    id: "faraday-electrolysis",
    topicSlug: "electrochemistry",
    label: "Faraday's law: Q = mnF/M",
    params(r) {
      const ions = [
        { name: "silver", symbol: "Ag", M: 108, charge: 1 },
        { name: "copper", symbol: "Cu", M: 64, charge: 2 },
        { name: "aluminium", symbol: "Al", M: 27, charge: 3 },
        { name: "zinc", symbol: "Zn", M: 65, charge: 2 },
        { name: "iron", symbol: "Fe", M: 56, charge: 3 },
      ];
      let ion = pick(r, ions);
      let k = int(r, 1, 4);
      let mass = (ion.M * k) / ion.charge;
      for (let g = 0; g < 30 && !Number.isInteger(mass); g++) {
        k = int(r, 1, 4);
        mass = (ion.M * k) / ion.charge;
      }
      if (!Number.isInteger(mass)) {
        k = ion.charge;
        mass = ion.M * 1;
      }
      return { ion, k, mass, q: k * 96500 };
    },
    answer: (p) => `${p.q} C`,
    stem(p) {
      return `What charge is required to deposit ${p.mass} g of ${p.ion.name} from a solution of ${p.ion.symbol} ions? (${p.ion.symbol}^${p.ion.charge}+ + ${p.ion.charge}e- -> ${p.ion.symbol}; M = ${p.ion.M}; F = 96500 C/mol)`;
    },
    distractors(p, r) {
      return pool3(r, p.q, [p.q * 2, Math.round(p.q / 2), p.q + 96500, p.ion.M * 1000, p.mass * 1000], String).map((v) => `${v} C`);
    },
    explanation(p) {
      return `Q = m x n x F / M = ${p.mass} x ${p.ion.charge} x 96500 / ${p.ion.M} = ${p.q} C. Forgetting the ion charge (dividing or multiplying wrongly) scales the charge off by ${p.ion.charge}.`;
    },
    hint: () => "Charge = mass x ion charge x Faraday constant / molar mass.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.mass * p.ion.charge * 96500) / p.ion.M) < 1;
    },
  },
  {
    id: "oxidation-state",
    topicSlug: "electrochemistry",
    label: "Oxidation number from the charge balance",
    params(r) {
      const rows = [
        { name: "chromium", el: "Cr", count: 2, others: [["K", 1, 2], ["O", -2, 7]], x: 6 },
        { name: "manganese", el: "Mn", count: 1, others: [["K", 1, 1], ["O", -2, 4]], x: 7 },
        { name: "manganese", el: "Mn", count: 1, others: [["O", -2, 2]], x: 4 },
        { name: "sulphur", el: "S", count: 1, others: [["H", 1, 2], ["O", -2, 4]], x: 6 },
        { name: "sulphur", el: "S", count: 1, others: [["O", -2, 2]], x: 4 },
        { name: "nitrogen", el: "N", count: 1, others: [["H", 1, 1], ["O", -2, 3]], x: 5 },
        { name: "nitrogen", el: "N", count: 1, others: [["H", 1, 3]], x: -3 },
        { name: "phosphorus", el: "P", count: 1, others: [["H", 1, 3], ["O", -2, 4]], x: 5 },
        { name: "carbon", el: "C", count: 1, others: [["O", -2, 2]], x: 4 },
        { name: "carbon", el: "C", count: 1, others: [["H", 1, 4]], x: -4 },
        { name: "chlorine", el: "Cl", count: 1, others: [["K", 1, 1], ["O", -2, 3]], x: 5 },
        { name: "iron", el: "Fe", count: 2, others: [["O", -2, 3]], x: 3 },
        { name: "iron", el: "Fe", count: 1, others: [["Cl", -1, 3]], x: 3 },
        { name: "copper", el: "Cu", count: 1, others: [["O", -2, 4], ["S", 6, 1]], x: 2 },
      ];
      return pick(r, rows);
    },
    answer: (p) => `${p.x > 0 ? "+" : ""}${p.x}`,
    stem(p) {
      const others = p.others.map(([e, ox, n]) => `${e === "O" ? "oxygen" : e === "H" ? "hydrogen" : e === "Cl" ? "chlorine" : e === "K" ? "potassium" : e === "S" ? "sulphur" : e} is ${ox > 0 ? "+" : ""}${ox}`).join(", ");
      return `In a neutral compound where ${others}, what is the oxidation number of ${p.name}?`;
    },
    distractors(p, r) {
      return pool3(r, p.x, [p.x + 2, p.x - 2, -p.x, p.x * 2, p.x - 1 > 0 ? p.x - 1 : p.x + 1], String).map((v) => `${v > 0 ? "+" : ""}${v}`);
    },
    explanation(p) {
      const sum = p.others.reduce((a, [, ox, n]) => a + ox * n, 0);
      return `The known atoms contribute ${sum}, and the compound is neutral, so ${p.count} x (ox. no. of ${p.el}) + ${sum} = 0 -> ${p.el} = ${p.x > 0 ? "+" : ""}${p.x}. Forgetting the sign flips the answer.`;
    },
    hint: () => "Sum of oxidation numbers = overall charge (0 for a neutral compound).",
    verify(p, chosen) {
      const sum = p.others.reduce((a, [, ox, n]) => a + ox * n, 0);
      return parseNum(chosen) === -sum / p.count && -sum / p.count === p.x;
    },
  },
  {
    id: "isotope-ram",
    topicSlug: "atomic-structure-periodic-table",
    label: "Relative atomic mass from isotopic abundance",
    params(r) {
      const rows = [
        { name: "chlorine", iso: [[35, 75], [37, 25]] },
        { name: "copper", iso: [[63, 70], [65, 30]] },
        { name: "boron", iso: [[10, 20], [11, 80]] },
        { name: "magnesium", iso: [[24, 79], [25, 10], [26, 11]] },
        { name: "neon", iso: [[20, 90], [22, 10]] },
        { name: "nitrogen", iso: [[14, 99], [15, 1]] },
      ];
      const row = pick(r, rows);
      return { row, ram: row.iso.reduce((a, [m, p]) => a + (m * p) / 100, 0) };
    },
    answer: (p) => trim(p.ram, 1),
    stem(p) {
      return `Calculate the relative atomic mass of ${p.row.name} from its isotopic composition: ${p.row.iso
        .map(([m, p]) => `${p}% of mass number ${m}`)
        .join(" and ")}.`;
    },
    distractors(p, r) {
      const plain = p.row.iso.reduce((a, [m]) => a + m, 0) / p.row.iso.length;
      return pool3(r, p.ram, [plain, p.ram + 1, Math.max(1, p.ram - 1), Math.round(p.ram * 10) / 10 + 0.5, p.row.iso[0][0]], trim).map((v) => trim(v, 1));
    },
    explanation(p) {
      return `Ram = sum(mass x abundance)/100 = ${p.row.iso
        .map(([m, p]) => `${m} x ${p}`)
        .join(" + ")} / 100 = ${trim(p.ram, 2)}. The unweighted mean of the mass numbers ignores the abundances.`;
    },
    hint: () => "Weight each isotope mass by its percentage abundance before dividing by 100.",
    verify(p, chosen) {
      const want = p.row.iso.reduce((a, [m, p]) => a + (m * p) / 100, 0);
      return Math.abs(parseNum(chosen) - want) <= 0.051;
    },
  },
  {
    id: "electron-configuration",
    topicSlug: "atomic-structure-periodic-table",
    label: "Electronic configuration (K, L, M shells)",
    params(r) {
      const z = int(r, 11, 20);
      const config = z <= 18 ? [2, 8, z - 10] : [2, 8, 8, z - 18];
      return { z, config };
    },
    answer: (p) => p.config.join(", "),
    stem(p) {
      return `An atom has proton number ${p.z}. What is its electronic configuration (shell by shell)?`;
    },
    distractors(p, r) {
      const key = p.config.join(", ");
      const alt1 = [...p.config];
      alt1[alt1.length - 1] -= 1;
      alt1[0] += 1;
      const alt2 = p.config.slice(1, -1).concat([p.config[p.config.length - 1] + 1, p.config[0] - 1]);
      const alt3 = [p.config[0], p.config[1] + p.config[2] ?? p.config[2]];
      const pool = [alt1.join(", "), alt2.join(", "), alt3.join(", "), `${p.config[0]}, ${p.z - p.config[0]}`, p.config.reverse().join(", ")];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== key && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) {
        const last = p.config.slice(0, -1).concat([p.config[p.config.length - 1] + e]);
        const c = last.join(", ");
        if (c !== key && !out.includes(c)) out.push(c);
      }
      return out.slice(0, 3);
    },
    explanation(p) {
      return `Fill shells in order with capacities 2, 8, 8 (for proton numbers up to 20): ${p.z} electrons -> ${p.config.join(", ")}. The first shell never holds more than 2, and the second never more than 8.`;
    },
    hint: () => "Shells fill in order: 2, then 8, then up to 8 more for Z <= 20.",
    verify(p, chosen) {
      const nums = String(chosen).split(",").map((s) => Number(s.trim()));
      return nums.join(", ") === canonicalConfig(p.z).join(", ") && nums.reduce((a, b) => a + b, 0) === p.z;
    },
  },
  {
    id: "moles-from-particles",
    topicSlug: "stoichiometry-mole",
    label: "Moles from particle count (Avogadro)",
    params(r) {
      const n = int(r, 1, 6);
      return { n, particles: n * 6.02, expo: 23 };
    },
    answer: (p) => `${p.n} mol`,
    stem(p) {
      return `How many moles of molecules are there in ${trim(p.particles, 2)} x 10^${p.expo} molecules? (Avogadro constant = 6.02 x 10^23)`;
    },
    distractors(p, r) {
      return pool3(r, p.n, [p.n * 6.02, Math.round((p.n / 6.02) * 100) / 100, p.n * 2, p.n + 1, p.n * 10], String).map((v) => `${v} mol`);
    },
    explanation(p) {
      return `n = N/NA = ${trim(p.particles, 2)} x 10^${p.expo} / 6.02 x 10^23 = ${p.n} mol. Dividing by 6.02 instead of multiplying (or the reverse) confuses the direction of the conversion.`;
    },
    hint: () => "Moles = number of particles / Avogadro constant.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.particles / 6.02) < 1e-9 && parseNum(chosen) === p.n;
    },
  },
  {
    id: "equilibrium-constant",
    topicSlug: "thermodynamics-kinetics",
    label: "Equilibrium constant Kc from concentrations",
    params(r) {
      // Only ship concentrations whose Kc is exact at 2 dp, so the printed key
      // and the re-derived value agree bit for bit.
      let ca = pick(r, [0.1, 0.2, 0.4, 0.5, 1]);
      let cb = pick(r, [0.1, 0.2, 0.25, 0.5, 2]);
      let cab = pick(r, [0.2, 0.3, 0.4, 0.5, 0.6]);
      for (let g = 0; g < 60; g++) {
        const kc = (cab * cab) / (ca * cb);
        if (Math.abs(kc - Number(kc.toFixed(2))) < 1e-9 && kc > 0.05) break;
        ca = pick(r, [0.1, 0.2, 0.4, 0.5, 1]);
        cb = pick(r, [0.1, 0.2, 0.25, 0.5, 2]);
        cab = pick(r, [0.2, 0.3, 0.4, 0.5, 0.6]);
      }
      return { ca, cb, cab, kc: (cab * cab) / (ca * cb) };
    },
    answer: (p) => trim(p.kc, 2),
    stem(p) {
      return `For the equilibrium A2 + B2 ⇌ 2AB, the equilibrium concentrations are [A2] = ${p.ca}, [B2] = ${p.cb} and [AB] = ${p.cab} mol/dm³. What is Kc?`;
    },
    distractors(p, r) {
      return pool3(r, p.kc, [(p.ca * p.cb) / (p.cab * p.cab) || 0.25, p.kc * 2, Math.round((p.kc / 2) * 100) / 100, p.ca * p.cb, p.cab * p.cab], trim);
    },
    explanation(p) {
      return `Kc = [AB]²/([A2][B2]) = ${p.cab}²/(${p.ca} x ${p.cb}) = ${trim(p.kc, 2)}. Inverting the fraction places the reactants over the products.`;
    },
    hint: () => "Products over reactants, each raised to its coefficient.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.cab * p.cab) / (p.ca * p.cb)) < 1e-9;
    },
  },
  {
    id: "bond-enthalpy-change",
    topicSlug: "thermodynamics-kinetics",
    label: "Enthalpy change from average bond enthalpies",
    params(r) {
      const rows = [
        {
          name: "CH4 + 2O2 -> CO2 + 2H2O",
          broken: [["C-H", 413, 4], ["O=O", 498, 2]],
          formed: [["C=O", 804, 2], ["O-H", 463, 4]],
        },
        { name: "H2 + Cl2 -> 2HCl", broken: [["H-H", 436, 1], ["Cl-Cl", 243, 1]], formed: [["H-Cl", 432, 2]] },
        { name: "2H2 + O2 -> 2H2O", broken: [["H-H", 436, 2], ["O=O", 498, 1]], formed: [["O-H", 463, 4]] },
        { name: "N2 + 3H2 -> 2NH3", broken: [["N≡N", 945, 1], ["H-H", 436, 3]], formed: [["N-H", 391, 6]] },
      ];
      const row = pick(r, rows);
      const broken = row.broken.reduce((a, [, e, n]) => a + e * n, 0);
      const formed = row.formed.reduce((a, [, e, n]) => a + e * n, 0);
      return { row, broken, formed, dh: broken - formed };
    },
    answer: (p) => `${p.dh < 0 ? "-" : ""}${Math.abs(p.dh)} kJ/mol`,
    stem(p) {
      return `Using average bond enthalpies (C-H 413, O=O 498, C=O 804, O-H 463, H-H 436, Cl-Cl 243, H-Cl 432, N≡N 945, N-H 391 kJ/mol), estimate the enthalpy change for ${p.row.name}.`;
    },
    distractors(p, r) {
      return pool3(r, p.dh, [-p.dh, p.broken, -p.formed, p.dh * 2, -p.dh * 2], String).map((v) => `${v < 0 ? "-" : ""}${Math.abs(v)} kJ/mol`);
    },
    explanation(p) {
      return `Breaking bonds costs ${p.broken} kJ/mol; forming bonds releases ${p.formed} kJ/mol. dH = broken - formed = ${p.broken} - ${p.formed} = ${p.dh} kJ/mol (exothermic). Quoting only one side, or flipping the sign, is the classic error.`;
    },
    hint: () => "dH = total bond enthalpies BROKEN minus total bond enthalpies FORMED.",
    verify(p, chosen) {
      const broken = p.row.broken.reduce((a, [, e, n]) => a + e * n, 0);
      const formed = p.row.formed.reduce((a, [, e, n]) => a + e * n, 0);
      return parseNum(chosen) === broken - formed && broken - formed === p.dh;
    },
  },
  {
    id: "solubility-mass",
    topicSlug: "thermodynamics-kinetics",
    label: "Solubility: solute mass for a saturated solution",
    params(r) {
      const s = pick(r, [20, 24, 32, 36, 45]);
      const water = pick(r, [50, 100, 150, 200, 250]);
      return { s, water, mass: (s * water) / 100 };
    },
    answer: (p) => `${trim(p.mass, 2)} g`,
    stem(p) {
      return `The solubility of a salt is ${p.s} g per 100 g of water at a given temperature. What mass of salt saturates ${p.water} g of water?`;
    },
    distractors(p, r) {
      return pool3(r, p.mass, [p.s, p.water, Math.round((p.mass * 2) * 100) / 100, (p.s * p.water) / 10, ((100 * p.s) / p.water) || 10], (v) => `${trim(v, 2)} g`);
    },
    explanation(p) {
      return `Scale the ratio: ${p.s} g per 100 g -> ${p.water} g needs ${p.s} x ${p.water}/100 = ${trim(p.mass, 2)} g. Using the solubility figure itself forgets to scale by the water mass.`;
    },
    hint: () => "Solubility is grams per 100 g of water — scale proportionally.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.s * p.water) / 100) < 5e-3;
    },
  },
];
