import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import QuizClient, { QuestionItem } from "@/app/highschool/[exam]/[subject]/[topic]/quiz/QuizClient";

export const dynamic = "force-dynamic";

export default async function ExtrasQuizPage({ params }: { params: { topic: string } }) {
  const topic = await prisma.topic.findFirst({ where: { id: params.topic, domain: "extras", isPublished: true } });
  if (!topic) notFound();
  const data = await prisma.question.findMany({ where: { topicId: topic.id, domain: "extras" }, orderBy: { id: "asc" } });
  const questions: QuestionItem[] = data.map((question) => ({ id: question.id, questionText: question.questionText, options: Array.isArray(question.options) ? question.options.map(String) : [], difficulty: question.difficulty }));
  return <QuizClient examCode="extras" examName="Extras" subjectSlug="general-knowledge" subjectTitle="General Knowledge" topicSlug={params.topic} topicTitle={topic.title} topicId={topic.id} domain="extras" initialQuestions={questions} />;
}
