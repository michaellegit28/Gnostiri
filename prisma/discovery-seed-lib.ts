// Discovery Lab seeding library (Agent 3).
// Side-effect free: exports functions that seed the `extras` domain from the
// Agent-3 content JSON files. Imported by prisma/seed.ts (canonical seed) and
// by the standalone prisma/seed-discovery-*.ts runners.
//
// Source of truth lives in the Agent 3 sandbox so content and seeding stay in sync.

import { PrismaClient, AppDomain } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

type LessonBlock = { type: string; [key: string]: unknown };

type ContentLesson = {
  id: string;
  title: string;
  orderIndex: number;
  estimatedMinutes: number;
  content: { blocks: LessonBlock[] };
};

type ContentBranch = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  orderIndex: number;
  isPublished: boolean;
  lessons: ContentLesson[];
  children: { id: string; title: string }[];
};

type ContentTopic = {
  id: string;
  domain: string;
  parentId: string | null;
  title: string;
  slug: string | null;
  description: string | null;
  orderIndex: number;
  isPublished: boolean;
  lessons: ContentLesson[];
  children: ContentBranch[];
};

type ContentFile = { department: string; topics: ContentTopic[] };

const DOMAIN: AppDomain = "extras";

export function loadDiscoveryContent(relativePath: string): ContentFile {
  // Seed scripts run from the project root (prisma db seed / ts-node prisma/...):
  // resolve against cwd so this works under both CJS and ESM compilation.
  const fullPath = path.resolve(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

export async function seedDiscoveryContent(
  prisma: PrismaClient,
  content: ContentFile
): Promise<{ topics: number; lessons: number }> {
  let topics = 0;
  let lessons = 0;

  const upsertLesson = async (lesson: ContentLesson, topicId: string) => {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        title: lesson.title,
        domain: DOMAIN,
        topicId,
        orderIndex: lesson.orderIndex,
        estimatedMinutes: lesson.estimatedMinutes,
        content: lesson.content,
      },
      create: {
        id: lesson.id,
        title: lesson.title,
        domain: DOMAIN,
        topicId,
        orderIndex: lesson.orderIndex,
        estimatedMinutes: lesson.estimatedMinutes,
        content: lesson.content,
      },
    });
    lessons += 1;
  };

  const upsertTopic = async (
    node: ContentTopic | ContentBranch,
    parentId: string | null
  ) => {
    await prisma.topic.upsert({
      where: { id: node.id },
      update: {
        title: node.title,
        description: node.description ?? null,
        domain: DOMAIN,
        parentId,
        orderIndex: node.orderIndex,
        isPublished: node.isPublished,
        slug: node.slug ?? null,
        lastAuditedDate: new Date(),
        needsVerification: true,
      },
      create: {
        id: node.id,
        title: node.title,
        description: node.description ?? null,
        domain: DOMAIN,
        parentId,
        orderIndex: node.orderIndex,
        isPublished: node.isPublished,
        slug: node.slug ?? null,
        lastAuditedDate: new Date(),
        needsVerification: true,
      },
    });
    topics += 1;
  };

  for (const topic of content.topics) {
    await upsertTopic(topic, topic.parentId);
    for (const lesson of topic.lessons) await upsertLesson(lesson, topic.id);
    for (const branch of topic.children) {
      await upsertTopic(branch, topic.id);
      for (const lesson of branch.lessons) await upsertLesson(lesson, branch.id);
    }
  }

  return { topics, lessons };
}

export async function seedDiscoveryPhysics(prisma: PrismaClient) {
  const content = loadDiscoveryContent(
    "sandbox/agent3-pq-assistant/discovery-physics-content.json"
  );
  const result = await seedDiscoveryContent(prisma, content);
  console.log(
    `Discovery Physics seed complete: ${result.topics} topics, ${result.lessons} lessons.`
  );
  return result;
}

export async function seedDiscoveryNeuroscience(prisma: PrismaClient) {
  const content = loadDiscoveryContent(
    "sandbox/agent3-pq-assistant/discovery-neuroscience-content.json"
  );
  const result = await seedDiscoveryContent(prisma, content);
  console.log(
    `Discovery Neuroscience seed complete: ${result.topics} topics, ${result.lessons} lessons.`
  );
  return result;
}

// Discovery is Agent 3's lane: retire the pre-rebuild "junk" extras topics and
// the old shallow disco-* chain so only the research labs remain published.
export async function retireLegacyExtras(prisma: PrismaClient) {
  const junkTitles = [
    "World Geography",
    "Everyday Science",
    "Critical Thinking",
    "Digital Literacy",
    "Financial Basics",
  ];
  const junkIds = junkTitles.map(
    (t) => `extras-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`
  );
  const retired = await prisma.topic.updateMany({
    where: {
      domain: DOMAIN,
      OR: [
        { id: { in: junkIds } },
        { id: { startsWith: "disco-" } },
        { id: { startsWith: "extras-" } },
      ],
    },
    data: { isPublished: false },
  });
  console.log(`Retired ${retired.count} legacy extras topics.`);
  return retired.count;
}
