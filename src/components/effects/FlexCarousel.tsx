"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface FlexCarouselItem {
  title: string;
  caption: string;
  href: string;
  badge?: string;
  gradient?: string;
}

interface FlexCarouselProps {
  items: FlexCarouselItem[];
  preset?: "liquid" | "snap";
  intro?: "rise" | "fade" | "none";
  fit?: "natural" | "cover";
  cardHeight?: number;
  gap?: number;
  radius?: number;
  squeeze?: number;
  focusOnClick?: boolean;
  captions?: boolean;
  autoplay?: boolean;
  interval?: number;
  className?: string;
}

/**
 * FlexCarousel — tactile flex-expanding showcase. The active card grows
 * while siblings squeeze; autoplay advances until the user interacts.
 * Keyboard navigable (arrows), pauses on hover/focus, honours
 * prefers-reduced-motion (no autoplay, instant transitions).
 */
export default function FlexCarousel({
  items,
  preset = "liquid",
  intro = "rise",
  fit = "natural",
  cardHeight = 0.6,
  gap = 16,
  radius = 8,
  squeeze = 0.15,
  focusOnClick = true,
  captions = true,
  autoplay = true,
  interval = 5,
  className = "",
}: FlexCarouselProps) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const go = useCallback(
    (i: number) => setActive(((i % items.length) + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (!autoplay || reduced || paused || items.length < 2) return;
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % items.length);
    }, interval * 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoplay, reduced, paused, items.length, interval]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      go(active + 1);
      setPaused(true);
    } else if (e.key === "ArrowLeft") {
      go(active - 1);
      setPaused(true);
    }
  };

  const transition =
    preset === "liquid"
      ? "transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      : "transition-[flex-grow] duration-200 ease-out";
  const introCls =
    !mounted && intro === "rise"
      ? "translate-y-8 opacity-0"
      : !mounted && intro === "fade"
        ? "opacity-0"
        : "translate-y-0 opacity-100";

  return (
    <div className={className}>
      <div
        role="listbox"
        aria-label="Showcase"
        tabIndex={0}
        onKeyDown={onKey}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className={`flex w-full transition-all duration-700 ${introCls}`}
        style={{
          gap: `${gap}px`,
          height: fit === "cover" ? "100%" : `min(62vh, ${Math.round(cardHeight * 640)}px)`,
          minHeight: "280px",
        }}
      >
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <div
              key={item.title}
              role="option"
              aria-selected={isActive}
              tabIndex={-1}
              onClick={() => {
                if (focusOnClick) {
                  go(i);
                  setPaused(true);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && focusOnClick) {
                  e.preventDefault();
                  go(i);
                }
              }}
              className={`relative flex-1 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${reduced ? "" : transition} ${item.gradient ?? "bg-slate-800"}`}
              style={{
                flexGrow: isActive ? 1 / Math.max(0.05, squeeze) : 1,
                flexBasis: 0,
                borderRadius: `${radius}px`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                {item.badge && (
                  <span className="mb-2 inline-block rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-semibold text-[#D4AF37]">
                    {item.badge}
                  </span>
                )}
                <h3
                  className={`font-serif font-bold text-slate-50 ${isActive ? "text-xl md:text-2xl" : "text-sm md:text-base"}`}
                >
                  {item.title}
                </h3>
                {captions && isActive && (
                  <p className="mt-1 text-sm text-slate-300">{item.caption}</p>
                )}
                {isActive && (
                  <Link
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-flex min-h-[44px] items-center rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#c3a030]"
                  >
                    Explore
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Show ${item.title}`}
            onClick={() => {
              go(i);
              setPaused(true);
            }}
            className={`h-2 min-h-[8px] rounded-full transition-all ${
              i === active ? "w-8 bg-[#D4AF37]" : "w-2 bg-slate-700 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
