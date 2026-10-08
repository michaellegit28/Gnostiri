import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
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
          <Link href={backHref} className="text-teal-300 hover:underline text-sm">Back to chapter →</Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <nav className="text-sm text-slate-400"><Link href={backHref} className="hover:text-amber-400">{topic.title}</Link> <span>→ Quiz</span></nav>
        <h1 className="font-serif text-3xl font-bold">{topic.title} quiz <span className="text-sm font-sans text-slate-500">· {topic.questions.length} past questions</span></h1>
        <MasterQuizClient topicId={topic.id} backHref={backHref} backLabel="chapter"
          questions={topic.questions.map((q) => ({ id: q.id, questionText: q.questionText, options: (q.options as unknown as string[]) || [] }))} />
      </div>
    </div>
  );
}
