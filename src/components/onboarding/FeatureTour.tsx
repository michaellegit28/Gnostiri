"use client";

import { useEffect, useRef, useState } from "react";
import useDialogFocus from "@/components/ui/useDialogFocus";
import {
  FEATURE_TOUR_OPEN_EVENT,
  FEATURE_TOUR_SLIDES,
  FEATURE_TOUR_STORAGE_KEY,
} from "@/lib/feature-tour";

/**
 * Feature tour — the only explanation surface in the app. Shown once after
 * sign-in, replayable from Settings, never rendered into page chrome.
 */
export default function FeatureTour() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useDialogFocus<HTMLDivElement>(open);

  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(FEATURE_TOUR_STORAGE_KEY) === "true";
    } catch {
      seen = true;
    }
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    function replay() {
      setIndex(0);
      setOpen(true);
    }
    window.addEventListener(FEATURE_TOUR_OPEN_EVENT, replay);
    return () => window.removeEventListener(FEATURE_TOUR_OPEN_EVENT, replay);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    try {
      localStorage.setItem(FEATURE_TOUR_STORAGE_KEY, "true");
    } catch {
      // private mode — the tour can replay from settings later
    }
    setOpen(false);
  }

  if (!open) return null;

  const slide = FEATURE_TOUR_SLIDES[index];
  const last = index === FEATURE_TOUR_SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-bg/80 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="feature-tour-title">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="gn-glass w-full max-w-lg rounded-2xl border border-line p-6 shadow-2xl"
      >
        <h2 id="feature-tour-title" className="font-serif text-2xl font-bold text-ink">{slide.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{slide.body}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xs text-muted" aria-live="polite">
            {index + 1} / {FEATURE_TOUR_SLIDES.length}
          </p>
          <div className="flex gap-2">
            {index > 0 ? (
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="gn-motion inline-flex min-h-[44px] items-center rounded-xl border border-line px-4 text-sm font-semibold text-muted hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Back
              </button>
            ) : null}
            {last ? (
              <button
                type="button"
                onClick={dismiss}
                className="gn-motion inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Done
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(FEATURE_TOUR_SLIDES.length - 1, i + 1))}
                className="gn-motion inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}