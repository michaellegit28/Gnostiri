import prisma from "@/lib/db";
import { AppDomain } from "@prisma/client";

export interface TopicProgressSummary {
  topicId: string;
  topicTitle: string;
  subjectTitle?: string;
  examCode?: string;
  accuracy: number;
  status: string;
  lastStudied: Date;
}

/**
 * Get weak topics for a user in a given domain (most recent accuracy < 60%)
 */
export async function getWeakTopics(
  userId: string,
  domain: AppDomain = "highschool"
): Promise<TopicProgressSummary[]> {
  const progressRows = await prisma.progress.findMany({
    where: {
      userId,
      domain,
      entityType: "topic",
      accuracy: {
        lt: 0.6,
      },
    },
    orderBy: {
      lastStudied: "desc",
    },
  });

  if (progressRows.length === 0) {
    return [];
  }

  const topicIds = progressRows.map((p) => p.entityId);
  const topics = await prisma.topic.findMany({
    where: {
      domain,
      id: { in: topicIds },
    },
    include: {
      parent: true,
    },
  });

  const topicMap = new Map(topics.map((t) => [t.id, t]));

  return progressRows.map((p) => {
    const topic = topicMap.get(p.entityId);
    let subjectTitle = topic?.parent?.title;
    let examCode = "";

    if (p.entityId.includes("-")) {
      const parts = p.entityId.split("-");
      examCode = parts[0];
    }

    return {
      topicId: p.entityId,
      topicTitle: topic?.title || p.entityId,
      subjectTitle,
      examCode,
      accuracy: p.accuracy ?? 0,
      status: p.status,
      lastStudied: p.lastStudied,
    };
  });
}

/**
 * Get strong topics for a user in a given domain (most recent accuracy >= 85%)
 */
export async function getStrongTopics(
  userId: string,
  domain: AppDomain = "highschool"
): Promise<TopicProgressSummary[]> {
  const progressRows = await prisma.progress.findMany({
    where: {
      userId,
      domain,
      entityType: "topic",
      accuracy: {
        gte: 0.85,
      },
    },
    orderBy: {
      lastStudied: "desc",
    },
  });

  if (progressRows.length === 0) {
    return [];
  }

  const topicIds = progressRows.map((p) => p.entityId);
  const topics = await prisma.topic.findMany({
    where: {
      domain,
      id: { in: topicIds },
    },
    include: {
      parent: true,
    },
  });

  const topicMap = new Map(topics.map((t) => [t.id, t]));

  return progressRows.map((p) => {
    const topic = topicMap.get(p.entityId);
    let subjectTitle = topic?.parent?.title;
    let examCode = "";

    if (p.entityId.includes("-")) {
      const parts = p.entityId.split("-");
      examCode = parts[0];
    }

    return {
      topicId: p.entityId,
      topicTitle: topic?.title || p.entityId,
      subjectTitle,
      examCode,
      accuracy: p.accuracy ?? 0,
      status: p.status,
      lastStudied: p.lastStudied,
    };
  });
}
