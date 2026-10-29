"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Copy, Link2, PlusCircle } from "lucide-react";

export interface FormatOption {
  value: string;
  label: string;
  blurb: string;
  duration: string;
}

export interface CreatedCup {
  id: string;
  title: string;
  visibility: string;
  inviteCode: string | null;
  startsAt: string;
  endsAt: string;
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputClass =
  "mt-1.5 block min-h-[44px] w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 focus:border-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold";
const selectClass = inputClass;
const labelClass = "block text-sm font-medium text-slate-300";

export default function CreateCupForm({
  formats,
  subjects,
  initialEligible,
  initialReasons,
}: {
  formats: FormatOption[];
  subjects: string[];
  initialEligible: boolean;
  initialReasons: string[];
}) {
  const nowMs = Date.now();
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("speed");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [entryRule, setEntryRule] = useState<"free" | "prime">("free");
  const [maxMembers, setMaxMembers] = useState(16);
  const [startsAt, setStartsAt] = useState(() => toLocalInput(new Date(nowMs + 3600_000)));
  const [endsAt, setEndsAt] = useState(() => toLocalInput(new Date(nowMs + 25 * 3600_000)));

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reasons, setReasons] = useState<string[]>(initialReasons);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<CreatedCup | null>(null);

  const cap = format === "bracket" ? 32 : 64;
  const activeMeta = formats.find((f) => f.value === format);

  function onFormatChange(next: string) {
    setFormat(next);
    setMaxMembers(next === "bracket" ? 8 : 16);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setReasons([]);
    setCopied(false);
    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          format,
          subjectSlug: subjectSlug.trim() || undefined,
          visibility,
          entryRule,
          maxMembers: Number(maxMembers),
          startsAt,
          endsAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201 && data.competition) {
        setResult(data.competition as CreatedCup);
      } else if (res.status === 403) {
        setError(data.error || "You are not eligible to host a cup yet");
        setReasons(Array.isArray(data.reasons) ? data.reasons : []);
      } else {
        setError(data.error || `Could not create the cup (${res.status})`);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setBusy(false);
    }
  }

  const inviteLink = result?.inviteCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/league/join?code=${result.inviteCode}`
    : null;

  async function copyInvite() {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (result) {
    return (
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Cup scheduled
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100">{result.title}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {result.visibility === "private" ? "Private" : "Public"} · you&apos;re the host and first member (anonymous).
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/league/${result.id}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Open cup
          </Link>
          <button
            type="button"
            onClick={() => setResult(null)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <PlusCircle className="h-4 w-4" aria-hidden />
            Create another
          </button>
        </div>

        {result.visibility === "private" && inviteLink && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-slate-300">Invite link</p>
            <p className="mt-1 break-all text-sm text-slate-400">{inviteLink}</p>
            <button
              type="button"
              onClick={() => void copyInvite()}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gold/40 px-5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Copy className="h-4 w-4" aria-hidden />
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      {!initialEligible && reasons.length > 0 && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm" role="alert">
          <p className="inline-flex items-center gap-2 font-semibold text-rose-200">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            You are not eligible to host yet
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-rose-200/90">
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="cup-title">
          Cup title
        </label>
        <input
          id="cup-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={80}
          placeholder="e.g. JAMB Physics Speed Cup"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cup-format">
            Format
          </label>
          <select id="cup-format" name="format" value={format} onChange={(e) => onFormatChange(e.target.value)} className={selectClass}>
            {formats.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          {activeMeta && <p className="mt-1.5 text-xs text-slate-500">{activeMeta.blurb} · {activeMeta.duration}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="cup-subject">
            Subject <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="cup-subject"
            name="subjectSlug"
            value={subjectSlug}
            onChange={(e) => setSubjectSlug(e.target.value)}
            list="subject-roots"
            placeholder="e.g. physics"
            className={inputClass}
          />
          <datalist id="subject-roots">
            {subjects.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className={labelClass}>Visibility</legend>
          <div className="mt-1.5 flex gap-2" role="group" aria-label="Visibility">
            {(["private", "public"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={visibility === v}
                onClick={() => setVisibility(v)}
                className={`min-h-[44px] flex-1 rounded-xl border px-4 text-sm font-semibold capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  visibility === v ? "border-transparent bg-gold text-slate-950" : "border-white/10 bg-white/5 text-slate-200 hover:border-gold/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {visibility === "private" ? "Join by invite link only." : "Open listing — anyone can join."}
          </p>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>Entry</legend>
          <div className="mt-1.5 flex gap-2" role="group" aria-label="Entry rule">
            {(["free", "prime"] as const).map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={entryRule === r}
                onClick={() => setEntryRule(r)}
                className={`min-h-[44px] flex-1 rounded-xl border px-4 text-sm font-semibold capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  entryRule === r ? "border-transparent bg-gold text-slate-950" : "border-white/10 bg-white/5 text-slate-200 hover:border-gold/50"
                }`}
              >
                {r === "prime" ? "Prime" : "Free"}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {entryRule === "prime" ? "Joiners need Prime." : "Open to everyone."}
          </p>
        </fieldset>
      </div>

      <div>
        <label className={labelClass} htmlFor="cup-max">
          Max members
          {format === "bracket" && <span className="ml-1 text-xs text-slate-500">· bracket: 4–32 (teams of 4)</span>}
        </label>
        <input
          id="cup-max"
          name="maxMembers"
          type="number"
          min={4}
          max={cap}
          value={maxMembers}
          onChange={(e) => setMaxMembers(Number(e.target.value))}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cup-start">
            Starts
          </label>
          <input id="cup-start" name="startsAt" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cup-end">
            Ends
          </label>
          <input id="cup-end" name="endsAt" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50"
        >
          <Link2 className="h-4 w-4" aria-hidden />
          {busy ? "Creating…" : "Create cup"}
        </button>
        <Link href="/league" className="text-sm text-slate-400 hover:text-white">
          Back to lobby
        </Link>
      </div>
    </form>
  );
}
