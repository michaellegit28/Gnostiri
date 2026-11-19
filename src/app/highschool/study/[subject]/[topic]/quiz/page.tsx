import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { createQuizAnswerSession } from "@/lib/quiz-answer-session";
import { subjectBySlug, topicBySlug } from "@/lib/curriculum";
import MasterQuizClient from "./MasterQuizClient";

export const dynamic = "force-dynamic";

// Master-topic quiz: serves the topic's own question bank (real past questions).
export default async function MasterQuizPage({ params }: { params: { subject: string; topic: string } }) {
  const subjectParam = params.subject;
  const topicParam = params.topic;
  if (!subjectBySlug(subjectParam) || !topicBySlug(topicParam)) notFound();
  const topic = await prisma.topic.findFirst({
    where: { slug: topicParam },
    include: { questions: { orderBy: { id: "asc" } } },
  });
  if (!topic) notFound();
  const backHref = `/highschool/study/${subjectParam}/${topicParam}`;
  if (!topic.questions.length) {
    return (
      <div className="min-h-screen p-6 md:p-12 text-slate-100">
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <p className="text-slate-400 text-sm">No quiz bank yet for {topic.title}.</p>
          <Link href={backHref} className="text-slate-400 hover:underline text-sm">Back to chapter →</Link>
        </div>
      </div>
    );
  }
  const questions = topic.questions.map((question) => ({
    id: question.id,
    questionText: question.questionText,
    options: (question.options as unknown as string[]) || [],
  }));
  const user = await getCurrentUser();
  const quizSession = user
    ? await createQuizAnswerSession({
        userId: user.id,
        domain: "highschool",
        topicId: topic.id,
        examCode: null,
        questionIds: questions.map((question) => question.id),
      })
    : null;
  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <nav className="text-sm text-slate-400"><Link href={backHref} className="hover:text-gold">{topic.title}</Link> <span>→ Quiz</span></nav>
        <h1 className="font-serif text-3xl font-bold">{topic.title} quiz <span className="text-sm font-sans text-slate-400">· {topic.questions.length} past questions</span></h1>
        <MasterQuizClient topicId={topic.id} sessionId={quizSession?.id ?? null} backHref={backHref} backLabel="chapter" questions={questions} />
      </div>
    </div>
  );
}
