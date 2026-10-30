import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight, BookOpen, Compass, FolderOpen, GraduationCap } from "lucide-react";

interface StudyDomain {
  key: string;
  title: string;
  href: string;
  icon: typeof BookOpen;
  tint: string;
  iconColor: string;
  value: string;
  detail: string;
}

async function loadDetail(userId: string): Promise<Record<string, string>> {
  try {
    const jamb = await prisma.examination.findFirst({
      where: { domain: "highschool", code: "jamb" },
      select: { id: true },
    });
    const [subjects, questions, courses, extrasTopics, deskDocuments] = await Promise.all([
      jamb
        ? prisma.topic.count({
            where: { domain: "highschool", parentId: jamb.id, isPublished: true },
          })
        : Promise.resolve(0),
      prisma.question.count({ where: { domain: "highschool" } }),
      prisma.course.count({ where: { domain: "university" } }),
      prisma.topic.count({ where: { domain: "extras", isPublished: true } }),
      prisma.studyDocument.count({ where: { userId } }),
    ]);

    return {
      highschool:
        subjects > 0
          ? `${subjects} JAMB subjects · ${questions.toLocaleString("en-US")} questions`
          : "Syllabus loading — subjects arrive with the JAMB tree",
      university:
        courses > 0
          ? `${courses} courses across faculties and programmes`
          : "Curriculum is being populated",
      discovery:
        extrasTopics > 0
          ? `${extrasTopics} extra topics, skills and certifications`
          : "Extras library is filling up",
      desk:
        deskDocuments > 0
          ? `${deskDocuments} document${deskDocuments === 1 ? "" : "s"} on your desk`
          : "Upload your first notes to stock your desk",
    };
  } catch {
    return {};
  }
}

export default async function StudyGrid({ userId }: { userId: string }) {
  const detail = await loadDetail(userId);

  const cards: StudyDomain[] = [
    {
      key: "highschool",
      title: "High School",
      href: "/highschool",
      icon: BookOpen,
      tint: "from-teal-950/50 via-slate-900 to-slate-900",
      iconColor: "text-teal-300",
      value: "JAMB (UTME) — master its subjects and ace the examination.",
      detail: detail.highschool ?? "Continue where you left off",
    },
    {
      key: "university",
      title: "University",
      href: "/university",
      icon: GraduationCap,
      tint: "from-amber-950/40 via-slate-900 to-slate-900",
      iconColor: "text-gold",
      value: "Deep dive into degree-level coursework, technical modules, and research.",
      detail: detail.university ?? "Continue where you left off",
    },
    {
      key: "discovery",
      title: "Discovery",
      href: "/discovery",
      icon: Compass,
      tint: "from-slate-800/80 via-slate-900 to-slate-950",
      iconColor: "text-teal-300",
      value: "Explore professional certifications, practical skills, and elective topics.",
      detail: detail.discovery ?? "Continue where you left off",
    },
    {
      key: "desk",
      title: "Desk",
      href: "/desk",
      icon: FolderOpen,
      tint: "from-slate-800/80 via-slate-900 to-slate-950",
      iconColor: "text-gold",
      value: "Your own notes, turned into verified practice — artifacts stay yours.",
      detail: detail.desk ?? "Continue where you left off",
    },
  ];

  return (
    <section aria-label="Study destinations" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Keep learning
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-100 md:text-3xl">
            Pick up where you left off
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className={`group flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-b ${card.tint} p-5 shadow-lg shadow-black/20 transition-colors hover:border-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <Icon className={`h-6 w-6 ${card.iconColor}`} aria-hidden />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-100">{card.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{card.value}</p>
              </div>
              <p className="border-t border-white/10 pt-3 text-xs font-semibold text-slate-300">
                Continue: <span className="font-normal text-slate-400">{card.detail}</span>
                <ArrowRight
                  className="ml-1 inline h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-gold"
                  aria-hidden
                />
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
