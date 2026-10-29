import Link from "next/link";
import { createHash } from "crypto";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { FORMAT_META, type CompetitionFormat } from "@/lib/competition";
import Countdown from "@/components/league/Countdown";

export const dynamic = "force-dynamic";

/**
 * /league/[id]/results — the closed-book view of a cup.
 *
 * The ladder is the same ranked CompetitionMember rows the submit API writes,
 * so this page and the live leaderboard cannot disagree. The caller's own row
 * is highlighted with their best score: repeats are best-of, so "play again"
 * can only move a member up, never down.
 */

/** Deterministic 4-hex racer tag — md5 of the userId, computed server-side. */
function racerTag(userId: string): string {
  return createHash("md5").update(userId).digest("hex").slice(0, 4);
}

function displayName(member: {
  userId: string;
  anonymous: boolean;
  user: { name: string | null };
}): string {
  if (member.anonymous) return `Racer · ${racerTag(member.userId)}`;
  return member.user.name ?? "Racer";
}

const STATUS_STYLES: Record<string, string> = {
  scheduled: "border-gold/40 bg-gold/10 text-gold",
  live: "border-teal-500/40 bg-teal-500/10 text-teal-300",
  finished: "border-white/15 bg-white/5 text-slate-400",
  cancelled: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const competition = await prisma.competition.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: { user: { select: { name: true } } },
        orderBy: [{ rank: "asc" }, { score: "desc" }, { joinedAt: "asc" }],
      },
    },
  });
  if (!competition) notFound();

  const format = (competition.format as CompetitionFormat) ?? "speed";
  const meta = FORMAT_META[format] ?? FORMAT_META.speed;
  const myMember = user ? competition.members.find((m) => m.userId === user.id) : undefined;
  const statusKey = STATUS_STYLES[competition.status] ? competition.status : "scheduled";
  const leader = competition.members[0];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Merit League · results</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl font-bold text-slate-100 md:text-4xl">{competition.title}</h1>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
              STATUS_STYLES[statusKey] ?? STATUS_STYLES.scheduled
            }`}
          >
            {competition.status}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          <span className="font-semibold text-slate-300">{meta.label}</span> — {meta.blurb}
        </p>
        {competition.status === "scheduled" && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 backdrop-blur-md">
            <Countdown to={competition.startsAt.toISOString()} prefix="Starts in" />
          </div>
        )}
      </header>

      {myMember && (
        <section className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6 backdrop-blur-md">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Your result</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Best score</p>
              <p className="mt-1 font-serif text-3xl font-bold text-slate-100">{myMember.score}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Ladder rank</p>
              <p className="mt-1 font-serif text-3xl font-bold text-slate-100">
                {myMember.rank ? `#${myMember.rank}` : "—"}
                <span className="ml-2 text-sm font-normal text-slate-500">of {competition.members.length}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            {leader && leader.userId === user?.id
              ? "You lead the cup — hold the line."
              : "Play again any time inside the window: your best score is the one that counts."}
          </p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Final leaderboard</h2>
        {competition.members.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-400">
            No racers joined this cup.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Rank</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Racer</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {competition.members.map((member, i) => (
                  <tr
                    key={member.id}
                    className={`transition-colors hover:bg-white/5 ${
                      member.userId === user?.id || member.userId === competition.hostId ? "bg-gold/5" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 tabular-nums text-slate-400">
                      {member.rank ?? (member.score > 0 ? i + 1 : "—")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-100">{displayName(member)}</span>
                      {member.userId === competition.hostId && (
                        <span className="ml-2 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                          Host
                        </span>
                      )}
                      {user && member.userId === user.id && (
                        <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">You</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-serif text-lg font-bold tabular-nums text-slate-100">
                      {member.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {myMember ? (
          <>
            <Link
              href={`/league/${competition.id}/play`}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Play again — best score kept
            </Link>
            <Link
              href={`/league/${competition.id}`}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Back to the cup
            </Link>
          </>
        ) : (
          <Link
            href="/league/join"
            className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Join cup
          </Link>
        )}
      </div>
    </main>
  );
}
