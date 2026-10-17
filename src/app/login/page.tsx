"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/lib/firebase/auth-helpers";
import { GnostiriLogo } from "@/components/logo/GnostiriLogo";

/** Brand-accurate Google "G" — mark only, no text (Google Sign-In rules). */
function GoogleIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.032-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.988 10.71a5.386 5.386 0 0 1 0-3.42V4.957H.957a8.997 8.997 0 0 0 0 8.084l3.031-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.321l2.582-2.582C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.957L3.988 7.29C4.692 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

const COUNTRIES = [
  ["NG", "Nigeria"],
  ["GH", "Ghana"],
  ["KE", "Kenya"],
  ["IN", "India"],
  ["PK", "Pakistan"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
  ["EU", "Europe"],
] as const;

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("NG");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function syncSession(
    credential: Awaited<ReturnType<typeof signInWithEmail>>,
    saveCountry = false,
  ) {
    const idToken = await credential.user.getIdToken(true);
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!response.ok) throw new Error("Could not create a secure session");
    if (saveCountry) {
      await fetch("/api/auth/country", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });
    }
    window.location.assign("/highschool");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const credential =
        mode === "signup"
          ? await signUpWithEmail(email, password)
          : await signInWithEmail(email, password);
      await syncSession(credential, mode === "signup");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not authenticate");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError("");
    try {
      await syncSession(await signInWithGoogle());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not authenticate");
    }
  }

  return (
    <main className="min-h-screen bg-transparent p-6 text-slate-100">
      <div className="mx-auto mt-10 max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-7">
        <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-slate-300">
          &#8592; Home
        </Link>

        <GnostiriLogo
          markClassName="w-8 h-8 text-gold"
          wordClassName="font-serif text-xl font-bold text-gold"
        />

        <div>
          <h1 className="font-serif text-3xl font-bold text-gold">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Your learning progress syncs across devices.
          </p>
        </div>

        <form onSubmit={(e) => void submit(e)} className="space-y-4">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-3"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-3"
            />
          </label>
          {mode === "signup" && (
            <label className="block text-sm">
              Country
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-3"
              >
                {COUNTRIES.map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            type="submit"
            disabled={busy}
            className="min-h-12 w-full rounded-lg bg-gold font-semibold text-slate-950 transition-colors hover:bg-gold-hover disabled:opacity-50"
          >
            {busy ? "Please wait" : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs uppercase tracking-label text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={() => void google()}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-950 font-semibold text-slate-200 transition-colors hover:border-slate-500"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <p className="text-sm text-slate-400">
          {mode === "signup" ? "Already registered?" : "New to Gnostiri?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="font-semibold text-teal-300 underline"
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </main>
  );
}
