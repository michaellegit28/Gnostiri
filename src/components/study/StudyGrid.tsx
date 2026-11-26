"use client";

import Link from "next/link";
import { BookOpen, Compass, FolderOpen, GraduationCap } from "lucide-react";
import { useDomain } from "@/context/DomainContext";
import { DEFAULT_LEARNING_DOMAIN, isVisibleForLearningDomain, type NavAudience } from "@/lib/learning-domain";

/**
 * Study hub — the cards for one learning lane plus the shared work surfaces.
 * Counts come from the database (never hard-coded) so the page can't lie.
 * A university student never receives the high-school card, and vice versa;
 * discovery and the desk are shared by design.
 */

interface StudyCardSpec {
  href: string;
  label: string;
  icon: "BookOpen" | "GraduationCap" | "Compass" | "FolderOpen";
  line: string;
  count: string;
  audience: NavAudience;
}

export default function StudyGrid({ cards }: { cards: StudyCardSpec[] }) {
  const { learningDomain } = useDomain();
  const domain = learningDomain ?? DEFAULT_LEARNING_DOMAIN;
  const visibleCards = cards.filter((card) => isVisibleForLearningDomain(card.href, domain));

  return (
    <div className="gn-stagger grid gap-4 sm:grid-cols-2">
      {visibleCards.map((card) => {
        const ICONS = { BookOpen, GraduationCap, Compass, FolderOpen } as const;
        const Icon = ICONS[card.icon];
        return (
          <Link
            key={card.href}
            href={card.href}
            className="gn-card gn-motion gn-lift gn-shadow group flex min-h-[132px] flex-col justify-between rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[var(--shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-bg text-electric-text">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-subtle transition-colors group-hover:text-electric-text" aria-hidden>
                →
              </span>
            </div>
            <div className="mt-5">
              <h2 className="font-serif text-xl font-bold text-ink">{card.label}</h2>
              <p className="mt-1 text-sm text-muted">{card.line}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{card.count}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}