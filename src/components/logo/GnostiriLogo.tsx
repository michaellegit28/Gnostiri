/**
 * Gnostiri logo system — one geometric family, hand-drawn SVG.
 * Master mark: an open book whose pages rise into a spark (knowledge dawn).
 * Section marks share the same 24×24 stroke language (1.8px, round caps)
 * with a per-section accent. No dependencies, no image downloads —
 * crisp at favicon size and free on every page.
 */

export type MarkVariant =
  | "school"
  | "university"
  | "discovery"
  | "quiz"
  | "tutor"
  | "progress"
  | "battle";

interface MarkProps {
  className?: string;
  /** Accent color for the signature detail. Defaults to brand gold. */
  accent?: string;
}

/** Master Gnostiri mark. Inherits text color; spark glows in accent. */
export function GnostiriMark({ className = "w-8 h-8", accent = "#D4AF37" }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8.2C10.2 6.9 7.6 6.4 5 6.4v10.2c2.6 0 5.2.5 7 1.8 1.8-1.3 4.4-1.8 7-1.8V6.4c-2.6 0-5.2.5-7 1.8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 8.2v10.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M18.6 2.4l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z"
        fill={accent}
      />
    </svg>
  );
}

/** Full lockup: tile mark + serif wordmark. */
export function GnostiriLogo({
  className = "",
  markClassName = "w-9 h-9 text-[#D4AF37]",
  wordClassName = "text-2xl font-serif font-bold text-[#D4AF37]",
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <GnostiriMark className={markClassName} />
      <span className={wordClassName}>Gnostiri</span>
    </span>
  );
}

function glyph(variant: MarkVariant, accent: string) {
  switch (variant) {
    case "school":
      // Mortarboard — structured school learning.
      return (
        <>
          <path d="M12 4L2 9l10 5 10-5-10-5z" strokeLinejoin="round" />
          <path d="M6 11.3V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.7" />
          <path d="M22 9v5" />
          <circle cx="22" cy="15.4" r="1" fill={accent} stroke="none" />
        </>
      );
    case "university":
      // Classical hall — serious higher education.
      return (
        <>
          <path d="M3 8.5L12 3l9 5.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 8.5V18M9.75 8.5V18M14.25 8.5V18M18.5 8.5V18" />
          <path d="M3 18.5h18" strokeLinecap="round" />
          <path d="M12 5.4v1.2" stroke={accent} />
        </>
      );
    case "discovery":
      // Orbit — knowledge as a connected landscape.
      return (
        <>
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.8"
            transform="rotate(-25 12 12)"
          />
          <circle cx="12" cy="12" r="1.8" fill={accent} stroke="none" />
          <circle cx="19" cy="8.2" r="1.3" fill="currentColor" stroke="none" />
        </>
      );
    case "quiz":
      // Question bubble — practice and proof.
      return (
        <>
          <path
            d="M4 4.5h16v11H9.5L4 19.5z"
            strokeLinejoin="round"
          />
          <path d="M10 9.2a2 2 0 1 1 2.9 1.8c-.7.4-1 .8-1 1.7" strokeLinecap="round" />
          <circle cx="11.9" cy="15" r="1.1" fill={accent} stroke="none" />
        </>
      );
    case "tutor":
      // Spark — the AI guide.
      return (
        <>
          <path
            d="M12 3l1.9 5.4L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.6z"
            strokeLinejoin="round"
          />
          <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill={accent} stroke="none" />
        </>
      );
    case "progress":
      // Rising trail — streaks and mastery.
      return (
        <>
          <path d="M3 17.5l5-5 3 3 6.5-6.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.5 9H21v3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="3" cy="17.5" r="1.2" fill={accent} stroke="none" />
        </>
      );
    case "battle":
      // Mission flag — the exam battle plan.
      return (
        <>
          <path d="M5 21V4" strokeLinecap="round" />
          <path d="M5 4.5h12l-2.6 3.5 2.6 3.5H5" strokeLinejoin="round" />
          <circle cx="15.2" cy="8" r="1.1" fill={accent} stroke="none" />
        </>
      );
  }
}

/** Section mark in the shared stroke language. */
export function SectionMark({
  variant,
  className = "w-6 h-6",
  accent = "#D4AF37",
}: MarkProps & { variant: MarkVariant }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      {glyph(variant, accent)}
    </svg>
  );
}
