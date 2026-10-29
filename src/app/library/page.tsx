import Link from "next/link";
import { Library } from "lucide-react";

export const dynamic = "force-dynamic";

// Public Library — shared study artifacts (ROADMAP.md Phase 4).
export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Library className="w-12 h-12 text-gold mx-auto" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Public Library</p>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Opening soon
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold">Study what your cohort studied</h1>
        <p className="text-slate-400">
          Shared notes, quizzes and plans — each one machine-verified. Contribute yours, earn badges
          and Prime-day credits when your classmates use it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/league" className="px-6 py-3 rounded-lg bg-gold text-slate-950 font-semibold text-sm">Merit League</Link>
          <Link href="/highschool" className="px-6 py-3 rounded-lg border border-slate-600 text-sm">High school</Link>
        </div>
      </div>
    </div>
  );
}
