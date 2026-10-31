import Link from "next/link";
import { Trophy } from "lucide-react";

/**
 * LeagueStatusWidget — where you stand in the Global Ranking.
 *
 * Honest until Phase 7 lands: the ladder opens with Season 3, so the widget
 * shows the tier ladder and the season date rather than inventing a rank.
 * Once Phase 7 ships this reads the member's real tier, stars and group.
 */
const TIERS = ["Initiate", "Scholar", "Adept", "Vanguard", "Luminary", "Paragon"] as const;

export default function LeagueStatusWidget() {
  return (
    <section
      aria-label="Global Ranking status"
      className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6"
    >
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-subtle">Global Ranking</h2>
        </div>
        <p className="mt-4 font-serif text-2xl font-bold text-ink">Season 3 — live now</p>
        <p className="mt-2 text-sm text-muted">
          Groups of 20, pods of 4, one ladder from Initiate to Paragon. Your tier lands with your
          first pod.
        </p>
        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Rank tiers">
          {TIERS.map((tier) => (
            <li
              key={tier}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted"
            >
              {tier}
            </li>
          ))}
        </ol>
      </div>
      <Link
        href="/league"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-gold/60 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Open the League
      </Link>
    </section>
  );
}
