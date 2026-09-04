import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, FileQuestion, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface ExamHubProps {
  params: {
    exam: string;
  };
}

// Static mockup data when database is empty
const MOCK_EXAMS: Record<
  string,
  {
    name: string;
    code: string;
    country: string;
    subjects: Array<{
      title: string;
      slug: string;
      topicCount: number;
      questionCount: number;
    }>;
  }
> = {
  waec: {
    name: "West African Senior School Certificate Examination",
    code: "WAEC",
    country: "West Africa",
    subjects: [
      { title: "Mathematics", slug: "mathematics", topicCount: 6, questionCount: 10 },
      { title: "English Language", slug: "english-language", topicCount: 5, questionCount: 0 },
      { title: "Physics", slug: "physics", topicCount: 5, questionCount: 0 },
      { title: "Chemistry", slug: "chemistry", topicCount: 5, questionCount: 0 },
      { title: "Biology", slug: "biology", topicCount: 5, questionCount: 0 },
    ],
  },
  jamb: {
    name: "Joint Admissions and Matriculation Board",
    code: "JAMB",
    country: "Nigeria",
    subjects: [
      { title: "Mathematics", slug: "mathematics", topicCount: 6, questionCount: 0 },
      { title: "English Language", slug: "english-language", topicCount: 5, questionCount: 0 },
      { title: "Physics", slug: "physics", topicCount: 5, questionCount: 0 },
      { title: "Chemistry", slug: "chemistry", topicCount: 5, questionCount: 0 },
      { title: "Biology", slug: "biology", topicCount: 5, questionCount: 0 },
    ],
  },
  neco: {
    name: "National Examinations Council",
    code: "NECO",
    country: "Nigeria",
    subjects: [
      { title: "Mathematics", slug: "mathematics", topicCount: 6, questionCount: 0 },
      { title: "English Language", slug: "english-language", topicCount: 5, questionCount: 0 },
      { title: "Physics", slug: "physics", topicCount: 5, questionCount: 0 },
      { title: "Chemistry", slug: "chemistry", topicCount: 5, questionCount: 0 },
      { title: "Biology", slug: "biology", topicCount: 5, questionCount: 0 },
    ],
  },
};

export default async function ExamHubPage({ params }: ExamHubProps) {
  const examSlug = params.exam.toLowerCase();

  // Ensure slug matches known exam
  if (!["waec", "jamb", "neco"].includes(examSlug)) {
    notFound();
  }

  let examData = null;

  try {
    const examRecord = await prisma.examination.findFirst({
      where: {
        code: { equals: examSlug, mode: "insensitive" },
        domain: "highschool",
      },
    });

    if (examRecord) {
      // Find parent subject topics for this exam
      const subjectTopics = await prisma.topic.findMany({
        where: {
          domain: "highschool",
          parentId: null,
          id: { startsWith: `topic-${examSlug}` },
        },
        include: {
          children: {
            include: {
              _count: {
                select: { questions: true },
              },
            },
          },
        },
        orderBy: { orderIndex: "asc" },
      });

      if (subjectTopics.length > 0) {
        examData = {
          name: examRecord.name,
          code: examRecord.code,
          country: examRecord.country || "General",
          subjects: subjectTopics.map((subject) => {
            const topicCount = subject.children.length;
            const questionCount = subject.children.reduce(
              (acc, child) => acc + child._count.questions,
              0
            );
            const slug = subject.title.toLowerCase().replace(/\s+/g, "-");
            return {
              title: subject.title,
              slug,
              topicCount,
              questionCount,
            };
          }),
        };
      }
    }
  } catch (error) {
    console.warn("Database lookup failed, falling back to mock exam data:", error);
  }

  // Fallback to mock data if database has no rows
  if (!examData) {
    examData = MOCK_EXAMS[examSlug];
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-slate-400 gap-2">
          <Link href="/" className="hover:text-slate-200">
            Home
          </Link>
          <span>/</span>
          <Link href="/highschool" className="hover:text-slate-200">
            High School
          </Link>
          <span>/</span>
          <span className="text-[#D4AF37] font-semibold">{examData.code}</span>
        </nav>

        {/* Header */}
        <div className="border-b border-slate-800 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full">
              {examData.code}
            </span>
            <span className="text-slate-400 text-sm">{examData.country}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-50">
            {examData.name}
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl">
            Select a subject to access topic breakdowns, structured lessons, and practice questions.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examData.subjects.map((subject) => (
            <div
              key={subject.slug}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-md hover:shadow-[#D4AF37]/5"
            >
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-100 mb-4">
                  {subject.title}
                </h2>
                <div className="flex items-center gap-6 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#14B8A6]" />
                    <span>{subject.topicCount} Topics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileQuestion className="w-4 h-4 text-[#D4AF37]" />
                    <span>{subject.questionCount} Questions</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/highschool/${examSlug}/${subject.slug}`}
                className="w-full inline-flex items-center justify-between min-h-[48px] px-5 py-2.5 rounded-lg bg-[#14B8A6] hover:bg-[#0f9284] text-slate-950 font-semibold text-sm transition-colors focus:ring-2 focus:ring-[#14B8A6] focus:outline-none"
              >
                <span>Start Studying</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
