export default function HeroVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`h-full w-full ${className ?? ""}`}
      role="img"
      aria-label="A tilted accretion ring around a solid core"
    >
      <g className="hero-orbit">
        <ellipse
          cx="60"
          cy="60"
          rx="50"
          ry="21"
          stroke="rgb(var(--gold))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="220 94"
        />
      </g>
      <circle cx="60" cy="60" r="25" fill="rgb(var(--bg-deep))" stroke="rgb(var(--border-strong))" strokeWidth="3" />
      <style>{`
        .hero-orbit { animation: hero-orbit 12s linear infinite; transform-origin: 60px 60px; }
        @keyframes hero-orbit { from { transform: rotate(-24deg); } to { transform: rotate(336deg); } }
        @media (prefers-reduced-motion: reduce) { .hero-orbit { animation: none; transform: rotate(-24deg); } }
        html.reduce-motion .hero-orbit { animation: none; transform: rotate(-24deg); }
      `}</style>
    </svg>
  );
}
