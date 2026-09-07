"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Auth-aware navigation actions for the site header.
 * Shows Sign in / Get Started when signed out, and the user's
 * name + Sign out when signed in.
 */
export default function NavAuth() {
  const { user, loading, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-10 rounded-lg bg-slate-800 animate-pulse" />
        <div className="w-28 h-10 rounded-lg bg-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/login"
          className="px-4 py-2 min-h-[48px] inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="px-5 py-2.5 min-h-[48px] inline-flex items-center text-sm font-medium rounded-lg bg-[#D4AF37] text-slate-950 hover:bg-[#c3a030] transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const displayName =
    user.displayName || user.email?.split("@")[0] || "Learner";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link
        href="/progress"
        className="hidden sm:inline-flex items-center gap-2 px-3 py-2 min-h-[48px] text-sm text-slate-300 hover:text-white transition-colors"
        title={user.email || displayName}
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 inline-flex items-center justify-center text-sm font-bold">
            {initial}
          </span>
        )}
        <span className="max-w-[120px] truncate font-medium">
          {displayName}
        </span>
      </Link>
      <button
        type="button"
        onClick={signOutUser}
        className="px-4 py-2 min-h-[48px] inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    </div>
  );
}
