import { Award, GraduationCap, Star, Trophy } from "lucide-react";
import prisma from "@/lib/db";
import Confetti from "@/components/dashboard/Confetti";

/**
 * RecentAchievements — the reward surface of the dashboard (spec Part 6).
 * Surfaces what the learner has actually earned: league badges, completion
 * certificates and their star total, so genuine progress feels rewarded
 * without manipulative urgency. Reads real rows; degrades to an honest,
 * encouraging empty state on a fresh account.
 */
export default async function RecentAchievements({ userId }: { userId: string }) {
  let badges: { id: string; label: string; awardedAt: Date }[] = [];
  let certs: { id: string; issuedAt: Date; courseTitle: string }[] = [];
  let stars = 0;
  let tier = 1;

  try {
    const [badgeRows, certRows, rank] = await Promise.all([
      prisma.leagueBadge.findMany({
        where: { userId },
        orderBy: { awardedAt: "desc" },
        take: 4,
        select: { id: true, label: true, awardedAt: true },
      }),
      prisma.certificate.findMany({
        where: { userId },
        orderBy: { issuedAt: "desc" },
        take: 2,
        select: { id: true, issuedAt: true, course: { select: { title: true } } },
      }),
      prisma.rankState.findUnique({
        where: { userId },
        select: { stars: true, tier: true },
      }),
    ]);
    badges = badgeRows;
    certs = certRows.map((c) => ({ id: c.id, issuedAt: c.issuedAt, courseTitle: c.course.title }));
    stars = rank?.stars ?? 0;
    tier = rank?.tier ?? 1;
  } catch {
    // Data read failure must never break the dashboard shell.
  }

  // Celebrate when a badge landed in the last 24 hours — a real, earned moment.
  const freshBadge = badges.some((b) => Date.now() - new Date(b.awardedAt).getTime() < 86_400_000);

  return (
    <section
      aria-label="Recent achievements"
      className="gn-card gn-shadow rounded-2xl border border-line p-6"
    >
      {freshBadge && <Confetti count={70} />}

      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-serif text-lg font-bold text-slate-100">
          <Trophy className="h-5 w-5 text-gold" aria-hidden />
          Recent achievements
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-bold text-gold">
          <Star className="h-4 w-4 gn-flame" aria-hidden />
          {stars.toLocaleString()}
          <span className="sr-only"> stars, tier {tier}</span>
        </span>
      </div>

      {badges.length === 0 && certs.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          Your first badge is one focused session away — finish a quiz, a lesson or a
          live pod and it lands here.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {badges.map((b) => (
            <li
              key={b.id}
              className="gn-badge is-new flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Award className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-100">{b.label}</span>
                <span className="block text-xs text-muted">
                  Earned {b.awardedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </span>
            </li>
          ))}
          {certs.map((c) => (
            <li key={c.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mod-uni-a/15 text-electric-text">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-100">{c.courseTitle}</span>
                <span className="block text-xs text-muted">Course completed · {c.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
