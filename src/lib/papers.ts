import prisma from "@/lib/db";

// Exam paper URL helpers. Papers are addressed by derived, human-readable
// slugs (subject + year + paper number) instead of exposing database ids,
// and all pages resolve them through this module so the rule lives in one place.

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function subjectSlugOf(subject: string): string {
  return slugify(subject);
}

export function paperSlugOf(year: number, paperNumber: string): string {
  return `${year}-${slugify(paperNumber)}`;
}

export function paperUrl(examSlug: string, subject: string, year: number, paperNumber: string): string {
  return `/highschool/exams/${examSlug.toLowerCase()}/${subjectSlugOf(subject)}/${paperSlugOf(year, paperNumber)}`;
}

interface ResolvedPaper {
  examination: { id: string; name: string; slug: string; code: string; country: string | null };
  paper: {
    id: string;
    subject: string;
    year: number;
    paperNumber: string;
    durationMinutes: number;
    totalMarks: number;
    markingSchemeUrl: string | null;
  };
}

// Resolve /highschool/exams/[exam]/[subject]/[paper] params to a published
// paper. Exam slug comes from Examination.slug; subject and paper slugs are
// derived from paper data, so no extra columns or lookups are needed.
export async function resolvePaper(
  examSlugParam: string,
  subjectSlugParam: string,
  paperSlugParam: string
): Promise<ResolvedPaper | null> {
  const examination = await prisma.examination.findFirst({
    where: {
      domain: "highschool",
      slug: { equals: examSlugParam.toLowerCase(), mode: "insensitive" },
    },
  });
  if (!examination) return null;

  const subjectSlugWanted = subjectSlugParam.toLowerCase();
  const paperSlugWanted = paperSlugParam.toLowerCase();

  const papers = await prisma.examPaper.findMany({
    where: { examinationId: examination.id, isPublished: true },
    orderBy: [{ subject: "asc" }, { year: "desc" }, { paperNumber: "asc" }],
  });
  const paper = papers.find(
    (p) =>
      subjectSlugOf(p.subject) === subjectSlugWanted &&
      paperSlugOf(p.year, p.paperNumber) === paperSlugWanted
  );
  if (!paper) return null;

  return { examination, paper };
}
