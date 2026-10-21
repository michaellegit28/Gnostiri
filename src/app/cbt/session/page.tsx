import { notFound } from "next/navigation";
import Link from "next/link";
import { presetFor } from "@/lib/cbt/config";
import { buildCbtSession } from "@/lib/cbt/session";
import { CBT } from "@/lib/cbt/ui";
import ExamRunner from "@/components/cbt/ExamRunner";

export const dynamic = "force-dynamic";

interface SessionPageProps {
  searchParams?: { board?: string; mode?: string; subjects?: string; count?: string; minutes?: string };
}

export default async function CbtSessionPage({ searchParams }: SessionPageProps) {
  const preset = presetFor(searchParams?.board ?? "");
  if (!preset) notFound();

  const mode = searchParams?.mode === "practice" ? "practice" : "simulation";
  const subjects = (searchParams?.subjects ?? "").split(",").filter(Boolean);
  const minutes = Number(searchParams?.minutes) || undefined;

  const result = await buildCbtSession(preset.code, mode, subjects, Number(searchParams?.count) || undefined, minutes);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-transparent text-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6">
          <h1 className={`${CBT.heading} text-2xl md:text-4xl`}>This sitting can&#39;t be built yet</h1>
          <p className={`mx-auto mt-3 max-w-md text-sm ${CBT.muted}`}>{result.error}.</p>
          <Link href={`/cbt/setup?board=${preset.code}`} className={`${CBT.ghostBtn} mt-8`}>Back to setup</Link>
        </div>
      </main>
    );
  }

  return <ExamRunner paper={result.paper} />;
}
