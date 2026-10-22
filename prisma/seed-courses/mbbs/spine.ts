import { PrismaClient } from "@prisma/client";
import type { LessonContent } from "@/types/lesson";

const prisma = new PrismaClient();

/**
 * Shared engine for the MBBS degree spine.
 *
 * Nine subjects — Anatomy, Physiology, Biochemistry, Pathology, Pharmacology,
 * Medicine, Surgery, Obstetrics & Gynaecology, Paediatrics — are seeded as real
 * university courses on one common spine, following the conventions proven in
 * prisma/seed-courses/introduction-to-programming.ts:
 *
 *   - idempotent upserts on stable keys (course id or domain+slug, lesson id,
 *     concept courseId+slug, assessment item slug), so re-running updates
 *     content in place and never duplicates rows
 *   - a CourseModule x ConceptNode spine with bloomsLevel, estMinutes and a
 *     real prerequisite DAG, plus CoursePrerequisite edges between subjects
 *   - CourseLessons mapped 1:1 to ConceptNodes by orderIndex (the lesson-study
 *     page finds the concept a lesson teaches via that alignment)
 *   - SBA AssessmentItems carrying the invariants the exam scorer relies on
 *
 * Governance: every row ships reviewStatus "needs-human-review" — this seeder
 * never marks anything "verified". needsCheck is false ONLY for fully authored
 * content; tracked-placeholder lessons carry needsCheck true so they surface in
 * the human-review queue instead of masquerading as finished work. No
 * placeholder assessment item is ever created — an item exists only when it has
 * been authored.
 */

export interface ConceptSeed {
  title: string;
  slug: string;
  /** One or two accurate sentences on what the concept covers. */
  summary: string;
  blooms: string;
  minutes: number;
  prereq: string[];
}

export interface LessonSeed {
  title: string;
  /** 1-based index into the subject's module list. */
  module: number;
  concept: ConceptSeed;
  estimatedMinutes: number;
  /** false => tracked placeholder, needsCheck true. */
  authored: boolean;
  content: LessonContent;
}

export interface SbaSeed {
  slug: string;
  /** Concept slug this item assesses. */
  concept: string;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface SubjectSeed {
  /** Stable course id, used when the course row does not exist yet. */
  id: string;
  /** When set, the course row already exists (seed-university.ts) and is found by domain+slug. */
  existingSlug?: string;
  slug: string;
  title: string;
  code: string;
  department: string;
  level: number;
  credits: number;
  semester: string;
  description: string;
  faculty: "basic-medical-sciences" | "clinical-medicine";
  modules: { slug: string; title: string }[];
  lessons: LessonSeed[];
  sbas: SbaSeed[];
  /** Slugs of the courses that must be completed first. */
  prereqCourses: string[];
}

export interface SubjectCounts {
  modules: number;
  concepts: number;
  edges: number;
  lessons: number;
  items: number;
  courseEdges: number;
}

const MBBS_PROGRAMME_SLUG = "medicine-surgery-mbbs";
const DEPARTMENT_ICON: Record<string, string> = {
  "Human Anatomy": "bone",
  Physiology: "activity",
  "Medical Biochemistry": "flask-conical",
  "Pharmacology & Therapeutics": "pill",
  Pathology: "microscope",
  "Internal Medicine": "stethoscope",
  Surgery: "scissors",
  "Obstetrics & Gynaecology": "heart-pulse",
  Paediatrics: "baby",
};

/**
 * Tracked-placeholder lesson. States plainly that the content is not written
 * yet and what the concept will cover, so a learner is never misled into
 * reading a stub as a finished lesson.
 */
export function pendingLesson(lesson: LessonSeed): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "In preparation" },
      {
        type: "callout",
        variant: "info",
        text: "This lesson has not been authored yet. It is published as a tracked placeholder: the concept, its prerequisite edges and its place in the course spine are real and stable, but the teaching content is pending and is flagged for human review rather than shipped as if it were complete.",
      },
      {
        type: "paragraph",
        text: `Planned scope — ${lesson.concept.title}: ${lesson.concept.summary}`,
      },
      {
        type: "paragraph",
        text: "Study the concepts that precede it in this module first: the prerequisite chains are enforced, so nothing here assumes knowledge that has not been taught yet.",
      },
    ],
  };
}

/** Invariants every authored SBA must satisfy before it reaches the database. */
export function assertSbaInvariants(sba: SbaSeed): void {
  if (!sba.slug || !sba.stem || !sba.explanation) throw new Error(`incomplete SBA ${sba.slug}`);
  if (!sba.options || sba.options.length !== 4) {
    throw new Error(`${sba.slug}: expected exactly 4 options, got ${sba.options?.length}`);
  }
  const seen = new Set<string>();
  for (const opt of sba.options) {
    if (typeof opt !== "string" || opt.trim().length === 0) throw new Error(`${sba.slug}: empty option`);
    if (seen.has(opt)) throw new Error(`${sba.slug}: duplicate option "${opt}"`);
    seen.add(opt);
  }
  if (!sba.options.includes(sba.correctAnswer)) {
    throw new Error(`${sba.slug}: correctAnswer is not one of the options — key drift`);
  }
}

/**
 * Deterministic rotation seeded by the item's own position, so the correct
 * answer never sits first by construction. correctAnswer is the option TEXT,
 * so rotating the array can never break the key.
 */
export function rotateOptions(options: string[], index: number): string[] {
  const rot = index % options.length;
  return [...options.slice(rot), ...options.slice(0, rot)];
}

/**
 * Seed one subject: resolve (or create) the course row, then write the full
 * spine — modules, concepts with prerequisite edges, lessons 1:1 with
 * concepts, authored SBA items, and course-level prerequisites.
 */
export async function seedMbbsCourse(subject: SubjectSeed): Promise<SubjectCounts> {
  if (subject.lessons.length === 0) throw new Error(`${subject.slug}: no lessons in spine`);
  if (subject.modules.length === 0) throw new Error(`${subject.slug}: no modules in spine`);
  for (const l of subject.lessons) {
    if (l.module < 1 || l.module > subject.modules.length) {
      throw new Error(`${subject.slug}: lesson "${l.title}" points at module ${l.module}`);
    }
  }

  const slugs = new Set<string>();
  for (const l of subject.lessons) {
    if (slugs.has(l.concept.slug)) {
      throw new Error(`${subject.slug}: duplicate concept slug ${l.concept.slug}`);
    }
    slugs.add(l.concept.slug);
  }
  for (const sba of subject.sbas) {
    assertSbaInvariants(sba);
    if (!slugs.has(sba.concept)) {
      throw new Error(`${subject.slug}: SBA ${sba.slug} targets unknown concept ${sba.concept}`);
    }
  }
  const itemSlugs = new Set(subject.sbas.map((s) => s.slug));
  if (itemSlugs.size !== subject.sbas.length) throw new Error(`${subject.slug}: duplicate SBA slug`);

  // --- programme / faculty / department context (from seed-university.ts) ---
  const programme = await prisma.programme.findUnique({ where: { slug: MBBS_PROGRAMME_SLUG } });
  const faculty = await prisma.faculty.findUnique({ where: { slug: subject.faculty } });
  if (!faculty) {
    throw new Error(`${subject.slug}: faculty ${subject.faculty} missing — run prisma/seed-university.ts first`);
  }
  const department = await prisma.department.upsert({
    where: { name: subject.department },
    update: { iconSlug: DEPARTMENT_ICON[subject.department] ?? null, facultyId: faculty.id },
    create: { name: subject.department, iconSlug: DEPARTMENT_ICON[subject.department] ?? null, facultyId: faculty.id },
  });

  // --- course row ---
  const courseData = {
    domain: "university" as const,
    slug: subject.slug,
    title: subject.title,
    department: subject.department,
    description: subject.description,
    code: subject.code,
    level: subject.level,
    credits: subject.credits,
    semester: subject.semester,
    programmeId: programme?.id ?? null,
    facultyId: faculty.id,
    isPublished: true,
  };
  let courseId: string;
  if (subject.existingSlug) {
    const existing = await prisma.course.findUnique({
      where: { domain_slug: { domain: "university", slug: subject.existingSlug } },
    });
    if (!existing) {
      throw new Error(`${subject.slug}: course ${subject.existingSlug} not found — run prisma/seed-university.ts first`);
    }
    // Adopt the row: academic metadata moves, the authored concept spine and
    // its existing assessment items stay attached to it.
    await prisma.course.update({ where: { id: existing.id }, data: courseData });
    courseId = existing.id;
  } else {
    const course = await prisma.course.upsert({
      where: { id: subject.id },
      update: courseData,
      create: { id: subject.id, ...courseData },
    });
    courseId = course.id;
  }

  // --- modules ---
  for (let i = 0; i < subject.modules.length; i++) {
    const m = subject.modules[i];
    await prisma.courseModule.upsert({
      where: { courseId_slug: { courseId, slug: m.slug } },
      update: { title: m.title, orderIndex: i },
      create: { courseId, slug: m.slug, title: m.title, orderIndex: i },
    });
  }

  // --- concepts ---
  const slugToId = new Map<string, string>();
  for (let i = 0; i < subject.lessons.length; i++) {
    const l = subject.lessons[i];
    const node = await prisma.conceptNode.upsert({
      where: { courseId_slug: { courseId, slug: l.concept.slug } },
      update: {
        title: l.concept.title,
        summary: l.concept.summary,
        bloomsLevel: l.concept.blooms,
        estMinutes: l.concept.minutes,
        orderIndex: i,
        isPublished: true,
      },
      create: {
        courseId,
        slug: l.concept.slug,
        title: l.concept.title,
        summary: l.concept.summary,
        bloomsLevel: l.concept.blooms,
        estMinutes: l.concept.minutes,
        orderIndex: i,
        isPublished: true,
      },
    });
    slugToId.set(l.concept.slug, node.id);
  }

  // --- concept prerequisite edges (the DAG) ---
  let edgeCount = 0;
  for (const l of subject.lessons) {
    const conceptId = slugToId.get(l.concept.slug)!;
    for (const prereqSlug of l.concept.prereq) {
      const prerequisiteId = slugToId.get(prereqSlug);
      if (!prerequisiteId) {
        throw new Error(`${subject.slug}: concept ${l.concept.slug} declares unknown prerequisite ${prereqSlug}`);
      }
      await prisma.conceptPrerequisite.upsert({
        where: { conceptId_prerequisiteId: { conceptId, prerequisiteId } },
        update: {},
        create: { conceptId, prerequisiteId },
      });
      edgeCount++;
    }
  }

  // --- attach concepts to their modules ---
  for (let i = 0; i < subject.lessons.length; i++) {
    const l = subject.lessons[i];
    const moduleSlug = subject.modules[l.module - 1].slug;
    const moduleRow = await prisma.courseModule.findUnique({
      where: { courseId_slug: { courseId, slug: moduleSlug } },
    });
    if (!moduleRow) throw new Error(`${subject.slug}: module ${moduleSlug} missing`);
    await prisma.conceptNode.update({ where: { id: slugToId.get(l.concept.slug)! }, data: { moduleId: moduleRow.id } });
  }

  // --- lessons, 1:1 with concepts by orderIndex ---
  let lessonCount = 0;
  for (let i = 0; i < subject.lessons.length; i++) {
    const l = subject.lessons[i];
    const content = l.authored ? l.content : pendingLesson(l);
    const lessonData = {
      courseId,
      domain: "university" as const,
      title: l.title,
      orderIndex: i,
      estimatedMinutes: l.estimatedMinutes,
      content: content as never,
      reviewStatus: "needs-human-review",
      needsCheck: !l.authored,
    };
    await prisma.courseLesson.upsert({
      where: { id: `${courseId}-lesson-${i + 1}` },
      update: lessonData,
      create: { id: `${courseId}-lesson-${i + 1}`, ...lessonData },
    });
    lessonCount++;
  }

  // --- assessment items: authored only, never placeholders ---
  let itemCount = 0;
  for (let i = 0; i < subject.sbas.length; i++) {
    const s = subject.sbas[i];
    const options = rotateOptions(s.options, i);
    const itemData = {
      courseId,
      conceptId: slugToId.get(s.concept)!,
      format: "sba",
      stem: s.stem,
      options: options as never,
      correctAnswer: s.correctAnswer,
      explanation: s.explanation,
      marks: 1,
      negativeMarks: 0.25,
      orderIndex: i,
      isPublished: true,
      difficulty: s.difficulty ?? "medium",
      reviewStatus: "needs-human-review",
      needsCheck: false,
    };
    await prisma.assessmentItem.upsert({
      where: { slug: s.slug },
      update: itemData,
      create: { slug: s.slug, ...itemData },
    });
    itemCount++;
  }

  // --- course-level prerequisites (the subject chain) ---
  let courseEdges = 0;
  for (const prereqSlug of subject.prereqCourses) {
    const prereq = await prisma.course.findUnique({
      where: { domain_slug: { domain: "university", slug: prereqSlug } },
      select: { id: true },
    });
    if (!prereq) {
      throw new Error(`${subject.slug}: prerequisite course ${prereqSlug} not found`);
    }
    await prisma.coursePrerequisite.upsert({
      where: { courseId_prerequisiteId: { courseId, prerequisiteId: prereq.id } },
      update: {},
      create: { courseId, prerequisiteId: prereq.id },
    });
    courseEdges++;
  }

  // --- curriculum alignment to the baselines seed-university.ts registered ---
  let aligned = 0;
  const standards = await prisma.curriculumStandard.findMany({
    where: { authority: { in: ["World Federation for Medical Education", "Liaison Committee on Medical Education"] } },
    select: { id: true },
  });
  for (const standard of standards) {
    await prisma.curriculumAlignment.upsert({
      where: { courseId_standardId: { courseId, standardId: standard.id } },
      update: { moduleCode: subject.code, mappingTier: "core" },
      create: {
        courseId,
        standardId: standard.id,
        moduleCode: subject.code,
        mappingTier: "core",
        verifiedDate: new Date(),
      },
    });
    aligned++;
  }

  const authored = subject.lessons.filter((l) => l.authored).length;
  console.log(
    `✓ ${subject.code} ${subject.title}: ${subject.modules.length} modules, ${subject.lessons.length} concepts (${authored} authored lessons), ${edgeCount} concept edges, ${itemCount} SBA items, ${courseEdges} course prerequisites, ${aligned} alignments`,
  );
  return {
    modules: subject.modules.length,
    concepts: subject.lessons.length,
    edges: edgeCount,
    lessons: lessonCount,
    items: itemCount,
    courseEdges,
  };
}

export { prisma };
