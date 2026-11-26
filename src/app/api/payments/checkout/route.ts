import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { primePriceForCountry } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    const { period } = await req.json();
    if (!["monthly", "annual"].includes(period)) return NextResponse.json({ error: "Invalid billing period" }, { status: 400 });
    const country = (user.country || "US").toUpperCase();
    // ROADMAP §6: ONE product is sold at /pricing — "Gnostiri Prime". The
    // localized amount comes from the same table the pricing page displays
    // (src/lib/plans.ts PRIME_PRICES), already in the SMALLEST currency unit
    // (kobo for NGN, pesewas for GHS, cents for USD/GBP/EUR, paisa for
    // INR/PKR) — charged as-is, never re-multiplied.
    const pricing = primePriceForCountry(country, period);
    const amount = pricing.amount;
    const provider = ["NG", "GH", "KE"].includes(country) ? "paystack" : country === "IN" ? "razorpay" : "stripe";
    // Inert without credentials: reject BEFORE any database row is created.
    const configured =
      provider === "stripe"
        ? Boolean(process.env.STRIPE_SECRET_KEY)
        : provider === "paystack"
          ? Boolean(process.env.PAYSTACK_SECRET_KEY)
          : Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    if (!configured) throw new Error(`${provider} is not configured`);
    const subscription = await prisma.subscription.create({ data: { userId: user.id, tier: "free", status: "pending", provider, billingPeriod: period, domainAccess: [], currency: pricing.currency, amountCents: amount } });
    let checkoutUrl = "";
    if (provider === "stripe") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      const session = await stripe.checkout.sessions.create({ mode: "subscription", customer_email: user.email, success_url: `${req.nextUrl.origin}/university?payment=success`, cancel_url: `${req.nextUrl.origin}/pricing?payment=cancelled`, line_items: [{ quantity: 1, price_data: { currency: pricing.currency.toLowerCase(), unit_amount: amount, recurring: { interval: period === "annual" ? "year" : "month" }, product_data: { name: `Gnostiri Premium (${period})` } } }], metadata: { subscriptionId: subscription.id, userId: user.id, period }, subscription_data: { metadata: { subscriptionId: subscription.id, userId: user.id, period } } });
      checkoutUrl = session.url || "";
      await prisma.subscription.update({ where: { id: subscription.id }, data: { providerRef: session.id } });
    } else if (provider === "paystack") {
      // One-off transaction initialized with amount + currency DIRECTLY
      // (amount in subunits — kobo for NGN). A Paystack plan is NOT created
      // per checkout (the old POST /plan on every request minted duplicate
      // plans and wasted API calls). Renewal = the learner re-checks out; the
      // webhook grants 30/365 days per successful charge, deduped by content
      // hash. Mobile money/bank/USSD channels follow the account defaults.
      const headers = { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" };
      const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers, body: JSON.stringify({ email: user.email, amount, currency: pricing.currency, reference: subscription.id, callback_url: `${req.nextUrl.origin}/university?payment=success`, metadata: { subscriptionId: subscription.id, userId: user.id, period } }) });
      const data = await response.json(); if (!response.ok || !data.status) throw new Error("Paystack checkout failed");
      checkoutUrl = data.data.authorization_url;
      await prisma.subscription.update({ where: { id: subscription.id }, data: { providerRef: data.data.reference } });
    } else {
      const keyId = process.env.RAZORPAY_KEY_ID; const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keyId || !keySecret) throw new Error("Razorpay is not configured");
      const headers = { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`, "Content-Type": "application/json" };
      const planResponse = await fetch("https://api.razorpay.com/v1/plans", { method: "POST", headers, body: JSON.stringify({ period: period === "annual" ? "yearly" : "monthly", interval: 1, item: { name: `Gnostiri Premium ${period}`, amount, currency: pricing.currency }, notes: { subscriptionId: subscription.id } }) });
      const plan = await planResponse.json(); if (!planResponse.ok) throw new Error("Razorpay plan setup failed");
      const response = await fetch("https://api.razorpay.com/v1/subscriptions", { method: "POST", headers, body: JSON.stringify({ plan_id: plan.id, total_count: period === "annual" ? 10 : 120, customer_notify: 1, notes: { subscriptionId: subscription.id, userId: user.id, period } }) });
      const created = await response.json(); if (!response.ok) throw new Error("Razorpay subscription failed");
      await prisma.subscription.update({ where: { id: subscription.id }, data: { providerRef: created.id } });
      checkoutUrl = created.short_url;
    }
    return NextResponse.json({ provider, checkoutUrl, subscriptionId: subscription.id });
  } catch (error) {
    console.error("Checkout initialization failed", error);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 503 });
  }
}
