"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Flame, Swords, TrendingUp, Crosshair, ArrowRight } from "lucide-react";

interface Attempt {
  accuracy?: number;
  topicTitle?: string;
}

interface WeakTopic {
  title?: string;
  topicTitle?: string;
  topicId?: string;
}

interface Mission {
  subject: string;
  topic: string;
  examCode: string;
  subjectSlug: string;
  topicSlug: string;
  kind: string;
}

/**
 * HomeDashboard — members-only progress strip on the homepage.
 * Visitors see nothing (marketing hero stays). Shows streak, recent
 * accuracy, today's battle-plan mission and the top weak spot.
 * Hides silently on any error so the homepage never breaks.
 */
export default function HomeDashboard() {
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(false);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [weak, setWeak] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const [dashRes, battleRes] = await Promise.all([
          fetch("/api/progress/dashboard?domain=highschool"),
          fetch("/api/battle-plan?exam=waec"),
        ]);
        if (cancelled) return;
        if (dashRes.ok) {
          const d = await dashRes.json();
          if (typeof d.streak === "number") setStreak(d.streak);
          const attempts: Attempt[] = Array.isArray(d.recentAttempts)
            ? d.recentAttempts
            : [];
          if (attempts.length) {
            const scored = attempts.filter((a) => typeof a.accuracy === "number");
            if (scored.length) {
              setAccuracy(
                Math.round(
                  scored.reduce((s, a) => s + (a.accuracy ?? 0), 0) / scored.length
                )
              );
            }
          }
          const weakList: WeakTopic[] = Array.isArray(d.weakTopics) ? d.weakTopics : [];
          const first = weakList[0];
          const label = first?.title ?? first?.topicTitle ?? first?.topicId ?? null;
          if (label) setWeak(label);
        }
        if (battleRes.ok) {
          const b = await battleRes.json();
          const firstMission: Mission | undefined = Array.isArray(b.today)
            ? b.today[0]
            : undefined;
          if (firstMission) setMission(firstMission);
        }
        setReady(true);
      } catch {
        /* stay hidden — homepage must never break */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  if (loading || !user || !ready) return null;

  return (
    <section aria-label="Your progress" className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-r from-amber-950/30 via-slate-900/80 to-slate-900/80 p-6 md:p-7">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400">
                Welcome back
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Flame
                  className={`w-6 h-6 ${streak > 0 ? "text-orange-400" : "text-slate-600"}`}
                />
                <span className="text-2xl font-bold">
                  {streak > 0 ? `${streak}-day streak` : "Start your streak today"}
                </span>
              </div>
            </div>
            {accuracy !== null && (
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Recent accuracy
                </div>
                <div className="mt-1 text-2xl font-bold text-teal-300">{accuracy}%</div>
              </div>
            )}
            {weak && (
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5" />
                  Weak spot
                </div>
                <Link
                  href="/progress"
                  className="mt-1 block truncate text-lg font-semibold text-rose-300 hover:text-rose-200 transition-colors"
                >
                  {weak}
                </Link>
              </div>
            )}
          </div>
          {mission ? (
            <Link
              href={`/highschool/${mission.examCode}/${mission.subjectSlug}/${mission.topicSlug}/${mission.kind === "quiz" ? "quiz" : "study"}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-3 hover:bg-[#D4AF37]/15 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm">
                <Swords className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-slate-200">
                  Today: <strong>{mission.topic}</strong>
                  <span className="text-slate-400"> • {mission.subject}</span>
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] shrink-0" />
            </Link>
          ) : (
            <Link
              href="/battle-plan"
              className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:border-[#D4AF37]/40 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-slate-200">
                <Swords className="w-4 h-4 text-[#D4AF37] shrink-0" />
                No mission yet — generate your WAEC battle plan
              </span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
