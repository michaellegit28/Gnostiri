"use client";

import { useEffect, useState } from "react";
import LiteModeToggle from "@/components/chrome/LiteModeToggle";
import ThemeToggle from "@/components/chrome/ThemeToggle";

/**
 * Appearance prefs — the accessibility escape hatches, persisted locally:
 * a solid background (no blur — easier on astigmatism and low-end devices),
 * reduced motion, and text-only Lite Mode. All three are stored on the
 * device; none requires an account.
 */
export default function AppearanceControls() {
  const [solid, setSolid] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setSolid(root.classList.contains("solid-bg"));
    setReduced(root.classList.contains("reduce-motion"));
  }, []);

  function toggleSolid() {
    const next = !solid;
    setSolid(next);
    document.documentElement.classList.toggle("solid-bg", next);
    localStorage.setItem("gnostiri.solid-bg", String(next));
  }

  function toggleReduced() {
    const next = !reduced;
    setReduced(next);
    document.documentElement.classList.toggle("reduce-motion", next);
    localStorage.setItem("gnostiri.reduce-motion", String(next));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <div>
          <h2 className="font-semibold text-slate-100">Colour theme</h2>
          <p className="mt-1 max-w-md text-sm text-slate-400">
            Dark by default. Light mode uses the same refined palette — every surface passes contrast in both.
          </p>
        </div>
        <ThemeToggle />
      </div>
      <Toggle
        label="Solid background"
        note="Replaces the blurred aurora backdrop with a flat dark surface — higher contrast, less eye strain."
        checked={solid}
        onChange={toggleSolid}
      />
      <Toggle
        label="Reduce motion"
        note="Disables card, menu and celebration animations across the app."
        checked={reduced}
        onChange={toggleReduced}
      />
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <h2 className="font-semibold text-slate-100">Text-only Lite Mode</h2>
        <p className="mt-1 text-sm text-slate-400">Hides diagrams and heavy media for slow connections and data-saving.</p>
        <div className="mt-4">
          <LiteModeToggle />
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <div>
        <h2 className="font-semibold text-slate-100">{label}</h2>
        <p className="mt-1 max-w-md text-sm text-slate-400">{note}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative mt-1 h-7 w-12 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
          checked ? "border-gold/60 bg-gold/30" : "border-white/15 bg-white/5"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${checked ? "left-6 bg-gold" : "left-0.5 bg-slate-400"}`}
        />
      </button>
    </div>
  );
}
