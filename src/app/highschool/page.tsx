import Link from "next/link";
import { BookOpen, FileText, ChevronRight, Trophy } from "lucide-react";
import { SectionMark } from "@/components/logo/GnostiriLogo";

export const dynamic = "force-dynamic";

// High School hub: two doors — Study (textbooks) and Exams (past papers).
export default function HighSchoolHub() {
  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">High School</span>
        </nav>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(110%_100%_at_50%_0%,#14213d_0%,#0a0f22_55%,#060814_100%)] px-6 py-12 md:px-12 md:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <SectionMark variant="school" className="w-4 h-4" accent="#14B8A6" />
            <span>High School</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            Textbooks and exams, <span className="text-[#D4AF37]">one roof</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Master 11 subjects in the study textbooks, then prove it on real past papers — WAEC, JAMB, Bagrut and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-8 hover:border-teal-500/40 transition-all">
            <div>
              <BookOpen className="w-8 h-8 text-teal-300 mb-4" />
              <h2 className="text-2xl font-serif font-bold mb-2">Study</h2>
              <p className="text-slate-400 text-sm mb-6">11 subjects, 55 topics — click any topic and study, with syllabus alignment for your country.</p>
            </div>
            <Link href="/highschool/study" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-teal-500 text-slate-950 font-semibold text-sm hover:bg-teal-400 transition-colors">
              Open textbooks
            </Link>
          </div>
          <div className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-8 hover:border-amber-500/40 transition-all">
            <div>
              <FileText className="w-8 h-8 text-amber-400 mb-4" />
              <h2 className="text-2xl font-serif font-bold mb-2">Exams</h2>
              <p className="text-slate-400 text-sm mb-6">Past papers by board and year — timed attempts with marking schemes.</p>
            </div>
            <Link href="/highschool/exams" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors">
              Open exam banks
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <Trophy className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
          <p className="text-sm text-slate-400">Want to compete? <Link href="/arena" className="text-amber-400 hover:underline">Global Arena</Link> hosts inter-school and inter-country contests.</p>
        </section>
      </div>
    </div>
  );
}
