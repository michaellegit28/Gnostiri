"use client";

import { useId, useState } from "react";
import type { LessonBlock, LessonContent } from "@/types/lesson";
import { AlertTriangle, CheckCircle2, FileCode2, Info, Lightbulb, PenLine, XCircle } from "lucide-react";

// High-school lesson block renderer.
//
// The study reader is a PRINTED PAGE (the paper medium in globals.css), not
// app chrome: the same values are theme-locked so the sheet reads the same in
// light and dark mode. It renders every LessonBlock type — including the
// interactive ones the old reader dropped (code, check question, theory, MCQ).
//
// Accessibility rules for the interactive blocks:
//  • the answer disclosure and the theory model answer are real buttons wired
//    with aria-expanded + aria-controls;
//  • MCQ feedback is announced in a polite live region;
//  • correct / incorrect is never colour-only — it is text + icon;
//  • the theory textarea has a real <label> and a visible word/char count.

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

function CodeBlock({ language, code, output, caption }: { language: string; code: string; output?: string; caption?: string }) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-[rgb(var(--paper-line))] bg-[rgb(var(--paper))]">
      <figcaption className="flex items-center gap-2 border-b border-[rgb(var(--paper-line))] bg-[rgb(var(--paper-wash))] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--paper-gold))]">
        <FileCode2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="font-mono">{language}</span>
        {caption && <span className="ml-2 truncate font-normal normal-case tracking-normal text-[rgb(var(--paper-ink-soft))]">{caption}</span>}
      </figcaption>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-[rgb(var(--paper-ink))]">
        <code>{code}</code>
      </pre>
      {output && (
        <div className="border-t border-[rgb(var(--paper-line))] bg-[rgb(var(--paper-navy-wash))] px-4 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[rgb(var(--paper-navy))]">
            <CheckCircle2 className="h-3 w-3" aria-hidden /> Output
          </div>
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-[rgb(var(--paper-navy))]">
            <code>{output}</code>
          </pre>
        </div>
      )}
    </figure>
  );
}

function QuestionBlock({ prompt, answer, explanation }: { prompt: string; answer: string; explanation?: string }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();
  return (
    <div className="my-6 rounded-xl border border-[rgb(var(--paper-navy/0.3))] bg-[rgb(var(--paper-navy-wash))] p-5">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--paper-navy))]">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
        Check your understanding
      </div>
      <p className="font-reading leading-relaxed text-[rgb(var(--paper-ink))]">{prompt}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={answerId}
        className="mt-3 inline-flex min-h-[44px] items-center rounded-lg border border-[rgb(var(--paper-navy/0.4))] px-3 py-1.5 text-sm font-semibold text-[rgb(var(--paper-navy))] transition-colors hover:bg-[rgb(var(--paper-navy/0.1))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--paper-gold))]"
      >
        {open ? "Hide answer" : "Show answer"}
      </button>
      {open && (
        <div id={answerId} className="mt-3 space-y-1 border-t border-[rgb(var(--paper-navy/0.2))] pt-3">
          <p className="font-reading leading-relaxed text-[rgb(var(--paper-ink))]">
            <span className="font-semibold text-[rgb(var(--paper-green))]">Answer: </span>
            {answer}
          </p>
          {explanation && <p className="text-sm font-reading leading-relaxed text-[rgb(var(--paper-ink-soft))]">{explanation}</p>}
        </div>
      )}
    </div>
  );
}

function TheoryBlock({ prompt, modelAnswer, explanation }: { prompt: string; modelAnswer: string; explanation?: string }) {
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const draftId = useId();
  const answerId = useId();
  const words = draft.trim() === "" ? 0 : draft.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="my-6 rounded-xl border border-[rgb(var(--paper-gold/0.4))] bg-[rgb(var(--paper-wash))] p-5">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[rgb(var(--paper-gold))]">
        <PenLine className="h-3.5 w-3.5" aria-hidden />
        Theory — write your answer
      </div>
      <p className="font-reading leading-relaxed text-[rgb(var(--paper-ink))]">{prompt}</p>

      <label htmlFor={draftId} className="sr-only">
        {prompt}
      </label>
      <textarea
        id={draftId}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={8}
        spellCheck={true}
        placeholder="Write your answer here — argue it in sentences."
        className="mt-3 min-h-[220px] w-full resize-y rounded-xl border border-[rgb(var(--paper-line))] bg-[rgb(var(--paper))] p-4 text-[15px] leading-relaxed text-[rgb(var(--paper-ink))] placeholder:text-[rgb(var(--paper-ink-soft))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--paper-gold))]"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p aria-hidden="true" className="text-xs tabular-nums text-[rgb(var(--paper-ink-soft))]">
          {words} words · {draft.length} chars
        </p>
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-expanded={revealed}
          aria-controls={answerId}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[rgb(var(--paper-gold/0.5))] px-3 py-1.5 text-sm font-semibold text-[rgb(var(--paper-gold))] transition-colors hover:bg-[rgb(var(--paper-gold/0.1))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--paper-gold))]"
        >
          <Lightbulb className="h-3.5 w-3.5" aria-hidden />
          {revealed ? "Hide model answer" : "Reveal model answer"}
        </button>
      </div>

      {revealed && (
        <div id={answerId} className="mt-3 space-y-2 border-t border-[rgb(var(--paper-gold/0.3))] pt-3">
          <p className="font-reading leading-relaxed text-[rgb(var(--paper-ink))]">
            <span className="font-semibold text-[rgb(var(--paper-gold))]">Model answer: </span>
            {modelAnswer}
          </p>
          {explanation && <p className="text-sm font-reading leading-relaxed text-[rgb(var(--paper-ink-soft))]">{explanation}</p>}
        </div>
      )}
    </div>
  );
}

function McqBlock({ stem, options, correctIndex, explanation }: { stem: string; options: string[]; correctIndex: number; explanation: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const groupId = useId();
  const answered = selected !== null;
  const safeCorrect = correctIndex >= 0 && correctIndex < options.length ? correctIndex : 0;
  const isCorrect = selected === safeCorrect;
  const letters = options.map((_, i) => LETTERS[i] ?? String(i + 1));

  return (
    <div className="my-6 rounded-xl border border-[rgb(var(--paper-line))] bg-[rgb(var(--paper))] p-5">
      <p className="font-medium font-reading leading-relaxed text-[rgb(var(--paper-ink))]">{stem}</p>
      <div role="group" aria-labelledby={groupId} className="mt-3 space-y-2">
        <span id={groupId} className="sr-only">
          Multiple choice options
        </span>
        {options.map((opt, oi) => {
          const chosen = selected === oi;
          const correct = oi === safeCorrect;
          const revealCorrect = answered && correct;
          const revealWrong = answered && chosen && !correct;
          return (
            <button
              key={oi}
              type="button"
              onClick={() => setSelected(oi)}
              disabled={answered}
              aria-pressed={chosen}
              className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--paper-gold))] ${
                revealCorrect
                  ? "border-[rgb(var(--paper-green))] bg-[rgb(var(--paper-green/0.1))]"
                  : revealWrong
                    ? "border-[rgb(var(--paper-amber))] bg-[rgb(var(--paper-amber/0.1))]"
                    : chosen
                      ? "border-[rgb(var(--paper-gold))] bg-[rgb(var(--paper-gold/0.1))]"
                      : "border-[rgb(var(--paper-line))] bg-[rgb(var(--paper-wash))] hover:border-[rgb(var(--paper-gold/0.6))]"
              } ${answered && !chosen && !correct ? "opacity-70" : ""}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  revealCorrect
                    ? "bg-[rgb(var(--paper-green))] text-[rgb(var(--paper))]"
                    : revealWrong
                      ? "bg-[rgb(var(--paper-amber))] text-[rgb(var(--paper))]"
                      : chosen
                        ? "bg-[rgb(var(--paper-gold))] text-[rgb(var(--paper))]"
                        : "bg-[rgb(var(--paper-wash))] text-[rgb(var(--paper-ink-soft))]"
                }`}
              >
                {letters[oi]}
              </span>
              <span className={revealCorrect ? "text-[rgb(var(--paper-green))]" : revealWrong ? "text-[rgb(var(--paper-amber))]" : chosen ? "text-[rgb(var(--paper-ink))]" : "text-[rgb(var(--paper-ink-soft))]"}>
                {opt}
              </span>
              {revealCorrect && <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--paper-green))]" aria-hidden />}
              {revealWrong && <XCircle className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--paper-amber))]" aria-hidden />}
            </button>
          );
        })}
      </div>
      <div role="status" aria-live="polite">
        {answered && (
          <p className={`mt-3 flex items-start gap-1.5 text-sm ${isCorrect ? "text-[rgb(var(--paper-green))]" : "text-[rgb(var(--paper-amber))]"}`}>
            {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            <span>
              {isCorrect ? "Correct. " : `Not quite — the answer is ${letters[safeCorrect]}. `}
              <span className="text-[rgb(var(--paper-ink-soft))]">{explanation}</span>
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function renderBlock(block: LessonBlock, key: number) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 key={key} className="font-serif text-2xl md:text-3xl font-bold text-[rgb(var(--paper-ink))] mt-8 mb-4 border-b border-[rgb(var(--paper-line))] pb-2">
          {block.text}
        </h2>
      ) : (
        <h3 key={key} className="font-serif text-xl md:text-2xl font-semibold text-[rgb(var(--paper-gold))] mt-6 mb-3">
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p key={key} className="text-[rgb(var(--paper-ink-soft))] font-reading text-base md:text-lg leading-[1.8] my-4">
          {block.text}
        </p>
      );

    case "definition":
      return (
        <div key={key} className="border border-[rgb(var(--paper-gold/0.5))] bg-[rgb(var(--paper-wash))] rounded-xl p-5 my-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--paper-gold))] mb-1">
            Key idea
          </div>
          <div className="font-bold text-[rgb(var(--paper-ink))] text-lg mb-2">{block.term}</div>
          <div className="text-[rgb(var(--paper-ink-soft))] font-reading leading-relaxed">{block.text}</div>
        </div>
      );

    case "example":
      return (
        <div key={key} className="border-l-4 border-[rgb(var(--paper-green))] bg-[rgb(var(--paper-navy-wash))] rounded-r-xl p-5 my-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--paper-green))] mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" aria-hidden />
            <span>Example</span>
          </div>
          <div className="text-[rgb(var(--paper-ink-soft))] font-reading leading-relaxed">{block.text}</div>
        </div>
      );

    case "callout":
      return block.variant === "info" ? (
        <div key={key} className="border border-[rgb(var(--paper-navy/0.3))] bg-[rgb(var(--paper-navy-wash))] text-[rgb(var(--paper-navy))] rounded-xl p-5 my-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-[rgb(var(--paper-navy))] shrink-0 mt-0.5" aria-hidden />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--paper-navy))] mb-1">
              Note
            </div>
            <div className="font-reading leading-relaxed">{block.text}</div>
          </div>
        </div>
      ) : (
        <div key={key} className="border border-[rgb(var(--paper-amber/0.4))] bg-[rgb(var(--paper-amber-wash))] text-[rgb(var(--paper-amber))] rounded-xl p-5 my-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[rgb(var(--paper-amber))] shrink-0 mt-0.5" aria-hidden />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--paper-amber))] mb-1">
              Watch out
            </div>
            <div className="font-reading leading-relaxed">{block.text}</div>
          </div>
        </div>
      );

    case "table":
      return (
        <div key={key} className="overflow-x-auto my-6 rounded-xl border border-[rgb(var(--paper-line))] bg-[rgb(var(--paper))]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[rgb(var(--paper-wash))] border-b border-[rgb(var(--paper-line))]">
              <tr>
                {block.headers.map((header, hIdx) => (
                  <th key={hIdx} className="p-3 text-sm font-semibold text-[rgb(var(--paper-ink))] border-r border-[rgb(var(--paper-line))] last:border-r-0">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--paper-line))]">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[rgb(var(--paper-wash))]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 text-sm font-reading text-[rgb(var(--paper-ink-soft))] border-r border-[rgb(var(--paper-line))] last:border-r-0">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "code":
      return <CodeBlock key={key} language={block.language} code={block.code} output={block.output} caption={block.caption} />;

    case "question":
      return <QuestionBlock key={key} prompt={block.prompt} answer={block.answer} explanation={block.explanation} />;

    case "theory":
      return <TheoryBlock key={key} prompt={block.prompt} modelAnswer={block.modelAnswer} explanation={block.explanation} />;

    case "mcq":
      return <McqBlock key={key} stem={block.stem} options={block.options} correctIndex={block.correctIndex} explanation={block.explanation} />;

    case "diagram":
      return (
        <div key={key} className="my-6 rounded-xl border border-dashed border-[rgb(var(--paper-line))] p-4 text-sm text-[rgb(var(--paper-ink-soft))]">
          Diagram unavailable — {block.diagramId}. {block.caption}
        </div>
      );

    default:
      return null;
  }
}

export default function StudyBlockRenderer({ content }: { content: LessonContent | null | undefined }) {
  if (!content?.blocks?.length) return null;
  return (
    <div className="space-y-2">
      {content.blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}