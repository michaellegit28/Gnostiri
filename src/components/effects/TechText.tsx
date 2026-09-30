"use client";

import { useEffect, useRef } from "react";

interface TechTextProps {
  text?: string;
  fontSize?: number;
  mobileFontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  reveal?: "letter" | "word" | "all";
  reach?: number;
  softness?: number;
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  className?: string;
}

interface Particle {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  accent: boolean;
  delay: number;
  ambient: boolean;
}

/**
 * TechText — headline rendered as a living particle field (canvas 2D).
 * Particles ease into letterforms, scatter softly near the pointer, drift
 * as ambient specks. Readable at rest; respects prefers-reduced-motion
 * (renders crisp static text instead).
 */
export default function TechText({
  text = "GNOSTIRI",
  fontSize = 120,
  mobileFontSize = 80,
  fontWeight = 500,
  letterSpacing = -0.02,
  color = "#ffffff",
  accentColor = "#D4AF37",
  reveal = "letter",
  reach = 150,
  softness = 0.8,
  specks = 8,
  selection = true,
  labels = false,
  draggable = true,
  className = "",
}: TechTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = window.innerWidth < 640 ? mobileFontSize : fontSize;
    const tracking = size * letterSpacing;
    const font = `${fontWeight} ${size}px ui-sans-serif, system-ui, sans-serif`;
    const chars = text.split("");

    // Measure per character to support letter/word reveal groups.
    const meas = document.createElement("canvas").getContext("2d");
    if (!meas) return;
    meas.font = font;
    const widths = chars.map((ch) => meas.measureText(ch).width);
    const totalW =
      widths.reduce((a, b) => a + b, 0) + tracking * Math.max(0, chars.length - 1);
    const totalH = Math.ceil(size * 1.35);

    // Word index per character for reveal="word".
    const wordIndex: number[] = [];
    let w = 0;
    chars.forEach((ch, i) => {
      wordIndex[i] = w;
      if (ch === " ") w += 1;
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(totalW * dpr);
    canvas.height = Math.ceil(totalH * dpr);
    canvas.style.width = `${Math.ceil(totalW)}px`;
    canvas.style.height = `${Math.ceil(totalH)}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Offscreen raster → particle homes.
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.font = font;
    octx.textBaseline = "middle";
    octx.fillStyle = "#fff";
    let cx = 0;
    const bounds: { x0: number; x1: number }[] = [];
    chars.forEach((ch, i) => {
      octx.fillText(ch, cx, totalH / 2);
      bounds.push({ x0: cx, x1: cx + widths[i] });
      cx += widths[i] + tracking;
    });
    const img = octx.getImageData(0, 0, off.width, off.height).data;

    const groupAt = (px: number): number => {
      for (let i = 0; i < bounds.length; i++) {
        if (px <= bounds[i].x1 + tracking / 2) return i;
      }
      return bounds.length - 1;
    };

    const gap = Math.max(2, Math.min(5, Math.round(size / 30)));
    const particles: Particle[] = [];
    for (let y = 0; y < off.height; y += gap) {
      for (let x = 0; x < off.width; x += gap) {
        if (img[(y * off.width + x) * 4 + 3] > 128) {
          const px = x / dpr;
          const py = y / dpr;
          const gi = groupAt(px);
          const group =
            reveal === "letter" ? gi : reveal === "word" ? wordIndex[gi] ?? 0 : 0;
          particles.push({
            hx: px,
            hy: py,
            x: px + (Math.random() - 0.5) * 60,
            y: py + (Math.random() - 0.5) * 60,
            vx: 0,
            vy: 0,
            size: Math.random() < 0.85 ? 1.4 : 2.1,
            accent: Math.random() < 0.12,
            delay: group * 90 + Math.random() * 120,
            ambient: false,
          });
        }
      }
    }
    for (let i = 0; i < specks * 14; i++) {
      particles.push({
        hx: Math.random() * totalW,
        hy: Math.random() * totalH,
        x: Math.random() * totalW,
        y: Math.random() * totalH,
        vx: 0,
        vy: 0,
        size: 1,
        accent: false,
        delay: 0,
        ambient: true,
      });
    }

    if (reduced) {
      ctx.clearRect(0, 0, totalW, totalH);
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.textBaseline = "middle";
      let sx = 0;
      chars.forEach((ch, i) => {
        ctx.fillText(ch, sx, totalH / 2);
        sx += widths[i] + tracking;
      });
      return;
    }

    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    const origin = { x: 0, y: 0 }; // pan offset from dragging
    const grab = { on: false, cx: 0, cy: 0, ox: 0, oy: 0 };
    const t0 = performance.now();
    const ease = 0.08;
    const damp = 0.86;

    const toLocal = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((clientX - r.left) / r.width) * totalW - origin.x,
        y: ((clientY - r.top) / r.height) * totalH - origin.y,
      };
    };

    const onMove = (e: PointerEvent) => {
      if (grab.on && draggable) {
        origin.x = grab.ox + (e.clientX - grab.cx) * (totalW / canvas.getBoundingClientRect().width);
        origin.y = grab.oy + (e.clientY - grab.cy) * (totalH / canvas.getBoundingClientRect().height);
      }
      const p = toLocal(e.clientX, e.clientY);
      mouse.x = p.x;
      mouse.y = p.y;
    };
    const onDown = (e: PointerEvent) => {
      if (!draggable) return;
      grab.on = true;
      grab.cx = e.clientX;
      grab.cy = e.clientY;
      grab.ox = origin.x;
      grab.oy = origin.y;
    };
    const onUp = () => {
      grab.on = false;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      grab.on = false;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    const frame = (now: number) => {
      const elapsed = now - t0;
      ctx.clearRect(0, 0, totalW, totalH);
      ctx.save();
      ctx.translate(origin.x, origin.y);
      for (const p of particles) {
        if (elapsed < p.delay) continue;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < reach && d > 0.01) {
          const f = ((reach - d) / reach) * (2.6 * (1.2 - softness * 0.5));
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx += (p.hx - p.x) * ease;
        p.vy += (p.hy - p.y) * ease;
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.accent ? accentColor : color;
        ctx.globalAlpha = p.ambient ? 0.5 : 0.92;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const v = entries[0]?.isIntersecting ?? true;
        if (v && !visible) {
          visible = true;
          raf = requestAnimationFrame(frame);
        } else if (!v) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [
    text,
    fontSize,
    mobileFontSize,
    fontWeight,
    letterSpacing,
    color,
    accentColor,
    reveal,
    reach,
    softness,
    specks,
  ]);

  return (
    <div className={`relative inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={text}
        className={draggable ? "cursor-grab active:cursor-grabbing" : ""}
      />
      <span
        aria-hidden={!selection}
        className="absolute inset-0 select-text text-transparent"
      >
        {text}
      </span>
      {labels && (
        <span className="mt-2 block text-center text-xs uppercase tracking-[0.3em] text-slate-500">
          {text}
        </span>
      )}
    </div>
  );
}
