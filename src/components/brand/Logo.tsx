/**
 * Gnostiri mark — a geometric "G" whose upper terminal fires upward.
 * Knowledge ascending. Two elements only: a 290° ring (the book's curve) and
 * a solid arrowhead — solid, not stroked, so the mark stays crisp at 16px.
 * Rich solid gold #D4AF37; the negative variant (public/icon.svg) knocks the
 * mark out of a solid gold tile for favicons.
 */

const RING = "M34.5 17A14 14 0 1 0 34.5 33";
const BAR = "M34.5 33L26.5 33";
const SHAFT = "M34.5 17L40 11.5";
const HEAD = "M40 9.2L34.6 14.6L41.6 15.4Z";

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Gnostiri"
      className={`shrink-0 ${className ?? ""}`}
    >
      <path d={RING} stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />
      <path d={BAR} stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />
      <path d={SHAFT} stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />
      <path d={HEAD} fill="#D4AF37" />
    </svg>
  );
}

export default function Logo({
  size = 32,
  withWordmark = false,
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="font-serif text-lg font-bold tracking-tight text-ink">Gnostiri</span>
      )}
    </span>
  );
}
