import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { UNIVERSITY_OPEN } from "@/lib/access";
import { LessonContent } from "@/types/lesson";
import CourseCompletionButton from "@/components/CourseCompletionButton";
import CurriculumAlignmentWidget from "@/components/curriculum/CurriculumAlignmentWidget";
import AlignmentDisclaimer from "@/components/curriculum/AlignmentDisclaimer";
import LiteModeBanner from "@/components/curriculum/LiteModeBanner";
import ConceptSpine from "@/components/university/ConceptSpine";
import { ArrowLeft, BookOpen, Brain, Clock, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function CoursePage({ params, searchParams }: { params: { course: string }; searchParams?: { lite?: string } }) {
  const lite = searchParams?.lite === "1";
  const course = await prisma.course.findFirst({
    where: { slug: params.course, domain: "university", isPublished: true },
    include: {
      lessons: { orderBy: { orderIndex: "asc" } },
      modules: { orderBy: { orderIndex: "asc" }, include: { concepts: { orderBy: { orderIndex: "asc" } } } },
      concepts: { orderBy: { orderIndex: "asc" } },
      clinicalCases: { where: { isPublished: true }, orderBy: { orderIndex: "asc" } },
      faculty: { select: { name: true, accent: true } },
      programme: { select: { name: true, degreeAwarded: true } },
    },
  });
  if (!course) notFound();
  const user = await getCurrentUser();
  const premium = user ? await hasPremiumAccess(user.id) : UNIVERSITY_OPEN;

  const totalMinutes = course.lessons.reduce((s, l) => s + l.estimatedMinutes, 0);
  const flatConcepts = course.concepts.length > 0 ? course.concepts : course.modules.flatMap((m) => m.concepts);

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14 space-y-10">
        <LiteModeBanner />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/university" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> University
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 truncate max-w-[55vw]">{course.title}</span>
        </nav>

        {/* Header */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(110%_100%_at_90%_0%,rgba(212,175,55,0.12)_0%,rgba(20,27,44,0.9)_45%,#060814_100%)]" />
          <div className="relative px-7 py-10 md:px-10 md:py-12 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {course.code && (
                <span className="font-mono text-xs tracking-[0.18em] text-[#D4AF37] px-2.5 py-1 rounded-md border border-amber-500/25 bg-amber-500/10">
                  {course.code}
                </span>
              )}
              {course.level != null && (
                <span className="text-[11px] font-medium text-slate-300 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50">
                  {course.level} level
                </span>
              )}
              {course.credits != null && (
                <span className="text-[11px] font-medium text-slate-300 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50">
                  {course.credits} credits
                </span>
              )}
              {course.semester && (
                <span className="text-[11px] font-medium capitalize text-slate-300 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50">
                  {course.semester} semester
                </span>
              )}
              {course.programme && (
                <span className="text-[11px] font-medium text-slate-300 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50">
                  {course.programme.degreeAwarded} · {course.programme.name}
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-teal-400 text-sm">{course.department}</p>
                <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 hidden sm:block">
                <CurriculumAlignmentWidget topicSlug={course.slug} lite={lite} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> {course.lessons.length} lesson{course.lessons.length === 1 ? "" : "s"}
              </span>
              {flatConcepts.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> {flatConcepts.length} concepts
                </span>
              )}
              {totalMinutes > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> ~{Math.max(1, Math.round(totalMinutes / 60))}h
                </span>
              )}
              {course.clinicalCases.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {course.clinicalCases.length} clinical case{course.clinicalCases.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Concept spine — the map of how knowledge connects */}
        {flatConcepts.length > 0 && <ConceptSpine concepts={flatConcepts} modules={course.modules} lite={lite} />}

        {/* Lessons */}
        <section className="space-y-5">
          <h2 className="font-serif text-2xl font-bold">Lessons</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const locked = !premium && index > 0;
              const content = lesson.content as unknown as LessonContent;
              return (
                <article key={lesson.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg md:text-xl font-semibold">
                      {lesson.title}{" "}
                      {locked && <span className="ml-2 text-xs text-amber-400 align-middle">Premium</span>}
                    </h3>
                    <span className="text-[11px] text-slate-500 shrink-0">~{lesson.estimatedMinutes} min</span>
                  </div>
                  {locked ? (
                    <div className="mt-4 rounded-lg bg-slate-950 p-5 text-slate-400 blur-[2px] select-none">
                      {lesson.title} includes guided examples and practice steps.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {content.blocks?.map((block, i) => (
                        <div key={i}>
                          {block.type === "heading" ? (
                            <h4 className="font-serif text-lg font-bold">{block.text}</h4>
                          ) : block.type === "paragraph" ? (
                            <p className="leading-relaxed text-slate-300">{block.text}</p>
                          ) : block.type === "definition" ? (
                            <p className="rounded-lg border border-teal-800 bg-teal-950/20 p-4 text-slate-300">
                              <strong className="text-teal-300">{block.term}: </strong>
                              {block.text}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <CourseCompletionButton courseId={course.id} lessonId={lesson.id} locked={locked} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/university/${course.slug}/quiz`}
            className="inline-flex items-center justify-center min-h-[48px] rounded-xl bg-teal-500 px-6 py-3 font-semibold text-slate-950 text-sm hover:bg-teal-400 transition-colors"
          >
            Course quiz
          </Link>
          {flatConcepts.length > 0 && (
            <Link
              href={`/university/${course.slug}/concepts`}
              className="inline-flex items-center justify-center min-h-[48px] rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 text-sm hover:border-[#D4AF37]/60 hover:text-white transition-colors"
            >
              <Brain className="w-4 h-4 mr-2" /> Concept map
            </Link>
          )}
        </div>

        {!premium && (
          <aside className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-6">
            <strong className="text-amber-300">Unlock the full course</strong>
            <p className="text-slate-300 mt-1 text-sm">
              Premium unlocks every lesson, the full concept map, quizzes, certificates, and unlimited AI Tutor.
            </p>
            <Link href="/pricing" className="inline-flex mt-3 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-950 text-sm">
              View plans
            </Link>
          </aside>
        )}

        <AlignmentDisclaimer />
      </div>
    </main>
  );
}
