// Official-question display rules for the hybrid (dual-version) question model.
// Pure display helpers: no DB, no content generation, no text authored here.
// The SOURCE OF TRUTH for which version renders where is the server/pool layer
// (papers in ZA/TZ draw Version A, everywhere else draws Version B). These
// helpers are defence-in-depth for the UI: they never render an "Official"
// claim outside the official tracks, whatever data they are handed.

export type QuestionProvenance = "official" | "original";

/** The two tracks whose governments publish papers openly. */
export const OFFICIAL_TRACKS = ["ZA", "TZ"] as const;
export type OfficialTrack = (typeof OFFICIAL_TRACKS)[number];

/** Boards whose text is legally reproduced unedited, with attribution. */
const ATTRIBUTION: Record<string, string> = {
  NSC: "Official past question — © Department of Basic Education, Republic of South Africa. Reproduced for educational practice.",
  NECTA: "Official past question — © National Examinations Council of Tanzania. Reproduced for educational practice.",
};

export function isOfficialTrack(track?: string | null): boolean {
  return track != null && (OFFICIAL_TRACKS as readonly string[]).includes(track);
}

/** Attribution line for a board whose text is reproduced unedited. */
export function officialAttribution(board?: string | null): string | null {
  if (!board) return null;
  return ATTRIBUTION[board] ?? null;
}

/**
 * Whether the Official badge may render for this question on this track.
 * Requires BOTH provenance "official" AND an official track — a Version A item
 * surfaced anywhere else must never claim to be an official paper.
 */
export function canShowOfficialBadge(
  question: { provenance?: QuestionProvenance | string | null; track?: string[] | string | null },
  viewerTrack?: string | null,
): boolean {
  if (question.provenance !== "official") return false;
  const tracks = Array.isArray(question.track)
    ? question.track
    : question.track
      ? [question.track]
      : [];
  const onOfficialTrack =
    viewerTrack != null
      ? isOfficialTrack(viewerTrack)
      : tracks.some(isOfficialTrack);
  if (!onOfficialTrack) return false;
  const boards = Array.isArray((question as { styleBoard?: string[] }).styleBoard)
    ? ((question as { styleBoard?: string[] }).styleBoard as string[])
    : [(question as { styleBoard?: string | null }).styleBoard ?? ""];
  return boards.some((b) => officialAttribution(b) != null);
}
