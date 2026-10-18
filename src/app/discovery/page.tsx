import Link from "next/link";
import prisma from "@/lib/db";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { ArrowRight, Compass, FlaskConical, Microscope, Newspaper, Telescope } from "lucide-react";
import TopicCard from "@/components/ui/TopicCard";
import StatCard from "@/components/ui/StatCard";

export const dynamic = "force-dynamic";

const MODES = [
  { id: "principles", label: "Principles", desc: "Established laws & theories", accent: "teal", icon: "Atom" },
  { id: "projects", label: "Projects", desc: "Hands-on builds & experiments", accent: "emerald", icon: "FlaskConical" },
  { id: "hypotheses", label: "Hypotheses", desc: "Open questions & frontiers", accent: "rose", icon: "Compass" },
  { id: "news", label: "News", desc: "Latest scientific developments", accent: "sky", icon: "Newspaper" },
] as const;

const FUTURE_LABS = ["Chemistry", "Biology", "Mathematics", "Astronomy", "Neuroscience", "Computer Science"];

interface LabTopic {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  orderIndex: number;
  children: { id: string; title: string }[];
  lessons: { id: string; title: string }[];
}

export default async function DiscoveryPage() {
  const [physics, otherFields] = await Promise.all([
    prisma.topic.findFirst({
      where: { domain: "extras", title: "Physics Lab", isPublished: true, parentId: null },
      include: {
        children: { where: { domain: "extras", isPublished: true }, orderBy: { orderIndex: "asc" } },
        lessons: { where: { domain: "extras" }, orderBy: { orderIndex: "asc" } },
      },
    }),
    prisma.topic.findMany({
      where: { domain: "extras", isPublished: true, parentId: null, NOT: { title: "Physics Lab" } },
      include: {
        children: { where: { domain: "extras", isPublished: true } },
        lessons: { where: { domain: "extras" } },
      },
      orderBy: { orderIndex: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-transparent text-slate-50">
      {/* Hero — research lab */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#1b1440_0%,#0d0a24_45%,#060814_100%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.6),transparent),radial-gradient(1px_1px_at_70%_20%,rgba(212,175,55,0.5),transparent),radial-gradient(1.5px_1.5px_at_40%_70%,rgba(96,165,250,0.4),transparent),radial-gradient(1px_1px_at_85%_65%,rgba(255,255,255,0.4),transparent)]"
        />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <SectionMark variant="discovery" className="w-4 h-4 text-violet-300" accent="#a78bfa" />
            <span>The Discovery Lab</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Research <span className="text-gold">physics</span>
          </h1>
          <p className="text-slate-300/90 text-base md:text-lg max-w-2xl mx-auto font-light">
            Everything physics, every level — from first principles to the research
            frontier. Principles · Projects · Hypotheses · News. Physics is the first
            lab; more fields open later.
          </p>

          {/* Research modes */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto pt-4">
            {MODES.map((mode) => (
              <div
                key={mode.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-gold/40 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  {mode.icon === "Atom" && <div className="w-5 h-5 border-2 border-teal-300/60 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-teal-300 rounded-full" /></div>}
                  {mode.icon === "FlaskConical" && <FlaskConical className="w-5 h-5 text-emerald-300" />}
                  {mode.icon === "Compass" && <Compass className="w-5 h-5 text-rose-300" />}
                  {mode.icon === "Newspaper" && <Newspaper className="w-5 h-5 text-sky-300" />}
                  <span className={`text-xs font-semibold ${mode.accent === "teal" ? "text-teal-300" : mode.accent === "emerald" ? "text-emerald-300" : mode.accent === "rose" ? "text-rose-300" : "text-sky-300"}`}>
                    {mode.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{mode.desc}</p>
              </div>
            ))}
          </div>

          {/* Physics entry — front and center */}
          {physics && (
            <div className="mt-10">
              <LinkLabCard
                href={`/discovery/${physics.slug}`}
                title={physics.title}
                blurb={physics.description ?? "Enter the physics research lab"}
                tag={`${physics.children.length} branches · ${physics.lessons.length} lessons`}
                accent="gold"
                primary
              />
            </div>
          )}
        </div>
      </div>

      {/* Labs */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.25em] text-slate-400">01</span>
            <Compass className="w-5 h-5 text-gold" />
            <h2 className="text-xl md:text-2xl font-serif font-bold">Inaugural Lab — Physics</h2>
            <span className="text-xs text-slate-400">· first lab to open</span>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            All levels of physics, every branch — from foundations to quantum gravity.
            Four research modes in every branch.
          </p>
          {physics ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {physics.children.map((branch) => (
                <TopicCard
                  key={branch.id}
                  href={`/discovery/${physics.slug}/${branch.slug ?? branch.id}`}
                  title={branch.title}
                  tone="gold"
                  tag={`${branch.children.length} paths`}
                  blurb={branch.lessons.length > 0 ? `${branch.lessons.length} lessons` : "Branch being charted"}
                  cta="Enter branch"
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Physics lab content is being seeded. Check back soon.</p>
          )}
        </section>

        {/* Future labs (placeholders) */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.25em] text-slate-400">02</span>
            <Telescope className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-300">Labs coming next</h2>
            <span className="text-xs text-slate-500">· physics opens first</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {FUTURE_LABS.map((lab) => (
              <div
                key={lab}
                className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-slate-500 text-sm font-medium"
              >
                <Microscope className="w-6 h-6 mx-auto mb-2 opacity-40" />
                {lab}
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <dl className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Labs open" value={1} accent="gold" />
          <StatCard label="Physics branches" value={physics?.children.length ?? 0} accent="teal" />
          <StatCard label="Research modes" value={MODES.length} accent="violet" />
        </dl>
      </div>
    </main>
  );
}

function LinkLabCard({
  href,
  title,
  blurb,
  tag,
  accent = "gold",
  primary = false,
}: {
  href: string;
  title: string;
  blurb?: string;
  tag?: string;
  accent?: "gold" | "teal" | "violet" | "emerald" | "rose";
  primary?: boolean;
}) {
  const accentColor = {
    gold: "border-gold/50 bg-gold/5 hover:border-gold/40 hover:bg-gold/10",
    teal: "border-teal-500/50 bg-teal-500/5 hover:border-teal-400/40 hover:bg-teal-500/10",
    violet: "border-violet-500/50 bg-violet-500/5 hover:border-violet-400/40 hover:bg-violet-500/10",
    emerald: "border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-400/40 hover:bg-emerald-500/10",
    rose: "border-rose-500/50 bg-rose-500/5 hover:border-rose-400/40 hover:bg-rose-500/10",
  }[accent];

  return (
    <a
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${primary ? "bg-gradient-to-b from-white/[0.06] to-transparent shadow-xl" : "bg-white/[0.02]"} ${accentColor}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 transition-colors group-hover:text-gold">
          {title}
        </h3>
        {tag && <span className={`shrink-0 text-xs font-semibold ${primary ? "text-gold" : "text-slate-400"}`}>{tag}</span>}
      </div>
      {blurb && <p className="mt-3 text-sm text-slate-400 leading-relaxed">{blurb}</p>}
      <span className="mt-6 inline-flex min-h-[44px] items-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors group-hover:border-transparent group-hover:bg-gold group-hover:text-slate-950">
        Enter lab
        <ArrowRight className="w-4 h-4" />
      </span>
    </a>
  );
}
