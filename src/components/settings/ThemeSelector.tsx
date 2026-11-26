"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { currentThemeId, applyTheme } from "@/lib/theme-client";
import { THEMES, themeById, type ThemeId, type ThemeMode } from "@/lib/themes";

/**
 * Theme catalogue selector. The core is a dual light/dark theme; the premium
 * palettes are compiled into two grouped sections (dark variants, light
 * variants). Premium palettes are visible to everyone but only selectable by
 * Prime members; the two core palettes are always free.
 */
export default function ThemeSelector({ premium }: { premium: boolean }) {
  const [active, setActive] = useState<ThemeId>(currentThemeId());

  useEffect(() => {
    setActive(currentThemeId());
  }, []);

  function select(id: ThemeId) {
    const theme = themeById(id);
    if (theme.premium && !premium) return;
    applyTheme(id);
    setActive(id);
  }

  const groups: { mode: ThemeMode; label: string }[] = [
    { mode: "dark", label: "Dark" },
    { mode: "light", label: "Light" },
  ];

  return (
    <div className="space-y-6">
      {groups.map(({ mode, label }) => (
        <section key={mode} aria-labelledby={`theme-group-${mode}`}>
          <h3 id={`theme-group-${mode}`} className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            {label}
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {THEMES.filter((theme) => theme.mode === mode).map((theme) => {
              const locked = theme.premium && !premium;
              const selected = active === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => select(theme.id)}
                  disabled={locked}
                  aria-pressed={selected}
                  aria-label={locked ? `${theme.name} — Prime` : theme.name}
                  className={`gn-motion flex min-h-[44px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selected
                      ? "border-primary/60 bg-primary/10 text-ink"
                      : "border-line bg-surface/50 text-muted hover:border-primary/50 hover:text-ink"
                  } ${locked ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <span>{theme.name}</span>
                  {locked ? <Crown className="h-4 w-4 shrink-0" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}