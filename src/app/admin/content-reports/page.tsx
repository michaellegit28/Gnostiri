import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { setReportStatus, deleteReport } from "./actions";
import { REPORT_STATUSES } from "@/lib/content-reports";

export const dynamic = "force-dynamic";

function pill(status: string) {
  if (status === "open") return "bg-red-50 text-red-700 border border-red-300";
  if (status === "triaged") return "bg-amber-50 text-amber-800 border border-amber-300";
  if (status === "fixed") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  return "bg-slate-100 text-slate-500 border border-slate-300";
}

function isReportStatus(v: string): boolean {
  return (REPORT_STATUSES as readonly string[]).includes(v);
}

export default async function AdminContentReportsPage({ searchParams }: { searchParams: { status?: string } }) {
  const { authorized, reason } = await requireAdmin();
  if (!authorized) return <div className="p-8 text-slate-200">Not authorized ({reason}). Set ADMIN_EMAILS env to allowlist admin emails.</div>;

  const fStatus = searchParams.status && isReportStatus(searchParams.status) ? searchParams.status : "";
  const where = fStatus ? { status: fStatus } : {};

  const [reports, counts] = await Promise.all([
    prisma.contentReport.findMany({
      where,
      include: { reporter: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    Promise.all(REPORT_STATUSES.map(async (status) => ({ status, n: await prisma.contentReport.count({ where: { status } }) }))),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Admin</p>
        <h1 className="text-3xl font-serif font-bold">Content Reports</h1>
        <p className="text-slate-400 text-sm mt-1">What learners actually flagged on the page — the discreet &quot;Spotted a problem&quot; channel.</p>
      </header>

      <section aria-label="Status counts" className="flex flex-wrap gap-3 text-sm">
        {counts.map((c) => (
          <span key={c.status} className={`rounded-full px-3 py-1 text-xs font-semibold ${pill(c.status)}`}>
            {c.status}: {c.n}
          </span>
        ))}
      </section>

      <section aria-label="Filters" className="flex flex-wrap gap-3 text-sm">
        <form method="get" className="flex flex-wrap gap-2 items-center">
          <label>Status{" "}
            <select name="status" defaultValue={fStatus} className="bg-slate-900 border border-slate-700 rounded px-2 py-1">
              <option value="">All</option>
              {REPORT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <button className="px-3 py-1 rounded bg-gold text-slate-950 font-semibold" type="submit">Filter</button>
          <a href="/admin/content-reports" className="px-3 py-1 rounded border border-slate-700">Clear</a>
        </form>
      </section>

      <section aria-label="Reports" className="space-y-3">
        <h2 className="font-bold text-lg">Reports ({reports.length})</h2>
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr><th className="text-left p-3">Created</th><th className="text-left p-3">Domain</th><th className="text-left p-3">Type</th><th className="text-left p-3">Target</th><th className="text-left p-3">Category</th><th className="text-left p-3">Reporter</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t border-slate-800">
                  <td className="p-3 text-xs whitespace-nowrap">{new Date(r.createdAt).toISOString().slice(0, 10)}</td>
                  <td className="p-3 text-xs">{r.domain}</td>
                  <td className="p-3 text-xs">{r.targetType}</td>
                  <td className="p-3">
                    <div className="max-w-xs whitespace-pre-wrap break-words">{r.detail.length > 160 ? `${r.detail.slice(0, 160)}…` : r.detail}</div>
                    <div className="text-xs text-slate-400">{r.targetTitle || r.targetId}</div>
                    <a href={r.targetUrl} className="text-xs text-gold underline break-all" target="_blank" rel="noreferrer">{r.targetUrl}</a>
                  </td>
                  <td className="p-3 text-xs">{r.category}</td>
                  <td className="p-3 text-xs">{r.reporter?.email || r.reporterEmail || "?"}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pill(r.status)}`}>{r.status}</span></td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {REPORT_STATUSES.filter((s) => s !== r.status).map((s) => (
                        <form key={s} action={setReportStatus}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={s} /><button className="text-xs px-2 py-1 border border-slate-700 rounded" type="submit">→{s}</button></form>
                      ))}
                      <form action={deleteReport}><input type="hidden" name="id" value={r.id} /><button className="text-xs px-2 py-1 border border-red-800 text-red-300 rounded" type="submit">Delete</button></form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reports.length === 0 && <p className="text-sm text-slate-400">No reports match this filter.</p>}
      </section>
    </div>
  );
}
