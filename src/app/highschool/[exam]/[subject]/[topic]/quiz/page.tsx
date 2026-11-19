import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { createQuizAnswerSession } from "@/lib/quiz-answer-session";
import QuizClient, { QuestionItem } from "./QuizClient";
import { boardBySlug } from "@/lib/exam-bank";

interface QuizPageProps { params: { exam: string; subject: string; topic: string } }

export default async function QuizPage({ params }: QuizPageProps) {
  const examSlug = params.exam.toLowerCase();
  const subjectSlug = params.subject.toLowerCase();
  const topicSlug = params.topic.toLowerCase();

  // Registry check FIRST — retired boards return proper 404.
  const registryBoard = boardBySlug(examSlug);
  if (!registryBoard) notFound();

  const examination = await prisma.examination.findFirst({ where: { domain: "highschool", code: { equals: examSlug, mode: "insensitive" } } });
  if (!examination) notFound();
  const subjectTopicId = `${examination.code.toLowerCase()}-${subjectSlug}`;
  const subjectTopic = await prisma.topic.findFirst({ where: { domain: "highschool", id: subjectTopicId } });
  if (!subjectTopic) notFound();
  // Legacy topic ids may not extend the subject id — accept either form.
  const constructedId = `${subjectTopic.id}-${topicSlug}`;
  const currentTopic =
    (await prisma.topic.findFirst({ where: { domain: "highschool", id: constructedId, parentId: subjectTopic.id } })) ??
    (await prisma.topic.findFirst({ where: { domain: "highschool", id: topicSlug, parentId: subjectTopic.id } }));
  if (!currentTopic) notFound();
  const topicId = currentTopic.id;
  // RULE 4 — a question this board marks NOT_EXAMINED never reaches a learner,
  // here or on any other surface. The predicate matches src/lib/board-bank.ts,
  // so the quiz header's "Question 1 of N" always equals the board-page count.
  const questionsData = await prisma.question.findMany({
    where: {
      domain: "highschool",
      topicId: currentTopic.id,
      NOT: { boardTags: { some: { examinationId: examination.id, tier: "NOT_EXAMINED" } } },
    },
    orderBy: { id: "asc" },
  });
  const questions: QuestionItem[] = questionsData.map((question) => ({
    id: question.id,
    questionText: question.questionText,
    options: Array.isArray(question.options) ? question.options.map(String) : [],
    difficulty: question.difficulty,
  }));
  const user = await getCurrentUser();
  const quizSession = user && questions.length
    ? await createQuizAnswerSession({
        userId: user.id,
        domain: "highschool",
        topicId,
        examCode: examSlug,
        questionIds: questions.map((question) => question.id),
      })
    : null;
  return <QuizClient examCode={examSlug} examName={examination.name.toUpperCase()} subjectSlug={subjectSlug} subjectTitle={subjectTopic.title} topicSlug={topicSlug} topicTitle={currentTopic.title} topicId={topicId} sessionId={quizSession?.id ?? null} initialQuestions={questions} />;
}
