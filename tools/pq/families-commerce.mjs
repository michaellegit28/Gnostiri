/**
 * Commerce families (round 2, JAMB pool).
 * Computable families re-derive from the statement; recall tables use the
 * dual-answer contract (key + independently authored proof).
 */

import { int, pick, shuffled } from "./engine.mjs";
import { recallFamily, parseNum, pool3 } from "./families-support.mjs";

const trim = (v, dp) => String(Number(Number(v).toFixed(dp)));

export const families = [
  {
    id: "trade-discount",
    topicSlug: "commerce",
    label: "Trade discount and net price",
    params(r) {
      const list = int(r, 5, 60) * 500;
      const pct = pick(r, [10, 15, 20, 25, 30]);
      return { list, pct, net: list - (list * pct) / 100 };
    },
    answer: (p) => `₦${p.net.toLocaleString("en-NG")}`,
    stem(p) {
      return `A wholesaler offers a trade discount of ${p.pct}% on goods listed at ₦${p.list.toLocaleString("en-NG")}. What does the retailer pay?`;
    },
    distractors(p, r) {
      return pool3(r, p.net, [p.list, (p.list * p.pct) / 100, p.list + (p.list * p.pct) / 100, p.list * (1 + p.pct / 100), Math.round(p.net)], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Net price = list − discount = ₦${p.list.toLocaleString("en-NG")} − ${p.pct}% = ₦${p.net.toLocaleString("en-NG")}. Quoting the discount itself, or the list price, are the usual slips.`;
    },
    hint: () => "A trade discount reduces the list price; it does not compound.",
    verify(p, chosen) {
      return parseNum(chosen) === p.list - (p.list * p.pct) / 100;
    },
  },
  {
    id: "mark-up-profit",
    topicSlug: "commerce",
    label: "Mark-up on cost",
    params(r) {
      const cost = int(r, 5, 40) * 250;
      const pct = pick(r, [20, 25, 40, 50, 60]);
      return { cost, pct, price: cost + (cost * pct) / 100 };
    },
    answer: (p) => `₦${p.price.toLocaleString("en-NG")}`,
    stem(p) {
      return `A trader buys goods for ₦${p.cost.toLocaleString("en-NG")} and applies a mark-up of ${p.pct}% on cost. At what price should the goods be sold?`;
    },
    distractors(p, r) {
      return pool3(r, p.price, [p.cost, p.price / (1 + p.pct / 100), (p.cost * p.pct) / 100, p.price + p.cost, p.cost * (1 + (2 * p.pct) / 100)], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Selling price = cost + mark-up = ₦${p.cost.toLocaleString("en-NG")} + ${p.pct}% = ₦${p.price.toLocaleString("en-NG")}. Mark-up is on COST; margin is on price.`;
    },
    hint: () => "Mark-up = percentage added to the cost price.",
    verify(p, chosen) {
      return parseNum(chosen) === p.cost + (p.cost * p.pct) / 100;
    },
  },
  {
    id: "profit-margin",
    topicSlug: "commerce",
    label: "Margin on selling price",
    params(r) {
      let cost = int(r, 5, 30) * 500;
      let pct = pick(r, [20, 25, 40, 50]);
      for (let g = 0; g < 60 && !Number.isInteger(cost / (1 - pct / 100)); g++) {
        cost = int(r, 5, 30) * 500;
        pct = pick(r, [20, 25, 40, 50]);
      }
      if (!Number.isInteger(cost / (1 - pct / 100))) {
        cost = 8000;
        pct = 20;
      }
      return { cost, pct, price: cost / (1 - pct / 100) };
    },
    answer: (p) => `₦${p.price.toLocaleString("en-NG")}`,
    stem(p) {
      return `A dealer wants a profit margin of ${p.pct}% on the selling price. If the goods cost ₦${p.cost.toLocaleString("en-NG")}, what should be the selling price?`;
    },
    distractors(p, r) {
      return pool3(r, p.price, [p.cost + (p.cost * p.pct) / 100, p.cost, p.price + p.cost, (p.cost * p.pct) / 100, p.price * 2], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Margin is on the PRICE: cost = price x (1 − margin) so price = cost / (1 − ${p.pct}%) = ₦${p.price.toLocaleString("en-NG")}. Adding the margin % to the cost confuses margin with mark-up.`;
    },
    hint: () => "Margin = profit / selling price; cost = price minus the margin.",
    verify(p, chosen) {
      const price = parseNum(chosen);
      const profit = price - p.cost;
      return Math.abs((profit / price) * 100 - p.pct) < 0.6;
    },
  },
  {
    id: "rate-of-turnover",
    topicSlug: "commerce",
    label: "Rate of stock turnover",
    params(r) {
      const costOfSales = int(r, 5, 30) * 20000;
      const rate = pick(r, [2, 4, 5, 10]);
      const averageStock = costOfSales / rate;
      return { costOfSales, averageStock: Number.isInteger(averageStock) ? averageStock : costOfSales / 5, rate };
    },
    answer: (p) => `${p.costOfSales / p.averageStock} times`,
    stem(p) {
      return `A shop has a cost of goods sold of ₦${p.costOfSales.toLocaleString("en-NG")} and an average stock of ₦${p.averageStock.toLocaleString("en-NG")}. What is its rate of turnover?`;
    },
    distractors(p, r) {
      return pool3(r, p.costOfSales / p.averageStock, [p.averageStock / p.costOfSales, p.costOfSales - p.averageStock, (p.costOfSales / p.averageStock) + 1, Math.max(1, p.costOfSales / p.averageStock - 1)], String).map((v) => `${v} times`);
    },
    explanation(p) {
      return `Turnover = cost of goods sold / average stock = ${p.costOfSales.toLocaleString("en-NG")} / ${p.averageStock.toLocaleString("en-NG")} = ${p.costOfSales / p.averageStock} times. Inverting gives weeks-of-cover, not turnover.`;
    },
    hint: () => "Turnover counts how many times stock sells out in a period.",
    verify(p, chosen) {
      return Math.abs(parseNum(chosen) - p.costOfSales / p.averageStock) < 5e-3;
    },
  },
  {
    id: "hire-purchase-total",
    topicSlug: "commerce",
    label: "Hire purchase total cost",
    params(r) {
      const cash = int(r, 10, 40) * 25000;
      const deposit = pick(r, [10, 20, 25]);
      const months = pick(r, [6, 8, 10, 12]);
      let balance = (cash * (100 - deposit)) / 100;
      for (let g = 0; g < 60 && balance % months !== 0; g++) {
        balance = (cash * (100 - deposit)) / 100;
      }
      const monthly = balance / months;
      const total = monthly * months + (cash * deposit) / 100;
      return { cash, deposit, months, monthly, total };
    },
    answer: (p) => `₦${p.total.toLocaleString("en-NG")}`,
    stem(p) {
      return `A television has a cash price of ₦${p.cash.toLocaleString("en-NG")}. On hire purchase a deposit of ${p.deposit}% is paid and the balance is spread over ${p.months} monthly instalments of ₦${p.monthly.toLocaleString("en-NG")}. What is the total hire-purchase cost?`;
    },
    distractors(p, r) {
      return pool3(r, p.total, [p.cash, p.monthly * p.months, p.cash + p.monthly, (p.cash * p.deposit) / 100, p.monthly], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Total = deposit + instalments = ₦${((p.cash * p.deposit) / 100).toLocaleString("en-NG")} + (${p.months} x ₦${p.monthly.toLocaleString("en-NG")}) = ₦${p.total.toLocaleString("en-NG")}. Quoting only the instalments forgets the deposit.`;
    },
    hint: () => "Hire purchase total = deposit plus all monthly instalments.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.cash * p.deposit) / 100 + p.monthly * p.months;
    },
  },
  {
    id: "commission-pay",
    topicSlug: "commerce",
    label: "Commission on sales",
    params(r) {
      const sales = int(r, 10, 60) * 10000;
      const rate = pick(r, [2, 2.5, 5, 10]);
      return { sales, rate, commission: (sales * rate) / 100 };
    },
    answer: (p) => `₦${p.commission.toLocaleString("en-NG")}`,
    stem(p) {
      return `An agent earns ${p.rate}% commission on sales. How much commission is earned on ₦${p.sales.toLocaleString("en-NG")} of sales?`;
    },
    distractors(p, r) {
      return pool3(r, p.commission, [p.sales, p.sales * p.rate, p.sales + p.commission, p.commission / 2, p.sales / p.rate], (v) => `₦${v.toLocaleString("en-NG")}`);
    },
    explanation(p) {
      return `Commission = ${p.rate}% of ₦${p.sales.toLocaleString("en-NG")} = ₦${p.commission.toLocaleString("en-NG")}. Multiplying by the rate without dividing by 100 overstates it.`;
    },
    hint: () => "Commission = rate x sales / 100.",
    verify(p, chosen) {
      return parseNum(chosen) === (p.sales * p.rate) / 100;
    },
  },
  recallFamily({
    id: "commerce-basics",
    topicSlug: "commerce",
    label: "Commerce basics and trade",
    hint: "Commerce is trade plus the aids that make trade possible.",
    rows: [
      ["Commerce consists of trade and", "aids to trade", ["farming only", "mining", "religion"], "Commerce = trade + transport, banking, insurance, advertising.", "aids to trade"],
      ["Trade is the", "buying and selling of goods", ["making of laws", "printing of money", "building of roads"], "Trade exchanges goods for money.", "buying and selling of goods"],
      ["Buying and selling within a country is", "home trade", ["foreign trade", "entrepot trade", "re-export trade"], "Internal trade is home trade.", "home trade"],
      ["Trade between countries is", "foreign trade", ["home trade", "retail trade", "wholesale only"], "Cross-border trade is foreign trade.", "foreign trade"],
      ["Buying goods from abroad is", "importing", ["exporting", "re-exporting", "entrepot"], "Imports enter; exports leave.", "importing"],
      ["Selling goods to other countries is", "exporting", ["importing", "entrepot", "home trade"], "Exports leave the country.", "exporting"],
      ["Trade in bulk from manufacturers is", "wholesale", ["retail", "entrepot", "mail order"], "Wholesalers sell to retailers.", "wholesale"],
      ["Selling directly to consumers is", "retail", ["wholesale", "entrepot", "importing"], "Retailers serve the final buyer.", "retail"],
      ["A middleman between producer and wholesaler is a", "factor or broker", ["consumer", "customs officer", "banker"], "Agents link the parties.", "factor or broker"],
      ["Entrepot trade means", "importing goods for re-export", ["buying for domestic use", "selling abroad directly", "smuggling"], "Goods are re-exported without processing.", "importing goods for re-export"],
      ["The aim of commerce is to", "satisfy consumers' wants at a profit", ["make laws", "print money", "teach children"], "Commerce bridges producers and users.", "satisfy consumers' wants at a profit"],
      ["A division of labour means", "splitting work into separate tasks", ["one worker doing all", "no machinery", "no trade"], "Specialisation raises output.", "splitting work into separate tasks"],
      ["The main advantage of large-scale production is", "lower unit cost", ["higher unit cost", "slower output", "less capital"], "Economies of scale cut costs.", "lower unit cost"],
      ["A brand is best described as", "a name that identifies a product", ["the shop's address", "a price tag", "a licence"], "Brands distinguish goods.", "a name that identifies a product"],
      ["Standardisation means goods", "are made to a fixed specification", ["vary in quality", "are handmade only", "are unpriced"], "Uniform specs define standards.", "are made to a fixed specification"],
      ["Grading involves", "sorting goods by quality", ["mixing grades", "selling unbranded", "smuggling"], "Grades help pricing.", "sorting goods by quality"],
      ["The chain of distribution runs from", "producer to consumer", ["consumer to producer", "bank to shop", "school to market"], "Goods flow down the chain.", "producer to consumer"],
      ["A merchant middleman", "takes title to the goods", ["never owns goods", "only advises", "only transports"], "Merchants buy and resell.", "takes title to the goods"],
      ["An agent middleman", "never owns the goods", ["buys the goods", "exports the goods", "stores the goods"], "Agents earn commission.", "never owns the goods"],
      ["The main function of a wholesaler is to", "bulk-break and store for retailers", ["sell to final users", "collect taxes", "fix prices"], "They supply retail shops.", "bulk-break and store for retailers"],
      ["A retailer's strength is proximity to", "consumers", ["factories", "ports", "banks"], "Shops sit near buyers.", "consumers"],
      ["Multiple shops are owned by", "one firm", ["many firms", "the state", "consumers"], "A chain has a single owner.", "one firm"],
      ["A departmental store sells", "many lines under one roof", ["one line only", "farm produce only", "wholesale only"], "It groups departments.", "many lines under one roof"],
      ["Mail-order selling reaches buyers through", "the post", ["door-to-door only", "markets only", "factories"], "Catalogues and post do the selling.", "the post"],
      ["An online storefront reaches customers via", "the internet", ["the post only", "the radio only", "the market square"], "E-commerce uses the internet.", "the internet"],
      ["After-sales service is part of", "commerce services", ["production only", "farming", "mining"], "Warranties and repairs aid trade.", "commerce services"],
      ["Consumer sovereignty means buyers", "decide what is produced", ["are ignored", "set tax rates", "own factories"], "Demand directs output.", "decide what is produced"],
      ["The main purpose of warehousing is to", "store goods until needed", ["make goods", "tax goods", "advertise goods"], "Warehouses hold stock.", "store goods until needed"],
    ],
  }),
  recallFamily({
    id: "insurance-banking",
    topicSlug: "commerce",
    label: "Insurance and banking services",
    hint: "Insurance transfers risk; banks move money.",
    rows: [
      ["Insurance spreads the cost of", "losses among many", ["profits among many", "wages among many", "taxes among many"], "Pooling premiums funds the few who lose.", "losses among many"],
      ["The contract between insurer and insured is the", "policy", ["invoice", "cheque", "ledger"], "The policy states the terms.", "policy"],
      ["The payment made by the insured is the", "premium", ["dividend", "commission", "interest"], "Premiums buy cover.", "premium"],
      ["The sum payable on a valid claim is the", "indemnity", ["premium", "commission", "rent"], "Indemnity restores the position before loss.", "indemnity"],
      ["Insurable interest means the insured", "would suffer loss if the event occurs", ["must be a foreigner", "must own shares", "must be a bank"], "You must stand to lose something.", "would suffer loss if the event occurs"],
      ["The principle of utmost good faith requires", "honest disclosure", ["hiding facts", "paying bribes", "avoiding premiums"], "Both sides deal openly.", "honest disclosure"],
      ["The principle of indemnity forbids the insured from", "profiting from a loss", ["claiming losses", "paying premiums", "keeping policies"], "Insurance restores, not enriches.", "profiting from a loss"],
      ["Insurance against fire damage is", "fire insurance", ["life insurance", "marine insurance", "fidelity insurance"], "Fire cover protects buildings and stock.", "fire insurance"],
      ["Insurance on a ship and its cargo is", "marine insurance", ["fire insurance", "life insurance", "motor insurance"], "Perils of the sea are marine risks.", "marine insurance"],
      ["Cover against employee theft is", "fidelity insurance", ["fire insurance", "life insurance", "burglary only"], "Fidelity guards against staff dishonesty.", "fidelity insurance"],
      ["Insurance that pays a sum on death is", "life assurance", ["fire insurance", "burglary insurance", "marine insurance"], "Life cover pays on death or maturity.", "life assurance"],
      ["A document promising repair for a fee is a", "warranty", ["premium", "claim", "policy"], "Warranties add service cover.", "warranty"],
      ["Reinsurance lets an insurer", "spread its own risk", ["raise premiums monthly", "ignore claims", "close offices"], "It shares risk with other insurers.", "spread its own risk"],
      ["An insurance broker", "acts for the insured", ["acts for the insurer only", "writes laws", "collects taxes"], "Brokers advise buyers of cover.", "acts for the insured"],
      ["The function of a commercial bank does NOT include", "issuing currency", ["accepting deposits", "granting loans", "keeping valuables"], "The central bank issues notes.", "issuing currency"],
      ["A current account is mainly for", "daily payments", ["long-term saving", "fixed investment", "safekeeping of title deeds"], "Cheques move money from current accounts.", "daily payments"],
      ["A savings account earns", "interest", ["commission", "dividends only", "no return"], "Depositors receive interest.", "interest"],
      ["A cheque is an order to a bank to", "pay money from an account", ["lend money", "issue a policy", "open a vault"], "It instructs the bank to pay.", "pay money from an account"],
      ["A crossed cheque", "must be paid into an account", ["can be cashed over the counter", "is worthless", "can be spent at any shop"], "Crossing blocks cash encashment.", "must be paid into an account"],
      ["A bank overdraft lets a customer", "spend beyond the balance", ["avoid a bank", "receive interest on spending", "pay no charges"], "Overdrafts are repayable on demand.", "spend beyond the balance"],
      ["A bank loan is usually", "for a fixed term", ["repayable on demand", "interest-free", "unsecured always"], "Loans run for agreed periods.", "for a fixed term"],
      ["Collateral is", "security for a loan", ["a bank charge", "an insurance premium", "a dividend"], "It secures the lender.", "security for a loan"],
      ["A standing order", "pays a fixed sum regularly", ["pays sums of varying size", "buys a shop", "insures a car"], "It automates regular payments.", "pays a fixed sum regularly"],
      ["A credit transfer moves money", "between bank accounts", ["by cash only", "by barter", "by cheque drawn by hand"], "It is an electronic payment.", "between bank accounts"],
      ["A bank draft is", "a cheque drawn on the bank itself", ["a shop voucher", "a loan note", "a share certificate"], "The bank guarantees the draft.", "a cheque drawn on the bank itself"],
      ["Mobile banking lets customers", "transact by phone", ["open vaults", "print notes", "avoid banks entirely"], "Phones carry out transactions.", "transact by phone"],
      ["A bank's clearing house", "settles cheques between banks", ["prints new notes", "audits accounts", "insures customers"], "Netted cheque claims settle there.", "settles cheques between banks"],
    ],
  }),
  recallFamily({
    id: "transport-advertising",
    topicSlug: "commerce",
    label: "Transport, advertising and communication",
    hint: "Each aid to trade solves a distance or an information problem.",
    rows: [
      ["The movement of goods and people is", "transport", ["insurance", "banking", "advertising"], "Transport links markets.", "transport"],
      ["The fastest mode over long distances is", "air transport", ["road transport", "animal transport", "pipelines"], "Planes cut journey times the most.", "air transport"],
      ["The cheapest mode for bulky goods is", "water transport", ["air transport", "road transport", "courier"], "Ships carry bulk cheaply.", "water transport"],
      ["The most flexible door-to-door mode is", "road transport", ["water transport", "rail only", "pipeline"], "Lorries reach final addresses.", "road transport"],
      ["Railways suit", "heavy bulk over fixed routes", ["door-to-door parcels", "flying urgent goods", "liquids"], "Trains move heavy freight on lines.", "heavy bulk over fixed routes"],
      ["Pipelines carry mainly", "liquids and gases", ["only grains", "only people", "only documents"], "Oil and gas flow through pipes.", "liquids and gases"],
      ["The document of carriage by road is a", "waybill", ["bill of lading only", "airway note", "charter party"], "Hauliers sign waybills.", "waybill"],
      ["The shipping document is the", "bill of lading", ["waybill", "airway bill", "invoice"], "It is also a document of title.", "bill of lading"],
      ["An invoice lists the", "goods sold, prices and discount", ["carriage costs only", "bank balance", "share prices"], "Sellers send invoices to buyers.", "goods sold, prices and discount"],
      ["A delivery note accompanies a", "consignment of goods", ["bank payment", "share certificate", "cheque"], "It confirms what was delivered.", "consignment of goods"],
      ["Advertising aims to", "inform and persuade buyers", ["produce goods", "carry goods", "store goods"], "It creates demand.", "inform and persuade buyers"],
      ["The main advantage of newspaper advertising is", "wide reach", ["no cost", "sound and vision", "instant feedback"], "Newspapers reach many readers.", "wide reach"],
      ["Television advertising combines", "sight, sound and motion", ["only print", "only radio", "only posters"], "It is the richest medium.", "sight, sound and motion"],
      ["The medium that gives immediate feedback is", "personal selling", ["newspapers", "posters", "radio"], "Salespeople answer objections at once.", "personal selling"],
      ["Outdoor advertising includes", "billboards and posters", ["radio spots", "TV ads", "catalogues"], "Public-space displays reach passers-by.", "billboards and posters"],
      ["Advertising that promotes an idea is", "institutional advertising", ["classified advertising", "personal selling", "point-of-sale"], "It sells the firm image.", "institutional advertising"],
      ["Sales promotion uses", "free samples and coupons", ["only laws", "only trucks", "only banks"], "It offers short-term incentives.", "free samples and coupons"],
      ["Publicity is", "unpaid media attention", ["paid space", "a billboard", "a sales call"], "It is earned coverage.", "unpaid media attention"],
      ["Communication means the", "exchange of information", ["movement of goods", "making of goods", "storing of goods"], "It transfers messages.", "exchange of information"],
      ["The slowest but cheapest written channel is often", "the post", ["telephone", "telex", "email"], "Postal services cost least for documents.", "the post"],
      ["Telephone allows", "instant two-way contact", ["one-way broadcast", "mass mailing", "billboard display"], "It links speakers live.", "instant two-way contact"],
      ["Email's main strength is", "speed with a written record", ["sound only", "sound and vision only", "no cost of reading"], "It is fast and retrievable.", "speed with a written record"],
      ["Video conferencing", "links meetings across distance", ["prints documents", "stores stock", "transports goods"], "It holds remote meetings.", "links meetings across distance"],
      ["A courier service delivers", "documents and small parcels quickly", ["oil in bulk", "grain in bulk", "passengers"], "It specialises in fast small items.", "documents and small parcels quickly"],
      ["The biggest barrier to e-commerce in Nigeria is often", "poor delivery and trust", ["too many roads", "excess money", "free internet"], "Trust and logistics limit online trade.", "poor delivery and trust"],
      ["A means of payment that avoids carrying cash is a", "debit card", ["cheque left blank", "IOU note", "barter trade"], "Cards settle electronically.", "debit card"],
      ["A point-of-sale terminal allows", "payment by card in the shop", ["payment by barter", "payment by cheque by post", "payment by camel"], "POS handles card payments.", "payment by card in the shop"],
    ],
  }),
  recallFamily({
    id: "business-units-cooperatives",
    topicSlug: "commerce",
    label: "Business units and cooperatives",
    hint: "Ownership decides liability and capital.",
    rows: [
      ["A business owned by one person is a", "sole proprietorship", ["partnership", "company", "cooperative"], "One person owns, controls and takes the risk.", "sole proprietorship"],
      ["The owner of a sole trade has", "unlimited liability", ["limited liability", "no liability", "limited capital always"], "Personal assets pay business debts.", "unlimited liability"],
      ["A partnership has at least", "two owners", ["one owner", "no owners", "always a board"], "Two or more partners share the venture.", "two owners"],
      ["Partners in a firm share", "profits and liabilities", ["only profits", "only wages", "only losses"], "Unless agreed otherwise, sharing is equal.", "profits and liabilities"],
      ["A limited company's owners are", "shareholders", ["partners", "creditors", "debtors"], "Shares carry ownership.", "shareholders"],
      ["A private limited company", "cannot invite the public to buy shares", ["can sell shares on the exchange", "has unlimited liability", "is owned by the state"], "Private placement only.", "cannot invite the public to buy shares"],
      ["A public limited company's shares", "may be sold to the public", ["are all privately held", "are traded only in shops", "never pay dividends"], "Public companies list and open offers.", "may be sold to the public"],
      ["The liability of a shareholder is limited to", "the unpaid shares held", ["personal wealth", "the company's debts", "the directors' homes"], "Risk stops at the investment.", "the unpaid shares held"],
      ["The maximum risk a company can lose is", "its capital", ["its workers", "its customers", "its bank"], "Limited liability caps the loss.", "its capital"],
      ["A cooperative society is owned by", "its members", ["the state", "outside investors", "its directors alone"], "Members own and control it.", "its members"],
      ["The main aim of a consumer cooperative is to", "provide goods cheaply to members", ["maximise profit for outsiders", "lend to banks", "pay dividends to strangers"], "It serves members' needs.", "provide goods cheaply to members"],
      ["Surplus from a cooperative is shared as", "dividends on purchases", ["wages only", "taxes only", "reserves only"], "Purchases earn patronage dividends.", "dividends on purchases"],
      ["A producer cooperative helps members by", "marketing their produce", ["buying land from foreigners", "fixing retail prices", "printing money"], "It pools produce for sale.", "marketing their produce"],
      ["Each cooperative member has", "one vote", ["one vote per share", "no vote", "a veto"], "One member, one vote.", "one vote"],
      ["A joint venture is best described as", "a business run by two or more parties for a project", ["a single-owner shop", "a charity", "a government ministry"], "They share cost and profit.", "a business run by two or more parties for a project"],
      ["A franchise is a business based on", "a licence to use another brand", ["state ownership", "secret partnerships", "no fees"], "Franchisees pay royalties.", "a licence to use another brand"],
      ["A public corporation is", "owned by the state", ["a cooperative", "a partnership", "a charity"], "State ownership funds services.", "owned by the state"],
      ["A merger joins", "two firms into one", ["one firm with itself", "a firm and a church", "a firm and a customer"], "Mergers combine businesses.", "two firms into one"],
      ["A cartel is best described as", "agreement between firms to fix prices", ["voluntary charity", "state law", "consumer group"], "It restricts competition.", "agreement between firms to fix prices"],
      ["The registrar of companies", "registers and regulates companies", ["runs companies", "taxes companies", "sells shares"], "It supervises corporate filings.", "registers and regulates companies"],
      ["The main document setting a company's rules is the", "memorandum and articles", ["invoice", "waybill", "ledger"], "They define powers and governance.", "memorandum and articles"],
      ["A board of directors", "appoints managers and sets policy", ["operates machines", "serves customers", "drives lorries"], "They govern the company.", "appoints managers and sets policy"],
      ["The managing director", "runs the company day to day", ["audits the accounts", "taxes the workers", "insures the stock"], "The MD leads management.", "runs the company day to day"],
      ["An annual general meeting", "reports to shareholders and elects directors", ["appoints judges", "writes laws", "fixes wages"], "Shareholders meet yearly.", "reports to shareholders and elects directors"],
      ["The smallest business unit by capital needs is the", "sole proprietorship", ["public company", "joint venture", "cartel"], "One owner can start small.", "sole proprietorship"],
      ["An advantage of a partnership over a sole trade is", "more capital and skills", ["less tax", "no records", "secrecy always"], "Partners pool funds and talents.", "more capital and skills"],
      ["The main weakness of a sole proprietorship is", "unlimited liability", ["double taxation", "public offering", "board battles"], "Personal risk is the drawback.", "unlimited liability"],
    ],
  }),
  recallFamily({
    id: "ecommerce-warehousing",
    topicSlug: "commerce",
    label: "Warehousing, consumer protection and e-commerce",
    hint: "Modern commerce adds storage, rights and digital channels.",
    rows: [
      ["A warehouse", "stores goods until sale", ["makes goods", "moves goods", "advertises goods"], "Storage smooths supply.", "stores goods until sale"],
      ["A bonded warehouse holds", "dutiable imports not yet cleared", ["perishable fruit", "farm tools", "statistics"], "Customs holds the goods pending duty.", "dutiable imports not yet cleared"],
      ["A cold store keeps", "perishables", ["cement", "furniture", "machinery"], "Refrigeration preserves food.", "perishables"],
      ["Stocktaking counts", "goods on hand", ["customers served", "lorries owned", "staff hired"], "It verifies the inventory.", "goods on hand"],
      ["Stock control aims to", "hold neither too much nor too little", ["hold maximum stock", "hold no stock", "hold expired stock"], "It balances cost and availability.", "hold neither too much nor too little"],
      ["A reorder level triggers", "a fresh order", ["a sale", "an audit", "an advert"], "Levels prevent stockouts.", "a fresh order"],
      ["The oldest stock should be sold first under", "FIFO", ["LIFO", "JIT only", "random access"], "First-in-first-out moves perishables.", "FIFO"],
      ["Lead time is the", "delay before a delivery arrives", ["time to count stock", "time to advertise", "time to close a shop"], "Order-to-delivery lag.", "delay before a delivery arrives"],
      ["Buffer stock is held", "against shortages", ["against rain", "against taxes", "against strikes only"], "Safety stock covers surprises.", "against shortages"],
      ["Consumer protection laws exist to", "guard buyers from unfair practices", ["raise prices", "cut supply", "ban imports"], "They secure fair dealing.", "guard buyers from unfair practices"],
      ["The right to safety means goods", "must not harm the user", ["must be cheapest", "must be imported", "must be unbranded"], "Safety prevents injury.", "must not harm the user"],
      ["The right to information covers", "truthful labels", ["secret recipes", "hidden prices", "no expiry dates"], "Labels inform choice.", "truthful labels"],
      ["The right to choose means buyers", "may select among competing goods", ["must buy the only brand", "must buy expired goods", "must buy by order"], "Choice requires competition.", "may select among competing goods"],
      ["Weights and measures laws guard against", "short measure", ["long queues", "high rents", "fake labels only"], "They ensure honest quantities.", "short measure"],
      ["Expiry dates matter most for", "food and drugs", ["furniture", "books", "clothes"], "Stale goods endanger health.", "food and drugs"],
      ["A receipt proves", "a purchase", ["a loan", "an insurance claim", "a partnership"], "It evidences the sale.", "a purchase"],
      ["A complaint to a seller should be", "prompt and evidenced", ["verbal only", "anonymous", "after years"], "Evidence speeds redress.", "prompt and evidenced"],
      ["An ombudsman in commerce", "investigates consumer complaints", ["fixes prices", "sets wages", "collects taxes"], "It resolves disputes.", "investigates consumer complaints"],
      ["E-commerce means", "trade conducted electronically", ["trade by post only", "trade by barter", "trade in grains"], "It uses the internet.", "trade conducted electronically"],
      ["B2C is best described as", "business selling to consumers", ["business to business", "consumer to consumer", "bank to bank"], "B2C serves the final buyer.", "business selling to consumers"],
      ["B2B is best described as", "trade between businesses", ["business to consumers", "consumer to consumer", "government to firms only"], "Firms supply firms.", "trade between businesses"],
      ["C2C trade happens on", "online marketplaces", ["only in shops", "only at ports", "only by post"], "Individuals sell to individuals.", "online marketplaces"],
      ["A digital wallet", "stores funds for electronic payment", ["holds cash", "stores goods", "prints money"], "It e-wallets payment value.", "stores funds for electronic payment"],
      ["Cash-on-delivery means payment is", "made when the goods arrive", ["made before order", "never made", "made by cheque only"], "COD reduces buyer risk.", "made when the goods arrive"],
      ["A shopping cart online", "holds goods before checkout", ["delivers goods", "discounts all prices", "insures the buyer"], "It is the virtual basket.", "holds goods before checkout"],
      ["Secure payment pages use", "encryption", ["plain text", "bills of lading", "waybills"], "Encryption protects card data.", "encryption"],
      ["Digital payment for e-commerce requires", "internet and a bank link", ["only a lorry", "only a warehouse", "only a cheque book"], "Banking rails carry the money.", "internet and a bank link"],
      ["The biggest risk in online buying is", "non-delivery or fraud", ["high prices only", "heavy goods only", "travelling far"], "Buyer risk is non-delivery.", "non-delivery or fraud"],
    ],
  }),
];
