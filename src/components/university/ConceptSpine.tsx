"use client";

import { useState } from "react";
import { Brain, ChevronDown, CheckCircle2, Circle, Lock } from "lucide-react";

interface ConceptLite {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  bloomsLevel?: string;
  estMinutes?: number;
  moduleId?: string | null;
  orderIndex: number;
}

interface ModuleLite {
  id: string;
  title: string;
  slug: string;
  concepts: ConceptLite[];
}

interface ConceptSpineProps {
  concepts: ConceptLite[];
  modules: ModuleLite[];
  lite?: boolean;
}

const BLOOMS_LABEL: Record<string, string> = {
  remember: "Remember",
  understand: "Understand",
  apply: "Apply",
  analyze: "Analyze",
  evaluate: "Evaluate",
  create: "Create",
};

const BLOOMS_COLOR: Record<string, string> = {
  remember: "text-slate-400 border-slate-600",
  understand: "text-teal-300 border-teal-600/60",
  apply: "text-sky-300 border-sky-600/60",
  analyze: "text-violet-300 border-violet-600/60",
  evaluate: "text-amber-300 border-amber-600/60",
  create: "text-rose-300 border-rose-600/60",
};

/**
 * ConceptSpine — renders a course's concept DAG as a vertical spine.
 * Concepts are grouped into modules; the connector line visualises the
 * prerequisite chain (knowledge connects, it isn't a list).
 */
export default function ConceptSpine({ concepts, modules, lite = false }: ConceptSpineProps) {
  const [expanded, setExpanded] = useState<string | null>(modules[0]?.id ?? null);

  if (lite) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="font-serif text-lg font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#D4AF37]" /> Concept spine
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          {concepts.length} connected concepts across {Math.max(1, modules.length)} module{modules.length === 1 ? "" : "s"}.
        </p>
      </section>
    );
  }

  // If modules exist, group by module; otherwise show a single unbroken spine.
  const hasModules = modules.length > 0;
  const grouped: { id: string; title: string; items: ConceptLite[] }[] = hasModules
    ? modules.map((m) => ({ id: m.id, title: m.title, items: m.concepts }))
    : [{ id: "spine", title: "Concept spine", items: concepts }];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#D4AF37]" /> The concept spine
        </h2>
        <span className="text-xs text-slate-500">{concepts.length} concepts</span>
      </div>

      <div className="space-y-3">
        {grouped.map((group) => {
          const open = !hasModules || expanded === group.id;
          return (
            <div
              key={group.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              {hasModules && (
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : group.id)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-sm md:text-base">{group.title}</span>
                  <span className="flex items-center gap-3 text-xs text-slate-500">
                    {group.items.length} concept{group.items.length === 1 ? "" : "s"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
              )}
              {open && (
                <ol className="relative px-5 pb-5 pt-2 space-y-1">
                  {/* the spine line */}
                  <span
                    className="absolute left-[34px] top-2 bottom-6 w-px bg-gradient-to-b from-[#D4AF37]/50 via-teal-500/30 to-transparent"
                    aria-hidden
                  />
                  {group.items.map((concept, i) => {
                    const bloom = concept.bloomsLevel || "understand";
                    const isLast = i === group.items.length - 1;
                    return (
                      <li key={concept.id} className="relative flex items-start gap-3 py-2">
                        <span className="relative z-10 mt-0.5 shrink-0">
                          {i === 0 ? (
                            <Circle className="w-5 h-5 text-teal-400 fill-teal-400/20" />
                          ) : isLast ? (
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                          ) : (
                            <Lock className="w-5 h-5 text-slate-600" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-100 leading-snug">
                            {concept.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${BLOOMS_COLOR[bloom] || BLOOMS_COLOR.understand}`}
                            >
                              {BLOOMS_LABEL[bloom] || bloom}
                            </span>
                            {concept.estMinutes != null && (
                              <span className="text-[10px] text-slate-500">~{concept.estMinutes} min</span>
                            )}
                          </div>
                          {concept.summary && (
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                              {concept.summary}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
