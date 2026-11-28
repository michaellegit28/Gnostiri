"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A collapsible menu section (dropdown). Collapsed by default so the menu stays
 * uncrowded; opens to reveal its links.
 */
export default function MenuAccordion({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="gn-motion flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2 text-sm font-semibold text-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {label}
        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && <ul className="mt-1 space-y-0.5 pl-2">{children}</ul>}
    </div>
  );
}