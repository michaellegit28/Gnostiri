// Quiz-weighted progress ring: fraction = completed topics / total topics.
// The ring carries the brand gold gradient, the track is the muted fill, and
// completion gets the one-time gn-shimmer sweep (globals.css).
export default function ProgressRing({ value, size = 44 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(1, value));
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const done = pct > 0.99;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(pct * 100)}% complete`} className={done ? "gn-shimmer" : undefined}>
      <defs>
        <linearGradient id="gn-ring-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--gold-from))" />
          <stop offset="55%" stopColor="rgb(var(--gold))" />
          <stop offset="100%" stopColor="rgb(var(--gold-to))" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--muted-fill))" strokeWidth="4" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={done ? "rgb(var(--success))" : pct > 0 ? "url(#gn-ring-gold)" : "rgb(var(--muted-fill))"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.28} fill={pct > 0 ? "rgb(var(--text))" : "rgb(var(--text-subtle))"}>
        {Math.round(pct * 100)}
      </text>
    </svg>
  );
}
