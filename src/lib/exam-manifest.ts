import prisma from "@/lib/db";

// Exam Blueprint Engine — the manifest is the single source of truth.
// The frontend renders what the manifest says: nothing more, nothing less.

export type Delivery = "CBT" | "PAPER" | "HYBRID" | "ORAL";
export type QuestionKind = "MCQ" | "THEORY" | "PRACTICAL" | "ORAL";
export type TagTier = "CORE" | "OPTIONAL" | "NOT_EXAMINED";

export interface PaperConfig {
  paperId: string;
  paperName: string;
  sequence: number;
  delivery: Delivery;
  questionTypes: QuestionKind[];
  durationMinutes: number;
  marks: number;
  applicability: string[];
  required: boolean;
  instructions?: string;
}

export interface ManifestQuestion {
  id: string;
  type: QuestionKind;
  questionText: string;
  options: string[];
  hint: string | null;
}

export interface ManifestSection {
  sectionId: string;
  sectionName: string;
  order: number;
  questionType: QuestionKind;
  delivery: Delivery;
  durationMinutes: number;
  marks: number;
  required: boolean;
  instructions: string;
  transitionMessage: string | null;
  questions: ManifestQuestion[];
}

export interface RenderManifest {
  board: string;
  boardId: string;
  subject: string;
  topic: string;
  topicId: string;
  lastVerified: string | null;
  syllabusUrl: string | null;
  notes: string | null;
  sections: ManifestSection[];
}

export interface ScoreSection {
  sectionId: string;
  sectionName: string;
  questionType: QuestionKind;
  totalQuestions: number;
  answered: number;
  correct: number | null; // null for theory sections (self-assess MVP)
  score: number | null;
  maxScore: number;
  modelAnswers?: { questionId: string; modelAnswer: string; markingPoints: { point: string; marks: number }[] | null }[];
}

export interface ScoreBreakdown {
  sections: ScoreSection[];
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
}

// Subject categories used by PaperConfig.applicability ("sciences", "technical").
// Subjects not listed have no special category, so papers restricted to those
// categories are omitted for them (e.g. Literature gets no practical paper).
const SCIENCE_SUBJECTS = new Set(["biology", "chemistry", "physics", "agricultural-science"]);
const TECHNICAL_SUBJECTS = new Set(["technical-drawing", "computer-science", "ict", "food-and-nutrition"]);

export function subjectCategory(subjectSlug: string): string | null {
  const s = subjectSlug.toLowerCase();
  if (SCIENCE_SUBJECTS.has(s)) return "sciences";
  if (TECHNICAL_SUBJECTS.has(s)) return "technical";
  return null;
}

const SECTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

function sectionNameFor(paperName: string, sequence: number): string {
  const letter = SECTION_LETTERS[sequence - 1] ?? String(sequence);
  return `Section ${letter}: ${paperName}`;
}

function parsePaper(row: {
  paperId: string;
  paperName: string;
  sequence: number;
  delivery: string;
  questionTypes: unknown;
  durationMinutes: number;
  marks: number;
  applicability: unknown;
  required: boolean;
  instructions: string | null;
}): PaperConfig | null {
  const types = Array.isArray(row.questionTypes) ? row.questionTypes.map(String).filter(Boolean) : [];
  const applicability = Array.isArray(row.applicability) ? row.applicability.map(String) : [];
  if (types.length === 0) return null;
  return {
    paperId: row.paperId,
    paperName: row.paperName,
    sequence: row.sequence,
    delivery: row.delivery as Delivery,
    questionTypes: types as QuestionKind[],
    durationMinutes: row.durationMinutes,
    marks: row.marks,
    applicability,
    required: row.required,
    instructions: row.instructions ?? undefined,
  };
}

async function questionsForPaper(
  topicId: string,
  paper: PaperConfig,
  examinationId: string
): Promise<ManifestQuestion[]> {
  const rows = await prisma.question.findMany({
    where: {
      topicId,
      type: { in: paper.questionTypes.map((t) => t.toLowerCase()) },
      boardTags: {
        some: {
          examinationId,
          tier: { not: "NOT_EXAMINED" },
          paperIds: { array_contains: [paper.paperId] },
        },
      },
    },
    orderBy: { id: "asc" },
    select: { id: true, questionText: true, options: true, hint: true },
  });
  return rows.map((row) => ({
    id: row.id,
    type: paper.questionTypes[0],
    questionText: row.questionText,
    options: Array.isArray(row.options) ? row.options.map(String) : [],
    hint: row.hint,
  }));
}

// buildRenderManifest — implements the Brief 2 conditional rendering rules:
//   RULE 1: boards with only MCQ papers produce only MCQ sections (no theory).
//   RULE 3: papers whose applicability excludes the subject are omitted.
//   RULE 4: NOT_EXAMINED questions never enter any section.
//   Empty papers are omitted entirely — no empty theory sections are sent.
export async function buildRenderManifest(
  boardSlug: string,
  subjectSlug: string,
  topicSlug: string
): Promise<RenderManifest | null> {
  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      slug: { equals: boardSlug.toLowerCase(), mode: "insensitive" },
    },
  });
  if (!examination) return null;

  const topic = await prisma.topic.findFirst({
    where: { OR: [{ id: topicSlug }, { slug: topicSlug }] },
  });
  if (!topic) return null;

  const paperRows = await prisma.examinationPaper.findMany({
    where: { examinationId: examination.id },
    orderBy: { sequence: "asc" },
  });
  const papers = paperRows
    .map(parsePaper)
    .filter((p): p is PaperConfig => p !== null)
    .sort((a, b) => a.sequence - b.sequence);

  const category = subjectCategory(subjectSlug);
  const sections: ManifestSection[] = [];

  for (const paper of papers) {
    // RULE 3 — applicability filter
    if (!paper.applicability.includes("all") && !(category && paper.applicability.includes(category))) {
      continue;
    }

    // Skip papers that don't cover this topic — omit entirely, never send empty sections
    const questions = await questionsForPaper(topic.id, paper, examination.id);
    if (questions.length === 0) continue;

    sections.push({
      sectionId: paper.paperId,
      sectionName: sectionNameFor(paper.paperName, paper.sequence),
      order: paper.sequence,
      questionType: paper.questionTypes[0],
      delivery: paper.delivery,
      durationMinutes: paper.durationMinutes,
      marks: paper.marks,
      required: paper.required,
      instructions: paper.instructions ?? "",
      transitionMessage:
        paper.sequence < papers.length ? "Section complete. Proceed to next section." : null,
      questions,
    });
  }

  return {
    board: examination.name,
    boardId: examination.slug,
    subject: subjectSlug,
    topic: topic.title,
    topicId: topic.id,
    lastVerified: examination.lastVerified ? examination.lastVerified.toISOString() : null, // RULE 5
    syllabusUrl: examination.syllabusUrl, // RULE 5
    notes: examination.notes,
    sections,
  };
}

// Score a completed practice session from the SERVER-STORED answers — the
// client never submits final answers, so it cannot fabricate a score.
// THEORY sections are not auto-scored (MVP): the breakdown carries model
// answers + marking points for learner self-assessment.
export async function scorePracticeSession(session: {
  id: string;
  examinationId: string;
  topicId: string;
  answers: unknown;
}): Promise<ScoreBreakdown> {
  const paperRows = await prisma.examinationPaper.findMany({
    where: { examinationId: session.examinationId },
    orderBy: { sequence: "asc" },
  });
  const answersBySection: Record<string, { questionId: string; selectedAnswer: string | null }[]> =
    (session.answers as Record<string, { questionId: string; selectedAnswer: string | null }[]>) ?? {};

  const sections: ScoreSection[] = [];
  let totalScore = 0;
  let maxTotalScore = 0;

  for (const row of paperRows) {
    const paper = parsePaper(row);
    if (!paper) continue;
    const submitted = answersBySection[paper.paperId] ?? [];
    if (submitted.length === 0 && paper.questionTypes[0] !== "THEORY") {
      // untouched objective sections still count toward maxScore
    }
    const questionRows = await prisma.question.findMany({
      where: { topicId: session.topicId, id: { in: submitted.map((a) => a.questionId) } },
      select: { id: true, correctAnswer: true, markingPoints: true },
    });
    const byId = new Map(questionRows.map((q) => [q.id, q]));

    if (paper.questionTypes[0] === "THEORY") {
      const modelAnswers = submitted
        .map((entry) => {
          const q = byId.get(entry.questionId);
          if (!q) return null;
          return {
            questionId: q.id,
            modelAnswer: q.correctAnswer,
            markingPoints: Array.isArray(q.markingPoints) ? (q.markingPoints as { point: string; marks: number }[]) : null,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
      sections.push({
        sectionId: paper.paperId,
        sectionName: sectionNameFor(paper.paperName, paper.sequence),
        questionType: "THEORY",
        totalQuestions: submitted.length,
        answered: submitted.filter((a) => a.selectedAnswer).length,
        correct: null,
        score: null,
        maxScore: paper.marks,
        modelAnswers,
      });
      maxTotalScore += paper.marks;
    } else {
      let correct = 0;
      for (const entry of submitted) {
        const q = byId.get(entry.questionId);
        if (!q || entry.selectedAnswer == null) continue;
        if (entry.selectedAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) correct += 1;
      }
      sections.push({
        sectionId: paper.paperId,
        sectionName: sectionNameFor(paper.paperName, paper.sequence),
        questionType: paper.questionTypes[0],
        totalQuestions: submitted.length,
        answered: submitted.filter((a) => a.selectedAnswer).length,
        correct,
        score: correct,
        maxScore: submitted.length,
      });
      totalScore += correct;
      maxTotalScore += submitted.length;
    }
  }

  return {
    sections,
    totalScore,
    maxTotalScore,
    percentage: maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 1000) / 10 : 0,
  };
}
