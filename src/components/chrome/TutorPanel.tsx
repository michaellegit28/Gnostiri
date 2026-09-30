"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDomain } from "@/context/DomainContext";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "How do I learn something new efficiently?",
  "Explain it like I'm 15.",
  "What should I learn next?",
];

interface TutorPanelProps {
  onClose: () => void;
}

/**
 * TutorPanel — the tutor as a floating companion, not a destination.
 * Same brain as the full page (/api/tutor streaming), dressed like
 * a guide: greeting, starters, streaming answers, gold send.
 */
export default function TutorPanel({ onClose }: TutorPanelProps) {
  const { currentDomain } = useDomain();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  async function send(e: FormEvent, promptOverride?: string) {
    e.preventDefault();
    const prompt = (promptOverride ?? input).trim();
    if (!prompt || busy) return;
    const next: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: currentDomain || "highschool",
          action: "ask",
          message: prompt,
          messages: next,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setUpgrade(Boolean(data.upgrade));
        throw new Error(data.error || "Tutor request failed");
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Tutor stream unavailable");
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const ev of events) {
          const line = ev.split("\n").find((l) => l.startsWith("data: "));
          if (!line || line === "data: [DONE]") continue;
          try {
            answer += JSON.parse(line.slice(6)).token || "";
            setMessages([...next, { role: "assistant", content: answer }]);
          } catch {
            /* ignore malformed frame */
          }
        }
      }
      setMessages([...next, { role: "assistant", content: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tutor request failed");
      setMessages(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-label="AI Tutor"
      className="fixed z-[80] inset-x-3 bottom-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[400px] flex flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#0B0F22]/98 shadow-2xl shadow-black/60 backdrop-blur-xl animate-[panel-up_0.3s_ease-out]"
      style={{ maxHeight: "min(78vh, 620px)", height: "560px", maxWidth: "100%" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            Tutor
          </p>
          <p className="mt-1 font-serif text-xl italic text-slate-100">
            A guide, not an oracle.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tutor"
          className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
        {messages.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-slate-200 border-l-2 !border-l-[#D4AF37]">
            I&apos;m your Tutor. Right now we&apos;re here to help you learn anything.
            Ask me anything, or pick a starter below.
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="ml-auto max-w-[90%] rounded-xl bg-teal-900/50 px-4 py-3 text-sm text-slate-100">
              {m.content}
            </div>
          ) : (
            <div key={i} className="max-w-[95%] rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-sm leading-relaxed text-slate-200 border-l-2 !border-l-[#D4AF37]">
              {m.content || (busy ? "Thinking…" : "")}
            </div>
          )
        )}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => void send(e as unknown as FormEvent, s)}
                className="rounded-full border border-white/15 px-3.5 py-2 text-xs text-slate-300 hover:border-[#D4AF37]/60 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {error && (
          <p role="alert" className="text-xs text-rose-300">
            {error}
          </p>
        )}
        {upgrade && (
          <p className="text-xs text-amber-200">
            Daily limit reached.{" "}
            <Link href="/pricing" className="underline hover:text-amber-100">
              Go unlimited
            </Link>
          </p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => void send(e)} className="border-t border-white/10 p-3 flex items-center gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about anything…"
          aria-label="Ask the tutor"
          className="min-h-[48px] flex-1 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#D4AF37]/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="min-h-[48px] shrink-0 rounded-full bg-[#D4AF37] px-5 text-sm font-semibold text-slate-950 hover:bg-[#c3a030] transition-colors disabled:opacity-40"
        >
          Send
        </button>
      </form>
      <style>{`@keyframes panel-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
