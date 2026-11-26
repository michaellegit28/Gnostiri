"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  MonitorPlay,
  RotateCcw,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { useDomain } from "@/context/DomainContext";
import {
  DEFAULT_LEARNING_DOMAIN,
  LEARNING_DOMAINS,
  domainLabel,
  type LearningDomain,
} from "@/lib/learning-domain";

interface LaneLink {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const LANE_LINKS: Record<LearningDomain, LaneLink[]> = {
  highschool: [
    { href: "/highschool/exams", label: "GSE", Icon: ClipboardList },
    { href: "/highschool/study", label: "Textbook study", Icon: BookOpen },
    { href: "/battle-plan", label: "Battle Plan", Icon: Swords },
    { href: "/cbt", label: "Timed CBT", Icon: MonitorPlay },
  ],
  university: [
    { href: "/university", label: "Courses", Icon: GraduationCap },
    { href: "/battle-plan", label: "Battle Plan", Icon: Swords },
    { href: "/desk", label: "PDF Desk", Icon: FolderOpen },
    { href: "/cbt", label: "Timed CBT", Icon: MonitorPlay },
  ],
};

/**
 * Lane-tabbed dashboard board. Both lane panels are always in the DOM and CSS
 * selects the active one via [data-lane], so there is no server/client identity
 * mismatch; the tab bar is the visible, non-colour-only switcher.
 */
export default function LaneBoard() {
  const { learningDomain } = useDomain();
  const active = learningDomain ?? DEFAULT_LEARNING_DOMAIN;
  const [lane, setLane] = useState<LearningDomain>(active);

  useEffect(() => {
    setLane(active);
  }, [active]);

  return (
    <section aria-labelledby="lane-board-title" data-lane={lane}>
      <div className="flex items-center justify-between gap-4">
        <h2 id="lane-board-title" className="font-serif text-xl font-bold text-ink">
          Continue
        </h2>
        <div role="tablist" aria-label="Learning lane" className="flex gap-1 rounded-xl border border-line bg-surface/50 p-1">
          {LEARNING_DOMAINS.map((domain) => {
            const selected = domain === lane;
            return (
              <button
                key={domain}
                type="button"
                aria-pressed={selected}
                onClick={() => setLane(domain)}
                className={`gn-motion min-h-[36px] rounded-lg px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selected ? "bg-primary text-on-primary" : "text-muted hover:text-ink"
                }`}
              >
                {domainLabel(domain)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {LEARNING_DOMAINS.map((domain) => (
          <div key={domain} className={`lane-${domain} mt-5`}>
            <ul className="gn-stagger grid grid-cols-2 gap-3 sm:grid-cols-4">
              {LANE_LINKS[domain].map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="gn-card gn-lift group flex min-h-[104px] flex-col justify-between rounded-2xl p-4 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg text-electric-text">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="mt-3 font-serif text-base font-bold text-ink group-hover:text-electric-text">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}