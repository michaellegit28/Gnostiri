import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { LessonContent } from "@/types/lesson";
import CourseCompletionButton from "@/components/CourseCompletionButton";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: { course: string } }) {
  const course = await prisma.course.findFirst({ where: { slug: params.course, domain: "university", isPublished: true }, include: { lessons: { orderBy: { orderIndex: "asc" } } } });
  if (!course) notFound();
  const user = await getCurrentUser(); const premium = user ? await hasPremiumAccess(user.id) : false;
  return <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-12"><div className="mx-auto max-w-4xl space-y-8"><Link href="/university" className="text-sm text-slate-400">← Course catalog</Link><header><p className="text-teal-400">{course.department}</p><h1 className="mt-2 font-serif text-4xl font-bold text-amber-400">{course.title}</h1><p className="mt-3 text-slate-400">{course.description}</p></header><div className="space-y-4">{course.lessons.map((lesson, index) => { const locked = !premium && index > 0; const content = lesson.content as unknown as LessonContent; return <article key={lesson.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-xl font-semibold">{lesson.title} {locked && <span className="ml-2 text-xs text-amber-400">Premium</span>}</h2>{locked ? <div className="mt-4 rounded-lg bg-slate-950 p-5 text-slate-400 blur-[2px] select-none">{lesson.title} includes guided examples and practice steps.</div> : <div className="mt-4 space-y-3">{content.blocks?.map((block, i) => <div key={i}>{block.type === "heading" ? <h3 className="font-serif text-xl font-bold">{block.text}</h3> : block.type === "paragraph" ? <p className="leading-relaxed text-slate-300">{block.text}</p> : block.type === "definition" ? <p className="rounded-lg border border-teal-800 p-4 text-slate-300"><strong>{block.term}: </strong>{block.text}</p> : null}</div>)}</div>}<p className="mt-3 text-xs text-slate-500">About {lesson.estimatedMinutes} minutes</p><CourseCompletionButton courseId={course.id} lessonId={lesson.id} locked={locked} /></article>; })}</div><Link href={`/university/${course.slug}/quiz`} className="inline-flex rounded-lg bg-teal-500 px-4 py-3 font-semibold text-slate-950">Course quiz</Link>{!premium && <aside className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5"><p className="text-amber-200">The first lesson is free. Subscribe to unlock every lesson, course quizzes, and certificates.</p><Link href="/pricing" className="mt-3 inline-flex rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-950">Unlock course</Link></aside>}</div></main>;
}
