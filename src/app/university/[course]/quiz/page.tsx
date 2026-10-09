import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { OPEN_PREVIEW } from "@/lib/access";
import CourseQuizClient from "./CourseQuizClient";

export const dynamic = "force-dynamic";

export default async function CourseQuizPage({ params }: { params: { course: string } }) {
  const course = await prisma.course.findFirst({ where: { slug: params.course, domain: "university", isPublished: true } });
  if (!course) notFound();
  const user = await getCurrentUser();
  if (!user && !OPEN_PREVIEW) redirect("/login");
  if (user && !(await hasPremiumAccess(user.id))) return <main className="min-h-screen bg-slate-950 p-8 text-slate-100"><div className="mx-auto max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-8"><h1 className="font-serif text-3xl font-bold">Premium quiz</h1><p className="mt-3 text-slate-300">Subscribe to practice and receive a completion certificate.</p><Link href="/pricing" className="mt-5 inline-flex rounded-lg bg-amber-500 px-4 py-3 font-semibold text-slate-950">View Premium</Link></div></main>;
  const questions = await prisma.courseQuestion.findMany({ where: { courseId: course.id, domain: "university" }, select: { id: true, questionText: true, options: true } });
  return <CourseQuizClient courseId={course.id} courseTitle={course.title} questions={questions.map((question) => ({ ...question, options: Array.isArray(question.options) ? question.options.map(String) : [] }))} />;
}
