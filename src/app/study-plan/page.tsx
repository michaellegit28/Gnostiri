"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDomain } from "@/context/DomainContext";
import Link from "next/link";

type PlanItem = { subject: string; topic: string; duration: number; priority: string };

export default function StudyPlanPage() {
  const { user } = useAuth();
  const { currentDomain } = useDomain();
  const [domain, setDomain] = useState(currentDomain || "");
  const [items, setItems] = useState<PlanItem[]>([{ subject: "", topic: "", duration: 30, priority: "medium" }]);
  const [examDate, setExamDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !domain) return;
    fetch(`/api/study-plans?domain=${domain}`).then((response) => response.json()).then((data) => {
      const active = data.plans?.find((plan: { isActive: boolean }) => plan.isActive);
      if (active) { setItems(active.items); setExamDate(active.examDate ? active.examDate.slice(0, 10) : ""); }
    }).catch(() => setError("Could not load your saved plan."));
  }, [user, domain]);

  async function save(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!domain) { setError("Choose a learning domain first."); return; }
    const response = await fetch("/api/study-plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain, items, examDate: examDate || null, generatedBy: "manual" }) });
    if (!response.ok) { setError("Could not save your plan. Please sign in and try again."); return; }
    setSaved(true);
  }

  return <main className="min-h-screen bg-transparent p-6 text-slate-100 md:p-12"><div className="mx-auto max-w-3xl space-y-6"><Link href="/progress" className="text-sm text-slate-400">← Progress</Link><header><h1 className="font-serif text-4xl font-bold text-amber-400">Study plan</h1><p className="mt-2 text-slate-400">Organize your learning with a manual study plan — or let the app build it for you: <Link href="/battle-plan" className="text-[#D4AF37] underline hover:text-amber-300">Generate an automatic WAEC battle plan →</Link></p><label className="mt-4 block text-sm">Domain<select value={domain} onChange={(event) => { setDomain(event.target.value); setSaved(false); }} className="mt-2 block min-h-11 rounded-lg border border-slate-700 bg-slate-900 px-3"><option value="" disabled>Choose a domain</option><option value="highschool">High School</option><option value="university">University</option><option value="extras">Extras</option></select></label></header><form onSubmit={(event) => void save(event)} className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"><label className="block text-sm">Exam date<input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} className="mt-2 block min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-3"/></label>{items.map((item, index) => <div key={index} className="grid gap-3 rounded-lg border border-slate-800 p-4 sm:grid-cols-2"><input aria-label="Subject" value={item.subject} onChange={(event) => setItems(items.map((entry, position) => position === index ? { ...entry, subject: event.target.value } : entry))} placeholder="Subject" className="min-h-11 rounded bg-slate-950 px-3"/><input aria-label="Topic" value={item.topic} onChange={(event) => setItems(items.map((entry, position) => position === index ? { ...entry, topic: event.target.value } : entry))} placeholder="Topic" className="min-h-11 rounded bg-slate-950 px-3"/><input aria-label="Duration in minutes" type="number" min="5" max="240" value={item.duration} onChange={(event) => setItems(items.map((entry, position) => position === index ? { ...entry, duration: Number(event.target.value) } : entry))} className="min-h-11 rounded bg-slate-950 px-3"/><select aria-label="Priority" value={item.priority} onChange={(event) => setItems(items.map((entry, position) => position === index ? { ...entry, priority: event.target.value } : entry))} className="min-h-11 rounded bg-slate-950 px-3"><option>high</option><option>medium</option><option>low</option></select></div>)}<button type="button" onClick={() => setItems([...items, { subject: "", topic: "", duration: 30, priority: "medium" }])} className="rounded border border-slate-700 px-4 py-2">Add study item</button>{error && <p role="alert" className="text-red-300">{error}</p>}{saved && <p className="text-emerald-300">Plan saved.</p>}<button disabled={!domain} className="min-h-12 rounded-lg bg-amber-500 px-5 font-semibold text-slate-950 disabled:opacity-50">Save plan</button></form></div></main>;
}
