import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { LessonContent } from "@/types/lesson";

export default async function ExtrasTopicPage({ params }: { params: { topic: string } }) {
  const topic = await prisma.topic.findFirst({ where: { id: params.topic, domain: "extras", isPublished: true }, include: { lessons: { where: { domain: "extras" }, orderBy: { orderIndex: "asc" } } } });
  if (!topic) notFound();
  const blocks = (topic.lessons[0]?.content as unknown as LessonContent | undefined)?.blocks || [];
  return <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-12"><article className="mx-auto max-w-3xl"><Link href="/extras" className="text-sm text-slate-400">← Extras</Link><h1 className="mt-6 font-serif text-4xl font-bold text-amber-400">{topic.title}</h1><div className="mt-7 space-y-5">{blocks.map((block, i) => <div key={i}>{block.type === "heading" ? <h2 className="font-serif text-2xl font-bold">{block.text}</h2> : block.type === "paragraph" ? <p className="leading-relaxed text-slate-300">{block.text}</p> : block.type === "definition" ? <p className="rounded-xl border border-teal-800 p-5 text-slate-300"><strong>{block.term}: </strong>{block.text}</p> : null}</div>)}</div><Link href={`/extras/${topic.id}/quiz`} className="mt-8 inline-flex rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950">Practice questions</Link></article></main>;
}
