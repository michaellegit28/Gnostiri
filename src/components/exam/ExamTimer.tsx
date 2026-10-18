"use client";

// ExamTimer — pure countdown display for the practice runner section header.
// Parent owns ticking; this only renders. Slate → amber (≤ warnAt) → rose (up).

type ExamTimerProps = {
  secondsLeft: number;
  warnAtSeconds?: number;
  label?: string;
};

function formatClock(totalSeconds: number): string {
  const m = Math.max(0, Math.floor(totalSeconds / 60));
  const s = Math.max(0, totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamTimer({
  secondsLeft,
  warnAtSeconds = 300,
  label = "Time remaining",
}: ExamTimerProps) {
  const timeUp = secondsLeft <= 0;
  const warn = !timeUp && secondsLeft <= warnAtSeconds;
  return (
    <div
      role="timer"
      aria-label={label}
      aria-live="off"
      className={`inline-flex min-h-[48px] items-center rounded-xl border px-5 py-2 font-mono text-2xl font-bold tabular-nums ${
        timeUp
          ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
          : warn
            ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
            : "border-slate-700 bg-slate-950 text-slate-100"
      }`}
    >
      {timeUp ? "Time's up" : formatClock(secondsLeft)}
    </div>
  );
}
