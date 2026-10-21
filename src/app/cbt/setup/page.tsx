import { notFound } from "next/navigation";
import Link from "next/link";
import { presetFor, scoringExplainer } from "@/lib/cbt/config";
import { boardSubjects } from "@/lib/cbt/data";
import { CBT } from "@/lib/cbt/ui";
import Step2Client from "@/components/cbt/Step2Client";

export const dynamic = "force-dynamic";

interface SetupPageProps {
  searchParams?: { board?: string };
}

export default async function CbtSetupPage({ searchParams }: SetupPageProps) {
  const preset = presetFor(searchParams?.board ?? "");
  if (!preset) notFound();

  const subjects = await boardSubjects(preset.code);

  if (subjects.length === 0) {
    return (
      <main className="min-h-screen bg-transparent text-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6">
          <p className={CBT.eyebrow}>{preset.name}</p>
          <h1 className={`${CBT.heading} mt-2 text-2xl md:text-4xl`}>Content in preparation</h1>
          <p className={`mx-auto mt-3 max-w-md text-sm ${CBT.muted}`}>
            No question bank has been published for this board yet. Papers land here as they
            are transcribed, verified and loaded — check back soon.
          </p>
          <Link href="/cbt" className={`${CBT.ghostBtn} mt-8`}>Back to exam select</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent pb-44 text-slate-50">
      <div className="mx-auto max-w-2xl px-4 pt-8 md:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/cbt" className="hover:text-gold">CBT</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">{preset.name}</span>
        </nav>

        <header className="mt-5">
          <p className={CBT.eyebrow}>Session setup</p>
          <h1 className={`${CBT.heading} mt-2 text-3xl md:text-4xl`}>{preset.name}</h1>
          <p className={`mt-2 text-sm ${CBT.muted}`}>{preset.tagline}</p>
        </header>

        <Step2Client
          boardCode={preset.code}
          boardName={preset.name}
          subjects={subjects}
          maxSlots={preset.maxSubjectSlots}
          lockedFirst={preset.lockedFirstSubject ?? null}
          simRules={preset.sim}
          practiceRules={preset.practice}
          scoringSummary={scoringExplainer(preset.scoring)[0]}
          hasContent
        />
      </div>
    </main>
  );
}
