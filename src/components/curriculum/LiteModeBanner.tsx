"use client";

import { useEffect, useState } from "react";

const TARGET_ISOS = ["NG", "GH", "KE", "PK"];

/** Lite-mode banner for NG/GH/KE/PK + slow connections (?lite=1 text-only fallback). */
export default function LiteModeBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("lite") === "1") {
      document.documentElement.classList.add("lite");
      return;
    }
    let targetRegion = false;
    try {
      const raw = localStorage.getItem("gnostiri-alignment-profile");
      // regions store id; also check saved country iso via /api/auth/country lazily
      if (raw && TARGET_ISOS.some((iso) => raw.includes(iso))) targetRegion = true;
    } catch { /* ignore */ }
    const conn = (navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    const slow = conn && (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.saveData);
    if (slow || targetRegion) setShow(true);
    if (slow) document.documentElement.classList.add("lite-suggest");
  }, []);
  if (!show) return null;
  return (
    <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-center justify-between gap-3">
      <span>Slow connection or low-bandwidth region detected — switch to Lite Mode for text-only reading.</span>
      <a href="?lite=1" className="shrink-0 rounded bg-amber-500 px-3 py-1 font-semibold text-slate-950">Lite Mode</a>
    </div>
  );
}
