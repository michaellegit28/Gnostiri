/**
 * CBT board presets — the single source of truth for the 4-step CBT flow.
 * Timing and scoring rules are OUR platform presets (informed by each board's
 * public structure) — nothing here copies any board's visual design.
 */

export type CbtMode = "simulation" | "practice";

export type ScoringModel =
  | { kind: "jamb-scale"; subjects: number; scaledPerSubject: number; maxTotal: number; passMark: number }
  | { kind: "percent"; maxTotal: number; grades: { grade: string; min: number }[] };

export interface CbtBoardPreset {
  code: string; // Examination.code
  slug: string; // Examination.slug
  name: string;
  tagline: string;
  maxSubjectSlots: number;
  /** Locked first slot (JAMB: Use of English is compulsory). */
  lockedFirstSubject?: { slug: string; title: string };
  sim: { questionsPerSubject: number; durationMinutes: number } | null;
  practice: { countOptions: number[]; durationOptionsMinutes: number[] };
  scoring: ScoringModel;
  theoryCapable: boolean;
  status: "live" | "preparing";
}

const WAEC_GRADES: { grade: string; min: number }[] = [
  { grade: "A1", min: 75 }, { grade: "B2", min: 70 }, { grade: "B3", min: 65 },
  { grade: "C4", min: 60 }, { grade: "C5", min: 55 }, { grade: "C6", min: 50 },
  { grade: "D7", min: 45 }, { grade: "E8", min: 40 }, { grade: "F9", min: 0 },
];

export const CBT_BOARDS: Record<string, CbtBoardPreset> = {
  jamb: {
    code: "jamb",
    slug: "jamb",
    name: "JAMB (UTME)",
    tagline: "Nigeria's university entrance exam — 4 subjects, one sitting.",
    maxSubjectSlots: 4,
    lockedFirstSubject: { slug: "english", title: "Use of English" },
    sim: { questionsPerSubject: 40, durationMinutes: 60 },
    practice: { countOptions: [10, 25, 40], durationOptionsMinutes: [15, 30, 60] },
    scoring: { kind: "jamb-scale", subjects: 4, scaledPerSubject: 100, maxTotal: 400, passMark: 140 },
    theoryCapable: false,
    status: "live",
  },
  waec: {
    code: "waec",
    slug: "waec",
    name: "WAEC (WASSCE)",
    tagline: "West African Senior School Certificate — objective + theory papers.",
    maxSubjectSlots: 1,
    sim: { questionsPerSubject: 50, durationMinutes: 50 },
    practice: { countOptions: [10, 25, 50], durationOptionsMinutes: [15, 30, 50] },
    scoring: { kind: "percent", maxTotal: 100, grades: WAEC_GRADES },
    theoryCapable: true,
    status: "live",
  },
  neco: {
    code: "neco",
    slug: "neco",
    name: "NECO (SSCE)",
    tagline: "National Examinations Council — senior secondary certificate.",
    maxSubjectSlots: 1,
    sim: { questionsPerSubject: 50, durationMinutes: 50 },
    practice: { countOptions: [10, 25, 50], durationOptionsMinutes: [15, 30, 50] },
    scoring: { kind: "percent", maxTotal: 100, grades: WAEC_GRADES },
    theoryCapable: true,
    status: "live",
  },
  sat: {
    code: "sat",
    slug: "sat",
    name: "College Board — Digital SAT",
    tagline: "US college admissions — adaptive Reading & Writing + Math.",
    maxSubjectSlots: 2,
    sim: null,
    practice: { countOptions: [10, 25], durationOptionsMinutes: [15, 30] },
    scoring: { kind: "percent", maxTotal: 100, grades: [] },
    theoryCapable: false,
    status: "preparing",
  },
  ap: {
    code: "ap",
    slug: "ap",
    name: "College Board — AP Exams",
    tagline: "US Advanced Placement — hybrid digital MCQ + free response.",
    maxSubjectSlots: 1,
    sim: null,
    practice: { countOptions: [10, 25], durationOptionsMinutes: [15, 30] },
    scoring: { kind: "percent", maxTotal: 100, grades: [] },
    theoryCapable: true,
    status: "preparing",
  },
};

/** Boards that appear on the exam-select grid, in display order. */
export const CBT_BOARD_ORDER = ["jamb", "sat", "ap"];

export function presetFor(code: string): CbtBoardPreset | null {
  return CBT_BOARDS[code.toLowerCase()] ?? null;
}

/** Human explanation of a scoring model — rendered on the results page. */
export function scoringExplainer(model: ScoringModel): string[] {
  if (model.kind === "jamb-scale") {
    return [
      `Each subject contributes ${model.scaledPerSubject} marks: your raw percentage on that subject's questions is scaled to ${model.scaledPerSubject}.`,
      `The four subject scores are added together for a total out of ${model.maxTotal}.`,
      `A total of ${model.passMark} is the widely used minimum for university admission, so we show it as your pass line.`,
    ];
  }
  return [
    `Every correct answer earns equal marks; your score is reported as a percentage out of ${model.maxTotal}.`,
    ...(model.grades.length
      ? [`Percentages map to grades: ${model.grades.map((g) => `${g.grade} ≥ ${g.min}%`).join(" · ")}.`]
      : []),
  ];
}
