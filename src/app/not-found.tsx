import Link from "next/link";

/**
 * Root not-found boundary — branded 404 with real doorways (no dead ends).
 * Links mirror SiteMenu's three ways of learning.
 */
export default function NotFound() {
  const doorways = [
    { href: "/highschool", title: "High School", note: "Textbooks and exam banks" },
    { href: "/university", title: "University", note: "Degree-depth courses" },
    { href: "/discovery", title: "Discovery", note: "Follow curiosity" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Off the map — 404
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold md:text-5xl">
          Curiosity brought you somewhere quiet.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
          This page doesn&apos;t exist or moved. Pick a doorway below — your
          progress follows you everywhere.
        </p>
        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {doorways.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all hover:-translate-y-0.5 hover:border-gold/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span className="block font-serif text-lg font-bold text-slate-100 group-hover:text-gold">
                {door.title}
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                {door.note}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-gold px-8 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
