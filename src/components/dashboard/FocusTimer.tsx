"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

const OPTIONS = [25, 50, 90] as const;

function clock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FocusTimer() {
  const [minutes, setMinutes] = useState<(typeof OPTIONS)[number]>(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const endAtRef = useRef<number | null>(null);
  const totalSeconds = minutes * 60;
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - progress);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const endAt = endAtRef.current;
      if (endAt === null) {
        setRunning(false);
        return;
      }
      const next = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      if (next === 0) {
        setRemaining(0);
        setRunning(false);
        setPaused(false);
        endAtRef.current = null;
        setAnnouncement("Focus session complete.");
      } else {
        setRemaining(next);
      }
    };
    tick();
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [running]);

  function chooseDuration(nextMinutes: (typeof OPTIONS)[number]) {
    if (nextMinutes === minutes) return;
    setMinutes(nextMinutes);
    setRemaining(nextMinutes * 60);
    setRunning(false);
    setPaused(false);
    endAtRef.current = null;
    setAnnouncement(`${nextMinutes}-minute focus session ready.`);
  }

  function toggleTimer() {
    if (running) {
      const endAt = endAtRef.current;
      const left = endAt === null ? remaining : Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      setRunning(false);
      setPaused(true);
      endAtRef.current = null;
      setAnnouncement("Focus timer paused.");
      return;
    }
    const seconds = remaining > 0 ? remaining : totalSeconds;
    setRemaining(seconds);
    endAtRef.current = Date.now() + seconds * 1000;
    setRunning(true);
    setPaused(false);
    setAnnouncement(paused ? "Focus timer resumed." : "Focus timer started.");
  }

  function resetTimer() {
    setRunning(false);
    setPaused(false);
    endAtRef.current = null;
    setRemaining(totalSeconds);
    setAnnouncement("Focus timer reset.");
  }

  return (
    <section
      aria-labelledby="focus-timer-title"
      className="gn-card flex h-full flex-col rounded-2xl border border-line bg-surface p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-electric-text">
            Study focus
          </p>
          <h2 id="focus-timer-title" className="mt-1 font-serif text-xl font-bold text-ink">
            Focus timer
          </h2>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-electric-text">
          <Timer className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <div
        role="group"
        aria-label="Focus duration"
        className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-line bg-bg p-1"
      >
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={minutes === option}
            disabled={running}
            onClick={() => chooseDuration(option)}
            className={`min-h-[44px] rounded-lg px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 ${
              minutes === option
                ? "bg-primary text-on-primary"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {option} min
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-6 h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgb(var(--border-strong))"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgb(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            className="motion-safe:transition-all motion-safe:duration-500"
          />
        </svg>
        <div
          role="timer"
          aria-live="off"
          aria-label={`${clock(remaining)} remaining`}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="font-mono text-4xl font-bold tabular-nums text-ink">{clock(remaining)}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {running ? "Focusing" : paused ? "Paused" : remaining === 0 ? "Complete" : "Ready"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={toggleTimer}
          className="gn-motion inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
        >
          {running ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          {running ? "Pause" : paused ? "Resume" : remaining === 0 ? "Restart" : "Start focus"}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="gn-motion inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset
        </button>
      </div>

      <p className="mt-4 text-xs text-muted">
        The timer runs on this device. It does not claim study time until you complete a real session.
      </p>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
