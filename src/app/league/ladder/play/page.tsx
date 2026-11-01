import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { tierFor } from "@/lib/ranking";
import { activeSeason } from "@/lib/ranking-pool";
import PodPlayClient from "@/components/ranking/PodPlayClient";

export const dynamic = "force-dynamic";

// The pod play surface (Phase 7): async-simultaneous pods.
//
// 2–4 members of one group sit the same paper inside a shared 20-minute
// window, each at their own pace — the scoreboard fills as they submit. There
// is no websocket and no live session: the member joins (POST /open), is
// served a derived paper anchored to the window's own opening instant, and
// the standings panel polls /api/ranking/state while the window is open.
//
// The server component only resolves the member's group context — every
// subsequent call is made by the client, so a stale prop can never decide who
// plays or what the clock says.

export default async function LadderPlayPage({ searchParams }: { searchParams: { match?: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Pod play</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Sign in to play a pod</h1>
        <p className="mt-3 text-sm text-slate-400">
          Pods are group-wide: you need a rank state and a group to take a seat.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const season = await activeSeason();
  const rankState = await prisma.rankState.findUnique({ where: { userId: user.id } });
  const membership = await prisma.leagueGroupMember.findFirst({
    where: { userId: user.id, group: { seasonSlug: season.slug } },
    include: { group: { select: { id: true, name: true, tier: true } } },
  });

  // A window the member already holds, so the surface can resume it directly.
  const held = await prisma.podMember.findFirst({
    where: { userId: user.id, match: { state: "open" } },
    orderBy: { id: "asc" },
    select: { matchId: true, match: { select: { id: true, tier: true, windowClosesAt: true } } },
  });
  const live = held && held.match.windowClosesAt.getTime() > Date.now() ? held.match : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <PodPlayClient
        groupName={membership?.group.name ?? null}
        tier={membership ? tierFor(rankState?.stars ?? 0) : null}
        hasGroup={Boolean(membership)}
        resumeMatchId={live?.id ?? null}
        requestedMatchId={searchParams.match ?? null}
      />
    </main>
  );
}
