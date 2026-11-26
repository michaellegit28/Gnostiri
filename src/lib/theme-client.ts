"use client";

import {
  DEFAULT_THEME_ID,
  THEMES,
  THEME_STORAGE_KEY,
  isThemeId,
  themeById,
  type ThemeId,
} from "./themes";

/** Resolve the active theme id from the DOM first, then device storage. */
export function currentThemeId(): ThemeId {
  if (typeof document === "undefined") return DEFAULT_THEME_ID;
  const attr = document.documentElement.getAttribute("data-theme");
  if (isThemeId(attr)) return attr;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(stored)) return stored;
  } catch {
    // private mode — fall through to the default theme
  }
  return DEFAULT_THEME_ID;
}

/** Apply a theme id immediately and keep the PWA meta colour in sync. */
export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  const theme = themeById(id);
  document.documentElement.setAttribute("data-theme", theme.id);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  } catch {
    // private mode — the theme simply doesn't persist
  }
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", theme.metaColor);
  });
}

/** The top-bar switch keeps the student's current mode but hops to its default. */
export function toggleThemeMode(current: ThemeId): ThemeId {
  const nextMode = themeById(current).mode === "dark" ? "light" : "dark";
  const fallback = THEMES.find((theme) => theme.mode === nextMode && !theme.premium);
  return fallback?.id ?? DEFAULT_THEME_ID;
}