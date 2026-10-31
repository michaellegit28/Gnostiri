/**
 * HeroVisual — the brand art band.
 *
 * One idea, the mark's idea: rings that climb. The G's ring drawn four times,
 * ascending, each one a "level" of study, with a rising trail of dots and a
 * single bold arrow at the top. Pure inline SVG (~4KB), gold gradient on the
 * zinc surface, theme-aware via currentColor/CSS vars, and animated with CSS
 * only — the global reduce-motion rule silences it for anyone who asks.
 * This is the slot a photographic hero can replace later (one <Image> swap).
 */

export default function HeroVisual({ className }: { className?: string }) {
  const rings = [
    { cx: 90, cy: 150, r: 26, opacity: 0.18 },
    { cx: 170, cy: 118, r: 34, opacity: 0.3 },
    { cx: 262, cy: 86, r: 44, opacity: 0.45 },
    { cx: 370, cy: 52, r: 56, opacity: 0.65 },
  ];

  return (
    <svg
      viewBox="0 0 460 220"
      className={`w-full ${className ?? ""}`}
      role="img"
      aria-label="Rings climbing toward a rising arrow — the Gnostiri mark in motion"
    >
      <defs>
        <linearGradient id="hero-gold" x1="0" y1="220" x2="460" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgb(var(--gold-from))" />
          <stop offset="100%" stopColor="rgb(var(--gold-to))" />
        </linearGradient>
      </defs>

      {/* base line the rings stand on */}
      <line x1="20" y1="196" x2="440" y2="196" stroke="rgb(var(--border))" strokeWidth="1" />

      {/* ascending rings — each opens at the top-right like the mark */}
      {rings.map((ring, i) => (
        <g key={ring.cx} className="hero-ring" style={{ animationDelay: `${i * 220}ms` }}>
          <path
            d={describeG(ring.cx, ring.cy, ring.r)}
            fill="none"
            stroke="url(#hero-gold)"
            strokeWidth={i === rings.length - 1 ? 4 : 2.5}
            strokeLinecap="round"
            opacity={ring.opacity}
          />
          {i === rings.length - 1 && (
            <path d={`M${ring.cx + ring.r * 0.86} ${ring.cy - ring.r * 0.5} L${ring.cx + ring.r * 1.5} ${ring.cy - ring.r * 1.14}`} stroke="url(#hero-gold)" strokeWidth="4" strokeLinecap="round" />
          )}
        </g>
      ))}

      {/* the rising trail of dots */}
      {[
        [130, 178],
        [212, 146],
        [300, 112],
        [392, 74],
      ].map(([cx, cy], i) => (
        <circle
          key={cx}
          cx={cx}
          cy={cy}
          r="3"
          fill="url(#hero-gold)"
          className="hero-dot"
          style={{ animationDelay: `${600 + i * 160}ms` }}
        />
      ))}

      {/* the summit arrow — solid, like the mark's arrowhead */}
      <path d="M418 34 L406 50 L431 51 Z" fill="url(#hero-gold)" className="hero-arrow" />

      <style>{`
        .hero-ring { animation: hero-float 6s ease-in-out infinite; transform-origin: center; }
        .hero-dot { animation: hero-pulse 3.2s ease-in-out infinite; }
        .hero-arrow { animation: hero-pulse 4s ease-in-out infinite; }
        @keyframes hero-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes hero-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
        @media (prefers-reduced-motion: reduce) { .hero-ring, .hero-dot, .hero-arrow { animation: none; } }
        html.reduce-motion .hero-ring, html.reduce-motion .hero-dot, html.reduce-motion .hero-arrow { animation: none; }
      `}</style>
    </svg>
  );
}

/** A "G" arc: 290° of a circle, opening at the top-right — the mark's curve. */
function describeG(cx: number, cy: number, r: number): string {
  const start = { x: cx + r * 0.866, y: cy - r * 0.5 };
  const end = { x: cx + r * 0.866, y: cy + r * 0.5 };
  return `M${start.x.toFixed(1)} ${start.y.toFixed(1)}A${r} ${r} 0 1 0 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}
