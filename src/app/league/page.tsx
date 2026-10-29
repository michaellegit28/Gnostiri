import Link from "next/link";
import { CalendarRange, Crown, Flame, PlusCircle, Sparkles, Trophy } from "lucide-react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import {
  COMPETITION_FORMATS,
  CURRENT_SEASON,
  FORMAT_META,
  SEASONS,
  evaluateLeagueEligibility,
  type CompetitionFormat,
  type LeagueEligibility,
} from "@/lib/competition";
import LeagueCard, { type LeagueCompetition } from "@/components/league/LeagueCard";

export const dynamic = "force-dynamic";

type CupRow = {
  id: string;
  title: string;
  format: string;
  visibility: string;
  entryRule: string;
  status: string;
  maxMembers: number;
  startsAt: Date;
  endsAt: Date;
  host: { name: string | null } | null;
  _count: { members: number };
};

/** status is scheduled by default; derive an effective state from the clock. */
function effectiveStatus(cup: CupRow, nowMs: number): LeagueCompetition["status"] {
  if (cup.status === "cancelled") return "cancelled";
  const start = cup.startsAt.getTime();
  const end = cup.endsAt.getTime();
  if (nowMs >= start && nowMs <= end) return "live";
  if (nowMs > end) return "finished";
  return "scheduled";
}

function toCard(cup: CupRow, joined: Set<string>): LeagueCompetition {
  return {
    id: cup.id,
    title: cup.title,
    format: cup.format,
    visibility: cup.visibility === "public" ? "public" : "private",
    entryRule: cup.entryRule === "prime" ? "prime" : "free",
    status: effectiveStatus(cup, Date.now()),
    startsAt: cup.startsAt,
    endsAt: cup.endsAt,
    maxMembers: cup.maxMembers,
    memberCount: cup._count.members,
    hostName: cup.host?.name ?? null,
    isMember: joined.has(cup.id),
  };
}

function ProgressBar({ label, detail, ratio }: { label: string; detail: string; ratio: number }) {
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

function EligibilityPanel({ eligibility }: { eligibility: LeagueEligibility }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center gap-2 text-gold">
        <Crown className="h-5 w-5" aria-hidden />
        <h2 className="font-serif text-xl font-bold text-slate-100">Create-cup eligibility</h2>
      </div>
      <p className="mt-1 text-sm text-slate-400">
        Host your own cup: four Prime months, 60% mastery and 85% accuracy with a clean record.
      </p>

      <div className="mt-5 space-y-4">
        <ProgressBar label="Prime tenure" detail={`${eligibility.tenureMonths.toFixed(1)} / 4 months`} ratio={eligibility.tenureMonths / 4} />
        <ProgressBar label="Subject mastery" detail={`${Math.round(eligibility.mastery * 100)}% / 60%`} ratio={eligibility.mastery} />
        <ProgressBar label="Quiz accuracy" detail={`${Math.round(eligibility.accuracy * 100)}% / 85%`} ratio={eligibility.accuracy} />
      </div>

      {eligibility.eligible ? (
        <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
          <Sparkles className="h-4 w-4" aria-hidden />
          You are eligible to host a Merit League cup.
        </p>
      ) : (
        <ul className="mt-5 space-y-1.5 text-sm text-slate-300" aria-label="Eligibility blockers">
          {eligibility.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" aria-hidden />
              {reason}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/league/create"
        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <PlusCircle className="h-4 w-4" aria-hidden />
        Create a cup
      </Link>
    </section>
  );
}

function SeasonBanner() {
  const season = SEASONS.find((s) => s.slug === CURRENT_SEASON) ?? SEASONS[SEASONS.length - 1];
  return (
    <section className="rounded-2xl border border-gold/30 bg-gradient-to-r from-[#2a230f] via-slate-900 to-slate-950 p-6 md:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Merit League season</p>
      <h2 className="mt-2 font-serif text-3xl font-bold text-slate-100">
        {season.label} <span className="text-gold">is live</span>
      </h2>
      <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
        <CalendarRange className="h-4 w-4 text-gold" aria-hidden />
        {season.window} · mid-season entry open, finals + certificates land at season close
      </p>
    </section>
  );
}

function CupSection({
  title,
  hint,
  icon,
  cups,
  joined,
  empty,
}: {
  title: string;
  hint: string;
  icon: React.ReactNode;
  cups: CupRow[];
  joined: Set<string>;
  empty: string;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 text-gold">
        {icon}
        <h2 className="font-serif text-xl font-bold text-slate-100">{title}</h2>
      </div>
      <p className="mt-1 text-sm text-slate-400">{hint}</p>
      {cups.length === 0 ? (
        <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 px-6 py-8 text-center text-sm text-slate-400">
          {empty}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cups.map((cup) => (
            <LeagueCard key={cup.id} cup={toCard(cup, joined)} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function LeagueLobby() {
  const user = await getCurrentUser();

  // Public cups plus everything the signed-in viewer hosts or has joined.
  const where = user
    ? { OR: [{ visibility: "public" }, { hostId: user.id }, { members: { some: { userId: user.id } } }] }
    : { visibility: "public" };

  const cups = (await prisma.competition.findMany({
    where,
    orderBy: { startsAt: "asc" },
    take: 60,
    include: {
      host: { select: { name: true } },
      _count: { select: { members: true } },
    },
  })) as CupRow[];

  // Mark which cups the viewer already belongs to so the card can say so.
  const joinedIds = new Set<string>();
  if (user) {
    const memberships = await prisma.competitionMember.findMany({
      where: { userId: user.id },
      select: { competitionId: true },
    });
    for (const m of memberships) joinedIds.add(m.competitionId);
  }

  const nowMs = Date.now();
  const live = cups.filter((c) => effectiveStatus(c, nowMs) === "live");
  const upcoming = cups.filter((c) => effectiveStatus(c, nowMs) === "scheduled");

  const eligibility = user ? await evaluateLeagueEligibility(user.id) : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <SeasonBanner />

      {/* Four cup formats */}
      <section className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Four cups</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100">Pick your format, host or join</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {COMPETITION_FORMATS.map((format: CompetitionFormat) => {
            const meta = FORMAT_META[format];
            return (
              <div key={format} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gold" aria-hidden />
                  <h3 className="font-serif text-lg font-bold text-slate-100">{meta.label}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-400">{meta.blurb}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <Flame className="h-3.5 w-3.5" aria-hidden />
                  {meta.duration}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Eligibility / sign-in */}
      <section className="mt-10">
        {user && eligibility ? (
          <EligibilityPanel eligibility={eligibility} />
        ) : (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
            <h2 className="font-serif text-xl font-bold text-slate-100">Join the Merit League</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Sign in to see your create-cup eligibility, host a cup, and open private cups from an invite link.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Sign in
            </Link>
          </section>
        )}
      </section>

      {/* Live + upcoming */}
      <div className="mt-12 space-y-12">
        <CupSection
          title="Live now"
          hint="Cups running in the clock — accuracy under pressure, scores reconciled server-side."
          icon={<Sparkles className="h-5 w-5" aria-hidden />}
          cups={live}
          joined={joinedIds}
          empty="No cups live this moment — check what's starting soon."
        />
        <CupSection
          title="Upcoming public"
          hint="Open to everyone. Join a public cup, or share a private invite link."
          icon={<CalendarRange className="h-5 w-5" aria-hidden />}
          cups={upcoming}
          joined={joinedIds}
          empty="Nothing scheduled yet — be the first to host one."
        />
      </div>

      {joinedIds.size > 0 && (
        <p className="mt-10 text-center text-xs text-slate-500">
          You are in {joinedIds.size} cup{joinedIds.size === 1 ? "" : "s"} — joined cards are marked.
        </p>
      )}
    </main>
  );
}
