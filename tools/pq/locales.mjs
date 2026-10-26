/**
 * Locale skins for Version B (cloned variants).
 * A Version B item is localised at generation time: currency and names follow the
 * track it will be shuffled into. Concept, structure and difficulty never change —
 * only the surface. Version A (official) is never localised: it is verbatim.
 */

export const LOCALES = {
  NG: {
    currency: "\u20a6",
    currencyWord: "naira",
    names: ["Chidi", "Amina", "Emeka", "Ngozi", "Tunde", "Halima"],
    places: ["Onitsha", "Kano", "Aba", "Ibadan", "Enugu"],
  },
  ZA: {
    currency: "R",
    currencyWord: "rand",
    names: ["Thabo", "Lerato", "Sipho", "Nomvula", "Kagiso", "Zanele"],
    places: ["Soweto", "Durban", "Polokwane", "Mbombela"],
  },
  TZ: {
    currency: "TSh",
    currencyWord: "shillings",
    names: ["Juma", "Zainab", "Baraka", "Neema", "Hamisi", "Asha"],
    places: ["Dar es Salaam", "Mwanza", "Arusha", "Dodoma"],
  },
  GH: {
    currency: "\u20b5",
    currencyWord: "cedis",
    names: ["Kwame", "Akosua", "Yaw", "Ama", "Kofi", "Adjoa"],
    places: ["Kumasi", "Tamale", "Takoradi", "Cape Coast"],
  },
  KE: {
    currency: "KSh",
    currencyWord: "shillings",
    names: ["Wanjiku", "Otieno", "Cherono", "Mutua", "Njeri", "Kamau"],
    places: ["Kisumu", "Nakuru", "Eldoret", "Mombasa"],
  },
  US: {
    currency: "$",
    currencyWord: "dollars",
    names: ["Jordan", "Maya", "Dylan", "Sofia", "Ethan", "Aisha"],
    places: ["Austin", "Denver", "Columbus", "Tampa"],
  },
  UK: {
    currency: "\u00a3",
    currencyWord: "pounds",
    names: ["Priya", "Omar", "Ellie", "Callum", "Zainab", "Marcus"],
    places: ["Leeds", "Bristol", "Coventry", "Cardiff"],
  },
};

/** Neutral (no jurisdiction) skin for pools that shuffle across many tracks. */
export const NEUTRAL_LOCALE = {
  currency: "$",
  currencyWord: "units of money",
  names: ["Alex", "Sam", "Riley", "Jordan", "Kai", "Noor"],
  places: ["the market", "the shop", "the stall"],
};

export function localeFor(track) {
  return LOCALES[track] ?? NEUTRAL_LOCALE;
}

/** All track codes a global pool must be able to render. */
export const GLOBAL_TRACKS = Object.keys(LOCALES);
export const OFFICIAL_TRACKS = ["ZA", "TZ"];
