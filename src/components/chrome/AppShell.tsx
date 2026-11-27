"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Crown, Menu, Settings as SettingsIcon, X } from "lucide-react";
import AccretionEmblem from "@/components/brand/AccretionEmblem";
import useDialogFocus from "@/components/ui/useDialogFocus";
import LaneSwitch from "@/components/chrome/LaneSwitch";
import FeatureTour from "@/components/onboarding/FeatureTour";
import {
  NAV_LABEL,
  TAB_BAR_LABEL,
  bottomTabsForDomain,
  isActive,
  navZonesForDomain,
  type NavItem,
} from "./nav-model";
import { useDomain } from "@/context/DomainContext";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_LEARNING_DOMAIN, domainLabel, learningDomainFromPathname } from "@/lib/learning-domain";
import { trackAnalyticsEvent } from "@/lib/analytics-client";

/**
 * AppShell — navigation lives exclusively in a top-left menu; there is no top
 * header. The menu is a minimalist, content-height popover (it never fills the
 * screen): the lane switch on top, the active lane's links, the shared layer
 * (incl. Notifications), and a footer with Gnostiri Prime and Settings pinned
 * to the bottom. Mobile keeps the bottom tab bar and opens the same menu.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const { learningDomain } = useDomain();
  const { user } = useAuth();
  const pathLearningDomain = learningDomainFromPathname(pathname);
  const activeDomain = pathLearningDomain ?? learningDomain ?? DEFAULT_LEARNING_DOMAIN;
  const navZones = navZonesForDomain(activeDomain);
  const bottomTabs = bottomTabsForDomain(activeDomain);
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const paletteRef = useDialogFocus<HTMLDivElement>(palette);
  const menuRef = useDialogFocus<HTMLDivElement>(menu);
  const firstPath = useRef(pathname);

  useEffect(() => {
    setMenu(false);
    setPalette(false);
    if (firstPath.current !== pathname) {
      firstPath.current = pathname;
      window.requestAnimationFrame(() => document.getElementById("main")?.focus());
    }
  }, [pathname]);

  // Escape closes; Cmd/Ctrl+K opens the palette (desktop power-user nav).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setPalette(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!palette) setMenu(false);
        setPalette(!palette);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [palette]);

  // Appearance prefs (solid background / reduced motion) are device-local —
  // reapply the stored choice on every mount so the first paint is right.
  useEffect(() => {
    const root = document.documentElement;
    if (localStorage.getItem("gnostiri.solid-bg") === "true") root.classList.add("solid-bg");
    if (localStorage.getItem("gnostiri.reduce-motion") === "true") root.classList.add("reduce-motion");
  }, []);

  useEffect(() => {
    void trackAnalyticsEvent("session_start", { source: "app" });
  }, []);

  const paletteItems = navZones
    .flatMap((z) => z.items)
    .filter((item, index, items) => items.findIndex((c) => c.href === item.href) === index);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-on"
      >
        Skip to content
      </a>

      {/* ── Top-left menu button (no top header) ─────────────────────────── */}
      <button
        type="button"
        aria-label="Open menu"
        aria-controls="app-menu"
        aria-expanded={menu}
        onClick={() => {
          setPalette(false);
          setMenu(true);
        }}
        className="gn-glass fixed left-3 top-3 z-[70] flex h-11 w-11 items-center justify-center rounded-xl border border-line text-slate-200 hover:text-electric-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {/* ── Minimalist menu popover (content-height, never full screen) ───── */}
      {menu && (
        <div
          ref={menuRef}
          id="app-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Primary navigation"
          tabIndex={-1}
          className="gn-glass fixed left-3 top-3 z-[80] flex max-h-[calc(100vh-1.5rem)] w-72 flex-col overflow-y-auto rounded-2xl border border-line p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AccretionEmblem size={22} />
              <span className="font-serif text-lg font-bold tracking-tight text-ink">Gnostiri</span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenu(false)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-200 hover:text-electric-text focus:outline-none"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setMenu(false);
              setPalette(true);
            }}
            className="mb-3 flex min-h-[44px] w-full items-center gap-2 rounded-lg border border-line bg-surface/50 px-3 text-sm font-semibold text-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Command className="h-4 w-4" aria-hidden />
            Jump to… <kbd className="ml-auto text-[10px] text-subtle">Ctrl K</kbd>
          </button>

          <nav aria-label={NAV_LABEL} className="flex-1">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{domainLabel(activeDomain)}</p>
            <LaneSwitch />
            {navZones.map((zone) => (
              <div key={zone.id} className="mb-5">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-electric-text">{zone.label}</p>
                <ul className="space-y-0.5">
                  {zone.items.map((item) => (
                    <li key={item.href}>
                      <MenuLink item={item} pathname={pathname} onNavigate={() => setMenu(false)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer — Prime + Settings pinned to the bottom of the menu. */}
          <div className="mt-2 space-y-0.5 border-t border-line pt-3">
            <Link
              href="/pricing"
              onClick={() => setMenu(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-lg border-l-2 border-transparent px-2 text-sm font-semibold text-slate-300 hover:bg-surface/10 hover:text-gold focus:outline-none"
            >
              <Crown className="h-4 w-4 text-gold" aria-hidden />
              Gnostiri Prime
            </Link>
            <Link
              href="/settings"
              onClick={() => setMenu(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-lg border-l-2 border-transparent px-2 text-sm font-semibold text-slate-300 hover:bg-surface/10 hover:text-primary focus:outline-none"
            >
              <SettingsIcon className="h-4 w-4" aria-hidden />
              Settings
            </Link>
          </div>
        </div>
      )}

      {/* ── Command palette ───────────────────────────────────────────────── */}
      {palette && (
        <div
          ref={paletteRef}
          id="command-palette"
          className="fixed inset-0 z-[80] bg-bg/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-palette-title"
          tabIndex={-1}
        >
          <div className="gn-glass mx-auto mt-24 w-[min(92vw,32rem)] overflow-hidden rounded-2xl border border-line shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/10 px-4 py-2">
              <h2 id="command-palette-title" className="text-[11px] uppercase tracking-[0.3em] text-electric-text">
                Jump to
              </h2>
              <button
                type="button"
                aria-label="Close command palette"
                onClick={() => setPalette(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-300 transition-colors hover:text-electric-text focus:outline-none"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {paletteItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="flex min-h-[44px] items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-surface/10 hover:text-primary focus:outline-none"
                    >
                      <Icon className="h-4 w-4 text-slate-400" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="pt-16">
        <main id="main" tabIndex={-1} className="min-h-[calc(100vh-4rem)] pb-28 lg:pb-10">
          {children}
        </main>
        <footer className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pb-28 pt-4 lg:pb-6">
          <p className="text-xs text-muted">Gnostiri</p>
          <Link href="/settings" className="rounded text-xs text-slate-400 underline-offset-2 hover:text-electric-text focus:outline-none">
            Appearance & accessibility
          </Link>
        </footer>
      </div>

      {/* ── Mobile bottom tabs ──────────────────────────────────────────── */}
      <nav
        aria-label={TAB_BAR_LABEL}
        className={`gn-glass fixed inset-x-0 bottom-0 z-50 border-t border-line pb-[env(safe-area-inset-bottom)] transition-transform duration-300 lg:hidden ${menu ? "translate-y-full" : "translate-y-0"}`}
      >
        <ul className="flex">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 pt-1 text-[10px] font-semibold focus:outline-none ${
                    active ? "text-primary" : "text-slate-400"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {tab.label}
                  {active && <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* The first-sign-in tour only mounts for signed-in students. */}
      {user ? <FeatureTour /> : null}
    </>
  );
}

function MenuLink({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate: () => void }) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[44px] items-center gap-3 rounded-lg border-l-2 px-2 text-sm transition-colors focus:outline-none ${
        active ? "border-primary/40 bg-primary/10 text-slate-100" : "border-transparent text-slate-300 hover:bg-surface/10 hover:text-primary"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="font-semibold">{item.label}</span>
    </Link>
  );
}