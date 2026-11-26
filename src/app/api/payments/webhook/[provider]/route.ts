import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import prisma from "@/lib/db";
import {
  classifyPaystackEvent,
  paystackEventId,
  verifyPaystackEvent,
} from "@/lib/payments";

function validHmac(secret: string, body: string, signature: string) {
  const digest = createHmac("sha256", secret).update(body).digest("hex");
  const left = Buffer.from(digest); const right = Buffer.from(signature || "");
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider;
  const raw = await req.text();
  let providerRef = ""; let paid = false; let appSubscriptionId = "";
  let cancelled = false;
  let eventId = "";
  // Audit fields for the charged amount (schema currency/amountCents) — set
  // from the provider payload where the event carries them. Never logged.
  let chargeCurrency: string | undefined;
  let chargeAmount: number | undefined;
  try {
    if (provider === "stripe") {
      const secret = process.env.STRIPE_WEBHOOK_SECRET; const signature = req.headers.get("stripe-signature") || "";
      if (!secret || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const event = stripe.webhooks.constructEvent(raw, signature, secret);
      eventId = event.id;
      if (event.type === "checkout.session.completed") { const session = event.data.object as Stripe.Checkout.Session; providerRef = typeof session.subscription === "string" ? session.subscription : session.id; appSubscriptionId = session.metadata?.subscriptionId || ""; paid = session.payment_status === "paid"; }
      if (event.type === "invoice.paid") { const invoice = event.data.object as any; const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id; if (subId) { const stripeSub = await stripe.subscriptions.retrieve(subId); providerRef = subId; appSubscriptionId = stripeSub.metadata.subscriptionId || ""; paid = true; } }
      if (event.type === "customer.subscription.deleted") { const stripeSub = event.data.object as Stripe.Subscription; providerRef = stripeSub.id; appSubscriptionId = stripeSub.metadata.subscriptionId || ""; cancelled = true; }
    } else if (provider === "paystack") {
      // Signature-gated BEFORE any state change. Paystack signs with HMAC-SHA512
      // (docs 2026-11-25): legacy x-paystack-signature over the raw body with
      // the secret key, or the newer Paystack-Signature t/v1 scheme with the
      // dashboard signing secret. Both are honoured in src/lib/payments.ts.
      const scheme = verifyPaystackEvent(
        raw,
        {
          paystackSignature: req.headers.get("paystack-signature"),
          xPaystackSignature: req.headers.get("x-paystack-signature"),
        },
        {
          secretKey: process.env.PAYSTACK_SECRET_KEY,
          webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
        }
      );
      if (!scheme) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      const event = JSON.parse(raw);
      const classified = classifyPaystackEvent(event);
      providerRef = classified.providerRef;
      appSubscriptionId = classified.appSubscriptionId;
      paid = classified.paid;
      cancelled = classified.cancelled;
      chargeCurrency = classified.currency;
      chargeAmount = classified.amount;
      eventId = paystackEventId(raw); // content hash — replays dedupe
    } else if (provider === "razorpay") {
      const signature = req.headers.get("x-razorpay-signature") || ""; const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!secret || !validHmac(secret, raw, signature)) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      const event = JSON.parse(raw); if (["subscription.activated", "subscription.charged"].includes(event.event)) { providerRef = event.payload?.subscription?.entity?.id; paid = Boolean(providerRef); } if (event.event === "subscription.cancelled" || event.event === "subscription.halted") { providerRef = event.payload?.subscription?.entity?.id; cancelled = Boolean(providerRef); }
      eventId = `razorpay:${createHash("sha256").update(raw).digest("hex")}`;
    } else return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    if ((paid || cancelled) && (providerRef || appSubscriptionId)) {
      if (!eventId) return NextResponse.json({ error: "Missing event identifier" }, { status: 400 });
      const priorEvent = await prisma.paymentEvent.findUnique({ where: { eventId } });
      if (priorEvent) return NextResponse.json({ received: true, duplicate: true });
      const subscription = await prisma.subscription.findFirst({ where: { OR: [...(providerRef ? [{ providerRef }] : []), ...(appSubscriptionId ? [{ id: appSubscriptionId }] : [])] } });
      if (!subscription) return NextResponse.json({ error: "Subscription not found" }, { status: 503 });
      await prisma.$transaction(async (tx) => {
        await tx.paymentEvent.create({ data: { eventId, provider } });
        if (subscription && cancelled) await tx.subscription.update({ where: { id: subscription.id }, data: { providerRef: providerRef || subscription.providerRef, tier: "free", plan: "free", status: "canceled", domainAccess: [], expiresAt: new Date() } });
        else if (subscription && paid) {
          const duration = subscription.billingPeriod === "annual" ? 365 : 30;
          // ROADMAP §6: the product sold at /pricing is "Gnostiri Prime"
          // (all-access). plan "prime" is what every gate actually reads
          // (hasPremiumAccess → university/highschool/extras all pass for
          // prime; getEntitlements → all paid features). tier stays "premium"
          // for the legacy checks (/api/entitlements/prime, cups, season
          // rewards). The old payload set only tier — which left plan at its
          // "free" default and LOCKED PAID USERS OUT of every gate.
          await tx.subscription.update({
            where: { id: subscription.id },
            data: {
              providerRef: providerRef || subscription.providerRef,
              tier: "premium",
              plan: "prime",
              status: "active",
              domainAccess: ["highschool", "university", "extras"],
              expiresAt: new Date(Date.now() + duration * 86400000),
              ...(chargeCurrency ? { currency: chargeCurrency } : {}),
              ...(typeof chargeAmount === "number" ? { amountCents: chargeAmount } : {}),
            },
          });
        }
      });
    }
    return NextResponse.json({ received: true });
  } catch (error) { console.error("Payment webhook failed", error); return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 }); }
}
