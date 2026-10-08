import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { subjectBySlug, topicBySlug, neighbours } from "@/lib/curriculum";
import CurriculumAlignmentWidget from "@/components/curriculum/CurriculumAlignmentWidget";
import AlignmentDisclaimer from "@/components/curriculum/AlignmentDisclaimer";
import LiteModeBanner from "@/components/curriculum/LiteModeBanner";
import ManualCompleteButton from "@/components/study/ManualCompleteButton";
import { BioDiagram } from "@/components/diagrams/BioDiagrams";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function pill(tier: string) {
  if (tier === "core") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (tier === "elective") return "bg-amber-50 text-amber-800 border border-amber-300";
  return "bg-red-50 text-red-700 border border-red-200 opacity-75";
}

function anchorFor(text: string, n: number): string {
  return `sec-${n}-${String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}`;
}

// Level 3 — topic page: chapter → advanced → quiz, sticky mini-TOC, resources accordion.
export default async function TopicPage({ params, searchParams }: { params: { subject: string; topic: string }; searchParams?: { lite?: string } }) {
  const { subject: subjectParam, topic: topicParam } = params;

  // Legacy URL handling: /highschool/study/<topic>/quiz and non-subject parents → 301 into the hierarchy.
  if (!subjectBySlug(subjectParam)) {
    const legacy = topicBySlug(subjectParam);
    if (!legacy) notFound();
    const suffix = topicParam === "quiz" ? "/quiz" : (topicBySlug(topicParam) ? `/${topicParam}` : "");
    permanentRedirect(`/highschool/study/${legacy.subject.slug}/${subjectParam}${suffix}`);
  }
  if (topicParam === "quiz") notFound();
  const legacyTopic = topicBySlug(topicParam);
  if (!legacyTopic) notFound();
  if (legacyTopic.subject.slug !== subjectParam) permanentRedirect(`/highschool/study/${legacyTopic.subject.slug}/${topicParam}`);

  const subject = subjectBySlug(subjectParam)!;
  const { prev, next } = neighbours(subjectParam, topicParam);

  const lite = searchParams?.lite === "1";
  const topic = await prisma.topic.findFirst({
    where: { slug: topicParam },
    include: { department: true, alignments: { include: { board: { include: { region: true } }, track: true } }, lessons: { orderBy: { orderIndex: "asc" }, take: 3 }, _count: { select: { questions: true } } },
  });
  if (!topic) notFound();

  type Block = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
  const chapters = topic.lessons.map((l) => ({
    title: l.title,
    minutes: l.estimatedMinutes || 0,
    blocks: ((l.content as unknown as { blocks?: Block[] } | null)?.blocks || []) as Block[],
  }));
  const chapterBlocks = chapters[0]?.blocks || [];
  const chapterMinutes = chapters[0]?.minutes || 0;

  // Mini-TOC from numbered top-level chapter headings.
  const toc = chapterBlocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.type === "heading" && (b.level ?? 2) === 2 && b.text)
    .map(({ b, i }, n) => ({ id: anchorFor(b.text!, i), label: String(b.text).replace(/^\d+[.\s]*/, "").slice(0, 38) || String(b.text).slice(0, 38), index: i }));

  const user = await getCurrentUser();
  let alreadyCompleted = false;
  if (user) {
    const p = await prisma.progress.findFirst({ where: { userId: user.id, domain: "highschool", entityType: "topic", entityId: topic.id }, select: { status: true } });
    alreadyCompleted = p?.status === "completed";
  }

  const byRegion = new Map<string, { region: string; rows: typeof topic.alignments }>();
  for (const a of topic.alignments) {
    const key = a.board.region.name;
    if (!byRegion.has(key)) byRegion.set(key, { region: key, rows: [] });
    byRegion.get(key)!.rows.push(a);
  }

  // Keyword match against existing exam content (shared vocabulary, no duplication).
  const STOP = new Set(["with", "from", "human", "into", "cell", "world", "history"]);
  const keywords = `${topic.title} ${topic.description || ""}`.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 4 && !STOP.has(w)).slice(0, 8);
  const related = keywords.length
    ? await prisma.topic.findMany({
        where: { domain: "highschool", OR: keywords.map((k) => ({ title: { contains: k, mode: "insensitive" as const } })) },
        select: { id: true, title: true, parentId: true, lessons: { select: { id: true, title: true, content: true }, take: 1 }, questions: { select: { sourceExam: true }, take: 30 }, _count: { select: { lessons: true, questions: true } } },
        take: 12,
      })
    : [];
  const subjects = await prisma.topic.findMany({ where: { id: { in: related.map((t) => t.parentId || "") } }, select: { id: true, title: true } });
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const leaf = related.filter((t) => t.parentId && subjectById.has(t.parentId));
  const extraHit = keywords.length
    ? await prisma.topic.findMany({
        where: { domain: "extras", isPublished: true, OR: keywords.map((k) => ({ title: { contains: k, mode: "insensitive" as const } })) },
        select: { id: true, title: true, _count: { select: { lessons: true, questions: true } } },
        take: 6,
      })
    : [];
  const courseHit = keywords.length
    ? await prisma.course.findMany({
        where: { isPublished: true, OR: keywords.map((k) => ({ title: { contains: k, mode: "insensitive" as const } })) },
        select: { slug: true, title: true },
        take: 4,
      })
    : [];
  const studyLinks = leaf.filter((t) => t._count.lessons > 0).slice(0, 6).map((t) => {
    const subj = subjectById.get(t.parentId || "")!;
    const examCode = subj.id.split("-")[0];
    const subjectSlug = subj.id.slice(examCode.length + 1);
    const topicSlug = t.id.slice(subj.id.length + 1);
    return { title: `${subj.title} — ${t.title}`, href: `/highschool/${examCode}/${subjectSlug}/${topicSlug}/study` };
  });
  for (const e of extraHit.filter((t) => t._count.lessons > 0).slice(0, 4)) studyLinks.push({ title: `Discovery — ${e.title}`, href: `/discovery/${e.id}` });
  for (const c of courseHit.slice(0, 3)) studyLinks.push({ title: `University — ${c.title}`, href: `/university/${c.slug}` });

  const kindsOf = (t: { questions: { sourceExam: string | null }[] }) =>
    Array.from(new Set(t.questions.map((q) => (q.sourceExam || "").toUpperCase()).filter(Boolean)));
  const quizLinks = leaf.filter((t) => t._count.questions > 0).slice(0, 6).map((t) => {
    const subj = subjectById.get(t.parentId || "")!;
    const examCode = subj.id.split("-")[0];
    const subjectSlug = subj.id.slice(examCode.length + 1);
    const topicSlug = t.id.slice(subj.id.length + 1);
    return { title: `${subj.title} — ${t.title} (${t._count.questions} questions)`, kinds: kindsOf(t), href: `/highschool/${examCode}/${subjectSlug}/${topicSlug}/quiz` };
  });
  for (const e of extraHit.filter((t) => t._count.questions > 0).slice(0, 4)) quizLinks.push({ title: `Discovery — ${e.title} quiz`, kinds: [] as string[], href: `/discovery/${e.id}/quiz` });

  const practicals: { text: string; href: string }[] = [];
  for (const b of chapterBlocks.filter((b) => b.type === "example" && b.text).slice(0, 2) as { text?: string }[]) {
    if (b.text) practicals.push({ text: b.text, href: `/highschool/study/${subjectParam}/${topicParam}` });
  }
  for (const t of leaf) {
    const subj = subjectById.get(t.parentId || "");
    if (!subj || practicals.length >= 3) continue;
    const blocks = ((t.lessons[0]?.content as unknown as { blocks?: { type: string; text?: string }[] } | null)?.blocks || []).filter((b) => b.type === "example" && b.text);
    for (const b of blocks.slice(0, 1)) {
      const examCode = subj.id.split("-")[0];
      practicals.push({ text: b.text!, href: `/highschool/${examCode}/${subj.id.slice(examCode.length + 1)}/${t.id.slice(subj.id.length + 1)}/study` });
    }
  }

  const renderBlock = (b: Block, i: number, tocMap: Map<number, string>) => {
    if (b.type === "heading") {
      const id = tocMap.get(i);
      return <h3 key={i} id={id} className={`scroll-mt-40 font-serif text-lg font-bold text-slate-100 ${id ? "" : ""}`}>{b.text}</h3>;
    }
    if (b.type === "definition") return <p key={i} className="text-sm font-reading text-slate-200 rounded-lg border border-teal-800 p-3"><strong>{b.term}: </strong>{b.text}</p>;
    if (b.type === "example") return <p key={i} className="text-sm font-reading text-slate-300 border-l-2 border-teal-500 pl-3">{b.text}</p>;
    if (b.type === "callout") return <p key={i} className="text-sm font-reading text-amber-200/90 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">{b.text}</p>;
    if (b.type === "diagram" && b.diagramId) return <BioDiagram key={i} diagramId={b.diagramId} caption={b.caption || ""} />;
    if (b.type === "table" && b.headers) return <div key={i} className="overflow-x-auto rounded-lg border border-slate-700"><table className="w-full text-xs"><thead><tr>{b.headers.map((h) => <th key={h} className="p-2 text-left font-sans bg-slate-800">{h}</th>)}</tr></thead><tbody>{(b.rows || []).map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} className="p-2 border-t border-slate-800">{c}</td>)}</tr>)}</tbody></table></div>;
    return <p key={i} className="text-sm font-reading text-slate-300 leading-relaxed">{b.text}</p>;
  };
  const tocMap = new Map(toc.map((t) => [t.index, t.id]));

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-4 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <LiteModeBanner />
        <nav className="text-sm text-slate-400">
          <Link href="/highschool/study" className="hover:text-amber-400">Study</Link> <span>→</span>{" "}
          <Link href={`/highschool/study/${subjectParam}`} className="hover:text-amber-400">{subject.name}</Link> <span>→ {topic.title}</span>
        </nav>

        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-teal-400 text-sm">{subject.name}</p>
            <h1 className="mt-1 font-serif text-3xl md:text-4xl font-bold">{topic.title}</h1>
            {topic.description && <p className="mt-3 text-slate-400">{topic.description}</p>}
          </div>
          <div className="shrink-0"><CurriculumAlignmentWidget topicSlug={topic.slug!} lite={lite} /></div>
        </header>

        {toc.length > 1 && (
          <nav aria-label="Chapter contents" className="sticky top-16 z-20 -mx-4 px-4 py-2 bg-slate-950/90 backdrop-blur border-y border-slate-800">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {toc.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="shrink-0 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300 hover:border-amber-500/60 hover:text-amber-300">
                  {t.label}
                </a>
              ))}
            </div>
          </nav>
        )}

        <section aria-label="Study" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="font-bold">Study {chapterBlocks.length > 0 && <span className="text-[11px] font-normal text-teal-300">· chapter ready (~{chapterMinutes} min)</span>}</h2>
          {chapterBlocks.length > 0 ? (
            <article className="mt-3 space-y-3">{chapterBlocks.map((b, i) => renderBlock(b, i, tocMap))}</article>
          ) : <p className="mt-1 text-xs text-slate-500">Chapter being written — linked notes below in the meantime.</p>}
          {chapters.slice(1).map((ch) => (
            <details key={ch.title} className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <summary className="font-bold text-sm cursor-pointer text-amber-200">{ch.title} — advanced (~{ch.minutes} min)</summary>
              <article className="mt-3 space-y-3">{ch.blocks.map((b, i) => renderBlock(b, i, new Map()))}</article>
            </details>
          ))}
          {studyLinks.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">{studyLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-teal-300 hover:underline">{l.title} →</Link></li>)}</ul>
          )}
        </section>

        <section aria-label="Quiz" className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="font-bold">Quiz <span className="text-[11px] font-normal text-slate-500">· real past questions only</span></h2>
          {topic._count.questions > 0 && (
            <Link href={`/highschool/study/${subjectParam}/${topicParam}/quiz`} className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm">
              Take the {topic.title} quiz ({topic._count.questions} questions) →
            </Link>
          )}
          <div className="mt-3"><ManualCompleteButton topicId={topic.id} alreadyCompleted={alreadyCompleted} /></div>
          {quizLinks.length ? (
            <ul className="mt-2 space-y-2 text-sm">{quizLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-amber-300 hover:underline">{l.title} →</Link>
                <span className="mt-1 flex flex-wrap gap-1">
                  {l.kinds.length ? l.kinds.map((k) => <span key={k} aria-label={`Past questions from ${k}`} className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 border border-slate-600 text-slate-200">{k}</span>) : <span className="text-[11px] text-slate-500">Practice set</span>}
                </span>
              </li>))}</ul>
          ) : null}
          {!quizLinks.length && topic._count.questions === 0 && <p className="mt-1 text-xs text-slate-500">No real past questions linked yet for this topic.</p>}
        </section>

        <details aria-label="Resources and context" className="rounded-xl border border-slate-800 bg-slate-900/60">
          <summary className="cursor-pointer select-none p-4 font-bold text-sm text-slate-300">Resources & context (practicals, country tags)</summary>
          <div className="space-y-6 px-4 pb-4">
            <section aria-label="Practicals" className="pt-2">
              <h3 className="font-bold text-sm">Practicals</h3>
              {practicals.length ? (
                <div className="mt-2 space-y-2">{practicals.map((p, i) => <div key={i} className="text-sm text-slate-300 border-l-2 border-teal-500 pl-3">{p.text} <Link href={p.href} className="text-teal-300 hover:underline">Try it →</Link></div>)}</div>
              ) : <p className="mt-1 text-xs text-slate-500">Hands-on guides surface here from linked study examples; educators can propose more via the tutor.</p>}
            </section>
            <section aria-label="Country alignment matrix" className="space-y-3">
              <h3 className="font-bold text-sm">Country tags ({byRegion.size || "none yet — pending human verification"})</h3>
              {Array.from(byRegion.values()).map(({ region, rows }) => (
                <div key={region} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-semibold text-slate-400">{region}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rows.map((a) => (
                      <span key={a.id} aria-label={`${a.board.name} ${a.tier}`} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pill(a.tier)}`}>
                        {a.board.name}: {a.tier.charAt(0).toUpperCase() + a.tier.slice(1)}{a.track ? ` (${a.track.name})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </details>

        <AlignmentDisclaimer lastAudited={topic.lastAuditedDate ? new Date(topic.lastAuditedDate).toISOString().slice(0, 10) : null} />

        <nav aria-label="Topic navigation" className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
          {prev ? (
            <Link href={`/highschool/study/${subjectParam}/${prev.slug}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300">
              <ArrowLeft className="w-4 h-4" /> {prev.title}
            </Link>
          ) : (
            <Link href={`/highschool/study/${subjectParam}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300">
              <ArrowLeft className="w-4 h-4" /> All {subject.name} topics
            </Link>
          )}
          {next ? (
            <Link href={`/highschool/study/${subjectParam}/${next.slug}`} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400">
              Next topic: {next.title} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link href={`/highschool/study/${subjectParam}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300">
              Back to {subject.name} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
