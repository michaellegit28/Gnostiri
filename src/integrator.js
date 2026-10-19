import { EXAM_BOARDS, listBoards, getBoard, boardRegion, isOfficialPastBoard } from "./boards.js";
import {
  SUBJECTS,
  QUESTION_BANK,
  getQuestions,
  getAllQuestions,
  getVersion,
} from "./questions.js";

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

export function generateBoardSet(boardId, options = {}) {
  const board = getBoard(boardId);
  if (!board) throw new Error(`Unknown board: ${boardId}`);

  const count = options.count || 5;
  const subject = options.subject || null;
  const region = boardRegion(boardId);
  const useOfficial = isOfficialPastBoard(boardId);

  const subjects = subject ? [subject] : SUBJECTS;
  let questions = [];

  for (const s of subjects) {
    const qs = getQuestions(s.id).map((q) => getVersion(q, boardId));
    questions = questions.concat(qs);
  }

  const selected = pickRandom(questions, count).map((q) => ({
    ...q,
    subject: (SUBJECTS.find((s) => s.id === q.subject) || {}).name || q.subject,
    subjectId: q.subject,
  }));

  return {
    board,
    region,
    version: useOfficial ? "official" : "global",
    tag: useOfficial ? "Official Past Questions" : "Cloned Variant",
    generatedAt: new Date().toISOString(),
    count: selected.length,
    questions: selected,
  };
}

export function generateAllBoards(options = {}) {
  return EXAM_BOARDS.map((b) => generateBoardSet(b.id, options));
}

export function getQuestionPair(questionId) {
  const q = getAllQuestions().find((x) => x.id === questionId);
  if (!q) return null;
  return {
    official: getVersion(q, "sa"),
    global: getVersion(q, "jamb"),
  };
}

export { listBoards, getBoard, boardRegion, isOfficialPastBoard, SUBJECTS };
