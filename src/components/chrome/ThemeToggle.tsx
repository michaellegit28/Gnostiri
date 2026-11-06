"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { BRAND_CREAM, BRAND_NAVY } from "@/components/brand/Logo";

/**
 * ThemeToggle — dark (default) ⇄ light. The choice is device-local
 * (localStorage "gnostiri.theme") and applied pre-paint by the layout script,
 * so there is no flash. <meta name="theme-color"> follows the theme so the
 * PWA chrome matches. First visit follows the operating system.
 *
 * The meta tag needs a literal colour, so it comes from the documented brand
 * constants (the same source the mark and the win card draw from).
 */

const DARK = BRAND_NAVY;
const LIGHT = BRAND_CREAM;

function currentTheme(): "dark" | "light" {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

function apply(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("gnostiri.theme", theme);
  } catch {
    /* private mode — the theme simply doesn't persist */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? LIGHT : DARK);
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        apply(next);
        setTheme(next);
      }}
      aria-label={mounted ? `Switch to ${next} mode` : "Switch colour theme"}
      className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-300 hover:text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className ?? ""}`}
    >
      {mounted && theme === "light" ? (
        <Moon className="h-5 w-5" aria-hidden />
      ) : (
        <Sun className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
