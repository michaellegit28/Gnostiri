import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { LessonContent } from "@/types/lesson";
import { topicSlugOf } from "@/app/highschool/exams/[exam]/topic-slug";
import StudyReaderClient from "./StudyReaderClient";
import { masterTopicFor } from "@/lib/study-crosswalk";

interface StudyPageProps {
  params: {
    exam: string;
    subject: string;
    topic: string;
  };
  searchParams?: { lite?: string };
}

export const revalidate = 60;

export default async function StudyPage({ params, searchParams }: StudyPageProps) {
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
    // Legacy ids may not extend the subject id; the full id stays a valid slug.
    slug: topicSlugOf(t.id, subjectTopic.id),
    title: t.title,
    lastAuditedDate: t.lastAuditedDate,
  }));

  const currentTopic = topics.find((t) => t.slug === topicSlug);

  if (!currentTopic) {
    notFound();
  }

  // Fetch lesson content server-side via prisma. Study notes are authored on
  // the master curriculum topics; a JAMB-tree topic falls back to its mapped
  // master topic (study-crosswalk) so exam pages show the authored note
  // instead of an empty state.
  const lesson = await prisma.lesson.findFirst({
    where: {
      domain: "highschool",
      topicId: currentTopic.id,
    },
  });
  if (!lesson) {
    const masterTopicId = masterTopicFor(currentTopic.id);
    if (masterTopicId) {
      const fallback = await prisma.lesson.findFirst({
        where: { domain: "highschool", topicId: masterTopicId },
      });
      if (fallback) {
        return (
          <StudyReaderClient
            examCode={examination.code.toLowerCase()}
            examName={examination.name.toUpperCase()}
            subjectSlug={subjectSlug}
            subjectTitle={subjectTopic.title}
            topicSlug={topicSlug}
            topicTitle={currentTopic.title}
            topics={topics}
            lessonContent={fallback.content as unknown as LessonContent}
            alignmentSlug={topicSlug}
            lite={searchParams?.lite === "1"}
            lastAudited={currentTopic.lastAuditedDate ? new Date(currentTopic.lastAuditedDate).toISOString().slice(0, 10) : null}
          />
        );
      }
    }
  }

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
      alignmentSlug={topicSlug}
      lite={searchParams?.lite === "1"}
      lastAudited={currentTopic.lastAuditedDate ? new Date(currentTopic.lastAuditedDate).toISOString().slice(0, 10) : null}
    />
  );
}
