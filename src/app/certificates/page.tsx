import Link from "next/link";
import { FileBadge, GraduationCap, Medal } from "lucide-react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { displayHandle, tierInfo } from "@/lib/ranking";
import { rankLabel, verificationCode } from "@/lib/certificate";

export const dynamic = "force-dynamic";

type AwardGroup = {
  seasonSlug: string;
  tier: number;
  name: string;
};

function groupKey(group: AwardGroup) {
  return `${group.seasonSlug}:${group.tier}:${group.name}`;
}

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 text-center md:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-text">Certificates</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink">Your awards live behind your account</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in to see season certificates you actually earned and course-completion certificates.
        </p>
        <Link
          href="/login"
          className="gn-motion mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const [memberships, courseCertificates, seasons] = await Promise.all([
    prisma.leagueGroupMember.findMany({
      where: { userId: user.id },
      select: {
        joinedAt: true,
        group: { select: { seasonSlug: true, tier: true, name: true } },
      },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.certificate.findMany({
      where: { userId: user.id, domain: "university" },
      orderBy: { issuedAt: "desc" },
      select: { id: true, issuedAt: true, course: { select: { title: true } } },
    }),
    prisma.season.findMany({ select: { slug: true, name: true } }),
  ]);

  const uniqueGroups = Array.from(
    new Map(memberships.map((membership) => [groupKey(membership.group), membership.group])).values()
  );
  const awards = uniqueGroups.length
    ? await prisma.hallOfFameEntry.findMany({
        where: {
          OR: uniqueGroups.map((group) => ({
            seasonSlug: group.seasonSlug,
            tier: group.tier,
            groupName: group.name,
          })),
        },
        orderBy: [{ seasonSlug: "desc" }, { tier: "asc" }, { rank: "asc" }],
      })
    : [];
  const seasonName = new Map(seasons.map((season) => [season.slug, season.name]));
  const memberHandle = displayHandle(user.name);
  const canVerify = Boolean(process.env.LAUNCH_SECRET);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-text">Certificates</p>
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">Your verified awards</h1>
        <p className="max-w-2xl text-sm text-muted">
          Season awards and course-completion certificates that belong to your account. Nothing here is a
          placeholder or a future promise.
        </p>
      </header>

      <section aria-labelledby="season-awards" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="season-awards" className="font-serif text-2xl font-bold text-ink">
            Season awards
          </h2>
          <Link
            href="/league/hall-of-fame"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View the Hall of Fame
          </Link>
        </div>

        {awards.length === 0 ? (
          <div className="gn-card rounded-2xl border border-line bg-surface px-6 py-9 text-center">
            <Medal className="mx-auto h-7 w-7 text-gold-text" aria-hidden />
            <p className="mt-3 font-semibold text-ink">No season certificate yet</p>
            <p className="mt-2 text-sm text-muted">
              Finish a season with a winning group and its certificate will appear here.
            </p>
            <Link
              href="/league/ladder"
              className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Open the ranking ladder
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {awards.map((award) => {
              const group = uniqueGroups.find(
                (candidate) =>
                  candidate.seasonSlug === award.seasonSlug &&
                  candidate.tier === award.tier &&
                  candidate.name === award.groupName
              );
              const code = verificationCode({
                seasonSlug: award.seasonSlug,
                tier: award.tier,
                rank: award.rank,
                groupName: award.groupName,
                rosterJson: award.rosterJson,
              });
              const downloadUrl = `/api/ranking/certificate?season=${encodeURIComponent(award.seasonSlug)}&tier=${award.tier}&member=${encodeURIComponent(user.id)}`;
              const rosterSeat = award.rosterJson.indexOf(memberHandle) + 1;
              const isWinningGroupMember = Boolean(group);
              return (
                <li key={award.id} className="gn-card rounded-2xl border border-line bg-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">
                        {seasonName.get(award.seasonSlug) ?? award.seasonSlug}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-bold text-ink">
                        {tierInfo(award.tier).label} · {rankLabel(award.rank)}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{award.groupName}</p>
                    </div>
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-text">
                      {Math.round(award.avgStars).toLocaleString()} avg stars
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-muted">
                    Issued {award.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    {rosterSeat > 0 ? ` · roster seat ${rosterSeat}` : ""}
                    {rosterSeat <= 0 && isWinningGroupMember ? " · winning group member" : ""}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={downloadUrl}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gold/40 px-4 text-sm font-semibold text-gold-text transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <FileBadge className="h-4 w-4" aria-hidden />
                      Download certificate
                    </a>
                    {canVerify ? (
                      <Link
                        href={`/verify?code=${code}`}
                        className="inline-flex min-h-[44px] items-center rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Verify code {code}
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="course-certificates" className="space-y-4">
        <h2 id="course-certificates" className="font-serif text-2xl font-bold text-ink">
          Course completion
        </h2>
        {courseCertificates.length === 0 ? (
          <div className="gn-card rounded-2xl border border-line bg-surface px-6 py-9 text-center">
            <GraduationCap className="mx-auto h-7 w-7 text-electric-text" aria-hidden />
            <p className="mt-3 font-semibold text-ink">No course certificate yet</p>
            <p className="mt-2 text-sm text-muted">Complete a university course to earn its certificate.</p>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {courseCertificates.map((certificate) => (
              <li key={certificate.id} className="gn-card rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric/10 text-electric-text">
                    <GraduationCap className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink">{certificate.course.title}</h3>
                    <p className="mt-1 text-xs text-muted">
                      Issued {certificate.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <Link
                      href={`/certificates/${certificate.id}`}
                      className="mt-4 inline-flex min-h-[44px] items-center rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Open certificate
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
