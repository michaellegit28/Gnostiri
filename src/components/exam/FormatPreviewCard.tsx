import Link from "next/link";
import { BadgeCheck } from "lucide-react";

// FormatPreviewCard — selector result card. Papers = required paper count,
// duration = Σ required durationMinutes (caller preformats). Links to the canonical
// /highschool/exams/[board] tree — never legacy /highschool/[exam]. Server-safe.

type FormatPreviewCardProps = {
  board: string;
  country?: string | null;
  formatLabel: string;
  papers: number;
  durationLabel: string;
  href: string;
};

export default function FormatPreviewCard({
  board,
  country,
  formatLabel,
  papers,
  durationLabel,
  href,
}: FormatPreviewCardProps) {
  return (
    <section
      aria-label={`Format preview: ${board}`}
      className="gn-shadow rounded-2xl border border-line bg-surface p-6 md:p-7"
    >
      <p className="flex items-center gap-2 font-serif text-xl font-bold text-slate-50">
        <BadgeCheck aria-hidden="true" className="h-5 w-5 text-teal-400" />
        {board}
        {country != null && country !== "" ? ` — ${country}` : ""}
      </p>
      <dl className="mt-3 space-y-1 text-sm text-muted">
        <div className="flex gap-2">
          <dt className="text-muted">Format:</dt>
          <dd>{formatLabel}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">Papers:</dt>
          <dd>{papers}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">Duration:</dt>
          <dd>{durationLabel}</dd>
        </div>
      </dl>
      <Link
        href={href}
        className="gn-motion gn-motion mt-5 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Start practice
      </Link>
    </section>
  );
}
