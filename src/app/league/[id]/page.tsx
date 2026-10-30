import Link from "next/link";
import { notFound } from "next/navigation";
import { createHash } from "crypto";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { FORMAT_META, type CompetitionFormat } from "@/lib/competition";
import { MASTERY_TARGET_LABEL } from "@/lib/competition-additions";
import Countdown from "@/components/league/Countdown";

export const dynamic = "force-dynamic";

/** Where each format's play surface lives, and how its CTA reads. */
const PLAY_PATH: Record<CompetitionFormat, string> = {
  speed: "play",
  endurance: "endurance",
  mastery: "mastery",
  bracket: "bracket",
};

const PLAY_LABEL: Record<CompetitionFormat, string> = {
  speed: "Play",
  endurance: "Check in",
  mastery: "View progress",
  bracket: "Open bracket",
};

const PLAY_OPEN_COPY: Record<CompetitionFormat, string> = {
  speed: "The clock is live — your paper is drawn fresh, and your best score is the one that counts.",
  endurance: "The window is live — one check-in per day, every day you show up counts.",
  mastery: "The window is live — mastery is measured from your assessed sessions, not claimed.",
  bracket: "The bracket is live — win your quickfire to advance.",
};

const PLAY_CLOSED_COPY: Record<CompetitionFormat, string> = {
  speed: "Your paper is available once the cup window opens.",
  endurance: "Your first check-in unlocks when the window opens.",
  mastery: "Progress counts once the cup window opens.",
  bracket: "Your seeding and match appear once the window opens.",
};

/**
 * /league/[id] — the Merit League cup page.
 *
 * Everything here is server-rendered: the leaderboard order comes from the
 * CompetitionMember rows the submit API ranked, and the countdown anchor is a
 * server date handed to the client Countdown. Anonymous racers are shown as
 * "Racer · <hash>" — the tag is derived here with md5 of the userId, so it is
 * stable for that racer across every surface without ever revealing them.
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

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  live: "Live now",
  finished: "Finished",
  cancelled: "Cancelled",
};

export default async function CompetitionPage({ params }: { params: { id: string } }) {
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
  const host = await prisma.user.findUnique({
    where: { id: competition.hostId },
    select: { name: true },
  });

  const isMember = Boolean(user && competition.members.some((m) => m.userId === user.id));
  const statusKey = STATUS_LABELS[competition.status] ? competition.status : "scheduled";
  const countdownTo = competition.status === "scheduled" ? competition.startsAt : competition.endsAt;
  const countdownPrefix = competition.status === "scheduled" ? "Starts in" : "Ends in";
  const now = new Date();
  const windowOpen =
    now >= competition.startsAt && now <= competition.endsAt && competition.status !== "cancelled";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Merit League</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl font-bold text-slate-100 md:text-4xl">{competition.title}</h1>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
              STATUS_STYLES[statusKey] ?? STATUS_STYLES.scheduled
            }`}
          >
            {STATUS_LABELS[statusKey]}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          <span className="font-semibold text-slate-300">{meta.label}</span> — {meta.blurb}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
          {competition.visibility === "public" ? "Public cup" : "Invite cup"} · entry: {competition.entryRule} ·
          hosted by {host?.name ?? "a host"} · {competition.members.length}/{competition.maxMembers} racers
        </p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 backdrop-blur-md">
          <Countdown to={countdownTo.toISOString()} prefix={countdownPrefix} />
          <p className="mt-1 text-xs text-slate-500">
            {new Date(competition.startsAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} →{" "}
            {new Date(competition.endsAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Leaderboard</h2>
          {competition.members.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-400">
              No racers yet — the first to join takes the top of the ladder.
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
                        member.userId === competition.hostId ? "bg-gold/5" : ""
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
          <p className="mt-3 text-xs text-slate-500">
            Ranks and scores are reconciled server-side on every submit — nothing on this table is client-reported.
          </p>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Cup facts</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Format</dt>
                <dd className="font-semibold text-slate-200">{meta.label}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Length</dt>
                <dd className="font-semibold text-slate-200">{meta.duration}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">{format === "speed" || format === "bracket" ? "Questions" : format === "mastery" ? "Target" : "Check-ins"}</dt>
                <dd className="font-semibold text-slate-200">
                  {format === "speed"
                    ? "20 · multiple choice"
                    : format === "bracket"
                      ? "5 per quickfire round"
                      : format === "mastery"
                        ? `${MASTERY_TARGET_LABEL} mean mastery`
                        : "Once per day, server-stamped"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Marking</dt>
                <dd className="font-semibold text-slate-200">
                  {format === "speed"
                    ? "+1 correct, no negatives"
                    : format === "bracket"
                      ? "Best accuracy advances"
                      : format === "mastery"
                        ? `${MASTERY_TARGET_LABEL} mean mastery`
                        : "Demonstrated mastery, server-measured"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-md">
            {!user ? (
              <>
                <h2 className="font-serif text-xl font-bold text-slate-100">Sign in to race</h2>
                <p className="mt-2 text-sm text-slate-400">
                  This cup is open — sign in, join, and the paper is dealt the moment the clock starts.
                </p>
                <Link
                  href="/login"
                  className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Sign in
                </Link>
              </>
            ) : isMember ? (
              <>
                <h2 className="font-serif text-xl font-bold text-slate-100">You&apos;re on the grid</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {windowOpen
                    ? PLAY_OPEN_COPY[format]
                    : PLAY_CLOSED_COPY[format]}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/league/${competition.id}/${PLAY_PATH[format]}`}
                    className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {PLAY_LABEL[format]}
                  </Link>
                  <Link
                    href={`/league/${competition.id}/results`}
                    className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Results
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-serif text-xl font-bold text-slate-100">Take your place</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {competition.visibility === "public"
                    ? "Join the cup to get a paper and a spot on the ladder."
                    : "This is an invite cup — ask the host for the invite code, then join."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/league/join"
                    className="inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Join cup
                  </Link>
                  <Link
                    href="/league"
                    className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 bg-slate-950/80 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    All cups
                  </Link>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
