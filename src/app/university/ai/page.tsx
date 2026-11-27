import Link from "next/link";
import { getCurrentUser } from "@/lib/server-auth";
import { AudioLines, Mic, ScanText, Sparkles } from "lucide-react";
import AiNotes from "@/components/university/AiNotes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Studio — Gnostiri University",
  description: "The University AI lane: study notes, live transcription, auto-correction, and AI assessments.",
};

/**
 * University AI Studio — the deep, AI-heavy lane that differentiates University
 * from High School. AI Notes is live; transcription, auto-correction and AI
 * assessments are provisioned in the schema and surface here as they land.
 */
export default async function UniversityAiStudioPage() {
  const user = await getCurrentUser();

  const coming = [
    { href: "/tutor", label: "Live tutor transcription", note: "Transcript to notes from your tutor sessions", Icon: Mic },
    { href: "/desk", label: "PDF intelligence", note: "Turn your PDFs into notes and quizzes", Icon: ScanText },
    { href: "/progress", label: "Auto-correction", note: "AI-marked answers with explanations", Icon: AudioLines },
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link href="/university" className="rounded hover:text-electric-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">University</Link>
        <span className="text-slate-600" aria-hidden>/</span>
        <span className="text-slate-100 font-medium">AI Studio</span>
      </nav>

      <header className="mt-5 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-semibold text-electric-text">
          <Sparkles className="h-4 w-4" aria-hidden />
          University AI lane
        </div>
        <h1 className="gn-title-gradient font-serif text-3xl font-bold tracking-tight md:text-4xl">AI Studio</h1>
      </header>

      {!user ? (
        <p className="mt-8 rounded-2xl border border-line bg-surface/40 p-6 text-sm text-muted">
          <Link href="/login" className="rounded text-electric-text hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Sign in</Link> to use the AI lane.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          <AiNotes />

          <section aria-labelledby="ai-lane-next" className="space-y-3">
            <h2 id="ai-lane-next" className="font-serif text-xl font-bold text-ink">Also in the AI lane</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {coming.map(({ label, Icon }) => (
                <div key={label} className="gn-card flex flex-col justify-between rounded-2xl p-5">
                  <div className="space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg text-electric-text">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="font-semibold text-ink">{label}</div>
                  </div>
                  <p className="mt-3 text-xs text-muted">Coming next in the AI build-out.</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}