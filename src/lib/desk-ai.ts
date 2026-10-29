import OpenAI from "openai";
import type { LessonBlock } from "@/types/lesson";
import { AI_DISCLAIMER } from "@/lib/desk-pipeline";

/**
 * desk-ai.ts — the AI side of the Desk pipeline, env-gated end to end.
 *
 * When OPENAI_API_KEY is absent (local dev, free preview) every function here
 * stays unused: the pipeline runs the extractive path instead and marks the
 * document "needs-ai" rather than fabricating AI output. When the key is
 * present the model is called per chunk for notes and once per document for
 * the quiz. Model + endpoint mirror the tutor route
 * (src/app/api/tutor/route.ts): OpenAI-compatible client, OPENAI_BASE_URL
 * honoured for self-hosted endpoints.
 *
 * Model output is DRAFT material: every quiz item still passes
 * validateQuizItem before storage, and unverifiable items are dropped —
 * nothing from this module is ever marked verified.
 */

export interface DraftQuizItem {
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

export interface DraftNotes {
  title: string;
  blocks: LessonBlock[];
}

export function isAiConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

function deskModel(): string {
  return process.env.OPENAI_DESK_MODEL || process.env.OPENAI_TUTOR_MODEL || "gpt-4o-mini";
}

function client(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL || undefined });
}

/** Cost guard: the notes call sees one chunk; the quiz call sees a capped slice. */
export const QUIZ_TEXT_CAP = 12_000;

/**
 * Summarise one chunk into lesson-shaped blocks: a title, the honesty
 * disclaimer callout, and the model's points as paragraphs. Throws on a
 * network/model failure or unparseable output — the pipeline degrades the
 * document status rather than storing nonsense.
 */
export async function generateChunkNotes(chunkText: string, index: number): Promise<DraftNotes> {
  const openai = client();
  const response = await openai.chat.completions.create({
    model: deskModel(),
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You summarise textbook passages for a student. Return JSON only: {\"title\": string (<=60 chars), \"points\": string[] (3-5 faithful points, each <=300 chars)}. Points must come from the passage — no outside facts, no invented detail.",
      },
      { role: "user", content: `Passage ${index + 1}:\n${chunkText.slice(0, 6000)}` },
    ],
  });
  const parsed = JSON.parse(response.choices[0]?.message?.content || "{}") as { title?: unknown; points?: unknown };
  const title = typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim().slice(0, 60) : `Section ${index + 1}`;
  const points = Array.isArray(parsed.points) ? parsed.points.map((p) => String(p ?? "")).filter((p) => p.trim()) : [];
  const blocks: LessonBlock[] = [
    { type: "heading", level: 2, text: title },
    { type: "callout", variant: "info", text: AI_DISCLAIMER },
    ...points.map((point): LessonBlock => ({ type: "paragraph", text: point.trim().slice(0, 1000) })),
  ];
  return { title, blocks };
}

/**
 * Generate up to 10 single-best-answer questions for the document. The caller
 * runs validateQuizItem over the result and drops failures — the model is a
 * drafter, the invariants are the gate.
 */
export async function generateDocumentQuiz(documentTitle: string, text: string): Promise<DraftQuizItem[]> {
  const openai = client();
  const response = await openai.chat.completions.create({
    model: deskModel(),
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'You write hard conceptual single-best-answer questions for a study document. Return JSON only: {"items": [{"stem": string, "options": string[4], "correctAnswer": string (verbatim one of the options), "explanation": string (why it is right AND why the key distractors are wrong), "difficulty": "easy"|"medium"|"hard"}]}. Exactly 10 items. Options must be unique, non-empty, plausible distractors. Questions must be answerable from the passage only.',
      },
      { role: "user", content: `Document: ${documentTitle}\n\nPassage:\n${text.slice(0, QUIZ_TEXT_CAP)}` },
    ],
  });
  const parsed = JSON.parse(response.choices[0]?.message?.content || "{}") as { items?: unknown };
  if (!Array.isArray(parsed.items)) return [];
  return parsed.items.map((item) => {
    const it = (item ?? {}) as Record<string, unknown>;
    return {
      stem: String(it.stem ?? ""),
      options: Array.isArray(it.options) ? it.options.map((o) => String(o ?? "")) : [],
      correctAnswer: String(it.correctAnswer ?? ""),
      explanation: String(it.explanation ?? ""),
      difficulty: ["easy", "medium", "hard"].includes(String(it.difficulty)) ? String(it.difficulty) : "medium",
    };
  });
}
