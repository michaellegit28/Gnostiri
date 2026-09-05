import Link from "next/link";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { GraduationCap, BookOpen, ArrowRight, ChevronRight, History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HighSchoolHubPage() {
  // Query examinations for highschool domain
  const examinations = await prisma.examination.findMany({
    where: {
      domain: "highschool",
    },
    orderBy: {
      name: "asc",
    },
  });

  // Attach subject count and descriptive blurb for each exam
  const examSummaries = await Promise.all(
    examinations.map(async (exam) => {
      const subjectCount = await prisma.topic.count({
        where: {
          domain: "highschool",
          parentId: exam.code.toLowerCase(),
        },
      });

      let description = exam.syllabusUrl;
      if (!description) {
        const code = exam.code.toLowerCase();
        if (code === "waec") {
          description = "West African Senior School Certificate Examination prep with syllabus-aligned lessons and practice questions.";
        } else if (code === "jamb") {
          description = "Joint Admissions and Matriculation Board UTME preparation modules and past question practice.";
        } else if (code === "neco") {
          description = "National Examinations Council Senior School Certificate Examination curriculum resources.";
        } else {
          description = `${exam.name} examination syllabus, structured lessons, and practice questions.`;
        }
      }

      return {
        ...exam,
        subjectCount,
        description,
      };
    })
  );

  // Fetch recent user activity if authenticated and progress exists
  let recentActivity: {
    link: string;
    label: string;
  } | null = null;

  const cookieStore = cookies();
  const firebaseUid = cookieStore.get("firebaseUid")?.value;

  if (firebaseUid) {
    const user = await prisma.user.findFirst({
      where: { firebaseUid },
    });

    if (user) {
      const lastProgress = await prisma.progress.findFirst({
        where: {
          userId: user.id,
          domain: "highschool",
        },
        orderBy: {
          lastStudied: "desc",
        },
      });

      if (lastProgress) {
        const topic = await prisma.topic.findFirst({
          where: {
            id: lastProgress.entityId,
            domain: "highschool",
          },
          include: {
            parent: {
              include: {
                parent: true,
              },
            },
          },
        });

        if (topic && topic.parent) {
          const subjectTopic = topic.parent;
          const examCode = subjectTopic.parentId || "";
          const subjectSlug = subjectTopic.id.replace(`${examCode}-`, "");
          const topicSlug = topic.id.replace(`${subjectTopic.id}-`, "");

          const examName = subjectTopic.parent?.title || examCode.toUpperCase();
          const subjectTitle = subjectTopic.title;
          const topicTitle = topic.title;

          if (examCode && subjectSlug && topicSlug) {
            recentActivity = {
              link: `/highschool/${examCode.toLowerCase()}/${subjectSlug.toLowerCase()}/${topicSlug.toLowerCase()}/study`,
              label: `Continue: ${examName} ${subjectTitle} — ${topicTitle}`,
            };
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">High School</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>High School Domain</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 tracking-tight">
            High School Examinations
          </h1>
          <p className="mt-3 text-slate-400 text-base md:text-lg max-w-2xl">
            Select an examination board to explore curriculum subjects, study guides, and past practice questions.
          </p>
        </div>

        {/* Recent Activity Prompt (if user is signed in with prior progress) */}
        {recentActivity && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-300">
              <History className="w-5 h-5 shrink-0 text-amber-400" />
              <span className="text-sm font-medium">{recentActivity.label}</span>
            </div>
            <Link
              href={recentActivity.link}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shrink-0"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Exam Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examSummaries.map((exam) => (
            <div
              key={exam.id}
              className="flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/40 transition-all duration-200 group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-serif font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {exam.name.toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>{exam.subjectCount} Subjects</span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {exam.description}
                </p>
              </div>

              <div>
                <Link
                  href={`/highschool/${exam.code.toLowerCase()}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors"
                >
                  <span>Start Studying</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
