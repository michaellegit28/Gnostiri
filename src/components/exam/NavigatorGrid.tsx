"use client";

import { Flag } from "lucide-react";

// NavigatorGrid — question navigator 1..N for the practice runner.
// States never color-alone: every cell's aria-label carries its state text.

type NavigatorGridProps = {
  total: number;
  current: number; // 0-based index
  answered: boolean[];
  flagged: boolean[];
  onSelect: (index: number) => void;
};

function cellTone(isCurrent: boolean, isAnswered: boolean, isFlagged: boolean): string {
  // Token palette only — sky-* was a fixed Tailwind colour (theme-unaware and
  // off-palette); the primary/electric pair is the app's action identity.
  if (isCurrent) return "border-primary bg-primary/10 text-electric-text";
  if (isFlagged) return "border-gold/60 bg-gold/15 text-gold-text";
  if (isAnswered) return "border-emerald-500/60 bg-emerald-500/15 text-emerald-300";
  return "border-line bg-surface text-ink hover:border-slate-500";
}

export default function NavigatorGrid({
  total,
  current,
  answered,
  flagged,
  onSelect,
}: NavigatorGridProps) {
  return (
    <div role="group" aria-label="Question navigator" className="grid grid-cols-5 gap-2">
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === current;
        const state = [
          isCurrent ? "current" : null,
          flagged[i] ? "flagged" : null,
          answered[i] ? "answered" : "unanswered",
        ]
          .filter(Boolean)
          .join(", ");
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Question ${i + 1}: ${state}`}
            aria-current={isCurrent ? "true" : undefined}
            className={`flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cellTone(isCurrent, answered[i] === true, flagged[i] === true)}`}
          >
            {i + 1}
            {flagged[i] === true && (
              <Flag aria-hidden="true" className="ml-0.5 h-3 w-3" />
            )}
          </button>
        );
      })}
    </div>
  );
}
