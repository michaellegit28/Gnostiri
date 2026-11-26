"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { currentThemeId, applyTheme, toggleThemeMode } from "@/lib/theme-client";
import { themeById } from "@/lib/themes";

/**
 * Top-bar dark ⇄ light switch. The full theme catalogue lives in settings;
 * this keeps the fast OS-style toggle without exposing the other lane or
 * feature descriptions in the chrome.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const [themeId, setThemeId] = useState(currentThemeId());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeId(currentThemeId());
    setMounted(true);
  }, []);

  const theme = themeById(themeId);
  const nextId = toggleThemeMode(themeId);

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(nextId);
        setThemeId(nextId);
      }}
      aria-label={mounted ? `Switch to ${themeById(nextId).name}` : "Switch colour theme"}
      className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-300 hover:text-electric-text focus:outline-none ${className ?? ""}`}
    >
      {theme.mode === "light" ? (
        <Moon className="h-5 w-5" aria-hidden />
      ) : (
        <Sun className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}