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
        className="w-full rounded-full border border-line bg-bg px-5 py-3 text-sm text-slate-100 placeholder:text-muted focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      {open && hits.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface/95 backdrop-blur gn-shadow">
          {hits.map((h, i) => (
            <Link key={i} href={h.href} className="gn-motion block px-4 py-2.5 text-sm text-slate-100 transition-colors hover:bg-surface-2/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span className="text-slate-100">{h.label}</span>
              <span className="ml-2 text-xs text-muted">{h.subject}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
