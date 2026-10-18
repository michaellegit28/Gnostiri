import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import prisma from "@/lib/db";

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
      const signature = req.headers.get("x-paystack-signature") || ""; const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret || !validHmac(secret, raw, signature)) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      const event = JSON.parse(raw); if (event.event === "charge.success") { appSubscriptionId = event.data.metadata?.subscriptionId || ""; providerRef = event.data.reference; paid = event.data.status === "success"; }
      eventId = `paystack:${createHash("sha256").update(raw).digest("hex")}`;
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
        if (subscription && cancelled) await tx.subscription.update({ where: { id: subscription.id }, data: { providerRef: providerRef || subscription.providerRef, tier: "free", status: "canceled", domainAccess: [], expiresAt: new Date() } });
        else if (subscription && paid) {
          const duration = subscription.billingPeriod === "annual" ? 365 : 30;
          await tx.subscription.update({ where: { id: subscription.id }, data: { providerRef: providerRef || subscription.providerRef, tier: "premium", status: "active", domainAccess: ["university"], expiresAt: new Date(Date.now() + duration * 86400000) } });
        }
      });
    }
    return NextResponse.json({ received: true });
  } catch (error) { console.error("Payment webhook failed", error); return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 }); }
}
