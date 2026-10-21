import Link from "next/link";
import { CBT } from "@/lib/cbt/ui";
import ResultsClient from "@/components/cbt/ResultsClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Exam results — Gnostiri CBT" };

export default function CbtResultsPage() {
  return (
    <main className="min-h-screen bg-transparent pb-40 text-slate-50">
      <div className="mx-auto max-w-2xl px-4 pt-8 md:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/cbt" className="hover:text-gold">CBT</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">Results</span>
        </nav>
        <header className="mt-5">
          <p className={CBT.eyebrow}>Score analysis</p>
          <h1 className={`${CBT.heading} mt-2 text-3xl md:text-4xl`}>Your result</h1>
        </header>
        <ResultsClient />
      </div>
    </main>
  );
}
