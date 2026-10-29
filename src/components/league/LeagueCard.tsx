import Link from "next/link";
import { Globe2, Lock, Trophy, Users } from "lucide-react";
import { FORMAT_META, type CompetitionFormat } from "@/lib/competition";

/**
 * LeagueCard — presentational Merit League cup tile (ROADMAP.md §3).
 * Owns no data-fetching; the lobby and the invite landing both feed it.
 * Format label + duration from FORMAT_META, an entry chip (Free / Prime),
 * a status chip, member count and the host. Taps through to /league/{id}
 * (the play screen — owned by another lane).
 */
export interface LeagueCompetition {
  id: string;
  title: string;
  format: string; // speed | endurance | mastery | bracket
  visibility: "public" | "private";
  entryRule: string; // free | prime
  status: string; // scheduled | live | finished | cancelled (effective)
  startsAt: Date | string;
  endsAt: Date | string;
  maxMembers: number;
  memberCount: number;
  hostName?: string | null;
  isMember?: boolean;
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function relativeFromNow(date: Date, now: number): string {
  const diff = date.getTime() - now;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const hours = Math.round(mins / 60);
  const days = Math.round(mins / 1440);
  const unit = mins < 60 ? `${mins}m` : hours < 48 ? `${hours}h` : `${days}d`;
  return diff >= 0 ? `in ${unit}` : `${unit} ago`;
}

const STATUS_CHIP: Record<string, string> = {
  live: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  scheduled: "border-gold/40 bg-gold/10 text-gold",
  finished: "border-slate-600 bg-slate-800/60 text-slate-400",
  cancelled: "border-slate-600 bg-slate-800/60 text-slate-400",
};

export default function LeagueCard({ cup }: { cup: LeagueCompetition }) {
  const meta = FORMAT_META[cup.format as CompetitionFormat];
  const now = Date.now();
  const startsAt = toDate(cup.startsAt);
  const endsAt = toDate(cup.endsAt);
  const status = cup.status;
  const isPublic = cup.visibility === "public";
  const full = cup.memberCount >= cup.maxMembers;

  return (
    <Link
      href={`/league/${cup.id}`}
      aria-label={`${meta?.label ?? "Cup"}: ${cup.title} — ${status}${cup.isMember ? ", joined" : ""}`}
      className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition-colors hover:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-300">
            <Trophy className="h-3.5 w-3.5 text-gold" aria-hidden />
            {meta?.label ?? cup.format}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${
              cup.entryRule === "prime"
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            {cup.entryRule === "prime" ? "Prime entry" : "Free entry"}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${
              STATUS_CHIP[status] ?? STATUS_CHIP.scheduled
            }`}
          >
            {status}
          </span>
          {!isPublic && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
              <Lock className="h-3 w-3" aria-hidden />
              Private
            </span>
          )}
          {isPublic && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
              <Globe2 className="h-3 w-3" aria-hidden />
              Public
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-gold">
          {cup.title}
        </h3>

        <p className="text-sm text-slate-400">
          {formatDateTime(startsAt)} → {formatDateTime(endsAt)}
          <span className="ml-2 text-slate-500">
            {status === "live" ? "started" : "starts"} {relativeFromNow(startsAt, now)}
          </span>
          {meta && <span className="ml-1 text-slate-500">· {meta.duration}</span>}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gold" aria-hidden />
          {cup.memberCount}/{cup.maxMembers}
          {full && <span className="text-rose-300">· full</span>}
          {cup.isMember && <span className="text-gold">· joined</span>}
        </span>
        <span className="truncate">Host · {cup.hostName || "—"}</span>
      </div>
    </Link>
  );
}
