"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDomain, DomainType } from "@/context/DomainContext";
import { useAuth } from "@/context/AuthContext";

type Message = { role: "user" | "assistant"; content: string };

function TutorPageContent() {
  const { currentDomain, setCurrentDomain } = useDomain();
  const searchParams = useSearchParams();
  const domain = (searchParams.get("domain") as DomainType | null) || currentDomain;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState<number | "unlimited">(5);
  const [busy, setBusy] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !domain) return;
    const topicId = searchParams.get("topicId");
    fetch(`/api/tutor?domain=${domain}${topicId ? `&topicId=${encodeURIComponent(topicId)}` : ""}`).then((response) => response.json()).then((data) => { if (Array.isArray(data.messages)) setMessages(data.messages); if (typeof data.remaining === "number" || data.remaining === "unlimited") setRemaining(data.remaining); }).catch(() => undefined);
  }, [user, domain, searchParams]);

  async function send(event: FormEvent, action = "ask", promptOverride?: string) {
    event.preventDefault();
    const prompt = promptOverride ?? input.trim();
    if (!domain) { setError("Choose a learning domain to start the Tutor session."); return; }
    if ((!prompt && action !== "study_plan") || busy) return;
    const nextMessages: Message[] = [...messages, ...(prompt ? [{ role: "user" as const, content: prompt }] : [])];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain, topicId: searchParams.get("topicId"), action, message: prompt, messages }) });
      if (!response.ok) { const data = await response.json(); setUpgrade(Boolean(data.upgrade)); throw new Error(data.error || "Tutor request failed"); }
      const remainingHeader = response.headers.get("X-Tutor-Remaining");
      if (remainingHeader === "unlimited") setRemaining("unlimited"); else if (remainingHeader) setRemaining(Number(remainingHeader));
      const reader = response.body?.getReader(); if (!reader) throw new Error("Tutor stream unavailable");
      const decoder = new TextDecoder(); let buffer = ""; let answer = "";
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n"); buffer = events.pop() || "";
        for (const eventText of events) {
          const line = eventText.split("\n").find((item) => item.startsWith("data: "));
          if (!line || line === "data: [DONE]") continue;
          try { answer += JSON.parse(line.slice(6)).token || ""; setMessages([...nextMessages, { role: "assistant", content: answer }]); } catch { /* ignore malformed event frame */ }
        }
      }
      setMessages([...nextMessages, { role: "assistant", content: answer }]);
    } catch (err) { setError(err instanceof Error ? err.message : "Tutor request failed"); setMessages(nextMessages); }
    finally { setBusy(false); }
  }

  const quickActions: [string, string, string?][] = [["Explain this", "ask", "Explain this topic clearly."], ["Why was I wrong?", "why_wrong", "Explain why my answer was wrong."], ["Give an example", "ask", "Give me a worked example."], ["Similar question", "similar_question", "Generate a similar practice question."], ["Create a study plan", "study_plan"]];
  return <main className="min-h-screen bg-transparent p-4 text-slate-100 md:p-10"><div className="mx-auto flex max-w-4xl flex-col gap-5"><header className="flex items-center justify-between border-b border-slate-800 pb-4"><div><p className="text-sm capitalize text-teal-400">{domain || "Choose domain"} tutor</p><h1 className="font-serif text-3xl font-bold">Ask Gnostiri Tutor</h1></div><Link href="/" className="text-sm text-slate-400 hover:text-white">Close</Link></header>{!domain && <label className="text-sm">Select a domain <select value="" onChange={(event) => setCurrentDomain(event.target.value as DomainType)} className="ml-2 min-h-11 rounded-lg bg-slate-900 px-3"><option value="" disabled>Choose domain</option><option value="highschool">High School</option><option value="university">University</option><option value="extras">Extras</option></select></label>}{!user && <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">Sign in to use Tutor and save your learning history.</p>}{domain && <p className="text-sm text-slate-400">{remaining === "unlimited" ? "Unlimited Tutor interactions" : `${remaining}/5 interactions remaining today`}</p>}<section aria-live="polite" className="min-h-[50vh] space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4 md:p-6">{messages.map((message, i) => <article key={i} className={`max-w-[90%] whitespace-pre-wrap rounded-xl p-4 ${message.role === "user" ? "ml-auto bg-teal-900/60" : "bg-slate-800"}`}><p className="mb-1 text-xs font-semibold uppercase text-slate-400">{message.role === "user" ? "You" : "Tutor"}</p>{message.content || (busy ? "Thinking…" : "")}</article>)}{!messages.length && <p className="text-slate-400">Ask for an explanation, an example, or help with a question.</p>}</section>{error && <p role="alert" className="text-red-300">{error}</p>}{upgrade && <aside className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">You have reached the free daily limit. <Link className="underline" href="/pricing">Explore Premium</Link></aside>}<div className="flex flex-wrap gap-2">{quickActions.map(([label, action, prompt]) => <button key={label} disabled={!user || !domain || busy} onClick={(event) => void send(event as unknown as FormEvent, action, prompt)} className="min-h-11 rounded-full border border-slate-700 px-4 text-sm hover:border-teal-500 disabled:opacity-50">{label}</button>)}</div><form onSubmit={(event) => void send(event)} className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} disabled={!user || !domain || busy} aria-label="Message Tutor" placeholder="Ask a curriculum question…" className="min-h-12 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4"/><button disabled={!user || !domain || busy || !input.trim()} className="min-h-12 rounded-lg bg-amber-500 px-5 font-semibold text-slate-950 disabled:opacity-50">Send</button></form><p className="text-xs text-slate-500">{remaining === "unlimited" ? "Unlimited Tutor interactions" : `${remaining}/5 remaining today`} · Tutor answers curriculum questions only.</p></div></main>;
}

export default function TutorPage() {
  return <Suspense fallback={<main className="min-h-screen bg-transparent p-6 text-slate-100">Loading Tutor…</main>}><TutorPageContent /></Suspense>;
}
