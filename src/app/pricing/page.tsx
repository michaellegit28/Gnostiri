"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useDomain } from "@/context/DomainContext";
import { DEFAULT_LEARNING_DOMAIN, domainHome, domainLabel } from "@/lib/learning-domain";
import { formatPrimePrice } from "@/lib/plans";

/**
 * Prime is one membership that covers the student's own lane plus the shared
 * workspace. The page never advertises the other lane's content — a High
 * School session sees High School copy, a University session sees University.
 */
export default function PricingPage() {
  const { user } = useAuth();
  const { learningDomain } = useDomain();
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [country, setCountry] = useState("US");

  useEffect(() => {
    if (user) fetch("/api/auth/country").then((r) => r.json()).then((d) => { if (d.country) setCountry(d.country); }).catch(() => undefined);
  }, [user]);

  const domain = learningDomain ?? DEFAULT_LEARNING_DOMAIN;
  const lane = domainLabel(domain);
  const laneCopy = domain === "university"
    ? "University courses, exam halls, mastery and certificates."
    : "High-school exam banks, timed practice and past-paper review.";
  const price = formatPrimePrice(country, period);

  async function checkout() {
    if (!user) {
      setError("Sign in before starting checkout.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout unavailable");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-5 py-8 text-slate-100 md:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href={domainHome(domain)}
          className="inline-flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          ← {lane}
        </Link>

        <header className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-electric-text">Membership</p>
          <h1 className="gn-title-gradient font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Gnostiri Prime
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            {laneCopy} Unlimited AI Tutor, adaptive study plans, saved downloads and completion certificates.
          </p>
        </header>

        <div className="flex gap-2" role="group" aria-label="Billing period">
          {(["monthly", "annual"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`gn-motion min-h-[44px] rounded-lg px-4 text-sm font-semibold capitalize transition-colors focus:outline-none focus-visible:ring-2 focus:visible:ring-primary ${
                period === p ? "bg-primary text-on-primary hover:bg-primary-hover" : "border border-line bg-surface-2 text-slate-300 hover:border-primary/50 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <section className="gn-card gn-lift rounded-2xl p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">Localized pricing</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">{price}</h2>
          <ul className="my-6 list-inside list-disc space-y-2 text-muted">
            <li>{laneCopy}</li>
            <li>Unlimited AI Tutor</li>
            <li>Adaptive study plans and saved downloads</li>
            <li>Completion certificates</li>
          </ul>
          <button
            type="button"
            onClick={() => void checkout()}
            disabled={busy}
            className="gn-btn-gold inline-flex min-h-[48px] items-center rounded-xl px-6 font-semibold disabled:opacity-50"
          >
            {busy ? "Opening checkout…" : "Start Prime"}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-rose-300">
              {error}
            </p>
          )}
          <p className="mt-3 text-xs text-muted">Payments are finishing owner-side; this button activates once keys are live.</p>
        </section>
      </div>
    </main>
  );
}