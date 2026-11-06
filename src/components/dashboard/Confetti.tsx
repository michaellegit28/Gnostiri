"use client";

import { useEffect, useRef } from "react";

/**
 * Confetti — a tasteful, self-contained celebration. No JS library, no
 * bitmap: pure DOM + CSS keyframes. Spawns a short burst of brand-coloured
 * pieces and cleans up after itself. Renders nothing when motion is reduced
 * (OS setting, the in-app preference, or Lite Mode) so it never fights
 * accessibility.
 */
export default function Confetti({ fire = true, count = 90 }: { fire?: boolean; count?: number }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fire) return;
    const el = host.current;
    if (!el) return;
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (root.classList.contains("reduce-motion") || root.classList.contains("lite-mode") || root.classList.contains("lite")) return;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    }

    const colors = [
      "rgb(49 92 255)",   // electric
      "rgb(8 175 194)",   // cyan
      "rgb(121 82 217)",  // violet
      "rgb(245 166 35)",  // solar gold
      "rgb(54 201 165)",  // mint
      "rgb(236 121 183)", // pink
    ];

    const fragments: HTMLElement[] = [];
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("span");
      piece.className = "gn-confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty("--x", `${(Math.random() - 0.5) * 160}px`);
      piece.style.setProperty("--y", `${120 + Math.random() * 60}vh`);
      piece.style.setProperty("--r", `${360 + Math.random() * 540}deg`);
      piece.style.setProperty("--dur", `${1800 + Math.random() * 900}ms`);
      piece.style.animationDelay = `${Math.random() * 260}ms`;
      el.appendChild(piece);
      fragments.push(piece);
    }

    const timer = window.setTimeout(() => {
      fragments.forEach((f) => f.remove());
    }, 3400);
    return () => {
      window.clearTimeout(timer);
      fragments.forEach((f) => f.remove());
    };
  }, [fire, count]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    />
  );
}
