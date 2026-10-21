/**
 * CBT data access (server-only). Question sampling NEVER selects
 * `correctAnswer` — keys stay on the server until /api/cbt/submit grades.
 */
import "server-only";
import prisma from "@/lib/db";
import { presetFor } from "./config";
import { boardsInClass } from "@/lib/exam-bank";

export interface CbtBoardCard {
  code: string;
  slug: string;
  name: string;
  country: string | null;
  questionCount: number;
  subjectCount: number;
  status: "live" | "preparing";
}

export interface CbtSubjectOption {
  topicId: string;
  title: string;
  questionCount: number;
}

export interface CbtQuestionView {
  id: string;
  type: string;
  questionText: string;
  options: string[];
  hint: string | null;
}

export interface CbtSubjectPaper {
  topicId: string;
  title: string;
  questions: CbtQuestionView[];
}

export interface CbtSessionPaper {
  boardCode: string;
  boardName: string;
  mode: "simulation" | "practice";
  durationSec: number;
  subjects: CbtSubjectPaper[];
}

/** Boards for the exam-select grid, with honest live/preparing coverage. */
export async function listCbtBoards(): Promise<CbtBoardCard[]> {
  const exams = await prisma.examination.findMany({
    where: { domain: "highschool" },
    select: { code: true, slug: true, name: true, country: true },
  });

  const cbtSlugs = new Set(boardsInClass("cbt").map((b) => b.slug));
  const cards: CbtBoardCard[] = [];
  for (const exam of exams) {
    if (!cbtSlugs.has(exam.slug)) continue; // the CBT grid mirrors the registry's CBT class
    const preset = presetFor(exam.code);
    if (!preset) continue;
    const prefix = `${exam.code}-`;
    const topics = await prisma.topic.findMany({
      where: { id: { startsWith: prefix }, domain: "highschool" },
      select: { id: true },
    });
    const topicIds = topics.map((t) => t.id);
    const questionCount = topicIds.length
      ? await prisma.question.count({ where: { topicId: { in: topicIds } } })
      : 0;
    const subjectCount = topicIds.filter((id) => !id.slice(prefix.length).includes("-")).length;

    cards.push({
      code: exam.code,
      slug: exam.slug,
      name: preset.name,
      country: exam.country,
      questionCount,
      subjectCount,
      status: questionCount > 0 ? "live" : "preparing",
    });
  }
  return cards;
}

/** Subjects (topic roots) with real question coverage for a board. */
export async function boardSubjects(code: string): Promise<CbtSubjectOption[]> {
  const prefix = `${code}-`;
  const roots = await prisma.topic.findMany({
    where: { id: { startsWith: prefix }, domain: "highschool", parentId: { not: null } },
    // subject roots are jamb-{subject} — they have a parent (the board root)
    select: { id: true, title: true },
  });
  const subjectRoots = roots.filter((t) => !t.id.slice(prefix.length).includes("-"));
  const out: CbtSubjectOption[] = [];
  for (const root of subjectRoots) {
    const descendants = await prisma.topic.findMany({
      where: { OR: [{ id: root.id }, { id: { startsWith: `${root.id}-` } }] },
      select: { id: true },
    });
    const count = await prisma.question.count({
      where: { topicId: { in: descendants.map((d) => d.id) } },
    });
    if (count > 0) out.push({ topicId: root.id, title: root.title, questionCount: count });
  }
  return out.sort((a, b) => b.questionCount - a.questionCount);
}

/** Sample n MCQs for a subject from the board tree — answers stay server-side. */
export async function sampleSubjectQuestions(code: string, subjectTopicId: string, n: number): Promise<CbtSubjectPaper | null> {
  const root = await prisma.topic.findUnique({ where: { id: subjectTopicId }, select: { id: true, title: true } });
  if (!root || !root.id.startsWith(`${code}-`)) return null;
  const descendants = await prisma.topic.findMany({
    where: { OR: [{ id: root.id }, { id: { startsWith: `${root.id}-` } }] },
    select: { id: true },
  });
  const ids = await prisma.question.findMany({
    where: { topicId: { in: descendants.map((d) => d.id) }, type: "mcq" },
    select: { id: true },
  });
  // Fisher–Yates over a copy, seeded by nothing (true random per session)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const chosen = ids.slice(0, n).map((x) => x.id);
  if (!chosen.length) return null;
  const rows = await prisma.question.findMany({
    where: { id: { in: chosen } },
    select: { id: true, type: true, questionText: true, options: true, hint: true, topicId: true },
  });
  return {
    topicId: root.id,
    title: root.title,
    questions: rows.map((r) => ({
      id: r.id,
      type: r.type,
      questionText: r.questionText,
      options: Array.isArray(r.options) ? r.options.map(String) : [],
      hint: r.hint,
    })),
  };
}
