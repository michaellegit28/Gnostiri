export default function AccretionEmblem({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Gnostiri accretion ring"
      className={`shrink-0 ${className ?? ""}`}
    >
      <g transform="rotate(-18 32 32)">
        <ellipse
          cx="32"
          cy="32"
          rx="26"
          ry="11"
          stroke="rgb(var(--gold))"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="116 48"
        />
        <circle
          cx="32"
          cy="32"
          r="14"
          fill="rgb(var(--bg-deep))"
          stroke="rgb(var(--border-strong))"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
