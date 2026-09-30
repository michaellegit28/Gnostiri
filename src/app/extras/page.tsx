import prisma from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionMark } from "@/components/logo/GnostiriLogo";

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
            <span>Discovery — beyond the curriculum</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Keep going <span className="text-[#D4AF37]">deeper</span>
          </h1>
          <p className="text-slate-300/90 text-base md:text-lg max-w-2xl mx-auto font-light">
            Enter a subject and wander — every idea opens into the next,
            far past anything school ever taught you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {DEPTHS.map((d, i) => (
              <span key={d} className="flex items-center gap-2 text-xs text-slate-400">
                <span
                  className={`px-3 py-1 rounded-full border ${
                    i === 0
                      ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
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
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          <div><dd className="font-serif text-3xl font-bold text-[#D4AF37]">{fields.length}</dd><dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Fields open</dt></div>
          <div><dd className="font-serif text-3xl font-bold text-[#D4AF37]">{fields.reduce((s, f) => s + f.children.length, 0)}</dd><dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Trails to wander</dt></div>
          <div><dd className="font-serif text-3xl font-bold text-[#D4AF37]">4</dd><dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Depth levels</dt></div>
        </dl>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Fields of knowledge — choose where to begin wandering</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <article
              key={field.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-violet-950/40 via-slate-900 to-slate-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl hover:shadow-[#D4AF37]/5"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
              <h2 className="font-serif text-2xl font-bold group-hover:text-[#D4AF37] transition-colors">
                {field.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {field.children.length > 0
                  ? `${field.children.length} paths to wander`
                  : field.lessons.length > 0
                    ? "A guided trail with practice"
                    : "New territory being charted"}
              </p>
              <Link
                href={`/extras/${field.id}`}
                className="mt-5 inline-flex items-center gap-2 min-h-[44px] rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-[#D4AF37] hover:text-slate-950 hover:border-transparent transition-colors"
              >
                Enter field
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
        {fields.length === 0 && (
          <p className="text-slate-400">New fields of knowledge are being charted. Check back soon.</p>
        )}
      </div>
    </main>
  );
}
