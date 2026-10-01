import prisma from "@/lib/db";
import { requireAdmin, daysSince } from "@/lib/admin-auth";
import { createAlignment, updateAlignment, deleteAlignment } from "./actions";
import CsvImporter from "./CsvImporter";

export const dynamic = "force-dynamic";

function pill(tier: string) {
  if (tier === "core") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (tier === "elective") return "bg-amber-50 text-amber-800 border border-amber-300";
  return "bg-red-50 text-red-700 border border-red-200 opacity-75";
}

export default async function AdminAlignmentsPage({ searchParams }: { searchParams: { region?: string; board?: string; dept?: string; tier?: string } }) {
  const { authorized, reason } = await requireAdmin();
  if (!authorized) return <div className="p-8 text-slate-200">Not authorized ({reason}). Set ADMIN_EMAILS env to allowlist admin emails.</div>;

  const regions = await prisma.region.findMany({ orderBy: { name: "asc" } });
  const boards = await prisma.curriculumBoard.findMany({ include: { region: true }, orderBy: { name: "asc" } });
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });
  const topics = await prisma.topic.findMany({ where: { slug: { not: null } }, select: { id: true, slug: true, title: true }, orderBy: { title: "asc" }, take: 500 });

  const fRegion = searchParams.region || "";
  const fBoard = searchParams.board || "";
  const fDept = searchParams.dept || "";
  const fTier = searchParams.tier || "";

  const alignments = await prisma.topicBoardAlignment.findMany({
    where: {
      ...(fTier && ["core", "elective", "excluded"].includes(fTier) ? { tier: fTier as "core" | "elective" | "excluded" } : {}),
      ...(fBoard ? { boardId: fBoard } : fRegion ? { board: { regionId: fRegion } } : {}),
      ...(fDept ? { topic: { departmentId: fDept } } : {}),
    },
    include: { topic: { select: { title: true, slug: true, department: true } }, board: { include: { region: true } }, track: true },
    orderBy: { verifiedDate: "asc" },
    take: 200,
  });

  const pending = await prisma.topic.findMany({ where: { needsVerification: true }, select: { id: true, slug: true, title: true }, orderBy: { title: "asc" }, take: 100 });
  const audits = await prisma.alignmentAudit.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400">Admin</p>
        <h1 className="text-3xl font-serif font-bold">Topic–Board Alignments</h1>
        <p className="text-slate-400 text-sm mt-1">Human-verified only. Default to elective when uncertain. verifiedDate is never null.</p>
      </header>

      <section aria-label="Filters" className="flex flex-wrap gap-3 text-sm">
        <form method="get" className="flex flex-wrap gap-2 items-center">
          <label>Region <select name="region" defaultValue={fRegion} className="bg-slate-900 border border-slate-700 rounded px-2 py-1"><option value="">All</option>{regions.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.isoCode})</option>)}</select></label>
          <label>Board <select name="board" defaultValue={fBoard} className="bg-slate-900 border border-slate-700 rounded px-2 py-1"><option value="">All</option>{boards.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.region.name}</option>)}</select></label>
          <label>Dept <select name="dept" defaultValue={fDept} className="bg-slate-900 border border-slate-700 rounded px-2 py-1"><option value="">All</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
          <label>Tier <select name="tier" defaultValue={fTier} className="bg-slate-900 border border-slate-700 rounded px-2 py-1"><option value="">All</option><option value="core">core</option><option value="elective">elective</option><option value="excluded">excluded</option></select></label>
          <button className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-semibold" type="submit">Filter</button>
          <a href="/admin/alignments" className="px-3 py-1 rounded border border-slate-700">Clear</a>
        </form>
      </section>

      <section aria-label="Alignments" className="space-y-3">
        <h2 className="font-bold text-lg">Alignments ({alignments.length})</h2>
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr><th className="text-left p-3">Topic</th><th className="text-left p-3">Board</th><th className="text-left p-3">Tier</th><th className="text-left p-3">Verified</th><th className="text-left p-3">Age</th><th className="text-left p-3">Actions</th></tr>
            </thead>
            <tbody>
              {alignments.map((a) => {
                const age = daysSince(a.verifiedDate);
                const stale = age > 90;
                return (
                  <tr key={a.id} className="border-t border-slate-800">
                    <td className="p-3">{a.topic.title}<div className="text-xs text-slate-500">{a.topic.slug} {a.track ? `· ${a.track.name}` : "· all tracks"}</div></td>
                    <td className="p-3">{a.board.name}<div className="text-xs text-slate-500">{a.board.region.name}</div></td>
                    <td className="p-3"><span aria-label={`${a.tier} syllabus tier`} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pill(a.tier)}`}>{a.tier}</span></td>
                    <td className="p-3 text-xs">{new Date(a.verifiedDate).toISOString().slice(0, 10)}</td>
                    <td className="p-3 text-xs">{stale ? <span role="alert" className="text-red-400 font-bold">{age}d — review overdue</span> : <span>{age}d</span>}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {(["core", "elective", "excluded"] as const).filter((t) => t !== a.tier).map((t) => (
                          <form key={t} action={updateAlignment}><input type="hidden" name="id" value={a.id} /><input type="hidden" name="tier" value={t} /><button className="text-xs px-2 py-1 border border-slate-700 rounded" type="submit">→{t}</button></form>
                        ))}
                        <form action={deleteAlignment}><input type="hidden" name="id" value={a.id} /><button className="text-xs px-2 py-1 border border-red-800 text-red-300 rounded" type="submit">Delete</button></form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="Create" className="border border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="font-bold">Create alignment (verified today, human audit)</h2>
        <form action={createAlignment} className="flex flex-wrap gap-2 text-sm">
          <select name="topicId" required className="bg-slate-900 border border-slate-700 rounded px-2 py-1"><option value="">Topic…</option>{topics.map((t) => <option key={t.id} value={t.id}>{t.title} ({t.slug})</option>)}</select>
          <select name="boardId" required className="bg-slate-900 border border-slate-700 rounded px-2 py-1"><option value="">Board…</option>{boards.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <select name="tier" required className="bg-slate-900 border border-slate-700 rounded px-2 py-1"><option value="elective">elective (safe default)</option><option value="core">core</option><option value="excluded">excluded</option></select>
          <input name="weightNotes" placeholder="weight notes" className="bg-slate-900 border border-slate-700 rounded px-2 py-1" />
          <button className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-semibold" type="submit">Create</button>
        </form>
        <p className="text-xs text-slate-500">Leave track empty = applies to all tracks. Core only with human verification.</p>
      </section>

      <section aria-label="CSV import" className="border border-slate-800 rounded-xl p-4 space-y-2">
        <h2 className="font-bold">Bulk CSV import (topic_slug,board_name,track_name,tier,weight_notes)</h2>
        <p className="text-xs text-slate-500">Entire batch rejected if any slug/board/tier invalid. Paste CSV then Import.</p>
        <CsvImporter />
      </section>
      <section aria-label="Pending verification" className="border border-dashed border-amber-500/40 rounded-xl p-4">
        <h2 className="font-bold">Pending Verification ({pending.length})</h2>
        <ul className="text-sm text-slate-300 list-disc ml-5 mt-2">
          {pending.map((t) => <li key={t.id}>{t.title} <span className="text-slate-500">({t.slug})</span></li>)}
        </ul>
      </section>

      <section aria-label="Audit log" className="space-y-2">
        <h2 className="font-bold text-lg">Audit log (latest 50)</h2>
        <div className="text-xs space-y-1">
          {audits.map((l) => (
            <div key={l.id} className="border border-slate-800 rounded p-2">
              <span className="font-mono text-slate-400">{new Date(l.createdAt).toISOString()}</span> <b>{l.action}</b> {l.alignmentId} by {l.actorEmail || "?"}
              <pre className="text-slate-500 whitespace-pre-wrap">prev={JSON.stringify(l.previousValue)} new={JSON.stringify(l.newValue)}</pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
