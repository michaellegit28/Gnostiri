/**
 * Physics families (round 2, JAMB pool).
 * Every key is re-derived arithmetically from the problem parameters — the
 * verifier re-implements the physics, it never re-reads a stored answer.
 */

import { int, pick, shuffled } from "./engine.mjs";

/** Pull the numeric value out of an option string ("0.25 s" -> 0.25). */
export const parseNum = (s) => Number(String(s).replace(/[^0-9.\-]/g, ""));

/** Deterministic distractor builder: pool of plausible wrong values, topped up
 * with tie-spaced offsets if the pool collides (small numbers can). */
export function pool3(r, key, pool, fmt) {
  const keyStr = fmt ? fmt(key) : String(key);
  const out = [];
  for (const c of shuffled(r, pool.filter((v) => Number.isFinite(v) && v > 0))) {
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

export const families = [
  {
    id: "kinematics-final-velocity",
    topicSlug: "mechanics",
    label: "Uniform acceleration: v = u + at",
    params(r) {
      const a = int(r, 2, 8);
      const t = int(r, 2, 10);
      const u = int(r, 0, 15);
      return { u, a, t, v: u + a * t };
    },
    answer: (p) => `${p.v} m/s`,
    stem(p) {
      return `A car starts from ${p.u} m/s and accelerates uniformly at ${p.a} m/s² for ${p.t} s. What is its final velocity?`;
    },
    distractors(p, r) {
      return pool3(r, p.v, [p.u - p.a * p.t, p.a * p.t, p.u * p.t, p.v + p.a * p.t, p.u + p.t], String).map((v) => `${v} m/s`);
    },
    explanation(p) {
      return `v = u + at = ${p.u} + ${p.a} x ${p.t} = ${p.v} m/s. Option "a x t" forgets the initial velocity; a negative answer ignores that acceleration is positive.`;
    },
    hint: () => "Use v = u + at with the values in SI units.",
    verify(p, chosen) {
      return parseNum(chosen) === p.u + p.a * p.t;
    },
  },
  {
    id: "kinematics-distance",
    topicSlug: "mechanics",
    label: "Uniform acceleration distance: s = ut + 1/2 at²",
    params(r) {
      const a = 2 * int(r, 1, 4); // even: keeps 1/2 at² an integer
      const t = int(r, 2, 8);
      const u = int(r, 0, 12);
      return { u, a, t, s: u * t + (a * t * t) / 2 };
    },
    answer: (p) => `${p.s} m`,
    stem(p) {
      return `A cyclist sets off at ${p.u} m/s and accelerates uniformly at ${p.a} m/s² for ${p.t} s. How far does the cyclist travel?`;
    },
    distractors(p, r) {
      return pool3(
        r,
        p.s,
        [p.u * p.t, (p.a * p.t * p.t) / 2, p.u * p.t - (p.a * p.t * p.t) / 2, p.s + p.u * p.t, p.a * p.t * p.t],
        String,
      ).map((v) => `${v} m`);
    },
    explanation(p) {
      return `s = ut + 1/2 at² = ${p.u} x ${p.t} + 0.5 x ${p.a} x ${p.t}² = ${p.s} m. Ignoring the 1/2 doubles the acceleration term; dropping the ut term forgets the motion before acceleration.`;
    },
    hint: () => "Displacement = area under the velocity-time graph, or s = ut + 1/2 at².",
    verify(p, chosen) {
      return parseNum(chosen) === p.u * p.t + (p.a * p.t * p.t) / 2;
    },
  },
  {
    id: "newtons-second-law",
    topicSlug: "mechanics",
    label: "Resultant force: F = ma",
    params(r) {
      const m = int(r, 2, 20);
      const a = int(r, 1, 9);
      return { m, a, f: m * a };
    },
    answer: (p) => `${p.f} N`,
    stem(p) {
      return `A resultant force of magnitude F acts on a mass of ${p.m} kg, producing an acceleration of ${p.a} m/s². What is F?`;
    },
    distractors(p, r) {
      return pool3(r, p.f, [p.m + p.a, p.m / p.a, p.f * 2, p.f + p.m, p.m * p.a * 10], String).map((v) => `${v} N`);
    },
    explanation(p) {
      return `F = ma = ${p.m} x ${p.a} = ${p.f} N. Dividing gives the mass for a given force; adding m and a has no physical meaning.`;
    },
    hint: () => "Newton's second law: resultant force = mass x acceleration.",
    verify(p, chosen) {
      return parseNum(chosen) === p.m * p.a;
    },
  },
  {
    id: "weight-from-mass",
    topicSlug: "mechanics",
    label: "Weight: W = mg",
    params(r) {
      const m = int(r, 2, 40);
      const g = pick(r, [10, 9.8]);
      return { m, g, w: Math.round(m * g * 10) / 10 };
    },
    answer: (p) => `${p.w} N`,
    stem(p) {
      return `What is the weight of a body of mass ${p.m} kg on the Earth's surface? (g = ${p.g} m/s²)`;
    },
    distractors(p, r) {
      return pool3(r, p.w, [p.m * (p.g === 10 ? 9.8 : 10), p.m + p.g, p.w * 2, Math.round(p.m / p.g), p.m * p.g * 2], String).map((v) => `${v} N`);
    },
    explanation(p) {
      return `W = mg = ${p.m} x ${p.g} = ${p.w} N. Weight is a force in newtons, never the mass itself; using the other value of g is the classic mix-up.`;
    },
    hint: () => "Weight is a force: mass x gravitational field strength.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.m * p.g) <= 0.06;
    },
  },
  {
    id: "work-done",
    topicSlug: "mechanics",
    label: "Work: W = Fs",
    params(r) {
      const f = int(r, 5, 60);
      const d = int(r, 2, 30);
      return { f, d, w: f * d };
    },
    answer: (p) => `${p.w} J`,
    stem(p) {
      return `A constant force of ${p.f} N pulls a crate ${p.d} m along a rough horizontal floor. How much work is done by the force?`;
    },
    distractors(p, r) {
      return pool3(r, p.w, [p.f + p.d, p.w * 2, p.f * p.d * 10, p.d - p.f, p.w + p.f], String).map((v) => `${v} J`);
    },
    explanation(p) {
      return `W = Fs = ${p.f} x ${p.d} = ${p.w} J. Work is force x distance IN THE DIRECTION of the force; adding them is meaningless.`;
    },
    hint: () => "Work done = force x displacement (one joule = one newton-metre).",
    verify(p, chosen) {
      return parseNum(chosen) === p.f * p.d;
    },
  },
  {
    id: "mechanical-power",
    topicSlug: "mechanics",
    label: "Power: P = W/t",
    params(r) {
      const w = int(r, 5, 50) * 100;
      const t = int(r, 2, 25);
      return { w, t, p: Math.round((w / t) * 100) / 100 };
    },
    answer: (p) => `${p.p} W`,
    stem(p) {
      return `A machine does ${p.w} J of work in ${p.t} s. What is its useful power output?`;
    },
    distractors(p, r) {
      return pool3(r, p.p, [p.w + p.t, p.w * p.t, p.p * 2, p.t, Math.round(p.p / 2)], String).map((v) => `${v} W`);
    },
    explanation(p) {
      return `P = W/t = ${p.w} J / ${p.t} s = ${p.p} W. Power is the RATE of doing work, so dividing (not multiplying) by time is correct.`;
    },
    hint: () => "Power is work done per second — one watt = one joule per second.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.w / p.t) <= 0.01;
    },
  },
  {
    id: "pressure-force-area",
    topicSlug: "mechanics",
    label: "Pressure: p = F/A",
    params(r) {
      const a = int(r, 2, 40);
      const p = int(r, 2, 25);
      return { a, p, f: a * p };
    },
    answer: (p) => `${p.f} N`,
    stem(p) {
      return `A pressure of ${p.p} Pa acts over an area of ${p.a} m². What force produces it?`;
    },
    distractors(p, r) {
      return pool3(r, p.f, [p.a + p.p, p.a * p.p * 10, p.p - p.a, p.f * 2, p.f + p.p], String).map((v) => `${v} N`);
    },
    explanation(p) {
      return `p = F/A so F = pA = ${p.p} x ${p.a} = ${p.f} N. Multiplying the pressure by the area is correct; the inverse gives area per unit force.`;
    },
    hint: () => "One pascal is one newton per square metre.",
    verify(p, chosen) {
      return parseNum(chosen) === p.p * p.a;
    },
  },
  {
    id: "density-calculation",
    topicSlug: "mechanics",
    label: "Density: rho = m/V",
    params(r) {
      const v = int(r, 2, 30);
      const rho = int(r, 2, 20);
      return { v, rho, m: v * rho };
    },
    answer: (p) => `${p.rho} kg/m³`,
    stem(p) {
      return `A solid cube of volume ${p.v} m³ has a mass of ${p.m} kg. What is its density?`;
    },
    distractors(p, r) {
      return pool3(r, p.rho, [p.v, p.m, p.m / p.v / 2, p.rho * 2, p.m - p.v], String).map((v) => `${v} kg/m³`);
    },
    explanation(p) {
      return `rho = m/V = ${p.m} / ${p.v} = ${p.rho} kg/m³. Reporting the mass or the volume itself are the two classic slips.`;
    },
    hint: () => "Density is mass per unit volume.",
    verify(p, chosen) {
      return parseNum(chosen) === p.m / p.v;
    },
  },
  {
    id: "wave-speed",
    topicSlug: "waves-optics",
    label: "Wave speed: v = f lambda",
    params(r) {
      const f = int(r, 2, 30);
      const lambda = int(r, 2, 12);
      return { f, lambda, v: f * lambda };
    },
    answer: (p) => `${p.v} m/s`,
    stem(p) {
      return `A wave of frequency ${p.f} Hz has a wavelength of ${p.lambda} m. What is its speed?`;
    },
    distractors(p, r) {
      return pool3(r, p.v, [p.f + p.lambda, p.v * 2, p.f / p.lambda, p.lambda / p.f, p.v * 10], String).map((v) => `${v} m/s`);
    },
    explanation(p) {
      return `v = f x lambda = ${p.f} x ${p.lambda} = ${p.v} m/s. Dividing the two gives neither a speed nor a wavelength.`;
    },
    hint: () => "Wave speed = frequency x wavelength.",
    verify(p, chosen) {
      return parseNum(chosen) === p.f * p.lambda;
    },
  },
  {
    id: "wave-period",
    topicSlug: "waves-optics",
    label: "Period and frequency: T = 1/f",
    params(r) {
      const f = pick(r, [2, 4, 5, 8, 10, 20, 25, 40]);
      return { f, t: 1 / f };
    },
    answer: (p) => `${p.t} s`,
    stem(p) {
      return `A wave generator produces ripples at a frequency of ${p.f} Hz. What is the period of the ripples?`;
    },
    distractors(p, r) {
      return pool3(r, 1 / p.f, [p.f, 2 / p.f, 1 / (2 * p.f), p.f / 2, 10 / p.f], (v) => `${v} s`);
    },
    explanation(p) {
      return `T = 1/f = 1/${p.f} = ${p.t} s. The period is the reciprocal of the frequency, not the frequency itself.`;
    },
    hint: () => "Period = 1 / frequency; higher frequency means a shorter period.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - 1 / p.f) <= 1e-9;
    },
  },
  {
    id: "specific-heat-capacity",
    topicSlug: "thermodynamics",
    label: "Heat energy: Q = mc dT",
    params(r) {
      const m = int(r, 1, 4);
      const c = pick(r, [420, 900, 3800, 460]);
      const dT = int(r, 5, 40);
      return { m, c, dT, q: m * c * dT };
    },
    answer: (p) => `${p.q} J`,
    stem(p) {
      return `How much heat is needed to raise the temperature of ${p.m} kg of a substance of specific heat capacity ${p.c} J/(kg·°C) by ${p.dT} °C?`;
    },
    distractors(p, r) {
      return pool3(r, p.q, [p.m * p.dT, p.m * p.c, p.q * 2, Math.round(p.q / 2), p.c * p.dT], String).map((v) => `${v} J`);
    },
    explanation(p) {
      return `Q = mc dT = ${p.m} x ${p.c} x ${p.dT} = ${p.q} J. Dropping c treats the mass as the only thermal property; dropping dT ignores the temperature rise.`;
    },
    hint: () => "Heat = mass x specific heat capacity x temperature change.",
    verify(p, chosen) {
      return parseNum(chosen) === p.m * p.c * p.dT;
    },
  },
  {
    id: "latent-heat",
    topicSlug: "thermodynamics",
    label: "Latent heat: Q = mL",
    params(r) {
      const l = pick(r, [334000, 2260000, 34000]);
      const m = pick(r, [0.5, 1, 2, 2.5]);
      return { l, m, q: Math.round(l * m) };
    },
    answer: (p) => `${p.q} J`,
    stem(p) {
      return `How much heat is required to change ${p.m} kg of a substance completely into vapour without a change in temperature, if its specific latent heat of vaporisation is ${p.l} J/kg?`;
    },
    distractors(p, r) {
      return pool3(r, p.q, [p.l, p.m, Math.round(p.q / 2), Math.round(p.q * 2), Math.round(p.l / p.m)], String).map((v) => `${v} J`);
    },
    explanation(p) {
      return `Q = mL = ${p.m} x ${p.l} = ${p.q} J. No temperature change occurs, so c and dT play no part in latent heat.`;
    },
    hint: () => "Latent heat = mass x specific latent heat; the temperature does not change.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.m * p.l) <= 1;
    },
  },
  {
    id: "efficiency-percent",
    topicSlug: "thermodynamics",
    label: "Efficiency: useful/total x 100",
    params(r) {
      const useful = int(r, 2, 20) * 5;
      const total = [20, 25, 40, 50, 100][int(r, 0, 4)] * 5;
      return { useful, total, eta: (100 * useful) / total };
    },
    answer: (p) => `${p.eta}%`,
    stem(p) {
      return `A machine takes in ${p.total} J of energy and delivers ${p.useful} J as useful work. What is its efficiency?`;
    },
    distractors(p, r) {
      return pool3(r, p.eta, [100 - p.eta, (100 * p.total) / p.useful, p.useful, p.eta * 2, p.useful + p.total], String).map((v) => `${v}%`);
    },
    explanation(p) {
      return `efficiency = (useful / total) x 100 = (${p.useful}/${p.total}) x 100 = ${p.eta}%. Inverting the ratio always gives more than 100%, which no machine can do.`;
    },
    hint: () => "Efficiency is the useful fraction expressed as a percentage of the input.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (100 * p.useful) / p.total) <= 0.01;
    },
  },
  {
    id: "momentum",
    topicSlug: "mechanics",
    label: "Momentum: p = mv",
    params(r) {
      const m = int(r, 2, 30);
      const v = int(r, 2, 18);
      return { m, v, p: m * v };
    },
    answer: (p) => `${p.p} kg m/s`,
    stem(p) {
      return `What is the momentum of a ${p.m} kg body moving at ${p.v} m/s?`;
    },
    distractors(p, r) {
      return pool3(r, p.p, [p.m + p.v, p.p * 2, p.m / p.v, p.v / p.m, p.p + p.m], String).map((v) => `${v} kg m/s`);
    },
    explanation(p) {
      return `p = mv = ${p.m} x ${p.v} = ${p.p} kg m/s. Momentum is mass times velocity; the unit is kg m/s, not the newton.`;
    },
    hint: () => "Momentum = mass x velocity.",
    verify(p, chosen) {
      return parseNum(chosen) === p.m * p.v;
    },
  },
  {
    id: "impulse",
    topicSlug: "mechanics",
    label: "Impulse: J = Ft = m delta v",
    params(r) {
      const f = int(r, 2, 30) * 4;
      const t = int(r, 1, 6);
      const m = [1, 2, 4, 8][int(r, 0, 3)];
      const j = f * t;
      const dv = j / m;
      return { f, t, m, j, dv };
    },
    answer: (p) => `${p.j} N s`,
    stem(p) {
      return `A force of ${p.f} N acts on a body for ${p.t} s. What impulse does the body receive, and how much does the momentum of a ${p.m} kg body change?`;
    },
    distractors(p, r) {
      return pool3(r, p.j, [p.f / p.t, p.f + p.t, p.j * 2, Math.round(p.j / 2), p.f * p.t * 2], String).map((v) => `${v} N s`);
    },
    explanation(p) {
      return `Impulse = Ft = ${p.f} x ${p.t} = ${p.j} N s, and this equals the change in momentum: m x delta v = ${p.m} x ${p.dv} = ${p.j} kg m/s. Dividing force by time confuses impulse with the rate of force.`;
    },
    hint: () => "Impulse = force x time = change in momentum.",
    verify(p, chosen) {
      return parseNum(chosen) === p.f * p.t && p.j === p.m * p.dv;
    },
  },
  {
    id: "half-life-remaining",
    topicSlug: "nuclear-quantum-physics",
    label: "Radioactive decay after n half-lives",
    params(r) {
      const n = int(r, 1, 4);
      const t = pick(r, [2, 5, 8, 10, 20, 30]) * 1000;
      return { n, t, fraction: 100 / Math.pow(2, n) };
    },
    answer: (p) => `${p.fraction}%`,
    stem(p) {
      return `A sample contains a radioisotope of half-life ${p.t / 1000} years. What percentage of the original nuclei remains after ${(p.n * p.t) / 1000} years?`;
    },
    distractors(p, r) {
      return pool3(r, p.fraction, [100 - p.fraction, 100 / Math.pow(2, p.n + 1), 100 / p.n, p.fraction * 2, 50 / p.n], String).map((v) => `${v}%`);
    },
    explanation(p) {
      return `Each half-life halves the sample: (1/2)^${p.n} x 100% = ${p.fraction}% remains after ${p.n} half-lives. "100 − remaining" confuses what is left with what has decayed.`;
    },
    hint: () => "After n half-lives the fraction remaining is (1/2)^n.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - 100 / Math.pow(2, p.n)) <= 0.01;
    },
  },
  {
    id: "boyle-gas-law",
    topicSlug: "thermodynamics",
    label: "Boyle's law: P1V1 = P2V2",
    params(r) {
      const p1 = int(r, 2, 10) * 50;
      const v1 = int(r, 2, 20) * 10;
      let v2 = int(r, 2, 20) * 5;
      for (let g = 0; g < 40 && (p1 * v1) % v2 !== 0; g++) v2 = int(r, 2, 20) * 5;
      if ((p1 * v1) % v2 !== 0) v2 = 10;
      return { p1, v1, v2, p2: (p1 * v1) / v2 };
    },
    answer: (p) => `${p.p2} kPa`,
    stem(p) {
      return `${p.v1} cm³ of gas at a pressure of ${p.p1} kPa is compressed to ${p.v2} cm³ at constant temperature. What is the new pressure?`;
    },
    distractors(p, r) {
      return pool3(r, p.p2, [(p.p1 * p.v2) / p.v1, p.p1 + p.v1, Math.round(p.p2 / 2), p.p2 * 2, p.p1 * p.v2], String).map((v) => `${v} kPa`);
    },
    explanation(p) {
      return `P1V1 = P2V2 so P2 = (${p.p1} x ${p.v1})/${p.v2} = ${p.p2} kPa. Squeezing the gas to a smaller volume must raise the pressure, never lower it.`;
    },
    hint: () => "At constant temperature, pressure x volume is constant.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.p1 * p.v1) / p.v2) < 1e-9;
    },
  },
  {
    id: "gravitational-pe",
    topicSlug: "mechanics",
    label: "Gravitational potential energy: mgh",
    params(r) {
      const m = int(r, 2, 40);
      const h = int(r, 2, 25);
      return { m, h, pe: m * 10 * h };
    },
    answer: (p) => `${p.pe} J`,
    stem(p) {
      return `A ${p.m} kg load is lifted ${p.h} m vertically at steady speed. What gravitational potential energy does it gain? (g = 10 m/s²)`;
    },
    distractors(p, r) {
      return pool3(r, p.pe, [p.m * p.h, p.m * 10, Math.round(p.pe / 2), p.pe * 2, p.h * 10], String).map((v) => `${v} J`);
    },
    explanation(p) {
      return `Ep = mgh = ${p.m} x 10 x ${p.h} = ${p.pe} J. Forgetting g gives mass x height, which is not an energy.`;
    },
    hint: () => "Potential energy gained = weight x height raised.",
    verify(p, chosen) {
      return parseNum(chosen) === p.m * 10 * p.h;
    },
  },
  {
    id: "lens-formula",
    topicSlug: "waves-optics",
    label: "Thin lens: 1/f = 1/u + 1/v",
    params(r) {
      const f = pick(r, [10, 12, 15, 20, 25]);
      let v = int(r, 2, 20) * 2;
      let u = (f * v) / (v - f);
      for (let g = 0; g < 40 && !(Number.isInteger(u) && u > v); g++) {
        v = int(r, 2, 20) * 2;
        u = (f * v) / (v - f);
      }
      if (!Number.isInteger(u)) {
        v = 2 * f;
        u = 2 * f;
      }
      return { f, u, v };
    },
    answer: (p) => `${p.v} cm`,
    stem(p) {
      return `A converging lens of focal length ${p.f} cm forms an image of an object placed ${p.u} cm from the lens. How far from the lens is the image?`;
    },
    distractors(p, r) {
      return pool3(r, p.v, [p.u - p.f, p.u - 2 * p.f, (p.f * p.u) / (p.u + p.f), p.u + p.f, 2 * p.f], String).map((x) => `${x} cm`);
    },
    explanation(p) {
      return `1/f = 1/u + 1/v so v = fu/(u − f) = ${p.f} x ${p.u}/(${p.u} − ${p.f}) = ${p.v} cm. Using u + f in place of u − f inverts the geometry and gives a virtual-image distance.`;
    },
    hint: () => "Use 1/f = 1/u + 1/v and solve for the image distance.",
    verify(p, chosen) {
      const v = parseNum(chosen);
      return Math.abs(1 / p.f - 1 / p.u - 1 / v) < 1e-9;
    },
  },
  {
    id: "magnification-lens",
    topicSlug: "waves-optics",
    label: "Linear magnification: m = v/u",
    params(r) {
      const u = int(r, 2, 12);
      const m = pick(r, [1.5, 2, 2.5, 3, 4]);
      return { u, m, v: u * m };
    },
    answer: (p) => `${p.m}`,
    stem(p) {
      return `An object ${p.u} cm from a lens has its image formed ${p.v} cm away. What is the linear magnification?`;
    },
    distractors(p, r) {
      return pool3(r, p.m, [p.u / p.v, p.m + 1, p.m - 1, p.m * 2, p.u * p.v], String);
    },
    explanation(p) {
      return `m = v/u = ${p.v}/${p.u} = ${p.m}. Inverting the ratio gives the demagnification factor; m is dimensionless.`;
    },
    hint: () => "Magnification = image distance / object distance.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.v / p.u) < 1e-9;
    },
  },
  {
    id: "electrical-power",
    topicSlug: "electricity-magnetism",
    label: "Electrical power: P = VI",
    params(r) {
      const v = int(r, 2, 24);
      const i = int(r, 1, 12);
      return { v, i, p: v * i };
    },
    answer: (p) => `${p.p} W`,
    stem(p) {
      return `A ${p.v} V supply drives a current of ${p.i} A through a heater. What is the power of the heater?`;
    },
    distractors(p, r) {
      return pool3(r, p.p, [p.v + p.i, p.v / p.i, p.p * 2, p.v * p.v, p.i * p.i], String).map((x) => `${x} W`);
    },
    explanation(p) {
      return `P = VI = ${p.v} x ${p.i} = ${p.p} W. Dividing gives ohms, not watts.`;
    },
    hint: () => "Power in a circuit = voltage x current.",
    verify(p, chosen) {
      return parseNum(chosen) === p.v * p.i;
    },
  },
  {
    id: "heating-effect-current",
    topicSlug: "electricity-magnetism",
    label: "Heating effect: P = I²R",
    params(r) {
      const i = int(r, 1, 6);
      const resistance = int(r, 2, 12);
      return { i, resistance, p: i * i * resistance };
    },
    answer: (p) => `${p.p} W`,
    stem(p) {
      return `A current of ${p.i} A flows through a component of resistance ${p.resistance} Ω. At what rate does the component dissipate energy?`;
    },
    distractors(p, r) {
      return pool3(r, p.p, [p.i * p.resistance, p.i * p.resistance * p.resistance, p.p * 2, Math.round(p.p / 2), p.i + p.resistance], String).map((x) => `${x} W`);
    },
    explanation(p) {
      return `P = I²R = ${p.i}² x ${p.resistance} = ${p.p} W. Using I instead of I² is the commonest slip; the heat produced grows with the SQUARE of the current.`;
    },
    hint: () => "Power dissipated = current squared x resistance.",
    verify(p, chosen) {
      return parseNum(chosen) === p.i * p.i * p.resistance;
    },
  },
  {
    id: "pendulum-period",
    topicSlug: "further-mechanics-fields",
    label: "Simple pendulum: T = 2 pi sqrt(L/g)",
    params(r) {
      const l = pick(r, [0.25, 0.5, 1, 1.5, 2, 2.5]);
      const g = pick(r, [9.8, 10]);
      return { l, g, t: (2 * Math.PI * Math.sqrt(l / g)).toFixed(2) };
    },
    answer: (p) => `${Number(p.t)} s`,
    stem(p) {
      return `A simple pendulum of length ${p.l} m swings with small amplitude. What is its period? (g = ${p.g} m/s²)`;
    },
    distractors(p, r) {
      return pool3(
        r,
        Number(p.t),
        [
          (Math.PI * Math.sqrt(p.l / p.g)).toFixed(2) * 1,
          (2 * Math.PI * Math.sqrt(p.g / p.l)).toFixed(2) * 1,
          (2 * Math.PI * (p.l / p.g)).toFixed(2) * 1,
          (2 * Math.PI * Math.sqrt(p.l / p.g)).toFixed(2) * 2,
        ],
        (v) => `${Number(Number(v).toFixed(2))} s`,
      );
    },
    explanation(p) {
      return `T = 2 pi sqrt(L/g) = 2 x 3.142 x sqrt(${p.l}/${p.g}) = ${Number(p.t)} s. Dropping the 2 halves the period; taking sqrt(g/L) inverts it.`;
    },
    hint: () => "For a simple pendulum T = 2 pi sqrt(L/g) — the period grows with the square root of length.",
    verify(p, chosen) {
      // Key is displayed to 2 dp; allow a hair over the rounding boundary.
      return Math.abs(parseNum(chosen) - 2 * Math.PI * Math.sqrt(p.l / p.g)) <= 0.006;
    },
  },
  {
    id: "centripetal-force",
    topicSlug: "mechanics",
    label: "Circular motion: F = mv²/r",
    params(r) {
      const m = int(r, 2, 10);
      const v = int(r, 2, 8);
      let rr = int(r, 2, 16);
      for (let g = 0; g < 40 && (m * v * v) % rr !== 0; g++) rr = int(r, 2, 16);
      if ((m * v * v) % rr !== 0) rr = 1;
      return { m, v, rr, f: (m * v * v) / rr };
    },
    answer: (p) => `${p.f} N`,
    stem(p) {
      return `A ${p.m} kg mass moves in a circle of radius ${p.rr} m at a steady ${p.v} m/s. What centripetal force keeps it in orbit?`;
    },
    distractors(p, r) {
      return pool3(r, p.f, [(p.m * p.v) / p.rr, p.m * p.v * p.rr, Math.round(p.f / 2), p.f * 2, p.m + p.v], String).map((x) => `${x} N`);
    },
    explanation(p) {
      return `F = mv²/r = ${p.m} x ${p.v}² / ${p.rr} = ${p.f} N. Forgetting the square underestimates the force badly at speed.`;
    },
    hint: () => "Centripetal force = mass x (speed)² / radius.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.m * p.v * p.v) / p.rr) < 1e-9;
    },
  },
  {
    id: "elastic-energy",
    topicSlug: "further-mechanics-fields",
    label: "Elastic energy: E = 1/2 kx²",
    params(r) {
      const k = int(r, 1, 20) * 2; // even keeps 1/2 kx² integral
      const x = int(r, 1, 8);
      return { k, x, e: (k * x * x) / 2 };
    },
    answer: (p) => `${p.e} J`,
    stem(p) {
      return `A spring of spring constant ${p.k} N/m is stretched ${p.x} m from its natural length. How much elastic energy is stored?`;
    },
    distractors(p, r) {
      return pool3(r, p.e, [p.k * p.x, p.k * p.x * p.x, (p.k * p.x) / 2, p.e * 2, p.k + p.x], String).map((v) => `${v} J`);
    },
    explanation(p) {
      return `E = 1/2 kx² = 0.5 x ${p.k} x ${p.x}² = ${p.e} J. kx is the FORCE, not the energy; the energy grows with the square of the extension.`;
    },
    hint: () => "Elastic energy = half x spring constant x extension squared.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.k * p.x * p.x) / 2;
    },
  },
  {
    id: "kinetic-energy",
    topicSlug: "mechanics",
    label: "Kinetic energy: E = 1/2 mv²",
    params(r) {
      const m = int(r, 1, 10) * 2;
      const v = int(r, 2, 10);
      return { m, v, e: (m * v * v) / 2 };
    },
    answer: (p) => `${p.e} J`,
    stem(p) {
      return `What is the kinetic energy of a ${p.m} kg body moving at ${p.v} m/s?`;
    },
    distractors(p, r) {
      return pool3(r, p.e, [p.m * p.v, p.m * p.v * p.v, (p.m * p.v) / 2, p.e * 2, p.m + p.v], String).map((v) => `${v} J`);
    },
    explanation(p) {
      return `Ek = 1/2 mv² = 0.5 x ${p.m} x ${p.v}² = ${p.e} J. Without the square, doubling the speed would only double the energy — it actually quadruples it.`;
    },
    hint: () => "Kinetic energy = half x mass x speed squared.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.m * p.v * p.v) / 2;
    },
  },
  {
    id: "charles-gas-law",
    topicSlug: "thermodynamics",
    label: "Charles's law: V1/T1 = V2/T2 (kelvin)",
    params(r) {
      const t1 = int(r, 2, 8) * 50; // kelvin
      const v1 = int(r, 2, 10) * 10;
      let t2 = int(r, 2, 8) * 50;
      for (let g = 0; g < 40 && (v1 * t2) % t1 !== 0; g++) t2 = int(r, 2, 8) * 50;
      if ((v1 * t2) % t1 !== 0) t2 = 2 * t1;
      return { t1, v1, t2, v2: (v1 * t2) / t1 };
    },
    answer: (p) => `${p.v2} cm³`,
    stem(p) {
      return `A gas occupies ${p.v1} cm³ at ${p.t1} K. What volume does it occupy at ${p.t2} K if the pressure stays constant?`;
    },
    distractors(p, r) {
      return pool3(r, p.v2, [(p.v1 * p.t1) / p.t2, Math.round(p.v2 / 2), p.v2 * 2, p.v1 + p.t2, p.v1 * p.t2], String).map((v) => `${v} cm³`);
    },
    explanation(p) {
      return `V1/T1 = V2/T2 so V2 = V1 x T2/T1 = ${p.v1} x ${p.t2}/${p.t1} = ${p.v2} cm³. Temperatures MUST be in kelvin, and heating a gas at constant pressure expands it.`;
    },
    hint: () => "At constant pressure, volume is proportional to kelvin temperature.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.v1 * p.t2) / p.t1) < 1e-9;
    },
  },
  {
    id: "acceleration-from-speeds",
    topicSlug: "mechanics",
    label: "Acceleration: a = (v − u)/t",
    params(r) {
      const u = int(r, 0, 12);
      const a = int(r, 1, 8);
      const t = int(r, 2, 10);
      return { u, a, t, v: u + a * t };
    },
    answer: (p) => `${p.a} m/s²`,
    stem(p) {
      return `A train speeds up from ${p.u} m/s to ${p.v} m/s in ${p.t} s. What is its acceleration?`;
    },
    distractors(p, r) {
      return pool3(r, p.a, [(p.v - p.u) * p.t, p.v / p.t, (p.v + p.u) / p.t, p.a * 2, p.v - p.u], String).map((x) => `${x} m/s²`);
    },
    explanation(p) {
      return `a = (v − u)/t = (${p.v} − ${p.u})/${p.t} = ${p.a} m/s². Multiplying instead of dividing treats the speed change as an acceleration; the average of the speeds is not an acceleration.`;
    },
    hint: () => "Acceleration is the change in velocity divided by the time taken.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.v - p.u) / p.t;
    },
  },
];
