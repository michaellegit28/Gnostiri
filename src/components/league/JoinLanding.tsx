"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarRange, Globe2, Lock, Loader2, LogIn, Trophy, Users } from "lucide-react";
import type { FormatOption } from "./CreateCupForm";

interface Summary {
  competition: {
    id: string;
    title: string;
    format: string;
    visibility: string;
    entryRule: string;
    status: string;
    maxMembers: number;
    startsAt: string;
    endsAt: string;
    memberCount: number;
    hostName: string | null;
    subjectSlug: string | null;
  };
  caller: {
    isAuthenticated: boolean;
    isMember: boolean;
    isHost: boolean;
    started: boolean;
    full: boolean;
    finished: boolean;
    requiresPrime: boolean;
    canJoin: boolean;
    reason: string | null;
  };
}

function toDate(v: string): Date {
  return new Date(v);
}

function fmt(date: Date): string {
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function rel(date: Date): string {
  const diff = date.getTime() - Date.now();
  const mins = Math.round(Math.abs(diff) / 60000);
  const unit = mins < 60 ? `${mins}m` : mins < 2880 ? `${Math.round(mins / 60)}h` : `${Math.round(mins / 1440)}d`;
  return diff >= 0 ? `in ${unit}` : `${unit} ago`;
}

const chip = "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em]";

export default function JoinLanding({
  code,
  competitionId,
  formats,
}: {
  code?: string;
  competitionId?: string;
  formats: FormatOption[];
}) {
  const [data, setData] = useState<Summary | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [joinBusy, setJoinBusy] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinReason, setJoinReason] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let alive = true;
    const qs = code ? `?code=${encodeURIComponent(code)}` : competitionId ? `?competitionId=${encodeURIComponent(competitionId)}` : "";
    if (!qs) {
      setLoading(false);
      setLoadError("No invite code was provided.");
      return () => {
        alive = false;
      };
    }
    fetch(`/api/competitions/join${qs}`)
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(body.error || `Could not load the cup (${r.status})`);
        return body as Summary;
      })
      .then((body) => {
        if (alive) {
          setData(body);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (alive) {
          setLoadError(e.message || "This invite link is invalid or has expired");
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [code, competitionId]);

  const doJoin = useCallback(async () => {
    setJoinBusy(true);
    setJoinError("");
    setJoinReason(null);
    try {
      const res = await fetch("/api/competitions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(code ? { inviteCode: code } : { competitionId }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setJoined(true);
      } else if (res.status === 403 && body.reason === "premium") {
        setJoinError("This is a Prime-entry cup — upgrade to join.");
        setJoinReason("premium");
      } else {
        setJoinError(body.error || `Could not join (${res.status})`);
      }
    } catch {
      setJoinError("Network error — please try again");
    } finally {
      setJoinBusy(false);
    }
  }, [code, competitionId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-slate-400">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" aria-hidden />
        Loading invite…
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Merit League</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">Invite not available</h1>
        <p role="alert" className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          {loadError || "This invite link is invalid or has expired."}
        </p>
        <Link
          href="/league"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Back to the League
        </Link>
      </main>
    );
  }

  const { competition: c, caller } = data;
  const meta = formats.find((f) => f.value === c.format);
  const starts = toDate(c.startsAt);
  const ends = toDate(c.endsAt);

  if (joined || caller.isMember) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Merit League</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-100">You&apos;re in</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          You joined “{c.title}”{c.visibility === "private" ? " via invite" : ""}. You compete anonymously by default.
        </p>
        <Link
          href={`/league/${c.id}`}
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Go to the cup
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Merit League invite</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-slate-100">{c.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`${chip} border-white/10 bg-white/5 text-slate-300`}>
          <Trophy className="h-3.5 w-3.5 text-gold" aria-hidden />
          {meta?.label ?? c.format}
        </span>
        <span className={`${chip} ${c.entryRule === "prime" ? "border-gold/40 bg-gold/10 text-gold" : "border-white/10 bg-white/5 text-slate-300"}`}>
          {c.entryRule === "prime" ? "Prime entry" : "Free entry"}
        </span>
        <span className={`${chip} border-white/10 bg-white/5 text-slate-400`}>
          {c.visibility === "private" ? <Lock className="h-3 w-3" aria-hidden /> : <Globe2 className="h-3 w-3" aria-hidden />}
          {c.visibility === "private" ? "Private" : "Public"}
        </span>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="inline-flex items-center gap-2 text-slate-400">
              <CalendarRange className="h-4 w-4 text-gold" aria-hidden />
              Window
            </dt>
            <dd className="text-right text-slate-200">
              {fmt(starts)} → {fmt(ends)}
              <span className="ml-2 text-slate-500">starts {rel(starts)}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="inline-flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4 text-gold" aria-hidden />
              Members
            </dt>
            <dd className="text-slate-200">
              {c.memberCount}/{c.maxMembers}
              {caller.full && <span className="ml-2 text-rose-300">full</span>}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Host</dt>
            <dd className="truncate text-slate-200">{c.hostName || "—"}</dd>
          </div>
        </dl>

        <div className="mt-6">
          {caller.reason === "sign-in" ? (
            <Link
              href="/login"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              Sign in to join
            </Link>
          ) : caller.reason === "started" ? (
            <p className="text-sm text-slate-400">This cup has already started — joining is closed.</p>
          ) : caller.reason === "full" ? (
            <p className="text-sm text-slate-400">This cup is full.</p>
          ) : (
            <button
              type="button"
              onClick={() => void doJoin()}
              disabled={joinBusy || !caller.canJoin}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50"
            >
              {joinBusy ? "Joining…" : "Join cup"}
            </button>
          )}

          {joinReason === "premium" && (
            <Link
              href="/pricing"
              className="ml-3 inline-flex min-h-[44px] items-center rounded-xl border border-gold/40 px-5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              See Prime
            </Link>
          )}
          {joinError && (
            <p role="alert" className="mt-3 text-sm text-rose-300">
              {joinError}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
