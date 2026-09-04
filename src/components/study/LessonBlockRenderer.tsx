"use client";

import React from "react";
import { LessonBlock } from "@/types/lesson";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

interface LessonBlockRendererProps {
  block: LessonBlock;
}

export const LessonBlockRenderer: React.FC<LessonBlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case "heading":
      if (block.level === 2) {
        return (
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mt-8 mb-4 border-b border-slate-800 pb-2">
            {block.text}
          </h2>
        );
      }
      return (
        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-amber-400 mt-6 mb-3">
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p className="text-slate-300 text-base leading-relaxed my-4 font-sans">
          {block.text}
        </p>
      );

    case "definition":
      return (
        <div className="my-6 p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-sm">
          <div className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase mb-1">
            Definition — {block.term}
          </div>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {block.text}
          </p>
        </div>
      );

    case "example":
      return (
        <div className="my-6 p-5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-[#14B8A6] font-bold text-xs uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>Example</span>
          </div>
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-mono text-teal-100 bg-slate-900/50 p-3 rounded-lg border border-teal-500/20">
            {block.text}
          </div>
        </div>
      );

    case "callout":
      if (block.variant === "warning") {
        return (
          <div className="my-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">{block.text}</p>
          </div>
        );
      }
      return (
        <div className="my-6 p-4 rounded-xl bg-sky-950/30 border border-sky-500/30 text-sky-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{block.text}</p>
        </div>
      );

    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-slate-700/80">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-slate-200 text-xs uppercase tracking-wider border-b border-slate-700">
              <tr>
                {block.headers.map((header, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
};
