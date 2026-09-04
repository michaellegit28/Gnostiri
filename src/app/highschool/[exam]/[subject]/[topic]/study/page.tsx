import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { LessonContent } from "@/types/lesson";
import StudyReaderClient from "./StudyReaderClient";

interface StudyPageProps {
  params: {
    exam: string;
    subject: string;
    topic: string;
  };
}

export default async function StudyPage({ params }: StudyPageProps) {
  const examSlug = params.exam.toLowerCase();
  const subjectSlug = params.subject.toLowerCase();
  const topicSlug = params.topic.toLowerCase();

  // Scoped to domain: 'highschool'
  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      code: {
        equals: examSlug,
        mode: "insensitive",
      },
    },
  });

  if (!examination) {
    notFound();
  }

  const subjectTopicId = `${examination.code.toLowerCase()}-${subjectSlug}`;
  const subjectTopic = await prisma.topic.findFirst({
    where: {
      domain: "highschool",
      id: subjectTopicId,
    },
  });

  if (!subjectTopic) {
    notFound();
  }

  // Fetch sibling topics for sidebar/dropdown TOC
  const topicsData = await prisma.topic.findMany({
    where: {
      domain: "highschool",
      parentId: subjectTopic.id,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  const topics = topicsData.map((t) => ({
    id: t.id,
    slug: t.id.replace(`${subjectTopic.id}-`, ""),
    title: t.title,
  }));

  const currentTopic = topicsData.find(
    (t) => t.id.replace(`${subjectTopic.id}-`, "") === topicSlug
  );

  if (!currentTopic) {
    notFound();
  }

  // Fetch lesson content server-side via prisma
  const lesson = await prisma.lesson.findFirst({
    where: {
      domain: "highschool",
      topicId: currentTopic.id,
    },
  });

  const lessonContent = lesson && lesson.content ? (lesson.content as unknown as LessonContent) : null;

  return (
    <StudyReaderClient
      examCode={examination.code.toLowerCase()}
      examName={examination.name.toUpperCase()}
      subjectSlug={subjectSlug}
      subjectTitle={subjectTopic.title}
      topicSlug={topicSlug}
      topicTitle={currentTopic.title}
      topics={topics}
      lessonContent={lessonContent}
    />
  );
}
