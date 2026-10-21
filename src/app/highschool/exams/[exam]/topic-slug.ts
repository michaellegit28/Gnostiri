/**
 * Shared topic-slug derivation for the /highschool/{code}/{subject}/{topic}/
 * {study,quiz} routes.
 *
 * Legacy topic ids do not always extend their parent id — e.g. the JAMB
 * agriculture child is `jamb-agriculture-full-syllabus` under
 * `jamb-agricultural-science` — so slicing blindly produces a URL that
 * resolves to nothing. The live smoke of round 3 caught exactly that: the
 * board page rendered `/highschool/jamb/agricultural-science/abus/study`.
 *
 * The full topic id is a valid slug too, and every topic page accepts either
 * form, so the fallback keeps the link alive.
 */

export function topicSlugOf(topicId: string, parentId: string): string {
  const prefix = `${parentId}-`;
  return topicId.startsWith(prefix) ? topicId.slice(prefix.length) : topicId;
}
