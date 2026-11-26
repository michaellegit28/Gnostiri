export type PlanId = "free" | "discovery" | "highschool" | "university" | "prime";
export type AddonId = "ai-productivity-pack";
export type BillingPeriod = "monthly" | "annual" | "term";

export interface PlanDefinition {
  id: PlanId;
  label: string;
  description: string;
  monthlyUsd: number;
}

export interface AddonDefinition {
  id: AddonId;
  label: string;
  description: string;
  monthlyUsd: number;
}

export interface LocalPricePair {
  currency: string;
  highSchoolMonthly: number;
  universityMonthly: number;
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    label: "Free",
    description: "Study, quizzes, competitions, browsing, and progress.",
    monthlyUsd: 0,
  },
  discovery: {
    id: "discovery",
    label: "Discovery",
    description: "Discovery browsing with deeper AI study tools.",
    monthlyUsd: 1.99,
  },
  highschool: {
    id: "highschool",
    label: "High School",
    description: "Full senior-exam study, downloads, and requests.",
    monthlyUsd: 3.99,
  },
  university: {
    id: "university",
    label: "University",
    description: "University courses, advanced marking, downloads, and requests.",
    monthlyUsd: 8.99,
  },
  prime: {
    id: "prime",
    label: "Prime",
    description: "Every learning environment and every included feature.",
    monthlyUsd: 11.99,
  },
};

export const ADDONS: Record<AddonId, AddonDefinition> = {
  "ai-productivity-pack": {
    id: "ai-productivity-pack",
    label: "AI Productivity Pack",
    description: "Voice transcription and deeper PDF intelligence.",
    monthlyUsd: 2.99,
  },
};

export const LOCAL_PRICES: Record<string, LocalPricePair> = {
  NG: { currency: "NGN", highSchoolMonthly: 200000, universityMonthly: 500000 },
  GH: { currency: "GHS", highSchoolMonthly: 2000, universityMonthly: 5500 },
  KE: { currency: "KES", highSchoolMonthly: 19900, universityMonthly: 49900 },
  ZA: { currency: "ZAR", highSchoolMonthly: 2900, universityMonthly: 7900 },
  US: { currency: "USD", highSchoolMonthly: 399, universityMonthly: 899 },
};

// ---------------------------------------------------------------------------
// ROADMAP §6 — the ONE product sold at /pricing: "Gnostiri Prime" (all-access),
// anchored at $3.99/mo · $39.90/yr (annual = monthly × 10). Amounts are
// INTEGER SMALLEST-CURRENCY-UNIT values — kobo for NGN, pesewas for GHS,
// cents for KES/USD/GBP/EUR, paisa for INR, paisa for PKR. Paystack charges
// NGN in kobo (×100), so these are sent to the provider as-is, NEVER
// re-multiplied. The localized NGN/GHS/KES/INR/PKR prices are intentional
// purchasing-power localization (owner decision, Phase 8: "prices in a data
// file + currency detection + USD fallback") — they match the ROADMAP USD
// anchor in intent, not in exchange-rate arithmetic.
//
// This is NOT the per-plan LOCAL_PRICES catalog below (that one prices the
// Phase-8 plan ladder for upgrade hints) — THIS table is what /api/payments/
// checkout charges. Both the charge and the /pricing page display derive from
// it, so they cannot drift (locked by tests/payments-paystack.test.mjs).
// ---------------------------------------------------------------------------
export const PRIME_PRICES: Record<
  string,
  { currency: string; monthly: number; annual: number }
> = {
  NG: { currency: "NGN", monthly: 250000, annual: 2500000 },
  GH: { currency: "GHS", monthly: 3500, annual: 35000 },
  KE: { currency: "KES", monthly: 35000, annual: 350000 },
  IN: { currency: "INR", monthly: 19900, annual: 199900 },
  PK: { currency: "PKR", monthly: 50000, annual: 500000 },
  US: { currency: "USD", monthly: 399, annual: 3990 },
  GB: { currency: "GBP", monthly: 399, annual: 3990 },
  EU: { currency: "EUR", monthly: 399, annual: 3990 },
};

const PRIME_PRICE_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  GHS: "GH₵",
  KES: "KSh ",
  INR: "₹",
  PKR: "₨",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export function primePriceForCountry(
  country: string | null | undefined,
  period: "monthly" | "annual"
): { currency: string; amount: number } {
  const entry =
    PRIME_PRICES[(country || "").trim().toUpperCase()] || PRIME_PRICES.US;
  return {
    currency: entry.currency,
    amount: period === "annual" ? entry.annual : entry.monthly,
  };
}

/** Exact display string the /pricing page renders for a country + period. */
export function formatPrimePrice(
  country: string | null | undefined,
  period: "monthly" | "annual"
): string {
  const { currency, amount } = primePriceForCountry(country, period);
  const wholeUnits = amount % 100 === 0;
  const value = (amount / 100).toLocaleString(
    "en-US",
    wholeUnits
      ? { maximumFractionDigits: 0 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  const symbol = PRIME_PRICE_SYMBOLS[currency] ?? currency;
  return `${symbol}${value} / ${period === "annual" ? "year" : "month"}`;
}

export function isPlanId(value: string): value is PlanId {
  return value in PLANS;
}

export function isAddonId(value: string): value is AddonId {
  return value in ADDONS;
}

export function localPriceForCountry(country: string | null | undefined): LocalPricePair {
  const code = country?.trim().toUpperCase();
  return (code && LOCAL_PRICES[code]) || LOCAL_PRICES.US;
}

export function planPrice(
  plan: PlanId,
  country: string | null | undefined,
  period: BillingPeriod = "monthly"
): { amount: number; currency: string; period: BillingPeriod } {
  const local = localPriceForCountry(country);
  const base =
    plan === "free"
      ? 0
      : plan === "highschool"
        ? local.highSchoolMonthly
        : plan === "university"
          ? local.universityMonthly
          : Math.round(
              PLANS[plan].monthlyUsd *
                100 *
                (local.highSchoolMonthly / (PLANS.highschool.monthlyUsd * 100))
            );
  const multiplier = period === "annual" ? 10 : period === "term" ? 3 : 1;
  return { amount: base * multiplier, currency: local.currency, period };
}

export function addonPrice(
  addon: AddonId,
  country: string | null | undefined,
  period: BillingPeriod = "monthly"
): { amount: number; currency: string; period: BillingPeriod } {
  const local = localPriceForCountry(country);
  const base = Math.round(
    PLANS.highschool.monthlyUsd *
      ADDONS[addon].monthlyUsd *
      100 *
      (local.highSchoolMonthly / (PLANS.highschool.monthlyUsd * 100))
  );
  const multiplier = period === "annual" ? 10 : period === "term" ? 3 : 1;
  return { amount: base * multiplier, currency: local.currency, period };
}
