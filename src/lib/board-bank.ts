import prisma from "@/lib/db";

/**
 * src/lib/board-bank.ts — the ONE definition of a board's question bank.
 *
 * A board's bank is every Question inside its own `{code}-*` topic tree:
 * root `{code}` -> `{code}-{subject}` -> `{code}-{subject}-{topic}`. That is
 * the same tree /cbt serves, the same tree the board page's subject grid is
 * computed from, and the same tree /api/questions has served since round 3
 * (31a9fd8). The tag engine is layered ON TOP of the tree for blueprint paper
 * structure — it is never the bank definition, because a missing tag must not
 * be able to hide a question that the board's own syllabus tree contains.
 *
 * Every counting surface (exams hub chip, board-page hero + practice-engine
 * sentence, practice picker total and per-topic cards) derives its numbers
 * from THIS file, so no two surfaces can disagree about a board again.
 *
 * RULE 4 applies to the bank too: a question this board marks NOT_EXAMINED is
 * never part of its bank, on any surface.
 */

/** Per-question-type counts inside a topic — the picker's card breakdown. */
export interface TopicTypeCounts {
  mcq: number;
  theory: number;
  practical: number;
}

const ZERO_COUNTS: TopicTypeCounts = { mcq: 0, theory: 0, practical: 0 };

export function zeroCounts(): TopicTypeCounts {
  return { mcq: ZERO_COUNTS.mcq, theory: ZERO_COUNTS.theory, practical: ZERO_COUNTS.practical };
}

export function totalOf(counts: TopicTypeCounts): number {
  return counts.mcq + counts.theory + counts.practical;
}

/**
 * Every topic id inside the board's own tree, via the parent edges
 * (root -> subjects -> topics). Returns null when the board has no tree.
 */
export async function boardTreeTopicIds(boardCode: string): Promise<string[] | null> {
  const code = boardCode.toLowerCase();
  const root = await prisma.topic.findFirst({
    where: { domain: "highschool", id: code },
    select: { id: true },
  });
  if (!root) return null;

  const subjects = await prisma.topic.findMany({
    where: { domain: "highschool", parentId: root.id },
    orderBy: { orderIndex: "asc" },
    select: { id: true },
  });
  const subjectIds = subjects.map((s) => s.id);

  const children = subjectIds.length
    ? await prisma.topic.findMany({
        where: { parentId: { in: subjectIds } },
        select: { id: true },
      })
    : [];

  return [root.id, ...subjectIds, ...children.map((c) => c.id)];
}

/**
 * Per-topic question counts across a board's whole tree, keyed by topicId.
 * Topics whose count is zero are absent from the map — callers read a
 * missing entry as zero. Returns null when the board has no tree.
 */
export async function boardTopicQuestionCounts(
  boardCode: string,
  examinationId: string
): Promise<Map<string, TopicTypeCounts> | null> {
  const topicIds = await boardTreeTopicIds(boardCode);
  if (!topicIds) return null;

  const rows = await prisma.question.groupBy({
    by: ["topicId", "type"],
    where: {
      topicId: { in: topicIds },
      // RULE 4 — a question this board excludes never counts as bank content.
      NOT: { boardTags: { some: { examinationId, tier: "NOT_EXAMINED" } } },
    },
    _count: { _all: true },
  });

  const counts = new Map<string, TopicTypeCounts>();
  for (const row of rows) {
    const entry = counts.get(row.topicId) ?? zeroCounts();
    if (row.type === "theory") entry.theory += row._count._all;
    else if (row.type === "practical") entry.practical += row._count._all;
    else entry.mcq += row._count._all;
    counts.set(row.topicId, entry);
  }
  return counts;
}

/**
 * The board's total bank size — ONE number, computed the same way everywhere.
 * A board with no topic tree has no bank (0), which is the honest answer.
 */
export async function countBoardQuestions(
  boardCode: string,
  examinationId: string
): Promise<number> {
  const counts = await boardTopicQuestionCounts(boardCode, examinationId);
  if (!counts) return 0;
  let total = 0;
  counts.forEach((entry) => {
    total += totalOf(entry);
  });
  return total;
}
