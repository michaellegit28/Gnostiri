import Skeleton from "@/components/ui/Skeleton";

/**
 * University segment loading — hero + catalogue skeleton.
 * Server component, no fetching; matches the index page's structure so the
 * layout does not jump when the courses arrive.
 */
export default function UniversityLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading University content"
      className="min-h-screen bg-transparent text-slate-50"
    >
      <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-12 md:py-16">
        <Skeleton className="h-64 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        <p className="sr-only">Loading…</p>
      </div>
    </div>
  );
}
