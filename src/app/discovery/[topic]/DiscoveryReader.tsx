"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileCode2,
  HelpCircle,
  Info,
  MessageSquare,
  Telescope,
} from "lucide-react";
import type { LessonBlock } from "@/types/lesson";
import FilterChips from "@/components/ui/FilterChips";
import TheoryPrompt from "@/components/discovery/TheoryPrompt";

export const DEPTHS = ["Understand", "Explore", "Go Deeper", "Research"];

export interface DepthLesson {
  id: string;
  title: string;
  depth: number;
  blocks: LessonBlock[];
}

export interface TrailLink {
  id: string;
  title: string;
}

interface DiscoveryReaderProps {
  topicId: string;
  title: string;
  trail: TrailLink[];
  lessons: DepthLesson[];
  subtopics: TrailLink[];
  siblings: TrailLink[];
  /** Only legacy extras topics that still own Question rows show the quiz door. */
  hasQuiz: boolean;
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mt-8 mb-4">
          {block.text}
        </h2>
      ) : (
        <h3 className="font-serif text-xl font-semibold text-gold mt-6 mb-3">
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-slate-300 font-reading text-base md:text-lg leading-[1.8] my-4">
          {block.text}
        </p>
      );
    case "definition":
      return (
        <div className="border border-gold/30 bg-gold/5 rounded-xl p-5 my-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">
            Key idea
          </div>
          <div className="font-bold text-slate-100 text-lg mb-2">{block.term}</div>
          <div className="text-slate-300 font-reading leading-relaxed">{block.text}</div>
        </div>
      );
    case "example":
      return (
        <div className="border-l-4 border-violet-400 bg-violet-950/20 rounded-r-xl p-5 my-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-violet-300 mb-2">
            See it in action
          </div>
          <div className="text-slate-200 font-reading leading-relaxed">{block.text}</div>
        </div>
      );
    case "callout":
      return block.variant === "info" ? (
        <div className="my-6 flex items-start gap-3 border border-sky-500/30 bg-sky-950/20 text-sky-200 rounded-xl p-5 leading-relaxed">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
              Note
            </div>
            {block.text}
          </div>
        </div>
      ) : (
        <div className="my-6 flex items-start gap-3 border border-rose-500/30 bg-rose-950/20 text-rose-200 rounded-xl p-5 leading-relaxed">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
              Watch out
            </div>
            {block.text}
          </div>
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto my-6 rounded-xl border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="p-3 text-sm font-semibold text-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 text-sm text-slate-300">
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
      return (
        <CodeCard
          language={block.language}
          code={block.code}
          output={block.output}
          caption={block.caption}
        />
      );
    case "question":
      return (
        <QuestionCard
          prompt={block.prompt}
          answer={block.answer}
          explanation={block.explanation}
        />
      );
    case "theory":
      return (
        <TheoryPrompt
          prompt={block.prompt}
          modelAnswer={block.modelAnswer}
          explanation={block.explanation}
        />
      );
    case "mcq":
      return (
        <McqCard
          stem={block.stem}
          options={block.options}
          correctIndex={block.correctIndex}
          explanation={block.explanation}
        />
      );
    case "diagram":
      return (
        <div className="my-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-500">
          Diagram unavailable — {block.diagramId}
          <span className="mt-1 block text-slate-600">{block.caption}</span>
        </div>
      );
    default: {
      // Exhaustiveness guard: if a block type is ever added to LessonBlock,
      // this line fails to compile until a case handles it above.
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}

/** A, B, C … — mcq options are conventionally lettered from index 0. */
function letterFor(index: number): string {
  return String.fromCharCode(65 + Math.min(Math.max(index, 0), 25));
}

/** Code with exact output — the cosmic-theme twin of the university code block. */
function CodeCard({
  language,
  code,
  output,
  caption,
}: {
  language: string;
  code: string;
  output?: string;
  caption?: string;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a1a]">
      <figcaption className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-gold">
          <FileCode2 className="h-3 w-3" />
          {language}
        </span>
        {caption && <span className="text-xs text-slate-400">{caption}</span>}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
      {output && (
        <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Output
          </div>
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-emerald-300/90">
            <code>{output}</code>
          </pre>
        </div>
      )}
    </figure>
  );
}

/** Question with an inline reveal — answer stays hidden until asked for. */
function QuestionCard({
  prompt,
  answer,
  explanation,
}: {
  prompt: string;
  answer: string;
  explanation?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const answerId = useId();
  return (
    <div className="my-6 rounded-xl border border-violet-400/30 bg-violet-950/20 p-5">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300">
        <CheckCircle2 className="h-3.5 w-3.5" /> Check yourself
      </div>
      <p className="text-slate-200 font-reading leading-relaxed">{prompt}</p>
      {revealed ? (
        <div
          id={answerId}
          className="mt-3 space-y-2 border-t border-violet-400/20 pt-3"
        >
          <p className="text-slate-300 font-reading leading-relaxed">
            <span className="font-semibold text-gold">Answer: </span>
            {answer}
          </p>
          {explanation && (
            <p className="text-sm text-slate-400 leading-relaxed">{explanation}</p>
          )}
          <button
            type="button"
            onClick={() => setRevealed(false)}
            aria-expanded={true}
            aria-controls={answerId}
            className="min-h-[44px] text-xs font-semibold text-violet-300 underline hover:text-violet-200"
          >
            Hide answer
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          aria-expanded={false}
          aria-controls={answerId}
          className="mt-3 min-h-[44px] rounded-lg border border-violet-400/40 px-4 py-2 text-sm font-semibold text-violet-200 hover:border-gold/60 hover:text-gold transition-colors"
        >
          Reveal the answer
        </button>
      )}
    </div>
  );
}

/** MCQ with selectable options — the correct option and explanation are revealed on pick. */
function McqCard({
  stem,
  options,
  correctIndex,
  explanation,
}: {
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = picked !== null;
  // Defensive clamp: legacy rows may carry a key outside the option range.
  const keyIndex = Math.min(Math.max(correctIndex, 0), Math.max(options.length - 1, 0));
  return (
    <div className="my-6 rounded-xl border border-gold/30 bg-gold/5 p-5">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
        <HelpCircle className="h-3.5 w-3.5" /> Quick check
      </div>
      <p className="text-slate-100 font-reading font-medium leading-relaxed">{stem}</p>
      <div className="mt-3 space-y-2" role="group" aria-label={stem}>
        {options.map((option, index) => {
          const isCorrect = index === keyIndex;
          const isPicked = picked === index;
          const tone = !revealed
            ? "border-white/10 bg-white/5 text-slate-300 hover:border-gold/40"
            : isCorrect
              ? "border-gold/60 bg-gold/10 text-gold"
              : isPicked
                ? "border-rose-500/40 bg-rose-950/20 text-rose-200"
                : "border-white/10 bg-white/[0.02] text-slate-500";
          const chip = !revealed
            ? "bg-white/10 text-slate-400"
            : isCorrect
              ? "bg-gold text-slate-950"
              : isPicked
                ? "bg-rose-500/80 text-white"
                : "bg-white/5 text-slate-600";
          return (
            <button
              key={index}
              type="button"
              onClick={() => setPicked(index)}
              aria-pressed={isPicked}
              className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${tone}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${chip}`}
              >
                {letterFor(index)}
              </span>
              <span className="font-reading leading-relaxed">{option}</span>
            </button>
          );
        })}
      </div>
      {revealed && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm text-slate-400 leading-relaxed"
        >
          <span className="font-semibold text-gold">
            {picked === keyIndex ? "Correct — " : "Not quite — "}
            the answer is {letterFor(keyIndex)}.{" "}
          </span>
          {explanation}
        </p>
      )}
    </div>
  );
}

export default function DiscoveryReader({
  topicId,
  title,
  trail,
  lessons,
  subtopics,
  siblings,
  hasQuiz,
}: DiscoveryReaderProps) {
  const [depth, setDepth] = useState(0);
  const active = lessons.find((l) => l.depth === depth) ?? null;
  const maxDepth = lessons.length
    ? Math.max(...lessons.map((l) => l.depth))
    : 0;

  return (
    <div className="min-h-screen bg-transparent text-slate-50">
      {/* Cosmic header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#1b1440_0%,#0d0a24_50%,#060814_100%)]">
        <div className="relative max-w-4xl mx-auto px-6 py-10 md:py-14">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-slate-400">
            <Link href="/discovery" className="hover:text-gold transition-colors">
              Discovery
            </Link>
            {trail.map((t) => (
              <span key={t.id} className="flex items-center gap-1.5">
                <span className="text-slate-600">/</span>
                <Link href={`/discovery/${t.id}`} className="hover:text-gold transition-colors">
                  {t.title}
                </Link>
              </span>
            ))}
          </nav>
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Telescope className="w-4 h-4" />
            <span>
              Depth {Math.min(depth + 1, 4)} of 4 — {DEPTHS[Math.min(depth, 3)]}
            </span>
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-serif font-bold tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Depth selector */}
        <FilterChips
          items={DEPTHS.map((d, i) => ({
            value: String(i),
            label: d,
            disabled: !lessons.some((l) => l.depth === i),
          }))}
          value={String(depth)}
          onChange={(v) => setDepth(Number(v))}
          label="Depth"
          variant="tabs"
          idPrefix="depth"
          panelId="depth-panel"
        />

        {/* Body — controlled by the depth tablist above */}
        <div
          id="depth-panel"
          role="tabpanel"
          aria-labelledby={`depth-${depth}`}
          tabIndex={0}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl"
        >

        {/* Body */}
        {active ? (
          <article className="mt-2">
            {active.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </article>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h2 className="font-serif text-xl font-bold text-slate-200">
              This depth is still being charted
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              Our guides haven&apos;t mapped {DEPTHS[Math.min(depth, 3)]} for {title} yet.
              Ask the tutor to take you there right now.
            </p>
            <Link
              href={`/tutor?domain=extras&topicId=${encodeURIComponent(topicId)}`}
              className="mt-5 inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 rounded-lg bg-gold text-slate-950 font-semibold text-sm hover:bg-gold-hover transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Take me deeper
            </Link>
          </div>
        )}
        </div>

        {/* Go deeper */}
        {subtopics.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowDown className="w-5 h-5 text-gold" />
              Go deeper
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {subtopics.map((c) => (
                <Link
                  key={c.id}
                  href={`/discovery/${c.id}`}
                  className="group rounded-xl border border-white/10 bg-gradient-to-b from-violet-950/30 to-slate-900 p-5 hover:border-gold/40 transition-colors"
                >
                  <div className="font-semibold text-slate-100 group-hover:text-gold transition-colors flex items-center justify-between gap-2">
                    {c.title}
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Side paths */}
        {siblings.length > 0 && (
          <section className="mt-8 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Compass className="w-5 h-5 text-violet-300" />
              Side paths
            </h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.id}
                  href={`/discovery/${s.id}`}
                  className="min-h-[44px] inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:border-violet-400/50 hover:text-white transition-colors"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Practice + tutor */}
        <section className="mt-10 flex flex-col sm:flex-row gap-3 pb-16">
          {hasQuiz && (
            <Link
              href={`/discovery/${topicId}/quiz`}
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-gold text-slate-950 font-semibold text-sm hover:bg-gold-hover transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Test yourself
            </Link>
          )}
          <Link
            href={`/tutor?domain=extras&topicId=${encodeURIComponent(topicId)}`}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg border border-white/15 text-slate-200 font-semibold text-sm hover:border-gold/60 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-gold" />
            Ask the tutor
          </Link>
          {trail.length > 0 && (
            <Link
              href={`/discovery/${trail[trail.length - 1].id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Step back up
            </Link>
          )}
        </section>

        {/* Depth progress hint */}
        {maxDepth < 3 && (
          <p className="pb-10 text-center text-xs text-slate-600">
            You are at depth {maxDepth + 1} of 4 — the trail continues as new depths are charted.
          </p>
        )}
      </main>
    </div>
  );
}
