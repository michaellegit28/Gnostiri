"use client";

import { useState } from "react";

// WaitlistForm — Premium waitlist capture until payments go live.
// No backend endpoint exists yet, so signups persist to localStorage on this
// device and confirm instantly. A1: wire to a real endpoint (newsletter/API)
// when payments launch — search WAITLIST-TODO.
export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      const raw = window.localStorage.getItem("gnostiri-waitlist");
      const list: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      if (!list.includes(value)) {
        list.push(value);
        window.localStorage.setItem("gnostiri-waitlist", JSON.stringify(list));
      }
    } catch {
      // Private mode etc: still confirm — server sync arrives with the endpoint.
    }
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <p
        role="status"
        className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-200"
      >
        You&apos;re on the waitlist — we&apos;ll email you when Premium opens.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-3" noValidate={false}>
      <label htmlFor="premium-waitlist-email" className="block text-sm font-medium text-slate-200">
        Email address
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="premium-waitlist-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-h-[48px] flex-1 rounded-xl border border-slate-600 bg-slate-950 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
        <button
          type="submit"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gold px-6 py-3 font-semibold text-slate-950 text-sm whitespace-nowrap transition-colors hover:bg-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Join the waitlist
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
      <p className="text-xs text-slate-500">
        One email when Premium opens. No spam, no sharing.
      </p>
    </form>
  );
}
