interface Props {
  lastAudited?: string | null;
}

/**
 * Mandatory disclaimer — must appear on EVERY topic page (hard constraint 6).
 * Platform name: Gnostiri (exact string).
 */
export default function AlignmentDisclaimer({ lastAudited }: Props) {
  return (
    <footer className="mt-10 border-t border-line pt-4 text-xs text-muted leading-relaxed" aria-label="Curriculum alignment disclaimer">
      <p>
        This alignment guide is a study aid based on publicly available curriculum documents. Always verify requirements
        with your official syllabus, teacher, or exam board. Gnostiri is not affiliated with any examination body.
        {lastAudited ? ` Last audited: ${lastAudited}.` : " Last audited: pending verification."}
      </p>
    </footer>
  );
}
