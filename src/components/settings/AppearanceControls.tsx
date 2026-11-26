"use client";

import { useEffect, useState } from "react";
import LiteModeToggle from "@/components/chrome/LiteModeToggle";
import ThemeSelector from "@/components/settings/ThemeSelector";

/**
 * Appearance controls. Persistent, device-local and description-free: theme,
 * solid background, reduced motion, Lite Mode.
 */
export default function AppearanceControls({ premium }: { premium: boolean }) {
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
    <div className="space-y-4">
      <section aria-labelledby="theme-settings" className="rounded-2xl border border-line bg-surface/40 p-5">
        <h3 id="theme-settings" className="font-semibold text-slate-100">Theme</h3>
        <div className="mt-4">
          <ThemeSelector premium={premium} />
        </div>
      </section>

      <Switch
        label="Solid background"
        checked={solid}
        onChange={toggleSolid}
      />
      <Switch
        label="Reduce motion"
        checked={reduced}
        onChange={toggleReduced}
      />

      <section aria-labelledby="lite-settings" className="rounded-2xl border border-line bg-surface/40 p-5">
        <h3 id="lite-settings" className="font-semibold text-slate-100">Lite Mode</h3>
        <div className="mt-4">
          <LiteModeToggle />
        </div>
      </section>
    </div>
  );
}

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/40 p-5">
      <h3 className="font-semibold text-slate-100">{label}</h3>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`gn-motion relative h-7 w-12 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          checked ? "border-primary/60 bg-primary/30" : "border-line-strong bg-surface-2"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${checked ? "left-6 bg-primary" : "left-0.5 bg-line-strong"}`}
        />
      </button>
    </div>
  );
}