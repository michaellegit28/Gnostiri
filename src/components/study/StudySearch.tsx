"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SUBJECTS } from "@/lib/curriculum";

interface Hit { label: string; subject: string; sub?: string; href: string; }

// Global study search: matches subjects, topics, and subtopics; deep-links into topic pages.
export default function StudySearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const hits = useMemo<Hit[]>(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    const out: Hit[] = [];
    for (const subject of SUBJECTS) {
      if (subject.name.toLowerCase().includes(needle)) {
        out.push({ label: subject.name, subject: subject.name, href: `/highschool/study/${subject.slug}` });
      }
      for (const topic of subject.topics) {
        if (topic.title.toLowerCase().includes(needle)) {
          out.push({ label: topic.title, subject: subject.name, href: `/highschool/study/${subject.slug}/${topic.slug}` });
        }
        for (const sub of topic.subtopics) {
          if (sub.toLowerCase().includes(needle)) {
            out.push({ label: sub, subject: `${subject.name} → ${topic.title}`, href: `/highschool/study/${subject.slug}/${topic.slug}` });
          }
        }
      }
    }
    return out.slice(0, 8);
  }, [q]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search subjects, topics, subtopics — try “mitosis”…"
        aria-label="Search study topics"
        className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#D4AF37] focus:outline-none"
      />
      {open && hits.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950/95 backdrop-blur">
          {hits.map((h, i) => (
            <Link key={i} href={h.href} className="block px-4 py-2.5 text-sm hover:bg-slate-800/70">
              <span className="text-slate-100">{h.label}</span>
              <span className="ml-2 text-xs text-slate-500">{h.subject}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
