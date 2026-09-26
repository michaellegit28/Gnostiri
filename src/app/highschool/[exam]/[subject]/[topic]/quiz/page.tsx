import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import QuizClient, { QuestionItem } from "./QuizClient";

interface QuizPageProps { params: { exam: string; subject: string; topic: string } }

export default async function QuizPage({ params }: QuizPageProps) {
  const examSlug = params.exam.toLowerCase();
  const subjectSlug = params.subject.toLowerCase();
  const topicSlug = params.topic.toLowerCase();
  const examination = await prisma.examination.findFirst({ where: { domain: "highschool", code: { equals: examSlug, mode: "insensitive" } } });
  if (!examination) notFound();
  const subjectTopicId = `${examination.code.toLowerCase()}-${subjectSlug}`;
  const subjectTopic = await prisma.topic.findFirst({ where: { domain: "highschool", id: subjectTopicId } });
  if (!subjectTopic) notFound();
  const topicId = `${subjectTopic.id}-${topicSlug}`;
  const currentTopic = await prisma.topic.findFirst({ where: { domain: "highschool", id: topicId, parentId: subjectTopic.id } });
  if (!currentTopic) notFound();
  const questionsData = await prisma.question.findMany({ where: { domain: "highschool", topicId: currentTopic.id }, orderBy: { id: "asc" } });
  const questions: QuestionItem[] = questionsData.map((question) => ({
    id: question.id,
    questionText: question.questionText,
    options: Array.isArray(question.options) ? question.options.map(String) : [],
    difficulty: question.difficulty,
  }));
  return <QuizClient examCode={examSlug} examName={examination.name.toUpperCase()} subjectSlug={subjectSlug} subjectTitle={subjectTopic.title} topicSlug={topicSlug} topicTitle={currentTopic.title} topicId={topicId} initialQuestions={questions} />;
}
