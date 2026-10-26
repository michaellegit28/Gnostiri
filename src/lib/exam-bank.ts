/**
 * EXAM BANK REGISTRY — the single source of truth for the open exam bank.
 *
 * The registry started as the owner's global board table. 2026-10-24 board
 * clearance: WAEC/NECO and all 11 foreign boards retired (production DB +
 * content) — the bank is JAMB-only for now; foreign boards return later per
 * owner directive ("clear all Nigeria exams and other countries, return to
 * JAMB later"). Board classes below stay: the class metadata describes the
 * paper taxonomy, not which boards ship today.
 */

export type ExamBankClass = "cbt" | "objective-theory" | "written-theory";

export interface ExamClassMeta {
  id: ExamBankClass;
  label: string;
  short: string;
  description: string;
}

export const EXAM_CLASSES: Record<ExamBankClass, ExamClassMeta> = {
  "cbt": {
    id: "cbt",
    label: "Computer-Based Test boards",
    short: "CBT",
    description:
      "Full exam simulations on the computer — timed, shuffled, graded instantly. Practice engines for boards that test entirely on screen.",
  },
  "objective-theory": {
    id: "objective-theory",
    label: "Objective (MCQ) + Written Theory",
    short: "MCQ + Theory",
    description:
      "Drill the objective paper fast, then study model answers for the written theory paper. Both papers classified per board.",
  },
  "written-theory": {
    id: "written-theory",
    label: "Written Theory + Short Answer",
    short: "Written",
    description:
      "Text-heavy written papers with short/structured answers — sorted by sub-topic for targeted revision and model-answer study.",
  },
};

export interface ExamBankBoard {
  slug: string; // Examination.slug (route key)
  code: string; // Examination.code (topic prefix key)
  name: string;
  country: string;
  examClass: ExamBankClass;
  /** Format chips rendered on cards — the board's paper structure in our words. */
  formats: string[];
  /** Written-classification detail (paper types the bank will carry). */
  paperTypes: string[];
  status: "live" | "preparing";
  note: string;
  /** Boards with a live CBT mode surface a direct "Start CBT" action. */
  cbtReady?: boolean;
}

export const EXAM_BANK: ExamBankBoard[] = [
  {
    slug: "jamb", code: "jamb", name: "JAMB (UTME)", country: "Nigeria",
    examClass: "cbt",
    formats: ["Pure CBT", "100% multiple choice", "4 subjects · one sitting"],
    paperTypes: [],
    status: "live",
    note: "The gold standard for CBT practice — shuffling engine, board-standard timer, 400-mark scoring.",
    cbtReady: true,
  },
];

export const EXAM_CLASS_ORDER: ExamBankClass[] = ["cbt", "objective-theory", "written-theory"];

export function boardBySlug(slug: string): ExamBankBoard | null {
  return EXAM_BANK.find((b) => b.slug === slug.toLowerCase()) ?? null;
}

export function boardsInClass(examClass: ExamBankClass): ExamBankBoard[] {
  return EXAM_BANK.filter((b) => b.examClass === examClass);
}
