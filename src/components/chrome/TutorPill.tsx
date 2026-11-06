"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import TutorPanel from "./TutorPanel";

/**
 * TutorPill — the AI Tutor is one tap away, everywhere except where it
 * would cover task bars (tutor itself, study and quiz readers).
 * Opens the floating companion panel in place.
 */
const HIDDEN_PREFIXES = ["/tutor", "/study", "/quiz"];

export default function TutorPill() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const segments = pathname.split("/");
  const tail = segments[segments.length - 1] ?? "";
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) || tail === "study" || tail === "quiz") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI Tutor"
        aria-expanded={open}
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-[60] flex min-h-[48px] min-w-[48px] lg:bottom-5 items-center justify-center gap-2.5 rounded-full border border-electric/60 bg-surface p-3 shadow-lg shadow-black/20 backdrop-blur-md gn-luminous hover:border-electric transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:pl-3 sm:pr-5 sm:py-2.5"
      >
        <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border border-dashed border-electric/60" />
          <span className="h-2 w-2 rounded-full bg-electric" />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-bold text-slate-100">
            AI Tutor
          </span>
          <span className="block text-sm text-muted">
            {open ? "Close" : "Ask anything"}
          </span>
        </span>
      </button>
      {open && <TutorPanel onClose={() => setOpen(false)} />}
    </>
  );
}
