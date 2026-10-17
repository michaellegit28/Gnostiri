"use client";

import Link from "next/link";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Root error boundary — calm, branded fallback for segment failures
 * (e.g. DB blip). Offers retry (reset) before navigation.
 */
export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          Something interrupted learning
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">
          This page stumbled — your progress is safe.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
          A hiccup on our side kept this view from loading. Try again, or head
          somewhere calm while we recover.
        </p>
        {error?.digest && (
          <p className="mt-4 font-mono text-xs text-slate-600">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-gold px-8 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-600 px-8 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
