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
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">
          Something went wrong
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">
          This page didn&apos;t load.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Something broke on our side. Try again, or head back home.
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
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-line-strong px-8 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
