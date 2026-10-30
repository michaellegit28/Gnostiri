import Link from "next/link";
import { Library, ShieldCheck, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/server-auth";
import prisma from "@/lib/db";
import ArtifactCard, { type ArtifactCardData } from "@/components/library/ArtifactCard";

export const dynamic = "force-dynamic";

/**
 * /library — the Public Library (ROADMAP.md Phase 4).
 *
 * Browse processed study artifacts other students chose to share. The library
 * only ever holds what the Desk pipeline produced: notes + quiz items derived
 * from a PDF's text — never the source file itself. Adopting an artifact puts
 * the same processed content on your desk and rewards its uploader with badges
 * and Prime-day credits. Server-rendered straight from Prisma, like /desk.
 */

const TAKE_CAP = 24;
const DEFAULT_TAKE = 12;

function uploaderName(name: string | null | undefined): string {
  if (!name || !name.trim()) return "A Gnostiri student";
  const first = name.trim().split(/\s+/)[0];
  return first || "A Gnostiri student";
}

/** First heading block of each notes section, up to `limit` — headings only. */
function notesPreviewOf(notes: unknown, limit = 3): string[] {
  if (!Array.isArray(notes)) return [];
  const headings: string[] = [];
  for (const section of notes) {
    const blocks = (section as { blocks?: unknown }).blocks;
    if (!Array.isArray(blocks)) continue;
    const heading = blocks.find(
      (block): block is { text: string } =>
        (block as { type?: unknown })?.type === "heading" && typeof (block as { text?: unknown }).text === "string",
    );
    if (heading) {
      const text = heading.text.trim();
      if (text) headings.push(text);
      if (headings.length >= limit) break;
    }
  }
  return headings;
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: { q?: string; subject?: string; skip?: string; take?: string };
}) {
  const user = await getCurrentUser();

  const q = (searchParams?.q ?? "").trim();
  const subject = (searchParams?.subject ?? "").trim();
  const parsedTake = Number.parseInt(searchParams?.take ?? "", 10);
  const parsedSkip = Number.parseInt(searchParams?.skip ?? "", 10);
  const take = Number.isFinite(parsedTake) ? Math.min(Math.max(parsedTake, 1), TAKE_CAP) : DEFAULT_TAKE;
  const skip = Number.isFinite(parsedSkip) ? Math.max(parsedSkip, 0) : 0;

  const where = {
    visibility: "public",
    status: "ready",
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    ...(subject ? { subjectSlug: subject } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.studyDocument.findMany({
      where,
      orderBy: [{ reuseCount: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        subjectSlug: true,
        pageCount: true,
        reuseCount: true,
        notes: true,
        user: { select: { name: true } },
        _count: { select: { quizItems: true } },
      },
      skip,
      take,
    }),
    prisma.studyDocument.count({ where }),
  ]);

  const artifacts: ArtifactCardData[] = rows.map((doc) => ({
    id: doc.id,
    title: doc.title,
    subjectSlug: doc.subjectSlug,
    pageCount: doc.pageCount,
    quizItemCount: doc._count.quizItems,
    reuseCount: doc.reuseCount,
    uploader: uploaderName(doc.user?.name),
    notesPreview: notesPreviewOf(doc.notes),
  }));

  const hasNext = skip + artifacts.length < total;
  const nextQuery = new URLSearchParams();
  if (q) nextQuery.set("q", q);
  if (subject) nextQuery.set("subject", subject);
  nextQuery.set("skip", String(skip + take));
  nextQuery.set("take", String(take));
  const prevQuery = new URLSearchParams(nextQuery);
  prevQuery.set("skip", String(Math.max(0, skip - take)));

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
            <Library className="h-4 w-4" /> Public Library
          </p>
          <h1 className="font-serif text-3xl font-bold md:text-5xl">Study what your cohort studied</h1>
          <p className="max-w-2xl text-slate-400">
            Machine-verified notes and quiz items other students processed from their textbooks, shared as artifacts.
            Adopt one and the same processed content lands on your desk — no re-upload, no re-reading.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-amber-100">
              <p className="mb-1 inline-flex items-center gap-1.5 font-semibold text-gold">
                <Trophy className="h-4 w-4" /> Dual rewards for sharers
              </p>
              <p className="text-slate-300">
                When classmates adopt your shared artifact you earn a <span className="text-gold">badge</span> (first share, first
                adoption, every tenth reuse) and <span className="text-gold">+25 Prime-day credits</span> for publishing,{" "}
                <span className="text-gold">+10</span> per adoption.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
              <p className="mb-1 inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                <ShieldCheck className="h-4 w-4" /> We never share source files
              </p>
              <p className="text-slate-400">
                The source PDF is never stored — not on your desk, not here. Only the processed notes and quiz items exist to share,
                and they carry no personal data.
              </p>
            </div>
          </div>
        </header>

        <form method="get" className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by title…"
            className="min-w-[12rem] flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-gold/50 focus:outline-none"
          />
          <input
            name="subject"
            defaultValue={subject}
            placeholder="Subject slug (e.g. biology)"
            className="min-w-[10rem] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-gold/50 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300"
          >
            Search
          </button>
          {(q || subject) && (
            <Link href="/library" className="text-sm text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline">
              Clear
            </Link>
          )}
        </form>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Shared artifacts</h2>
            <p className="text-xs text-slate-500">
              {total} available{total === 1 ? "" : ""} · most-reused first
            </p>
          </div>
          {artifacts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
              {q || subject ? "No shared artifact matches that search." : "Nothing shared yet — process a document on your desk, then share it."}
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {artifacts.map((doc) => (
                <ArtifactCard key={doc.id} doc={doc} signedIn={!!user} />
              ))}
            </ul>
          )}
          {(skip > 0 || hasNext) && (
            <div className="flex items-center justify-between pt-2">
              {skip > 0 ? (
                <Link href={`/library?${prevQuery.toString()}`} className="text-sm text-gold hover:underline">
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              {hasNext && (
                <Link href={`/library?${nextQuery.toString()}`} className="text-sm text-gold hover:underline">
                  Next →
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
