"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Compass,
  HelpCircle,
  MessageSquare,
  Telescope,
} from "lucide-react";
import type { LessonBlock } from "@/types/lesson";

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
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mt-8 mb-4">
          {block.text}
        </h2>
      ) : (
        <h3 className="font-serif text-xl font-semibold text-[#D4AF37] mt-6 mb-3">
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-slate-300 text-base md:text-lg leading-[1.7] my-4 font-light">
          {block.text}
        </p>
      );
    case "definition":
      return (
        <div className="border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xl p-5 my-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
            Key idea
          </div>
          <div className="font-bold text-slate-100 text-lg mb-2">{block.term}</div>
          <div className="text-slate-300 leading-relaxed">{block.text}</div>
        </div>
      );
    case "example":
      return (
        <div className="border-l-4 border-violet-400 bg-violet-950/20 rounded-r-xl p-5 my-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-violet-300 mb-2">
            See it in action
          </div>
          <div className="text-slate-200 leading-relaxed">{block.text}</div>
        </div>
      );
    case "callout":
      return block.variant === "info" ? (
        <div className="border border-sky-500/30 bg-sky-950/20 text-sky-200 rounded-xl p-5 my-6 leading-relaxed">
          {block.text}
        </div>
      ) : (
        <div className="border border-rose-500/30 bg-rose-950/20 text-rose-200 rounded-xl p-5 my-6 leading-relaxed">
          {block.text}
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
    default:
      return null;
  }
}

export default function DiscoveryReader({
  topicId,
  title,
  trail,
  lessons,
  subtopics,
  siblings,
}: DiscoveryReaderProps) {
  const [depth, setDepth] = useState(0);
  const active = lessons.find((l) => l.depth === depth) ?? null;
  const maxDepth = lessons.length
    ? Math.max(...lessons.map((l) => l.depth))
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Cosmic header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#1b1440_0%,#0d0a24_50%,#060814_100%)]">
        <div className="relative max-w-4xl mx-auto px-6 py-10 md:py-14">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-slate-400">
            <Link href="/extras" className="hover:text-[#D4AF37] transition-colors">
              Discovery
            </Link>
            {trail.map((t) => (
              <span key={t.id} className="flex items-center gap-1.5">
                <span className="text-slate-600">/</span>
                <Link href={`/extras/${t.id}`} className="hover:text-[#D4AF37] transition-colors">
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
        {/* Depth tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Depth">
          {DEPTHS.map((d, i) => {
            const available = lessons.some((l) => l.depth === i);
            const isActive = depth === i;
            return (
              <button
                key={d}
                role="tab"
                aria-selected={isActive}
                disabled={!available}
                onClick={() => setDepth(i)}
                className={`shrink-0 min-h-[44px] px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  isActive
                    ? "bg-[#D4AF37] text-slate-950 border-transparent"
                    : available
                      ? "bg-white/5 border-white/10 text-slate-200 hover:border-[#D4AF37]/50"
                      : "bg-transparent border-white/5 text-slate-600 cursor-not-allowed"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

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
              className="mt-5 inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 rounded-lg bg-[#D4AF37] text-slate-950 font-semibold text-sm hover:bg-[#c3a030] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Take me deeper
            </Link>
          </div>
        )}

        {/* Go deeper */}
        {subtopics.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowDown className="w-5 h-5 text-[#D4AF37]" />
              Go deeper
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {subtopics.map((c) => (
                <Link
                  key={c.id}
                  href={`/extras/${c.id}`}
                  className="group rounded-xl border border-white/10 bg-gradient-to-b from-violet-950/30 to-slate-900 p-5 hover:border-[#D4AF37]/40 transition-colors"
                >
                  <div className="font-semibold text-slate-100 group-hover:text-[#D4AF37] transition-colors flex items-center justify-between gap-2">
                    {c.title}
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
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
                  href={`/extras/${s.id}`}
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
          <Link
            href={`/extras/${topicId}/quiz`}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-[#D4AF37] text-slate-950 font-semibold text-sm hover:bg-[#c3a030] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Test yourself
          </Link>
          <Link
            href={`/tutor?domain=extras&topicId=${encodeURIComponent(topicId)}`}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg border border-white/15 text-slate-200 font-semibold text-sm hover:border-[#D4AF37]/60 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            Ask the tutor
          </Link>
          {trail.length > 0 && (
            <Link
              href={`/extras/${trail[trail.length - 1].id}`}
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
