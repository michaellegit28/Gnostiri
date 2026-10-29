import { createHash } from "crypto";
import type { LessonBlock } from "@/types/lesson";

/**
 * desk-pipeline.ts — pure logic for the Desk PDF pipeline (ROADMAP.md Phase 3).
 *
 * Nothing here touches the database, the network, or the filesystem: the whole
 * module is unit-testable with `node --test` (see tests/desk-pipeline.test.mjs).
 * The AI path is env-gated (see desk-ai.ts); every function below must stay
 * deterministic and side-effect free.
 *
 * The honesty boundary lives here too: extractive output is capped, ranked
 * real sentences from the source text — never paraphrased, never invented —
 * and carries a callout saying so (EXTRACTIVE_DISCLAIMER).
 */

// ── Normalisation + content hashing (the dedupe lever) ──────────────────────

/**
 * Normalise extracted text before hashing: PDF layout noise (ragged spacing,
 * line breaks mid-sentence, trailing whitespace) must not defeat dedupe of the
 * same textbook, while real content differences must. Collapsing all runs of
 * whitespace to single spaces is the stable compromise — hash collisions would
 * only merge texts identical after normalisation.
 */
export function normaliseText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** sha256 of already-normalised text, lowercase hex. */
export function contentHashOf(normalised: string): string {
  return createHash("sha256").update(normalised, "utf8").digest("hex");
}

/**
 * The key a dedupe lookup uses. Same input, same key, always — two uploads of
 * the same textbook (any user, any session) land on one processed artifact.
 */
export function dedupeKey(normalisedText: string): string {
  return contentHashOf(normalisedText);
}

// ── Sentence splitting + chunking ───────────────────────────────────────────

/** Sentence terminators we honour when splitting prose. */
const SENTENCE_END = /[.!?]/;

/**
 * Split text into sentences on terminators followed by whitespace. The final
 * fragment is kept even without a terminator (PDFs often truncate mid-sentence
 * at page breaks), so no content is ever silently dropped.
 */
export function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const out: string[] = [];
  let start = 0;
  for (let i = 0; i < clean.length; i += 1) {
    if (!SENTENCE_END.test(clean[i])) continue;
    // Only break on a terminator that starts a new sentence: next char is a
    // space and the char after it begins a capitalised word (guards against
    // "3.5 models" and "U.S. army").
    const next = clean[i + 1];
    const after = clean[i + 2];
    if (next === " " && (i === clean.length - 1 || /[A-Z("']/.test(after ?? ""))) {
      const sentence = clean.slice(start, i + 1).trim();
      if (sentence) out.push(sentence);
      start = i + 1;
    }
  }
  const tail = clean.slice(start).trim();
  if (tail) out.push(tail);
  return out;
}

/**
 * Split normalised text into chunks of at most `maxChars`.
 *
 * Greedy sentence packing keeps sentences whole so ranking stays meaningful;
 * a single sentence longer than the cap is hard-split so the bound always
 * holds. For prose whose sentences fit, joining the chunks with a single space
 * reproduces the input exactly.
 */
export function chunkText(text: string, options: { maxChars: number }): string[] {
  const limit = Math.max(1, Math.floor(options.maxChars));
  const clean = normaliseText(text);
  if (!clean) return [];

  const sentences = splitSentences(clean);
  const chunks: string[] = [];
  let current = "";

  const pushHardSplit = (piece: string) => {
    for (let i = 0; i < piece.length; i += limit) chunks.push(piece.slice(i, i + limit));
  };

  for (const sentence of sentences) {
    if (!current) {
      if (sentence.length <= limit) current = sentence;
      else pushHardSplit(sentence);
      continue;
    }
    if (current.length + 1 + sentence.length <= limit) {
      current = `${current} ${sentence}`;
      continue;
    }
    chunks.push(current);
    if (sentence.length <= limit) current = sentence;
    else {
      pushHardSplit(sentence);
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// ── Extractive notes: term-frequency sentence ranking ───────────────────────

/** Common English words carrying no topical signal — excluded from scoring. */
const STOP_WORDS = new Set([
  "that", "this", "with", "from", "which", "where", "when", "what", "have", "has", "had",
  "will", "would", "could", "should", "their", "there", "these", "those", "than", "then",
  "them", "they", "your", "yours", "about", "into", "over", "under", "after", "before",
  "between", "because", "while", "each", "some", "such", "only", "also", "very", "much",
  "more", "most", "many", "made", "make", "does", "done", "being", "been", "were", "are",
  "and", "but", "not", "for", "the", "you", "its", "his", "her", "our", "who", "how",
]);

/** Words that count toward term frequency: lowercased, 4+ chars, not stop words. */
function scoredWords(sentence: string): string[] {
  return (sentence.toLowerCase().match(/[a-z0-9]{4,}/g) ?? []).filter((w) => !STOP_WORDS.has(w));
}

/**
 * Rank sentences by term frequency, return up to `topN` in document order.
 *
 * Score = summed term frequency of the sentence's words, divided by the square
 * root of its word count (length normalisation stops one long sentence
 * winning on volume alone). Ties break on document order, so the result is
 * deterministic. Sentences under 4 words never rank — a fragment carries no
 * concept. Returns only real sentences from the input: nothing is invented.
 */
export function rankSentences(chunk: string, topN: number): string[] {
  const sentences = splitSentences(chunk).filter((s) => s.split(" ").length >= 4);
  if (sentences.length === 0) return [];

  const freq = new Map<string, number>();
  for (const sentence of sentences) {
    for (const word of scoredWords(sentence)) freq.set(word, (freq.get(word) ?? 0) + 1);
  }

  const scored = sentences.map((sentence, index) => {
    const words = scoredWords(sentence);
    const score = words.reduce((sum, w) => sum + (freq.get(w) ?? 0), 0) / Math.sqrt(words.length || 1);
    return { sentence, index, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(0, Math.floor(topN)))
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.sentence);
}

/** Shown at the top of every extractive section — the honesty marker. */
export const EXTRACTIVE_DISCLAIMER = "Generated by extractive summarisation — no AI model configured.";

/** Shown at the top of every AI-generated section — the other honesty marker. */
export const AI_DISCLAIMER = "AI-generated summary — verify against your source material.";

/**
 * Build extractive notes for each chunk: a section heading, the disclaimer
 * callout, then the top-ranked sentences as paragraphs. Blocks are shaped for
 * the existing LessonRenderer (src/components/university/LessonRenderer.tsx),
 * so processed documents render in the same reader as authored lessons.
 */
export function buildExtractiveNotes(chunks: string[], topN = 4): Array<{ title: string; blocks: LessonBlock[] }> {
  return chunks.map((chunk, i) => {
    const paragraphs: LessonBlock[] = rankSentences(chunk, topN).map((sentence) => ({ type: "paragraph", text: sentence }));
    return {
      title: `Section ${i + 1}`,
      blocks: [
        { type: "heading", level: 2, text: `Section ${i + 1}` },
        { type: "callout", variant: "info", text: EXTRACTIVE_DISCLAIMER },
        ...paragraphs,
      ],
    };
  });
}

// ── Quiz item invariants (same discipline as the assessment seeds) ───────────

export type QuizItemShape = {
  stem?: unknown;
  options?: unknown;
  correctAnswer?: unknown;
  explanation?: unknown;
};

export type QuizItemVerdict = { ok: true } | { ok: false; reason: string };

/**
 * The house invariants a quiz item must satisfy before it is stored:
 *   - stem and explanation are non-empty strings
 *   - exactly 4 options, each a non-empty string, all unique
 *   - correctAnswer is a non-empty string present VERBATIM in the options
 * (the scorer compares the learner's selection against the stored string —
 *  a drifting key silently marks everyone wrong)
 *
 * Returns { ok: true } or { ok: false, reason } — callers drop invalid items
 * and report how many were dropped.
 */
export function validateQuizItem(shape: QuizItemShape): QuizItemVerdict {
  if (typeof shape.stem !== "string" || !shape.stem.trim()) return { ok: false, reason: "stem is empty" };
  if (typeof shape.explanation !== "string" || !shape.explanation.trim()) return { ok: false, reason: "explanation is empty" };
  if (!Array.isArray(shape.options)) return { ok: false, reason: "options must be an array" };
  if (shape.options.length !== 4) return { ok: false, reason: `expected 4 options, got ${shape.options.length}` };
  if (!shape.options.every((o) => typeof o === "string" && o.trim())) return { ok: false, reason: "an option is empty" };
  if (new Set(shape.options).size !== shape.options.length) return { ok: false, reason: "duplicate option" };
  if (typeof shape.correctAnswer !== "string" || !shape.correctAnswer.trim()) return { ok: false, reason: "correctAnswer is empty" };
  if (!shape.options.includes(shape.correctAnswer)) return { ok: false, reason: "correctAnswer not found verbatim in options" };
  return { ok: true };
}

// ── Study-task scheduling ───────────────────────────────────────────────────

export interface ScheduleTasksInput {
  minutesPerDay: number;
  days: number;
  startDate: Date;
  userId?: string;
  documentId?: string | null;
  title?: string;
}

export interface ScheduledTaskRow {
  userId: string;
  documentId: string | null;
  kind: "reading" | "quiz";
  title: string;
  minutes: number;
  scheduledFor: Date;
  status: "pending";
}

/** Midnight UTC on the start date — deterministic day boundaries. */
function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Build the reading plan for one document.
 *
 * Deterministic shape (ROADMAP.md §5: 30 min–2 h/day × 3/7-day streaks):
 *   - day 1: reading
 *   - middle days: reading only when the daily budget is >= 60 minutes
 *     (a 30-minute day cannot hold reading + anything else)
 *   - final day: the quiz
 * Every task stays inside the daily minutes budget; dates never land before
 * the start date. Returns StudyTask-shaped rows (no id/createdAt — the caller
 * creates the rows).
 */
export function scheduleTasks(input: ScheduleTasksInput): ScheduledTaskRow[] {
  const days = Math.max(1, Math.floor(input.days));
  const minutesPerDay = Math.max(5, Math.floor(input.minutesPerDay));
  const base = startOfUtcDay(input.startDate);
  const docTitle = (input.title ?? "Document").slice(0, 80);
  const userId = input.userId ?? "";
  const documentId = input.documentId ?? null;
  const quizMinutes = Math.min(minutesPerDay, 45);

  const rows: ScheduledTaskRow[] = [];
  const push = (dayIndex: number, kind: "reading" | "quiz") => {
    rows.push({
      userId,
      documentId,
      kind,
      title: kind === "reading" ? `Reading: ${docTitle}` : `Quiz: ${docTitle}`,
      minutes: kind === "reading" ? minutesPerDay : quizMinutes,
      scheduledFor: new Date(base.getTime() + dayIndex * 86_400_000),
      status: "pending",
    });
  };

  for (let day = 1; day <= days; day += 1) {
    if (day === 1) push(0, "reading");
    if (day > 1 && day < days && minutesPerDay >= 60) push(day - 1, "reading");
    if (day === days) push(day - 1, "quiz");
  }
  return rows;
}
