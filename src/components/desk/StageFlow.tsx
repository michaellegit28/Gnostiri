import Link from "next/link";
import { Check, Circle, Loader2, Minus, TriangleAlert } from "lucide-react";

/**
 * StageFlow — the Desk pipeline, made legible.
 *
 * The five stages mirror the REAL fields the pipeline writes, in the order it
 * writes them: the document row (Upload), status leaving "processing"
 * (Process), the stored notes sections (Notes), StudyTask rows (Plans) and
 * DocumentQuizItem rows (Quizzes). Nothing here is decorative — every stage
 * describes work that actually happens in src/app/api/documents, and the
 * "skipped" state is a real pipeline outcome (no AI model configured).
 *
 * A stage is only a link when the caller hands it an `href`, and only ever to
 * a section that already exists on the page — no stage is a fake control.
 */

export type StageState = "done" | "active" | "pending" | "skipped" | "failed";

export interface Stage {
  key: string;
  label: string;
  hint: string;
  state: StageState;
  href?: string;
}

/** StudyDocument.status labels — the four real states, never invented ones. */
export const DOCUMENT_STATUS_LABEL: Record<string, string> = {
  processing: "Processing",
  ready: "Ready",
  "needs-ai": "Notes only (no AI quiz)",
  failed: "Failed",
};

const STATE_META: Record<StageState, { icon: typeof Check; chip: string; iconClass: string }> = {
  done: { icon: Check, chip: "border-emerald-500/40 bg-emerald-500/10", iconClass: "text-emerald-300" },
  active: { icon: Loader2, chip: "border-cyan-400/40 bg-cyan-400/10", iconClass: "text-cyan-300" },
  pending: { icon: Circle, chip: "border-line bg-surface-2", iconClass: "text-muted" },
  skipped: { icon: Minus, chip: "border-amber-500/40 bg-amber-500/10", iconClass: "text-amber-300" },
  failed: { icon: TriangleAlert, chip: "border-rose-500/40 bg-rose-500/10", iconClass: "text-rose-300" },
};

export default function StageFlow({ stages, label }: { stages: Stage[]; label: string }) {
  return (
    <section aria-label={label} className="gn-shadow rounded-2xl border border-line bg-surface/40 p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">{label}</p>
      <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {stages.map((stage, index) => {
          const meta = STATE_META[stage.state];
          const Icon = meta.icon;
          const body = (
            <>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${meta.chip}`}
                aria-hidden
              >
                <Icon className={`h-3.5 w-3.5 ${meta.iconClass} ${stage.state === "active" ? "animate-spin" : ""}`} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-100">
                  <span className="mr-1.5 font-mono text-[11px] text-muted">{index + 1}</span>
                  {stage.label}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{stage.hint}</span>
              </span>
            </>
          );
          return (
            <li key={stage.key}>
              {stage.href ? (
                <Link
                  href={stage.href}
                  className="gn-motion gn-lift flex h-full items-start gap-2.5 rounded-xl border border-line bg-surface p-3 hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex h-full items-start gap-2.5 rounded-xl border border-line bg-surface p-3">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
