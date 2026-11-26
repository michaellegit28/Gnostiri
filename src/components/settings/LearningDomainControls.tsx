"use client";

import { useState } from "react";
import { GraduationCap, School } from "lucide-react";
import { useDomain } from "@/context/DomainContext";
import { DEFAULT_LEARNING_DOMAIN, domainLabel, LEARNING_DOMAINS, type LearningDomain } from "@/lib/learning-domain";

const ICONS: Record<LearningDomain, typeof GraduationCap> = {
  highschool: School,
  university: GraduationCap,
};

/**
 * Learning-lane switcher. This is deliberately an explicit choice, not a
 * hidden setting: a student who is in the wrong lane needs one obvious control
 * to fix it, and the choice is what the whole navigation is filtered by.
 *
 * Signed-in students save to their profile (GET/PUT /api/learning-domain).
 * Signed-out students keep the choice on this device.
 */
export default function LearningDomainControls() {
  const { learningDomain, domainReady, setLearningDomain } = useDomain();
  const [saving, setSaving] = useState(false);
  const active = learningDomain ?? DEFAULT_LEARNING_DOMAIN;

  const choose = (domain: LearningDomain) => {
    if (domain === active) return;
    setSaving(true);
    setLearningDomain(domain);
    setSaving(false);
  };

  return (
    <section aria-labelledby="learning-domain" className="gn-card rounded-2xl p-5">
      <h2 id="learning-domain" className="font-serif text-xl font-bold text-ink">
        Your learning lane
      </h2>
      <p className="mt-1 text-sm text-muted">
        Gnostiri is split by lane so you only see the content and features you study for. Discovery stays open to
        both. You can change this at any time.
      </p>

      <div role="group" aria-labelledby="learning-domain" className="gn-stagger mt-4 grid gap-3 sm:grid-cols-2">
        {LEARNING_DOMAINS.map((domain) => {
          const Icon = ICONS[domain];
          const selected = domain === active;
          return (
            <button
              key={domain}
              type="button"
              onClick={() => choose(domain)}
              aria-pressed={selected}
              disabled={!domainReady || saving}
              className={`gn-motion flex min-h-[44px] items-center gap-3 rounded-xl border px-4 py-3 text-left font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selected
                  ? "border-primary/60 bg-primary/10 text-ink"
                  : "border-line bg-surface/50 text-muted hover:border-primary/50 hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {domainLabel(domain)}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-muted" aria-live="polite">
        Currently showing {domainLabel(active)}.
      </p>
    </section>
  );
}