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
        className="fixed bottom-5 right-5 z-[60] flex min-h-[48px] min-w-[48px] items-center justify-center gap-2.5 rounded-full border border-[#D4AF37]/60 bg-slate-950/90 p-3 shadow-lg shadow-black/50 backdrop-blur-md hover:border-[#D4AF37] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] sm:pl-3 sm:pr-5 sm:py-2.5"
      >
        <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/60" />
          <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-bold text-slate-100">
            AI Tutor
          </span>
          <span className="block text-sm text-slate-400">
            {open ? "Close" : "Ask anything"}
          </span>
        </span>
      </button>
      {open && <TutorPanel onClose={() => setOpen(false)} />}
    </>
  );
}
