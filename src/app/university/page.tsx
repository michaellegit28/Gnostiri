import Link from "next/link";
import prisma from "@/lib/db";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function UniversityPage() {
  const user = await getCurrentUser();
  const premium = user ? await hasPremiumAccess(user.id) : false;
  const courses = await prisma.course.findMany({ where: { domain: "university", isPublished: true }, include: { lessons: { orderBy: { orderIndex: "asc" } } }, orderBy: { title: "asc" } });
  return (
    <main className="min-h-screen p-6 md:p-12 bg-transparent text-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <header><p className="text-teal-400 text-sm font-semibold flex items-center gap-2"><SectionMark variant="university" className="w-5 h-5 text-[#D4AF37]" />University</p><h1 className="text-4xl font-serif font-bold text-amber-400 mt-2">Course catalog</h1><p className="text-slate-400 mt-3">Explore university courses and start with a free lesson preview.</p></header>
        {!premium && <aside className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5"><strong className="text-amber-300">Unlock every course</strong><p className="text-slate-300 mt-1">Premium includes all university lessons, quizzes, and unlimited Tutor access.</p><Link href="/pricing" className="inline-flex mt-3 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-950">View plans</Link></aside>}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <article key={course.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><p className="text-xs text-teal-400">{course.department} · {course.lessons.length} lessons</p><h2 className="mt-2 text-2xl font-serif font-bold">{course.title}</h2><p className="mt-3 text-slate-400">{course.description}</p><Link className="mt-5 inline-flex rounded-lg bg-teal-500 px-4 py-2 font-semibold text-slate-950" href={`/university/${course.slug}`}>{premium ? "Open course" : "Preview course"}</Link></article>)}</div>
        {courses.length === 0 && <p className="text-slate-400">Courses are being prepared. Please check back soon.</p>}
      </div>
    </main>
  );
}
