"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { currentThemeId, applyTheme } from "@/lib/theme-client";
import { THEMES, themeById, type ThemeId } from "@/lib/themes";

/**
 * Theme catalogue selector. Premium themes are visible to everyone but only
 * selectable by Prime members; free themes always work.
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

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {THEMES.map((theme) => {
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
  );
}