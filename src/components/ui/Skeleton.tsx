type SkeletonProps = {
  className?: string;
};

/**
 * Skeleton — shared pulse placeholder block for loading states.
 * Server-safe (no "use client"), dependency-free, brand-neutral.
 */
export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl border border-line bg-surface ${className}`}
    />
  );
}
