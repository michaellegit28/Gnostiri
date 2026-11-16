import { createClient } from "@/lib/supabase/client";

// Client-side auth actions for Supabase Auth (Google OAuth + email/password).
// Google uses the full-page redirect flow (no popup): works on Android,
// in in-app browsers, and whenever popups are blocked.

function redirectBase(): string {
  const configured = process.env.NEXT_PUBLIC_AUTH_REDIRECT_BASE_URL;
  if (configured && typeof window !== "undefined") {
    try {
      const url = new URL(configured);
      // Only trust the configured base on its own origin; preview and
      // localhost deployments redirect back to themselves (URLs are
      // allowlisted in the Supabase dashboard).
      if (url.host === window.location.host) return window.location.origin;
    } catch {
      // fall through to the live origin
    }
  }
  return typeof window === "undefined" ? "" : window.location.origin;
}

export function signInWithGoogle(next = "/highschool"): Promise<void> {
  const callback = `${redirectBase()}/auth/callback${
    next && next !== "/highschool" ? `?next=${encodeURIComponent(next)}` : ""
  }`;
  return createClient()
    .auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback },
    })
    .then(() => undefined);
}

export const signInWithEmail = (email: string, password: string) =>
  createClient().auth.signInWithPassword({ email, password });

export const signUpWithEmail = (email: string, password: string) =>
  createClient().auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${redirectBase()}/auth/callback` },
  });

export const signOut = () => createClient().auth.signOut();