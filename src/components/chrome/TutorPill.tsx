"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * TutorPill — the AI Tutor is one tap away, everywhere except where it
 * would cover task bars (tutor itself, study and quiz readers).
 */
const HIDDEN_PREFIXES = ["/tutor", "/study", "/quiz"];

export default function TutorPill() {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/");
  const tail = segments[segments.length - 1] ?? "";
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) || tail === "study" || tail === "quiz") {
    return null;
  }

  return (
    <Link
      href="/tutor"
      aria-label="Open AI Tutor"
      className="fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-full border border-[#D4AF37]/60 bg-slate-950/90 py-2.5 pl-3 pr-5 shadow-lg shadow-black/50 backdrop-blur-md hover:border-[#D4AF37] transition-colors"
    >
      <span className="relative flex w-7 h-7 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/60" />
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-100">
          AI Tutor
        </span>
        <span className="block text-[10px] text-slate-400">Ask anything</span>
      </span>
    </Link>
  );
}
