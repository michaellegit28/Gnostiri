import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { UNIVERSITY_OPEN } from "@/lib/access";
import { GraduationCap, Sparkles, ArrowRight, BookOpen, Brain, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gnostiri University — Study at degree depth",
  description:
    "Premium faculty-structured university courses: concept-first learning, clinical correlation, OSCE skills, and verified competency transcripts.",
};

export default async function UniversityPage() {
  const user = await getCurrentUser();
  const premium = user ? await hasPremiumAccess(user.id) : UNIVERSITY_OPEN;

  const [faculties, courses, programmes] = await Promise.all([
    prisma.faculty.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
      include: {
        programmes: { where: { isPublished: true }, orderBy: { orderIndex: "asc" } },
        courses: {
          where: { domain: "university", isPublished: true },
          select: { id: true, lessons: { select: { id: true } } },
        },
      },
    }),
    prisma.course.findMany({
      where: { domain: "university", isPublished: true },
      include: {
        lessons: { orderBy: { orderIndex: "asc" }, select: { id: true, estimatedMinutes: true } },
        concepts: { select: { id: true } },
        faculty: { select: { accent: true, slug: true } },
      },
      orderBy: { title: "asc" },
    }),
    prisma.programme.findMany({
      where: { isPublished: true },
      include: { faculty: { select: { name: true, accent: true } } },
      orderBy: { orderIndex: "asc" },
    }),
  ]);

  const totalConcepts = courses.reduce((s, c) => s + c.concepts.length, 0);
  const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0);
  const totalMinutes = courses.reduce(
    (s, c) => s + c.lessons.reduce((a, l) => a + l.estimatedMinutes, 0),
    0
  );

  const stats = [
    { value: `${faculties.length}`, label: "Faculties" },
    { value: `${courses.length}`, label: "Courses" },
    { value: `${totalConcepts}`, label: "Concept nodes" },
    { value: `${Math.max(1, Math.round(totalMinutes / 60))}`, label: "Hours of depth" },
  ];

  return (
    <main className="min-h-screen bg-transparent text-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-16 space-y-16">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_0%,rgba(212,175,55,0.14)_0%,rgba(20,27,44,0.9)_45%,#060814_100%)]" />
          <div className="relative px-8 py-14 md:px-14 md:py-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <GraduationCap className="w-4 h-4" />
              <span>Gnostiri University</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight max-w-3xl">
              Study at <span className="text-[#D4AF37]">degree depth.</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
              Thirteen faculties. One concept map. Every course is built on a spine of
              connected concepts with clinical correlation, OSCE-grade skills, and a
              verified competency transcript — not a completion badge.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="#faculties"
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-7 py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-semibold text-sm hover:bg-[#c3a030] transition-colors"
              >
                Explore the faculties <ArrowRight className="w-4 h-4" />
              </Link>
              {!premium && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-xl border border-slate-600 text-slate-200 font-semibold text-sm hover:border-[#D4AF37]/60 hover:text-white transition-colors"
                >
                  Unlock Premium
                </Link>
              )}
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-3xl">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 backdrop-blur-sm"
                >
                  <dd className="font-serif text-2xl md:text-3xl font-bold text-[#D4AF37]">
                    {s.value}
                  </dd>
                  <dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {!premium && (
          <aside className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <strong className="text-amber-300">Unlock every course</strong>
              <p className="text-slate-300 mt-1 text-sm">
                Premium includes all university lessons, concept mastery tracking, quizzes,
                certificates, and unlimited AI Tutor access.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center min-h-[48px] rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 text-sm whitespace-nowrap"
            >
              View plans
            </Link>
          </aside>
        )}

        {/* Programmes — the degree tracks */}
        {programmes.length > 0 && (
          <section id="faculties" className="space-y-8">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                Degree programmes
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Choose your path.
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Each programme is mapped to its official benchmark standard — NUC BMAS,
                MDCN, and their equivalents — so what you study matches your degree handbook.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programmes.map((p) => (
                <article
                  key={p.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40"
                >
                  <div
                    className="absolute inset-x-10 top-0 h-[2px] opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${p.faculty?.accent || "#D4AF37"}, transparent)` }}
                  />
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono tracking-[0.2em] text-slate-500">
                      {p.degreeAwarded}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      Flagship
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2">{p.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> {p.durationYears} years
                    </span>
                    {p.totalCredits && (
                      <span className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" /> {p.totalCredits} credits
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Faculties — the full academic map */}
        <section className="space-y-8">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              The thirteen faculties
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              A whole university, structured.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculties.map((f) => {
              const lessonTotal = f.courses.reduce(
                (s, c) => s + c.lessons.length,
                0
              );
              return (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <div
                    className="absolute left-0 top-0 h-full w-[3px]"
                    style={{ background: f.accent || "#D4AF37" }}
                  />
                  <h3 className="font-serif text-lg font-bold mb-1 pl-2">{f.name}</h3>
                  <p className="text-slate-500 text-xs pl-2 leading-relaxed line-clamp-2">
                    {f.blurb}
                  </p>
                  <div className="flex items-center gap-3 mt-4 pl-2 text-[11px] text-slate-500">
                    {f.programmes.length > 0 && (
                      <span>{f.programmes.length} programme{f.programmes.length === 1 ? "" : "s"}</span>
                    )}
                    {lessonTotal > 0 && <span>· {lessonTotal} lesson{lessonTotal === 1 ? "" : "s"}</span>}
                    {f.courses.length === 0 && f.programmes.length === 0 && (
                      <span className="text-slate-600 italic">Courses in preparation</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Courses */}
        <section className="space-y-8">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Open courses
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Begin with the foundations.
            </h2>
          </div>
          {courses.length === 0 ? (
            <p className="text-slate-400">Courses are being prepared. Please check back soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl hover:shadow-amber-500/5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-[0.15em] text-[#D4AF37]">
                        {course.code || course.department}
                      </span>
                      {course.level && (
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                          {course.level} level
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-serif font-bold leading-snug">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> {course.lessons.length} lesson{course.lessons.length === 1 ? "" : "s"}
                      </span>
                      {course.concepts.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5" /> {course.concepts.length} concepts
                        </span>
                      )}
                      {course.credits != null && <span>· {course.credits} credits</span>}
                    </div>
                  </div>
                  <Link
                    href={`/university/${course.slug}`}
                    className="mt-6 inline-flex items-center justify-center min-h-[48px] rounded-xl bg-white/5 border border-white/15 px-5 py-3 font-semibold text-sm text-slate-100 group-hover:bg-[#D4AF37] group-hover:text-slate-950 group-hover:border-[#D4AF37] transition-colors"
                  >
                    {premium ? "Open course" : "Preview course"}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Pedagogy promise */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950 p-10 md:p-14">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Concept-first", body: "Every course is a map of connected ideas. Learn why before how; the exam answers follow." },
              { icon: Sparkles, title: "Clinically correlated", body: "Each preclinical concept ends in its clinical signature — the bridge traditional teaching skips." },
              { icon: Trophy, title: "Verified mastery", body: "Demonstrate competence under exam conditions. Your transcript proves what you can do." },
            ].map((item) => (
              <div key={item.title} className="space-y-3">
                <item.icon className="w-7 h-7 text-[#D4AF37]" />
                <h3 className="font-serif text-xl font-bold">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
