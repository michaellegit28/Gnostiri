import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Business Topic 2: Macroeconomics at the no-exceptions bar:
// GDP, inflation, unemployment, fiscal and monetary policy, trade, development.

const MACRO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. GDP — the economy's scoreboard" },
  { type: "definition", term: "Gross Domestic Product", text: "GDP = the total value of all FINAL goods and services produced within a country in a period. Final, not intermediate (the steel in a car is counted once — inside the car): double-counting is the classic trap. GDP per capita = GDP ÷ population — the average, not the distribution. Real GDP strips out inflation; nominal does not — comparing years requires REAL." },
  { type: "example", text: "Worked: nominal GDP grew 10% but inflation was 6% → real growth ≈ 4% — the inflation must be subtracted before celebrating. GDP measures OUTPUT, not welfare: unpaid housework, leisure, and the black economy are invisible to it — the exam's standard critique." },
  { type: "heading", level: 2, text: "2. The business cycle — the economy's heartbeat" },
  { type: "diagram", diagramId: "business-cycle", caption: "Boom, recession, trough, recovery — the cycle repeats" },
  { type: "paragraph", text: "Economies cycle around the long-run trend: BOOM (output above trend, rising prices, low unemployment), RECESSION (output FALLING — technically two consecutive quarters), TROUGH (the bottom), RECOVERY (output rising again). The cycle's four phases and their symptoms are the matching question: name the phase from its symptoms." },
  { type: "example", text: "Worked: rising unemployment, falling output, falling prices → recession. Overheating: capacity strains, wages and prices chase each other → boom, and the policy response is to COOL it (raise interest rates). Policy leans against the cycle — the one-line summary of macro management." },
  { type: "heading", level: 2, text: "3. Inflation — too much money chasing too few goods" },
  { type: "definition", term: "Inflation", text: "A sustained RISE in the general price level, measured by the Consumer Price Index (a basket of goods — the basket's contents are the CPI's weakness). Demand-pull: too much AGGREGATE demand (the chase from the demand side). Cost-push: rising INPUT costs (oil, wages) push prices from the supply side. Name the cause — the two-inflation question demands it." },
  { type: "example", text: "Worked: an oil price shock raises transport and production costs economy-wide → cost-push inflation (prices rise while output FALLS — the nasty combination). A tax-cut splurge with full employment → demand-pull. The victims: savers (cash melts), fixed-income earners (pensions); the winners: borrowers (debts shrink in real terms)." },
  { type: "heading", level: 2, text: "4. Unemployment — the types" },
  { type: "table", headers: ["Type", "Cause", "Example"], rows: [["Frictional", "Between jobs — normal turnover", "A graduate searching for a first role"], ["Structural", "Skills mismatch — industries change", "Typists after computers; miners after closures"], ["Cyclical", "Fallen demand in a downturn", "Layoffs in a recession"], ["Seasonal", "Time of year", "Farmhands, holiday staff"]] },
  { type: "paragraph", text: "The diagnostic question: WHY is this worker unemployed? Skills obsolete → structural (retraining is the fix, not stimulus). Whole industries laying off in a downturn → cyclical (stimulus IS the fix). Matching the type to the remedy is the essay mark." },
  { type: "heading", level: 2, text: "5. Fiscal policy — the government's budget" },
  { type: "definition", term: "Fiscal policy", text: "Government spending and taxation. Expansionary (recession): RAISE spending, CUT taxes — inject demand. Contractionary (boom/inflation): cut spending, RAISE taxes — withdraw demand. Budget deficit = spending above tax (borrowed); surplus = tax above spending. The multiplier: an injection circulates — spending becomes someone's income, spent again, amplified." },
  { type: "example", text: "Worked: a 10 billion naira road project pays builders, who spend at shops, who pay staff... the total demand rise EXCEEDS 10 billion — the multiplier at work. Crowding out (the critique): government borrowing pushes up interest rates, squeezing private investment — one side of the evaluation." },
  { type: "heading", level: 2, text: "6. Monetary policy — the central bank's levers" },
  { type: "definition", term: "Interest rates", text: "The central bank sets the policy interest rate (Nigeria: MPR): RAISE rates → borrowing costs more, saving pays more → demand cools, inflation falls (but investment and growth suffer). CUT rates → the reverse. Other tools: reserve requirements, open-market operations (buying/selling bonds). The trade-off is the exam's favourite evaluation: inflation vs growth." },
  { type: "example", text: "Worked: inflation at 20% → the bank raises rates: mortgages cost more, big purchases are postponed, demand cools — but firms postpone investment too, so unemployment may rise. The policy trade-off stated in one line earns the evaluation mark." },
  { type: "heading", level: 2, text: "7. Money — its functions and inflation's erosion" },
  { type: "paragraph", text: "Money's three functions: MEDIUM of exchange (no barter needed), UNIT of account (prices quoted in it), STORE of value (saves purchasing power). Inflation attacks the third: at 20% inflation, cash loses a fifth of its value in a year — why savers flee to assets. The quantity theory in one line: too much money chasing too few goods → prices rise." },
  { type: "heading", level: 2, text: "8. International trade — why countries trade" },
  { type: "definition", term: "Comparative advantage", text: "Countries gain by specialising where their OPPORTUNITY COST is lowest — even a country worse at EVERYTHING gains from trade (the counter-intuitive result the exam loves). Absolute advantage = better at producing; comparative = lower opportunity cost. Specialise and trade: total output rises for both." },
  { type: "example", text: "Worked: country A makes 10 cars or 20 sacks of rice per worker; country B makes 6 cars or 6 sacks. B is worse at both — but its opportunity cost of rice (1 car per sack vs A's 0.5) means A should specialise in rice... wait — A gives up 0.5 cars per sack, B gives up 1. A's opportunity cost is LOWER → A in rice, B in cars. Total output rises: the two-country calculation is the exam's set piece." },
  { type: "heading", level: 2, text: "9. Protectionism — the barriers" },
  { type: "paragraph", text: "Tariffs (taxes on imports), quotas (quantity limits), subsidies (to local firms), embargoes (bans). The case for: protect infant industries, shield jobs, national security. The case against: higher prices for consumers, retaliation, inefficiency — protected industries never grow up. The evaluation: both sides, then the judgement — infant-industry arguments carry weight only with an exit plan." },
  { type: "heading", level: 2, text: "10. Exchange rates and the balance of payments" },
  { type: "definition", term: "Exchange rate", text: "The price of one currency in another. Depreciation (currency falls) → exports cheaper, imports dearer → good for exporters, bad for importers. The balance of payments: current account (trade in goods and services) + capital account. A trade deficit means imports exceed exports — financed by borrowing or selling assets, not free money." },
  { type: "example", text: "Worked: the naira depreciates → imported rice costs more (importers suffer) but exported cocoa earns more naira (exporters gain). Net effect depends on the elasticities — chapter 1, recycled. 'Who gains, who loses?' is the two-part answer every exchange-rate question wants." },
  { type: "heading", level: 2, text: "11. Development — beyond GDP" },
  { type: "paragraph", text: "Development is more than growth: the Human Development Index blends income, LIFE EXPECTANCY, and education — a fuller scoreboard. Barriers: the poverty trap (low income → no saving → no investment → low income), debt burdens, commodity dependence (exporting raw materials, importing manufactures — the terms of trade squeeze). Policies: education, infrastructure, diversification — each aimed at a named barrier." },
  { type: "heading", level: 2, text: "12. Summary — the macro spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["GDP", "Real vs nominal; final vs intermediate", "Double-counting; inflation not stripped"], ["Inflation", "Name the cause: demand-pull or cost-push", "Winners and losers both listed"], ["Unemployment", "Type → remedy", "Structural needs retraining, not stimulus"], ["Fiscal", "Lean against the cycle; multiplier", "Crowding out in the evaluation"], ["Monetary", "Rate up: inflation down, growth down", "The trade-off is the answer"], ["Trade", "Comparative advantage = lowest opportunity cost", "Absolute advantage is NOT the rule"], ["Exchange rates", "Depreciation: exporters gain, importers lose", "Both sides, always"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain' = the mechanism (multiplier, chase, opportunity cost); 'analyse' = two links chained; 'evaluate' = both sides + a judgement with a reason — macro papers pay for the trade-off named, never for the policy alone." },
];

const MACRO_QS: Q[] = [
  { q: "Nominal GDP grew 10%; inflation was 6%. Real growth is about", o: ["4%", "10%", "16%", "6%"], a: "4%", e: "Strip inflation before comparing years — real vs nominal.", d: "easy" },
  { q: "The steel in a car is counted in GDP", o: ["twice — steel and car", "once — inside the car's final value", "not at all", "as an export"], a: "once — inside the car's final value", e: "FINAL goods only — double-counting is the trap.", d: "easy" },
  { q: "Rising unemployment, falling output, falling prices. The phase is", o: ["boom", "recession", "recovery", "trough"], a: "recession", e: "Match the symptoms: falling output two quarters running.", d: "easy" },
  { q: "An oil price shock raising economy-wide costs is", o: ["demand-pull inflation", "cost-push inflation — prices rise while output falls", "deflation", "frictional unemployment"], a: "cost-push inflation — prices rise while output falls", e: "The supply-side cause: input costs push prices up.", d: "medium" },
  { q: "Typists unemployed because computers replaced them are", o: ["cyclically unemployed", "structurally unemployed — retraining is the fix", "frictionally unemployed", "seasonally unemployed"], a: "structurally unemployed — retraining is the fix", e: "Skills mismatch: stimulus cannot help; retraining can.", d: "medium" },
  { q: "In a recession, expansionary fiscal policy means", o: ["raise taxes, cut spending", "cut taxes, raise spending — inject demand", "raise interest rates", "sell bonds only"], a: "cut taxes, raise spending — inject demand", e: "Lean against the cycle: recessions get injections.", d: "easy" },
  { q: "The central bank raises interest rates. The immediate effect is", o: ["demand cools, inflation eases — but investment falls", "demand rises", "unemployment falls immediately", "exports boom"], a: "demand cools, inflation eases — but investment falls", e: "The trade-off IS the answer: inflation vs growth.", d: "medium" },
  { q: "Country A is worse than B at producing BOTH goods. Trade between them", o: ["cannot benefit A", "still benefits both — comparative advantage is about opportunity cost", "benefits only B", "hurts both"], a: "still benefits both — comparative advantage is about opportunity cost", e: "Specialise where YOUR opportunity cost is lowest — absolute advantage is not the rule.", d: "hard" },
  { q: "The naira depreciates. Who gains?", o: ["importers", "exporters — their earnings convert to more naira", "savers holding dollars only", "nobody"], a: "exporters — their earnings convert to more naira", e: "Depreciation: exports cheaper abroad, imports dearer at home.", d: "medium" },
  { q: "The Human Development Index includes income plus", o: ["military strength and exports", "life expectancy and education", "inflation and interest rates", "GDP alone"], a: "life expectancy and education", e: "Development is more than output — HDI is the fuller scoreboard.", d: "easy" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "macroeconomics" } });
    if (!topic) throw new Error("master macroeconomics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("macroeconomics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Macroeconomics — Complete", content: { blocks: MACRO_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < MACRO_QS.length; i++) {
      const item = MACRO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-macroeconomics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-macroeconomics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "macro-rebuild", blocks: MACRO_BLOCKS.length, questions: MACRO_QS.length });
  } catch (e) {
    console.error("rebuild macro failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
