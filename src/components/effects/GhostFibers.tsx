"use client";

import { useEffect, useRef } from "react";

interface GhostFibersProps {
  lineColor?: string;
  glowColor?: string;
  speed?: number;
  scale?: number;
  layers?: number;
  glowIntensity?: number;
  vignette?: number;
  grain?: number;
  className?: string;
}

interface Fiber {
  layer: number;
  yBase: number;
  amp: number;
  freq: number;
  phase: number;
  drift: number;
  width: number;
  alpha: number;
}

/**
 * GhostFibers — layered luminous fiber lines drifting on a flow field
 * (canvas 2D, no dependencies). Pauses off-screen, caps DPR at 2
 * (1.5 mobile), single static frame under prefers-reduced-motion.
 */
export default function GhostFibers({
  lineColor = "#1a1a2e",
  glowColor = "#4a5568",
  speed = 0.15,
  scale = 1.5,
  layers = 3,
  glowIntensity = 0.8,
  vignette = 0.9,
  grain = 0.03,
  className = "",
}: GhostFibersProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile =
      window.innerWidth < 768 || /Mobi|Android/i.test(window.navigator.userAgent);
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    let w = 0;
    let h = 0;
    let fibers: Fiber[] = [];
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const seed = () => {
      fibers = [];
      const perLayer = 7;
      for (let l = 0; l < layers; l++) {
        for (let i = 0; i < perLayer; i++) {
          fibers.push({
            layer: l,
            yBase: (i / (perLayer - 1) + (l % 2) * 0.06) * h,
            amp: (14 + ((i * 37 + l * 11) % 26)) * scale,
            freq: 0.0016 + ((i * 13 + l * 7) % 10) * 0.00012,
            phase: ((i * 1.7 + l * 2.3) % (Math.PI * 2)),
            drift: 0.4 + ((i + l) % 3) * 0.25,
            width: 1 + (l % 2) * 0.6,
            alpha: 0.5 - l * 0.11,
          });
        }
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(2, r.width);
      h = Math.max(2, r.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    const flow = (x: number, y: number, t: number) =>
      Math.sin(x * 0.004 * scale + t * 0.6) +
      Math.cos(y * 0.005 * scale - t * 0.4);

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#070b16";
      ctx.fillRect(0, 0, w, h);

      ctx.lineCap = "round";
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 14 * glowIntensity;
      ctx.strokeStyle = lineColor;

      const step = Math.max(14, w / 90);
      for (const f of fibers) {
        ctx.globalAlpha = Math.max(0.08, f.alpha);
        ctx.lineWidth = f.width;
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += step) {
          const sway =
            Math.sin(x * f.freq * 6.28 + f.phase + t * f.drift) * f.amp;
          const lift = flow(x, f.yBase, t) * 10 * scale;
          const y = f.yBase + sway + lift;
          if (x <= -20 + step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // vignette
      if (vignette > 0) {
        const g = ctx.createRadialGradient(
          w / 2, h / 2, Math.min(w, h) * 0.25,
          w / 2, h / 2, Math.max(w, h) * 0.75
        );
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, `rgba(2,4,10,${0.85 * vignette})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // film grain
      if (grain > 0) {
        const n = Math.floor(w * h * grain * 0.004);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        for (let i = 0; i < n; i++) {
          ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
      }
    };

    const frame = (now: number) => {
      paint(((now - t0) / 1000) * speed * 4);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const v = entries[0]?.isIntersecting ?? true;
        if (v && !visible) {
          visible = true;
          if (!reduced) raf = requestAnimationFrame(frame);
        } else if (!v) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (!document.hidden && visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [lineColor, glowColor, speed, scale, layers, glowIntensity, vignette, grain]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
