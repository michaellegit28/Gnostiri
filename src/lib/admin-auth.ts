import { getCurrentUser } from "@/lib/server-auth";

/**
 * Phase 3 admin gate — REUSES existing Firebase session auth (getCurrentUser).
 * No new auth system: allowlist via ADMIN_EMAILS env (comma-separated).
 * Deviation noted: repo had no admin middleware; this wraps existing auth.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { user: null, authorized: false, reason: "Authentication required" as const };
  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  // If no allowlist configured (local dev), allow any authenticated user but flag it.
  if (allowlist.length === 0) return { user, authorized: true, reason: "dev-no-allowlist" as const };
  if (user.email && allowlist.includes(user.email.toLowerCase())) return { user, authorized: true, reason: "allowlisted" as const };
  return { user, authorized: false, reason: "Not an admin" as const };
}

export function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}
