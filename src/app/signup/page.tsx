"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User as UserIcon, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  getFriendlyAuthError,
} from "@/lib/firebase/auth-helpers";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"email" | "google" | "apple" | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/highschool");
    }
  }, [user, loading, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy("email");
    try {
      await signUpWithEmail(email.trim(), password, name.trim() || undefined);
      router.replace("/highschool");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  const handleProviderSignUp = async (provider: "google" | "apple") => {
    if (busy) return;
    setError(null);
    setBusy(provider);
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      router.replace("/highschool");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="text-3xl font-serif font-bold text-[#D4AF37] hover:text-[#e3bd4b] transition-colors"
          >
            Gnostiri
          </Link>
          <h1 className="text-2xl font-serif font-bold text-slate-100">
            Create your account
          </h1>
          <p className="text-slate-400 text-sm">
            Free forever for High School. Track progress, take quizzes, and learn
            with the AI Tutor.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-8 space-y-6 shadow-lg">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-lg p-3.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Full name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-h-[48px] bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[48px] bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full min-h-[48px] bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy !== null}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#c3a030] disabled:opacity-60 text-slate-950 font-semibold text-sm transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            >
              {busy === "email" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>
                {busy === "email" ? "Creating account..." : "Create account"}
              </span>
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex-1 h-px bg-slate-700/60" />
            <span>or continue with</span>
            <div className="flex-1 h-px bg-slate-700/60" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleProviderSignUp("google")}
              disabled={busy !== null}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
            >
              {busy === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="font-bold text-base">G</span>
              )}
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleProviderSignUp("apple")}
              disabled={busy !== null}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
            >
              {busy === "apple" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="font-bold text-base"></span>
              )}
              <span>Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#D4AF37] hover:text-[#e3bd4b] font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
