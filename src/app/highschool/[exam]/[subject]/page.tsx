import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { ChevronRight, Clock, CheckCircle2, BookOpen, ArrowRight } from "lucide-react";

interface SubjectPageProps {
  params: {
    exam: string;
    subject: string;
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const examSlug = params.exam.toLowerCase();
  const subjectSlug = params.subject.toLowerCase();

  // Scoped to domain: 'highschool'
  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      code: {
        equals: examSlug,
        mode: "insensitive",
      },
    },
  });

  if (!examination) {
    notFound();
  }

  const subjectTopicId = `${examination.code.toLowerCase()}-${subjectSlug}`;
  const subjectTopic = await prisma.topic.findFirst({
    where: {
      domain: "highschool",
      id: subjectTopicId,
    },
  });

  if (!subjectTopic) {
    notFound();
  }

  const topics = await prisma.topic.findMany({
    where: {
      domain: "highschool",
      parentId: subjectTopic.id,
    },
    orderBy: {
      orderIndex: "asc",
    },
    include: {
      lessons: {
        where: {
          domain: "highschool",
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumbs: Exam > Subject */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link
            href={`/highschool/${examination.code.toLowerCase()}`}
            className="hover:text-amber-400 transition-colors"
          >
            {examination.name.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">{subjectTopic.title}</span>
        </nav>

        {/* Subject Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 tracking-tight">
            {subjectTopic.title}
          </h1>
          <p className="mt-2 text-slate-400 text-base">
            Explore syllabus topics, lesson materials, and past question practice.
          </p>
        </div>

        {/* Topic List */}
        <div className="space-y-4">
          {topics.map((topic, index) => {
            const topicSlug = topic.id.replace(`${subjectTopic.id}-`, "");
            const estimatedMinutes = topic.lessons[0]?.estimatedMinutes ?? 10;

            return (
              <div
                key={topic.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 font-serif font-bold text-sm shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">{topic.title}</h2>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Completion: 0%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>~{estimatedMinutes} mins</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <Link
                    href={`/highschool/${examination.code.toLowerCase()}/${subjectSlug}/${topicSlug}/study`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors w-full sm:w-auto"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Study</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
