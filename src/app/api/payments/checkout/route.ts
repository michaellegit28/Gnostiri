import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

const prices: Record<string, { currency: string; monthly: number; annual: number }> = {
  NG: { currency: "NGN", monthly: 250000, annual: 2500000 }, GH: { currency: "GHS", monthly: 3500, annual: 35000 },
  KE: { currency: "KES", monthly: 35000, annual: 350000 }, IN: { currency: "INR", monthly: 19900, annual: 199900 },
  PK: { currency: "PKR", monthly: 50000, annual: 500000 }, US: { currency: "USD", monthly: 399, annual: 3999 },
  GB: { currency: "GBP", monthly: 399, annual: 3999 }, EU: { currency: "EUR", monthly: 399, annual: 3999 },
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    const { period } = await req.json();
    if (!["monthly", "annual"].includes(period)) return NextResponse.json({ error: "Invalid billing period" }, { status: 400 });
    const country = (user.country || "US").toUpperCase();
    const pricing = prices[country] || prices.US;
    const amount = period === "annual" ? pricing.annual : pricing.monthly;
    const provider = ["NG", "GH", "KE"].includes(country) ? "paystack" : country === "IN" ? "razorpay" : "stripe";
    const subscription = await prisma.subscription.create({ data: { userId: user.id, tier: "free", status: "pending", provider, billingPeriod: period, domainAccess: [] } });
    let checkoutUrl = "";
    if (provider === "stripe") {
      if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({ mode: "subscription", customer_email: user.email, success_url: `${req.nextUrl.origin}/university?payment=success`, cancel_url: `${req.nextUrl.origin}/pricing?payment=cancelled`, line_items: [{ quantity: 1, price_data: { currency: pricing.currency.toLowerCase(), unit_amount: amount, recurring: { interval: period === "annual" ? "year" : "month" }, product_data: { name: `Gnostiri Premium (${period})` } } }], metadata: { subscriptionId: subscription.id, userId: user.id, period }, subscription_data: { metadata: { subscriptionId: subscription.id, userId: user.id, period } } });
      checkoutUrl = session.url || "";
      await prisma.subscription.update({ where: { id: subscription.id }, data: { providerRef: session.id } });
    } else if (provider === "paystack") {
      if (!process.env.PAYSTACK_SECRET_KEY) throw new Error("Paystack is not configured");
      const headers = { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" };
      const planResponse = await fetch("https://api.paystack.co/plan", { method: "POST", headers, body: JSON.stringify({ name: `Gnostiri Premium ${period}`, amount, interval: period === "annual" ? "annually" : "monthly", currency: pricing.currency }) });
      const planData = await planResponse.json(); if (!planResponse.ok || !planData.status) throw new Error("Paystack plan setup failed");
      const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers, body: JSON.stringify({ email: user.email, plan: planData.data.plan_code, reference: subscription.id, callback_url: `${req.nextUrl.origin}/university?payment=success`, metadata: { subscriptionId: subscription.id, userId: user.id, period } }) });
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
