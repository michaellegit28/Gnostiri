import { getCurrentUser } from "@/lib/server-auth";
import { getDueConcepts } from "@/lib/spaced-repetition";
import RevisionQueue from "@/components/university/RevisionQueue";
import { Brain, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Revision queue — Gnostiri University",
  description: "Your spaced-repetition queue — concepts resurface exactly when you're about to forget them.",
};

export default async function RevisionPage() {
  const user = await getCurrentUser();
  const due = user ? await getDueConcepts(user.id, 20) : [];

  return (
    <main className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-14 space-y-10">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Brain className="w-4 h-4" />
            <span>Spaced repetition</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            Your revision queue
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Every concept you touch has a forgetting curve. This queue surfaces each one at the
            moment you are about to lose it — so an hour here protects weeks of work.
          </p>
        </header>

        {due.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
            <h2 className="font-serif text-2xl font-bold">Nothing due right now</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              {user
                ? "Study a course and its concepts will appear here on their schedule. Mastery is earned by demonstrating a concept under exam conditions — twice, on separate days."
                : "Sign in and study a course; the scheduler begins tracking each concept&apos;s forgetting curve the moment you touch it."}
            </p>
          </div>
        ) : (
          <RevisionQueue due={due} />
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 space-y-3">
          <h2 className="font-serif text-lg font-bold">How mastery is earned</h2>
          <ul className="text-sm text-slate-400 space-y-2 leading-relaxed">
            <li>• Each review adjusts the concept&apos;s interval — correct and confident stretches the gap, a miss collapses it.</li>
            <li>• Only <strong className="text-slate-200">exam-condition</strong> demonstrations feed the mastery score.</li>
            <li>• A concept becomes <strong className="text-gold">mastered</strong> after two exam-condition successes, on separate days.</li>
            <li>• Mastered concepts graduate to maintenance — they return rarely, but they never disappear.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
