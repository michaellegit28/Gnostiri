import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Business Topic 3: Business Studies at the no-exceptions bar:
// business forms, management functions, marketing mix, operations, finance, HR.

const BUSINESS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Forms of business — who owns the risk" },
  { type: "table", headers: ["Form", "Owners", "Liability", "Key trait"], rows: [["Sole proprietorship", "One person", "Unlimited — personal assets at risk", "Full control, full risk, easy to start"], ["Partnership", "2–20 partners", "Unlimited (jointly)", "Shared capital, shared disagreements"], ["Private limited (Ltd)", "Shareholders, shares NOT sold publicly", "Limited to investment", "Protected personal assets"], ["Public limited (PLC)", "Public shareholders", "Limited", "Raises capital on the stock exchange, dilutes control"], ["Cooperative", "Members", "Limited", "One member one vote, shared profits"]] },
  { type: "paragraph", text: "The spectrum trades CONTROL against CAPITAL: the sole trader keeps everything and risks everything; the PLC raises unlimited capital and answers to shareholders. Limited liability is the concept the exam centres: personal assets are protected — the company's debts stop at the company." },
  { type: "heading", level: 2, text: "2. Business objectives — what the firm is for" },
  { type: "definition", term: "Objectives", text: "Profit maximisation is the textbook goal, but real firms juggle: survival (start-ups), growth (market share), social mission (non-profits), shareholder value (PLC dividends). Objectives steer EVERY decision — and they change with the business's stage: a start-up wants survival first, profit second." },
  { type: "example", text: "Worked: a new restaurant prices near cost to build a customer base (survival objective) — pricing for profit would empty it. A mature bank maximises shareholder returns. Match the objective to the stage: that is the essay mark." },
  { type: "heading", level: 2, text: "3. Management — the four functions" },
  { type: "definition", term: "POLC", text: "Planning (set goals, decide how), Organising (allocate people and resources), Leading (motivate, direct), Controlling (measure against plan, correct). The cycle runs continuously — control feeds back into planning. Name all four in order: the definition question." },
  { type: "example", text: "Worked: a sales target of 20% growth: PLAN the routes and quotas, ORGANISE the team and budgets, LEAD with incentives, CONTROL by tracking monthly against target — and adjust. The feedback loop is the mark: control without correction is just reporting." },
  { type: "heading", level: 2, text: "4. Management styles and motivation" },
  { type: "paragraph", text: "Styles: autocratic (decide alone — fast, crushing morale), democratic (consult — slower, better buy-in), laissez-faire (delegate — freedom, drift risk). Motivation theories in one line each: Taylor (pay people for output), Maslow (needs ladder — meet the level below first), Herzberg (motivators like recognition, not just hygiene factors like pay). The exam's question: which style or motivator FITS this situation." },
  { type: "example", text: "Worked: a crisis (kitchen fire at service) → autocratic: orders, not committees. A design team → democratic or laissez-faire: creativity dies under orders. Pay alone does not motivate the long term (Herzberg): recognition and growth are the motivators — the two-factor split is the essay mark." },
  { type: "heading", level: 2, text: "5. The marketing mix — the four Ps" },
  { type: "table", headers: ["P", "Decisions", "Exam hook"], rows: [["Product", "Features, quality, branding, range", "Differentiation lives here"], ["Price", "Skimming (high entry), penetration (low entry), competitive", "Skim for novelty, penetrate for share"], ["Place", "Distribution channels, location, online", "Where the customer meets the product"], ["Promotion", "Advertising, sales promotion, personal selling, PR", "Above/below the line"]] },
  { type: "paragraph", text: "The mix must be CONSISTENT: a luxury product with a penetration price confuses the customer — the segments pull against each other. 'Analyse the marketing mix' means the four Ps AND how they interact." },
  { type: "example", text: "Worked: a new phone brand launches: PRODUCT (strong camera — the differentiator), PRICE (penetration — below rivals to win share), PLACE (online first — cheap reach), PROMOTION (social media influencers — where the audience is). Four decisions, one consistent strategy." },
  { type: "heading", level: 2, text: "6. Market research and segmentation" },
  { type: "paragraph", text: "Research before launch: primary (surveys, interviews, focus groups — first-hand, costly, targeted) vs secondary (existing data — cheap, possibly stale). Segment the market: by age, income, geography, lifestyle — then TARGET a segment and POSITION the product in its mind. The chain: segment → target → position (STP) — one acronym, three marks." },
  { type: "example", text: "Worked: a budget airline segments by PRICE-consciousness, not age: students and small firms alike. Primary research (a survey at the departure gate) answers whether they would switch airlines for a lower fare. The segment is chosen by NEED, not demographics — the insight the case study rewards." },
  { type: "heading", level: 2, text: "7. Operations — producing efficiently" },
  { type: "definition", term: "Production methods", text: "Job production (one-offs — a wedding cake), batch (batches of similar items — bakery bread), flow/mass (continuous line — cars). Lean production strips waste: just-in-time inventory (stock arrives as needed — no warehouse, but no buffer), kaizen (continuous improvement). The trade-off: JIT cuts costs but one delayed truck stops the line." },
  { type: "example", text: "Worked: a bespoke tailors uses JOB production (each suit different); a shirt factory uses FLOW. A bakery at 4 am and 2 pm: BATCH. The method follows the product — match them and the mark is yours. JIT's risk: no buffer stock — the supply-chain shock question names it." },
  { type: "heading", level: 2, text: "8. Business finance — sources and statements" },
  { type: "table", headers: ["Source", "Type", "Best for"], rows: [["Retained profit", "Internal", "Established firms — no interest, no dilution"], ["Bank loan", "External, debt", "Fixed repayments — interest cost, assets as security"], ["Share capital", "External, equity", "Growth — no interest but dilutes ownership"], ["Overdraft", "External, short-term", "Cash-flow gaps — expensive for long-term use"], ["Trade credit", "External, short-term", "Buy now, pay later — free if settled on time"]] },
  { type: "paragraph", text: "Debt vs equity is the central choice: debt keeps control but charges interest (and must be repaid in bad years); equity costs no interest but dilutes ownership. Match the source to the need: long-term assets → long-term finance; a cash-flow gap → overdraft or trade credit." },
  { type: "heading", level: 2, text: "9. Cash flow — profit is not cash" },
  { type: "definition", term: "Cash-flow forecast", text: "Cash in minus cash out, month by month — a firm can be PROFITABLE and still fail (profit is an accounting view; cash pays the bills). The forecast identifies the GAP before it happens; the fixes: negotiate credit terms, stage spending, arrange an overdraft. 'Profitable but bust' is the exam's favourite paradox — explain it with the timing difference." },
  { type: "example", text: "Worked: a furniture maker sells 10 million naira of chairs (profit booked) but the customer pays in 90 days — wages are due in 30. The cash-flow forecast shows the gap; trade credit and a deposit close it. The timing, not the trading, kills firms." },
  { type: "heading", level: 2, text: "10. Human resources — the right people" },
  { type: "paragraph", text: "HR cycle: plan (how many, with what skills), recruit (job description, person specification), select (interviews, tests), train (induction, on-the-job, off-the-job), appraise, and retain. Recruitment costs money; retention saves it — appraisal feeds development, not just punishment. The exam's question: internal vs external recruitment (internal: cheap, known quantity, no fresh ideas; external: fresh blood, costly, risky)." },
  { type: "heading", level: 2, text: "11. Stakeholders — everyone with a claim" },
  { type: "paragraph", text: "Stakeholders: shareholders (returns), employees (wages, conditions), customers (quality, price), suppliers (payment), government (tax, compliance), community (jobs, environment). Decisions create CONFLICTS between them: a price cut pleases customers and squeezes shareholders. The essay mark: name the conflict, then judge the priority — shareholders first (PLCs) or the community (cooperatives) depends on the form, chapter 1, recycled." },
  { type: "heading", level: 2, text: "12. Summary — the business spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Forms", "Control vs capital trade-off", "Limited liability stops at the company"], ["Management", "POLC, in order", "Control must correct, not just report"], ["Marketing mix", "Four Ps AND their consistency", "A luxury product with a budget price"], ["Operations", "Method follows the product", "JIT's buffer-free risk"], ["Finance", "Debt vs equity; match term to need", "Long-term assets on overdrafts"], ["Cash flow", "Profit ≠ cash — timing kills", "The profitable-but-bust paradox"], ["Stakeholders", "Name the conflict, judge the priority", "Every decision pleases and pains someone"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'state' = the memorised list in order; 'explain' = the because-chain (why this source, why this style); 'analyse the case' = apply the theory to the named business — the case's details are the marks, not the generic textbook line. Business papers reward the FIT between theory and situation." },
];

const BUSINESS_QS: Q[] = [
  { q: "A sole proprietorship's key weakness is", o: ["difficulty starting", "unlimited liability — personal assets at risk", "too many owners", "no control"], a: "unlimited liability — personal assets at risk", e: "Full control, full risk: the company's debts are personal debts.", d: "easy" },
  { q: "A PLC's advantage over a private company is", o: ["no shareholders", "raising capital publicly on the stock exchange", "unlimited liability", "no need for accounts"], a: "raising capital publicly on the stock exchange", e: "Public shares open unlimited capital — at the cost of control.", d: "easy" },
  { q: "The four management functions in order are", o: ["leading, planning, controlling, organising", "planning, organising, leading, controlling", "organising, controlling, planning, leading", "planning, leading, organising, controlling"], a: "planning, organising, leading, controlling", e: "POLC — and control feeds back into planning.", d: "medium" },
  { q: "A kitchen fire at service demands which management style?", o: ["laissez-faire", "democratic", "autocratic — orders, not committees", "no style"], a: "autocratic — orders, not committees", e: "Crisis = speed: consult later.", d: "medium" },
  { q: "A new product entering a crowded market at a LOW price is using", o: ["price skimming", "penetration pricing", "competitive pricing", "cost-plus pricing"], a: "penetration pricing", e: "Penetrate for share; skim for novelty.", d: "easy" },
  { q: "A luxury product priced cheaply fails because", o: ["the tax is high", "the marketing mix is inconsistent — the Ps pull against each other", "the product is bad", "the place is wrong only"], a: "the marketing mix is inconsistent — the Ps pull against each other", e: "The mix must agree with itself — consistency is the mark.", d: "medium" },
  { q: "A bespoke tailor uses which production method?", o: ["flow production", "batch production", "job production — one-offs", "mass production"], a: "job production — one-offs", e: "The method follows the product: each suit different.", d: "easy" },
  { q: "Just-in-time inventory cuts costs but risks", o: ["high storage costs", "one delayed delivery stopping the whole line", "too much buffer stock", "overproduction"], a: "one delayed delivery stopping the whole line", e: "No buffer: the supply-chain shock is the named risk.", d: "medium" },
  { q: "A profitable furniture firm runs out of cash because", o: ["profit is wrong", "customers pay in 90 days — profit is booked, cash is late", "wages are too high", "taxes are unpaid"], a: "customers pay in 90 days — profit is booked, cash is late", e: "Profit ≠ cash: the timing difference is the explanation.", d: "medium" },
  { q: "Long-term finance for a new factory is best raised via", o: ["an overdraft", "trade credit", "a bank loan or share capital — matched to the term", "retained profit only"], a: "a bank loan or share capital — matched to the term", e: "Match the finance term to the asset: long-term for long-term.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "business-studies" } });
    if (!topic) throw new Error("master business-studies topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("business-studies standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Business Studies — Complete", content: { blocks: BUSINESS_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < BUSINESS_QS.length; i++) {
      const item = BUSINESS_QS[i];
      await prisma.question.upsert({
        where: { id: `master-business-studies-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-business-studies-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "business-rebuild", blocks: BUSINESS_BLOCKS.length, questions: BUSINESS_QS.length });
  } catch (e) {
    console.error("rebuild business failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
