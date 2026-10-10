import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Business Topic 1: Microeconomics at the no-exceptions bar:
// supply & demand, elasticity, market structures, consumer behaviour, market failure.

const MICRO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Demand — the law and the curve" },
  { type: "definition", term: "Law of demand", text: "As PRICE rises, quantity demanded FALLS (ceteris paribus — everything else held constant): the demand curve slopes DOWNWARD. Why: the substitution effect (buyers switch to cheaper alternatives) and the income effect (higher prices shrink real spending power). Demand is the whole CURVE; quantity demanded is a POINT on it — the distinction every diagram question tests." },
  { type: "example", text: "Worked: a rise in the price of beef shifts buyers to chicken — chicken's demand curve SHIFTS RIGHT (a substitute's price rose). A movement ALONG beef's curve (less beef bought at its higher price) is NOT a shift. Movement along = own price changed; shift of the curve = anything else changed. That one sentence is the most-tested distinction in micro." },
  { type: "heading", level: 2, text: "2. Supply — the mirror image" },
  { type: "definition", term: "Law of supply", text: "As PRICE rises, quantity supplied RISES: the supply curve slopes UPWARD — higher prices make production profitable, so firms produce more. Costs of production, technology, and the number of firms shift the curve: cheaper inputs shift supply RIGHT (more supplied at every price)." },
  { type: "example", text: "Worked: a subsidy on fertiliser cuts farmers' costs → supply curve of maize shifts RIGHT → price falls, quantity rises. A poor harvest shifts supply LEFT → price rises. Read the diagram in one beat: which curve moved, which way, and what happened to price and quantity — four facts, every supply-shock question." },
  { type: "heading", level: 2, text: "3. Equilibrium — where the curves cross" },
  { type: "diagram", diagramId: "supply-demand", caption: "The X that prices everything: surplus above, shortage below" },
  { type: "paragraph", text: "Equilibrium: where demand meets supply — the market CLEARS (quantity supplied = quantity demanded). Above equilibrium: SURPLUS (excess supply) — unsold stock pushes prices DOWN. Below: SHORTAGE (excess demand) — desperate buyers push prices UP. The market self-corrects toward equilibrium: the invisible hand is just surplus and shortage doing arithmetic." },
  { type: "example", text: "Worked: a price floor (minimum wage, price fixed ABOVE equilibrium) creates a SURPLUS — more workers offering labour than jobs demanded: unemployment. A price ceiling (rent control, fixed BELOW equilibrium) creates a SHORTAGE — queues, black markets. Name the gap, then its consequence: the two-beat answer every intervention question wants." },
  { type: "heading", level: 2, text: "4. Elasticity — how much, not just which way" },
  { type: "table", headers: ["Elasticity", "Question it answers", "Formula", "Reading"], rows: [["Price elasticity of demand (PED)", "How much does quantity demanded respond to price?", "%ΔQ ÷ %ΔP", "PED > 1 elastic; < 1 inelastic"], ["Income elasticity (YED)", "Respond to income?", "%ΔQ ÷ %ΔI", "Positive = normal; negative = inferior"], ["Cross elasticity (XED)", "Respond to another good's price?", "%ΔQa ÷ %ΔPb", "Positive = substitutes; negative = complements"], ["Price elasticity of supply (PES)", "How much does quantity supplied respond?", "%ΔQs ÷ %ΔP", "Higher when capacity is spare"]] },
  { type: "example", text: "Worked: price rises 10%, quantity falls 20% → PED = 2 (elastic). Determinants: elastic when substitutes exist, the good is a luxury, or the budget share is big; inelastic when it is a necessity with no substitute (insulin, salt) — the determinants are the essay, the number is the start." },
  { type: "heading", level: 2, text: "5. Elasticity and revenue — the pricing question" },
  { type: "paragraph", text: "Total revenue = price × quantity. When demand is ELASTIC, raising price LOWERS revenue (quantity falls more than price rises); when INELASTIC, raising price RAISES revenue. A firm facing inelastic demand raises price; facing elastic demand, it holds or cuts — the rule that turns a diagram into a business decision." },
  { type: "example", text: "Worked: petrol is inelastic (no substitute in the short run) — fuel taxes raise revenue because drivers barely cut back. Cinema tickets are elastic — a price rise empties seats and revenue falls. 'Should the firm raise prices?' → find PED first, answer second." },
  { type: "heading", level: 2, text: "6. Market structures — the spectrum" },
  { type: "table", headers: ["Structure", "Firms", "Price power", "Examples"], rows: [["Perfect competition", "Many tiny, identical products", "None — price takers", "Wheat farming (idealised)"], ["Monopolistic competition", "Many, slightly different products", "Some — branding", "Restaurants, hairdressers"], ["Oligopoly", "A few big firms", "Shared, interdependent", "Airlines, cement, telecoms"], ["Monopoly", "One firm", "Full — price maker", "National utility, patented drug"]] },
  { type: "paragraph", text: "The spectrum runs on two dials: number of firms and product differentiation. Perfect competition and monopoly are the two poles the theory is built around; the middle is where most real markets live." },
  { type: "heading", level: 2, text: "7. Perfect competition — the benchmark" },
  { type: "definition", term: "Price takers", text: "Many small firms selling IDENTICAL products with free entry and exit: no single firm can influence price — they take it. Firms earn only NORMAL profit in the long run (economic profit attracts entrants, competition erodes it). It is the efficiency benchmark: price = marginal cost, no waste." },
  { type: "example", text: "Worked: a wheat farmer charging above the market price sells nothing (buyers switch instantly — identical wheat). Below it, they lose money needlessly. The demand curve facing ONE firm is perfectly flat — the diagrammatic signature of a price taker." },
  { type: "heading", level: 2, text: "8. Monopoly — the price maker" },
  { type: "definition", term: "Monopoly power", text: "A single seller (or dominant firm): the firm IS the industry, facing the whole market's downward-sloping demand. It restricts output and charges ABOVE the competitive price — earning supernormal profit even long-run, because barriers block entrants (legal, natural — huge scale economies, or control of a resource)." },
  { type: "example", text: "Worked: a patented drug — the patent is a legal barrier (20 years of monopoly); a national grid's cables — a natural barrier (duplicating it would be absurd). Consequences: higher price, lower output, deadweight loss — and the regulation question: price caps, or breaking it up." },
  { type: "heading", level: 2, text: "9. Consumer behaviour — utility and rational choice" },
  { type: "definition", term: "Utility", text: "Utility = satisfaction from consumption. Diminishing MARGINAL utility: each extra unit satisfies less than the last — the fifth slice of pizza is worth less than the first. Consumers maximise utility when the marginal utility per naira spent is EQUAL across goods: the equi-marginal principle." },
  { type: "example", text: "Worked: 1000 naira, choosing between suya (500 each, first one great) and juice (250 each): buy until the last naira on each gives equal satisfaction. Water is cheap (low price despite high total utility — the diamond-water paradox) because its MARGINAL utility is low: you already have plenty. Marginal, not total, decides price." },
  { type: "heading", level: 2, text: "10. Market failure — when the invisible hand stumbles" },
  { type: "table", headers: ["Failure", "What goes wrong", "Government response"], rows: [["Externalities", "Costs or benefits hit outsiders (pollution, vaccination)", "Taxes on negative, subsidies for positive"], ["Public goods", "Non-excludable → free-riding → nobody provides", "Government provides directly (streetlights, defence)"], ["Information gaps", "Buyers know less than sellers (used cars)", "Regulation, labelling, standards"], ["Monopoly power", "Restricted output, high prices", "Antitrust, price caps"]] },
  { type: "paragraph", text: "Market failure is the exam's favourite justification: EVERY government intervention question starts here — name the failure, then judge the response. A negative externality (factory smoke) means the market price is TOO LOW: the tax 'internalises' the cost, pushing it up to the true price." },
  { type: "heading", level: 2, text: "11. Summary — the micro spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Diagrams", "Which curve moved, which way", "Movement along ≠ shift"], ["Equilibrium", "Gap → consequence", "Price floor → surplus, ceiling → shortage"], ["Elasticity", "Formula, then determinants", "Elasticity ≠ slope"], ["Revenue", "Find PED first", "Elastic: raise price, lose revenue"], ["Structures", "Firms + differentiation", "Monopoly earns profit long-run"], ["Intervention", "Name the market failure first", "Every policy needs a failure to fix"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain' = the because-chain with the mechanism named (substitution effect, barriers to entry, externality); 'analyse' = chain two links (shift → price → quantity → revenue); 'evaluate' = both sides, then a judgement with a reason. Micro papers pay for the mechanism — a labelled curve without a sentence earns half." },
];

const MICRO_QS: Q[] = [
  { q: "The price of beef rises. Quantity demanded of beef falls — this is", o: ["a shift of the demand curve", "a movement along the demand curve", "a shift of the supply curve", "no change"], a: "a movement along the demand curve", e: "Own price changed → movement along. Anything else shifts the curve.", d: "easy" },
  { q: "A fertiliser subsidy shifts the maize supply curve right. The result is", o: ["higher price, higher quantity", "lower price, higher quantity", "higher price, lower quantity", "lower price, lower quantity"], a: "lower price, higher quantity", e: "Supply right → the X moves down-right: price falls, quantity rises.", d: "easy" },
  { q: "A price ceiling set below equilibrium creates", o: ["a surplus", "a shortage", "equilibrium", "higher supply"], a: "a shortage", e: "Below equilibrium: demand exceeds supply — queues and black markets.", d: "easy" },
  { q: "Price rises 10%, quantity demanded falls 20%. Demand is", o: ["inelastic (PED = 0.5)", "elastic (PED = 2)", "unit elastic (PED = 1)", "perfectly inelastic"], a: "elastic (PED = 2)", e: "20 ÷ 10 = 2 — quantity responds more than price: elastic.", d: "easy" },
  { q: "A firm faces INELASTIC demand. To raise revenue it should", o: ["cut prices", "raise prices", "hold prices", "leave the market"], a: "raise prices", e: "Inelastic: quantity barely falls — revenue = P × Q rises.", d: "medium" },
  { q: "In perfect competition, a single firm is", o: ["a price maker", "a price taker — the demand curve it faces is flat", "a monopolist", "a regulated utility"], a: "a price taker — the demand curve it faces is flat", e: "Identical products, many firms: charge more, sell nothing.", d: "medium" },
  { q: "A monopoly can earn supernormal profit in the long run because", o: ["it produces more", "barriers to entry block competitors", "its demand curve is flat", "it has no costs"], a: "barriers to entry block competitors", e: "Legal, natural, or resource barriers — profit survives entry.", d: "medium" },
  { q: "The fifth slice of pizza satisfies less than the first. This is", o: ["increasing marginal utility", "diminishing marginal utility", "the income effect", "equi-marginal principle"], a: "diminishing marginal utility", e: "Each extra unit satisfies less — the marginal falls.", d: "easy" },
  { q: "Factory pollution is best described as", o: ["a public good", "a negative externality — costs hit outsiders", "a merit good", "a monopoly"], a: "a negative externality — costs hit outsiders", e: "Third parties bear costs the price ignores — the tax fixes it.", d: "medium" },
  { q: "Street lighting is usually provided by government because it is", o: ["a luxury good", "non-excludable — free-riders make private provision impossible", "a negative externality", "elastic in demand"], a: "non-excludable — free-riders make private provision impossible", e: "Public good: you cannot exclude non-payers from the light.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "microeconomics" } });
    if (!topic) throw new Error("master microeconomics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("microeconomics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Microeconomics — Complete", content: { blocks: MICRO_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < MICRO_QS.length; i++) {
      const item = MICRO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-microeconomics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-microeconomics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "micro-rebuild", blocks: MICRO_BLOCKS.length, questions: MICRO_QS.length });
  } catch (e) {
    console.error("rebuild micro failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
