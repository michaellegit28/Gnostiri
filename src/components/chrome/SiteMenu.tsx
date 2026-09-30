"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * SiteMenu — one navigation for the whole app. Hamburger opens a calm
 * fullscreen overlay; every link is a real destination (no dead ends).
 */
const GROUPS: { label: string; links: { href: string; title: string; note: string }[] }[] = [
  {
    label: "Three ways of learning",
    links: [
      { href: "/highschool", title: "Global School", note: "Every country's examinations" },
      { href: "/university", title: "University", note: "Courses, depth, certificates" },
      { href: "/extras", title: "Discovery", note: "Follow curiosity past the syllabus" },
    ],
  },
  {
    label: "Your journey",
    links: [
      { href: "/battle-plan", title: "Battle Plan", note: "Your day-by-day mission" },
      { href: "/progress", title: "My Progress", note: "Streaks, accuracy, history" },
      { href: "/tutor", title: "AI Tutor", note: "A guide, not an oracle" },
      { href: "/pricing", title: "Premium", note: "Unlock everything" },
    ],
  },
];

export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 right-4 z-[70] flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-white/15 bg-slate-950/80 backdrop-blur-md text-slate-200 hover:border-[#D4AF37]/60 hover:text-white transition-colors"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#070b16]/97 backdrop-blur-lg">
          <nav className="mx-auto max-w-2xl px-6 pt-24 pb-16 space-y-10" aria-label="Site">
            {GROUPS.map((group, gi) => (
              <div
                key={group.label}
                className="space-y-3 animate-[menu-rise_0.5s_ease-out_both]"
                style={{ animationDelay: `${gi * 90}ms` }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                  {group.label}
                </p>
                <ul className="divide-y divide-white/5 border-y border-white/5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between gap-4 py-4"
                      >
                        <span>
                          <span className="block font-serif text-2xl font-bold text-slate-100 group-hover:text-[#D4AF37] transition-colors">
                            {link.title}
                          </span>
                          <span className="mt-0.5 block text-sm text-slate-500">
                            {link.note}
                          </span>
                        </span>
                        <span className="text-slate-600 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all text-xl">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              href="/login"
              className="flex min-h-[52px] items-center justify-center rounded-xl bg-[#D4AF37] px-6 font-semibold text-slate-950 hover:bg-[#c3a030] transition-colors"
            >
              Enter Gnostiri
            </Link>
          </nav>
          <style>{`@keyframes menu-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </>
  );
}
