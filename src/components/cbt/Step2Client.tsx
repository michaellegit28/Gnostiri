"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Timer } from "lucide-react";
import { CBT } from "@/lib/cbt/ui";
import type { CbtSubjectOption } from "@/lib/cbt/data";

interface Props {
  boardCode: string;
  boardName: string;
  subjects: CbtSubjectOption[];
  maxSlots: number;
  lockedFirst: { slug: string; title: string } | null;
  simRules: { questionsPerSubject: number; durationMinutes: number } | null;
  practiceRules: { countOptions: number[]; durationOptionsMinutes: number[] };
  scoringSummary: string;
  hasContent: boolean;
}

type Mode = "simulation" | "practice";

export default function Step2Client({
  boardCode, boardName, subjects, maxSlots, lockedFirst, simRules, practiceRules, scoringSummary, hasContent,
}: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(simRules ? "simulation" : "practice");
  const [slots, setSlots] = useState<(string | null)[]>(
    Array.from({ length: maxSlots }, (_, i) => (i === 0 && lockedFirst ? null : null))
  );
  const [practiceCount, setPracticeCount] = useState(practiceRules.countOptions[0]);
  const [practiceMinutes, setPracticeMinutes] = useState(practiceRules.durationOptionsMinutes[0]);
  const [starting, setStarting] = useState(false);

  const available = useMemo(
    () => (topicId: string | null, slotIdx: number) =>
      subjects.filter((s) => s.topicId === topicId || !slots.some((sel, i) => i !== slotIdx && sel === s.topicId)),
    [subjects, slots]
  );

  const lockedSubject = lockedFirst ? subjects.find((s) => /english/i.test(s.topicId)) ?? null : null;
  const practicePicks = slots.filter(Boolean).length + (lockedSubject && mode === "practice" ? 1 : 0);
  const simReady = mode === "simulation" && !!simRules && subjects.length >= 2;
  const practiceReady = mode === "practice" && practicePicks >= 1;
  const canStart = hasContent && (simReady || practiceReady) && !starting;

  const start = () => {
    if (!canStart) return;
    setStarting(true);
    const params = new URLSearchParams({ board: boardCode, mode });
    if (mode === "practice") {
      const picked = [
        ...(lockedSubject ? [lockedSubject.topicId] : []),
        ...slots.filter((s): s is string => Boolean(s)),
      ].slice(0, maxSlots);
      params.set("subjects", picked.join(","));
      params.set("count", String(practiceCount));
      params.set("minutes", String(practiceMinutes));
    }
    router.push(`/cbt/session?${params.toString()}`);
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Subject slots */}
      <section className={`${CBT.panel} p-5`} aria-labelledby="subjects-h">
        <div className="flex items-center justify-between">
          <h2 id="subjects-h" className="font-serif text-lg font-bold text-slate-50">Subjects</h2>
          <span className={CBT.chip}>{mode === "simulation" ? "Board combination" : `${practicePicks}/${maxSlots} chosen`}</span>
        </div>

        {mode === "simulation" ? (
          <div className="mt-4 space-y-3">
            {lockedSubject && (
              <SubjectReadout index={1} title={lockedSubject.title} count={lockedSubject.questionCount} locked />
            )}
            <p className={`text-sm ${CBT.muted}`}>
              A complete {boardName} simulation runs the standard board combination: the top
              {` ${Math.max(maxSlots - (lockedSubject ? 1 : 0), 0)}`} subjects by bank coverage after
              {lockedSubject ? " Use of English" : " the core subject"}, {simRules?.questionsPerSubject} questions each.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {lockedSubject && <SubjectReadout index={1} title={lockedSubject.title} count={lockedSubject.questionCount} locked />}
            {slots.map((value, i) => {
              const slotNo = i + (lockedSubject ? 2 : 1);
              if (slotNo > maxSlots) return null;
              const opts = available(value, i);
              return (
                <label key={i} className="block">
                  <span className={`mb-1 block text-xs font-semibold uppercase tracking-wider ${CBT.faint}`}>
                    Subject {slotNo}
                  </span>
                  <select
                    value={value ?? ""}
                    onChange={(e) => setSlots((prev) => prev.map((v, j) => (j === i ? e.target.value || null : v)))}
                    className="min-h-[48px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-100 focus:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <option value="">— Select subject —</option>
                    {opts.map((s) => (
                      <option key={s.topicId} value={s.topicId}>{s.title} ({s.questionCount})</option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>
        )}
      </section>

      {/* Exam mode */}
      <section className={`${CBT.panel} p-5`} aria-labelledby="mode-h">
        <h2 id="mode-h" className="font-serif text-lg font-bold text-slate-50">Exam mode</h2>
        <div role="radiogroup" aria-label="Exam mode" className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-1 sm:grid-cols-2">
          {(["simulation", "practice"] as Mode[]).map((m) => {
            const disabled = m === "simulation" && !simRules;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                disabled={disabled}
                onClick={() => setMode(m)}
                className={`min-h-[44px] rounded-lg px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  mode === m ? "bg-gold text-slate-950" : "text-slate-300 hover:text-white"
                } ${disabled ? "opacity-40" : ""}`}
              >
                {m === "simulation" ? "Complete Exam Simulation" : "Single Subject Practice"}
              </button>
            );
          })}
        </div>
      </section>

      {/* Session duration */}
      <section className={`${CBT.panel} p-5`} aria-labelledby="duration-h">
        <h2 id="duration-h" className="font-serif text-lg font-bold text-slate-50">Session duration</h2>
        {mode === "simulation" && simRules ? (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/5 p-4">
            <Timer className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <p className="text-sm leading-relaxed text-slate-300">
              <strong className="text-slate-50">Fixed by the board — {simRules.durationMinutes} minutes total.</strong>{" "}
              The timer is not editable, runs once, and auto-submits your paper at 0:00, exactly
              like the hall. {scoringSummary}
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={`mb-1 block text-xs font-semibold uppercase tracking-wider ${CBT.faint}`}>Questions per subject</span>
                <select
                  value={practiceCount}
                  onChange={(e) => setPracticeCount(Number(e.target.value))}
                  className="min-h-[48px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-100 focus:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {practiceRules.countOptions.map((n) => <option key={n} value={n}>{n} questions</option>)}
                </select>
              </label>
              <label className="block">
                <span className={`mb-1 block text-xs font-semibold uppercase tracking-wider ${CBT.faint}`}>Time limit</span>
                <select
                  value={practiceMinutes}
                  onChange={(e) => setPracticeMinutes(Number(e.target.value))}
                  className="min-h-[48px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-100 focus:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {practiceRules.durationOptionsMinutes.map((n) => <option key={n} value={n}>{n} minutes</option>)}
                </select>
              </label>
            </div>
            <p className={`text-xs ${CBT.faint}`}>Practice rules are customizable — pick any duration; the timer still auto-submits at 0:00.</p>
          </div>
        )}
      </section>

      {/* Start */}
      <div className={CBT.stickyBar}>
        <div className="mx-auto max-w-2xl">
          <button type="button" disabled={!canStart} onClick={start} className={CBT.primaryBtn}>
            {starting ? "Building your paper…" : "Start Exam"}
          </button>
          <p className={`mt-2 text-center text-xs ${CBT.faint}`}>
            {simReady ? `${simRules?.durationMinutes} minutes · ${simRules?.questionsPerSubject} questions per subject` : practiceReady ? `${practicePicks} subject${practicePicks > 1 ? "s" : ""} · ${practiceCount} questions each` : "Choose at least one subject"}
          </p>
        </div>
      </div>
    </div>
  );
}

function SubjectReadout({ index, title, count, locked }: { index: number; title: string; count: number; locked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        {locked && <Lock className="h-3.5 w-3.5 text-gold" aria-hidden />}
        {index}. {title}
      </span>
      <span className={CBT.chip}>{count} questions</span>
    </div>
  );
}
