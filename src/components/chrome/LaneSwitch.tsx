"use client";

import { GraduationCap, School } from "lucide-react";
import { useDomain } from "@/context/DomainContext";
import {
  DEFAULT_LEARNING_DOMAIN,
  LEARNING_DOMAINS,
  type LearningDomain,
} from "@/lib/learning-domain";

const ICONS: Record<LearningDomain, typeof GraduationCap> = {
  highschool: School,
  university: GraduationCap,
};

/**
 * Compact dual-lane switch for the sidebar/drawer top. The full explained
 * control lives in settings; this is the quick flip and never carries a
 * description.
 */
export default function LaneSwitch() {
  const { learningDomain, setLearningDomain } = useDomain();
  const active = learningDomain ?? DEFAULT_LEARNING_DOMAIN;

  return (
    <div
      role="group"
      aria-label="Learning lane"
      className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface/50 p-1"
    >
      {LEARNING_DOMAINS.map((domain) => {
        const Icon = ICONS[domain];
        const selected = domain === active;
        return (
          <button
            key={domain}
            type="button"
            onClick={() => setLearningDomain(domain)}
            aria-pressed={selected}
            aria-current={selected ? "true" : undefined}
            className={`gn-motion flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              selected ? "bg-primary text-on-primary" : "text-muted hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {domain === "highschool" ? "High School" : "University"}
          </button>
        );
      })}
    </div>
  );
}