import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import type { LessonContent } from "@/types/lesson";
import DiscoveryReader from "./DiscoveryReader";

export const dynamic = "force-dynamic";

export default async function ExtrasTopicPage({ params }: { params: { topic: string } }) {
  const topic = await prisma.topic.findFirst({
    where: { id: params.topic, domain: "extras", isPublished: true },
    include: {
      lessons: { where: { domain: "extras" }, orderBy: { orderIndex: "asc" } },
    },
  });
  if (!topic) notFound();

  // Whole extras map (small table) to build trail, children and side paths.
  const all: { id: string; title: string; parentId: string | null; orderIndex: number }[] =
    await prisma.topic.findMany({
    where: { domain: "extras", isPublished: true },
    select: { id: true, title: true, parentId: true, orderIndex: true },
  });
  const byId = new Map(all.map((t) => [t.id, t]));

  const trail: { id: string; title: string }[] = [];
  let cursor = topic.parentId;
  let guard = 0;
  while (cursor && guard < 10) {
    const parent = byId.get(cursor);
    if (!parent) break;
    trail.unshift({ id: parent.id, title: parent.title });
    cursor = parent.parentId;
    guard += 1;
  }

  const subtopics = all
    .filter((t) => t.parentId === topic.id)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((t) => ({ id: t.id, title: t.title }));

  const siblings = all
    .filter((t) => t.parentId === topic.parentId && t.id !== topic.id)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .slice(0, 8)
    .map((t) => ({ id: t.id, title: t.title }));

  const lessons = topic.lessons.map(
    (l: { id: string; title: string; orderIndex: number; content: unknown }, i: number) => ({
    id: l.id,
    title: l.title,
    depth: Math.min(l.orderIndex ?? i, 3),
    blocks: ((l.content as unknown as LessonContent | undefined)?.blocks ?? []).filter((b) =>
      ["heading", "paragraph", "definition", "example", "callout", "table"].includes(b.type)
    ),
  }));

  return (
    <DiscoveryReader
      topicId={topic.id}
      title={topic.title}
      trail={trail}
      lessons={lessons}
      subtopics={subtopics}
      siblings={siblings}
    />
  );
}
