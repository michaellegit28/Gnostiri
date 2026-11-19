import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";

export type QuizAnswerDomain = "highschool" | "university" | "extras";

export interface QuizAnswerEntry {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface QuizAnswerSession {
  id: string;
  kind: "quiz-answer-session";
  version: 1;
  userId: string;
  domain: QuizAnswerDomain;
  topicId: string;
  examCode: string | null;
  questionIds: string[];
  entries: QuizAnswerEntry[];
  startedAt: string;
  expiresAt: string;
  completed: boolean;
  parentSessionId?: string | null;
  attemptId?: string;
}

export function parseQuizAnswerSession(value: unknown): QuizAnswerSession | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const session = value as Partial<QuizAnswerSession>;
  if (
    session.kind !== "quiz-answer-session" ||
    typeof session.id !== "string" ||
    session.version !== 1 ||
    typeof session.userId !== "string" ||
    typeof session.domain !== "string" ||
    typeof session.topicId !== "string" ||
    !Array.isArray(session.questionIds) ||
    !session.questionIds.every((id) => typeof id === "string") ||
    !Array.isArray(session.entries) ||
    typeof session.startedAt !== "string" ||
    typeof session.expiresAt !== "string" ||
    typeof session.completed !== "boolean"
  ) {
    return null;
  }
  return session as QuizAnswerSession;
}

export function isQuizAnswerSessionActive(session: QuizAnswerSession, now = Date.now()) {
  return !session.completed && new Date(session.expiresAt).getTime() > now;
}

export async function createQuizAnswerSession({
  userId,
  domain,
  topicId,
  examCode,
  questionIds,
  parentSessionId = null,
}: {
  userId: string;
  domain: QuizAnswerDomain;
  topicId: string;
  examCode: string | null;
  questionIds: string[];
  parentSessionId?: string | null;
}) {
  const uniqueQuestionIds = Array.from(new Set(questionIds));
  const now = new Date();
  const id = randomUUID();
  const session: QuizAnswerSession = {
    id,
    kind: "quiz-answer-session",
    version: 1,
    userId,
    domain,
    topicId,
    examCode,
    questionIds: uniqueQuestionIds,
    entries: [],
    startedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    completed: false,
    parentSessionId,
  };
  return prisma.quizAttempt.create({
    data: {
      id,
      userId,
      domain,
      topicId,
      score: 0,
      maxScore: 0,
      durationSeconds: 0,
      answers: session as unknown as Prisma.InputJsonValue,
    },
    select: { id: true },
  });
}
