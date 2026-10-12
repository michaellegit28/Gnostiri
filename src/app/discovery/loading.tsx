import Skeleton from "@/components/ui/Skeleton";

/**
 * Discovery segment loading — immersive-hero skeleton.
 * Stack order: applies after 01 (Skeleton). Server component, no fetching.
 */
export default function DiscoveryLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading Discovery content"
      className="min-h-screen bg-transparent text-slate-50"
    >
      <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16 text-center">
        <Skeleton className="mx-auto h-6 w-56" />
        <Skeleton className="mx-auto h-14 w-2/3" />
        <Skeleton className="mx-auto h-5 w-1/2" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <p className="sr-only">Loading…</p>
      </div>
    </div>
  );
}
