import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Business Topic 5: Commerce at the no-exceptions bar:
// production levels, trade, channels of distribution, documents, transport, insurance, banking.

const COMMERCE_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Commerce — the bridge between producer and consumer" },
  { type: "definition", term: "Commerce", text: "Commerce is TRADE (buying and selling) plus the AIDS to trade (transport, insurance, banking, warehousing, advertising) — everything that moves goods and removes the barriers between producer and consumer. Production has three levels: primary (extraction — farming, mining), secondary (manufacturing), tertiary (services). Commerce connects them all." },
  { type: "example", text: "Worked: cocoa grown on a farm (primary), processed into chocolate (secondary), sold in a supermarket (tertiary) — and commerce did the moving: transport carried it, insurance covered it, banking financed it, advertising sold it. Name the aids to trade — the definition question wants them listed." },
  { type: "heading", level: 2, text: "2. Home trade and foreign trade — the two branches" },
  { type: "table", headers: ["Branch", "Scope", "Within it", "Documents"], rows: [["Home trade", "Within one country", "Wholesale and retail", "Invoices, receipts, credit notes"], ["Foreign trade", "Between countries", "Import and export (visible) + services (invisible)", "Bills of lading, certificates of origin, letters of credit"]] },
  { type: "paragraph", text: "Foreign trade is riskier and more complex: distances, currencies, customs, and trust between strangers — which is why its DOCUMENTS matter (they carry the risk allocation). Visible trade = goods; invisible = services (shipping, tourism, banking) — the balance of payments counts both, chapter 2 of economics, recycled." },
  { type: "heading", level: 2, text: "3. Channels of distribution — the path to the customer" },
  { type: "definition", term: "Channels", text: "Zero-level: producer → consumer (direct — farms selling roadside, online direct). One-level: producer → retailer → consumer. Two-level: producer → wholesaler → retailer → consumer. Each extra level adds a MARGIN (the price rises) but also a SERVICE (breaking bulk, storage, credit, local reach)." },
  { type: "example", text: "Worked: the WHOLESALER exists to break bulk (a factory ships 10,000 units; the shop needs 20), store, and give credit — remove the middleman and those jobs land back on the producer. Supermarkets bypass wholesalers (huge buying power — they break their own bulk). 'Why does the middleman exist?' is the exam's set piece: service, not parasitism." },
  { type: "heading", level: 2, text: "4. Wholesale and retail — the two tiers" },
  { type: "paragraph", text: "Wholesaling: buying in bulk from producers, selling smaller quantities to retailers — the bulk-breaking tier. Retailing: the final sale to the CONSUMER — the last link. Retail types: hawking, kiosks, supermarkets, department stores, chains, online — each trades reach against cost. The trend: large-scale retail (supermarkets, online) squeezes small intermediaries — economies of scale, chapter 1, recycled." },
  { type: "heading", level: 2, text: "5. Trade documents — the paper trail" },
  { type: "table", headers: ["Document", "Who issues it", "What it does"], rows: [["Invoice", "Seller", "States the goods, price, terms — the demand for payment"], ["Receipt", "Seller", "Proof of payment"], ["Credit note", "Seller", "Corrects an overcharge or accepted return"], ["Debit note", "Buyer", "Challenges an undercharge — asks for a credit note"], ["Statement of account", "Seller", "Monthly summary of the account"], ["Bill of lading", "Shipping line", "Title to the goods in transit — the export staple"], ["Letter of credit", "Buyer's bank", "Guarantees payment — the trust machine of foreign trade"]] },
  { type: "paragraph", text: "Foreign trade runs on the letter of credit: the buyer's bank PROMISES payment when the documents are presented — strangers trade because banks interpose trust. The bill of lading transfers title: whoever holds it owns the goods at sea." },
  { type: "heading", level: 2, text: "6. Transport — the modes and their trade-offs" },
  { type: "table", headers: ["Mode", "Best for", "Weakness"], rows: [["Road", "Door-to-door, short haul", "Congestion, accidents, small loads"], ["Rail", "Heavy, bulky, long-haul over land", "Fixed routes, no door delivery"], ["Sea", "International bulk — cheapest per ton-mile", "Slow, port-dependent"], ["Air", "High-value, perishable, urgent", "Most expensive, weight-limited"], ["Pipeline", "Liquids and gas, continuous flow", "Fixed product, fixed route"]] },
  { type: "paragraph", text: "The mode follows the cargo: value-per-weight decides — crude oil ships (heavy, cheap), diamonds fly (tiny, priceless), milk delivers by road (perishable, local). 'Which mode and why?' = match the cargo's traits to the mode's strengths." },
  { type: "heading", level: 2, text: "7. Insurance — the risk machine" },
  { type: "definition", term: "Principles of insurance", text: "Insurance pools risk: many pay premiums, few claim. The principles: INDEMNITY (restored to your position, never profited — the trap: over-insuring pays nothing extra), UTMOST GOOD FAITH (disclose everything — hide a fact, void the policy), INSURABLE INTEREST (you must stand to lose), CONTRIBUTION (shared among insurers), SUBROGATION (the insurer steps into your shoes after paying)." },
  { type: "example", text: "Worked: a shop worth 2 million insured for 1 million, fire loss 500,000 → the insurer pays 250,000 (half — under-insured, the AVERAGE CLAUSE applies). Indemnity in action: you are restored to your position, never enriched. Life insurance breaks the indemnity rule (life has no price — it pays the sum assured): the exception the exam names." },
  { type: "heading", level: 2, text: "8. Banking — the money plumbing" },
  { type: "paragraph", text: "Commercial banks: accept deposits, lend, transfer money, provide credit instruments (cheques, standing orders, direct debits). The CHEQUE: a written order to pay — crossing it (two lines) forces it through an account, making it traceable and safe. The central bank (chapter 2, recycled): issues currency, banks for the government, sets the monetary policy rate." },
  { type: "example", text: "Worked: crossed cheque 'not negotiable' — stolen, it lands in an account and is traced; uncrossed, it could be cashed by anyone. The crossing is the security. Standing order vs direct debit: the PAYER fixes the amount and date (standing order); the PAYEE varies it (direct debit — utility bills). The control question: who fixes the amount." },
  { type: "heading", level: 2, text: "9. Warehousing and advertising — the quiet aids" },
  { type: "paragraph", text: "Warehousing stores goods until demanded — smoothing seasonal production (rice harvested once, eaten all year): types include public, bonded (customs-controlled — duty unpaid until the goods leave), and cold storage. Advertising informs and persuades — the TYPES: informative (new products), persuasive (brands), competitive; above the line (media) vs below the line (promotions, direct). The judgement: advertising raises costs AND demand — whether prices rise or fall depends on the scale economies the demand unlocks." },
  { type: "heading", level: 2, text: "10. Terms of payment — the credit language" },
  { type: "table", headers: ["Term", "Meaning", "Trade-off"], rows: [["Cash on delivery", "Pay when it lands", "No credit risk, no delay"], ["Net 30 / 60", "Full payment in 30/60 days", "Buyer's cash flow wins; seller carries the risk"], ["C.O.D. with discount", "Pay early, pay less", "Discount rewards the cash buyer"], ["Hire purchase", "Deposit + instalments", "Buyer uses goods before owning them"]] },
  { type: "paragraph", text: "Trade credit is the silent engine of retail: goods flow now, cash flows later. The seller prices the credit into the invoice (or offers a discount for cash) — the terms allocate the risk and the timing, chapter 3 of business studies, recycled." },
  { type: "heading", level: 2, text: "11. Summary — the commerce spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Definition", "Trade + aids to trade, listed", "Commerce is not just trade"], ["Channels", "Each level = margin AND service", "The middleman serves, not parasitises"], ["Documents", "Issuer + function, paired", "Credit note corrects; debit note challenges"], ["Transport", "Cargo traits → mode", "Value-per-weight decides"], ["Insurance", "Name the principle", "Indemnity: restored, never profited"], ["Banking", "Crossing = traceable", "Standing order: payer fixes the amount"], ["Terms", "Who carries the risk and timing", "Credit is priced in"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'list' = the memorised items, complete; 'explain' = the service the institution provides (bulk-breaking, trust interposition, risk pooling); 'distinguish between' = both items, the difference named on each line. Commerce papers pay for the function of each institution — never just its name." },
];

const COMMERCE_QS: Q[] = [
  { q: "Commerce consists of", o: ["production and consumption", "trade plus the aids to trade", "wholesaling only", "importing and exporting only"], a: "trade plus the aids to trade", e: "Transport, insurance, banking, warehousing, advertising — the aids.", d: "easy" },
  { q: "Turning cocoa into chocolate is which production level?", o: ["primary", "secondary — manufacturing", "tertiary", "commerce"], a: "secondary — manufacturing", e: "Primary extracts, secondary manufactures, tertiary serves.", d: "easy" },
  { q: "The wholesaler exists mainly to", o: ["raise prices for profit", "break bulk, store, and give credit", "advertise products", "export goods"], a: "break bulk, store, and give credit", e: "Service, not parasitism — remove it and its jobs return to the producer.", d: "medium" },
  { q: "A document correcting an overcharge is a", o: ["debit note", "credit note", "receipt", "statement of account"], a: "credit note", e: "Seller corrects with a credit note; buyer challenges with a debit note.", d: "easy" },
  { q: "The document giving title to goods at sea is", o: ["the invoice", "the bill of lading", "the certificate of origin", "the letter of credit"], a: "the bill of lading", e: "Whoever holds it owns the goods in transit.", d: "medium" },
  { q: "The letter of credit exists because", o: ["banks like paperwork", "it interposes trust — the buyer's bank guarantees payment", "shipping lines demand it", "customs requires it"], a: "it interposes trust — the buyer's bank guarantees payment", e: "Strangers trade because banks stand between them.", d: "medium" },
  { q: "Diamonds are transported by air because", o: ["air is cheapest", "they are high-value, light, and urgent — cargo traits match the mode", "sea is too slow only", "diamonds melt"], a: "they are high-value, light, and urgent — cargo traits match the mode", e: "Value-per-weight decides the mode.", d: "easy" },
  { q: "A shop worth 2m insured for 1m suffers 500,000 fire loss. The insurer pays", o: ["500,000", "250,000 — under-insured, average clause", "1,000,000", "nothing"], a: "250,000 — under-insured, average clause", e: "Indemnity: restored to your position, never profited — half the loss.", d: "hard" },
  { q: "A crossed cheque is safer because", o: ["it cannot be lost", "it must pass through an account — traceable", "it pays more interest", "the bank guarantees the amount"], a: "it must pass through an account — traceable", e: "The two lines force account payment — stolen, it is traced.", d: "medium" },
  { q: "A standing order differs from a direct debit because", o: ["the bank fixes the amount", "the PAYER fixes the amount and date; the payee varies a direct debit", "direct debits cannot be cancelled", "they are identical"], a: "the PAYER fixes the amount and date; the payee varies a direct debit", e: "Who controls the amount is the distinction.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "commerce" } });
    if (!topic) throw new Error("master commerce topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("commerce standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Commerce — Complete", content: { blocks: COMMERCE_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < COMMERCE_QS.length; i++) {
      const item = COMMERCE_QS[i];
      await prisma.question.upsert({
        where: { id: `master-commerce-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-commerce-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "commerce-rebuild", blocks: COMMERCE_BLOCKS.length, questions: COMMERCE_QS.length });
  } catch (e) {
    console.error("rebuild commerce failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
