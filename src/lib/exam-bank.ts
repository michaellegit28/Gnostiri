/**
 * EXAM BANK REGISTRY — the single source of truth for the open exam bank.
 * Three classes, per the owner's global board table:
 *
 *   1. CBT                  — boards delivered fully (or near-fully) on computer
 *   2. Objective + Theory   — MCQ paper(s) plus written theory papers
 *   3. Written Theory       — written theory + short/structured answer papers
 *
 * The hub renders what this file says: nothing more, nothing less. Boards not
 * in this registry do not exist in the bank (old boards were retired).
 * Nothing here copies any board's visual design or logo — names and formats
 * only, in Gnostiri's own presentation.
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
  // ── CBT ─────────────────────────────────────────────────────────────────
  {
    slug: "jamb", code: "jamb", name: "JAMB (UTME)", country: "Nigeria",
    examClass: "cbt",
    formats: ["Pure CBT", "100% multiple choice", "4 subjects · one sitting"],
    paperTypes: [],
    status: "live",
    note: "The gold standard for CBT practice — shuffling engine, board-standard timer, 400-mark scoring.",
    cbtReady: true,
  },
  {
    slug: "sat", code: "sat", name: "College Board — Digital SAT", country: "United States",
    examClass: "cbt",
    formats: ["Pure CBT", "Adaptive MCQ modules"],
    paperTypes: [],
    status: "preparing",
    note: "The Digital SAT runs fully on computer — our adaptive practice engine follows the same shape.",
  },
  {
    slug: "ap", code: "ap", name: "College Board — AP Exams", country: "United States",
    examClass: "cbt",
    formats: ["Hybrid digital", "MCQ + free response"],
    paperTypes: ["Free response"],
    status: "preparing",
    note: "AP subjects are moving rapidly to fully digital formats — MCQ practice now, free-response banks next.",
  },

  // ── Objective (MCQ) + Written Theory ────────────────────────────────────
  {
    slug: "waec", code: "waec", name: "WAEC (WASSCE)", country: "Nigeria & Ghana",
    examClass: "objective-theory",
    formats: ["Objective (MCQ)", "Written theory", "Practicals (sciences)"],
    paperTypes: ["Paper 1 — Objective", "Paper 2 — Theory/Essay", "Paper 3 — Practical"],
    status: "live",
    note: "Clear the objective section fast, then study model answers for theory — both papers, one board page.",
  },
  {
    slug: "neco", code: "neco", name: "NECO (SSCE)", country: "Nigeria",
    examClass: "objective-theory",
    formats: ["Objective (MCQ)", "Written theory"],
    paperTypes: ["Paper 1 — Objective", "Paper 2 — Theory/Essay"],
    status: "live",
    note: "Same paper structure as WAEC with its own marking character — practice both, sit either.",
  },
  {
    slug: "maneb", code: "maneb", name: "MANEB (MSCE / JCE)", country: "Malawi",
    examClass: "objective-theory",
    formats: ["Objective MCQ block", "Written theory"],
    paperTypes: ["MCQ block (e.g. 30-question English)", "Written theory papers"],
    status: "preparing",
    note: "A strong practice-engine candidate — MCQ blocks pair perfectly with shuffling drills.",
  },
  {
    slug: "cbse", code: "cbse", name: "CBSE", country: "India",
    examClass: "objective-theory",
    formats: ["Competency MCQs (20–40%)", "Written theory"],
    paperTypes: ["Competency-based MCQs", "Written theory papers"],
    status: "preparing",
    note: "Major Indian boards now carry compulsory competency-based MCQs inside written exams — we classify both.",
  },
  {
    slug: "icse", code: "icse", name: "ICSE", country: "India",
    examClass: "objective-theory",
    formats: ["Objective (MCQ)", "Written theory"],
    paperTypes: ["Objective paper", "Written theory papers"],
    status: "preparing",
    note: "Detailed written syllabi with growing objective sections — sorted by sub-topic as it lands.",
  },

  // ── Written Theory + Short Answer ───────────────────────────────────────
  {
    slug: "nsc-matric", code: "nsc", name: "DBE (NSC / Matric)", country: "South Africa",
    examClass: "written-theory",
    formats: ["Written theory", "Short answer"],
    paperTypes: ["Paper 1", "Paper 2", "Memo (marking scheme)"],
    status: "preparing",
    note: "Openly published past papers — structured science and maths questions work beautifully as interactive drills.",
  },
  {
    slug: "necta", code: "necta", name: "NECTA (CSEE / ACSEE)", country: "Tanzania",
    examClass: "written-theory",
    formats: ["Written theory", "Short answer", "Science & maths objective structures"],
    paperTypes: ["Theory papers", "Short-answer sections"],
    status: "preparing",
    note: "Text-heavy papers, but the objective science/math structures are excellent for online interactive practice.",
  },
  {
    slug: "kcse", code: "kcse", name: "KNEC (KCSE)", country: "Kenya",
    examClass: "written-theory",
    formats: ["Written theory", "Structured answer"],
    paperTypes: ["Theory papers", "Structured-answer questions"],
    status: "preparing",
    note: "East Africa's largest digital education market — content behaves like the UK framework, sorted by sub-topic.",
  },
  {
    slug: "cambridge", code: "cambridge", name: "Cambridge (CAIE)", country: "United Kingdom",
    examClass: "written-theory",
    formats: ["Written theory", "Short answer"],
    paperTypes: ["Written papers", "Short-answer questions"],
    status: "preparing",
    note: "International students rely extensively on question banks sorted by sub-topic — that is exactly how this lands.",
  },
  {
    slug: "aqa", code: "aqa", name: "AQA", country: "United Kingdom",
    examClass: "written-theory",
    formats: ["Written theory", "Short answer"],
    paperTypes: ["Written papers", "Short-answer questions"],
    status: "preparing",
    note: "GCSE and A-level specifications banked by sub-topic for structured revision.",
  },
  {
    slug: "edexcel", code: "edexcel", name: "Edexcel", country: "United Kingdom",
    examClass: "written-theory",
    formats: ["Written theory", "Short answer"],
    paperTypes: ["Written papers", "Short-answer questions"],
    status: "preparing",
    note: "Pearson Edexcel specifications banked by sub-topic for structured revision.",
  },
];

export const EXAM_CLASS_ORDER: ExamBankClass[] = ["cbt", "objective-theory", "written-theory"];

export function boardBySlug(slug: string): ExamBankBoard | null {
  return EXAM_BANK.find((b) => b.slug === slug.toLowerCase()) ?? null;
}

export function boardsInClass(examClass: ExamBankClass): ExamBankBoard[] {
  return EXAM_BANK.filter((b) => b.examClass === examClass);
}
