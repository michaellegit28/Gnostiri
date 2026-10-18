import { ShieldCheck, TriangleAlert } from "lucide-react";

// VerifiedBadge — "Format Verified" card for every manifest surface.
// Bound fields: lastVerified + syllabusUrl travel with the manifest (RULE 5).
// formatLabel is optional: surfaces without board-level format data omit the row.
// Server-safe. Stale (>6 months, caller-computed) renders amber; fresh teal.

type VerifiedBadgeProps = {
  board: string;
  code: string;
  formatLabel?: string | null;
  lastVerified: string;
  syllabusUrl?: string | null;
  stale?: boolean;
};

export default function VerifiedBadge({
  board,
  code,
  formatLabel,
  lastVerified,
  syllabusUrl,
  stale = false,
}: VerifiedBadgeProps) {
  return (
    <aside
      aria-label={`Format verified: ${board}`}
      className={`rounded-2xl border p-4 text-sm md:p-5 ${
        stale
          ? "border-amber-500/40 bg-amber-500/[0.07]"
          : "border-teal-500/30 bg-teal-500/[0.06]"
      }`}
    >
      <p className="flex items-center gap-2 font-semibold text-slate-100">
        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-teal-400" />
        {board} ({code}) — Verified
      </p>
      {formatLabel != null && formatLabel !== "" && (
        <p className="mt-1 text-slate-300">Format: {formatLabel}</p>
      )}
      <p className="mt-1 text-slate-400">
        Last verified: {lastVerified}
        {syllabusUrl != null && syllabusUrl !== "" && (
          <>
            {" · "}
            <a
              href={syllabusUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              Official syllabus
            </a>
          </>
        )}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
        <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5" />
        Always confirm with your syllabus.
      </p>
    </aside>
  );
}
