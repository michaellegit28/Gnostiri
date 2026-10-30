import Link from "next/link";
import prisma from "@/lib/db";
import { ArrowRight, FileText, Library, Sparkles } from "lucide-react";

interface LibraryDoc {
  id: string;
  title: string;
  subjectSlug: string | null;
  pageCount: number;
  reuseCount: number;
  createdAt: Date;
  notes: unknown;
  uploader: string;
  quizItemCount: number;
}

function uploaderName(name: string | null | undefined): string {
  if (!name || !name.trim()) return "A Gnostiri student";
  const first = name.trim().split(/\s+/)[0];
  return first || "A Gnostiri student";
}

function headingsOf(section: unknown): string | null {
  const blocks = (section as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return null;
  for (const block of blocks) {
    const type = (block as { type?: unknown }).type;
    const text = (block as { text?: unknown }).text;
    if (type === "heading" && typeof text === "string" && text.trim()) {
      return text.trim();
    }
  }
  return null;
}

function previewHeadings(notes: unknown, limit = 3): string[] {
  if (!Array.isArray(notes)) return [];
  const out: string[] = [];
  for (const section of notes) {
    const heading = headingsOf(section);
    if (heading) {
      out.push(heading);
      if (out.length >= limit) break;
    }
  }
  return out;
}

async function loadLibrary(): Promise<LibraryDoc[] | null> {
  try {
    const rows = await prisma.studyDocument.findMany({
      where: { visibility: "public", status: "ready" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subjectSlug: true,
        pageCount: true,
        reuseCount: true,
        createdAt: true,
        notes: true,
        user: { select: { name: true } },
        _count: { select: { quizItems: true } },
      },
      take: 3,
    });
    return rows.map((doc) => ({
      id: doc.id,
      title: doc.title,
      subjectSlug: doc.subjectSlug,
      pageCount: doc.pageCount,
      reuseCount: doc.reuseCount,
      createdAt: doc.createdAt,
      notes: doc.notes,
      uploader: uploaderName(doc.user?.name),
      quizItemCount: doc._count.quizItems,
    }));
  } catch {
    return null;
  }
}

function relativeDay(date: Date): string {
  const days = Math.round((date.getTime() - Date.now()) / 86400000);
  const abs = Math.abs(days);
  if (abs === 0) return "today";
  if (abs === 1) return days < 0 ? "yesterday" : "tomorrow";
  const unit = abs < 30 ? `${abs} days` : `${Math.round(abs / 30)} months`;
  return days < 0 ? `${unit} ago` : `in ${unit}`;
}

export default async function LibraryStrip() {
  const docs = await loadLibrary();

  return (
    <section aria-label="Public library" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            <Library className="h-5 w-5 text-gold" aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Public library
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-100">
              Shared by students, verified by the desk
            </h2>
          </div>
        </div>
        <Link
          href="/library"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-gold/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Browse the library
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {!docs || docs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center backdrop-blur">
          <Sparkles className="mx-auto h-8 w-8 text-gold" aria-hidden />
          <p className="mt-3 text-sm text-slate-300">
            The library is waiting for its first shared notes — yours could be first.
          </p>
          <Link
            href="/desk"
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Share yours from the desk
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {docs.map((doc) => {
            const headings = previewHeadings(doc.notes);
            return (
              <li key={doc.id}>
                <Link
                  href="/library"
                  className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur transition-colors hover:border-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      <FileText className="h-4 w-4 text-gold" aria-hidden />
                      {doc.subjectSlug ?? "General"}
                    </div>
                    <h3 className="font-serif text-lg font-bold leading-snug text-slate-100">
                      {doc.title}
                    </h3>
                    <ul className="space-y-1 text-sm text-slate-400">
                      {headings.map((heading) => (
                        <li key={heading} className="truncate">
                          • {heading}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="border-t border-white/10 pt-3 text-xs text-slate-500">
                    {doc.pageCount} pages · {doc.quizItemCount} practice items · shared by{" "}
                    {doc.uploader} {relativeDay(doc.createdAt)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
