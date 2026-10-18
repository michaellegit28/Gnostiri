import Skeleton from "@/components/ui/Skeleton";

/**
 * University segment loading — faculties/courses skeleton.
 * Stack order: applies after 01 (Skeleton). Server component, no fetching.
 */
export default function UniversityLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading University content"
      className="min-h-screen bg-transparent text-slate-50"
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-12 md:px-10">
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
        <p className="sr-only">Loading…</p>
      </div>
    </div>
  );
}
