import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { lessonId } = await req.json();
  const course = await prisma.course.findFirst({ where: { id: params.courseId, domain: "university" }, include: { lessons: { orderBy: { orderIndex: "asc" } } } });
  if (!course || !course.lessons.some((lesson) => lesson.id === lessonId)) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  const premium = await hasPremiumAccess(user.id);
  if (!premium && course.lessons[0]?.id !== lessonId) return NextResponse.json({ error: "Premium required" }, { status: 403 });
  const progressId = `course-${user.id}-${lessonId}`;
  await prisma.progress.upsert({ where: { id: progressId }, update: { status: "completed", lastStudied: new Date(), accuracy: 1 }, create: { id: progressId, userId: user.id, domain: "university", entityType: "courseLesson", entityId: lessonId, status: "completed", accuracy: 1 } });
  const completed = await prisma.progress.count({ where: { userId: user.id, domain: "university", entityType: "courseLesson", entityId: { in: course.lessons.map((lesson) => lesson.id) }, status: "completed" } });
  const quizAttempt = await prisma.courseQuizAttempt.findFirst({ where: { userId: user.id, courseId: course.id, domain: "university" } });
  const certificate = premium && completed === course.lessons.length && quizAttempt ? await prisma.certificate.upsert({ where: { userId_courseId: { userId: user.id, courseId: course.id } }, update: {}, create: { userId: user.id, courseId: course.id, domain: "university" } }) : null;
  return NextResponse.json({ completed, total: course.lessons.length, certificate });
}
