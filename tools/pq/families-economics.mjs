/**
 * Economics families (round 2, JAMB pool).
 * Computable families re-derive the answer from the statement; recall tables
 * use the dual-answer contract (key + independently authored proof).
 */

import { int, pick, shuffled } from "./engine.mjs";
import { recallFamily, parseNum, pool3 } from "./families-support.mjs";

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

export const families = [
  {
    id: "price-elasticity",
    topicSlug: "microeconomics",
    label: "Price elasticity of demand: PED",
    params(r) {
      const p1 = int(r, 2, 20) * 10;
      const q1 = int(r, 2, 20) * 10;
      const p2 = p1 - int(r, 1, 5) * 10;
      const pctP = ((p1 - p2) / p1) * 100;
      const pctQ = int(r, 1, 5) * 10;
      return { p1, q1, p2, pctP, pctQ, ped: pctQ / pctP };
    },
    answer: (p) => trim(p.ped, 2),
    stem(p) {
      return `When the price of a commodity falls from ₦${p.p1} to ₦${p.p2}, the quantity demanded rises by ${p.pctQ}%. What is the price elasticity of demand?`;
    },
    distractors(p, r) {
      return pool3(r, p.ped, [p.pctP / p.pctQ, p.pctP, p.pctQ, p.ped * 2, Math.max(0.1, p.ped - 1)], trim);
    },
    explanation(p) {
      return `PED = %change in quantity / %change in price = ${p.pctQ} / ${trim(p.pctP, 1)} = ${trim(p.ped, 2)}. Inverting the ratio, or quoting a percentage instead of a ratio, are the usual slips.`;
    },
    hint: () => "PED = % change in quantity demanded / % change in price.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.pctQ / p.pctP) < 6e-3;
    },
  },
  {
    id: "equilibrium-price",
    topicSlug: "microeconomics",
    label: "Market equilibrium from linear demand and supply",
    params(r) {
      // Qd = a - bp ; Qs = c + dp ; solve for price
      const a = int(r, 20, 60) * 10;
      let b = int(r, 1, 5);
      const c = int(r, 1, 8) * 10;
      const d = int(r, 1, 4);
      // equilibrium quantity must be positive: solve p = (a - c) / (b + d)
      for (let g = 0; g < 40 && a <= c + 10; g++) {
        b = int(r, 1, 5);
      }
      const price = (a - c) / (b + d);
      if (price <= 0 || !Number.isInteger(price)) return { ...params_(r) };
      return { a, b, c, d, price, qty: a - b * price };
      function params_(r) {
        return { a: 60, b: 2, c: 20, d: 1, price: 40 / 3, qty: 20 };
      }
    },
    answer: (p) => `₦${trim(p.price, 2)}`,
    stem(p) {
      return `A market has demand Qd = ${p.a} − ${p.b}P and supply Qs = ${p.c} + ${p.d}P. What is the equilibrium price?`;
    },
    distractors(p, r) {
      const pool = [(p.a + p.c) / (p.b + p.d), (p.a - p.c) / (p.b - p.d || 1), p.a / p.b, p.c / p.d, p.price * 2].filter((v) => v > 0 && Math.abs(v - p.price) > 0.5);
      return pool3(r, p.price, pool, (v) => `₦${trim(v, 2)}`);
    },
    explanation(p) {
      return `Set Qd = Qs: ${p.a} − ${p.b}P = ${p.c} + ${p.d}P → ${p.a - p.c} = ${p.b + p.d}P → P = ₦${trim(p.price, 2)}. Adding instead of subtracting the slopes gives a different price.`;
    },
    hint: () => "Equilibrium: quantity demanded equals quantity supplied.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - (p.a - p.c) / (p.b + p.d)) < 5e-3 && p.price > 0;
    },
  },
  {
    id: "gdp-factor-cost",
    topicSlug: "macroeconomics",
    label: "GDP at factor cost: C + I + G + (X − M)",
    params(r) {
      const c = int(r, 20, 120) * 10;
      const i = int(r, 5, 40) * 10;
      const g = int(r, 5, 30) * 10;
      const x = int(r, 5, 40) * 10;
      const m = int(r, 5, 40) * 10;
      return { c, i, g, x, m, gdp: c + i + g + (x - m) };
    },
    answer: (p) => `₦${p.gdp}m`,
    stem(p) {
      return `Given consumption ₦${p.c}m, investment ₦${p.i}m, government spending ₦${p.g}m, exports ₦${p.x}m and imports ₦${p.m}m (all in millions), what is GDP at factor cost?`;
    },
    distractors(p, r) {
      return pool3(r, p.gdp, [p.c + p.i + p.g + p.x + p.m, p.c + p.i + p.g - p.x - p.m, p.c + p.i + p.g - p.x + p.m, p.gdp * 2], (v) => `₦${v}m`);
    },
    explanation(p) {
      return `GDP = C + I + G + (X − M) = ${p.c} + ${p.i} + ${p.g} + (${p.x} − ${p.m}) = ₦${p.gdp}m. Adding imports instead of subtracting them is the classic slip.`;
    },
    hint: () => "Imports enter GDP with a minus sign: they leak abroad.",
    verify(p, chosen) {
      return parseNum(chosen) === p.c + p.i + p.g + (p.x - p.m);
    },
  },
  {
    id: "inflation-rate",
    topicSlug: "macroeconomics",
    label: "Rate of inflation from two price indices",
    params(r) {
      // Choose an index pair whose percentage change is an EXACT integer.
      let old = int(r, 80, 240);
      let pct = pick(r, [5, 10, 12.5, 15, 20, 25]);
      for (let g = 0; g < 60 && Number.isInteger(old * (1 + pct / 100)) === false; g++) {
        old = int(r, 80, 240);
        pct = pick(r, [5, 10, 12.5, 15, 20, 25]);
      }
      if (!Number.isInteger(old * (1 + pct / 100))) {
        old = 100;
        pct = 10;
      }
      return { old, pct, now: old * (1 + pct / 100) };
    },
    answer: (p) => `${p.pct}%`,
    stem(p) {
      return `A country's price index rose from ${p.old} to ${p.now} in a year. What was the rate of inflation?`;
    },
    distractors(p, r) {
      return pool3(
        r,
        p.pct,
        [100 - p.pct, p.now, p.pct * 2, Math.max(1, p.pct - 5), p.pct + 5],
        (v) => `${trim(v, 2)}%`,
      );
    },
    explanation(p) {
      return `Inflation = (index change / old index) x 100 = (${p.now} − ${p.old})/${p.old} x 100 = ${p.pct}%. Quoting the new index level, or the change itself, confuses level with rate.`;
    },
    hint: () => "Inflation rate = percentage change in the price index.",
    verify(p, chosen) {
      const exact = ((p.now - p.old) / p.old) * 100;
      return Math.abs(parseNum(chosen) - exact) < 0.5 && parseNum(chosen) === p.pct && Number.isInteger(p.now);
    },
  },
  {
    id: "per-capita-income",
    topicSlug: "macroeconomics",
    label: "Per capita income",
    params(r) {
      const gdp = int(r, 20, 90) * 10_000_000;
      const pop = int(r, 20, 60) * 100_000;
      return { gdp, pop, perCapita: Math.round(gdp / pop) };
    },
    answer: (p) => `₦${p.perCapita.toLocaleString("en-NG")}`,
    stem(p) {
      return `A country has a national income of ₦${(p.gdp / 1e6).toLocaleString("en-NG")}m and a population of ${(p.pop / 1e6).toLocaleString("en-NG")}m. What is its per capita income?`;
    },
    distractors(p, r) {
      return pool3(r, p.perCapita, [p.gdp * p.pop, Math.max(1000, Math.round(p.perCapita / 2)), p.perCapita * 2, p.pop, p.gdp], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Per capita income = national income / population = ₦${(p.gdp / 1e6).toLocaleString("en-NG")}m / ${(p.pop / 1e6).toLocaleString("en-NG")}m = ₦${p.perCapita.toLocaleString("en-NG")}. It divides, never multiplies.`;
    },
    hint: () => "Per capita means per head — divide the total by the population.",
    verify(p, chosen) {
      return parseNum(chosen) === Math.round(p.gdp / p.pop);
    },
  },
  {
    id: "simple-multiplier",
    topicSlug: "macroeconomics",
    label: "Investment multiplier: k = 1 / (1 − MPC)",
    params(r) {
      const mpc = pick(r, [0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
      return { mpc, k: 1 / (1 - mpc) };
    },
    answer: (p) => trim(p.k, 2),
    stem(p) {
      return `If the marginal propensity to consume is ${p.mpc}, what is the value of the multiplier?`;
    },
    distractors(p, r) {
      return pool3(r, p.k, [1 / p.mpc, p.mpc, 1 - p.mpc, p.k * 2, p.k + 1], trim);
    },
    explanation(p) {
      return `k = 1/(1 − MPC) = 1/(1 − ${p.mpc}) = ${trim(p.k, 2)}. Using 1/MPC confuses the multiplier with the marginal propensity to save's reciprocal.`;
    },
    hint: () => "The multiplier is 1 over the marginal propensity to save.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - 1 / (1 - p.mpc)) < 5e-3;
    },
  },
  {
    id: "balance-of-trade",
    topicSlug: "macroeconomics",
    label: "Balance of trade",
    params(r) {
      const visible = int(r, 20, 100) * 10;
      const invi = int(r, 5, 40) * 10;
      const imp = (invi + int(r, 1, 10) * 10) * (r() < 0.5 ? -1 : 1);
      const imports = visible + invi - Math.abs(imp);
      return { visible, invi, imports, balance: visible + invi - imports };
    },
    answer: (p) => (p.balance > 0 ? `surplus of ₦${p.balance}m` : p.balance < 0 ? `deficit of ₦${Math.abs(p.balance)}m` : "balance"),
    stem(p) {
      return `A country exports goods worth ₦${p.visible}m and services worth ₦${p.invi}m, and imports goods and services worth ₦${p.imports}m. What is the balance of trade?`;
    },
    distractors(p, r) {
      const key = p.balance > 0 ? `surplus of ₦${p.balance}m` : `deficit of ₦${Math.abs(p.balance)}m`;
      const opp = p.balance > 0 ? `deficit of ₦${p.balance}m` : `surplus of ₦${Math.abs(p.balance)}m`;
      return shuffled(r, [opp, `balance of ₦${p.visible + p.invi}m`, `surplus of ₦${p.imports}p`]).filter((c) => c !== key).slice(0, 3);
    },
    explanation(p) {
      return `Balance of trade = (visible + invisible exports) − imports = (${p.visible} + ${p.invi}) − ${p.imports} = ${p.balance >= 0 ? "a surplus of ₦" + p.balance + "m" : "a deficit of ₦" + Math.abs(p.balance) + "m"}. Swapping surplus and deficit reverses the position.`;
    },
    hint: () => "Exports minus imports; a negative answer is a deficit.",
    verify(p, chosen) {
      const b = p.visible + p.invi - p.imports;
      const key = b > 0 ? `surplus of ₦${b}m` : b < 0 ? `deficit of ₦${Math.abs(b)}m` : "balance";
      return chosen === key;
    },
  },
  recallFamily({
    id: "basic-economics-concepts",
    topicSlug: "microeconomics",
    label: "Basics of economics",
    hint: "Scarcity is the starting point of every economic choice.",
    rows: [
      ["The central economic problem is", "scarcity", ["poverty", "money", "trade"], "Resources are limited relative to wants — that is scarcity.", "scarcity"],
      ["Economics is a social science because it deals with", "human behaviour and choice", ["money only", "plants and animals", "weather"], "It studies how people choose under scarcity.", "human behaviour and choice"],
      ["The alternative forgone when a choice is made is the", "opportunity cost", ["money cost", "real cost", "social cost"], "Opportunity cost is the value of the next-best alternative given up.", "opportunity cost"],
      ["A good that is both scarce and has utility is called", "an economic good", ["a free good", "a public good only", "a luxury"], "Economic goods command a price; free goods (air) do not.", "an economic good"],
      ["Air is normally a", "free good", ["economic good", "public good", "consumer good"], "Free goods are abundant and have no price.", "free good"],
      ["The study of individual units of the economy is", "microeconomics", ["macroeconomics", "development economics", "monetary economics"], "Micro looks at households and firms; macro at aggregates.", "microeconomics"],
      ["The study of the economy as a whole is", "macroeconomics", ["microeconomics", "comparative economics", "business economics"], "Macroeconomics covers inflation, unemployment and national income.", "macroeconomics"],
      ["Factors of production include all EXCEPT", "money", ["land", "labour", "capital"], "Money buys capital; it is not itself a factor of production.", "money"],
      ["The reward for capital as a factor is", "interest", ["rent", "wages", "profit"], "Capital earns interest; land earns rent; labour earns wages.", "interest"],
      ["The reward for entrepreneurship is", "profit", ["rent", "interest", "wages"], "The entrepreneur's residual reward is profit.", "profit"],
      ["A production possibility curve shows", "maximum output combinations", ["prices of goods", "inflation rates", "population growth"], "The PPC marks the frontier of attainable output.", "maximum output combinations"],
      ["A point INSIDE the PPC shows", "unemployment of resources", ["full employment", "impossible output", "economic growth"], "Inside the curve, resources are idle.", "unemployment of resources"],
      ["Economic growth is shown by a PPC that", "shifts outward", ["shifts inward", "stays fixed", "gets flatter"], "Growth expands capacity, moving the frontier out.", "shifts outward"],
      ["The basic economic problems are what, how and", "for whom to produce", ["where to produce", "why to produce", "when to produce"], "Allocation answers what, how and for whom.", "for whom to produce"],
      ["Which question does a market economy answer through prices?", "what to produce", ["who should vote", "how to write laws", "when to pray"], "Price signals allocate resources in a market economy.", "what to produce"],
      ["Utility means", "satisfaction from consumption", ["price of a good", "cost of production", "quantity bought"], "Utility is the want-satisfying power of a good.", "satisfaction from consumption"],
      ["Scale of preference is a list of wants", "in order of importance", ["in alphabetical order", "by price only", "by quantity"], "Ranking helps choice under scarcity.", "in order of importance"],
      ["Labour's reward in a modern economy is usually", "wages and salaries", ["rent", "interest", "profit"], "Wages reward human effort.", "wages and salaries"],
      ["Economic efficiency means producing", "at least cost", "with waste", "Efficiency is maximum output from given inputs.", "at least cost"],
      ["A command economy is directed by", "government planning", ["market forces", "tradition", "foreign firms"], "The state decides what, how and for whom.", "government planning"],
    ],
  }),
  recallFamily({
    id: "demand-supply",
    topicSlug: "microeconomics",
    label: "Demand and supply",
    hint: "A change in price moves ALONG the curve; other factors SHIFT it.",
    rows: [
      ["The law of demand states that price and quantity demanded move", "in opposite directions", ["in the same direction", "randomly", "independently"], "Lower price raises quantity demanded, ceteris paribus.", "in opposite directions"],
      ["A rise in price causes quantity demanded to", "fall", ["rise", "stay unchanged", "double"], "Movement up along the demand curve.", "fall"],
      ["A demand curve normally slopes", "downward", ["upward", "horizontally", "vertically"], "The negative slope reflects the law of demand.", "downward"],
      ["An increase in consumer income shifts the demand curve for a normal good", "to the right", ["to the left", "downward along it", "nowhere"], "More income means more demand at every price.", "to the right"],
      ["An increase in the price of a complement shifts demand for the good", "to the left", ["to the right", "nowhere", "upward along it"], "Tea dearer -> less tea -> less sugar demanded.", "to the left"],
      ["An increase in the price of a substitute shifts demand for the good", "to the right", ["to the left", "nowhere", "along it"], "Tea dearer -> more coffee demanded.", "to the right"],
      ["Demand means", "effective want backed by money", ["mere desire", "need only", "supply of goods"], "Demand = willingness + ability to pay.", "effective want backed by money"],
      ["The law of supply states that price and quantity supplied move", "in the same direction", ["opposite", "randomly", "independently"], "Higher price induces more supply.", "in the same direction"],
      ["A supply curve normally slopes", "upward", ["downward", "horizontally", "steeply down"], "Positive slope reflects rising marginal cost.", "upward"],
      ["A subsidy to producers shifts supply", "to the right", ["to the left", "nowhere", "along it"], "A subsidy lowers cost, increasing supply.", "to the right"],
      ["When demand exceeds supply at a price, the price will", "rise", ["fall", "stay", "disappear"], "Shortage puts upward pressure on price.", "rise"],
      ["When supply exceeds demand at a price, there is a", "surplus", ["shortage", "equilibrium", "scarcity"], "Glut pushes price down.", "surplus"],
      ["Equilibrium price is where", "demand equals supply", ["demand exceeds supply", "supply exceeds demand", "all goods are free"], "Plans of buyers and sellers exactly match.", "demand equals supply"],
      ["A change in the good's OWN price causes a", "movement along the curve", ["shift of the curve", "new curve entirely", "no change"], "Own-price changes trace the curve; they do not shift it.", "movement along the curve"],
      ["An improvement in technology shifts the supply curve", "to the right", ["to the left", "nowhere", "upward along it"], "Cheaper production increases supply.", "to the right"],
      ["Ceteris paribus means", "other things being equal", ["all things change", "price is fixed", "demand is zero"], "It isolates one variable at a time.", "other things being equal"],
      ["Inferior goods are goods", "whose demand falls as income rises", ["never bought", "always expensive", "supplied free"], "E.g. kerosene lanterns as income grows.", "whose demand falls as income rises"],
      ["Giffen goods are a special type of", "inferior good", ["normal good", "luxury", "capital good"], "Giffen goods show perverse demand curves.", "inferior good"],
      ["A government price FIXED BELOW equilibrium creates a", "shortage", ["surplus", "balance", "glut"], "Maximum prices below equilibrium cause queuing.", "shortage"],
      ["A price floor set above equilibrium creates a", "surplus", ["shortage", "balance", "scarcity"], "Minimum prices (e.g. minimum wages) create surplus labour.", "surplus"],
    ],
  }),
  recallFamily({
    id: "money-banking",
    topicSlug: "macroeconomics",
    label: "Money and banking",
    hint: "Money serves as medium of exchange, unit of account, store of value and standard of deferred payment.",
    rows: [
      ["The primary function of money is", "medium of exchange", ["store of value", "unit of account", "standard of payment"], "Money removes the double coincidence of wants.", "medium of exchange"],
      ["Money used to value goods is a", "unit of account", ["medium of exchange", "store of value", "measure of demand"], "Prices express value in money terms.", "unit of account"],
      ["Money kept for future use is a", "store of value", ["medium of exchange", "unit of account", "legal tender"], "Saving requires a durable store of value.", "store of value"],
      ["Barter means", "exchange of goods for goods", ["exchange of money for goods", "export of goods", "imitation of trade"], "Barter is direct exchange without money.", "exchange of goods for goods"],
      ["The greatest difficulty of barter is", "double coincidence of wants", ["weight of goods", "lack of roads", "low prices"], "Both parties must want each other's goods.", "double coincidence of wants"],
      ["Legal tender is money that", "must be accepted by law", ["is printed in colour", "has gold backing", "is foreign"], "The law compels acceptance for debts.", "must be accepted by law"],
      ["The central bank's main duty is", "issuing currency", ["granting loans to traders", "keeping accounts", "selling insurance"], "The central bank manages money and banks.", "issuing currency"],
      ["Which institution supervises commercial banks?", "the central bank", ["the stock exchange", "the treasury", "the chamber of commerce"], "The central bank licenses and regulates banks.", "the central bank"],
      ["A commercial bank creates money by", "lending deposits", ["printing notes", "buying foreign cash", "collecting taxes"], "Credit creation multiplies deposits.", "lending deposits"],
      ["Commercial banks keep with the central bank a", "cash reserve ratio", ["profit margin", "loan portfolio", "equity stake"], "The reserve ratio limits credit creation.", "cash reserve ratio"],
      ["Interest is the", "price of money", ["price of goods", "cost of land", "value of exports"], "Borrowers pay interest for the use of money.", "price of money"],
      ["Money paid to guarantee a loan is", "collateral", ["interest", "dividend", "commission"], "Collateral secures the lender against default.", "collateral"],
      ["The stock exchange trades in", "shares and securities", ["cattle", "land plots", "bank notes"], "It is the market for equities and bonds.", "shares and securities"],
      ["A shareholder is a", "part owner of a company", ["creditor", "customer", "employee"], "Shareholders hold equity in the firm.", "part owner of a company"],
      ["Dividends are paid from", "company profits", ["borrowed funds", "taxes", "loans"], "Dividends are profit distributions.", "company profits"],
      ["Deflation is a sustained", "fall in the general price level", ["rise in prices", "rise in output", "fall in output"], "Deflation is negative inflation.", "fall in the general price level"],
      ["Currency held outside the banks is", "money in circulation", ["quasi money", "savings", "reserves"], "Cash outside banks is the active circulation.", "money in circulation"],
      ["Near-money includes", "savings deposits", ["banknotes", "coins", "foreign notes"], "Near-money converts to cash quickly.", "savings deposits"],
      ["E-banking means", "banking through electronic channels", ["banking by post", "farming banks", "cash-only banking"], "Digital channels replace counter transactions.", "banking through electronic channels"],
      ["The loanable funds market determines", "the interest rate", ["the wage rate", "the exchange rate", "the price of land"], "Supply and demand for loans set the interest rate.", "the interest rate"],
    ],
  }),
  recallFamily({
    id: "inflation-unemployment",
    topicSlug: "macroeconomics",
    label: "Inflation and unemployment",
    hint: "Name the TYPE before explaining the cure.",
    rows: [
      ["Inflation is a persistent", "rise in the general price level", ["fall in prices", "rise in one price", "rise in wages only"], "Inflation is economy-wide and persistent.", "rise in the general price level"],
      ["Demand-pull inflation comes from", "too much spending", ["rising costs", "wage cuts", "import bans"], "Excess demand bids prices up.", "too much spending"],
      ["Cost-push inflation comes from", "rising production costs", ["excess demand", "low taxes", "cheaper fuel"], "Cost increases push prices up.", "rising production costs"],
      ["A group losing purchasing power most from inflation is", "fixed-income earners", ["landowners", "borrowers", "speculators"], "Fixed incomes erode as prices rise.", "fixed-income earners"],
      ["Borrowers tend to", "gain from inflation", ["lose from inflation", "be unaffected", "gain from deflation"], "Money repaid is worth less than money borrowed.", "gain from inflation"],
      ["Creeping inflation is", "mild and slow", ["very rapid", "galloping", "zero"], "1-3% annually is creeping.", "mild and slow"],
      ["Galloping inflation is", "very rapid", ["very slow", "stable", "negative"], "Double-digit monthly rises are galloping.", "very rapid"],
      ["The control of inflation through taxes and spending is", "fiscal policy", ["monetary policy", "trade policy", "wage policy"], "Fiscal = government budget tools.", "fiscal policy"],
      ["The control of the money supply is", "monetary policy", ["fiscal policy", "labour policy", "agricultural policy"], "Monetary policy manages money and credit.", "monetary policy"],
      ["Which tool is MONETARY?", "open market operations", ["income tax", "government spending", "road building"], "OMO buys/sells securities to change money supply.", "open market operations"],
      ["Unemployment exists when labour", "is willing to work at the going wage but cannot find jobs", ["refuses all work", "is on holiday", "is studying"], "It is involuntary and available labour.", "is willing to work at the going wage but cannot find jobs"],
      ["Unemployment caused by the declining season of an industry is", "seasonal", ["frictional", "structural", "cyclical"], "Seasonal jobs end with the season.", "seasonal"],
      ["Unemployment between jobs is", "frictional", ["structural", "seasonal", "residual"], "Workers move between jobs.", "frictional"],
      ["Unemployment from a mismatch of skills is", "structural", ["frictional", "seasonal", "voluntary"], "Skills no longer match available jobs.", "structural"],
      ["Unemployment from a fall in total demand is", "cyclical", ["frictional", "seasonal", "residual"], "Recessions create cyclical unemployment.", "cyclical"],
      ["The trade-off between inflation and unemployment is shown by the", "Phillips curve", ["Lorenz curve", "Laffer curve", "demand curve"], "The Phillips curve plots wage/inflation vs unemployment.", "Phillips curve"],
      ["A person not working and not seeking work is", "not in the labour force", ["unemployed", "underemployed", "a discouraged worker counted"], "Unemployment requires active search.", "not in the labour force"],
      ["Index numbers measure", "changes over time", ["levels only", "quality", "profit"], "Indices track relative change against a base.", "changes over time"],
      ["Deflation tends to", "discourage borrowing", ["raise prices", "increase spending", "help debtors"], "Falling prices reward holding cash.", "discourage borrowing"],
      ["Stagflation is", "inflation plus stagnation", ["deflation only", "boom only", "balance"], "Stagflation pairs rising prices with unemployment.", "inflation plus stagnation"],
    ],
  }),
  recallFamily({
    id: "public-finance-trade",
    topicSlug: "macroeconomics",
    label: "Public finance and international trade",
    hint: "Public finance manages revenue; trade crosses borders.",
    rows: [
      ["The government's annual income and spending plan is the", "budget", ["manifesto", "audit report", "ledger"], "The budget plans revenue and expenditure.", "budget"],
      ["A budget surplus means", "revenue exceeds expenditure", ["expenditure exceeds revenue", "both equal", "no revenue"], "Surplus: taxes > spending.", "revenue exceeds expenditure"],
      ["A budget deficit is financed by", "borrowing", ["tax cuts", "printing of shares", "export bans"], "Deficits are funded by loans or bonds.", "borrowing"],
      ["The biggest source of government revenue in Nigeria is", "taxes", ["loans", "donations", "rates only"], "Taxes dominate ordinary revenue.", "taxes"],
      ["Taxes on goods and services are", "indirect taxes", ["direct taxes", "capital taxes", "levies on income"], "VAT and customs duties are indirect.", "indirect taxes"],
      ["Income tax is a", "direct tax", ["indirect tax", "sales tax", "tariff"], "It falls directly on income.", "direct tax"],
      ["A tax taking a larger share of higher incomes is", "progressive", ["regressive", "proportional", "neutral"], "Progressive rates rise with income.", "progressive"],
      ["A tax taking a larger share of poor incomes is", "regressive", ["progressive", "proportional", "graduated"], "Sales taxes hit the poor harder.", "regressive"],
      ["Government spending on roads helps firms by", "lowering costs", ["raising prices", "banning imports", "cutting wages"], "Infrastructure reduces transport costs.", "lowering costs"],
      ["Visible trade refers to", "goods", ["services", "both goods and services", "money only"], "Visible = physical goods.", "goods"],
      ["Invisible trade refers to", "services", ["goods", "raw materials", "minerals"], "Invisible = services and intangibles.", "services"],
      ["The exchange rate is the", "price of one currency in another", ["price of gold", "interest rate", "price level"], "It values one currency against another.", "price of one currency in another"],
      ["A devaluation of the naira makes Nigerian exports", "cheaper abroad", ["dearer abroad", "unchanged", "banned"], "A cheaper currency lowers foreign prices of exports.", "cheaper abroad"],
      ["Tariffs are taxes on", "imports", ["exports", "income", "land"], "Tariffs protect home industry and raise revenue.", "imports"],
      ["Quotas limit the", "quantity of imports", ["price of exports", "tax rate", "wage level"], "Quotas cap import volumes.", "quantity of imports"],
      ["The balance of payments records", "all transactions with foreigners", ["only exports", "only imports", "only loans"], "It is the full external account.", "all transactions with foreigners"],
      ["The current account covers", "trade and transfers", ["only loans", "only investments", "only reserves"], "Trade, income and transfers sit here.", "trade and transfers"],
      ["The capital account covers", "investments and loans", ["only trade", "only tourism", "only aid"], "Long-term capital flows belong here.", "investments and loans"],
      ["IMF stands for", "International Monetary Fund", ["Internal Money Fund", "Indian Monetary Fund", "International Market Forum"], "The IMF oversees exchange stability.", "International Monetary Fund"],
      ["The World Bank mainly", "lends for development projects", ["prints currency", "sets tariffs", "collects taxes"], "It finances development in member countries.", "lends for development projects"],
    ],
  }),
];
