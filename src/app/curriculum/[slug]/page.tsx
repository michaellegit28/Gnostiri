import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import CurriculumAlignmentWidget from "@/components/curriculum/CurriculumAlignmentWidget";
import AlignmentDisclaimer from "@/components/curriculum/AlignmentDisclaimer";
import LiteModeBanner from "@/components/curriculum/LiteModeBanner";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function pill(tier: string) {
  if (tier === "core") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (tier === "elective") return "bg-amber-50 text-amber-800 border border-amber-300";
  return "bg-red-50 text-red-700 border border-red-200 opacity-75";
}

// Master topic page: description + per-country alignment matrix + interactive widget.
export default async function CurriculumTopicPage({ params, searchParams }: { params: { slug: string }; searchParams?: { lite?: string } }) {
  const lite = searchParams?.lite === "1";
  const topic = await prisma.topic.findFirst({
    where: { slug: params.slug },
    include: { department: true, alignments: { include: { board: { include: { region: true } }, track: true } } },
  });
  if (!topic) notFound();

  const byRegion = new Map<string, { region: string; rows: typeof topic.alignments }>();
  for (const a of topic.alignments) {
    const key = a.board.region.name;
    if (!byRegion.has(key)) byRegion.set(key, { region: key, rows: [] });
    byRegion.get(key)!.rows.push(a);
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <LiteModeBanner />
        <nav className="text-sm text-slate-400"><Link href="/curriculum" className="hover:text-amber-400">Curriculum</Link> <span>→ {topic.department?.name}</span></nav>
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-teal-400 text-sm">{topic.department?.name}</p>
            <h1 className="mt-1 font-serif text-4xl font-bold">{topic.title}</h1>
            {topic.description && <p className="mt-3 text-slate-400">{topic.description}</p>}
          </div>
          <div className="shrink-0"><CurriculumAlignmentWidget topicSlug={topic.slug!} lite={lite} /></div>
        </header>

        <section aria-label="Country alignment matrix" className="space-y-4">
          <h2 className="font-bold text-lg">Country tags ({byRegion.size || "none yet — pending human verification"})</h2>
          {Array.from(byRegion.values()).map(({ region, rows }) => (
            <div key={region} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="font-semibold text-sm text-slate-300">{region}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {rows.map((a) => (
                  <span key={a.id} aria-label={`${a.board.name} ${a.tier}`} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pill(a.tier)}`}>
                    {a.board.name}: {a.tier}{a.track ? ` (${a.track.name})` : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <AlignmentDisclaimer lastAudited={topic.lastAuditedDate ? new Date(topic.lastAuditedDate).toISOString().slice(0, 10) : null} />
      </div>
    </div>
  );
}
