import { z } from "zod";

export const PREFERENCE_COUNTRY_CODES = [
  "NG",
  "GH",
  "KE",
  "ZA",
  "EG",
  "IN",
  "PK",
  "CN",
  "JP",
  "AU",
  "SG",
  "AE",
  "IL",
  "BR",
  "US",
  "GB",
  "CA",
  "IE",
  "FR",
  "DE",
  "EU",
] as const;

export const PREFERENCE_COUNTRIES = [
  { code: "NG", label: "Nigeria" },
  { code: "GH", label: "Ghana" },
  { code: "KE", label: "Kenya" },
  { code: "ZA", label: "South Africa" },
  { code: "EG", label: "Egypt" },
  { code: "IN", label: "India" },
  { code: "PK", label: "Pakistan" },
  { code: "CN", label: "China" },
  { code: "JP", label: "Japan" },
  { code: "AU", label: "Australia" },
  { code: "SG", label: "Singapore" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "IL", label: "Israel" },
  { code: "BR", label: "Brazil" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "IE", label: "Ireland" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
  { code: "EU", label: "European Union" },
] as const;

export const EXAM_STANDARD_CODES = ["jamb-standard", "sat-standard"] as const;

export const EXAM_STANDARDS = [
  { value: "jamb-standard", label: "JAMB" },
  { value: "sat-standard", label: "SAT" },
] as const;

export const userPreferenceSchema = z
  .object({
    country: z.enum(PREFERENCE_COUNTRY_CODES).nullable(),
    examStandard: z.enum(EXAM_STANDARD_CODES).nullable(),
    dailyGoalMinutes: z.number().int().min(10).max(180),
    srsEnabled: z.boolean(),
    analyticsOptOut: z.boolean(),
  })
  .strict();

export type UserPreferenceInput = z.infer<typeof userPreferenceSchema>;

export const DEFAULT_USER_PREFERENCES: UserPreferenceInput = {
  country: null,
  examStandard: null,
  dailyGoalMinutes: 20,
  srsEnabled: true,
  analyticsOptOut: false,
};

export function normalizeUserPreferences(
  value: unknown,
  fallbackCountry: string | null = null
): UserPreferenceInput {
  const parsed = userPreferenceSchema.safeParse(value);
  const normalizedFallback = fallbackCountry?.toUpperCase() ?? null;
  const country = PREFERENCE_COUNTRY_CODES.includes(
    normalizedFallback as (typeof PREFERENCE_COUNTRY_CODES)[number]
  )
    ? (normalizedFallback as (typeof PREFERENCE_COUNTRY_CODES)[number])
    : null;
  return {
    ...(parsed.success ? parsed.data : DEFAULT_USER_PREFERENCES),
    country,
  };
}
