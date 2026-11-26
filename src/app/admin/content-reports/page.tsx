import Link from "next/link";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { setReportStatus, deleteReport } from "./actions";
import {
  isInternalTargetUrl,
  isReportStatus,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_TRANSITIONS,
  REPORT_STATUSES,
  type ReportStatus,
} from "@/lib/content-reports";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

function pill(status: ReportStatus) {
  if (status === "open") return "border-error/40 bg-error/10 text-rose-300";
  if (status === "triaged") return "border-warning/40 bg-warning/10 text-amber-200";
  if (status === "fixed") return "border-success/40 bg-success/10 text-emerald-200";
  return "border-line-strong bg-surface-2 text-slate-300";
}

function transitionLabel(from: ReportStatus, to: ReportStatus) {
  if (to === "triaged" && (from === "fixed" || from === "rejected")) return "Reopen for review";
  if (to === "open") return "Return to open";
  if (to === "triaged") return "Mark triaged";
  if (to === "fixed") return "Mark fixed";
  return "Mark not upheld";
}

function pageHref(status: ReportStatus | null, page: number) {
  const params = new URLSearchParams();
  params.set("status", status ?? "all");
  if (page > 1) params.set("page", String(page));
  return `/admin/content-reports?${params.toString()}`;
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AdminContentReportsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const { authorized, reason } = await requireAdmin();
  if (!authorized) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl bg-bg px-5 py-12 text-ink md:p-10">
        <section role="alert" className="gn-card rounded-2xl border border-error/30 p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-300">Admin access unavailable</p>
          <h1 className="mt-2 font-serif text-2xl font-bold">The report queue is locked</h1>
          <p className="mt-3 text-sm text-muted">
            {reason}. Set <code>ADMIN_EMAILS</code> to the comma-separated emails that may review reports.
          </p>
        </section>
      </main>
    );
  }

  const rawStatus = searchParams.status?.trim().toLowerCase();
  const statusFilter: ReportStatus | null =
    rawStatus === "all" ? null : rawStatus && isReportStatus(rawStatus) ? rawStatus : "open";
  const where = statusFilter ? { status: statusFilter } : {};
  const requestedPage = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);

  const [groupedCounts, totalCount] = await Promise.all([
    prisma.contentReport.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.contentReport.count(),
  ]);
  const countByStatus = new Map(groupedCounts.map((row) => [row.status, row._count._all]));
  const matchingCount = statusFilter ? countByStatus.get(statusFilter) ?? 0 : totalCount;
  const totalPages = Math.max(1, Math.ceil(matchingCount / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const reports = await prisma.contentReport.findMany({
    where,
    include: { reporter: { select: { email: true, name: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const resolverIds = Array.from(
    new Set(reports.map((report) => report.resolvedBy).filter((id): id is string => Boolean(id)))
  );
  const resolvers = resolverIds.length
    ? await prisma.user.findMany({
        where: { id: { in: resolverIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const resolverById = new Map(resolvers.map((resolver) => [resolver.id, resolver]));

  const firstShown = matchingCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(page * PAGE_SIZE, matchingCount);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-8 bg-bg px-5 py-8 text-ink md:p-10">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-text">Admin</p>
        <h1 className="font-serif text-3xl font-bold">Content reports</h1>
        <p className="max-w-3xl text-sm text-muted">
          Triage what learners flagged. A report is learner feedback, not a content-verification verdict.
        </p>
      </header>

      <section aria-label="Status counts" className="flex flex-wrap gap-2 text-sm">
        <Link
          href={pageHref(null, 1)}
          aria-current={statusFilter === null ? "page" : undefined}
          className="rounded-full border border-line-strong bg-surface px-3 py-2 font-semibold text-muted transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          All: {totalCount}
        </Link>
        {REPORT_STATUSES.map((status) => (
          <Link
            key={status}
            href={pageHref(status, 1)}
            aria-current={statusFilter === status ? "page" : undefined}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${pill(status)}`}
          >
            {REPORT_STATUS_LABELS[status]}: {countByStatus.get(status) ?? 0}
          </Link>
        ))}
      </section>

      <section aria-label="Filters" className="flex flex-wrap items-center gap-3 text-sm">
        <form method="get" className="flex flex-wrap items-center gap-2">
          <label className="text-muted">
            Status
            <select
              name="status"
              defaultValue={statusFilter ?? "all"}
              className="ml-2 min-h-[44px] rounded-lg border border-line bg-surface px-3 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {REPORT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {REPORT_STATUS_LABELS[status]}
                </option>
              ))}
              <option value="all">All</option>
            </select>
          </label>
          <button
            type="submit"
            className="gn-btn-gold min-h-[44px] rounded-lg px-4 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Apply
          </button>
        </form>
        <Link
          href="/admin/content-reports?status=all"
          className="inline-flex min-h-[44px] items-center rounded-lg border border-line-strong px-4 font-semibold text-muted transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View every report
        </Link>
      </section>

      <section aria-label="Reports" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              {statusFilter ? `${REPORT_STATUS_LABELS[statusFilter]} reports` : "All reports"}
            </h2>
            <p className="mt-1 text-xs text-muted">
              {matchingCount === 0
                ? "No matching reports"
                : `Showing ${firstShown}–${lastShown} of ${matchingCount} matching report${matchingCount === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {reports.length > 0 ? (
          <div className="gn-card overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[1100px] text-sm">
              <caption className="sr-only">Learner content reports and triage actions</caption>
              <thead className="bg-surface-2 text-left text-muted">
                <tr>
                  <th scope="col" className="p-3">Created</th>
                  <th scope="col" className="p-3">Report</th>
                  <th scope="col" className="p-3">Target</th>
                  <th scope="col" className="p-3">Reporter</th>
                  <th scope="col" className="p-3">Status</th>
                  <th scope="col" className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const status = isReportStatus(report.status) ? report.status : null;
                  const safeTarget = isInternalTargetUrl(report.targetUrl);
                  const resolver = report.resolvedBy ? resolverById.get(report.resolvedBy) : null;
                  const reporterLabel = report.reporter?.name || report.reporterEmail || "Reporter unavailable";
                  const reporterContact = report.reporter?.email || report.reporterEmail;
                  return (
                    <tr key={report.id} className="border-t border-line align-top">
                      <td className="whitespace-nowrap p-3 text-xs text-muted">
                        <time dateTime={new Date(report.createdAt).toISOString()}>{formatDate(report.createdAt)}</time>
                      </td>
                      <td className="max-w-sm p-3">
                        <div className="font-semibold capitalize">{report.category}</div>
                        <div className="mt-1 text-xs text-muted">{report.domain} · {report.targetType}</div>
                        <details className="mt-2">
                          <summary className="min-h-[44px] cursor-pointer py-3 text-xs text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            {report.detail.length > 140 ? `${report.detail.slice(0, 140)}…` : report.detail}
                          </summary>
                          <p className="whitespace-pre-wrap break-words rounded-lg border border-line bg-surface-2 p-3 text-xs leading-relaxed text-slate-200">
                            {report.detail}
                          </p>
                        </details>
                      </td>
                      <td className="max-w-xs p-3">
                        <div className="font-medium">{report.targetTitle || report.targetId}</div>
                        {safeTarget ? (
                          <a
                            href={report.targetUrl}
                            className="mt-1 inline-flex min-h-[44px] items-center break-all text-xs text-gold-text underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Open reported content
                          </a>
                        ) : (
                          <span className="mt-1 block text-xs text-rose-300">Target link hidden: not an internal Gnostiri path</span>
                        )}
                      </td>
                      <td className="max-w-[12rem] p-3 text-xs">
                        <div className="font-medium">{reporterLabel}</div>
                        {reporterContact && reporterContact !== reporterLabel ? (
                          <div className="mt-1 break-all text-muted">{reporterContact}</div>
                        ) : null}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status ? pill(status) : "border border-line-strong bg-surface-2 text-slate-300"}`}>
                          {status ? REPORT_STATUS_LABELS[status] : report.status}
                        </span>
                        {report.resolvedAt ? (
                          <div className="mt-2 max-w-[12rem] text-xs text-muted">
                            Resolved {formatDate(report.resolvedAt)}
                            {resolver ? ` by ${resolver.name || resolver.email}` : ""}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {status
                            ? REPORT_STATUS_TRANSITIONS[status].map((nextStatus) => (
                                <form key={nextStatus} action={setReportStatus}>
                                  <input type="hidden" name="id" value={report.id} />
                                  <input type="hidden" name="status" value={nextStatus} />
                                  <button
                                    type="submit"
                                    className="min-h-[44px] rounded-lg border border-line-strong px-3 text-xs font-semibold text-muted transition-colors hover:border-primary/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                  >
                                    {transitionLabel(status, nextStatus)}
                                  </button>
                                </form>
                              ))
                            : null}
                          <details>
                            <summary className="flex min-h-[44px] cursor-pointer list-none items-center rounded-lg border border-error/30 px-3 text-xs font-semibold text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                              Delete…
                            </summary>
                            <form action={deleteReport} className="mt-2 rounded-lg border border-error/30 bg-error/5 p-3">
                              <input type="hidden" name="id" value={report.id} />
                              <input type="hidden" name="confirmation" value="DELETE" />
                              <button
                                type="submit"
                                className="min-h-[44px] rounded-lg border border-error/40 px-3 text-xs font-semibold text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                Confirm permanent deletion
                              </button>
                            </form>
                          </details>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="gn-card rounded-2xl border border-line bg-surface px-6 py-10 text-center">
            <p className="font-semibold">
              {statusFilter ? `No ${REPORT_STATUS_LABELS[statusFilter].toLowerCase()} reports` : "No content reports yet"}
            </p>
            <p className="mt-2 text-sm text-muted">
              {statusFilter
                ? "Choose another status or view every report."
                : "Learner-submitted reports will appear here when someone flags a problem."}
            </p>
          </div>
        )}

        {totalPages > 1 ? (
          <nav aria-label="Report pages" className="flex flex-wrap items-center justify-between gap-3 text-sm">
            {page > 1 ? (
              <Link
                href={pageHref(statusFilter, page - 1)}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-line-strong px-4 font-semibold text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex min-h-[44px] items-center rounded-lg border border-line/50 px-4 text-disabled" aria-disabled="true">
                Previous
              </span>
            )}
            <span className="text-muted">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link
                href={pageHref(statusFilter, page + 1)}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-line-strong px-4 font-semibold text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex min-h-[44px] items-center rounded-lg border border-line/50 px-4 text-disabled" aria-disabled="true">
                Next
              </span>
            )}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
