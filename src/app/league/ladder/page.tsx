import Link from "next/link";
import { Clock, Star, Swords, Trophy, Users } from "lucide-react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { MAX_TIER, TIERS, displayHandle, starsForTier, starsToNextTier, tierFor, tierInfo } from "@/lib/ranking";
import { activeSeason, groupLeaderboard } from "@/lib/ranking-pool";
import Countdown from "@/components/league/Countdown";
import JoinQueueButton from "@/components/ranking/JoinQueueButton";

export const dynamic = "force-dynamic";

// The Global Ranking ladder (Phase 7).
//
// One currency (Stars), six tiers, groups of 20 per tier that auto-assign by
// tier when a member joins the queue, and async-simultaneous pods: a shared
// 20-minute window in which 2–4 group members play the same paper at their
// own pace. This surface is that standing — the member's tier and progress,
// the six-rung ladder, their group roster with pod scores aggregated per
// member, and the pods they hold a live window in, counting down.
//
// Anonymous visitors get the ladder and a sign-in CTA: what the tiers cost is
// public, who is climbing is not.

function TierLadder({ currentTier, stars }: { currentTier: number | null; stars: number }) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">The ladder</p>
      <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100">Six tiers, one currency</h2>
      <ol className="mt-5 space-y-2">
        {TIERS.map((tier) => {
          const isCurrent = tier.tier === currentTier;
          const reached = currentTier !== null && stars >= tier.threshold;
          return (
            <li
              key={tier.tier}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                isCurrent
                  ? "border-gold/50 bg-gradient-to-r from-[#2a230f] to-slate-900"
                  : "border-slate-800 bg-slate-950/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    isCurrent ? "bg-gold text-slate-950" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {tier.tier}
                </span>
                <div>
                  <p className={`font-serif text-lg font-bold ${isCurrent ? "text-gold" : "text-slate-100"}`}>
                    {tier.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {tier.threshold === 0 ? "Starting tier" : `${tier.threshold.toLocaleString()} stars`}
                  </p>
                </div>
              </div>
              {isCurrent && (
                <span className="rounded-full border border-gold/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Your tier
                </span>
              )}
              {!isCurrent && reached && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Reached</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Progress({ label, detail, ratio }: { label: string; detail: string; ratio: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-slate-200">{detail}</span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function LadderPage() {
  const user = await getCurrentUser();
  const season = user ? await activeSeason() : null;

  const rankState = user
    ? await prisma.rankState.findUnique({ where: { userId: user.id } })
    : null;

  if (!user || !rankState) {
    // Anonymous, or a signed-in member who has not joined the queue yet:
    // the ladder is public, the climb is not.
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Global ranking</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-100 md:text-4xl">The ladder</h1>
        <p className="mt-3 text-sm text-slate-400">
          Stars are the platform&apos;s single currency. Win pods to climb from Initiate to Paragon; at season close the top
          three groups of every tier are engraved in the Hall of Fame and paid in Prime days.
        </p>

        <div className="mt-10">
          {rankState ? <TierLadder currentTier={rankState.tier} stars={rankState.stars} /> : <TierLadder currentTier={null} stars={0} />}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          {user ? (
            <>
              <JoinQueueButton />
              <Link href="/league/ladder/play" className="text-sm text-slate-400 underline hover:text-slate-200">
                already queued? play a pod
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Sign in to join the queue
              </Link>
              <p className="text-xs text-slate-500">Every tier is open — first stars land on your first pod.</p>
            </>
          )}
        </div>
      </main>
    );
  }

  const stars = rankState.stars;
  const tier = tierFor(stars);
  const info = tierInfo(tier);
  const nextTier = tier < MAX_TIER ? tierInfo(tier + 1) : null;
  const floor = starsForTier(tier);
  const span = nextTier ? Math.max(1, nextTier.threshold - floor) : 1;
  const progress = nextTier ? Math.max(0, Math.min(1, (stars - floor) / span)) : 1;

  const membership = await prisma.leagueGroupMember.findFirst({
    where: { userId: user.id, group: { seasonSlug: season!.slug } },
    include: { group: true },
  });

  const leaderRows = membership ? await groupLeaderboard(membership.group.id) : [];
  const handles = await prisma.user.findMany({
    where: { id: { in: leaderRows.map((r) => r.userId) } },
    select: { id: true, name: true },
  });
  const nameOf = new Map(handles.map((u) => [u.id, u.name]));

  const seats = await prisma.podMember.findMany({
    where: { userId: user.id, match: { state: "open" } },
    include: { match: { include: { group: { select: { name: true } } } } },
  });
  const nowMs = Date.now();
  const openPods = seats.filter((seat) => seat.match.windowClosesAt.getTime() > nowMs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Global ranking</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-slate-100 md:text-4xl">
          {info.label} <span className="text-gold">{stars.toLocaleString()} ★</span>
        </h1>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          {season!.name} · {membership ? membership.group.name : "unassigned"}
        </span>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <Progress
          label={nextTier ? `Progress to ${nextTier.label}` : "Top of the ladder"}
          detail={nextTier ? `${starsToNextTier(stars).toLocaleString()} ★ to ${nextTier.threshold.toLocaleString()}` : "Paragon reached"}
          ratio={progress}
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              <Star className="h-3.5 w-3.5 text-gold" aria-hidden /> Stars
            </p>
            <p className="mt-1 font-serif text-2xl font-bold tabular-nums text-slate-100">{stars.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              <Trophy className="h-3.5 w-3.5 text-gold" aria-hidden /> Tier
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-slate-100">
              {tier} <span className="text-sm text-slate-400">· {info.label}</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              <Users className="h-3.5 w-3.5 text-gold" aria-hidden /> Group
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-slate-100">
              {membership ? `${leaderRows.length} of ${membership.group.capacity}` : "—"}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-10">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Your group</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100">
              {membership ? membership.group.name : "No group yet"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Groups hold 20 members of a tier. Pod scores are aggregated here as members finish their pods.
            </p>

            {leaderRows.length === 0 ? (
              <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 px-6 py-8 text-center text-sm text-slate-400">
                No roster yet — join the queue to take your seat.
              </p>
            ) : (
              <table className="mt-4 w-full text-sm">
                <caption className="sr-only">Group roster and pod scores</caption>
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    <th scope="col" className="pb-2 font-semibold">#</th>
                    <th scope="col" className="pb-2 font-semibold">Handle</th>
                    <th scope="col" className="pb-2 text-right font-semibold">Pod score</th>
                    <th scope="col" className="pb-2 text-right font-semibold">Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderRows.map((row) => (
                    <tr
                      key={row.userId}
                      className={`border-t border-slate-800 ${row.userId === user.id ? "text-gold" : "text-slate-200"}`}
                    >
                      <td className="py-2.5 tabular-nums">{row.position}</td>
                      <td className="py-2.5">
                        {displayHandle(nameOf.get(row.userId) ?? null)}
                        {row.userId === user.id && <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-gold">you</span>}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">{row.podScore}</td>
                      <td className="py-2.5 text-right tabular-nums">{row.stars.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Open pods</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100">Live windows</h2>
            {openPods.length === 0 ? (
              <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 px-6 py-8 text-center text-sm text-slate-400">
                No open pods — open one when two or more members of your group are ready.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {openPods.map((seat) => (
                  <li key={seat.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-serif text-lg font-bold text-slate-100">{seat.match.group.name}</span>
                      <Countdown to={seat.match.windowClosesAt.toISOString()} prefix="closes in" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Tier {seat.match.tier} · round {seat.match.round}
                      {seat.submittedAt ? " · submitted" : " · in play"}
                    </p>
                    <Link
                      href={`/league/ladder/play?match=${seat.match.id}`}
                      className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gold/40 px-5 font-semibold text-gold transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <Clock className="h-4 w-4" aria-hidden />
                      {seat.submittedAt ? "Review window" : "Play this pod"}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <TierLadder currentTier={tier} stars={stars} />

          <section className="rounded-2xl border border-gold/30 bg-gradient-to-r from-[#2a230f] via-slate-900 to-slate-950 p-6">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-slate-100">
              <Swords className="h-5 w-5 text-gold" aria-hidden /> Play a pod
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              2–4 of your group, one 20-minute window, the same paper at your own pace. First place takes 3 stars.
            </p>
            <Link
              href="/league/ladder/play"
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Open a pod
            </Link>
          </section>

          {!membership && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="font-serif text-xl font-bold text-slate-100">Not in a group yet</h2>
              <p className="mt-2 text-sm text-slate-400">The queue assigns you to your tier&apos;s next group with room.</p>
              <div className="mt-4">
                <JoinQueueButton />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
