import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Business Topic 4: Accounting at the no-exceptions bar:
// double entry, trial balance, financial statements, ratio analysis, depreciation, adjustments.

const ACC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The accounting equation — the foundation" },
  { type: "definition", term: "Assets = Liabilities + Capital", text: "Everything the business OWNS (assets) was funded by what it OWES (liabilities — to outsiders) plus what the OWNER put in (capital). The equation ALWAYS balances — it is not a rule to remember but a definition to understand: every transaction keeps both sides equal." },
  { type: "diagram", diagramId: "accounting-equation", caption: "Both sides always balance — every transaction twice" },
  { type: "example", text: "Worked: owner puts in 500,000 naira (assets +500,000, capital +500,000); the firm borrows 200,000 (assets +200,000, liabilities +200,000); buys a van for 300,000 cash (assets swap: +van, −cash — both sides unchanged). Three transactions, balance preserved every time — that IS double entry." },
  { type: "heading", level: 2, text: "2. Double entry — every transaction twice" },
  { type: "definition", term: "Debit and credit", text: "Every transaction hits at least TWO accounts: one DEBIT, one CREDIT, equal amounts. Debit: assets and expenses INCREASE (and liabilities/capital decrease). Credit: liabilities, capital, and INCOME increase (and assets decrease). The mnemonic: DEALER — Debits: Expenses, Assets, Losses; Credits:... the reverse. Or learn the table." },
  { type: "table", headers: ["Account type", "To increase", "To decrease"], rows: [["Assets (cash, van, stock)", "DEBIT", "credit"], ["Expenses (rent, wages)", "DEBIT", "credit"], ["Liabilities (loans, payables)", "credit", "DEBIT"], ["Capital / equity", "credit", "DEBIT"], ["Income (sales)", "credit", "DEBIT"]] },
  { type: "example", text: "Worked: pay rent 50,000 cash → Debit rent (expense up), Credit cash (asset down). Sell goods 120,000 on credit → Debit debtor (asset up), Credit sales (income up). Buy stock 80,000 cash → Debit stock, Credit cash. Two lines per transaction, equal and opposite — the ledger never lies when both are posted." },
  { type: "heading", level: 2, text: "3. The trial balance — the checkpoint" },
  { type: "paragraph", text: "List every account's balance; total the debits and credits: they must be EQUAL. The trial balance proves the double entry (arithmetic-wise) but NOT the bookkeeping (a wrong account that still balances slips through). Errors the trial balance CATCHES: one-sided entries, unequal amounts. Errors it MISSES: errors of principle (wrong account type), complete omissions, compensating errors — the exam's favourite list." },
  { type: "example", text: "Worked: debits total 1,240,000; credits 1,240,000 ✓ balanced. But rent posted to the VEHICLE account (same amount, both sides still equal) — the trial balance smiles, the books are wrong. Errors of principle escape the trial balance: that is why suspense accounts exist, and why the exam lists the errors it does not catch." },
  { type: "heading", level: 2, text: "4. The income statement — profit step by step" },
  { type: "definition", term: "Profit statement", text: "Revenue − cost of sales = GROSS PROFIT; gross profit − expenses = NET PROFIT. Cost of sales = opening stock + purchases − closing stock (the stock adjustment is the trap: forget it and gross profit is wrong). Gross margin shows trading efficiency; net margin shows overall efficiency." },
  { type: "example", text: "Worked: revenue 2,000,000; opening stock 200,000; purchases 1,100,000; closing stock 300,000 → cost of sales = 200,000 + 1,100,000 − 300,000 = 1,000,000 → gross profit 1,000,000 (50% margin); expenses 400,000 → net profit 600,000 (30% margin). The closing stock subtraction is the marked line." },
  { type: "heading", level: 2, text: "5. The balance sheet — a snapshot, not a video" },
  { type: "definition", term: "Position statement", text: "Assets = liabilities + capital, laid out: NON-CURRENT assets (buildings, vans — lasting over a year), CURRENT assets (stock, debtors, cash — turning over within a year), CURRENT liabilities (payables, overdraft — due within a year). Working capital = current assets − current liabilities — the fuel for daily operations." },
  { type: "example", text: "Worked: non-current 800,000 + current 700,000 (stock 300k, debtors 250k, cash 150k) = 1,500,000; current liabilities 400,000 → working capital = 300,000 — positive: the firm can pay its near-term bills. Classify first, then compute — the classification IS the method." },
  { type: "heading", level: 2, text: "6. Depreciation — spreading the cost" },
  { type: "definition", term: "Depreciation", text: "A non-current asset's cost is SPREAD over its useful life — not expensed at purchase. Straight-line: (cost − residual) ÷ life (equal amounts each year). Reducing balance: a FIXED PERCENTAGE of the remaining book value (big at first, shrinking — matches how cars lose value). Depreciation is a NON-CASH expense — profit falls, cash does not (the trap)." },
  { type: "example", text: "Worked: van costs 1,000,000, residual 100,000, life 5 years → straight-line = 180,000/year; book value after 2 years = 1,000,000 − 360,000 = 640,000. Reducing balance at 20%: year 1 = 200,000, year 2 = 160,000 (20% of 800,000) — shrinking. The two methods answer different questions; the exam names which." },
  { type: "heading", level: 2, text: "7. Accruals and prepayments — matching, not cash timing" },
  { type: "paragraph", text: "The MATCHING principle: expenses belong to the period they RELATE to, not when paid. ACCRUAL: owed but not yet paid — add to the expense (wages owed at year-end). PREPAYMENT: paid in advance — subtract (next year's rent paid early). The adjustment runs both ways: the income statement shows what the period CONSUMED, not what it paid." },
  { type: "example", text: "Worked: rent paid 600,000 but 100,000 of it covers NEXT year → expense this year = 500,000 (prepayment). Electricity used 80,000, bill unpaid → expense = 80,000 (accrual) with a liability. 'Paid' vs 'consumed' is the distinction the adjustment question tests." },
  { type: "heading", level: 2, text: "8. Ratio analysis — profitability" },
  { type: "table", headers: ["Ratio", "Formula", "Reads as"], rows: [["Gross margin", "Gross profit ÷ revenue × 100", "Trading efficiency"], ["Net margin", "Net profit ÷ revenue × 100", "Overall efficiency"], ["ROCE", "Operating profit ÷ capital employed × 100", "Return on the money invested"], ["Markup", "Gross profit ÷ cost of sales × 100", "Profit on cost — NOT on revenue (the trap)"]] },
  { type: "example", text: "Worked: gross 1,000,000, revenue 2,000,000 → margin 50%; markup = 1,000,000 ÷ 1,000,000 = 100% — different ratios, different bases: margin is on REVENUE, markup is on COST. Confusing them is the classic exam slip. ROCE compares against the interest rate: beat it or the capital would be better in the bank." },
  { type: "heading", level: 2, text: "9. Ratio analysis — liquidity and efficiency" },
  { type: "table", headers: ["Ratio", "Formula", "Reads as"], rows: [["Current ratio", "Current assets ÷ current liabilities", "Comfort: ~2 is traditional"], ["Quick (acid test)", "(Current assets − stock) ÷ current liabilities", "Crisis comfort: stock may not sell fast"], ["Debtor days", "Debtors ÷ revenue × 365", "How long customers take to pay"], ["Stock turnover", "Cost of sales ÷ average stock", "How fast stock sells"]] },
  { type: "example", text: "Worked: current 700,000, current liabilities 400,000 → current ratio 1.75; quick = (700 − 300)/400 = 1.0 — comfortable on paper, tighter without stock. The quick ratio strips stock because stock must be SOLD before it becomes cash — the reasoning is the mark, not just the number." },
  { type: "heading", level: 2, text: "10. Bank reconciliation — why the balances differ" },
  { type: "paragraph", text: "The bank statement and the cash book differ for TIMING reasons (cheques not yet presented, deposits not yet cleared) and OMISSIONS (bank charges, direct debits, standing orders — the bank knows first). Reconcile: adjust the cash book for the omissions, then the adjusted balances should agree once timing items are listed. The un-presented cheque is the exam's staple: deducted by the business, not yet by the bank." },
  { type: "example", text: "Worked: cash book 450,000; bank statement 400,000 — difference: a 60,000 cheque written but not presented (−60,000 in the bank's view) and a 10,000 bank charge never recorded (+10,000 adjustment to the cash book). Adjust the cash book first (charge), list the timing items second — the two-step order is the mark." },
  { type: "heading", level: 2, text: "11. Control accounts — catching the errors" },
  { type: "paragraph", text: "Control accounts (sales ledger, purchases ledger) summarise the personal accounts: the total of individual DEBTOR balances must equal the sales ledger control. Discrepancies expose errors: a posting to the wrong customer, an unrecorded discount. The control account is the accountant's smoke detector — it does not say WHERE the fire is, only that one exists." },
  { type: "heading", level: 2, text: "12. Summary — the accounting spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Double entry", "Two lines, equal and opposite", "Debit assets/expenses UP — memorise the table"], ["Trial balance", "Totals equal — but not proof of correctness", "Errors of principle escape it"], ["Income statement", "Cost of sales: + opening, − closing stock", "The closing stock subtraction"], ["Depreciation", "Method named? Straight or reducing", "Non-cash expense: profit falls, cash does not"], ["Adjustments", "Consumed, not paid", "Accrual up, prepayment down"], ["Ratios", "Formula's base: revenue or cost", "Margin ≠ markup"], ["Reconciliation", "Adjust cash book, then list timing", "Un-presented cheques"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'prepare' = statement in the standard layout, every line labelled; 'adjust' = the consumed amount, not the paid amount; 'calculate the ratio' = formula, substitution, the BASE named. Accounting papers pay the layout and the label — a correct number in the wrong place earns half." },
];

const ACC_QS: Q[] = [
  { q: "The accounting equation is", o: ["Assets = Liabilities − Capital", "Assets = Liabilities + Capital", "Assets + Liabilities = Capital", "Assets = Revenue − Expenses"], a: "Assets = Liabilities + Capital", e: "Everything owned is funded by owed or by the owner.", d: "easy" },
  { q: "Paying rent 50,000 in cash is recorded as", o: ["Debit cash, credit rent", "Debit rent (expense up), credit cash (asset down)", "Debit capital, credit rent", "Debit rent, credit bank only"], a: "Debit rent (expense up), credit cash (asset down)", e: "Expenses debit UP; assets credit DOWN — two lines, equal.", d: "easy" },
  { q: "Rent posted to the vehicle account (same amount) escapes the trial balance because", o: ["the amounts are unequal", "errors of principle still balance — wrong account, right amount", "the trial balance catches everything", "vehicles are not assets"], a: "errors of principle still balance — wrong account, right amount", e: "The trial balance proves arithmetic, not correctness — the classic list.", d: "medium" },
  { q: "Revenue 2,000,000; opening stock 200,000; purchases 1,100,000; closing stock 300,000. Cost of sales is", o: ["1,600,000", "1,000,000", "1,300,000", "900,000"], a: "1,000,000", e: "200,000 + 1,100,000 − 300,000 — the closing stock subtraction is the trap.", d: "medium" },
  { q: "A van costs 1,000,000, residual 100,000, life 5 years. Straight-line depreciation is", o: ["200,000/year", "180,000/year", "100,000/year", "20,000/year"], a: "180,000/year", e: "(1,000,000 − 100,000) ÷ 5 — residual first, then divide.", d: "easy" },
  { q: "Reducing-balance depreciation charges", o: ["equal amounts each year", "a fixed percentage of the REMAINING book value — big at first", "nothing after year one", "only on disposal"], a: "a fixed percentage of the REMAINING book value — big at first", e: "20% of 1,000,000 then 20% of 800,000 — shrinking, like a car's value.", d: "medium" },
  { q: "Rent paid 600,000 but 100,000 covers next year. This year's expense is", o: ["700,000", "600,000", "500,000 — the prepayment is subtracted", "100,000"], a: "500,000 — the prepayment is subtracted", e: "Consumed, not paid: matching principle.", d: "medium" },
  { q: "Gross profit 1,000,000 on revenue 2,000,000 and cost of sales 1,000,000. Margin and markup are", o: ["50% and 100%", "100% and 50%", "both 50%", "both 100%"], a: "50% and 100%", e: "Margin on REVENUE (1m/2m); markup on COST (1m/1m) — different bases.", d: "medium" },
  { q: "The quick ratio strips stock because", o: ["stock is valuable", "stock must be sold before it becomes cash", "stock is a liability", "stock inflates profit"], a: "stock must be sold before it becomes cash", e: "Crisis comfort: the reasoning is the mark, not just the number.", d: "medium" },
  { q: "Cash book 450,000; bank statement 400,000; un-presented cheque 60,000; unrecorded bank charge 10,000. Adjusted cash book is", o: ["440,000", "460,000", "400,000", "450,000"], a: "440,000", e: "Deduct the charge: 450,000 − 10,000 = 440,000; then the timing item explains the rest.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "accounting" } });
    if (!topic) throw new Error("master accounting topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("accounting standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Accounting — Complete", content: { blocks: ACC_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < ACC_QS.length; i++) {
      const item = ACC_QS[i];
      await prisma.question.upsert({
        where: { id: `master-accounting-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-accounting-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "accounting-rebuild", blocks: ACC_BLOCKS.length, questions: ACC_QS.length });
  } catch (e) {
    console.error("rebuild accounting failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
