import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebase/admin";
import prisma from "@/lib/db";

/** Minimal shape of the database user needed by callers. */
export interface DbUser {
  id: string;
}

/**
 * Name of the HTTP-only session cookie. Its value is a Firebase session
 * cookie (a signed, server-verifiable token) — NEVER a raw user ID.
 */
export const SESSION_COOKIE_NAME = "gnostiri_session";

/** Session lifetime: 14 days (Firebase's maximum for session cookies). */
export const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 14 * 1000;

export interface AuthenticatedUser {
  dbUser: DbUser;
  decoded: DecodedIdToken;
}

/**
 * Create or update the Postgres user row for a verified Firebase identity.
 * Keeps Firebase Auth as the source of truth for email/name/avatar.
 */
export async function syncDbUser(decoded: DecodedIdToken): Promise<DbUser> {
  const { uid, email, name, picture } = decoded;

  if (!email) {
    throw new Error("Email required in Firebase token");
  }

  return prisma.user.upsert({
    where: { firebaseUid: uid },
    update: {
      email,
      name: name || undefined,
      avatar: picture || undefined,
    },
    create: {
      firebaseUid: uid,
      email,
      name: name || null,
      avatar: picture || null,
      profile: {
        create: {
          currentDomain: "highschool",
        },
      },
    },
  });
}

/**
 * Authenticate an API request via the `Authorization: Bearer <idToken>` header.
 * The ID token is verified server-side with the Firebase Admin SDK.
 * Returns null when the request is unauthenticated (caller should return 401).
 */
export async function authenticateRequest(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  const header = req.headers.get("authorization");
  const idToken =
    header && header.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!idToken) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!decoded.email) {
      return null;
    }
    const dbUser = await syncDbUser(decoded);
    return { dbUser, decoded };
  } catch (error) {
    console.error("ID token verification failed:", error);
    return null;
  }
}

/**
 * Authenticate a server component / server action via the HTTP-only
 * session cookie. Returns null when there is no valid session.
 */
export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    // `true` = also check the token has not been revoked.
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decoded.email) {
      return null;
    }
    const dbUser = await syncDbUser(decoded);
    return { dbUser, decoded };
  } catch {
    // Expired, revoked, or forged cookie — treat as signed out.
    return null;
  }
}
