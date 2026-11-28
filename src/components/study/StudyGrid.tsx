"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Compass,
  FolderOpen,
  GraduationCap,
  ListChecks,
  MessageCircle,
  MonitorPlay,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useDomain } from "@/context/DomainContext";
import { DEFAULT_LEARNING_DOMAIN, isVisibleForAudience, type NavAudience } from "@/lib/learning-domain";

/**
 * Study hub — the cards for one learning lane plus the shared work surfaces,
 * grouped into labelled sections ("Your lane" vs "Tools") so the grid reads
 * like an app, not a dashboard of identical cards.
 * Counts come from the database (never hard-coded) so the page can't lie.
 * Filtering is by the card's own AUDIENCE, not its URL prefix: /desk is a
 * shared-URL route but a University-only feature (owner directive), so a
 * High School session must never see the PDF Desk card.
 */

export type StudyCardIcon =
  | "BookOpen"
  | "GraduationCap"
  | "Compass"
  | "FolderOpen"
  | "ClipboardList"
  | "MonitorPlay"
  | "Sparkles"
  | "RotateCcw"
  | "ListChecks"
  | "MessageCircle";

export interface StudyCardSpec {
  href: string;
  label: string;
  icon: StudyCardIcon;
  line: string;
  count: string;
  audience: NavAudience;
}

export interface StudySection {
  id: string;
  label: string;
  cards: StudyCardSpec[];
}

const ICONS = {
  BookOpen,
  GraduationCap,
  Compass,
  FolderOpen,
  ClipboardList,
  MonitorPlay,
  Sparkles,
  RotateCcw,
  ListChecks,
  MessageCircle,
} as const;

export default function StudyGrid({ sections }: { sections: StudySection[] }) {
  const { learningDomain } = useDomain();
  const domain = learningDomain ?? DEFAULT_LEARNING_DOMAIN;

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const visibleCards = section.cards.filter((card) => isVisibleForAudience(card.audience, domain));
        if (visibleCards.length === 0) return null;
        return (
          <section key={section.id} aria-labelledby={`study-section-${section.id}`}>
            <h2
              id={`study-section-${section.id}`}
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-subtle"
            >
              {section.label}
            </h2>
            <div className="gn-stagger mt-3 grid gap-4 sm:grid-cols-2">
              {visibleCards.map((card) => {
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
                      <h3 className="font-serif text-xl font-bold text-ink">{card.label}</h3>
                      <p className="mt-1 text-sm text-muted">{card.line}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{card.count}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}