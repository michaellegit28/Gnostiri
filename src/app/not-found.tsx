import Link from "next/link";

/**
 * Root not-found boundary — branded 404 with real doorways (no dead ends).
 * Links mirror the three study domains.
 */
export default function NotFound() {
  const doorways = [
    { href: "/highschool", title: "High School", note: "Read, then past papers" },
    { href: "/university", title: "University", note: "One degree, studied in order" },
    { href: "/discovery", title: "Discovery", note: "Past the syllabus" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">
          404 — page not found
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold md:text-5xl">
          That page isn&apos;t here.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          This page doesn&apos;t exist, or it moved. Pick a doorway below.
        </p>
        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {doorways.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="gn-motion gn-lift gn-shadow group rounded-2xl border border-line bg-surface p-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="block font-serif text-lg font-bold text-slate-100 transition-colors group-hover:text-electric-text">
                {door.title}
              </span>
              <span className="mt-1 block text-sm text-muted">
                {door.note}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
