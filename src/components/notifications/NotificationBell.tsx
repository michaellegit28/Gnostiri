"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";

interface BellNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  emailed: boolean;
  createdAt: string;
}

type BellStatus = "loading" | "ready" | "anonymous";

const POLL_MS = 60_000;
const PANEL_LIMIT = 10;

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * NotificationBell — unread count + latest 10, polled every 60s.
 * Self-positioned beside the site-menu hamburger (fixed, top-right) so the
 * mount point stays a zero-prop default export. Hidden for signed-out
 * visitors (the API answers 401 for anonymous callers).
 */
export default function NotificationBell() {
  const [status, setStatus] = useState<BellStatus>("loading");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<BellNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications?limit=${PANEL_LIMIT}`, { cache: "no-store" });
      if (res.status === 401) {
        setStatus("anonymous");
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as { notifications: BellNotification[]; unreadCount: number };
      setItems(data.notifications ?? []);
      setUnread(data.unreadCount ?? 0);
      setStatus("ready");
    } catch {
      // A dropped poll must never blank the bell — the last good state stays.
    }
  }, []);

  useEffect(() => {
    if (status === "anonymous") return;
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load, status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const markAllRead = async () => {
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    } catch {
      // Optimistic paint; the next poll reconciles with the server.
    }
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  if (status === "anonymous") return null;

  return (
    <div ref={rootRef} className="fixed top-6 right-[4.5rem] z-[70]">
      <button
        type="button"
        aria-label={unread > 0 ? `Notifications — ${unread} unread` : "Notifications"}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-slate-200 backdrop-blur-md transition-all hover:border-gold/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-slate-950">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[3.25rem] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-lg">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-300 transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-400">
              Nothing yet. We&apos;ll nudge you when a cup starts or a streak needs a freeze.
            </p>
          ) : (
            <ul className="max-h-[22rem] divide-y divide-white/5 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href ?? "/notifications"}
                    onClick={() => !n.read && markRead(n.id)}
                    className={`block px-4 py-3 transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      n.read ? "" : "bg-gold/5"
                    }`}
                  >
                    <span className="flex items-start gap-2">
                      {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-100">{n.title}</span>
                        <span className="mt-0.5 block line-clamp-2 text-xs text-slate-400">{n.body}</span>
                        <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          {relativeTime(n.createdAt)}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/notifications"
            className="flex min-h-[44px] items-center justify-center border-t border-white/10 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:bg-white/5 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            All notifications
          </Link>
        </div>
      )}
    </div>
  );
}
