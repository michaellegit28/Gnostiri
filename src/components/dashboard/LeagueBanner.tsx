import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight, CalendarRange, Trophy } from "lucide-react";
import { CURRENT_SEASON, SEASONS } from "@/lib/competition";

async function countLivePublicCups(): Promise<number | null> {
  try {
    const now = new Date();
    return await prisma.competition.count({
      where: {
        visibility: "public",
        status: { not: "cancelled" },
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
    });
  } catch {
    return null;
  }
}

export default async function LeagueBanner() {
  const season = SEASONS.find((s) => s.slug === CURRENT_SEASON) ?? SEASONS[SEASONS.length - 1];
  const liveCups = await countLivePublicCups();
  const live = liveCups !== null && liveCups > 0;

  return (
    <section aria-label="Merit League" className="space-y-5">
      <Link
        href="/league"
        className="group flex flex-col gap-5 rounded-2xl border border-gold/30 bg-gradient-to-r from-[#2a230f] via-slate-900 to-slate-950 p-6 transition-colors hover:border-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:flex-row md:items-center md:justify-between md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-xl border border-gold/30 bg-gold/10 p-3">
            <Trophy className="h-6 w-6 text-gold" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Merit League
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100">
              {live
                ? `${liveCups} public cup${liveCups === 1 ? "" : "s"} live right now`
                : `Cups open soon — ${season.label} is live`}
            </h2>
            <p className="mt-2 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarRange className="h-4 w-4 text-gold" aria-hidden />
                {season.window}
              </span>
              {live && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
                  />
                  Live
                </span>
              )}
            </p>
          </div>
        </div>
        <span className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-slate-950 transition-colors group-hover:bg-gold-hover">
          Open the League
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </Link>
    </section>
  );
}
