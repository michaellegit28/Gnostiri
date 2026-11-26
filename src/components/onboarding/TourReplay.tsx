"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { FEATURE_TOUR_OPEN_EVENT } from "@/lib/feature-tour";

/**
 * Replay the first-sign-in tour from Settings. The copy lives only in the tour;
 * this is a single labelled control that asks the mounted FeatureTour to open.
 */
export default function TourReplay() {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setPressed(true);
        window.setTimeout(() => setPressed(false), 900);
        window.dispatchEvent(new Event(FEATURE_TOUR_OPEN_EVENT));
      }}
      className="gn-motion inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-surface/40 px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <RotateCcw className="h-4 w-4" aria-hidden />
      {pressed ? "Opening…" : "Replay the tour"}
    </button>
  );
}