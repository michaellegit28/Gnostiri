import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, BookOpen, ChevronRight, Play } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface SubjectPageProps {
  params: {
    exam: string;
    subject: string;
  };
}

// Fallback topics per subject
const MOCK_TOPICS: Record<string, Array<{ title: string; slug: string; estimatedMinutes: number }>> = {
  mathematics: [
    { title: "Quadratic Equations", slug: "quadratic-equations", estimatedMinutes: 20 },
    { title: "Trigonometry", slug: "trigonometry", estimatedMinutes: 25 },
    { title: "Indices and Logarithms", slug: "indices-and-logarithms", estimatedMinutes: 15 },
    { title: "Surds and Sequences", slug: "surds-and-sequences", estimatedMinutes: 20 },
    { title: "Coordinate Geometry", slug: "coordinate-geometry", estimatedMinutes: 25 },
    { title: "Probability and Statistics", slug: "probability-and-statistics", estimatedMinutes: 30 },
  ],
  "english-language": [
    { title: "Grammar & Parts of Speech", slug: "grammar-parts-of-speech", estimatedMinutes: 15 },
    { title: "Comprehension Passages", slug: "comprehension-passages", estimatedMinutes: 20 },
    { title: "Summary Writing", slug: "summary-writing", estimatedMinutes: 25 },
    { title: "Lexis and Structure", slug: "lexis-and-structure", estimatedMinutes: 15 },
    { title: "Oral English & Phonetics", slug: "oral-english-phonetics", estimatedMinutes: 20 },
  ],
  physics: [
    { title: "Kinematics and Dynamics", slug: "kinematics-and-dynamics", estimatedMinutes: 25 },
    { title: "Work, Energy, and Power", slug: "work-energy-and-power", estimatedMinutes: 20 },
    { title: "Waves and Optics", slug: "waves-and-optics", estimatedMinutes: 25 },
    { title: "Electric Fields and Current", slug: "electric-fields-and-current", estimatedMinutes: 30 },
    { title: "Atomic and Nuclear Physics", slug: "atomic-and-nuclear-physics", estimatedMinutes: 20 },
  ],
  chemistry: [
    { title: "Atomic Structure & Periodic Table", slug: "atomic-structure-periodic-table", estimatedMinutes: 20 },
    { title: "Chemical Bonding", slug: "chemical-bonding", estimatedMinutes: 20 },
    { title: "Stoichiometry & Mole Concept", slug: "stoichiometry-mole-concept", estimatedMinutes: 25 },
    { title: "Acids, Bases, and Salts", slug: "acids-bases-and-salts", estimatedMinutes: 15 },
    { title: "Organic Chemistry Fundamentals", slug: "organic-chemistry-fundamentals", estimatedMinutes: 30 },
  ],
  biology: [
    { title: "Cell Structure & Function", slug: "cell-structure-function", estimatedMinutes: 15 },
    { title: "Nutrition in Living Organisms", slug: "nutrition-in-living-organisms", estimatedMinutes: 20 },
    { title: "Transport System in Plants and Animals", slug: "transport-system-in-plants-and-animals", estimatedMinutes: 25 },
    { title: "Ecology & Ecosystems", slug: "ecology-ecosystems", estimatedMinutes: 20 },
    { title: "Genetics & Variation", slug: "genetics-variation", estimatedMinutes: 25 },
  ],
};

function formatSubjectTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const examSlug = params.exam.toLowerCase();
  const subjectSlug = params.subject.toLowerCase();

  if (!["waec", "jamb", "neco"].includes(examSlug)) {
    notFound();
  }

  const subjectTitle = formatSubjectTitle(subjectSlug);
  let topics: Array<{ title: string; slug: string; estimatedMinutes: number }> = [];

  try {
    const parentTopicId = `topic-${examSlug}-${subjectSlug}`;
    const dbTopics = await prisma.topic.findMany({
      where: {
        domain: "highschool",
        parentId: parentTopicId,
      },
      include: {
        lessons: {
          select: { estimatedMinutes: true },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    if (dbTopics.length > 0) {
      topics = dbTopics.map((t) => {
        const slug = t.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const estimatedMinutes = t.lessons[0]?.estimatedMinutes || 15;
        return {
          title: t.title,
          slug,
          estimatedMinutes,
        };
      });
    }
  } catch (error) {
    console.warn("Failed to fetch topics from DB, falling back to mock topics:", error);
  }

  // Fallback if DB topics not present
  if (topics.length === 0) {
    topics = MOCK_TOPICS[subjectSlug] || [
      { title: `${subjectTitle} Topic 1`, slug: "topic-1", estimatedMinutes: 15 },
      { title: `${subjectTitle} Topic 2`, slug: "topic-2", estimatedMinutes: 20 },
    ];
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-100 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs text-slate-400 gap-2">
          <Link href="/" className="hover:text-slate-200">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <Link href="/highschool" className="hover:text-slate-200">
            High School
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <Link href={`/highschool/${examSlug}`} className="hover:text-slate-200 uppercase">
            {examSlug}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-[#D4AF37] font-semibold">{subjectTitle}</span>
        </nav>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-50">
              {subjectTitle}
            </h1>
            <p className="mt-2 text-slate-400 text-sm">
              Syllabus topics for {examSlug.toUpperCase()} high school curriculum.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {topics.length} Topics
            </span>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div
              key={topic.slug}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-sm font-bold text-slate-500 font-mono mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">{topic.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-700/50 rounded text-slate-300 font-medium">
                      0% Complete
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{topic.estimatedMinutes} mins
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/highschool/${examSlug}/${subjectSlug}/${topic.slug}/study`}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c3a030] text-slate-950 font-semibold text-sm transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none self-start sm:self-center"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Study</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
