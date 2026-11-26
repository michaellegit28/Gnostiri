import Link from "next/link";
import { BookOpen, FileText, ChevronRight, Trophy } from "lucide-react";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { SUBJECTS, allTopicSlugs } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

// High School hub: two doors — Study (textbooks) and Exams (past papers).
export default async function HighSchoolHub() {
  const subjects = SUBJECTS.length;
  const topics = allTopicSlugs().length;
  return (
    <div className="min-h-screen bg-transparent text-slate-100 px-5 py-8 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="rounded hover:text-electric-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Home</Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-100 font-medium">High School</span>
        </nav>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(110%_100%_at_50%_0%,rgb(var(--surface))_0%,rgb(var(--bg))_55%,rgb(var(--bg-deep))_100%)] px-6 py-10 md:px-12 md:py-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 text-electric-text text-xs font-semibold border border-electric/30">
            <SectionMark variant="school" className="w-4 h-4" accent="rgb(var(--teal))" />
            <span>High School</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            Read the textbook, then sit the <span className="text-electric-text">past papers</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Study {subjects} subjects in the textbooks, then test yourself on real past papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gn-card gn-lift flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-3">
              <BookOpen className="w-8 h-8 text-cyan-300" />
              <h2 className="text-2xl font-serif font-bold">Study</h2>
              <p className="text-muted text-sm leading-relaxed">Study {subjects} subjects in the textbooks, {topics} topics — click any topic and study, with syllabus alignment for your country.</p>
            </div>
            <Link href="/highschool/study" className="mt-6 inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Open textbooks
            </Link>
          </div>
          <div className="gn-card gn-lift flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-3">
              <FileText className="w-8 h-8 text-electric-text" />
              <h2 className="text-2xl font-serif font-bold">Exams</h2>
              <p className="text-muted text-sm leading-relaxed">Past papers by board and year — timed attempts with marking schemes.</p>
            </div>
            <Link href="/highschool/exams" className="mt-6 inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Open exam banks
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <Trophy className="w-6 h-6 text-electric-text mx-auto mb-2" />
          <p className="text-sm text-slate-400">Ready to compete? The <Link href="/league" className="rounded text-electric-text hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Merit League</Link> runs speed, endurance, mastery and bracket cups.</p>
        </section>
      </div>
    </div>
  );
}
