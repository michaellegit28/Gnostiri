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
  Microscope,
  Newspaper,
  Telescope,
} from "lucide-react";
import type { LessonBlock } from "@/types/lesson";
import FilterChips from "@/components/ui/FilterChips";

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

export interface BranchLink {
  id: string;
  title: string;
  slug: string | null;
}

interface DiscoveryLabReaderProps {
  topicId: string;
  title: string;
  trail: TrailLink[];
  lessons: DepthLesson[];
  branches: BranchLink[];
  siblings: TrailLink[];
}

const MODE_COLOR: Record<string, string> = {
  principles: "text-teal-300 border-teal-500/30 bg-teal-500/10",
  projects: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  hypotheses: "text-rose-300 border-rose-500/30 bg-rose-500/10",
  news: "text-sky-300 border-sky-500/30 bg-sky-500/10",
};

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
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            Key principle
          </div>
          <div className="font-bold text-slate-100 text-lg mb-2">{block.term}</div>
          <div className="text-slate-300 font-reading leading-relaxed">{block.text}</div>
        </div>
      );
    case "principle": {
      const color = MODE_COLOR.principles;
      return (
        <div className={`border border-white/10 ${color} rounded-xl p-5 my-6`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
            Principle
          </div>
          {block.term && <div className="font-bold text-slate-100 text-lg mb-2">{block.term}</div>}
          <div className="text-slate-300 font-reading leading-relaxed">{block.text}</div>
          {block.equation && (
            <div className="mt-3 text-slate-200 font-mono text-sm bg-slate-900/40 rounded p-3 border border-white/5">
              {block.equation}
            </div>
          )}
        </div>
      );
    }
    case "project": {
      const color = MODE_COLOR.projects;
      return (
        <div className={`border border-white/10 ${color} rounded-xl p-5 my-6`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            Project · {block.metadata?.estimatedMinutes ?? 30} min
          </div>
          <div className="font-bold text-slate-100 text-lg mb-2">{block.term ?? "Project"}</div>
          <div className="text-slate-300 font-reading leading-relaxed">{block.text}</div>
          {block.materials && (
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200 mb-1">Materials:</div>
              {block.materials.map((m: string, i: number) => (
                <div key={i} className="pl-2 text-slate-300">
                  • {m}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    case "hypothesis": {
      const color = MODE_COLOR.hypotheses;
      return (
        <div className={`border border-white/10 ${color} rounded-xl p-5 my-6`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
            Hypothesis · open question
          </div>
          <div className="font-bold text-slate-100 text-lg mb-2">{block.term ?? "Open question"}</div>
          <div className="text-slate-300 font-reading leading-relaxed">{block.text}</div>
          {block.status && (
            <div className="mt-3 text-xs text-rose-400">
              Status: <span className="font-semibold">{block.status}</span>
            </div>
          )}
        </div>
      );
    }
    case "news-item": {
      const color = MODE_COLOR.news;
      return (
        <div className={`border border-white/10 ${color} rounded-xl p-5 my-6`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-300" />
            Lab news · {block.metadata?.date ?? "recent"}
          </div>
          <div className="font-bold text-slate-100 text-lg mb-2">{block.term ?? "Development"}</div>
          <div className="text-slate-300 font-reading leading-relaxed">{block.text}</div>
          {block.source && (
            <div className="mt-3 text-xs text-slate-400">
              Source: <span className="font-semibold text-slate-200">{block.source}</span>
            </div>
          )}
        </div>
      );
    }
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
                    <td key={j} className="p-3 text-sm text-slate-300">{cell}</td>
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

export default function DiscoveryLabReader({
  topicId,
  title,
  trail,
  lessons,
  branches,
  siblings,
}: DiscoveryLabReaderProps) {
  const [depth, setDepth] = useState(0);
  const active = lessons.find((l) => l.depth === depth) ?? null;
  const maxDepth = lessons.length ? Math.max(...lessons.map((l) => l.depth)) : 0;

  return (
    <div className="min-h-screen bg-transparent text-slate-50">
      {/* Lab header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#1b1440_0%,#0d0a24_50%,#060814_100%)]">
        <div className="relative max-w-4xl mx-auto px-6 py-10 md:py-14">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-slate-400">
            <Link href="/discovery" className="hover:text-gold transition-colors">
              Discovery Lab
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
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold border border-gold/30">
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
          idPrefix="lab-depth"
          panelId="lab-depth-panel"
        />

        {/* Body */}
        <div id="lab-depth-panel" role="tabpanel" aria-labelledby={`lab-depth-${depth}`} tabIndex={0} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl">
          {active ? (
            <article className="mt-2">
              {active.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </article>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <Microscope className="w-10 h-10 text-slate-600 mx-auto mb-3" />
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

        {/* Branches — go deeper into the lab */}
        {branches.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowDown className="w-5 h-5 text-gold" />
              Branches of {title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <Link
                  key={b.id}
                  href={`/discovery/${b.slug ?? b.id}`}
                  className="group rounded-xl border border-white/10 bg-gradient-to-b from-gold/10 to-slate-900 p-5 hover:border-gold/40 transition-colors"
                >
                  <div className="font-semibold text-slate-100 group-hover:text-gold transition-colors flex items-center justify-between gap-2">
                    {b.title}
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
                  className="min-h-[44px] inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:border-gold/50 hover:text-white transition-colors"
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
            href={`/discovery/${topicId}/quiz`}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-lg bg-gold text-slate-950 font-semibold text-sm hover:bg-gold-hover transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Test yourself
          </Link>
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
