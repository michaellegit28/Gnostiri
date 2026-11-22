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
