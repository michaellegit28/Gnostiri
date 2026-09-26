import prisma from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExtrasPage() {
  const topics = await prisma.topic.findMany({ where: { domain: "extras", isPublished: true, parentId: null }, include: { children: { where: { domain: "extras", isPublished: true } } }, orderBy: { orderIndex: "asc" } });
  return (
    <main className="min-h-screen p-6 md:p-12 bg-slate-950 text-slate-50"><div className="max-w-6xl mx-auto space-y-8"><h1 className="text-4xl font-serif font-bold text-amber-400">General knowledge</h1><p className="text-slate-400">Free topics for curious learners, with the same daily Tutor limits as High School.</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{topics.flatMap((root) => root.children.length ? root.children : [root]).map((topic) => <article key={topic.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-serif text-xl font-bold">{topic.title}</h2><p className="mt-3 text-sm text-slate-400">Explore a short guided introduction and practice activity.</p><Link href={`/extras/${topic.id}`} className="inline-block mt-5 rounded-lg bg-teal-500 px-4 py-2 font-semibold text-slate-950">Explore topic</Link></article>)}</div></div>
    </main>
  );
}
