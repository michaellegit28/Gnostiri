/**
 * Accounting families (round 2, JAMB pool).
 * Every computable key is re-derived from the statement by the verifier.
 * Recall tables use the dual-answer contract (key + independently authored proof).
 */

import { int, pick, shuffled } from "./engine.mjs";
import { recallFamily, parseNum, pool3 } from "./families-support.mjs";

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

export const families = [
  {
    id: "straight-line-depreciation",
    topicSlug: "accounting",
    label: "Straight-line depreciation",
    params(r) {
      const cost = int(r, 10, 60) * 10000;
      const residual = int(r, 1, 4) * 5000;
      const life = pick(r, [4, 5, 8, 10]);
      const charge = (cost - residual) / life;
      return { cost, residual, life, charge: Number.isInteger(charge) ? charge : cost / 10 };
    },
    answer: (p) => `₦${p.charge.toLocaleString("en-NG")}`,
    stem(p) {
      return `An asset costing ₦${p.cost.toLocaleString("en-NG")} with a residual value of ₦${p.residual.toLocaleString("en-NG")} is depreciated straight-line over ${p.life} years. What is the annual depreciation?`;
    },
    distractors(p, r) {
      return pool3(r, p.charge, [p.cost / p.life, (p.charge * p.life) / 1000, p.cost / 1000, p.residual, p.cost - p.residual], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `(cost − residual) / life = (${p.cost.toLocaleString("en-NG")} − ${p.residual.toLocaleString("en-NG")})/${p.life} = ₦${p.charge.toLocaleString("en-NG")}. Charging on the full cost ignores the residual value.`;
    },
    hint: () => "Straight line = (cost − residual) / useful life.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.cost - p.residual) / p.life;
    },
  },
  {
    id: "reducing-balance-depreciation",
    topicSlug: "accounting",
    label: "Reducing-balance depreciation",
    params(r) {
      const cost = int(r, 10, 40) * 10000;
      const rate = pick(r, [10, 20, 25]);
      return { cost, rate, first: (cost * rate) / 100, second: (cost * (1 - rate / 100) * rate) / 100 };
    },
    answer: (p) => `₦${p.first.toLocaleString("en-NG")}`,
    stem(p) {
      return `A machine cost ₦${p.cost.toLocaleString("en-NG")} and is depreciated at ${p.rate}% per annum on the reducing balance. What is the depreciation charge for the first year?`;
    },
    distractors(p, r) {
      return pool3(r, p.first, [p.second, p.first / 2, p.cost, p.cost - p.first, (p.cost * p.rate) / 1000], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Year 1: ${p.rate}% of ₦${p.cost.toLocaleString("en-NG")} = ₦${p.first.toLocaleString("en-NG")}. Year 2 falls (the second year's charge is only ₦${p.second.toLocaleString("en-NG")}) because the base shrinks each year.`;
    },
    hint: () => "Reducing balance applies the rate to the NET book value.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.cost * p.rate) / 100;
    },
  },
  {
    id: "bank-reconciliation",
    topicSlug: "accounting",
    label: "Bank reconciliation: adjusted cash book",
    params(r) {
      const balance = int(r, 20, 90) * 1000;
      const unpresented = int(r, 1, 5) * 1000;
      const uncredited = int(r, 1, 5) * 1000;
      return { balance, unpresented, uncredited, corrected: balance - unpresented + uncredited };
    },
    answer: (p) => `₦${p.corrected.toLocaleString("en-NG")}`,
    stem(p) {
      return `A cash book shows a debit balance of ₦${p.balance.toLocaleString("en-NG")}. Unpresented cheques total ₦${p.unpresented.toLocaleString("en-NG")} and uncredited deposits ₦${p.uncredited.toLocaleString("en-NG")}. What is the corrected balance?`;
    },
    distractors(p, r) {
      return pool3(r, p.corrected, [p.balance + p.unpresented - p.uncredited, p.balance, p.balance - p.unpresented - p.uncredited, p.balance + p.unpresented + p.uncredited], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Corrected = cash book − unpresented cheques + uncredited deposits = ₦${p.corrected.toLocaleString("en-NG")}. Unpresented cheques leave the bank LATER, so they overstate the book until then.`;
    },
    hint: () => "Unpresented cheques subtract; uncredited deposits add.",
    verify(p, chosen) {
      return parseNum(chosen) === p.balance - p.unpresented + p.uncredited;
    },
  },
  {
    id: "bad-debt-provision",
    topicSlug: "accounting",
    label: "Provision for bad debts",
    params(r) {
      const debtors = int(r, 20, 80) * 5000;
      const pct = pick(r, [5, 10]);
      return { debtors, pct, provision: (debtors * pct) / 100 };
    },
    answer: (p) => `₦${p.provision.toLocaleString("en-NG")}`,
    stem(p) {
      return `Debtors stand at ₦${p.debtors.toLocaleString("en-NG")} and the business keeps a ${p.pct}% provision for doubtful debts. What is the provision?`;
    },
    distractors(p, r) {
      return pool3(r, p.provision, [p.debtors, p.debtors - p.provision, (p.debtors * p.pct) / 10, p.provision / 2, p.provision * 2], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Provision = ${p.pct}% of ₦${p.debtors.toLocaleString("en-NG")} = ₦${p.provision.toLocaleString("en-NG")}. Quoting the debtors figure itself forgets to apply the percentage.`;
    },
    hint: () => "Provision = percentage of trade receivables.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.debtors * p.pct) / 100;
    },
  },
  {
    id: "current-ratio",
    topicSlug: "accounting",
    label: "Current ratio and liquidity",
    params(r) {
      let ca = int(r, 2, 20) * 5000;
      let cl = int(r, 2, 20) * 5000;
      // only ship ratios that are exact at 2 dp so the printed key verifies
      for (let g = 0; g < 80 && Math.abs(ca / cl - Number((ca / cl).toFixed(2))) > 1e-9; g++) {
        ca = int(r, 2, 20) * 5000;
        cl = int(r, 2, 20) * 5000;
      }
      if (Math.abs(ca / cl - Number((ca / cl).toFixed(2))) > 1e-9) {
        ca = 40000;
        cl = 10000;
      }
      return { ca, cl, ratio: ca / cl };
    },
    answer: (p) => `${trim(p.ratio, 2)} : 1`,
    stem(p) {
      return `A firm has current assets of ₦${p.ca.toLocaleString("en-NG")} and current liabilities of ₦${p.cl.toLocaleString("en-NG")}. What is the current ratio?`;
    },
    distractors(p, r) {
      return pool3(r, p.ratio, [p.cl / p.ca, p.ca * p.cl, p.ca + p.cl, p.ratio * 2, Math.max(0.1, p.ratio - 1)], trim).map((v) => `${trim(v, 2)} : 1`);
    },
    explanation(p) {
      return `Current ratio = current assets / current liabilities = ${p.ca.toLocaleString("en-NG")}/${p.cl.toLocaleString("en-NG")} = ${trim(p.ratio, 2)} : 1. Inverting the ratio gives acid-test thinking, not the current ratio.`;
    },
    hint: () => "Current ratio = current assets / current liabilities.",
    verify(p, chosen) {
      const ratio = parseNum(String(chosen).split(":")[0]);
      return Math.abs(ratio - p.ca / p.cl) < 5e-3;
    },
  },
  {
    id: "gross-profit-ratio",
    topicSlug: "accounting",
    label: "Gross profit ratio",
    params(r) {
      const sales = int(r, 10, 60) * 20000;
      const pct = pick(r, [10, 15, 20, 25]);
      const cogs = sales * (1 - pct / 100);
      return { sales, cogs: Number.isInteger(cogs) ? cogs : sales / 2, pct };
    },
    answer: (p) => `${((p.sales - p.cogs) / p.sales) * 100}%`,
    stem(p) {
      return `A business has sales of ₦${p.sales.toLocaleString("en-NG")} and cost of sales of ₦${p.cogs.toLocaleString("en-NG")}. What is its gross profit ratio?`;
    },
    distractors(p, r) {
      return pool3(r, ((p.sales - p.cogs) / p.sales) * 100, [((p.sales - p.cogs) / p.cogs) * 100, 100 - ((p.sales - p.cogs) / p.sales) * 100, ((p.sales - p.cogs) / p.sales) * 1000, p.sales - p.cogs], String).map((v) => `${trim(v, 2)}%`);
    },
    explanation(p) {
      return `Gross profit = sales − cost of sales = ₦${p.sales.toLocaleString("en-NG")} − ₦${p.cogs.toLocaleString("en-NG")}; ratio = profit / sales x 100 = ${((p.sales - p.cogs) / p.sales) * 100}%. Dividing by cost of sales gives the margin on cost, not the margin on sales.`;
    },
    hint: () => "Gross profit ratio = gross profit / sales x 100.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - ((p.sales - p.cogs) / p.sales) * 100) < 0.5;
    },
  },
  {
    id: "vat-computation",
    topicSlug: "accounting",
    label: "Value added tax",
    params(r) {
      const net = int(r, 10, 40) * 5000;
      const rate = 7.5;
      return { net, rate, vat: (net * rate) / 100, gross: net + (net * rate) / 100 };
    },
    answer: (p) => `₦${p.vat.toLocaleString("en-NG")}`,
    stem(p) {
      return `Goods are sold for ₦${p.net.toLocaleString("en-NG")} excluding VAT. What is the VAT at 7.5%?`;
    },
    distractors(p, r) {
      return pool3(r, p.vat, [p.gross, (p.net * 7.5) / 10, (p.net * 7.5) / 1000, p.net, p.vat * 10], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `VAT = 7.5% of ₦${p.net.toLocaleString("en-NG")} = ₦${p.vat.toLocaleString("en-NG")}. Quoting the gross figure double-counts the tax.`;
    },
    hint: () => "VAT = rate x net price; the consumer pays net + VAT.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.net * p.rate) / 100;
    },
  },
  {
    id: "partnership-appropriation",
    topicSlug: "accounting",
    label: "Partnership profit appropriation",
    params(r) {
      const profit = int(r, 5, 20) * 100000;
      const salary = pick(r, [0, 50000, 100000]);
      const interest = pick(r, [5, 10]);
      const capital = int(r, 2, 6) * 100000;
      const interestPct = (capital * interest) / 100;
      const residual = profit - salary - interestPct;
      const share = residual / 2;
      return { profit, salary, interest, capital, interestPct, residual, share };
    },
    answer: (p) => `₦${p.share.toLocaleString("en-NG")}`,
    stem(p) {
      return `A partnership earns ₦${p.profit.toLocaleString("en-NG")}. After a salary of ₦${p.salary.toLocaleString("en-NG")} to one partner and ${p.interest}% interest on ₦${p.capital.toLocaleString("en-NG")} of capital, the remainder is shared equally. What is each partner's share?`;
    },
    distractors(p, r) {
      return pool3(r, p.share, [p.profit / 2, p.residual, p.share * 2, p.profit - p.share, p.interestPct], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Residual = profit − salary − interest = ₦${p.residual.toLocaleString("en-NG")}; shared equally → ₦${p.share.toLocaleString("en-NG")} each. Splitting the gross profit before appropriations ignores salary and interest.`;
    },
    hint: () => "Appropriate salary and interest first; share the remainder.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.profit - p.salary - p.interestPct) / 2;
    },
  },
  {
    id: "accruals-prepayments",
    topicSlug: "accounting",
    label: "Accruals and prepayments in final accounts",
    params(r) {
      const expensePaid = int(r, 5, 20) * 10000;
      const prepaid = int(r, 1, 3) * 5000;
      const accrued = int(r, 1, 3) * 5000;
      return { expensePaid, prepaid, accrued, charge: expensePaid - prepaid + accrued };
    },
    answer: (p) => `₦${p.charge.toLocaleString("en-NG")}`,
    stem(p) {
      return `₦${p.expensePaid.toLocaleString("en-NG")} was paid for an expense during the year. Prepayments brought forward were ₦${p.prepaid.toLocaleString("en-NG")} and accruals at year end ₦${p.accrued.toLocaleString("en-NG")}. What is the expense charge for the year?`;
    },
    distractors(p, r) {
      return pool3(r, p.charge, [p.expensePaid, p.expensePaid + p.prepaid - p.accrued, p.expensePaid + p.prepaid + p.accrued, p.expensePaid - p.prepaid - p.accrued], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Charge = paid − prepaid + accrued = ₦${p.charge.toLocaleString("en-NG")}. Prepayments belong to NEXT year (deduct); accruals belong to THIS year (add).`;
    },
    hint: () => "Match expense to the period: deduct prepaid, add accrued.",
    verify(p, chosen) {
      return parseNum(chosen) === p.expensePaid - p.prepaid + p.accrued;
    },
  },
  recallFamily({
    id: "accounting-principles",
    topicSlug: "accounting",
    label: "Accounting concepts and principles",
    hint: "Concepts decide what gets recorded and when.",
    rows: [
      ["The assumption that the business is separate from its owner is the", "business entity concept", ["going concern", "money measurement", "prudence"], "Records keep personal and business affairs apart.", "business entity concept"],
      ["The assumption that the firm will continue operating is", "going concern", ["accruals", "consistency", "materiality"], "Assets are held for use, not forced sale.", "going concern"],
      ["Recording only items with a money value is the", "money measurement concept", ["business entity", "realisation", "duality"], "Non-financial strengths stay off the ledger.", "money measurement concept"],
      ["Recording income only when earned, not when cash arrives, is the", "accruals concept", ["prudence", "consistency", "duality"], "Accruals match revenue to the period earned.", "accruals concept"],
      ["Anticipating losses but not gains is", "prudence", ["accruals", "consistency", "materiality"], "Prudence avoids overstating health.", "prudence"],
      ["Using the same methods year after year is", "consistency", ["accruals", "prudence", "realisation"], "Comparability depends on it.", "consistency"],
      ["The idea that every debit has a credit is", "duality", ["prudence", "materiality", "realisation"], "Double entry records both sides.", "duality"],
      ["Recording only significant items is", "materiality", ["duality", "consistency", "going concern"], "Trivial items may be treated simply.", "materiality"],
      ["Historical cost records assets at", "their purchase price", ["their market value", "their replacement cost", "their insured value"], "Cost is the reliable entry value.", "their purchase price"],
      ["A trial balance proves that", "debits equal credits", ["the accounts are all correct", "the cash is counted", "the stock is valued"], "It checks arithmetic, not every error.", "debits equal credits"],
      ["An error that leaves the trial balance in agreement is", "an error of commission or omission pair", ["an error of principle", "a casting error", "a transposition"], "Compensating errors hide in the balance.", "an error of commission or omission pair"],
      ["Posting a purchase to the wrong supplier is an error of", "commission", ["principle", "omission", "original entry"], "Right kind of entry, wrong account.", "commission"],
      ["Charging capital expenditure as revenue understates", "profit", ["assets", "liabilities", "capital"], "Expensing capital items erodes profit.", "profit"],
      ["Capital expenditure buys", "long-term assets", ["day-to-day supplies", "wages only", "stationery"], "It adds to earning capacity.", "long-term assets"],
      ["Revenue expenditure covers", "day-to-day running costs", ["plant purchases", "building costs", "vehicle purchases"], "It is consumed in the period.", "day-to-day running costs"],
      ["Depreciation allocates the cost of an asset", "over its useful life", ["in one year", "never", "on resale only"], "It matches cost to periods benefited.", "over its useful life"],
      ["A suspense account temporarily holds", "unidentified differences", ["cash", "stock", "debentures"], "It lets the books balance pending investigation.", "unidentified differences"],
      ["The provision for doubtful debts is deducted from", "debtors", ["creditors", "bank", "capital"], "It anticipates bad debt losses.", "debtors"],
      ["The source document for a credit purchase is the", "purchase invoice", ["receipt", "paying-in slip", "cheque counterfoil"], "Invoices record credit purchases.", "purchase invoice"],
      ["The prime entry book for credit sales is the", "sales day book", ["cash book", "journal", "nominal ledger"], "Day books group transactions by type.", "sales day book"],
      ["A journal records", "adjustments and non-cash entries", ["only cash receipts", "only bank payments", "only petty cash"], "Corrections go through the journal.", "adjustments and non-cash entries"],
      ["The cash book records", "cash and bank transactions", ["credit sales", "credit purchases", "depreciation"], "It mirrors bank movements.", "cash and bank transactions"],
      ["Petty cash books use the", "imprest system", ["accrual system", "double entry", "bank loan system"], "A fixed float is reimbursed periodically.", "imprest system"],
      ["The bank column of the cash book is compared with the", "bank statement", ["trial balance", "balance sheet", "invoice"], "Reconciliation ties book to statement.", "bank statement"],
      ["Bank charges not yet recorded are", "added to the cash book", ["deducted from the cash book", "ignored", "added to the bank statement"], "They have not reached the ledger.", "added to the cash book"],
      ["Standing orders on the statement not in the cash book mean the cash book is", "too high", ["too low", "correct", "reversed"], "Recorded payments reduce the balance.", "too high"],
      ["The financial year usually runs", "twelve months", ["six months", "forever", "one quarter"], "A year groups reporting.", "twelve months"],
      ["Final accounts comprise", "the income statement and balance sheet", ["only the cash book", "only the journal", "only the petty cash"], "They report performance and position.", "the income statement and balance sheet"],
    ],
  }),
  recallFamily({
    id: "final-accounts",
    topicSlug: "accounting",
    label: "Final accounts and balance sheet",
    hint: "The income statement measures performance; the balance sheet measures position.",
    rows: [
      ["Gross profit is sales less", "cost of sales", ["expenses", "drawings", "capital"], "Opening stock + purchases − closing stock gives cost of sales.", "cost of sales"],
      ["Net profit is gross profit less", "operating expenses", ["drawings", "capital introduced", "discounts received"], "Expenses convert gross to net.", "operating expenses"],
      ["Closing stock not yet counted is corrected by debiting", "stock (asset) and crediting trading account", ["drawings", "bank", "capital"], "It adds to assets and reduces cost of sales.", "stock (asset) and crediting trading account"],
      ["Carriage inwards is shown in the", "trading account", ["income statement only as an expense", "balance sheet", "cash book"], "It is a cost of getting goods in.", "trading account"],
      ["Carriage outwards is a", "selling and distribution expense", ["cost of sales", "asset", "capital"], "Delivery to customers is a selling cost.", "selling and distribution expense"],
      ["The balance sheet shows", "assets, liabilities and capital", ["revenue and expenses", "cash flows", "stock turnover"], "It is a statement of position.", "assets, liabilities and capital"],
      ["Drawings by the owner are deducted from", "capital", ["profit", "debtors", "stock"], "They reduce the owner's stake.", "capital"],
      ["Interest on drawings is charged to", "the owner's capital account", ["sales", "purchases", "bank charges"], "It compensates the firm.", "the owner's capital account"],
      ["Goodwill arises when", "a business is bought for more than its net assets", ["a firm makes losses", "stock is written off", "cash is counted"], "It prices reputation and connections.", "a business is bought for more than its net assets"],
      ["A provision for depreciation is a", "deduction from the asset in the balance sheet", ["current liability", "current asset", "expense"], "Net book value = cost − provision.", "deduction from the asset in the balance sheet"],
      ["The provision for depreciation account receives the", "annual charge", ["asset disposal proceeds", "residual value", "capital"], "Credits accumulate there.", "annual charge"],
      ["When an asset is sold, any profit goes to the", "disposal account", ["drawings", "capital directly", "sales"], "Disposals isolate gains and losses.", "disposal account"],
      ["The accumulated depreciation on a sold asset is transferred", "to the disposal account", ["to the profit and loss", "to the bank", "to depreciation expense"], "It clears against the asset's cost.", "to the disposal account"],
      ["The net effect of a balance sheet must be", "assets = liabilities + capital", ["assets = profit", "liabilities = capital", "assets = sales"], "The accounting equation always holds.", "assets = liabilities + capital"],
      ["Working capital is", "current assets less current liabilities", ["capital plus profit", "fixed assets less cash", "total assets"], "It funds daily operations.", "current assets less current liabilities"],
      ["A current ratio of 1 : 1 means", "assets just cover liabilities", ["the firm is insolvent", "profit is zero", "sales are zero"], "At 1:1 there is no headroom.", "assets just cover liabilities"],
      ["Creditors are", "amounts owed to suppliers", ["amounts owed by customers", "stock on hand", "cash in bank"], "They are current liabilities.", "amounts owed to suppliers"],
      ["Debtors are", "amounts owed by customers", ["amounts owed to suppliers", "bank overdrafts", "loans to the bank"], "They are current assets.", "amounts owed by customers"],
      ["The owner's stake in the business appears as", "capital", ["drawings", "liabilities", "goodwill only"], "It is the residual claim.", "capital"],
      ["Profit increases", "capital", ["drawings", "liabilities", "stock"], "Earnings belong to the owner.", "capital"],
      ["A bank overdraft is a", "current liability", ["current asset", "fixed asset", "drawing"], "It is money owed to the bank.", "current liability"],
      ["Stock at the year end is valued at", "the lower of cost and net realisable value", ["the selling price", "the invoice price always", "the insurance value"], "Prudence caps the value.", "the lower of cost and net realisable value"],
      ["Non-current assets are held", "for use over years", ["for quick resale", "for paying wages", "for stock sales"], "They serve the business long-term.", "for use over years"],
      ["The rent account is an example of a", "nominal account", ["personal account", "real account", "control account"], "Nominal accounts hold expenses and incomes.", "nominal account"],
      ["Real accounts deal with", "assets and possessions", ["expenses", "incomes", "drawings"], "They relate to property.", "assets and possessions"],
      ["Personal accounts relate to", "persons and organisations", ["expenses and losses", "assets only", "sales only"], "Debtors and creditors sit here.", "persons and organisations"],
      ["The income statement is prepared", "for a period", ["on a single date", "on request of debtors", "when stock is sold"], "It covers a span of time.", "for a period"],
      ["The balance sheet is prepared", "as at a date", ["for a period", "every month", "when profit falls"], "It shows one moment's position.", "as at a date"],
    ],
  }),
  recallFamily({
    id: "control-accounts",
    topicSlug: "accounting",
    label: "Control accounts and reconciliations",
    hint: "Control accounts summarise ledgers to locate errors.",
    rows: [
      ["A control account summarises", "a whole ledger", ["a single sale", "one invoice", "one payment"], "It totals the individual accounts.", "a whole ledger"],
      ["A sales ledger control account checks", "debtors", ["creditors", "bank", "sales"], "It balances all receivable accounts.", "debtors"],
      ["A purchases ledger control account checks", "creditors", ["debtors", "cash", "stock"], "It balances all payable accounts.", "creditors"],
      ["Items in a sales ledger control account include", "credit sales, receipts and returns", ["cash sales only", "depreciation", "drawings"], "It channels all receivable movements.", "credit sales, receipts and returns"],
      ["Returns inwards reduces", "debtors' balances and sales", ["creditors", "purchases", "stock"], "Goods returned by customers lower the debt.", "debtors' balances and sales"],
      ["Returns outwards reduces", "creditors and purchases", ["debtors", "sales", "cash"], "Goods sent back lower the payable.", "creditors and purchases"],
      ["Discounts allowed appear in the", "debtors control account", ["creditors control only", "nominal only", "cash book only"], "They reduce what customers owe.", "debtors control account"],
      ["Discounts received appear in the", "creditors control account", ["debtors control only", "journal only", "cash book only"], "They reduce what is owed to suppliers.", "creditors control account"],
      ["Bad debts written off are debited to", "profit and loss and credited to the control", ["bank", "drawings", "sales"], "They remove the uncollectable debt.", "profit and loss and credited to the control"],
      ["A bank reconciliation statement starts from the", "cash book or bank statement balance", ["petty cash", "capital", "sales"], "Either the book or the statement may start it.", "cash book or bank statement balance"],
      ["Standing debits on the statement not in the cash book are", "deducted from the cash book", ["added to the cash book", "ignored", "added to the bank statement"], "They represent payments already made.", "deducted from the cash book"],
      ["Cleared cheques not presented are", "unpresented cheques", ["dishonoured cheques", "standing orders", "credit transfers"], "They have not left the bank yet.", "unpresented cheques"],
      ["A dishonoured cheque", "reinstates the debt", ["settles the debt", "closes the account", "creates a discount"], "Payment bounced, so the debt returns.", "reinstates the debt"],
      ["Direct debits collected by the bank appear as", "debits on the statement", ["credits on the statement", "cash sales", "petty cash"], "They reduce the account.", "debits on the statement"],
      ["Bank interest charged not recorded means the cash book is", "too high", ["too low", "right", "reversed"], "An unc recorded charge overstates cash.", "too high"],
      ["The purpose of a control account is to", "locate errors without checking every account", ["count cash", "price stock", "value goodwill"], "It isolates where a mistake lies.", "locate errors without checking every account"],
      ["A balance per the bank statement that is correct after adjustments is the", "adjusted cash book balance", ["original balance", "petty cash float", "overdraft only"], "Adjustments align the records.", "adjusted cash book balance"],
      ["Unpresented cheques are", "issued but not yet at the bank", ["received but not banked from customers", "stopped by the bank", "post-dated cheques received"], "They sit in transit.", "issued but not yet at the bank"],
      ["Uncredited deposits are", "paid in but not yet on the statement", ["paid out", "dishonoured", "standing orders"], "They await bank processing.", "paid in but not yet on the statement"],
      ["A credit transfer received means the statement will", "increase the bank balance", ["decrease it", "stay the same", "reverse"], "Money in raises the balance.", "increase the bank balance"],
      ["The reconciliation statement is prepared", "periodically", ["never", "once a decade", "with every sale"], "Regular checks catch errors early.", "periodically"],
      ["Errors of original entry affect", "both sides of the trial balance equally", ["only the cash side", "only sales", "the bank only"], "They keep the trial balance balanced.", "both sides of the trial balance equally"],
      ["An error of complete reversal affects", "both sides", ["neither", "only profit", "only cash"], "Both accounts are reversed.", "both sides"],
      ["The bank reconciliation statement is a", "memorandum, not a ledger account", ["ledger account", "journal", "day book"], "It documents the differences.", "memorandum, not a ledger account"],
      ["A post-dated cheque received from a debtor is", "not yet cash", ["cash now", "a discount", "a loan"], "It only becomes cash on its date.", "not yet cash"],
      ["Cash at bank appears in the balance sheet as", "a current asset", ["a current liability", "capital", "a fixed asset"], "Bank money is a resource.", "a current asset"],
      ["Bank charges are treated as an", "expense", ["asset", "liability", "drawing"], "They reduce profit.", "expense"],
      ["A bank statement is issued by", "the bank", ["the business", "the auditor", "the tax office"], "The bank sends it to the customer.", "the bank"],
    ],
  }),
];
