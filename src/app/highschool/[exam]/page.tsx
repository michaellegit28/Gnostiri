import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { BookOpen, HelpCircle, ArrowRight, GraduationCap } from "lucide-react";

interface ExamHubPageProps {
  params: {
    exam: string;
  };
}

export default async function ExamHubPage({ params }: ExamHubPageProps) {
  const examSlug = params.exam.toLowerCase();

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

  // Find root exam topic or search subjects associated with this exam
  const examTopic = await prisma.topic.findFirst({
    where: {
      domain: "highschool",
      id: examination.code.toLowerCase(),
    },
  });

  const subjectTopics = examTopic
    ? await prisma.topic.findMany({
        where: {
          domain: "highschool",
          parentId: examTopic.id,
        },
        orderBy: {
          orderIndex: "asc",
        },
        include: {
          children: {
            where: {
              domain: "highschool",
            },
            include: {
              questions: {
                where: {
                  domain: "highschool",
                },
              },
            },
          },
          questions: {
            where: {
              domain: "highschool",
            },
          },
        },
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>High School Domain</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 tracking-tight">
            {examination.name.toUpperCase()} Exam Hub
          </h1>
          <p className="mt-3 text-slate-400 text-base md:text-lg max-w-2xl">
            Select a subject to explore syllabus topics, structured study guides, and past examination practice questions.
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectTopics.map((subject) => {
            const topicCount = subject.children.length;
            // Total questions under this subject and its subtopics
            const totalQuestions =
              subject.questions.length +
              subject.children.reduce((acc, child) => acc + child.questions.length, 0);

            // Generate subject slug from subject id or title
            const subjectSlug = subject.id.replace(`${examination.code.toLowerCase()}-`, "");

            return (
              <div
                key={subject.id}
                className="flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/40 transition-all duration-200 group"
              >
                <div>
                  <h2 className="text-2xl font-semibold font-serif text-slate-100 group-hover:text-amber-400 transition-colors">
                    {subject.title}
                  </h2>
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      <span>{topicCount} Topics</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-teal-400" />
                      <span>{totalQuestions} Questions</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={`/highschool/${examination.code.toLowerCase()}/${subjectSlug}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors"
                  >
                    <span>Start Studying</span>
                    <ArrowRight className="w-4 h-4" />
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
