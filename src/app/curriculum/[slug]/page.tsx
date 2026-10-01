import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import CurriculumAlignmentWidget from "@/components/curriculum/CurriculumAlignmentWidget";
import AlignmentDisclaimer from "@/components/curriculum/AlignmentDisclaimer";
import LiteModeBanner from "@/components/curriculum/LiteModeBanner";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function pill(tier: string) {
  if (tier === "core") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (tier === "elective") return "bg-amber-50 text-amber-800 border border-amber-300";
  return "bg-red-50 text-red-700 border border-red-200 opacity-75";
}

// Master topic page: study + quiz + exams + practicals aggregated from existing
// exam/university/extras content (no duplication), plus alignment matrix + widget.
export default async function CurriculumTopicPage({ params, searchParams }: { params: { slug: string }; searchParams?: { lite?: string } }) {
  const lite = searchParams?.lite === "1";
  const topic = await prisma.topic.findFirst({
    where: { slug: params.slug },
    include: { department: true, alignments: { include: { board: { include: { region: true } }, track: true } } },
  });
  if (!topic) notFound();

  const byRegion = new Map<string, { region: string; rows: typeof topic.alignments }>();
  for (const a of topic.alignments) {
    const key = a.board.region.name;
    if (!byRegion.has(key)) byRegion.set(key, { region: key, rows: [] });
    byRegion.get(key)!.rows.push(a);
  }

  // Keyword match against existing exam content (shared vocabulary, no duplication).
  const STOP = new Set(["with", "from", "human", "into", "cell", "world", "history"]);
  const keywords = topic.title.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !STOP.has(w));
  const related = keywords.length
    ? await prisma.topic.findMany({
        where: { domain: "highschool", OR: keywords.map((k) => ({ title: { contains: k, mode: "insensitive" as const } })) },
        select: { id: true, title: true, parentId: true, lessons: { select: { id: true, title: true, content: true }, take: 1 }, _count: { select: { lessons: true, questions: true } } },
        take: 12,
      })
    : [];
  const subjects = await prisma.topic.findMany({ where: { id: { in: related.map((t) => t.parentId || "") } }, select: { id: true, title: true } });
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const studyLinks = related.filter((t) => t._count.lessons > 0).slice(0, 6).map((t) => {
    const subj = subjectById.get(t.parentId || "")!;
    const examCode = subj.id.split("-")[0];
    const subjectSlug = subj.id.slice(examCode.length + 1);
    const topicSlug = t.id.slice(subj.id.length + 1);
    return { title: `${subj.title} — ${t.title}`, href: `/highschool/${examCode}/${subjectSlug}/${topicSlug}/study` };
  });
  const quizLinks = related.filter((t) => t._count.questions > 0).slice(0, 6).map((t) => {
    const subj = subjectById.get(t.parentId || "")!;
    const examCode = subj.id.split("-")[0];
    const subjectSlug = subj.id.slice(examCode.length + 1);
    const topicSlug = t.id.slice(subj.id.length + 1);
    return { title: `${subj.title} — ${t.title} (${t._count.questions} questions)`, href: `/highschool/${examCode}/${subjectSlug}/${topicSlug}/quiz` };
  });
  // Hands-on cards surface existing worked examples (no fabricated lab content).
  const practicals: { text: string; href: string }[] = [];
  for (const t of related) {
    const subj = subjectById.get(t.parentId || "");
    if (!subj || practicals.length >= 3) continue;
    const blocks = ((t.lessons[0]?.content as unknown as { blocks?: { type: string; text?: string }[] } | null)?.blocks || []).filter((b) => b.type === "example" && b.text);
    for (const b of blocks.slice(0, 1)) {
      const examCode = subj.id.split("-")[0];
      practicals.push({ text: b.text!, href: `/highschool/${examCode}/${subj.id.slice(examCode.length + 1)}/${t.id.slice(subj.id.length + 1)}/study` });
    }
  }
  // Boards with exam-paper pages on this site link out; others are reference tags.
  const EXAM_LINK: Record<string, string> = { "WAEC Nigeria": "waec", "WAEC Ghana": "waec", NECO: "neco" };
  const examBoards = topic.alignments.filter((a) => a.tier === "core" && EXAM_LINK[a.board.name]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <LiteModeBanner />
        <nav className="text-sm text-slate-400"><Link href="/curriculum" className="hover:text-amber-400">Curriculum</Link> <span>→ {topic.department?.name}</span></nav>
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-teal-400 text-sm">{topic.department?.name}</p>
            <h1 className="mt-1 font-serif text-4xl font-bold">{topic.title}</h1>
            {topic.description && <p className="mt-3 text-slate-400">{topic.description}</p>}
          </div>
          <div className="shrink-0"><CurriculumAlignmentWidget topicSlug={topic.slug!} lite={lite} /></div>
        </header>

        <section aria-label="Study" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="font-bold">Study</h2>
          {studyLinks.length ? (
            <ul className="mt-2 space-y-1 text-sm">{studyLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-teal-300 hover:underline">{l.title} →</Link></li>)}</ul>
          ) : <p className="mt-1 text-xs text-slate-500">Study notes linking here soon — see Global School exam pages.</p>}
        </section>

        <section aria-label="Quiz" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="font-bold">Quiz</h2>
          {quizLinks.length ? (
            <ul className="mt-2 space-y-1 text-sm">{quizLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-amber-300 hover:underline">{l.title} →</Link></li>)}</ul>
          ) : <p className="mt-1 text-xs text-slate-500">No quiz bank linked yet for this topic.</p>}
        </section>

        <section aria-label="Exams" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="font-bold">Exams</h2>
          {examBoards.length ? (
            <ul className="mt-2 space-y-1 text-sm">{examBoards.map((a) => <li key={a.id}><Link href={`/highschool/${EXAM_LINK[a.board.name]}`} className="text-slate-200 hover:underline">{a.board.name} past papers →</Link></li>)}</ul>
          ) : <p className="mt-1 text-xs text-slate-500">Core-exam paper links appear once boards are verified above.</p>}
        </section>

        <section aria-label="Practicals" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="font-bold">Practicals</h2>
          {practicals.length ? (
            <div className="mt-2 space-y-2">{practicals.map((p, i) => <div key={i} className="text-sm text-slate-300 border-l-2 border-teal-500 pl-3">{p.text} <Link href={p.href} className="text-teal-300 hover:underline">Try it →</Link></div>)}</div>
          ) : <p className="mt-1 text-xs text-slate-500">Hands-on guides surface here from linked study examples; educators can propose more via the tutor.</p>}
        </section>

        <section aria-label="Country alignment matrix" className="space-y-4">
          <h2 className="font-bold text-lg">Country tags ({byRegion.size || "none yet — pending human verification"})</h2>
          {Array.from(byRegion.values()).map(({ region, rows }) => (
            <div key={region} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="font-semibold text-sm text-slate-300">{region}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {rows.map((a) => (
                  <span key={a.id} aria-label={`${a.board.name} ${a.tier}`} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pill(a.tier)}`}>
                    {a.board.name}: {a.tier}{a.track ? ` (${a.track.name})` : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <AlignmentDisclaimer lastAudited={topic.lastAuditedDate ? new Date(topic.lastAuditedDate).toISOString().slice(0, 10) : null} />
      </div>
    </div>
  );
}
