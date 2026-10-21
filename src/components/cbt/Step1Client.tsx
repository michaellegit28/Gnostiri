"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Search } from "lucide-react";
import { CBT } from "@/lib/cbt/ui";
import type { CbtBoardCard } from "@/lib/cbt/data";

const HISTORY_KEY = "gnostiri-cbt-history";

export interface AttemptRecord {
  boardCode: string;
  percent: number;
  score: number;
  max: number;
  at: number;
}

export function readAttemptHistory(): AttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as AttemptRecord[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function badgeFor(boardCode: string, history: AttemptRecord[]): string | null {
  const mine = history.filter((h) => h.boardCode === boardCode);
  if (!mine.length) return null;
  const best = Math.max(...mine.map((h) => h.percent));
  return mine.length === 1 ? `1 attempt · best ${best}%` : `${mine.length} attempts · best ${best}%`;
}

/** Flat logo placeholder — initials tile, never a board's official mark. */
function LogoTile({ name }: { name: string }) {
  const initials = name.split(/[\s(]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 font-serif text-lg font-bold text-gold">
      {initials}
    </span>
  );
}

export default function Step1Client({ boards }: { boards: CbtBoardCard[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [history] = useState(() => readAttemptHistory());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return boards;
    return boards.filter((b) => `${b.name} ${b.country ?? ""}`.toLowerCase().includes(q));
  }, [boards, query]);

  const live = filtered.filter((b) => b.status === "live");
  const preparing = filtered.filter((b) => b.status !== "live");
  const selectedBoard = boards.find((b) => b.code === selected && b.status === "live");

  return (
    <div className="mt-8">
      {/* Global search / filter */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exam boards or countries…"
          aria-label="Search exam boards"
          className="min-h-[48px] w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
      </div>

      {/* Board cards */}
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {[...live, ...preparing].map((board) => {
          const isSelected = selected === board.code;
          const disabled = board.status !== "live";
          const badge = badgeFor(board.code, history);
          return (
            <li key={board.code}>
              <div
                className={`${CBT.card} ${isSelected && !disabled ? CBT.cardActive : ""} ${disabled ? "opacity-50" : CBT.cardHover} p-4`}
              >
                <div className="flex items-start gap-3">
                  <LogoTile name={board.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-serif text-lg font-bold text-slate-50">{board.name}</h2>
                      {disabled && <span className={`${CBT.chip} shrink-0`}>In preparation</span>}
                    </div>
                    <p className={`mt-0.5 text-xs ${CBT.muted}`}>
                      {board.country ?? "Global"}
                      {board.questionCount > 0 && ` · ${board.questionCount.toLocaleString()} questions`}
                    </p>
                    {badge && <p className="mt-1 text-[11px] font-medium text-gold">{badge}</p>}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelected(isSelected ? null : board.code)}
                  aria-pressed={isSelected}
                  className={`${CBT.ghostBtn} mt-3 min-h-[40px] w-full text-sm ${isSelected && !disabled ? "border-gold/60 bg-gold/15 text-gold" : ""}`}
                >
                  {isSelected ? (<><Check className="h-4 w-4" aria-hidden /> Selected</>) : "Select"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className={`mt-8 text-center text-sm ${CBT.muted}`}>No boards match “{query}”.</p>
      )}

      {/* Prominent sticky Proceed */}
      <div className={CBT.stickyBar}>
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            disabled={!selectedBoard}
            onClick={() => selectedBoard && router.push(`/cbt/setup?board=${selectedBoard.code}`)}
            className={CBT.primaryBtn}
          >
            {selectedBoard ? `Proceed — ${selectedBoard.name}` : "Select a board to proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}
