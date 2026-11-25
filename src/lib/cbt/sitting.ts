// CBT sitting identity.
//
// The bug this fixes: `sampleSubjectQuestions` shuffles unseeded, and
// `buildCbtSession` runs on every render of the (force-dynamic) session page.
// So a browser refresh hands ExamRunner a DIFFERENT paper for the same setup.
// The old resume check compared the stored question-id digest against the new
// one, never matched, and fell through to a fresh sitting — dropping every
// answer and resetting `startedAt` to now. A refresh 30 minutes into a
// 60-minute simulation silently destroyed the sitting AND reset the clock
// (the timer-integrity hole is the same root cause).
//
// The fix is to identify the sitting by its SETUP (board, mode, duration,
// subjects) rather than by the random order, and to carry the paper itself in
// the stored sitting. These helpers are pure so the rule can be unit-tested
// without a browser or a React tree.

import type { CbtSessionPaper } from "./data";

export const CBT_ACTIVE_KEY = "gnostiri-cbt-active";

export interface CbtSittingState {
  answers: Record<string, { chosen: number | null; text?: string; marked?: boolean }>;
  subjectIdx: number;
  qIdx: number;
  paperTab: "objective" | "theory";
  startedAt: number;
}

export interface StoredSitting {
  digest: string;
  signature: string;
  state: CbtSittingState;
  paper: CbtSessionPaper;
}

/**
 * Identifies the sitting SETUP, not the shuffled question order. Two papers
 * with the same signature are the same exam, re-dealt.
 */
export function signatureOf(paper: CbtSessionPaper): string {
  return JSON.stringify([
    paper.boardCode,
    paper.mode,
    paper.durationSec,
    paper.subjects.map((s) => s.topicId),
  ]);
}

/**
 * Should a stored sitting be resumed in place of the incoming paper?
 *
 * Resume only when it is genuinely the same sitting AND the clock has not run
 * out — a sitting whose duration elapsed while the tab was closed must not be
 * resurrected, or the student would be marked into overtime on return.
 */
export function shouldResume(
  stored: StoredSitting | null,
  incoming: CbtSessionPaper,
  now: number = Date.now()
): boolean {
  if (!stored?.paper || !stored.state) return false;
  if (stored.signature !== signatureOf(incoming)) return false;
  return stored.state.startedAt + incoming.durationSec * 1000 > now;
}

/** SessionStorage is best-effort: every access is guarded by the caller. */
export function readStoredSitting(): StoredSitting | null {
  try {
    const raw = sessionStorage.getItem(CBT_ACTIVE_KEY);
    return raw ? (JSON.parse(raw) as StoredSitting) : null;
  } catch {
    return null;
  }
}
