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
    // Direct children of the board root = subject roots (hyphen-counting was wrong).
    const subjectCount = await prisma.topic.count({
      where: { id: { startsWith: prefix }, domain: "highschool", parentId: exam.code.toLowerCase() },
    });

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

/**
 * All topic ids under a subject root — by PARENT EDGE, not id prefix.
 * Prefix matching silently misses children whose slug diverges from the
 * parent's (agricultural-science owns "jamb-agriculture-full-syllabus"), which
 * hid 500 questions from CBT practice until this replaced it.
 */
async function descendantTopicIds(rootId: string): Promise<string[]> {
  const ids = [rootId];
  let frontier = [rootId];
  for (let depth = 0; depth < 4 && frontier.length > 0; depth++) {
    const children = await prisma.topic.findMany({
      where: { parentId: { in: frontier } },
      select: { id: true },
    });
    const next = children.map((c) => c.id).filter((id) => !ids.includes(id));
    if (!next.length) break;
    ids.push(...next);
    frontier = next;
  }
  return ids;
}

/** Subjects (topic roots) with real question coverage for a board. */
export async function boardSubjects(code: string): Promise<CbtSubjectOption[]> {
  // Subject roots are the DIRECT CHILDREN of the board root topic (id === code).
  // Hyphen-counting the suffix would drop multi-word subjects — it hid
  // agricultural-science and literature-in-english (1,000 questions) until this
  // parent-based detection replaced it.
  const boardRootId = code.toLowerCase();
  const subjectRoots = await prisma.topic.findMany({
    where: { id: { startsWith: `${boardRootId}-` }, domain: "highschool", parentId: boardRootId },
    select: { id: true, title: true },
  });
  const out: CbtSubjectOption[] = [];
  for (const root of subjectRoots) {
    const descendants = await descendantTopicIds(root.id);
    const count = await prisma.question.count({
      where: { topicId: { in: descendants } },
    });
    if (count > 0) out.push({ topicId: root.id, title: root.title, questionCount: count });
  }
  return out.sort((a, b) => b.questionCount - a.questionCount);
}

/** Sample n MCQs for a subject from the board tree — answers stay server-side. */
export async function sampleSubjectQuestions(code: string, subjectTopicId: string, n: number): Promise<CbtSubjectPaper | null> {
  const root = await prisma.topic.findUnique({ where: { id: subjectTopicId }, select: { id: true, title: true } });
  if (!root || !root.id.startsWith(`${code}-`)) return null;
  const descendants = await descendantTopicIds(root.id);
  const ids = await prisma.question.findMany({
    where: { topicId: { in: descendants }, type: "mcq" },
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
