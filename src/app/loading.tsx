import Skeleton from "@/components/ui/Skeleton";

/**
 * Root loading boundary — branded skeleton shown during slow DB queries
 * and segment transitions. Server component; no data fetching here.
 */
export default function RootLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading Gnostiri content"
      className="min-h-screen bg-transparent text-slate-100"
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-16">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
        <p className="sr-only">Loading…</p>
      </div>
    </div>
  );
}
