import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { BookOpen, FileText, ArrowRight, ChevronRight, History, Globe2, BellPlus } from "lucide-react";

export const dynamic = "force-dynamic";

interface ExamSummary {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  subjectCount: number;
  paperCount: number;
  description: string;
}

function describeExam(code: string, name: string, syllabusUrl: string | null): string {
  if (syllabusUrl) return syllabusUrl;
  switch (code) {
    case "waec":
      return "West African Senior School Certificate Examination — past papers, syllabus-aligned lessons, and practice questions.";
    case "jamb":
      return "Joint Admissions and Matriculation Board UTME — past papers, prep modules, and practice questions.";
    case "neco":
      return "National Examinations Council Senior School Certificate — past papers and curriculum resources.";
    default:
      return `${name} examination past papers, structured lessons, and practice questions.`;
  }
}

export default async function HighSchoolHubPage() {
  const examinations: { id: string; code: string; slug: string; name: string; country: string | null; syllabusUrl: string | null }[] =
    await prisma.examination.findMany({
      where: { domain: "highschool" },
      orderBy: { name: "asc" },
    });

  const examSummaries: ExamSummary[] = await Promise.all(
    examinations.map(async (exam) => {
      const subjectCount = await prisma.topic.count({
        where: { domain: "highschool", parentId: exam.code.toLowerCase() },
      });
      const paperCount = await prisma.examPaper.count({
        where: { examinationId: exam.id, isPublished: true },
      });
      return {
        id: exam.id,
        slug: exam.slug,
        name: exam.name,
        country: exam.country,
        subjectCount,
        paperCount,
        description: describeExam(exam.code.toLowerCase(), exam.name, exam.syllabusUrl),
      };
    })
  );

  // Group exams by region/country — the hub grows by data, never redesign.
  const regions = new Map<string, ExamSummary[]>();
  for (const exam of examSummaries) {
    const region = exam.country?.trim() || "International";
    if (!regions.has(region)) regions.set(region, []);
    regions.get(region)?.push(exam);
  }
  const orderedRegions = Array.from(regions.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // Resume banner for returning learners.
  let recentActivity: { link: string; label: string } | null = null;
  const user = await getCurrentUser();
  if (user) {
    const lastProgress = await prisma.progress.findFirst({
      where: { userId: user.id, domain: "highschool" },
      orderBy: { lastStudied: "desc" },
    });
    if (lastProgress) {
      const topic: {
        id: string;
        title: string;
        parentId: string | null;
        parent?: {
          id: string;
          title: string;
          parentId: string | null;
          parent?: { title: string } | null;
        } | null;
      } | null = await prisma.topic.findFirst({
        where: { id: lastProgress.entityId, domain: "highschool" },
        include: { parent: { include: { parent: true } } },
      });
      if (topic?.parent) {
        const subjectTopic = topic.parent;
        const examCode = subjectTopic.parentId || "";
        const subjectSlug = subjectTopic.id.replace(`${examCode}-`, "");
        const topicSlug = topic.id.replace(`${subjectTopic.id}-`, "");
        if (examCode && subjectSlug && topicSlug) {
          recentActivity = {
            link: `/highschool/${examCode.toLowerCase()}/${subjectSlug.toLowerCase()}/${topicSlug.toLowerCase()}/study`,
            label: `Continue: ${subjectTopic.parent?.title || examCode.toUpperCase()} ${subjectTopic.title} — ${topic.title}`,
          };
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool" className="hover:text-amber-400 transition-colors">
            High School
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-100 font-medium">Exams</span>
        </nav>

        {/* Hero — global promise */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(110%_100%_at_50%_0%,#14213d_0%,#0a0f22_55%,#060814_100%)] px-6 py-12 md:px-12 md:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <SectionMark variant="school" className="w-4 h-4" accent="#14B8A6" />
            <span>High School · Exams</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            Past papers, <span className="text-[#D4AF37]">every system</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Pick your country, choose your examination, and practice on real past
            papers — new systems open every term.
          </p>
        </div>

        {/* Resume banner */}
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

        {/* Regions */}
        {orderedRegions.map(([region, exams], ri) => (
          <section key={region} className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.25em] text-slate-500">
                {String(ri + 1).padStart(2, "0")}
              </span>
              <Globe2 className="w-5 h-5 text-teal-300" />
              <h2 className="text-xl md:text-2xl font-serif font-bold">{region}</h2>
              <span className="text-xs text-slate-500">
                · {exams.length} examination{exams.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-amber-500/40 transition-all duration-200 group shadow-lg"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <h3 className="text-2xl font-serif font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                        {exam.name.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                          <span>{exam.subjectCount} Subjects</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                          <FileText className="w-3.5 h-3.5 text-amber-500" />
                          <span>{exam.paperCount} Paper{exam.paperCount === 1 ? "" : "s"}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {exam.description}
                    </p>
                  </div>
                  <Link
                    href={`/highschool/exams/${exam.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors"
                  >
                    <span>Open exam board</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Your system isn't here yet */}
        <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center space-y-4">
          <BellPlus className="w-8 h-8 text-slate-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold">Your country isn&apos;t listed yet?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            New examination systems open every term. Create a free account and yours
            will be among the first we unlock — members shape what comes next.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-[#D4AF37] text-slate-950 font-semibold text-sm hover:bg-[#c3a030] transition-colors"
          >
            Get notified — it&apos;s free
          </Link>
        </section>
      </div>
    </div>
  );
}
