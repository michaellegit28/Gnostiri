import { NextRequest, NextResponse } from "next/server";
import { AppDomain, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { PdfExtractionError, extractPdfText } from "@/lib/pdf";
import {
  buildExtractiveNotes,
  chunkText,
  contentHashOf,
  dedupeKey,
  normaliseText,
  scheduleTasks,
  validateQuizItem,
} from "@/lib/desk-pipeline";
import { generateChunkNotes, generateDocumentQuiz, isAiConfigured } from "@/lib/desk-ai";
import { createNotification } from "@/lib/notify";
import type { LessonBlock } from "@/types/lesson";

/**
 * /api/documents — the Desk pipeline entry point (ROADMAP.md Phase 3).
 *
 * POST accepts a PDF (multipart `file`, or base64 {filename, data}), extracts
 * text IN MEMORY (the source file is never stored), hashes the normalised text
 * for dedupe, and processes the document into notes + invariant-checked quiz
 * items + a scheduled study plan. Identical texts from any user reuse the
 * existing artifact — one textbook processed once per cohort.
 *
 * AI is env-gated: with OPENAI_API_KEY absent the document still completes
 * with honest extractive notes and status "needs-ai" (no fake quiz).
 */

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_PAGES = 120;
const FREE_DAILY_UPLOADS = 3;
const PRIME_DAILY_UPLOADS = 20;
const CHUNK_MAX_CHARS = 4000;
const AI_NOTE_CHUNK_CAP = 10; // cost lever: notes for the first N sections only
const QUIZ_TARGET = 10;
const DEFAULT_MINUTES = 30;
const DEFAULT_DAYS = 7;
const ALLOWED_MINUTES = [30, 60, 120];
const ALLOWED_DAYS = [3, 7];

interface PipelineOutcome {
  status: "ready" | "needs-ai" | "failed";
  notes: Array<{ title: string; blocks: LessonBlock[] }>;
  quizDrafts: Array<{ stem: string; options: string[]; correctAnswer: string; explanation: string; difficulty: string }>;
  errorNote: string | null;
  dropped: number;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function asString(value: unknown, maxLength: number): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, maxLength) : null;
}

/** Clamp the study-plan preferences to the supported grid. */
function pickPreference(value: unknown, allowed: number[], fallback: number): number {
  const parsed = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return allowed.includes(parsed) ? parsed : fallback;
}

/**
 * The processing core. Pure inputs in, artifact out; every model call is
 * guarded so a single failure degrades one section, never the whole document.
 */
async function runPipeline(normalised: string, ai: boolean, title: string): Promise<PipelineOutcome> {
  const chunks = chunkText(normalised, { maxChars: CHUNK_MAX_CHARS });

  if (!ai) {
    // Honest local path: extractive notes only, quiz skipped.
    return { status: "needs-ai", notes: buildExtractiveNotes(chunks), quizDrafts: [], errorNote: null, dropped: 0 };
  }

  const notes: PipelineOutcome["notes"] = [];
  for (let i = 0; i < Math.min(chunks.length, AI_NOTE_CHUNK_CAP); i += 1) {
    try {
      notes.push(await generateChunkNotes(chunks[i], i));
    } catch {
      // A failed section falls back to extractive summarisation for that
      // section only, marked by its own disclaimer callout.
      notes.push(buildExtractiveNotes([chunks[i]])[0]);
    }
  }
  if (chunks.length > AI_NOTE_CHUNK_CAP) {
    notes.push({
      title: "Additional sections",
      blocks: [
        {
          type: "callout",
          variant: "warning",
          text: `AI notes cover the first ${AI_NOTE_CHUNK_CAP} of ${chunks.length} sections (cost cap) — later sections were not summarised.`,
        },
      ],
    });
  }

  let quizDrafts: PipelineOutcome["quizDrafts"] = [];
  let quizError: string | null = null;
  try {
    quizDrafts = await generateDocumentQuiz(title, normalised);
  } catch (error) {
    quizError = error instanceof Error ? error.message.slice(0, 200) : "quiz generation failed";
  }

  const kept: PipelineOutcome["quizDrafts"] = [];
  let dropped = 0;
  for (const draft of quizDrafts.slice(0, QUIZ_TARGET)) {
    const verdict = validateQuizItem(draft);
    if (verdict.ok) kept.push(draft);
    else dropped += 1;
  }

  if (quizError) {
    return { status: "needs-ai", notes, quizDrafts: [], errorNote: `AI notes generated; quiz generation failed — ${quizError}`, dropped: 0 };
  }
  if (kept.length === 0) {
    return {
      status: "needs-ai",
      notes,
      quizDrafts: [],
      errorNote: quizDrafts.length === 0 ? "AI returned no quiz items" : `no quiz item passed the house invariants (${dropped} dropped)`,
      dropped,
    };
  }
  return { status: "ready", notes, quizDrafts: kept, errorNote: null, dropped };
}

interface ParsedUpload {
  filename: string;
  buffer: Buffer;
  minutesPerDay: number;
  days: number;
  subjectSlug: string | null;
}

/** Multipart `file` request, or JSON {filename, data(base64)}. */
async function parseUpload(req: NextRequest): Promise<ParsedUpload | { error: string }> {
  const contentType = req.headers.get("content-type") || "";
  const minutesPerDay = DEFAULT_MINUTES;
  const days = DEFAULT_DAYS;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return { error: "Attach a PDF in the 'file' field" };
    return {
      filename: file.name || "Untitled document",
      buffer: Buffer.from(await file.arrayBuffer()),
      minutesPerDay: pickPreference(form.get("minutesPerDay"), ALLOWED_MINUTES, minutesPerDay),
      days: pickPreference(form.get("days"), ALLOWED_DAYS, days),
      subjectSlug: asString(form.get("subjectSlug"), 60),
    };
  }

  try {
    const body = await req.json();
    if (typeof body?.data !== "string") return { error: "Send base64 PDF data in {filename, data}" };
    return {
      filename: typeof body.filename === "string" && body.filename.trim() ? body.filename.trim().slice(0, 120) : "Untitled document",
      buffer: Buffer.from(body.data, "base64"),
      minutesPerDay: pickPreference(body.minutesPerDay, ALLOWED_MINUTES, minutesPerDay),
      days: pickPreference(body.days, ALLOWED_DAYS, days),
      subjectSlug: asString(body.subjectSlug, 60),
    };
  } catch {
    return { error: "Body must be multipart/form-data or JSON" };
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let upload: ParsedUpload;
  try {
    const parsed = await parseUpload(req);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    upload = parsed;
  } catch {
    return NextResponse.json({ error: "Could not read the upload" }, { status: 400 });
  }

  if (upload.buffer.length === 0) return NextResponse.json({ error: "Upload is empty" }, { status: 400 });
  if (upload.buffer.length > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: `PDF exceeds the ${MAX_UPLOAD_BYTES / 1024 / 1024}MB limit` }, { status: 413 });
  }

  // Daily cap: 3 uploads free / 20 Prime (ROADMAP.md gating).
  const premium = await hasPremiumAccess(user.id, "highschool");
  const dailyCap = premium ? PRIME_DAILY_UPLOADS : FREE_DAILY_UPLOADS;
  const uploadedToday = await prisma.studyDocument.count({
    where: { userId: user.id, createdAt: { gte: startOfUtcDay(new Date()) } },
  });
  if (uploadedToday >= dailyCap) {
    return NextResponse.json(
      { error: `Daily upload limit reached (${dailyCap})`, tier: premium ? "prime" : "free", upgrade: !premium },
      { status: 429 },
    );
  }

  // ── Extract (in memory — the PDF is never stored) ──
  let extracted;
  try {
    extracted = await extractPdfText(upload.buffer);
  } catch (error) {
    const note = error instanceof PdfExtractionError ? error.message : "PDF could not be parsed";
    const failed = await prisma.studyDocument.create({
      data: {
        userId: user.id,
        title: upload.filename.slice(0, 120),
        contentHash: `failed:${randomUUID()}`,
        status: "failed",
        pageCount: 0,
        errorNote: note,
      },
    });
    return NextResponse.json({ document: failed, rejected: true, error: note }, { status: 201 });
  }

  if (extracted.pageCount > MAX_PAGES) {
    const failed = await prisma.studyDocument.create({
      data: {
        userId: user.id,
        title: upload.filename.slice(0, 120),
        contentHash: `failed:${randomUUID()}`,
        status: "failed",
        pageCount: extracted.pageCount,
        errorNote: `exceeds the ${MAX_PAGES}-page limit (${extracted.pageCount} pages)`,
      },
    });
    return NextResponse.json(
      { document: failed, rejected: true, error: `exceeds the ${MAX_PAGES}-page limit` },
      { status: 201 },
    );
  }

  // ── Hash + dedupe (the cost lever) ──
  const normalised = normaliseText(extracted.pages.join("\n"));
  // A scanned PDF has no text layer: hash the file bytes so identical files
  // still dedupe, while different scans never collide.
  const hash = normalised ? dedupeKey(normalised) : `scanned:${contentHashOf(upload.buffer.toString("base64"))}`;

  const existing = await prisma.studyDocument.findUnique({ where: { contentHash: hash } });
  if (existing) {
    // Already on this user's own desk? A repeat upload must not duplicate
    // their quiz items or stack a second copy of the same plan.
    const alreadyAdopted = await prisma.documentQuizItem.count({ where: { documentId: existing.id, userId: user.id } });
    if (existing.userId === user.id || alreadyAdopted > 0) {
      return NextResponse.json({ document: existing, deduped: true, alreadyOnDesk: true, tasksCreated: 0, quizCopied: alreadyAdopted }, { status: 201 });
    }
    // Same textbook, any user: adopt the existing processed artifact.
    const sourceItems = await prisma.documentQuizItem.findMany({ where: { documentId: existing.id }, orderBy: { createdAt: "asc" } });
    if (sourceItems.length > 0) {
      await prisma.documentQuizItem.createMany({
        data: sourceItems.map((item) => ({
          documentId: existing.id,
          userId: user.id,
          stem: item.stem,
          options: item.options as unknown as Prisma.InputJsonValue,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          difficulty: item.difficulty,
        })),
      });
    }
    const rows = scheduleTasks({
      minutesPerDay: upload.minutesPerDay,
      days: upload.days,
      startDate: new Date(),
      userId: user.id,
      documentId: existing.id,
      title: existing.title,
    });
    await prisma.studyTask.createMany({ data: rows });

    // Honest artifact_reward: the first uploader's processed notes were
    // reused by a classmate. Never sent to the reusing user themselves.
    if (existing.userId !== user.id) {
      try {
        await createNotification(existing.userId, {
          type: "artifact_reward",
          title: "Your processed notes were reused",
          body: `A classmate uploaded the same document (${existing.title.slice(0, 60)}) and is now studying from your processed notes and quiz.`,
          href: `/desk/${existing.id}`,
        });
      } catch {
        // A notification failure must never fail the pipeline.
      }
    }

    return NextResponse.json({ document: existing, deduped: true, tasksCreated: rows.length, quizCopied: sourceItems.length }, { status: 201 });
  }

  // ── New document: processing run ──
  const document = await prisma.studyDocument.create({
    data: {
      userId: user.id,
      title: upload.filename.slice(0, 120),
      contentHash: hash,
      domain: "highschool" as AppDomain,
      subjectSlug: upload.subjectSlug,
      status: "processing",
      pageCount: extracted.pageCount,
    },
  });

  let outcome: PipelineOutcome;
  try {
    outcome = normalised
      ? await runPipeline(normalised, isAiConfigured(), document.title)
      : { status: "needs-ai", notes: [], quizDrafts: [], errorNote: "no extractable text — scanned PDF", dropped: 0 };
  } catch (error) {
    const note = error instanceof Error ? error.message.slice(0, 200) : "processing failed";
    const failed = await prisma.studyDocument.update({ where: { id: document.id }, data: { status: "failed", errorNote: note } });
    return NextResponse.json({ document: failed, error: note }, { status: 201 });
  }

  await prisma.studyDocument.update({
    where: { id: document.id },
    data: { status: outcome.status, errorNote: outcome.errorNote, notes: outcome.notes as unknown as Prisma.InputJsonValue },
  });

  if (outcome.quizDrafts.length > 0) {
    await prisma.documentQuizItem.createMany({
      data: outcome.quizDrafts.map((draft) => ({
        documentId: document.id,
        userId: user.id,
        stem: draft.stem,
        options: draft.options as unknown as Prisma.InputJsonValue,
        correctAnswer: draft.correctAnswer,
        explanation: draft.explanation,
        difficulty: draft.difficulty,
      })),
    });
  }

  const rows = scheduleTasks({
    minutesPerDay: upload.minutesPerDay,
    days: upload.days,
    startDate: new Date(),
    userId: user.id,
    documentId: document.id,
    title: document.title,
  });
  await prisma.studyTask.createMany({ data: rows });

  if (outcome.status === "ready") {
    try {
      await createNotification(user.id, {
        type: "milestone",
        title: "Document processed",
        body: `${document.title.slice(0, 60)} is ready — notes and ${outcome.quizDrafts.length} quiz questions are on your desk.`,
        href: `/desk/${document.id}`,
      });
    } catch {
      // Notification is best-effort; the artifact already exists.
    }
  }

  const finished = await prisma.studyDocument.findUnique({
    where: { id: document.id },
    include: { _count: { select: { quizItems: true, tasks: true } } },
  });

  return NextResponse.json(
    {
      document: finished,
      deduped: false,
      tasksCreated: rows.length,
      quizCreated: outcome.quizDrafts.length,
      quizDropped: outcome.dropped,
      ai: isAiConfigured(),
    },
    { status: 201 },
  );
}

/** The user's documents: owned first, then adopted via dedupe. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const include = {
    _count: { select: { quizItems: { where: { userId: user.id } }, tasks: { where: { userId: user.id } } } },
  };
  const [owned, adopted] = await Promise.all([
    prisma.studyDocument.findMany({ where: { userId: user.id }, include, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.studyDocument.findMany({
      where: { userId: { not: user.id }, quizItems: { some: { userId: user.id } } },
      include,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return NextResponse.json({
    documents: [...owned, ...adopted].map((doc) => ({
      id: doc.id,
      title: doc.title,
      status: doc.status,
      pageCount: doc.pageCount,
      errorNote: doc.errorNote,
      subjectSlug: doc.subjectSlug,
      createdAt: doc.createdAt,
      owned: doc.userId === user.id,
      quizCount: doc._count.quizItems,
      taskCount: doc._count.tasks,
    })),
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
