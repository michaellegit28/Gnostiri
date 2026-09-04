import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, BookOpen, CheckCircle, HelpCircle, MessageSquare, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LessonContent, LessonBlock } from "@/types/lesson";
import { LessonBlockRenderer } from "@/components/study/LessonBlockRenderer";
import { MobileTopicSelector } from "@/components/study/MobileTopicSelector";

interface StudyPageProps {
  params: {
    exam: string;
    subject: string;
    topic: string;
  };
}

function formatTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function StudyReaderPage({ params }: StudyPageProps) {
  const examSlug = params.exam.toLowerCase();
  const subjectSlug = params.subject.toLowerCase();
  const topicSlug = params.topic.toLowerCase();

  if (!["waec", "jamb", "neco"].includes(examSlug)) {
    notFound();
  }

  const examCode = examSlug.toUpperCase();
  const subjectTitle = formatTitle(subjectSlug);
  const topicTitle = formatTitle(topicSlug);

  let lessonContent: LessonContent | null = null;
  let siblingTopics: Array<{ title: string; slug: string }> = [];

  try {
    const parentTopicId = `topic-${examSlug}-${subjectSlug}`;

    // Fetch sibling topics for sidebar TOC
    const dbTopics = await prisma.topic.findMany({
      where: {
        domain: "highschool",
        parentId: parentTopicId,
      },
      orderBy: { orderIndex: "asc" },
    });

    if (dbTopics.length > 0) {
      siblingTopics = dbTopics.map((t) => ({
        title: t.title,
        slug: t.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }

    // Attempt to load subtopic and its lesson
    const dbSubtopic = dbTopics.find(
      (t) =>
        t.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") === topicSlug
    );

    if (dbSubtopic) {
      const dbLesson = await prisma.lesson.findFirst({
        where: {
          domain: "highschool",
          topicId: dbSubtopic.id,
        },
      });

      if (dbLesson && dbLesson.content) {
        lessonContent = dbLesson.content as unknown as LessonContent;
      }
    }
  } catch (error) {
    console.warn("Database error in study reader page, using fallback content if matching quadratic equations:", error);
  }

  // Hardcode seed fallback for quadratic equations if DB query fails or empty
  if (!lessonContent && examSlug === "waec" && subjectSlug === "mathematics" && topicSlug === "quadratic-equations") {
    lessonContent = {
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Introduction to Quadratic Equations",
        },
        {
          type: "paragraph",
          text: "A quadratic equation is a second-order polynomial equation in a single variable x, written in the standard form ax² + bx + c = 0, where a ≠ 0.",
        },
        {
          type: "definition",
          term: "Discriminant (Δ)",
          text: "The expression b² - 4ac is called the discriminant. It determines the nature of the roots: real and distinct if Δ > 0, real and equal if Δ = 0, and complex if Δ < 0.",
        },
        {
          type: "heading",
          level: 3,
          text: "Methods of Solving Quadratic Equations",
        },
        {
          type: "paragraph",
          text: "There are three primary algebraic methods to solve quadratic equations: Factoring, Completing the Square, and applying the Quadratic Formula.",
        },
        {
          type: "callout",
          variant: "info",
          text: "Tip: Always check if the quadratic expression can be easily factored before attempting Completing the Square or using the Quadratic Formula.",
        },
        {
          type: "example",
          text: "Solve x² - 5x + 6 = 0 using factoring.\nSolution: Find two numbers that multiply to +6 and add to -5 (-2 and -3).\n(x - 2)(x - 3) = 0 ⇒ x = 2 or x = 3.",
        },
        {
          type: "callout",
          variant: "warning",
          text: "Beware: If a = 0, the equation is linear, not quadratic! Ensure the coefficient of x² is non-zero.",
        },
        {
          type: "table",
          headers: ["Method", "Best Used When", "Formula / Technique"],
          rows: [
            ["Factoring", "b² - 4ac is a perfect square", "(x - p)(x - q) = 0"],
            ["Quadratic Formula", "Any quadratic equation", "x = (-b ± √(b² - 4ac)) / 2a"],
            ["Completing Square", "Deriving formula or finding vertex", "(x + d)² = e"],
          ],
        },
      ],
    };
  }

  // Fallback sibling topics if none found
  if (siblingTopics.length === 0) {
    siblingTopics = [
      { title: "Quadratic Equations", slug: "quadratic-equations" },
      { title: "Trigonometry", slug: "trigonometry" },
      { title: "Indices and Logarithms", slug: "indices-and-logarithms" },
      { title: "Surds and Sequences", slug: "surds-and-sequences" },
    ];
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans pb-24 sm:pb-28">
      {/* Top Header & Breadcrumb */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center text-xs text-slate-400 gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-slate-200">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            <Link href="/highschool" className="hover:text-slate-200">
              High School
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            <Link href={`/highschool/${examSlug}`} className="hover:text-slate-200">
              {examCode}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            <Link href={`/highschool/${examSlug}/${subjectSlug}`} className="hover:text-slate-200">
              {subjectTitle}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-[#D4AF37] font-semibold">{topicTitle}</span>
          </nav>

          <Link
            href={`/highschool/${examSlug}/${subjectSlug}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subject</span>
          </Link>
        </div>
      </header>

      {/* Main Reader Area */}
      <div className="max-w-7xl w-full mx-auto px-6 pt-8 flex-1 flex gap-10">
        {/* Desktop Collapsible TOC Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-800 pr-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#D4AF37] mb-4">
            <BookOpen className="w-4 h-4" />
            <span>{subjectTitle} Topics</span>
          </div>
          <ul className="space-y-1.5 text-xs">
            {siblingTopics.map((item) => {
              const isActive = item.slug === topicSlug;
              return (
                <li key={item.slug}>
                  <Link
                    href={`/highschool/${examSlug}/${subjectSlug}/${item.slug}/study`}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#D4AF37]/10 text-[#D4AF37] font-semibold border-l-2 border-[#D4AF37]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Content Container */}
        <main className="flex-1 max-w-3xl mx-auto space-y-6">
          {/* Mobile TOC selector */}
          <MobileTopicSelector
            examSlug={examSlug}
            subjectSlug={subjectSlug}
            subjectTitle={subjectTitle}
            currentTopicSlug={topicSlug}
            siblingTopics={siblingTopics}
          />

          {/* Topic Title Header */}
          <div className="border-b border-slate-800 pb-6">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {examCode} Syllabus
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-50 mt-3">
              {topicTitle}
            </h1>
          </div>

          {/* Lesson Blocks or Empty State */}
          {lessonContent && lessonContent.blocks && lessonContent.blocks.length > 0 ? (
            <article className="space-y-4">
              {lessonContent.blocks.map((block: LessonBlock, idx: number) => (
                <LessonBlockRenderer key={idx} block={block} />
              ))}
            </article>
          ) : (
            <div className="py-16 text-center bg-slate-800/40 border border-slate-800 rounded-2xl p-8 space-y-4">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h2 className="text-xl font-serif font-bold text-slate-300">
                Content Coming Soon
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Comprehensive study notes and structured lessons for <span className="text-amber-400 font-medium">{topicTitle}</span> are currently being prepared by our subject experts.
              </p>
              <Link
                href={`/highschool/${examSlug}/${subjectSlug}`}
                className="inline-flex items-center justify-center px-5 py-2.5 min-h-[48px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-700"
              >
                Explore Other Topics
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-800 py-3 px-6 z-30 backdrop-blur">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-semibold text-xs sm:text-sm transition-colors focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>

          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c3a030] text-slate-950 font-semibold text-xs sm:text-sm transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Practice Questions</span>
          </button>

          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm transition-colors border border-slate-700 focus:ring-2 focus:ring-slate-400 focus:outline-none"
          >
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span>Ask Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
