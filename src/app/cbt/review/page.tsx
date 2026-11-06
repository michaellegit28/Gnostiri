import Link from "next/link";
import { CBT } from "@/lib/cbt/ui";
import ReviewClient from "@/components/cbt/ReviewClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Review answers — Gnostiri CBT" };

export default function CbtReviewPage() {
  return (
    <main className="min-h-screen bg-transparent pb-28 text-slate-100">
      <div className="mx-auto max-w-2xl px-4 pt-8 md:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/cbt" className="hover:text-electric-text">CBT</Link>
          <span className="text-slate-400">/</span>
          <Link href="/cbt/results" className="hover:text-electric-text">Results</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-100">Review</span>
        </nav>
        <header className="mt-5">
          <p className={CBT.eyebrow}>Answer key</p>
          <h1 className={`${CBT.heading} mt-2 text-3xl md:text-4xl`}>Review every question</h1>
        </header>
        <ReviewClient />
      </div>
    </main>
  );
}
