import Link from "next/link";
import { Search, ShieldCheck, Timer, LayoutGrid } from "lucide-react";
import { listCbtBoards, type CbtBoardCard } from "@/lib/cbt/data";
import { CBT } from "@/lib/cbt/ui";
import Step1Client from "@/components/cbt/Step1Client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Computer-Based Test — Gnostiri",
  description: "Pick a board, configure your subjects, sit a full CBT simulation.",
};

export default async function CbtEntryPage() {
  const boards = await listCbtBoards();

  return (
    <main className="min-h-screen bg-transparent pb-40 text-slate-50">
      <div className="mx-auto max-w-3xl px-4 pt-8 md:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/highschool" className="hover:text-gold">High School</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">CBT</span>
        </nav>

        <header className="mt-5">
          <p className={CBT.eyebrow}>Computer-Based Test</p>
          <h1 className={`${CBT.heading} mt-2 text-3xl md:text-5xl`}>
            Sit the exam, <span className="text-gold">not a quiz</span>
          </h1>
          <p className={`mt-3 max-w-xl text-sm leading-relaxed md:text-base ${CBT.muted}`}>
            Full board simulations with real timing and board-style scoring — or a
            single-subject practice run you can tune. Your device keeps your attempt history.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={CBT.chip}><ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden /> Graded on our servers</span>
            <span className={CBT.chip}><Timer className="h-3.5 w-3.5 text-gold" aria-hidden /> Board-standard timers</span>
            <span className={CBT.chip}><LayoutGrid className="h-3.5 w-3.5 text-gold" aria-hidden /> One-hand navigation</span>
          </div>
        </header>

        <Step1Client boards={boards} />
      </div>
    </main>
  );
}
