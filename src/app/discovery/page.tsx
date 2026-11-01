import prisma from "@/lib/db";
import { Sparkles } from "lucide-react";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import StatCard from "@/components/ui/StatCard";
import TopicCard from "@/components/ui/TopicCard";

export const dynamic = "force-dynamic";

const DEPTHS = ["Understand", "Explore", "Go Deeper", "Research"];

export default async function ExtrasPage() {
  const fields: { id: string; title: string; children: { id: string }[]; lessons: { id: string }[] }[] =
    await prisma.topic.findMany({
    where: { domain: "extras", isPublished: true, parentId: null },
    include: {
      children: { where: { domain: "extras", isPublished: true } },
      lessons: { where: { domain: "extras" } },
    },
    orderBy: { orderIndex: "asc" },
  });

  return (
    <main className="min-h-screen bg-transparent text-slate-50">
      {/* Immersive hero — distinct from the structured exam pages */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#1b1440_0%,#0d0a24_45%,#060814_100%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_70%_20%,rgba(255,255,255,0.5),transparent),radial-gradient(1.5px_1.5px_at_40%_70%,rgba(212,175,55,0.6),transparent),radial-gradient(1px_1px_at_85%_65%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_55%_45%,rgba(255,255,255,0.4),transparent)]"
        />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <SectionMark variant="discovery" className="w-4 h-4 text-violet-300" accent="#a78bfa" />
            <span>Discovery — beyond the syllabus</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Read past <span className="text-gold">your syllabus</span>
          </h1>
          <p className="text-slate-300/90 text-base md:text-lg max-w-2xl mx-auto font-light">
            Pick a field and read from the basics up to research level — topics your
            school syllabus leaves out.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {DEPTHS.map((d, i) => (
              <span key={d} className="flex items-center gap-2 text-xs text-slate-400">
                <span
                  className={`px-3 py-1 rounded-full border ${
                    i === 0
                      ? "border-gold/40 bg-gold/10 text-gold"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {d}
                </span>
                {i < DEPTHS.length - 1 && <span className="text-slate-600">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-8">
        <dl className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Fields open" value={fields.length} accent="gold" />
          <StatCard
            label="Trails"
            value={fields.reduce((s, f) => s + f.children.length, 0)}
            accent="violet"
          />
          <StatCard label="Depth levels" value={DEPTHS.length} accent="gold" />
        </dl>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-gold" />
          <span>Fields of knowledge — pick where to start</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <TopicCard
              key={field.id}
              href={`/discovery/${field.id}`}
              title={field.title}
              tone="violet"
              tag={field.children.length > 0 ? `${field.children.length} paths` : undefined}
              blurb={
                field.children.length > 0
                  ? "Read from overview to research level"
                  : field.lessons.length > 0
                    ? "A guided trail with practice"
                    : "New field, no lessons yet"
              }
              cta="Enter field"
            />
          ))}
        </div>
        {fields.length === 0 && (
          <p className="text-slate-400">No fields published yet. Check back soon.</p>
        )}
      </div>
    </main>
  );
}
