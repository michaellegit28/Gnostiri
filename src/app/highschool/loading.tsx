import Skeleton from "@/components/ui/Skeleton";

/**
 * High School segment loading — subjects-board skeleton.
 * Stack order: applies after 01 (Skeleton). Server component, no fetching.
 */
export default function HighSchoolLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading High School content"
      className="min-h-screen bg-transparent text-slate-50"
    >
      <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12 md:px-12">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <p className="sr-only">Loading…</p>
      </div>
    </div>
  );
}
