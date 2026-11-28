"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, GraduationCap, School } from "lucide-react";
import { useDomain } from "@/context/DomainContext";
import {
  DEFAULT_LEARNING_DOMAIN,
  LEARNING_DOMAINS,
  domainLabel,
  type LearningDomain,
} from "@/lib/learning-domain";

const ICONS: Record<LearningDomain, typeof GraduationCap> = {
  highschool: School,
  university: GraduationCap,
};

/**
 * The Study hub's lane switch. Picking a lane persists it (context + cookie +
 * profile for signed-in users, via DomainContext) and then refreshes the
 * server-rendered hub, so the payload itself is re-scoped to the new lane —
 * the hub never ships the other lane's cards to strip client-side.
 */
export default function StudyLaneSwitch() {
  const { learningDomain, setLearningDomain } = useDomain();
  const router = useRouter();
  const active = learningDomain ?? DEFAULT_LEARNING_DOMAIN;
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const Icon = ICONS[active];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="gn-motion flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-surface/50 px-3 text-sm font-semibold text-ink transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon className="h-4 w-4" aria-hidden />
        <span>{domainLabel(active)}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Choose your learning lane"
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 overflow-hidden rounded-lg border border-line bg-bg py-1 shadow-2xl"
        >
          {LEARNING_DOMAINS.map((domain) => {
            const OptIcon = ICONS[domain];
            const selected = domain === active;
            return (
              <li key={domain}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={switching}
                  onClick={() => {
                    setLearningDomain(domain);
                    setOpen(false);
                    setSwitching(true);
                    router.refresh();
                  }}
                  className={`flex min-h-[44px] w-full items-center gap-2 px-3 text-sm font-semibold transition-colors hover:bg-surface/10 hover:text-ink focus:outline-none ${
                    selected ? "text-primary" : "text-slate-300"
                  }`}
                >
                  <OptIcon className="h-4 w-4" aria-hidden />
                  {domainLabel(domain)}
                  {selected && <span className="ml-auto text-xs text-primary">Current</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}