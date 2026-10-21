/**
 * CBT session builder — shared by POST /api/cbt/session and the /cbt/session
 * server page, so both entry points produce identical papers.
 */
import { presetFor, type CbtMode } from "./config";
import { boardSubjects, sampleSubjectQuestions, type CbtSessionPaper } from "./data";

export type BuildResult = { ok: true; paper: CbtSessionPaper } | { ok: false; error: string; status: number };

export async function buildCbtSession(
  boardCode: string,
  mode: CbtMode,
  subjects: string[] = [],
  count?: number,
  minutesOverride?: number
): Promise<BuildResult> {
  const preset = presetFor(boardCode);
  if (!preset || preset.status !== "live") return { ok: false, error: "unknown or unavailable board", status: 400 };
  if (mode === "simulation" && !preset.sim) {
    return { ok: false, error: "simulation not available for this board yet", status: 400 };
  }

  const chosen: string[] = [];
  let perSubject: number;
  let durationSec: number;

  if (mode === "simulation" && preset.sim) {
    perSubject = preset.sim.questionsPerSubject;
    durationSec = preset.sim.durationMinutes * 60;
    const all = await boardSubjects(preset.code);
    if (preset.lockedFirstSubject) {
      const english =
        all.find((s) => s.topicId.endsWith(`-${preset.lockedFirstSubject!.slug}`)) ??
        all.find((s) => /english/i.test(s.topicId));
      if (english) chosen.push(english.topicId);
    }
    for (const s of all) {
      if (chosen.length >= preset.maxSubjectSlots) break;
      if (!chosen.includes(s.topicId)) chosen.push(s.topicId);
    }
    if (chosen.length < 2) return { ok: false, error: "not enough subjects with content for a simulation", status: 409 };
  } else {
    const requested = subjects.filter((s) => /^[a-z0-9-]+$/.test(s)).slice(0, preset.maxSubjectSlots);
    if (!requested.length) return { ok: false, error: "subjects required for practice", status: 400 };
    chosen.push(...requested);
    perSubject = preset.practice.countOptions.includes(Number(count)) ? Number(count) : preset.practice.countOptions[0];
    durationSec = (minutesOverride && minutesOverride > 0 ? minutesOverride : perSubject * 75) * chosen.length;
  }

  const built: CbtSessionPaper["subjects"] = [];
  for (const topicId of chosen) {
    const paper = await sampleSubjectQuestions(preset.code, topicId, perSubject);
    if (paper) built.push(paper);
  }
  if (!built.length) return { ok: false, error: "no questions available for the selected subjects", status: 409 };

  return {
    ok: true,
    paper: {
      boardCode: preset.code,
      boardName: preset.name,
      mode,
      durationSec,
      subjects: built,
    },
  };
}
