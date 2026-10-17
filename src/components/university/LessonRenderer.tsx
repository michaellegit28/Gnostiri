import type { LessonBlock, LessonContent } from "@/types/lesson";
import { AlertTriangle, BookOpen, CheckCircle2, FileCode2, Info, Lightbulb, Table2 } from "lucide-react";

/**
 * University lesson block renderer.
 *
 * Renders every LessonBlock type so rich lesson content (code with output,
 * examples, callouts, tables, inline questions, MCQs) is actually readable —
 * not just heading/paragraph/definition. This is the study-facing renderer
 * for university courses.
 */

const MCQ_OPTIONS = ["A", "B", "C", "D"];

function CodeBlock({ language, code, output, caption }: { language: string; code: string; output?: string; caption?: string }) {
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
      <figcaption className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/70 px-4 py-2 text-xs text-slate-400">
        <FileCode2 className="h-3.5 w-3.5 shrink-0" />
        <span className="font-mono uppercase tracking-wide">{language}</span>
        {caption && <span className="ml-2 truncate text-slate-500">{caption}</span>}
      </figcaption>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
      {output && (
        <div className="border-t border-slate-800 bg-slate-900/40 px-4 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-400">
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

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-800/80">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border-b border-slate-700 px-4 py-2.5 font-semibold text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <Table2 className="h-3.5 w-3.5 text-slate-400" /> {h}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-slate-300">
                  {ci === 0 ? <span className="font-medium text-slate-200">{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderBlock(block: LessonBlock, index: number, key: number) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h4 key={key} className="mt-6 mb-2 font-serif text-xl font-bold text-slate-100">
          {block.text}
        </h4>
      ) : (
        <h5 key={key} className="mt-5 mb-2 font-serif text-lg font-semibold text-slate-200">
          {block.text}
        </h5>
      );

    case "paragraph":
      return (
        <p key={key} className="my-3 leading-relaxed text-slate-300">
          {block.text}
        </p>
      );

    case "definition":
      return (
        <div key={key} className="my-4 rounded-xl border border-teal-700/50 bg-teal-950/20 p-4">
          <div className="flex items-start gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
            <div>
              <div className="font-semibold text-teal-300">{block.term}</div>
              <div className="mt-1 text-slate-300">{block.text}</div>
            </div>
          </div>
        </div>
      );

    case "example":
      return (
        <div key={key} className="my-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-amber-400">
            <Lightbulb className="h-3.5 w-3.5" /> Example
          </div>
          <p className="text-slate-300">{block.text}</p>
        </div>
      );

    case "callout":
      return block.variant === "info" ? (
        <div key={key} className="my-4 flex items-start gap-3 rounded-xl border border-sky-700/40 bg-sky-950/20 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <p className="text-slate-300">
            <span className="mb-0.5 block text-[11px] font-medium uppercase tracking-wide text-sky-400">Note</span>
            {block.text}
          </p>
        </div>
      ) : (
        <div key={key} className="my-4 flex items-start gap-3 rounded-xl border border-amber-600/40 bg-amber-950/20 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-slate-300">
            <span className="mb-0.5 block text-[11px] font-medium uppercase tracking-wide text-amber-400">Watch out</span>
            {block.text}
          </p>
        </div>
      );

    case "table":
      return <TableBlock key={key} headers={block.headers} rows={block.rows} />;

    case "code":
      return <CodeBlock key={key} language={block.language} code={block.code} output={block.output} caption={block.caption} />;

    case "question":
      return (
        <div key={key} className="my-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-violet-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Check
          </div>
          <p className="font-medium text-slate-200">{block.prompt}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-violet-300 hover:text-violet-200">Show answer</summary>
            <p className="mt-2 text-slate-300">{block.answer}</p>
            {block.explanation && <p className="mt-1 text-sm text-slate-400">{block.explanation}</p>}
          </details>
        </div>
      );

    case "mcq": {
      const options = block.options.slice(0, 4);
      return (
        <div key={key} className="my-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Question {index + 1}
          </div>
          <p className="font-medium text-slate-200">{block.stem}</p>
          <div className="mt-3 space-y-2">
            {options.map((opt, oi) => {
              const correct = oi === block.correctIndex;
              return (
                <div
                  key={oi}
                  className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                    correct ? "border-emerald-700/50 bg-emerald-950/20" : "border-slate-800 bg-slate-950/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      correct ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {MCQ_OPTIONS[oi]}
                  </span>
                  <span className={correct ? "text-emerald-200" : "text-slate-300"}>{opt}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-slate-400">
            <span className="font-medium text-emerald-400">Answer: </span>
            {MCQ_OPTIONS[block.correctIndex]} · {block.explanation}
          </p>
        </div>
      );
    }

    case "diagram":
      return (
        <div key={key} className="my-4 rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">
          Diagram unavailable — {block.diagramId}. {block.caption}
        </div>
      );

    default:
      return null;
  }
}

export default function LessonRenderer({ content }: { content: LessonContent }) {
  if (!content?.blocks?.length) return null;
  return (
    <div className="space-y-1">
      {content.blocks.map((block, i) => renderBlock(block, i, i))}
    </div>
  );
}
