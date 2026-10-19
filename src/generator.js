// JAMB Question Generator — Agent 2 PQ Integrator
// Generates cloned-variant questions at scale for JAMB/UTME.
// Each generated question has coreId + core (formula/structure/difficulty)
// and a global cloned-variant text with matched options.
// Version A (official SA/TZ) slots are marked pending-agent3.

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(correct, distractors) {
  const opts = shuffleArr([correct, ...distractors.slice(0, 3)]);
  return { options: opts, answer: correct };
}

function fmt(n) {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

let seq = 0;
function nextId(prefix) {
  seq++;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

// ============ MATH GENERATORS ============

function genLinearEquation() {
  const a = 2 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 20);
  const c = b + a * (1 + Math.floor(Math.random() * 15));
  const x = (c - b) / a;
  const text = `Solve for x: ${a}x + ${b} = ${c}`;
  const { options, answer } = shuffleOptions(
    `x = ${x}`,
    [`x = ${x + 1}`, `x = ${x - 1}`, `x = ${x + 2}`]
  );
  return {
    id: nextId("mg"), subject: "math", coreId: "core-linear-equation-gen", type: "mcq",
    core: { formula: "x = (c - b) / a", structure: "solve linear equation ax + b = c", difficulty: "easy" },
    versions: {
      official: { text: "Solve for x: 3x + 7 = 22", answer: "x = 5", options: ["x = 5", "x = 4", "x = 6", "x = 7"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genQuadraticFactoring() {
  const r1 = 1 + Math.floor(Math.random() * 8);
  const r2 = -(1 + Math.floor(Math.random() * 8));
  const b = -(r1 + r2);
  const c = r1 * r2;
  const text = `Solve for x: x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0`;
  const correct = `x = ${r1} or x = ${r2}`;
  const { options, answer } = shuffleOptions(correct, [
    `x = ${-r1} or x = ${-r2}`,
    `x = ${r1} or x = ${-r2}`,
    `x = ${-r1} or x = ${r2}`,
  ]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-quadratic-factoring-gen", type: "mcq",
    core: { formula: "(x - r₁)(x - r₂) = 0", structure: "solve quadratic by factoring", difficulty: "medium" },
    versions: {
      official: { text: "Solve for x: x(x - 5) = 0", answer: "x = 0 or x = 5", options: ["x = 0 or x = 5", "x = 5 only", "x = -5 or x = 0", "x = 1 or x = 5"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genPercentage() {
  const base = (2 + Math.floor(Math.random() * 18)) * 50;
  const rate = pick([5, 10, 12, 15, 20, 25]);
  const increase = (base * rate) / 100;
  const result = base + increase;
  const text = `A trader marks a good for ₦${base} and adds ${rate}% profit. What is the selling price?`;
  const { options, answer } = shuffleOptions(`₦${fmt(result)}`, [
    `₦${fmt(base + increase * 0.5)}`,
    `₦${fmt(result + increase)}`,
    `₦${fmt(base)}`,
  ]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-percentage-profit-gen", type: "mcq",
    core: { formula: "SP = CP × (1 + rate/100)", structure: "percentage profit calculation", difficulty: "easy" },
    versions: {
      official: { text: "A good costs R400 and is sold at a 25% profit. Find the selling price.", answer: "R500", options: ["R500", "R450", "R520", "R400"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genSimpleInterest() {
  const P = (1 + Math.floor(Math.random() * 10)) * 1000;
  const r = pick([4, 5, 6, 8, 10, 12]);
  const t = 2 + Math.floor(Math.random() * 5);
  const A = P * (1 + (r / 100) * t);
  const text = `If ₦${P} is invested at ${r}% simple interest per annum, what amount will be available after ${t} years?`;
  const { options, answer } = shuffleOptions(`₦${fmt(A)}`, [
    `₦${fmt(P * (1 + (r / 100) * (t + 1)))}`,
    `₦${fmt(P * (1 + (r / 100) * (t - 1)))}`,
    `₦${fmt(P)}`,
  ]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-simple-interest-gen", type: "mcq",
    core: { formula: "A = P(1 + rt)", structure: "simple interest calculation", difficulty: "medium" },
    versions: {
      official: { text: "Find the amount on R8,000 invested at 10% p.a. for 3 years (simple interest).", answer: "R10,400", options: ["R10,400", "R10,000", "R9,600", "R11,000"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genPythagoras() {
  const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [10, 24, 26], [20, 21, 29]];
  const [a, b, c] = pick(triples);
  const text = `A right-angled triangle has legs ${a} cm and ${b} cm. Find the hypotenuse.`;
  const { options, answer } = shuffleOptions(`${c} cm`, [`${a + b} cm`, `${c + 2} cm`, `${c - 2} cm`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-pythagoras-gen", type: "mcq",
    core: { formula: "a² + b² = c²", structure: "Pythagorean theorem application", difficulty: "easy" },
    versions: {
      official: { text: "A right-angled triangle has legs 5 cm and 12 cm. Find the hypotenuse.", answer: "13 cm", options: ["13 cm", "17 cm", "15 cm", "11 cm"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genMean() {
  const n = 5;
  const mean = 5 + Math.floor(Math.random() * 15);
  const values = [];
  for (let i = 0; i < n - 1; i++) values.push(mean - 2 + Math.floor(Math.random() * 5));
  values.push(mean * n - values.reduce((s, v) => s + v, 0));
  const text = `Find the mean of: ${values.join(", ")}.`;
  const { options, answer } = shuffleOptions(`${mean}`, [`${mean + 1}`, `${mean - 1}`, `${mean + 2}`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-mean-gen", type: "mcq",
    core: { formula: "mean = Σx / n", structure: "calculate mean", difficulty: "easy" },
    versions: {
      official: { text: "Find the mean of: 3, 7, 9, 11, 10.", answer: "8", options: ["8", "7", "9", "10"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genLogarithm() {
  const bases = [2, 3, 5, 10];
  const b = pick(bases);
  const e = 2 + Math.floor(Math.random() * 4);
  const val = Math.pow(b, e);
  const text = `Evaluate: log${subscript(b)} ${val}`;
  const { options, answer } = shuffleOptions(`${e}`, [`${e + 1}`, `${e - 1}`, `${e + 2}`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-log-gen", type: "mcq",
    core: { formula: "log_b(x) = y ⟺ bʸ = x", structure: "evaluate logarithm", difficulty: "medium" },
    versions: {
      official: { text: "Evaluate: log₂ 64", answer: "6", options: ["6", "5", "7", "8"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function subscript(n) {
  const map = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
  return String(n).split("").map((d) => map[d]).join("");
}

function genCircleArea() {
  const r = 3 + Math.floor(Math.random() * 12);
  const area = 3.14 * r * r;
  const text = `A circle has a radius of ${r} m. What is its area? (Take π = 3.14)`;
  const { options, answer } = shuffleOptions(`${fmt(area)} m²`, [
    `${fmt(3.14 * (r + 1) * (r + 1))} m²`,
    `${fmt(2 * 3.14 * r)} m²`,
    `${fmt(3.14 * r)} m²`,
  ]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-circle-area-gen", type: "mcq",
    core: { formula: "A = πr²", structure: "area of circle", difficulty: "easy" },
    versions: {
      official: { text: "Find the area of a circle with radius 14 cm. (π = 22/7)", answer: "616 cm²", options: ["616 cm²", "88 cm²", "440 cm²", "154 cm²"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genAP() {
  const a = 1 + Math.floor(Math.random() * 10);
  const d = 2 + Math.floor(Math.random() * 8);
  const n = 10 + Math.floor(Math.random() * 20);
  const Tn = a + (n - 1) * d;
  const text = `Find the ${n}th term of the AP: ${a}, ${a + d}, ${a + 2 * d}, ...`;
  const { options, answer } = shuffleOptions(`${Tn}`, [`${Tn + d}`, `${Tn - d}`, `${Tn + 2 * d}`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-ap-gen", type: "mcq",
    core: { formula: "Tₙ = a + (n-1)d", structure: "arithmetic progression nth term", difficulty: "medium" },
    versions: {
      official: { text: "Find the 20th term of the AP: 5, 9, 13, ...", answer: "81", options: ["81", "77", "85", "89"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genAreaRectangle() {
  const l = 4 + Math.floor(Math.random() * 15);
  const w = 3 + Math.floor(Math.random() * 10);
  const text = `A rectangular field is ${l} m long and ${w} m wide. What is its area?`;
  const { options, answer } = shuffleOptions(`${l * w} m²`, [`${2 * (l + w)} m²`, `${(l + w) * w} m²`, `${l * (w + 2)} m²`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-rectangle-area-gen", type: "mcq",
    core: { formula: "A = l × w", structure: "area of rectangle", difficulty: "easy" },
    versions: {
      official: { text: "A room is 8 m long and 5 m wide. What is its area?", answer: "40 m²", options: ["40 m²", "26 m²", "13 m²", "45 m²"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genRatio() {
  const ratio = pick([[2, 3], [3, 4], [4, 5], [5, 7], [3, 5], [2, 5]]);
  const total = (ratio[0] + ratio[1]) * (2 + Math.floor(Math.random() * 8));
  const partA = (total * ratio[0]) / (ratio[0] + ratio[1]);
  const text = `Divide ₦${total} in the ratio ${ratio[0]}:${ratio[1]}. What is the smaller share?`;
  const { options, answer } = shuffleOptions(`₦${fmt(partA)}`, [
    `₦${fmt(total - partA)}`,
    `₦${fmt(partA + 10)}`,
    `₦${fmt(partA / 2)}`,
  ]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-ratio-gen", type: "mcq",
    core: { formula: "part = (share / total_ratio) × ratio", structure: "ratio division", difficulty: "easy" },
    versions: {
      official: { text: "Divide R600 in the ratio 2:3. What is the smaller share?", answer: "R240", options: ["R240", "R360", "R200", "R300"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genSpeedDistance() {
  const d = (2 + Math.floor(Math.random() * 10)) * 60;
  const t = 2 + Math.floor(Math.random() * 6);
  const s = d / t;
  const text = `A car travels ${d} km in ${t} hours. What is its average speed?`;
  const { options, answer } = shuffleOptions(`${s} km/h`, [`${s + 10} km/h`, `${s - 10} km/h`, `${d} km/h`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-speed-gen", type: "mcq",
    core: { formula: "speed = distance / time", structure: "average speed", difficulty: "easy" },
    versions: {
      official: { text: "A train covers 360 km in 4 hours. What is its speed?", answer: "90 km/h", options: ["90 km/h", "80 km/h", "100 km/h", "75 km/h"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genProfitLoss() {
  const cp = (5 + Math.floor(Math.random() * 15)) * 100;
  const lossPct = pick([10, 15, 20, 25]);
  const sp = cp - (cp * lossPct) / 100;
  const text = `A trader sells an item for ₦${fmt(sp)} after buying it for ₦${cp}. What is the percentage loss?`;
  const { options, answer } = shuffleOptions(`${lossPct}%`, [`${lossPct + 5}%`, `${lossPct - 5}%`, `${lossPct + 10}%`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-loss-gen", type: "mcq",
    core: { formula: "loss% = (loss / CP) × 100", structure: "percentage loss", difficulty: "medium" },
    versions: {
      official: { text: "An item bought for R500 is sold at a 20% loss. Find the selling price.", answer: "R400", options: ["R400", "R450", "R350", "R600"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genSetOperation() {
  const setA = [1, 2, 3, 4, 5, 6];
  const setB = [4, 5, 6, 7, 8, 9];
  const inter = setA.filter((x) => setB.includes(x));
  const text = `If A = {1,2,3,4,5,6} and B = {4,5,6,7,8,9}, find A ∩ B.`;
  const correct = `{${inter.join(", ")}}`;
  const { options, answer } = shuffleOptions(correct, ["{1,2,3}", "{7,8,9}", "∅"]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-sets-gen", type: "mcq",
    core: { formula: "A ∩ B = elements in both", structure: "set intersection", difficulty: "easy" },
    versions: {
      official: { text: "If A = {1,2,3,4} and B = {3,4,5,6}, find A ∩ B.", answer: "{3, 4}", options: ["{3, 4}", "{1, 2}", "{5, 6}", "∅"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genIndices() {
  const base = 2 + Math.floor(Math.random() * 5);
  const a = 2 + Math.floor(Math.random() * 5);
  const b = 1 + Math.floor(Math.random() * 4);
  const result = base ** (a + b);
  const text = `Simplify: ${base}^${a} × ${base}^${b}`;
  const { options, answer } = shuffleOptions(`${base}^${a + b}`, [`${base}^${a * b}`, `${base}^${a - b}`, `${base * base}^${a}`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-indices-gen", type: "mcq",
    core: { formula: "aᵐ × aⁿ = aᵐ⁺ⁿ", structure: "indices simplification", difficulty: "easy" },
    versions: {
      official: { text: "Simplify: 2³ × 2⁴", answer: "2⁷", options: ["2⁷", "2¹²", "2", "4⁷"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genStdDeviation() {
  const vals = [2, 4, 4, 4, 5, 5, 7, 9];
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
  const sd = Math.sqrt(variance);
  const text = `Find the standard deviation of: ${vals.join(", ")}.`;
  const { options, answer } = shuffleOptions(`${fmt(sd)}`, [`${fmt(sd + 1)}`, `${fmt(sd - 1)}`, `${fmt(variance)}`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-stddev-gen", type: "mcq",
    core: { formula: "σ = √(Σ(x-μ)²/n)", structure: "standard deviation", difficulty: "hard" },
    versions: {
      official: { text: "Find the standard deviation of: 2, 4, 4, 4, 5, 5, 7, 9.", answer: "2", options: ["2", "4", "1", "3"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genCompoundInterest() {
  const P = (1 + Math.floor(Math.random() * 8)) * 2000;
  const r = pick([5, 10, 15, 20]);
  const t = 2 + Math.floor(Math.random() * 3);
  const A = P * (1 + r / 100) ** t;
  const text = `Find the compound amount on ₦${P} at ${r}% per annum for ${t} years.`;
  const { options, answer } = shuffleOptions(`₦${fmt(Math.round(A))}`, [
    `₦${fmt(P * (1 + (r / 100) * t))}`,
    `₦${fmt(P + 100)}`,
    `₦${fmt(P)}`,
  ]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-compound-interest-gen", type: "mcq",
    core: { formula: "A = P(1 + r/100)ᵗ", structure: "compound interest", difficulty: "medium" },
    versions: {
      official: { text: "Find the compound amount on R10,000 at 10% p.a. for 2 years.", answer: "R12,100", options: ["R12,100", "R12,000", "R11,000", "R10,100"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genTrigValue() {
  const angles = [
    { deg: 30, sin: "1/2", cos: "√3/2", tan: "1/√3" },
    { deg: 45, sin: "√2/2", cos: "√2/2", tan: "1" },
    { deg: 60, sin: "√3/2", cos: "1/2", tan: "√3" },
    { deg: 90, sin: "1", cos: "0", tan: "undefined" },
    { deg: 0, sin: "0", cos: "1", tan: "0" },
    { deg: 180, sin: "0", cos: "-1", tan: "0" },
  ];
  const a = pick(angles);
  const trig = pick(["sin", "cos", "tan"]);
  const text = `What is ${trig} ${a.deg}°?`;
  const correct = a[trig];
  const { options, answer } = shuffleOptions(correct, pick(angles).sin !== correct ? [pick(angles).sin, pick(angles).cos, pick(angles).tan] : ["0", "1", "-1"]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-trig-value-gen", type: "mcq",
    core: { formula: "trigonometric ratios of special angles", structure: "exact trig values", difficulty: "medium" },
    versions: {
      official: { text: "What is sin 30°?", answer: "1/2", options: ["1/2", "√2/2", "√3/2", "1"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genSimultaneous() {
  const x = 1 + Math.floor(Math.random() * 6);
  const y = 1 + Math.floor(Math.random() * 6);
  const a1 = 1 + Math.floor(Math.random() * 4);
  const b1 = 1 + Math.floor(Math.random() * 4);
  const a2 = 1 + Math.floor(Math.random() * 4);
  const b2 = 1 + Math.floor(Math.random() * 4);
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  if (a1 * b2 - a2 * b1 === 0) return genSimultaneous();
  const text = `Solve the simultaneous equations: ${a1}x + ${b1}y = ${c1} and ${a2}x + ${b2}y = ${c2}.`;
  const correct = `x = ${x}, y = ${y}`;
  const { options, answer } = shuffleOptions(correct, [
    `x = ${y}, y = ${x}`,
    `x = ${x + 1}, y = ${y}`,
    `x = ${x}, y = ${y + 1}`,
  ]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-simultaneous-gen", type: "mcq",
    core: { formula: "elimination/substitution", structure: "solve simultaneous equations", difficulty: "medium" },
    versions: {
      official: { text: "Solve: x + y = 10 and x - y = 4.", answer: "x = 7, y = 3", options: ["x = 7, y = 3", "x = 3, y = 7", "x = 6, y = 4", "x = 5, y = 5"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genVennDiagram() {
  const onlyA = 10 + Math.floor(Math.random() * 15);
  const onlyB = 8 + Math.floor(Math.random() * 12);
  const both = 5 + Math.floor(Math.random() * 8);
  const total = onlyA + onlyB + both;
  const text = `In a survey, ${onlyA} students like maths only, ${onlyB} like English only, and ${both} like both. How many students were surveyed?`;
  const { options, answer } = shuffleOptions(`${total}`, [`${onlyA + onlyB}`, `${both}`, `${total - both}`]);
  return {
    id: nextId("mg"), subject: "math", coreId: "core-venn-gen", type: "mcq",
    core: { formula: "n(A∪B) = n(A) + n(B) - n(A∩B)", structure: "Venn diagram word problem", difficulty: "easy" },
    versions: {
      official: { text: "In a class, 15 like physics, 12 like chemistry, and 5 like both. How many like at least one?", answer: "22", options: ["22", "27", "5", "15"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

// ============ PHYSICS GENERATORS ============

function genNewton2() {
  const m = 2 + Math.floor(Math.random() * 15);
  const F = (2 + Math.floor(Math.random() * 10)) * 5;
  const a = F / m;
  const text = `A force of ${F} N acts on a mass of ${m} kg. What is the acceleration?`;
  const { options, answer } = shuffleOptions(`${fmt(a)} m/s²`, [`${fmt(a + 2)} m/s²`, `${fmt(a - 2)} m/s²`, `${F} m/s²`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-newton2-gen", type: "mcq",
    core: { formula: "a = F/m", structure: "Newton's second law", difficulty: "easy" },
    versions: {
      official: { text: "A force of 30 N acts on a 6 kg mass. Find the acceleration.", answer: "5 m/s²", options: ["5 m/s²", "4 m/s²", "6 m/s²", "180 m/s²"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genKineticEnergy() {
  const m = 1 + Math.floor(Math.random() * 10);
  const v = 2 + Math.floor(Math.random() * 10);
  const KE = 0.5 * m * v * v;
  const text = `Calculate the kinetic energy of a ${m} kg object moving at ${v} m/s.`;
  const { options, answer } = shuffleOptions(`${fmt(KE)} J`, [`${fmt(m * v)} J`, `${fmt(2 * KE)} J`, `${fmt(KE * 2)} J`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-ke-gen", type: "mcq",
    core: { formula: "KE = ½mv²", structure: "kinetic energy", difficulty: "medium" },
    versions: {
      official: { text: "A 3 kg body moves at 4 m/s. What is its kinetic energy?", answer: "24 J", options: ["24 J", "12 J", "48 J", "7 J"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genWork() {
  const F = 5 + Math.floor(Math.random() * 30);
  const d = 3 + Math.floor(Math.random() * 12);
  const W = F * d;
  const text = `A force of ${F} N moves an object ${d} m in the direction of the force. Calculate the work done.`;
  const { options, answer } = shuffleOptions(`${W} J`, [`${F + d} J`, `${d} J`, `${F} J`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-work-gen", type: "mcq",
    core: { formula: "W = F × d", structure: "work done", difficulty: "easy" },
    versions: {
      official: { text: "How much work is done when a 20 N force pushes an object 8 m?", answer: "160 J", options: ["160 J", "28 J", "8 J", "20 J"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genPower() {
  const W = 50 + Math.floor(Math.random() * 500);
  const t = 2 + Math.floor(Math.random() * 10);
  const P = W / t;
  const text = `${W} J of work is done in ${t} seconds. What is the power?`;
  const { options, answer } = shuffleOptions(`${fmt(P)} W`, [`${fmt(W + t)} W`, `${W} W`, `${t} W`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-power-gen", type: "mcq",
    core: { formula: "P = W/t", structure: "power calculation", difficulty: "easy" },
    versions: {
      official: { text: "What is the power of a machine that does 600 J of work in 10 s?", answer: "60 W", options: ["60 W", "600 W", "10 W", "6 W"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genDensity() {
  const m = 10 + Math.floor(Math.random() * 90);
  const V = (1 + Math.floor(Math.random() * 9)) / 10;
  const ρ = m / V;
  const text = `A substance has a mass of ${m} kg and a volume of ${V} m³. What is its density?`;
  const { options, answer } = shuffleOptions(`${fmt(ρ)} kg/m³`, [`${fmt(ρ * 2)} kg/m³`, `${fmt(ρ / 2)} kg/m³`, `${m} kg/m³`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-density-gen", type: "mcq",
    core: { formula: "ρ = m/V", structure: "density calculation", difficulty: "easy" },
    versions: {
      official: { text: "Find the density of a substance of mass 50 kg and volume 0.25 m³.", answer: "200 kg/m³", options: ["200 kg/m³", "20 kg/m³", "100 kg/m³", "25 kg/m³"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genOhmsLaw() {
  const I = 1 + Math.floor(Math.random() * 10);
  const R = 3 + Math.floor(Math.random() * 20);
  const V = I * R;
  const text = `A resistor of ${R} Ω carries a current of ${I} A. What is the voltage across it?`;
  const { options, answer } = shuffleOptions(`${V} V`, [`${R} V`, `${I} V`, `${R + I} V`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-ohm-gen", type: "mcq",
    core: { formula: "V = IR", structure: "Ohm's law calculation", difficulty: "easy" },
    versions: {
      official: { text: "What voltage is needed to drive 3 A through a 5 Ω resistor?", answer: "15 V", options: ["15 V", "8 V", "2 V", "1.67 V"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genWave() {
  const v = (2 + Math.floor(Math.random() * 8)) * 100;
  const f = v / (1 + Math.floor(Math.random() * 5));
  const λ = v / f;
  const text = `A wave travels at ${v} m/s with a frequency of ${f} Hz. What is its wavelength?`;
  const { options, answer } = shuffleOptions(`${λ} m`, [`${v} m`, `${f} m`, `${v * f} m`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-wave-gen", type: "mcq",
    core: { formula: "λ = v/f", structure: "wave equation", difficulty: "medium" },
    versions: {
      official: { text: "A wave of frequency 50 Hz travels at 200 m/s. Find its wavelength.", answer: "4 m", options: ["4 m", "50 m", "200 m", "0.25 m"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genHeatCapacity() {
  const m = 1 + Math.floor(Math.random() * 5);
  const c = pick([4200, 900, 385, 139]);
  const ΔT = 10 + Math.floor(Math.random() * 40);
  const Q = m * c * ΔT;
  const text = `How much heat is needed to raise ${m} kg of a substance by ${ΔT}°C? (c = ${c} J/kg°C)`;
  const { options, answer } = shuffleOptions(`${fmt(Q)} J`, [`${fmt(Q / 2)} J`, `${fmt(Q * 2)} J`, `${fmt(m * ΔT)} J`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-heat-gen", type: "mcq",
    core: { formula: "Q = mcΔT", structure: "heat energy calculation", difficulty: "medium" },
    versions: {
      official: { text: "Calculate the heat needed to raise 3 kg of water by 40°C. (c = 4200 J/kg°C)", answer: "504,000 J", options: ["504,000 J", "252,000 J", "126,000 J", "16,800 J"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genPotentialEnergy() {
  const m = 2 + Math.floor(Math.random() * 15);
  const h = 5 + Math.floor(Math.random() * 25);
  const g = 10;
  const PE = m * g * h;
  const text = `What is the gravitational potential energy of a ${m} kg mass at a height of ${h} m? (g = 10 m/s²)`;
  const { options, answer } = shuffleOptions(`${fmt(PE)} J`, [`${fmt(PE / 2)} J`, `${fmt(m * h)} J`, `${fmt(g * h)} J`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-pe-gen", type: "mcq",
    core: { formula: "PE = mgh", structure: "gravitational potential energy", difficulty: "medium" },
    versions: {
      official: { text: "Calculate the PE of a 5 kg object at 20 m. (g = 10 m/s²)", answer: "1000 J", options: ["1000 J", "500 J", "200 J", "100 J"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genFrequencyWavelength() {
  const v = 340;
  const f = pick([170, 85, 340, 68, 34]);
  const λ = v / f;
  const text = `A sound wave travels at 340 m/s with a frequency of ${f} Hz. What is its wavelength?`;
  const { options, answer } = shuffleOptions(`${λ} m`, [`${f} m`, `${v} m`, `${v * f} m`]);
  return {
    id: nextId("pg"), subject: "physics", coreId: "core-sound-wave-gen", type: "mcq",
    core: { formula: "λ = v/f", structure: "sound wave calculation", difficulty: "medium" },
    versions: {
      official: { text: "A sound wave has a frequency of 200 Hz and speed 340 m/s. Find its wavelength.", answer: "1.7 m", options: ["1.7 m", "2 m", "68,000 m", "0.59 m"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

// ============ CHEMISTRY GENERATORS ============

function genMolarMass() {
  const compounds = [
    { formula: "NaCl", mass: 58.5, text: "sodium chloride (NaCl)" },
    { formula: "CaCO₃", mass: 100, text: "calcium carbonate (CaCO₃)" },
    { formula: "MgO", mass: 40.3, text: "magnesium oxide (MgO)" },
    { formula: "H₂SO₄", mass: 98, text: "sulphuric acid (H₂SO₄)" },
    { formula: "KOH", mass: 56.1, text: "potassium hydroxide (KOH)" },
    { formula: "Al₂O₃", mass: 102, text: "aluminium oxide (Al₂O₃)" },
    { formula: "Fe₂O₃", mass: 160, text: "iron(III) oxide (Fe₂O₃)" },
    { formula: "NH₃", mass: 17, text: "ammonia (NH₃)" },
    { formula: "C₂H₅OH", mass: 46, text: "ethanol (C₂H₅OH)" },
    { formula: "SiO₂", mass: 60, text: "silicon dioxide (SiO₂)" },
  ];
  const c = pick(compounds);
  const text = `What is the molar mass of ${c.text}?`;
  const { options, answer } = shuffleOptions(`${c.mass} g/mol`, [
    `${c.mass + 10} g/mol`,
    `${c.mass - 10} g/mol`,
    `${c.mass * 2} g/mol`,
  ]);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-molarmass-gen", type: "mcq",
    core: { formula: "molar mass = sum of atomic masses", structure: "molar mass calculation", difficulty: "medium" },
    versions: {
      official: { text: "What is the molar mass of calcium carbonate (CaCO₃)?", answer: "100 g/mol", options: ["100 g/mol", "90 g/mol", "110 g/mol", "56 g/mol"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genMoleConversion() {
  const n = 1 + Math.floor(Math.random() * 10);
  const N = n * 6.02e23;
  const text = `How many molecules are in ${n} mole of a substance?`;
  const { options, answer } = shuffleOptions(`${n} × 6.02 × 10²³`, [
    `${n + 1} × 6.02 × 10²³`,
    `6.02 × 10²³`,
    `${n} × 6.02 × 10²²`,
  ]);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-mole-conv-gen", type: "mcq",
    core: { formula: "N = n × Avogadro's number", structure: "mole to particles conversion", difficulty: "easy" },
    versions: {
      official: { text: "How many atoms are in 2 moles of carbon? (Avogadro = 6.02 × 10²³)", answer: "1.204 × 10²⁴", options: ["1.204 × 10²⁴", "6.02 × 10²³", "3.01 × 10²³", "1.204 × 10²³"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genPHValue() {
  const scenarios = [
    { text: "lemon juice", ph: 2 },
    { text: "vinegar", ph: 3 },
    { text: "black coffee", ph: 5 },
    { text: "pure water", ph: 7 },
    { text: "blood", ph: 7.4 },
    { text: "soap solution", ph: 9 },
    { text: "ammonia solution", ph: 11 },
    { text: "battery acid", ph: 1 },
    { text: "hand soap", ph: 10 },
    { text: "soda", ph: 3 },
  ];
  const s = pick(scenarios);
  const text = `What is the approximate pH of ${s.text}?`;
  const { options, answer } = shuffleOptions(`${s.ph}`, [`${s.ph + 2}`, `${s.ph - 2}`, `${s.ph + 4}`]);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-ph-gen", type: "mcq",
    core: { formula: "pH scale 0-14", structure: "pH identification", difficulty: "easy" },
    versions: {
      official: { text: "What is the pH of lemon juice?", answer: "2", options: ["2", "5", "7", "12"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genBondType() {
  const bonds = [
    { text: "Na and Cl", answer: "Ionic", wrong: ["Covalent", "Metallic", "Hydrogen"] },
    { text: "H and H in H₂", answer: "Covalent", wrong: ["Ionic", "Metallic", "Van der Waals"] },
    { text: "Fe atoms in iron metal", answer: "Metallic", wrong: ["Covalent", "Ionic", "Hydrogen"] },
    { text: "C and O in CO₂", answer: "Covalent", wrong: ["Ionic", "Metallic", "Coordinate"] },
    { text: "Mg and O", answer: "Ionic", wrong: ["Covalent", "Metallic", "Polar"] },
    { text: "two water molecules", answer: "Hydrogen", wrong: ["Ionic", "Covalent", "Metallic"] },
    { text: "K and Br", answer: "Ionic", wrong: ["Covalent", "Metallic", "Dative"] },
    { text: "N and N in N₂", answer: "Covalent", wrong: ["Ionic", "Metallic", "Hydrogen"] },
  ];
  const b = pick(bonds);
  const text = `What type of bond forms between ${b.text}?`;
  const { options, answer } = shuffleOptions(b.answer, b.wrong);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-bond-gen", type: "mcq",
    core: { formula: "bond type from element combination", structure: "chemical bonding", difficulty: "easy" },
    versions: {
      official: { text: "What type of bond forms between magnesium and oxygen?", answer: "Ionic", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genStoichiometry() {
  const mols = 1 + Math.floor(Math.random() * 5);
  const ratio = pick([[1, 1], [2, 1], [1, 2], [2, 3], [3, 2]]);
  const product = mols * (ratio[1] / ratio[0]);
  const text = `In a reaction with mole ratio ${ratio[0]}:${ratio[1]}, how many moles of product form from ${mols} moles of reactant?`;
  const { options, answer } = shuffleOptions(`${product}`, [`${product + 1}`, `${product * 2}`, `${mols}`]);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-stoich-gen", type: "mcq",
    core: { formula: "mole ratio from balanced equation", structure: "stoichiometry", difficulty: "medium" },
    versions: {
      official: { text: "In 2H₂ + O₂ → 2H₂O, how many moles of H₂O are produced from 3 moles of O₂?", answer: "6", options: ["6", "3", "2", "1"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genElectronConfig() {
  const elements = [
    { name: "sodium (Na, Z=11)", config: "2, 8, 1", wrong: ["2, 8, 2", "2, 8, 3", "2, 8, 8"] },
    { name: "chlorine (Cl, Z=17)", config: "2, 8, 7", wrong: ["2, 8, 8", "2, 8, 6", "2, 8, 5"] },
    { name: "magnesium (Mg, Z=12)", config: "2, 8, 2", wrong: ["2, 8, 1", "2, 8, 3", "2, 8, 8"] },
    { name: "potassium (K, Z=19)", config: "2, 8, 8, 1", wrong: ["2, 8, 9", "2, 8, 8, 2", "2, 8, 7, 2"] },
    { name: "argon (Ar, Z=18)", config: "2, 8, 8", wrong: ["2, 8, 7", "2, 8, 9", "2, 8, 8, 1"] },
    { name: "carbon (C, Z=6)", config: "2, 4", wrong: ["2, 6", "2, 2", "2, 8"] },
    { name: "oxygen (O, Z=8)", config: "2, 6", wrong: ["2, 8", "2, 4", "2, 2"] },
    { name: "phosphorus (P, Z=15)", config: "2, 8, 5", wrong: ["2, 8, 3", "2, 8, 7", "2, 8, 8"] },
  ];
  const e = pick(elements);
  const text = `Write the electron configuration of ${e.name}.`;
  const { options, answer } = shuffleOptions(e.config, e.wrong);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-econfig-gen", type: "mcq",
    core: { formula: "electrons per shell from atomic number", structure: "electron configuration", difficulty: "medium" },
    versions: {
      official: { text: "Write the electron configuration of chlorine (Z = 17).", answer: "2, 8, 7", options: ["2, 8, 7", "2, 8, 8", "2, 8, 6", "2, 8, 5"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genOxidationState() {
  const items = [
    { text: "sodium in NaCl", answer: "+1", wrong: ["-1", "+2", "-2"] },
    { text: "chlorine in NaCl", answer: "-1", wrong: ["+1", "-2", "+2"] },
    { text: "hydrogen in H₂O", answer: "+1", wrong: ["-1", "+2", "0"] },
    { text: "oxygen in CO₂", answer: "-2", wrong: ["+2", "-1", "+4"] },
    { text: "carbon in CO₂", answer: "+4", wrong: ["-4", "+2", "0"] },
    { text: "iron in Fe₂O₃", answer: "+3", wrong: ["+2", "-3", "+6"] },
    { text: "aluminium in Al₂O₃", answer: "+3", wrong: ["+2", "-3", "+6"] },
    { text: "zinc in ZnSO₄", answer: "+2", wrong: ["+1", "-2", "+4"] },
  ];
  const i = pick(items);
  const text = `What is the oxidation number of ${i.text}?`;
  const { options, answer } = shuffleOptions(i.answer, i.wrong);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-oxstate-gen", type: "mcq",
    core: { formula: "oxidation number rules", structure: "oxidation number", difficulty: "medium" },
    versions: {
      official: { text: "What is the oxidation number of chlorine in NaCl?", answer: "-1", options: ["-1", "+1", "-2", "+2"], attestation: "pending-agent3" },
      global: { text, answer, options },
    },
  };
}

function genGasLaw() {
  const scenarios = [
    { text: "A gas at constant temperature has volume doubled. What happens to pressure?", answer: "Halved", wrong: ["Doubles", "Stays same", "Quadruples"] },
    { text: "A gas at constant pressure is heated from 300K to 600K. What happens to its volume?", answer: "Doubles", wrong: ["Halves", "Stays same", "Quadruples"] },
    { text: "A gas at constant volume is heated. What happens to its pressure?", answer: "Increases", wrong: ["Decreases", "Stays same", "Becomes zero"] },
    { text: "Which law states PV = constant at constant temperature?", answer: "Boyle's Law", wrong: ["Charles's Law", "Gay-Lussac's Law", "Avogadro's Law"] },
    { text: "Which law states V/T = constant at constant pressure?", answer: "Charles's Law", wrong: ["Boyle's Law", "Gay-Lussac's Law", "Graham's Law"] },
    { text: "Doubling the temperature (in Kelvin) of a gas at constant pressure does what to volume?", answer: "Doubles it", wrong: ["Halves it", "No change", "Quadruples it"] },
    { text: "Compressing a gas into a smaller volume at constant temperature does what to pressure?", answer: "Increases it", wrong: ["Decreases it", "No change", "Eliminates it"] },
    { text: "Which gas law relates pressure and temperature at constant volume?", answer: "Gay-Lussac's Law", wrong: ["Boyle's Law", "Charles's Law", "Dalton's Law"] },
  ];
  const s = pick(scenarios);
  const { options, answer } = shuffleOptions(s.answer, s.wrong);
  return {
    id: nextId("cg"), subject: "chemistry", coreId: "core-gaslaw-gen", type: "mcq",
    core: { formula: "PV=nRT; Boyle/Charles/Gay-Lussac", structure: "gas laws", difficulty: "medium" },
    versions: {
      official: { text: "Which gas law states that pressure is inversely proportional to volume at constant temperature?", answer: "Boyle's Law", options: ["Boyle's Law", "Charles's Law", "Gay-Lussac's Law", "Graham's Law"], attestation: "pending-agent3" },
      global: { text: s.text, answer, options },
    },
  };
}

// ============ ECONOMICS GENERATORS ============

function genElasticity() {
  const scenarios = [
    { text: "Price rises by 10% and quantity demanded falls by 20%. Demand is:", answer: "Elastic", wrong: ["Inelastic", "Unit elastic", "Perfectly inelastic"] },
    { text: "Price rises by 10% and quantity demanded falls by 5%. Demand is:", answer: "Inelastic", wrong: ["Elastic", "Unit elastic", "Perfectly elastic"] },
    { text: "Price rises by 10% and quantity demanded falls by 10%. Demand is:", answer: "Unit elastic", wrong: ["Elastic", "Inelastic", "Perfectly inelastic"] },
    { text: "A 20% price cut increases sales by 40%. Demand is:", answer: "Elastic", wrong: ["Inelastic", "Unit elastic", "Perfectly inelastic"] },
    { text: "A 15% price increase causes quantity demanded to drop by 30%. This is:", answer: "Elastic demand", wrong: ["Inelastic demand", "Unit elastic demand", "Perfectly inelastic demand"] },
    { text: "Demand for salt is unlikely to change much when price changes. Salt demand is:", answer: "Inelastic", wrong: ["Elastic", "Unit elastic", "Perfectly elastic"] },
    { text: "A luxury yacht's sales fall sharply when price rises. Demand for yachts is:", answer: "Elastic", wrong: ["Inelastic", "Unit elastic", "Perfectly inelastic"] },
    { text: "Price falls by 25% and quantity demanded rises by 25%. Demand is:", answer: "Unit elastic", wrong: ["Elastic", "Inelastic", "Perfectly elastic"] },
  ];
  const s = pick(scenarios);
  const { options, answer } = shuffleOptions(s.answer, s.wrong);
  return {
    id: nextId("eg"), subject: "economics", coreId: "core-elasticity-gen", type: "mcq",
    core: { formula: "|Ed| > 1 elastic, < 1 inelastic, = 1 unit", structure: "price elasticity of demand", difficulty: "medium" },
    versions: {
      official: { text: "When price rises by 10% and quantity demanded falls by 20%, demand is:", answer: "Elastic", options: ["Elastic", "Inelastic", "Unit elastic", "Perfectly inelastic"], attestation: "pending-agent3" },
      global: { text: s.text, answer, options },
    },
  };
}

function genEconomicsConcept() {
  const concepts = [
    { q: "What is opportunity cost?", answer: "The value of the next best alternative foregone", wrong: ["The total cost of production", "The money spent on purchase", "The profit earned"] },
    { q: "Which is a function of money?", answer: "Medium of exchange", wrong: ["A store of risk", "A source of taxation", "A measure of population"] },
    { q: "Gross Domestic Product (GDP) measures:", answer: "The total value of final goods and services produced in a country", wrong: ["Total government revenue", "Total imports only", "Total population income"] },
    { q: "Who propounded the theory of comparative advantage?", answer: "David Ricardo", wrong: ["Adam Smith", "Karl Marx", "John Maynard Keynes"] },
    { q: "Inflation caused by rising costs of production is:", answer: "Cost-push inflation", wrong: ["Demand-pull inflation", "Deflation", "Disinflation"] },
    { q: "The law of demand states that as price rises, quantity demanded:", answer: "Falls", wrong: ["Rises", "Stays the same", "Becomes zero"] },
    { q: "Which of these is a factor of production?", answer: "Land", wrong: ["Money", "Profit", "Tax"] },
    { q: "A market with many buyers and sellers is called:", answer: "Perfect competition", wrong: ["Monopoly", "Oligopoly", "Monopsony"] },
    { q: "Unemployment due to technological change is called:", answer: "Structural unemployment", wrong: ["Frictional unemployment", "Cyclical unemployment", "Seasonal unemployment"] },
    { q: "The central bank's main tool for controlling money supply is:", answer: "Interest rate policy", wrong: ["Export policy", "Immigration policy", "Agricultural policy"] },
    { q: "Trade between two countries is called:", answer: "International trade", wrong: ["Internal trade", "Domestic trade", "Local trade"] },
    { q: "When quantity supplied exceeds quantity demanded, there is:", answer: "Surplus", wrong: ["Shortage", "Equilibrium", "Deficit"] },
    { q: "A tax that takes a larger percentage from higher incomes is:", answer: "Progressive tax", wrong: ["Regressive tax", "Proportional tax", "Excise tax"] },
    { q: "The total revenue from selling all units is:", answer: "Price × Quantity", wrong: ["Price + Quantity", "Price / Quantity", "Quantity / Price"] },
    { q: "Which is a characteristic of monopoly?", answer: "Single seller", wrong: ["Many sellers", "Free entry", "Perfect information"] },
    { q: "The exchange of goods without money is:", answer: "Barter trade", wrong: ["Credit trade", "Retail trade", "Wholesale trade"] },
    { q: "Scarcity in economics means:", answer: "Resources are limited while wants are unlimited", wrong: ["Goods are free", "Population is too small", "Money is worthless"] },
    { q: "Marginal cost is the cost of producing:", answer: "One additional unit", wrong: ["All units combined", "Zero units", "The first unit only"] },
    { q: "A government budget deficit occurs when:", answer: "Expenditure exceeds revenue", wrong: ["Revenue exceeds expenditure", "Revenue equals expenditure", "Exports exceed imports"] },
    { q: "Which sector includes banking and insurance?", answer: "Tertiary sector", wrong: ["Primary sector", "Secondary sector", "Quaternary sector"] },
  ];
  const c = pick(concepts);
  const { options, answer } = shuffleOptions(c.answer, c.wrong);
  return {
    id: nextId("eg"), subject: "economics", coreId: "core-econ-concept-gen", type: "mcq",
    core: { formula: "economic principle", structure: "economics concept", difficulty: "easy" },
    versions: {
      official: { text: c.q, answer: c.answer, options: [c.answer, ...c.wrong], attestation: "pending-agent3" },
      global: { text: c.q, answer, options },
    },
  };
}

// ============ BIOLOGY GENERATORS ============

function genBiologyConcept() {
  const concepts = [
    { q: "Which organelle is the site of photosynthesis?", answer: "Chloroplast", wrong: ["Mitochondrion", "Ribosome", "Nucleus"] },
    { q: "The process by which cells divide to form two identical cells is:", answer: "Mitosis", wrong: ["Meiosis", "Fertilization", "Binary fission"] },
    { q: "Which gas is absorbed by plants during photosynthesis?", answer: "Carbon dioxide", wrong: ["Oxygen", "Nitrogen", "Hydrogen"] },
    { q: "Blood is pumped from the heart by the:", answer: "Ventricles", wrong: ["Atria", "Valves", "Arteries"] },
    { q: "The structural and functional unit of the kidney is the:", answer: "Nephron", wrong: ["Neuron", "Alveolus", "Villus"] },
    { q: "Which of these is NOT a component of blood?", answer: "Chlorophyll", wrong: ["Red blood cells", "Platelets", "Plasma"] },
    { q: "The exchange of gases in the lungs occurs in the:", answer: "Alveoli", wrong: ["Bronchi", "Trachea", "Diaphragm"] },
    { q: "DNA stands for:", answer: "Deoxyribonucleic acid", wrong: ["Dinitrogen acid", "Deoxyribose nucleic", "Diatomic nucleic acid"] },
    { q: "Which blood vessels carry blood away from the heart?", answer: "Arteries", wrong: ["Veins", "Capillaries", "Venules"] },
    { q: "The movement of water across a semipermeable membrane is:", answer: "Osmosis", wrong: ["Diffusion", "Active transport", "Filtration"] },
    { q: "Which hormone regulates blood sugar levels?", answer: "Insulin", wrong: ["Adrenaline", "Thyroxine", "Estrogen"] },
    { q: "The basic unit of life is the:", answer: "Cell", wrong: ["Tissue", "Organ", "Molecule"] },
    { q: "In which part of the cell does aerobic respiration mainly occur?", answer: "Mitochondrion", wrong: ["Ribosome", "Nucleus", "Golgi body"] },
    { q: "The blueprint of heredity is carried by:", answer: "Genes", wrong: ["Proteins", "Carbohydrates", "Lipids"] },
    { q: "Which plant structure is responsible for absorbing water from soil?", answer: "Root hairs", wrong: ["Leaves", "Stem", "Flower"] },
    { q: "Meiosis produces cells that are:", answer: "Halved (haploid)", wrong: ["Identical (diploid)", "Tripled", "Unchanged"] },
    { q: "The process of converting glucose to pyruvate is called:", answer: "Glycolysis", wrong: ["Krebs cycle", "Oxidative phosphorylation", "Fermentation"] },
    { q: "Which structure controls what enters and leaves the cell?", answer: "Cell membrane", wrong: ["Cell wall", "Cytoplasm", "Vacuole"] },
    { q: "Organisms that make their own food are called:", answer: "Autotrophs", wrong: ["Heterotrophs", "Decomposers", "Parasites"] },
    { q: "The loss of water vapour from leaves is called:", answer: "Transpiration", wrong: ["Respiration", "Germination", "Pollination"] },
  ];
  const c = pick(concepts);
  const { options, answer } = shuffleOptions(c.answer, c.wrong);
  return {
    id: nextId("bg"), subject: "biology", coreId: "core-bio-concept-gen", type: "mcq",
    core: { formula: "biological concept", structure: "biology concept", difficulty: "easy" },
    versions: {
      official: { text: c.q, answer: c.answer, options: [c.answer, ...c.wrong], attestation: "pending-agent3" },
      global: { text: c.q, answer, options },
    },
  };
}

// ============ ENGLISH GENERATORS ============

function genEnglishConcept() {
  const concepts = [
    { q: "Choose the word nearest in meaning to 'abundant':", answer: "Plentiful", wrong: ["Scarce", "Rare", "Minimal"] },
    { q: "Choose the word opposite in meaning to 'benevolent':", answer: "Malevolent", wrong: ["Kind", "Generous", "Helpful"] },
    { q: "Identify the figure of speech: 'The classroom was a zoo.'", answer: "Metaphor", wrong: ["Simile", "Hyperbole", "Onomatopoeia"] },
    { q: "Identify the figure of speech: 'She runs like the wind.'", answer: "Simile", wrong: ["Metaphor", "Personification", "Alliteration"] },
    { q: "Which sentence is grammatically correct?", answer: "She doesn't like apples.", wrong: ["She don't like apples.", "She not like apples.", "She doesn't likes apples."] },
    { q: "What is the plural of 'child'?", answer: "Children", wrong: ["Childs", "Childrens", "Childes"] },
    { q: "Complete: He ___ to school every day.", answer: "goes", wrong: ["go", "going", "gone"] },
    { q: "What does 'to hit the nail on the head' mean?", answer: "To be exactly right", wrong: ["To cause pain", "To work hard", "To be wrong"] },
    { q: "Choose the correct option: 'Neither of the boys ___ present.'", answer: "was", wrong: ["were", "are", "have been"] },
    { q: "What is the past tense of 'bring'?", answer: "Brought", wrong: ["Bringed", "Broughted", "Brung"] },
    { q: "Identify the adverb: 'She quickly finished the exam.'", answer: "Quickly", wrong: ["She", "Finished", "Exam"] },
    { q: "Which is a compound sentence?", answer: "I was tired, so I went to bed.", wrong: ["I was tired because I worked hard.", "Tired, I went to bed.", "I went to bed."] },
    { q: "What is the correct passive of 'They built the house'?", answer: "The house was built by them.", wrong: ["The house was builded by them.", "The house is built by them.", "They were built the house."] },
    { q: "Complete: '___ I were rich, I would travel the world.'", answer: "If", wrong: ["When", "Unless", "Though"] },
    { q: "Choose the correct word: 'The team ___ playing well.'", answer: "is", wrong: ["are", "were", "be"] },
    { q: "What does the prefix 'un-' mean in 'unhappy'?", answer: "Not", wrong: ["Again", "Before", "After"] },
    { q: "Identify the direct object: 'The boy kicked the ball.'", answer: "The ball", wrong: ["The boy", "Kicked", "Boy kicked"] },
    { q: "Which word is a preposition? 'The cat sat ___ the mat.'", answer: "on", wrong: ["sat", "cat", "mat"] },
    { q: "What is a synonym for 'diligent'?", answer: "Hardworking", wrong: ["Lazy", "Careless", "Slow"] },
    { q: "What is an antonym for 'expand'?", answer: "Contract", wrong: ["Enlarge", "Grow", "Extend"] },
  ];
  const c = pick(concepts);
  const { options, answer } = shuffleOptions(c.answer, c.wrong);
  return {
    id: nextId("eng"), subject: "english", coreId: "core-eng-concept-gen", type: "mcq",
    core: { formula: "grammar/vocabulary rule", structure: "English language concept", difficulty: "easy" },
    versions: {
      official: { text: c.q, answer: c.answer, options: [c.answer, ...c.wrong], attestation: "pending-agent3" },
      global: { text: c.q, answer, options },
    },
  };
}

// ============ GEOGRAPHY GENERATORS ============

function genGeoConcept() {
  const concepts = [
    { q: "What is the capital of Nigeria?", answer: "Abuja", wrong: ["Lagos", "Kano", "Ibadan"] },
    { q: "Which is the longest river in Africa?", answer: "River Nile", wrong: ["River Congo", "River Niger", "River Zambezi"] },
    { q: "The equator passes through which of these?", answer: "Nairobi", wrong: ["Cairo", "Lagos", "Cape Town"] },
    { q: "Which desert is the largest in the world?", answer: "Antarctic Desert", wrong: ["Sahara Desert", "Gobi Desert", "Kalahari Desert"] },
    { q: "What is the capital of Kenya?", answer: "Nairobi", wrong: ["Mombasa", "Kampala", "Dar es Salaam"] },
    { q: "The Prime Meridian passes through:", answer: "Greenwich", wrong: ["Paris", "New York", "Tokyo"] },
    { q: "Which ocean lies to the east of Africa?", answer: "Indian Ocean", wrong: ["Atlantic Ocean", "Pacific Ocean", "Arctic Ocean"] },
    { q: "What type of rock is formed from cooled magma?", answer: "Igneous", wrong: ["Sedimentary", "Metamorphic", "Organic"] },
    { q: "Rivers Niger and Benue meet at:", answer: "Lokoja", wrong: ["Onitsha", "Abuja", "Ibadan"] },
    { q: "Which country is the largest in Africa by area?", answer: "Algeria", wrong: ["Nigeria", "South Africa", "Egypt"] },
    { q: "Mount Kilimanjaro is located in:", answer: "Tanzania", wrong: ["Kenya", "Uganda", "Ethiopia"] },
    { q: "The Sahara Desert is located mainly in:", answer: "North Africa", wrong: ["South Africa", "East Africa", "West Africa"] },
    { q: "What is the capital of Ghana?", answer: "Accra", wrong: ["Lagos", "Abuja", "Kumasi"] },
    { q: "Which line divides the Earth into hemispheres?", answer: "The Equator", wrong: ["Tropic of Cancer", "Prime Meridian", "Date Line"] },
    { q: "Volcanoes are found along the:", answer: "Pacific Ring of Fire", wrong: ["Atlantic Ridge", "Arctic Circle", "Greenwich Line"] },
    { q: "The largest island in Africa is:", answer: "Madagascar", wrong: ["Zanzibar", "Socotra", "Mauritius"] },
    { q: "Which climate zone has distinct wet and dry seasons?", answer: "Tropical savanna", wrong: ["Tundra", "Mediterranean", "Desert"] },
    { q: "The River Niger empties into the:", answer: "Gulf of Guinea", wrong: ["Mediterranean Sea", "Atlantic Ocean", "Red Sea"] },
    { q: "What is the capital of Tanzania?", answer: "Dodoma", wrong: ["Dar es Salaam", "Nairobi", "Kampala"] },
    { q: "Tectonic plates move due to:", answer: "Convection currents in the mantle", wrong: ["Wind patterns", "Ocean tides", "Earth's magnetic field"] },
  ];
  const c = pick(concepts);
  const { options, answer } = shuffleOptions(c.answer, c.wrong);
  return {
    id: nextId("geog"), subject: "geography", coreId: "core-geo-concept-gen", type: "mcq",
    core: { formula: "geographical fact", structure: "geography concept", difficulty: "easy" },
    versions: {
      official: { text: c.q, answer: c.answer, options: [c.answer, ...c.wrong], attestation: "pending-agent3" },
      global: { text: c.q, answer, options },
    },
  };
}

// ============ LITERATURE GENERATORS ============

function genLitConcept() {
  const concepts = [
    { q: "Who wrote 'Things Fall Apart'?", answer: "Chinua Achebe", wrong: ["Wole Soyinka", "Ngugi wa Thiong'o", "Ben Okri"] },
    { q: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare", wrong: ["Christopher Marlowe", "Charles Dickens", "Jane Austen"] },
    { q: "What is the tragic flaw of Macbeth?", answer: "Ambition", wrong: ["Greed", "Cowardice", "Ignorance"] },
    { q: "The narrator of 'The Great Gatsby' is:", answer: "Nick Carraway", wrong: ["Jay Gatsby", "Tom Buchanan", "Daisy Buchanan"] },
    { q: "In 'Lord of the Flies', the conch symbolizes:", answer: "Order and civilization", wrong: ["Death", "War", "Nature"] },
    { q: "Who wrote 'A Half of a Yellow Sun'?", answer: "Chimamanda Ngozi Adichie", wrong: ["Alice Walker", "Toni Morrison", "Maya Angelou"] },
    { q: "What type of poem has 14 lines?", answer: "Sonnet", wrong: ["Ode", "Elegy", "Ballad"] },
    { q: "A story with a moral lesson passed down orally is a:", answer: "Folktale", wrong: ["Proverb", "Elegy", "Sonnet"] },
    { q: "Who wrote 'Animal Farm'?", answer: "George Orwell", wrong: ["Aldous Huxley", "Charles Dickens", "J.R.R. Tolkien"] },
    { q: "What is dramatic irony?", answer: "When the audience knows more than the characters", wrong: ["When a character lies", "When the ending is sad", "When dialogue rhymes"] },
    { q: "Who is the protagonist of 'Jane Eyre'?", answer: "Jane Eyre", wrong: ["Bertha Mason", "Helen Burns", "Eliza Reed"] },
    { q: "'Her voice was music to my ears' is an example of:", answer: "Metaphor", wrong: ["Simile", "Personification", "Onomatopoeia"] },
    { q: "Who wrote 'The Lion and the Jewel'?", answer: "Wole Soyinka", wrong: ["Chinua Achebe", "Ngugi wa Thiong'o", "Ola Rotimi"] },
    { q: "A play where the hero's downfall is caused by a fatal flaw is a:", answer: "Tragedy", wrong: ["Comedy", "Romance", "Melodrama"] },
    { q: "Who wrote 'Pride and Prejudice'?", answer: "Jane Austen", wrong: ["Charlotte Brontë", "Emily Brontë", "George Eliot"] },
    { q: "In literature, a 'protagonist' is:", answer: "The main character", wrong: ["The villain", "The narrator", "The setting"] },
    { q: "Who wrote 'Waiting for the Rain'?", answer: "Charles Mungoshi", wrong: ["Chinua Achebe", "Wole Soyinka", "Dambudzo Marechera"] },
    { q: "What is the central theme of 'Animal Farm'?", answer: "Corruption of revolutionary ideals", wrong: ["Love and romance", "Space exploration", "Urban life"] },
    { q: "'I have told you a million times' is an example of:", answer: "Hyperbole", wrong: ["Simile", "Metaphor", "Alliteration"] },
    { q: "Who wrote 'Things Fall Apart'? (alternate)", answer: "Chinua Achebe", wrong: ["Ben Okri", "Emeka Anyaoku", "Cyprian Ekwensi"] },
  ];
  const c = pick(concepts);
  const { options, answer } = shuffleOptions(c.answer, c.wrong);
  return {
    id: nextId("lg"), subject: "literature", coreId: "core-lit-concept-gen", type: "mcq",
    core: { formula: "literary knowledge", structure: "literature concept", difficulty: "easy" },
    versions: {
      official: { text: c.q, answer: c.answer, options: [c.answer, ...c.wrong], attestation: "pending-agent3" },
      global: { text: c.q, answer, options },
    },
  };
}

// ============ MAIN GENERATOR ============

export const GENERATORS = {
  math: [
    genLinearEquation, genQuadraticFactoring, genPercentage, genSimpleInterest,
    genPythagoras, genMean, genLogarithm, genCircleArea, genAP,
    genAreaRectangle, genRatio, genSpeedDistance, genProfitLoss,
    genSetOperation, genIndices, genStdDeviation, genCompoundInterest,
    genTrigValue, genSimultaneous, genVennDiagram,
  ],
  physics: [
    genNewton2, genKineticEnergy, genWork, genPower,
    genDensity, genOhmsLaw, genWave, genHeatCapacity,
    genPotentialEnergy, genFrequencyWavelength,
  ],
  chemistry: [
    genMolarMass, genMoleConversion, genPHValue, genBondType,
    genStoichiometry, genElectronConfig, genOxidationState, genGasLaw,
  ],
  economics: [genElasticity, genEconomicsConcept],
  biology: [genBiologyConcept],
  english: [genEnglishConcept],
  geography: [genGeoConcept],
  literature: [genLitConcept],
};

export function generateSubject(subject, count) {
  const gens = GENERATORS[subject];
  if (!gens) throw new Error(`No generator for subject: ${subject}`);
  const results = [];
  const seen = new Set();
  let attempts = 0;
  while (results.length < count && attempts < count * 20) {
    attempts++;
    const gen = pick(gens);
    const q = gen();
    const key = q.versions.global.text;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(q);
  }
  return results;
}

export function generateAll(subjects, perSubject) {
  const all = [];
  for (const s of subjects) {
    all.push(...generateSubject(s, perSubject));
  }
  return all;
}
