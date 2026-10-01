import Link from "next/link";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 60;

// Browsable master curriculum: 11 departments → 56 topics, filterable by country tag.
export default async function CurriculumIndex({ searchParams }: { searchParams?: { region?: string } }) {
  const regions = await prisma.region.findMany({ orderBy: { name: "asc" }, include: { boards: true } });
  const fRegion = searchParams?.region || "";
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    include: { topics: { where: { id: { startsWith: "master-" } }, orderBy: { title: "asc" }, include: { alignments: fRegion ? { where: { board: { regionId: fRegion } } } : true } } },
  });
  const total = departments.reduce((n, d) => n + d.topics.length, 0);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <nav className="text-sm text-slate-400"><Link href="/" className="hover:text-amber-400">Home</Link> <span>→ Curriculum</span></nav>
        <header className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">Master curriculum</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold">Subjects, countries, topics</h1>
          <p className="text-slate-400 text-sm md:text-base">{departments.length} subjects · {total} topics · {regions.length} country tags. Green = human-verified core.</p>
        </header>

        <form method="get" className="flex items-center gap-2 text-sm">
          <label>Country tag
            <select name="region" defaultValue={fRegion} className="ml-2 bg-slate-900 border border-slate-700 rounded px-2 py-1.5">
              <option value="">All countries</option>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.boards.length} boards)</option>)}
            </select>
          </label>
          <button className="px-3 py-1.5 rounded bg-amber-500 text-slate-950 font-semibold" type="submit">Filter</button>
        </form>

        {departments.map((d) => (
          <section key={d.id} aria-label={d.name} className="space-y-3">
            <h2 className="text-xl font-serif font-bold">{d.name} <span className="text-xs text-slate-500 font-sans">· {d.topics.length}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {d.topics.map((t) => {
                const cores = t.alignments.filter((a) => a.tier === "core").length;
                const totalBoards = fRegion ? t.alignments.length : undefined;
                return (
                  <Link key={t.id} href={`/curriculum/${t.slug}`} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-amber-500/40 transition-colors">
                    <h3 className="font-semibold text-slate-100">{t.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {t.needsVerification ? "Pending verification" : "Verified"} {cores > 0 && <span className="text-emerald-400">· core in {cores}{totalBoards ? `/${totalBoards}` : ""}</span>}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
