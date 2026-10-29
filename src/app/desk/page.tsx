import Link from "next/link";
import { FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

// Desk — your uploads, processed notes and plans (ROADMAP.md Phase 3).
export default function DeskPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <FolderOpen className="w-12 h-12 text-gold mx-auto" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Desk</p>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Opening soon
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold">Turn any PDF into a study plan</h1>
        <p className="text-slate-400">
          Upload a textbook or lecture note — Gnostiri extracts the content, analyses the diagrams,
          builds your quizzes and schedules your reading. Everything stays on your desk.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/highschool" className="px-6 py-3 rounded-lg bg-gold text-slate-950 font-semibold text-sm">Study now</Link>
          <Link href="/tutor" className="px-6 py-3 rounded-lg border border-slate-600 text-sm">Ask the tutor</Link>
        </div>
      </div>
    </div>
  );
}
