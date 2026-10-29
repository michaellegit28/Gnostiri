"use client";

import { useEffect, useState } from "react";

/**
 * Countdown — a live clock to a fixed instant, rendered "2d 4h 12m".
 * The target is an ISO string computed by the server component that renders
 * this, so the anchor is the server's date, not the browser's.
 */
export default function Countdown({ to, prefix }: { to: string; prefix?: string }) {
  // Only days/hours/minutes are shown, so a 30s tick is plenty and cheap.
  const TICK_MS = 30_000;
  const [label, setLabel] = useState(() => format(to, Date.now()));

  useEffect(() => {
    const update = () => setLabel(format(to, Date.now()));
    update();
    const timer = setInterval(update, TICK_MS);
    return () => clearInterval(timer);
  }, [to]);

  return (
    <span className="inline-flex items-baseline gap-2">
      {prefix && <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{prefix}</span>}
      <span className="font-serif text-lg font-bold tabular-nums text-slate-100">{label}</span>
    </span>
  );
}

/** "2d 4h 12m" — zero units dropped, minutes always shown, "now" once past. */
export function format(targetIso: string, nowMs: number): string {
  const target = Date.parse(targetIso);
  if (Number.isNaN(target)) return "";
  const ms = target - nowMs;
  if (ms <= 0) return "now";
  const minutes = Math.floor(ms / 60_000);
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${mins}m`);
  return parts.join(" ");
}
