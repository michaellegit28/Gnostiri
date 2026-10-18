import prisma from "@/lib/db";
import { scheduleReview, qualityFromResult } from "@/lib/sm2";
import { recordConceptReview } from "@/lib/spaced-repetition";

/**
 * Assessment engine — builds, scores and archives university-grade examinations.
 *
 * Unlike the high-school quiz endpoints (which are single-topic MCQ), a
 * university exam is blueprint-balanced across concept nodes, supports
 * multiple formats (SBA, EMQ, vignette, short-answer), and applies
 * negative marking. Every scored item feeds the concept's mastery state,
 * so sitting an exam trains the spaced-repetition scheduler.
 */

// How many marks a wrong answer costs when negative marking is enabled.
const NEGATIVE_RATIO = 0.25;

export type ExamFormat = "sba" | "emq" | "vignette" | "short-answer";
export type ExamMode = "timed" | "open";

export interface ExamBlueprint {
  courseId: string;
  mode: ExamMode;
  durationMinutes?: number;
  // conceptId -> item count. Omitted => evenly distributed across published items.
  conceptWeights?: Record<string, number>;
  formats?: ExamFormat[];
  negativeMarking?: boolean;
}

export interface ExamItem {
  id: string;
  format: ExamFormat;
  stem: string;
  options: string[] | null;
  correctAnswer: string | null;
  explanation: string | null;
  marks: number;
  negativeMarks: number | null;
  conceptId: string | null;
  conceptTitle: string | null;
}

export interface SelectedItem extends ExamItem {
  selected?: string;
  awarded: number;
  marked: boolean;
}

export interface ExamSession {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  mode: ExamMode;
  durationMinutes: number;
  items: ExamItem[];
  negativeMarking: boolean;
}

export interface ScoredSession extends ExamSession {
  answers: SelectedItem[];
  score: number;
  maxScore: number;
  negativeApplied: number;
  percentage: number;
}

/**
 * Build a blueprint-balanced exam from published items. A course must have
 * published AssessmentItems or nothing can be built — an empty exam is a
 * lie, so we fail loudly instead of returning a shell.
 */
export async function buildExam(params: ExamBlueprint): Promise<ExamSession> {
  const { courseId, mode, durationMinutes = 60, conceptWeights, formats, negativeMarking = true } = params;

  const course = await prisma.course.findUnique({
    where: { id: courseId, domain: "university", isPublished: true },
    select: { title: true },
  });
  if (!course) throw new Error("Course not found");

  const where: { courseId: string; isPublished: true; format?: { in: ExamFormat[] } } = {
    courseId,
    isPublished: true,
  };
  if (formats && formats.length) where.format = { in: formats };

  const items = await prisma.assessmentItem.findMany({
    where,
    include: {
      concept: { select: { id: true, title: true } },
    },
    orderBy: { orderIndex: "asc" },
  });
  if (items.length === 0) throw new Error("No published assessment items for this course");

  // Blueprint: honour concept weights, otherwise distribute evenly.
  const byConcept = new Map<string, typeof items>();
  for (const it of items) {
    const key = it.conceptId ?? "unmapped";
    byConcept.set(key, [...(byConcept.get(key) ?? []), it]);
  }

  const target: [string, number][] = conceptWeights
    ? Object.entries(conceptWeights).filter(([, n]) => Number(n) > 0)
    : Array.from(byConcept.keys()).map((k) => [k, Math.max(1, Math.floor(items.length / byConcept.size))] as [string, number]);

  const chosen: typeof items = [];
  for (const [conceptId, count] of target) {
    const pool = byConcept.get(conceptId) ?? [];
    if (pool.length === 0) continue;
    const take = Math.min(count, pool.length);
    chosen.push(...pool.slice(0, take));
  }
  if (chosen.length === 0) throw new Error("Blueprint could not be satisfied");

  return {
    id: `exam-${courseId}-${Date.now()}`,
    courseId,
    courseTitle: course.title,
    title: `${course.title} — ${mode === "timed" ? "timed" : "open"}`,
    mode,
    durationMinutes,
    items: chosen.map((it) => ({
      id: it.id,
      format: it.format as ExamFormat,
      stem: it.stem,
      options: Array.isArray(it.options) ? it.options.map(String) : null,
      correctAnswer: it.correctAnswer,
      explanation: it.explanation,
      marks: it.marks,
      negativeMarks: it.negativeMarks,
      conceptId: it.conceptId,
      conceptTitle: it.concept?.title ?? null,
    })),
    negativeMarking,
  };
}

/**
 * Score a submitted session. Answers are graded server-side from the
 * persisted correctAnswer — never from what the client believes is right.
 * Free-text (short-answer) items come pre-marked by the caller.
 */
export function scoreSession(session: ExamSession, answers: { itemId: string; selected?: string; freeText?: string; marked?: boolean }[]): ScoredSession {
  const byId = new Map(session.items.map((i) => [i.id, i]));
  const scored: SelectedItem[] = [];
  let score = 0;
  let maxScore = 0;
  let negativeApplied = 0;

  for (const a of answers) {
    const item = byId.get(a.itemId);
    if (!item) continue;
    const isCorrect = item.format !== "short-answer" && String(a.selected).trim().toLowerCase() === String(item.correctAnswer).trim().toLowerCase();
    const awarded = item.format === "short-answer" ? (a.marked ? item.marks : 0) : isCorrect ? item.marks : 0;
    const penalty = session.negativeMarking && !isCorrect && item.format !== "short-answer" ? (item.negativeMarks ?? Math.round(item.marks * NEGATIVE_RATIO * 100) / 100) : 0;
    // A wrong answer may go negative per item; the paper floors at zero.
    const finalAward = awarded - penalty;

    if (!isCorrect && penalty > 0) negativeApplied += penalty;
    score += finalAward;
    maxScore += item.marks;
    scored.push({ ...item, selected: a.selected, awarded: finalAward, marked: item.format === "short-answer" ? a.marked === true : isCorrect });
  }

  return {
    ...session,
    answers: scored,
    score: Math.max(0, score),
    maxScore,
    negativeApplied,
    percentage: maxScore > 0 ? +(Math.max(0, score) / maxScore).toFixed(4) : 0,
  };
}

/**
 * Persist a scored session and advance every concept it touched.
 * Exam-condition sessions (timed) feed mastery; practice (open) is recorded
 * but does not graduate a concept — that distinction is what keeps the
 * transcript honest.
 */
export async function archiveSession(userId: string, scored: ScoredSession): Promise<void> {
  // The exam sitting is persisted first; mastery advances follow. They are
  // separate writes so a partial failure never leaves a graded exam invisible.
  await prisma.assessmentSession.create({
    data: {
      userId,
      courseId: scored.courseId,
      title: scored.title,
      mode: scored.mode,
      durationMinutes: scored.durationMinutes,
      startTime: new Date(Date.now() - scored.durationMinutes * 60000),
      endTime: new Date(),
      answers: scored.answers.map((a) => ({
        itemId: a.id,
        selected: a.selected,
        freeText: a.selected,
        marked: a.marked,
        awarded: a.awarded,
      })),
      score: scored.score,
      maxScore: scored.maxScore,
      negativeApplied: scored.negativeApplied,
    },
  });

const byConcept = new Map<string, { got: number; max: number; exam: boolean }>();
    for (const a of scored.answers) {
      if (!a.conceptId) continue;
      const cur = byConcept.get(a.conceptId) ?? { got: 0, max: 0, exam: scored.mode === "timed" };
      cur.got += a.awarded;
      cur.max += a.marks;
      byConcept.set(a.conceptId, cur);
    }

    for (const [conceptId, data] of Array.from(byConcept.entries())) {
      const correct = data.got === data.max;
      const review = { quality: qualityFromResult(correct, undefined), correct, examCondition: data.exam };
      await recordConceptReview(userId, conceptId, review);
    }
}

/**
 * Assemble a competency transcript from live mastery data. A concept is
 * "developing" until demonstrated once, "proficient" at 0.8+, and
 * "mastered" only after two exam-condition successes — the same gate the
 * scheduler uses, so the transcript can never drift from the revision queue.
 */
export async function buildTranscript(userId: string, programmeId?: string): Promise<{ id: string; lines: { code: string; title: string; level: string; evidence: string }[] }> {
  const concepts = await prisma.conceptMastery.findMany({
    where: { userId, ...(programmeId ? { concept: { course: { programmeId } } } : undefined) },
    include: { concept: { include: { course: { select: { title: true } } } } },
  });

  const lines = concepts.map((c) => {
    const code = `U${String(c.concept.orderIndex + 1).padStart(2, "0")}`;
    let level = "developing";
    if (c.status === "mastered") level = "mastery";
    else if ((c.masteryScore ?? 0) >= 0.8) level = "proficient";

    const evidence = [
      c.attempts > 0 ? `${c.attempts} attempt${c.attempts === 1 ? "" : "s"}` : "",
      c.correctStreak > 0 ? `${c.correctStreak} correct in a row` : "",
      c.masteryScore != null ? `score ${Math.round(c.masteryScore * 100)}%` : "",
    ]
      .filter(Boolean)
      .join(", ");

    return {
      code,
      title: `${c.concept.course.title} — ${c.concept.title}`,
      level,
      evidence: evidence || "Not yet attempted",
    };
  });

  const key = programmeId ?? "";
  const existing = await prisma.competencyTranscript.findUnique({ where: { userId_programmeId: { userId, programmeId: key } } });

  const transcript = existing
    ? await prisma.competencyTranscript.update({
        where: { id: existing.id },
        data: { lines: { deleteMany: {}, create: lines } },
      })
    : await prisma.competencyTranscript.create({
        data: {
          userId,
          programmeId: programmeId ?? null,
          title: programmeId ? "Competency transcript" : "University competency record",
          summary: { lines: lines.length, mastery: lines.filter((l) => l.level === "mastery").length },
          lines: { create: lines },
        },
      });

  return { id: transcript.id, lines };
}