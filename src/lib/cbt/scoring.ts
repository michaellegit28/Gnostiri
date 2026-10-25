/**
 * CBT scoring — pure functions shared by the submit API (authoritative) and
 * the results UI (display). No DB access here.
 */
import type { ScoringModel } from "./config";

export interface SubjectResult {
  topicId: string;
  title: string;
  total: number;
  correct: number;
  rawPercent: number;
  scaled: number; // marks awarded under the board model
  grade?: string;
}

export interface CbtReport {
  boardCode: string;
  boardName: string;
  mode: "simulation" | "practice";
  model: ScoringModel;
  subjects: SubjectResult[];
  totalScore: number;
  maxTotal: number;
  percent: number;
  passMark?: number;
  passed?: boolean;
  grade?: string;
  /** per-question outcome, drives the review page */
  review: { questionId: string; subject: string; chosenIndex: number | null; correctIndex: number; correctText: string; options: string[]; questionText: string; correct: boolean; marked: boolean }[];
  answeredCount: number;
  questionCount: number;
  durationUsedSec: number;
}

export function gradeSubject(correct: number, total: number, model: ScoringModel): { rawPercent: number; scaled: number; grade?: string } {
  const rawPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
  if (model.kind === "jamb-scale") {
    return { rawPercent, scaled: Math.round((correct / Math.max(total, 1)) * model.scaledPerSubject) };
  }
  const grade = model.grades.find((g) => rawPercent >= g.min)?.grade;
  return { rawPercent, scaled: rawPercent, grade };
}

export function gradeForPercent(percent: number, model: ScoringModel): string | undefined {
  return model.kind === "percent" ? model.grades.find((g) => percent >= g.min)?.grade : undefined;
}
