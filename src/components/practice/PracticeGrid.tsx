"use client";

import Link from "next/link";
import { useDomain } from "@/context/DomainContext";
import { DEFAULT_LEARNING_DOMAIN, isVisibleForAudience } from "@/lib/learning-domain";
import { GSE } from "@/lib/exam-brand";
import { PRACTICE_CARDS, type PracticeCardSpec } from "@/components/practice/practice-cards";

/**
 * Practice hub, filtered to the student's lane by the card's own audience.
 * The page pre-scopes the payload server-side; this second client filter
 * re-applies after a lane switch without a reload.
 */
export default function PracticeGrid({ cards = PRACTICE_CARDS }: { cards?: PracticeCardSpec[] }) {
  const { learningDomain } = useDomain();
  const domain = learningDomain ?? DEFAULT_LEARNING_DOMAIN;
  const visibleCards = cards.filter((card) => isVisibleForAudience(card.audience, domain));
  const primary = visibleCards[0] ?? cards[0];

  return (
    <>
      <Link
        href={primary.href}
        className="gn-motion mt-7 inline-flex min-h-[48px] items-center rounded-xl bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {domain === "university" ? "Open a course exam hall" : `Open ${GSE}`}
      </Link>

      <section aria-labelledby="practice-destinations" className="mt-12">
        <h2 id="practice-destinations" className="font-serif text-2xl font-bold tracking-tight text-ink">
          Practice modes
        </h2>
        <div className="gn-stagger mt-6 grid gap-4 sm:grid-cols-2">
          {visibleCards.map(({ href, title, Icon }) => (
            <Link
              key={href}
              href={href}
              className="gn-card gn-lift group rounded-2xl p-6 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-bg text-electric-text">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-serif text-xl font-bold text-ink group-hover:text-electric-text">{title}</h3>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Change lane in <Link href="/settings#learning-domain-settings" className="text-electric-text hover:underline">settings</Link>.
        </p>
      </section>
    </>
  );
}