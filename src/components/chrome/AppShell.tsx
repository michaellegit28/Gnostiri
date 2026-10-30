"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Crown, Menu, X } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import PrimeBadge from "@/components/chrome/PrimeBadge";
import { BOTTOM_TABS, NAV_ZONES, isActive, type NavItem } from "./nav-model";

/**
 * AppShell — one chrome for every device.
 *
 *   Mobile  (<768px):  top bar + bottom tab bar; the hamburger opens a zone drawer
 *   Tablet  (768–1023): collapsible sidebar, opened from the top bar
 *   Desktop (>=1024px): persistent sidebar; the content gets the remaining width
 *
 * Everything renders from nav-model.ts, the drawer/bottom-bar/sidebar/palette
 * can never drift apart, and the AI Tutor FAB, bell and Prime crown each live
 * in exactly one place. Keyboard users get a skip link first in the DOM.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [drawer, setDrawer] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [palette, setPalette] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Close overlays on navigation.
  useEffect(() => {
    setDrawer(false);
    setPalette(false);
  }, [pathname]);

  // Escape closes; Cmd/Ctrl+K opens the palette (desktop power-user nav).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        setPalette(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Appearance prefs (solid background / reduced motion) are device-local —
  // reapply the stored choice on every mount so the first paint is right.
  useEffect(() => {
    const root = document.documentElement;
    if (localStorage.getItem("gnostiri.solid-bg") === "true") root.classList.add("solid-bg");
    if (localStorage.getItem("gnostiri.reduce-motion") === "true") root.classList.add("reduce-motion");
  }, []);

  // The top bar hides on scroll-down and returns on scroll-up (never while an overlay is open).
  useEffect(() => {
    if (drawer || palette) return;
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 160 && y > lastY);
        lastY = y;
        ticking = false;
      });
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll);
      setHidden(false);
    };
  }, [drawer, palette]);

  const allItems = NAV_ZONES.flatMap((z) => z.items);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-950"
      >
        Skip to content
      </a>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 border-b border-white/10 bg-[#070b16]/90 px-3 backdrop-blur-md transition-transform duration-300 md:h-15 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={drawer || sidebar}
          onClick={() => (window.innerWidth >= 1024 ? setSidebar((v) => !v) : setDrawer(true))}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-200 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <Link href="/" className="flex items-center gap-2 rounded-lg px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          <span className="font-serif text-lg font-bold tracking-tight text-slate-100">
            Gnostiri
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Search navigation (Command K)"
            onClick={() => setPalette(true)}
            className="hidden min-h-[44px] items-center gap-2 rounded-lg border border-white/10 px-3 text-xs text-slate-400 hover:border-gold/50 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:flex"
          >
            <Command className="h-3.5 w-3.5" aria-hidden />
            Jump to…
          </button>
          <div className="[&_button]:min-h-[44px]">
            <NotificationBell />
          </div>
          <PrimeBadge />
        </div>
      </header>

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <nav
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-40 hidden w-64 transform border-r border-white/10 bg-[#070b16]/97 pt-14 backdrop-blur-lg transition-transform duration-300 lg:block ${
          sidebar ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="h-full overflow-y-auto px-4 py-6">
          {NAV_ZONES.map((zone) => (
            <div key={zone.id} className="mb-7">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">{zone.label}</p>
              <ul className="space-y-0.5">
                {zone.items.map((item) => (
                  <li key={item.href}>
                    <SidebarLink item={item} pathname={pathname} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      {drawer && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#070b16]/97 backdrop-blur-lg lg:hidden">
          <div className="flex h-14 items-center justify-between px-3">
            <span className="font-serif text-lg font-bold text-slate-100">Gnostiri</span>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawer(false)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-200 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Primary" className="px-5 pb-16 pt-4">
            {NAV_ZONES.map((zone) => (
              <div key={zone.id} className="mb-7">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">{zone.label}</p>
                <ul className="divide-y divide-white/5 border-y border-white/5">
                  {zone.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="group flex min-h-[52px] items-center gap-3 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          <Icon className={`h-5 w-5 ${active ? "text-gold" : "text-slate-500 group-hover:text-gold"}`} aria-hidden />
                          <span>
                            <span className={`block font-serif text-lg font-bold ${active ? "text-gold" : "text-slate-100 group-hover:text-gold"}`}>
                              {item.label}
                            </span>
                            <span className="block text-xs text-slate-400">{item.note}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <Link
              href="/profile"
              className="flex min-h-[48px] items-center justify-center rounded-xl border border-white/15 text-sm font-semibold text-slate-200 hover:border-gold/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Profile & settings
            </Link>
          </nav>
        </div>
      )}

      {/* ── Command palette ─────────────────────────────────────────────── */}
      {palette && (
        <div className="fixed inset-0 z-[80] bg-[#070b16]/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Jump to">
          <div className="mx-auto mt-24 w-[min(92vw,32rem)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl">
            <p className="border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-gold">Jump to</p>
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {allItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-[44px] items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <Icon className="h-4 w-4 text-slate-500" aria-hidden />
                      {item.label}
                      <span className="ml-auto text-xs text-slate-500">{item.note}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="pt-14 lg:pl-64">
        <main id="main" className="min-h-[calc(100vh-3.5rem)] pb-24 lg:pb-10">
          {children}
        </main>
        <footer className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pb-28 pt-4 lg:pb-6">
          <p className="text-xs text-slate-500">Gnostiri — built for the December launch.</p>
          <Link href="/settings" className="rounded text-xs text-slate-500 underline-offset-2 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            Appearance & accessibility
          </Link>
        </footer>
      </div>

      {/* ── Mobile bottom tabs ──────────────────────────────────────────── */}
      <nav
        aria-label="Primary tabs"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070b16]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="flex">
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 pt-1 text-[10px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold ${
                    active ? "text-gold" : "text-slate-400"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function SidebarLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[44px] items-center gap-3 rounded-lg px-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        active ? "bg-gold/10 text-gold" : "text-slate-300 hover:bg-white/5 hover:text-gold"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="font-semibold">{item.label}</span>
    </Link>
  );
}
