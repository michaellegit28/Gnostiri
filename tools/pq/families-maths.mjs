/**
 * Mathematics families (round 2, JAMB pool) — calculus, sequences, matrices,
 * indices/logs, probability, mensuration, statistics, coordinate geometry.
 * Every key is re-derived: the verifier parses the OPTION text (not the answer
 * field) and re-applies the rule, so a wrong key can never verify.
 */

import { int, pick, shuffled } from "./engine.mjs";
import { parseNum, pool3 } from "./families-physics.mjs";

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

/** Parse "6x - 4" style option into coefficient and constant (x² excluded). */
function parseLinearOption(s) {
  const m = String(s).replace(/−/g, "-").trim();
  const xm = m.match(/(-?\s*\d*)x(?!²)/);
  // The constant is the trailing number, never a backtracked coefficient.
  const cm = m.match(/(-?\s*\d+)\s*$/);
  let coef = 0;
  if (xm) {
    const c = xm[1].replace(/\s/g, "");
    coef = c === "" ? 1 : c === "-" ? -1 : Number(c);
  }
  return { coef, constant: cm ? Number(cm[1].replace(/\s/g, "")) : 0, hasX: !!xm };
}

/** Parse "ax² + bx + C" into {a, b, hasC} for mathematical (not string) equality. */
function parseIntegralOption(s) {
  const a = parseSquareCoef(s);
  const rest = String(s).replace(/-?\s*\d*x²/g, "").replace(/\+\s*C$/, "");
  const b = parseLinearOption(rest).coef;
  return { a, b, hasC: /\bC\b/.test(String(s)) };
}

/** Coefficient of x² in an option string (0 if absent). */
function parseSquareCoef(s) {
  const m = String(s).match(/(-?\s*\d*)x²/);
  if (!m) return 0;
  const c = m[1].replace(/\s/g, "");
  return c === "" ? 1 : c === "-" ? -1 : Number(c);
}

export const families = [
  {
    id: "derivative-polynomial",
    topicSlug: "calculus",
    label: "Differentiation of ax² + bx + c",
    params(r) {
      const a = int(r, 1, 6);
      const b = int(r, 1, 12);
      const c = int(r, 1, 20);
      return { a, b, c };
    },
    answer(p) {
      return `${2 * p.a}x ${p.b > 0 ? "+" : "-"} ${Math.abs(p.b)}`;
    },
    stem(p) {
      return `Given that y = ${p.a}x² ${p.b > 0 ? "+" : "\u2212"} ${Math.abs(p.b)}x + ${p.c}, find dy/dx.`;
    },
    distractors(p, r) {
      const key = this.answer(p);
      const sameKey = (c) => JSON.stringify(parseLinearOption(c.replace(/x²/g, ""))) === JSON.stringify(parseLinearOption(key)) && !/x²/.test(c);
      const over = `${2 * p.a + 1}x ${p.b > 0 ? "+" : "-"} ${Math.abs(p.b)}`;
      const square = `${2 * p.a}x² ${p.b > 0 ? "+" : "-"} ${Math.abs(p.b)}`;
      const drop = `2${p.a}x`;
      const half = `${p.a}x ${p.b > 0 ? "+" : "-"} ${Math.abs(p.b)}`;
      const pool = [over, square, drop, half, `${2 * p.a}x ${p.b > 0 ? "-" : "+"} ${Math.abs(p.b)}`];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== key && !sameKey(c) && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) out.push(`${2 * p.a + e}x ${p.b > 0 ? "+" : "-"} ${Math.abs(p.b) + e}`);
      return out.slice(0, 3);
    },
    explanation(p) {
      return `d/dx(ax²) = 2ax, so dy/dx = ${2 * p.a}x + ${p.b}. The constant ${p.c} differentiates to zero; keeping x² is the failure to apply the power rule.`;
    },
    hint: () => "Power rule: d/dx(x^n) = nx^(n-1); constants vanish.",
    verify(p, chosen) {
      const { coef, constant } = parseLinearOption(chosen);
      return coef === 2 * p.a && constant === p.b;
    },
  },
  {
    id: "integral-polynomial",
    topicSlug: "calculus",
    label: "Integration of 2ax + b",
    params(r) {
      const a = int(r, 1, 5);
      const b = int(r, 1, 9);
      return { a, b };
    },
    answer(p) {
      return `${p.a === 1 ? "x²" : `${p.a}x²`} + ${p.b === 1 ? "x" : `${p.b}x`} + C`;
    },
    stem(p) {
      return `Integrate with respect to x: (${2 * p.a}x + ${p.b}).`;
    },
    distractors(p, r) {
      const key = this.answer(p);
      const sameKey = (c) => JSON.stringify(parseIntegralOption(c)) === JSON.stringify(parseIntegralOption(key));
      const noC = `${p.a === 1 ? "x²" : `${p.a}x²`} + ${p.b === 1 ? "x" : `${p.b}x`}`;
      const wrongCoef = `${2 * p.a}x² + ${p.b === 1 ? "x" : `${p.b}x`} + C`;
      const deriv = `${2 * p.a}x + ${p.b}`;
      const swap = `${p.b}x² + ${p.a === 1 ? "x" : `${p.a}x`} + C`;
      const pool = [noC, wrongCoef, deriv, swap, `${p.a === 1 ? "x²" : `${p.a}x²`} + ${p.b === 1 ? "x" : `${p.b}x`} + 2C`];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== key && !sameKey(c) && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) out.push(`${(p.a + e) * 2}x² + ${p.b === 1 ? "x" : `${p.b}x`} + C`);
      return out.slice(0, 3);
    },
    explanation(p) {
      return `int(2ax + b)dx = ax² + bx + C = ${p.a}x² + ${p.b}x + C. Dropping the + C loses marks in every board; differentiating gives back the integrand, not the integral.`;
    },
    hint: () => "add one to the power and divide by the new power; never drop + C.",
    verify(p, chosen) {
      // Differentiate the CHOSEN option and compare with the integrand 2ax + b.
      const parsed = parseIntegralOption(chosen);
      return parsed.hasC && 2 * parsed.a === 2 * p.a && parsed.b === p.b;
    },
  },
  {
    id: "arithmetic-nth",
    topicSlug: "algebra-foundations",
    label: "nth term of an arithmetic progression",
    params(r) {
      const a1 = int(r, 1, 12);
      const d = int(r, 1, 9);
      const n = int(r, 5, 20);
      return { a1, d, n, val: a1 + (n - 1) * d };
    },
    answer: (p) => `${p.val}`,
    stem(p) {
      return `An AP has first term ${p.a1} and common difference ${p.d}. What is its ${p.n}th term?`;
    },
    distractors(p, r) {
      return pool3(r, p.val, [p.a1 + p.n * p.d, p.a1 * p.n, p.a1 - (p.n - 1) * p.d, p.val + p.d, Math.max(1, p.val - p.n)], String);
    },
    explanation(p) {
      return `Tn = a + (n − 1)d = ${p.a1} + ${p.n - 1} x ${p.d} = ${p.val}. Using n instead of n − 1 over-counts one step.`;
    },
    hint: () => "nth term = first term + (n - 1) d.",
    verify(p, chosen) {
      return parseNum(chosen) === p.a1 + (p.n - 1) * p.d;
    },
  },
  {
    id: "geometric-nth",
    topicSlug: "algebra-foundations",
    label: "nth term of a geometric progression",
    params(r) {
      const a1 = int(r, 1, 6);
      const ratio = int(r, 2, 3);
      const n = int(r, 3, 5);
      return { a1, ratio, n, val: a1 * Math.pow(ratio, n - 1) };
    },
    answer: (p) => `${p.val}`,
    stem(p) {
      return `A GP has first term ${p.a1} and common ratio ${p.ratio}. What is its ${p.n}th term?`;
    },
    distractors(p, r) {
      return pool3(r, p.val, [p.a1 * Math.pow(p.ratio, p.n), p.a1 + (p.n - 1) * p.ratio, p.a1 * (p.n - 1) * p.ratio, Math.max(1, Math.round(p.val / p.ratio)), p.val * p.ratio], String);
    },
    explanation(p) {
      return `Tn = a x r^(n-1) = ${p.a1} x ${p.ratio}^${p.n - 1} = ${p.val}. Using r^n instead of r^(n-1) multiplies by one extra ratio.`;
    },
    hint: () => "nth term = first term x ratio^(n - 1).",
    verify(p, chosen) {
      return parseNum(chosen) === p.a1 * Math.pow(p.ratio, p.n - 1);
    },
  },
  {
    id: "matrix-determinant",
    topicSlug: "further-mathematics",
    label: "Determinant of a 2x2 matrix",
    params(r) {
      let a = int(r, 1, 6);
      const b = int(r, 1, 6);
      const c = int(r, 1, 6);
      let d = int(r, 1, 6);
      for (let g = 0; g < 40 && a * d - b * c <= 0; g++) {
        a = int(r, 1, 6);
        d = int(r, 1, 6);
      }
      if (a * d - b * c <= 0) {
        a = 3;
        d = 4;
      }
      return { a, b, c, d, det: a * d - b * c };
    },
    answer: (p) => `${p.det}`,
    stem(p) {
      return `Evaluate the determinant of the matrix [[${p.a}, ${p.b}], [${p.c}, ${p.d}]].`;
    },
    distractors(p, r) {
      return pool3(r, p.det, [p.b * p.c + 1, p.a * p.b + p.c * p.d, p.a * p.d, p.det - p.b, p.det + p.c], String);
    },
    explanation(p) {
      return `det = ad − bc = ${p.a} x ${p.d} − ${p.b} x ${p.c} = ${p.det}. bc − ad flips the sign; ad + bc forgets the subtraction.`;
    },
    hint: () => "For [[a, b], [c, d]] the determinant is ad - bc.",
    verify(p, chosen) {
      return parseNum(chosen) === p.a * p.d - p.b * p.c;
    },
  },
  {
    id: "logarithm-evaluate",
    topicSlug: "algebra-foundations",
    label: "Evaluate log_a x = k",
    params(r) {
      const a = pick(r, [2, 3, 4, 5]);
      const k = int(r, 2, 5);
      return { a, k, x: Math.pow(a, k) };
    },
    answer: (p) => `${p.x}`,
    stem(p) {
      return `If log_${p.a} x = ${p.k}, find x.`;
    },
    distractors(p, r) {
      return pool3(r, p.x, [p.a * p.k, p.a + p.k, Math.pow(p.k, p.a), Math.max(1, Math.round(p.x / p.a)), p.k], String);
    },
    explanation(p) {
      return `log_a x = k means a^k = x, so x = ${p.a}^${p.k} = ${p.x}. Multiplying a x k confuses the log definition; a^k and k^a are different.`;
    },
    hint: () => "log_a x = k is exactly the statement a^k = x.",
    verify(p, chosen) {
      return parseNum(chosen) === Math.pow(p.a, p.k) && parseNum(chosen) === p.x;
    },
  },
  {
    id: "powers-of-powers",
    topicSlug: "algebra-foundations",
    label: "Index laws: (a^m)^n",
    params(r) {
      const a = pick(r, [2, 3, 4, 5, 6]);
      const m = int(r, 2, 4);
      const n = int(r, 2, 4);
      return { a, m, n, val: Math.pow(a, m * n) };
    },
    answer: (p) => `${p.val}`,
    stem(p) {
      return `Evaluate (${p.a}^${p.m})^${p.n}.`;
    },
    distractors(p, r) {
      return pool3(r, p.val, [Math.pow(p.a, p.m + p.n), Math.pow(p.a, p.m * p.n) + 1, p.a * p.m * p.n, Math.pow(p.a, p.m) * p.n, Math.pow(p.a, Math.max(1, p.m * p.n - 2))], String);
    },
    explanation(p) {
      return `(a^m)^n = a^(m x n) = ${p.a}^${p.m * p.n} = ${p.val}. Adding the exponents (instead of multiplying) is the classic index-law slip.`;
    },
    hint: () => "Powers of powers MULTIPLY the exponents.",
    verify(p, chosen) {
      return parseNum(chosen) === Math.pow(p.a, p.m * p.n);
    },
  },
  {
    id: "probability-two-dice",
    topicSlug: "statistics-probability",
    label: "Probability: sum of two fair dice",
    params(r) {
      const target = int(r, 2, 12);
      return { target, count: enumerate(target) };
    },
    answer: (p) => `${p.count}/36`,
    stem(p) {
      return `Two fair dice are thrown. What is the probability that the sum of the scores is ${p.target}?`;
    },
    distractors(p, r) {
      const key = `${p.count}/36`;
      const pool = [`${p.target}/36`, `${6 - Math.abs(6 - p.target)}/36`, `${p.count}/12`, `${p.count * 2}/36`, `${36 - p.count}/36`];
      const out = [];
      for (const c of shuffled(r, pool)) {
        if (out.length === 3) break;
        if (c !== key && !out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) {
        const c = `${p.count + e}/36`;
        if (c !== key && !out.includes(c)) out.push(c);
      }
      return out.slice(0, 3);
    },
    explanation(p) {
      return `There are 36 ordered outcomes; the pairs summing to ${p.target} number ${p.count}, so P = ${p.count}/36. Using the denominator 12 assumes independent sums, not ordered pairs.`;
    },
    hint: () => "Count ordered pairs (i, j) with i + j = target over 36 total outcomes.",
    verify(p, chosen) {
      const m = String(chosen).match(/^(\d+)\s*\/\s*36$/);
      if (!m) return false;
      return Number(m[1]) === enumerate(p.target) && Number(m[1]) === p.count;
    },
  },
  {
    id: "permutation-count",
    topicSlug: "statistics-probability",
    label: "Permutations: nPr",
    params(r) {
      const n = int(r, 4, 8);
      let k = int(r, 2, 3);
      if (k >= n) k = 2;
      return { n, k, val: falling(n, k) };
    },
    answer: (p) => `${p.val}`,
    stem(p) {
      return `How many ways can ${p.n} different objects be arranged IN ${p.k} positions? (order matters)`;
    },
    distractors(p, r) {
      return pool3(r, p.val, [choose(p.n, p.k), p.n * p.k, falling(p.n, p.k) * p.k, p.n + p.k, Math.max(1, falling(p.n, p.k) - p.n)], String);
    },
    explanation(p) {
      return `nPr = n!/(n − k)! = ${p.n}!/(${p.n} − ${p.k})! = ${p.val}. Using nCr (choosing without order) under-counts by k! = ${factorial(p.k)}.`;
    },
    hint: () => "Permutations count order: fill each position one at a time.",
    verify(p, chosen) {
      return parseNum(chosen) === falling(p.n, p.k);
    },
  },
  {
    id: "polygon-interior-angle",
    topicSlug: "geometry-trigonometry",
    label: "Interior angle of a regular polygon",
    params(r) {
      const n = pick(r, [5, 6, 8, 9, 10, 12]);
      return { n, angle: ((n - 2) * 180) / n };
    },
    answer: (p) => `${trim(p.angle, 2)}°`,
    stem(p) {
      return `What is the size of each interior angle of a regular polygon with ${p.n} sides?`;
    },
    distractors(p, r) {
      return pool3(r, p.angle, [((n_(p) - 2) * 180) / n_(p) + 180 / n_(p), (n_(p) - 2) * 180, 180 / n_(p), 360 / n_(p), p.angle / 2], (v) => `${trim(v, 2)}°`);
      function n_(p) {
        return p.n;
      }
    },
    explanation(p) {
      return `Sum of interior angles = (n − 2) x 180 = ${(p.n - 2) * 180}°; divide by ${p.n} sides -> ${trim(p.angle, 2)}°. Quoting the sum forgets to share it out; 360/n is the EXTERIOR angle.`;
    },
    hint: () => "(n - 2) x 180 is the TOTAL; divide by n for one angle.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - ((p.n - 2) * 180) / p.n) < 5e-3;
    },
  },
  {
    id: "line-gradient",
    topicSlug: "geometry-trigonometry",
    label: "Gradient of a line through two points",
    params(r) {
      const x1 = int(r, -5, 5);
      const y1 = int(r, -5, 5);
      const run = pick(r, [2, 3, 4, 5, 6, 8, 10]);
      const g = pick(r, [-3, -2, -1.5, -1, -0.5, 1, 1.5, 2, 2.5, 3]);
      const x2 = x1 + run;
      if (g * run % 1 !== 0) return { x1, y1, x2: x1 + 2 * run, g: g / 2, normalized: true };
      return { x1, y1, x2, g, normalized: false, rise: g * run };
    },
    answer: (p) => trim(p.g, 2),
    stem(p) {
      const y2 = p.y1 + p.g * (p.x2 - p.x1);
      return `What is the gradient of the line joining (${p.x1}, ${p.y1}) and (${p.x2}, ${y2})?`;
    },
    distractors(p, r) {
      const key = trim(p.g, 2);
      const y2 = p.y1 + p.g * (p.x2 - p.x1);
      const cands = [
        trim(-p.g, 2),
        String(p.x2 - p.x1),
        trim(Math.abs(p.g) + 1, 2),
        trim(p.g + 1, 2),
        trim(p.g / 2, 2),
        trim(p.y2 - p.y1, 2),
        trim((p.x2 - p.x1) / (y2 - p.y1), 2),
      ].filter((c) => c !== key && Number.isFinite(Number(c)));
      const out = [];
      for (const c of shuffled(r, cands)) {
        if (out.length === 3) break;
        if (!out.includes(c)) out.push(c);
      }
      for (let e = 1; out.length < 3; e++) {
        const c = trim(p.g + e, 2);
        if (c !== key && !out.includes(c)) out.push(c);
      }
      return out.slice(0, 3);
    },
    explanation(p) {
      const y2 = p.y1 + p.g * (p.x2 - p.x1);
      return `gradient = rise/run = (${y2} - ${p.y1})/(${p.x2} - ${p.x1}) = ${trim(p.g, 2)}. Reversing the subtraction flips the sign; the run alone is not a gradient.`;
    },
    hint: () => "gradient = (change in y) / (change in x).",
    verify(p, chosen) {
      const y2 = p.y1 + p.g * (p.x2 - p.x1);
      return p.x2 !== p.x1 && Math.abs(parseNum(chosen) - (y2 - p.y1) / (p.x2 - p.x1)) < 5e-3;
    },
  },
  {
    id: "cylinder-volume",
    topicSlug: "geometry-trigonometry",
    label: "Volume of a cylinder (pi = 22/7)",
    params(r) {
      const radius = int(r, 1, 7) * 7; // radius a multiple of 7 keeps pi exact
      const height = int(r, 2, 14) * 7;
      return { radius, height, volume: (22 / 7) * radius * radius * height };
    },
    answer: (p) => `${p.volume} cm³`,
    stem(p) {
      return `Find the volume of a cylinder of radius ${p.radius} cm and height ${p.height} cm. (take pi = 22/7)`;
    },
    distractors(p, r) {
      return pool3(r, p.volume, [2 * (22 / 7) * p.radius * p.height, (22 / 7) * p.radius * p.height, p.volume * 2, Math.round(p.volume / 2), (22 / 7) * p.radius * p.radius * p.height * 3], String).map((v) => `${v} cm³`);
    },
    explanation(p) {
      return `V = pi r² h = 22/7 x ${p.radius}² x ${p.height} = ${p.volume} cm³. The lateral-area formula 2 x pi x r x h omits the second radius factor.`;
    },
    hint: () => "V = pi r squared h; with r a multiple of 7 the 22/7 cancels exactly.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (22 / 7) * p.radius * p.radius * p.height) < 1;
    },
  },
  {
    id: "quadratic-discriminant",
    topicSlug: "algebra-foundations",
    label: "Discriminant of a quadratic",
    params(r) {
      const a = int(r, 1, 4);
      let b = int(r, 2, 9);
      const c = int(r, 1, 12);
      if (b * b - 4 * a * c === 0) b += 1;
      return { a, b, c, disc: b * b - 4 * a * c };
    },
    answer: (p) => `${p.disc}`,
    stem(p) {
      return `Find the discriminant of the quadratic equation ${p.a}x² - ${p.b}x + ${p.c} = 0.`;
    },
    distractors(p, r) {
      return pool3(r, p.disc, [p.b * p.b + 4 * p.a * p.c, 4 * p.a * p.c - p.b * p.b, p.b * p.b - p.a * p.c, p.b * p.b - 2 * p.a * p.c, Math.abs(p.disc) + 4], String);
    },
    explanation(p) {
      return `b² − 4ac = ${p.b}² − 4 x ${p.a} x ${p.c} = ${p.disc}. Plus 4ac changes the sign of the discriminant and the conclusion about the roots.`;
    },
    hint: () => "The discriminant is b² − 4ac.",
    verify(p, chosen) {
      return parseNum(chosen) === p.b * p.b - 4 * p.a * p.c;
    },
  },
  {
    id: "mean-of-data",
    topicSlug: "statistics-probability",
    label: "Mean of a data set",
    params(r) {
      const n = pick(r, [4, 5, 6]);
      let values = Array.from({ length: n }, () => int(r, 2, 20));
      const total = values.reduce((a, b) => a + b, 0);
      if (total % n !== 0) {
        values[n - 1] += (n - (total % n)) % n;
        if (values[n - 1] > 30) values[n - 1] -= (total % n);
      }
      const sum = values.reduce((a, b) => a + b, 0);
      return { values, mean: sum / values.length };
    },
    answer: (p) => trim(p.mean, 2),
    stem(p) {
      return `Find the mean of the following scores: ${p.values.join(", ")}.`;
    },
    distractors(p, r) {
      const sum = p.values.reduce((a, b) => a + b, 0);
      return pool3(r, p.mean, [Math.max(...p.values), Math.min(...p.values), sum / (p.values.length - 1), Math.round((p.mean + 1) * 100) / 100, sum], trim);
    },
    explanation(p) {
      return `mean = total ${sum_(p)} / ${p.values.length} values = ${trim(p.mean, 2)}. Dividing by the wrong count, or quoting the largest score, are the usual slips.`;
    },
    hint: () => "Mean = sum of values / number of values.",
    verify(p, chosen) {
      const sum = p.values.reduce((a, b) => a + b, 0);
      return Math.abs(parseNum(chosen) - sum / p.values.length) < 5e-3;
    },
  },
  {
    id: "sine-rule",
    topicSlug: "geometry-trigonometry",
    label: "Sine rule: a/sin A = b/sin B",
    params(r) {
      const angles = [
        { A: 30, sinA: 0.5 },
        { A: 45, sinA: Math.SQRT2 / 2 },
        { A: 60, sinA: Math.sqrt(3) / 2 },
      ];
      const pickA = pick(r, angles);
      const a = int(r, 2, 12) * 2;
      const use45 = pickA.A === 45;
      const B = pick(r, [30, 45, 60, 90]);
      const sinB = B === 30 ? 0.5 : B === 45 ? Math.SQRT2 / 2 : B === 60 ? Math.sqrt(3) / 2 : 1;
      const b = (a * sinB) / pickA.sinA;
      return { A: pickA.A, a, B, b: use45 ? Math.round(b * 100) / 100 : b, sinB, sinA: pickA.sinA };
    },
    answer: (p) => trim(p.b, 2),
    stem(p) {
      return `In triangle ABC, A = ${p.A}°, B = ${p.B}°, a = ${p.a} cm. Find b. (use a/sin A = b/sin B)`;
    },
    distractors(p, r) {
      return pool3(r, p.b, [p.a * (p.sinA / p.sinB), (p.a * p.sinB) / p.sinA, p.a + p.B / 10, Math.round((p.b * 1.41) * 100) / 100, Math.max(1, Math.round((p.b / 2) * 100) / 100)], trim);
    },
    explanation(p) {
      return `b = a x sin B / sin A = ${p.a} x sin${p.B}° / sin${p.A}° = ${trim(p.b, 2)} cm. Inverting the sine ratio uses the wrong pairing of angles and sides.`;
    },
    hint: () => "Match each side with the sine of its OPPOSITE angle.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.a * p.sinB) / p.sinA) < 5e-3;
    },
  },
];

/** Enumerate favourable ordered pairs for a dice sum — the independent check. */
function enumerate(target) {
  let count = 0;
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      if (i + j === target) count++;
    }
  }
  return count;
}

function falling(n, k) {
  let out = 1;
  for (let i = 0; i < k; i++) out *= n - i;
  return out;
}

function choose(n, k) {
  return falling(n, k) / falling(k, k);
}

function factorial(k) {
  return falling(k, k);
}

function sum_(p) {
  return p.values.reduce((a, b) => a + b, 0);
}
