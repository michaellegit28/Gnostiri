// Gnostiri colour themes.
//
// One source of truth for theme identity, mode, ordering and the theme-color
// meta value. The actual CSS token blocks live in globals.css under
// [data-theme="<id>"] and MUST stay in sync with these names.

export type ThemeMode = "dark" | "light";

export type ThemeId =
  | "midnight-scholar"
  | "deep-forest"
  | "solarized-dark"
  | "high-contrast"
  | "paper-white"
  | "warm-cream"
  | "cool-slate"
  | "solarized-light";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  mode: ThemeMode;
  /** Literal #rrggbb used for the PWA/browser theme-color meta. */
  metaColor: string;
  /** Free themes are always selectable. */
  premium: boolean;
}

export const THEMES: ThemeDefinition[] = [
  { id: "midnight-scholar", name: "Midnight Scholar", mode: "dark", metaColor: "#0a0f1e", premium: false },
  { id: "deep-forest", name: "Deep Forest", mode: "dark", metaColor: "#0a1f1a", premium: true },
  { id: "solarized-dark", name: "Solarized Dark", mode: "dark", metaColor: "#002b36", premium: true },
  { id: "high-contrast", name: "High Contrast", mode: "dark", metaColor: "#000000", premium: true },
  { id: "paper-white", name: "Paper White", mode: "light", metaColor: "#fafafa", premium: false },
  { id: "warm-cream", name: "Warm Cream", mode: "light", metaColor: "#fdf6e3", premium: true },
  { id: "cool-slate", name: "Cool Slate", mode: "light", metaColor: "#f1f5f9", premium: true },
  { id: "solarized-light", name: "Solarized Light", mode: "light", metaColor: "#fdf6e3", premium: true },
];

export const DEFAULT_THEME_ID: ThemeId = "midnight-scholar";

export const THEME_STORAGE_KEY = "gnostiri.theme";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEMES.some((theme) => theme.id === value);
}

export function themeById(value: unknown): ThemeDefinition {
  return THEMES.find((theme) => theme.id === value) ?? THEMES[0];
}

export function themeMode(value: unknown): ThemeMode {
  return themeById(value).mode;
}

export function themeMetaColor(value: unknown): string {
  return themeById(value).metaColor;
}