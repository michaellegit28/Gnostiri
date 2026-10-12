"use client";

// AnswerBooklet — WAEC hybrid-CBT Phase 3 variant. Board config decides which renders;
// only the configured one mounts (never CSS-hidden). simulation is the submitted
// surface; planning ("Paper Mode") is a scratchpad whose value is NEVER posted —
// the runner only reads it into sectionAnswers like any typed answer, and the copy
// states it plainly. Default per delivery: HYBRID → planning, CBT → simulation.

export type BookletMode = "simulation" | "planning";

type AnswerBookletProps = {
  mode: BookletMode;
  value: string;
  onChange: (value: string) => void;
  onModeChange?: (mode: BookletMode) => void;
  showToggle?: boolean;
  disabled?: boolean;
};

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
}

export default function AnswerBooklet({
  mode,
  value,
  onChange,
  onModeChange,
  showToggle = true,
  disabled = false,
}: AnswerBookletProps) {
  return (
    <div className="space-y-3">
      {showToggle && onModeChange != null && (
        <div role="group" aria-label="Answer mode" className="inline-flex rounded-xl border border-slate-700 p-1">
          {(["simulation", "planning"] as BookletMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              aria-pressed={mode === m}
              className={`min-h-[44px] rounded-lg px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                mode === m ? "bg-[#D4AF37] text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              {m === "simulation" ? "Simulation mode" : "Planning mode"}
            </button>
          ))}
        </div>
      )}
      {mode === "planning" && (
        <p className="rounded-xl border border-dashed border-slate-600 bg-slate-900/60 p-4 text-sm text-slate-300">
          Paper mode: this section requires you to write in your answer booklet. Use the
          space below to plan your answer — plans are never submitted.
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={mode === "simulation" ? 14 : 8}
        spellCheck={true}
        aria-label={
          mode === "simulation"
            ? "Answer booklet. Your writing here is submitted."
            : "Planning scratchpad. Plans are never submitted."
        }
        placeholder={mode === "simulation" ? "Write your answer…" : "Plan — intro · points · conclusion…"}
        className={
          mode === "simulation"
            ? "min-h-[340px] w-full resize-y rounded-xl border border-slate-300 bg-white p-5 font-serif text-[15px] leading-8 text-slate-950 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            : "min-h-[180px] w-full resize-y rounded-xl border border-dashed border-slate-600 bg-slate-900 p-4 text-[15px] leading-relaxed text-slate-100 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        }
        style={
          mode === "simulation"
            ? { backgroundImage: "repeating-linear-gradient(#ffffff 0 31px, #dbe3ec 31px 32px)" }
            : undefined
        }
      />
      <p aria-hidden="true" className="text-xs tabular-nums text-slate-500">
        {countWords(value)} words · {value.length} chars
        {mode === "planning" ? " · not submitted" : ""}
      </p>
    </div>
  );
}
