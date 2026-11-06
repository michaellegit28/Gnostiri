"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, CloudOff, RefreshCw } from "lucide-react";
import { flush, outstanding } from "@/lib/offline-queue";

type Phase = "idle" | "syncing" | "synced";

export default function SyncIndicator({ className }: { className?: string }) {
  const [online, setOnline] = useState(true);
  const [saved, setSaved] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const refresh = useCallback(async () => {
    const items = await outstanding();
    setSaved(items.length);
    return items.length;
  }, []);

  const sync = useCallback(async () => {
    setPhase("syncing");
    try {
      await flush();
      setPhase("synced");
    } catch {
      setPhase("idle");
    } finally {
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    const goOffline = () => {
      setOnline(false);
      setPhase("idle");
      void refresh();
    };
    const goOnline = () => {
      setOnline(true);
      void sync();
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    setOnline(navigator.onLine !== false);
    void refresh().then((count) => {
      if (count > 0 && navigator.onLine !== false) void sync();
    });

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [refresh, sync]);

  const offline = !online;
  const label = offline
    ? `Offline${saved > 0 ? ` · ${saved} saved` : ""}`
    : phase === "syncing"
      ? "Syncing…"
      : saved > 0
        ? `${saved} to sync`
        : "Synced";

  const Icon = offline ? CloudOff : phase === "syncing" ? RefreshCw : Check;

  return (
    <span
      aria-live="polite"
      data-testid="sync-indicator"
      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold ${
        offline
          ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
          : phase === "syncing"
            ? "border-line-strong bg-surface-2 text-slate-200"
            : "border-line bg-surface-2 text-muted"
      } ${className ?? ""}`}
    >
      <Icon className={`h-3.5 w-3.5 shrink-0 ${phase === "syncing" && !offline ? "animate-spin" : ""}`} aria-hidden />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}
