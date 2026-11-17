import Link from "next/link";
import { Trophy } from "lucide-react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { tierFor } from "@/lib/ranking";

const TIERS = ["Initiate", "Scholar", "Adept", "Vanguard", "Luminary", "Paragon"] as const;

export default async function LeagueStatusWidget() {
  let season: { name: string; status: string } | null = null;
  let rank: { stars: number } | null = null;

  try {
    const user = await getCurrentUser();
    if (user) {
      const [seasonRow, rankRow] = await Promise.all([
        prisma.season.findFirst({
          where: { status: "active" },
          orderBy: { startsAt: "desc" },
          select: { name: true, status: true },
        }),
        prisma.rankState.findUnique({
          where: { userId: user.id },
          select: { stars: true },
        }),
      ]);
      season = seasonRow;
      rank = rankRow;
    }
  } catch {
    season = null;
    rank = null;
  }

  const currentTier = rank ? tierFor(rank.stars) : null;
  const tierLabel = currentTier ? TIERS[Math.max(0, Math.min(TIERS.length - 1, currentTier - 1))] : null;

  return (
    <section
      aria-label="Global Ranking status"
      className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6"
    >
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-gold" aria-hidden />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Global Ranking</h2>
        </div>
        <p className="mt-4 font-serif text-2xl font-bold text-ink">
          {season ? `${season.name} · ${season.status}` : "No ranking season is open"}
        </p>
        <p className="mt-2 text-sm text-muted">
          {rank
            ? `${tierLabel} · ${rank.stars.toLocaleString()} stars · your group decides every pod.`
            : "Groups of 20, pods of 4, one ladder from Initiate to Paragon. Your tier starts with your first pod."}
        </p>
        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Rank tiers">
          {TIERS.map((tier, index) => (
            <li
              key={tier}
              aria-current={currentTier === index + 1 ? "step" : undefined}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                currentTier === index + 1
                  ? "border-gold/50 bg-gold/10 text-gold-text"
                  : "border-line text-muted"
              }`}
            >
              {tier}
            </li>
          ))}
        </ol>
      </div>
      <Link
        href="/league/ladder"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-gold/60 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Open the ladder
      </Link>
    </section>
  );
}
