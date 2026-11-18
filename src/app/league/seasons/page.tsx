import Link from "next/link";
import { CalendarDays, FileBadge, History, Trophy } from "lucide-react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { tierInfo } from "@/lib/ranking";

export const dynamic = "force-dynamic";

type HallRecord = {
  id: string;
  tier: number;
  groupName: string;
};

type SeasonRecord = {
  slug: string;
  name: string;
  status: string;
  startsAt: Date;
  endsAt: Date;
  hall: HallRecord[];
};

function groupKey(seasonSlug: string, tier: number, groupName: string) {
  return `${seasonSlug}:${tier}:${groupName}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function lifecycle(season: SeasonRecord, now: number) {
  if (season.status === "closed") return "Closed";
  if (season.status !== "active") return "Status unavailable";
  if (season.hall.length > 0) return "Finalization pending";
  if (now < season.startsAt.getTime()) return "Scheduled";
  if (now > season.endsAt.getTime()) return "Finalization pending";
  return "Open";
}

function lifecycleStyle(label: string) {
  if (label === "Open") return "border-success/40 bg-success/10 text-emerald-200";
  if (label === "Closed") return "border-line-strong bg-surface-2 text-muted";
  if (label === "Finalization pending") return "border-warning/40 bg-warning/10 text-amber-200";
  return "border-line-strong bg-surface-2 text-muted";
}

export default async function SeasonsPage() {
  const user = await getCurrentUser();
  const now = Date.now();
  const [seasons, memberships] = await Promise.all([
    prisma.season.findMany({
      orderBy: [{ startsAt: "desc" }, { slug: "desc" }],
      select: {
        slug: true,
        name: true,
        status: true,
        startsAt: true,
        endsAt: true,
        hall: {
          orderBy: [{ tier: "asc" }, { rank: "asc" }],
          select: {
            id: true,
            tier: true,
            groupName: true,
          },
        },
      },
    }),
    user
      ? prisma.leagueGroupMember.findMany({
          where: { userId: user.id },
          select: { group: { select: { seasonSlug: true, tier: true, name: true } } },
        })
      : null,
  ]);

  const myGroupKeys = new Set(
    (memberships ?? []).map(({ group }) => groupKey(group.seasonSlug, group.tier, group.name))
  );
  const openSeasons = seasons.filter((season) => season.status === "active");
  const closedSeasons = seasons.filter((season) => season.status === "closed");
  const otherSeasons = seasons.filter(
    (season) => season.status !== "active" && season.status !== "closed"
  );

  const renderSeason = (season: SeasonRecord) => {
    const state = lifecycle(season, now);
    const ownsCertificate = (entry: HallRecord) =>
      myGroupKeys.has(groupKey(season.slug, entry.tier, entry.groupName));
    const ownedEntries = season.hall.filter(ownsCertificate);
    const recordedTiers = new Set(season.hall.map((entry) => entry.tier)).size;
    return (
      <article key={season.slug} className="gn-card rounded-2xl border border-line bg-surface p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-ink">{season.name}</h3>
            <p className="mt-1 text-xs text-muted">{season.slug}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${lifecycleStyle(state)}`}>
            {state}
          </span>
        </div>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-bg p-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">Window opens</dt>
            <dd className="mt-1 font-semibold text-ink">
              <time dateTime={season.startsAt.toISOString()}>{formatDate(season.startsAt)}</time>
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-bg p-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">Window ends</dt>
            <dd className="mt-1 font-semibold text-ink">
              <time dateTime={season.endsAt.toISOString()}>{formatDate(season.endsAt)}</time>
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-bg p-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-muted">Recorded placements</dt>
            <dd className="mt-1 font-semibold text-ink">{season.hall.length}</dd>
          </div>
        </dl>

        {season.hall.length === 0 ? (
          <p className="mt-5 rounded-xl border border-line bg-bg px-4 py-3 text-sm text-muted">
            {season.status === "closed"
              ? "No final placements are recorded for this season."
              : "Final placements appear after the season is closed."}
          </p>
        ) : (
          <section aria-labelledby={`finals-${season.slug}`} className="mt-6">
            <h4 id={`finals-${season.slug}`} className="text-sm font-semibold text-ink">
              Final placement summary
            </h4>
            <p className="mt-2 text-sm text-muted">
              {season.hall.length} recorded placement{season.hall.length === 1 ? "" : "s"} across {recordedTiers}{" "}
              tier{recordedTiers === 1 ? "" : "s"}.
            </p>
            {user && ownedEntries.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {ownedEntries.map((entry) => (
                  <a
                    key={entry.id}
                    href={`/api/ranking/certificate?season=${encodeURIComponent(season.slug)}&tier=${entry.tier}&member=${encodeURIComponent(user.id)}`}
                    aria-label={`Download your ${season.name} (${season.slug}) ${tierInfo(entry.tier).label} certificate`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gold/40 px-4 text-sm font-semibold text-gold-text transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <FileBadge className="h-4 w-4" aria-hidden />
                    Your {tierInfo(entry.tier).label} certificate
                  </a>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {season.hall.length > 0 ? (
          <Link
            href={`/league/hall-of-fame#season-${season.slug}`}
            aria-label={`View the full Hall of Fame for ${season.name} (${season.slug})`}
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-electric-text transition-colors hover:text-electric focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Trophy className="h-4 w-4" aria-hidden />
            View the full Hall of Fame
          </Link>
        ) : null}
      </article>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-text">Global Ranking</p>
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">Season archive</h1>
        <p className="max-w-3xl text-sm text-muted">
          Every recorded ranking window and its final placements. This page reads the season record as it
          stands; it never invents a winner or changes a season state.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/league/ladder"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Trophy className="h-4 w-4" aria-hidden />
            Open the ladder
          </Link>
          <Link
            href="/league/hall-of-fame"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line-strong px-5 text-sm font-semibold text-muted transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <History className="h-4 w-4" aria-hidden />
            Hall of Fame
          </Link>
          {user ? (
            <Link
              href="/certificates"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line-strong px-5 text-sm font-semibold text-muted transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FileBadge className="h-4 w-4" aria-hidden />
              My certificates
            </Link>
          ) : null}
        </div>
      </header>

      {seasons.length === 0 ? (
        <section className="gn-card rounded-2xl border border-line bg-surface px-6 py-12 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-electric-text" aria-hidden />
          <h2 className="mt-4 font-serif text-xl font-bold text-ink">No ranking season is recorded yet</h2>
          <p className="mt-2 text-sm text-muted">
            The first season appears here when the ranking ladder records it.
          </p>
        </section>
      ) : (
        <>
          <section aria-labelledby="open-seasons" className="space-y-4">
            <div>
              <h2 id="open-seasons" className="font-serif text-2xl font-bold text-ink">
                Current and recent seasons
              </h2>
              <p className="mt-1 text-sm text-muted">Scheduled, open, and seasons awaiting finalization.</p>
            </div>
            {openSeasons.length === 0 ? (
              <p className="rounded-xl border border-line bg-surface px-5 py-4 text-sm text-muted">
                No active season is recorded.
              </p>
            ) : (
              <div className="space-y-4">{openSeasons.map(renderSeason)}</div>
            )}
          </section>

          <section aria-labelledby="completed-seasons" className="space-y-4">
            <div>
              <h2 id="completed-seasons" className="font-serif text-2xl font-bold text-ink">
                Completed seasons
              </h2>
              <p className="mt-1 text-sm text-muted">Closed windows and the final placements recorded at close.</p>
            </div>
            {closedSeasons.length === 0 ? (
              <p className="rounded-xl border border-line bg-surface px-5 py-4 text-sm text-muted">
                No completed season yet.
              </p>
            ) : (
              <div className="space-y-4">{closedSeasons.map(renderSeason)}</div>
            )}
          </section>

          {otherSeasons.length > 0 ? (
            <section aria-labelledby="other-seasons" className="space-y-4">
              <div>
                <h2 id="other-seasons" className="font-serif text-2xl font-bold text-ink">
                  Other recorded seasons
                </h2>
                <p className="mt-1 text-sm text-muted">Rows whose lifecycle state is not recognized.</p>
              </div>
              <div className="space-y-4">{otherSeasons.map(renderSeason)}</div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
