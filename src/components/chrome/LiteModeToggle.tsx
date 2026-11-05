"use client";

import { useEffect, useState } from "react";

const KEY = "gnostiri-lite";

/** Footer lite-mode toggle — flips `html.lite` (see globals.css) for
 * text-only reading. Persists to localStorage; honours ?lite=1 on load.
 * `html.lite-mode` carries the motion-free half of the same choice. */
export default function LiteModeToggle() {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    try {
      const viaQuery =
        new URLSearchParams(window.location.search).get("lite") === "1";
      const viaStore = localStorage.getItem(KEY) === "1";
      const on = viaQuery || viaStore;
      setLite(on);
      document.documentElement.classList.toggle("lite", on);
      document.documentElement.classList.toggle("lite-mode", on);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = () => {
    const next = !lite;
    setLite(next);
    document.documentElement.classList.toggle("lite", next);
    document.documentElement.classList.toggle("lite-mode", next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      aria-pressed={lite}
      onClick={toggle}
      className="inline-flex min-h-[44px] items-center rounded-lg border border-border/10 px-4 py-2 text-sm font-semibold text-slate-400 transition-colors hover:border-gold/60 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {lite ? "Lite Mode: On" : "Lite Mode: Off"}
    </button>
  );
}
