"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NotificationBell from "@/components/notifications/NotificationBell";
import PrimeBadge from "@/components/chrome/PrimeBadge";
import { usePathname } from "next/navigation";

/**
 * SiteMenu — one navigation for the whole app. Hamburger opens a calm
 * fullscreen overlay; every link is a real destination (no dead ends).
 */
const GROUPS: { label: string; links: { href: string; title: string; note: string; badge?: string }[] }[] = [
  {
    label: "Study",
    links: [
      { href: "/highschool", title: "High School", note: "Textbooks and exam banks" },
      { href: "/university", title: "University", note: "Degree-depth courses and faculties" },
      { href: "/discovery", title: "Discovery", note: "Follow curiosity past the syllabus" },
    ],
  },
  {
    label: "Your workspace",
    links: [
      { href: "/desk", title: "Desk", note: "Your uploads, notes and plans", badge: "Soon" },
      { href: "/tutor", title: "AI Tutor", note: "A guide, not an oracle" },
      { href: "/battle-plan", title: "Battle Plan", note: "Your day-by-day mission" },
      { href: "/progress", title: "My Progress", note: "Streaks, accuracy, history" },
    ],
  },
  {
    label: "Compete & share",
    links: [
      { href: "/league", title: "Merit League", note: "Cups, brackets and seasons" },
      { href: "/library", title: "Public Library", note: "Shared notes and quizzes", badge: "Soon" },
    ],
  },
  {
    label: "Membership",
    links: [
      { href: "/pricing", title: "Gnostiri Prime", note: "Unlock everything" },
      { href: "/university/revision", title: "Revision Queue", note: "Concepts due for review" },
    ],
  },
];

export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
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

  // Hide on scroll-down, reveal on scroll-up (never hides while open).
  // The 48px hit area is preserved for touch targets; only the icon shrinks.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 160 && y > lastY && !open);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open ]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`fixed top-6 right-4 z-[70] flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-white/15 bg-slate-950/80 backdrop-blur-md text-slate-200 hover:border-gold/60 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${hidden && !open ? "-translate-y-28 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#070b16]/97 backdrop-blur-lg">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-6 pt-20 pb-2">
            <NotificationBell />
            <PrimeBadge />
          </div>
          <nav className="mx-auto max-w-2xl px-6 pt-4 pb-16 space-y-10" aria-label="Site">
            {GROUPS.map((group, gi) => (
              <div
                key={group.label}
                className="space-y-3 animate-[menu-rise_0.5s_ease-out_both]"
                style={{ animationDelay: `${gi * 90}ms` }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                  {group.label}
                </p>
                <ul className="divide-y divide-white/5 border-y border-white/5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-disabled={link.badge ? true : undefined}
                        className="group flex items-center justify-between gap-4 rounded-lg py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <span>
                          <span className="block font-serif text-2xl font-bold text-slate-100 group-hover:text-gold transition-colors">
                            {link.title}
                            {link.badge && (
                              <span className="ml-3 inline-block rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 align-middle font-sans text-xs font-semibold text-amber-300">
                                {link.badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-sm text-slate-400">
                            {link.note}
                          </span>
                        </span>
                        <span className="text-slate-600 group-hover:text-gold group-hover:translate-x-1 transition-all text-xl">
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
              className="flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-6 font-semibold text-slate-950 hover:bg-gold-hover transition-colors"
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
