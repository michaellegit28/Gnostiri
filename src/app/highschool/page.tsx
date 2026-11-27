import Link from "next/link";
import { BookOpen, FileText, ChevronRight } from "lucide-react";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { SUBJECTS, allTopicSlugs } from "@/lib/curriculum";
import { GPE, GPE_NAME } from "@/lib/exam-brand";

export const dynamic = "force-dynamic";

// High School hub: two doors — Study (textbooks) and GPE (the Gnostiri
// Proficiency Exam past papers). The explanation of each lives in the feature
// tour; the cards themselves stay description-free.
export default async function HighSchoolHub() {
  const subjects = SUBJECTS.length;
  const topics = allTopicSlugs().length;
  return (
    <div className="min-h-screen bg-transparent text-slate-100 px-5 py-8 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="rounded hover:text-electric-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Home</Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-100 font-medium">High School</span>
        </nav>

        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-semibold text-electric-text">
            <SectionMark variant="school" className="w-4 h-4" accent="rgb(var(--teal))" />
            <span>High School</span>
          </div>
          <h1 className="gn-title-gradient font-serif text-4xl font-bold tracking-tight md:text-5xl">
            High School
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="gn-card gn-lift flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-4">
              <BookOpen className="w-8 h-8 text-cyan-300" aria-hidden />
              <div>
                <h2 className="text-2xl font-serif font-bold">Study</h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {subjects} subjects · {topics} topics
                </p>
              </div>
            </div>
            <Link href="/highschool/study" className="gn-motion mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-sm text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Open textbooks
            </Link>
          </div>
          <div className="gn-card gn-lift flex flex-col justify-between p-6 md:p-8">
            <div className="space-y-4">
              <FileText className="w-8 h-8 text-electric-text" aria-hidden />
              <div>
                <h2 className="text-2xl font-serif font-bold">{GPE_NAME}</h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {GPE} · past papers by board
                </p>
              </div>
            </div>
            <Link href="/highschool/exams" className="gn-motion mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-sm text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Open {GPE}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}