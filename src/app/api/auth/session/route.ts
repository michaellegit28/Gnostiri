import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import {
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_IN_MS,
  syncDbUser,
} from "@/lib/auth-server";

/**
 * Exchange a Firebase ID token (obtained client-side after sign-in)
 * for an HTTP-only session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      return NextResponse.json(
        { error: "Email required in ID token" },
        { status: 400 }
      );
    }

    const user = await syncDbUser(decodedToken);

    // Mint a signed, revocable session cookie (never store a raw UID).
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN_MS,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.floor(SESSION_EXPIRES_IN_MS / 1000),
    });

    // Clean up the legacy insecure cookie if it exists.
    response.cookies.delete("firebaseUid");

    return response;
  } catch (error) {
    console.error("Error verifying token or syncing session:", error);
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: 401 }
    );
  }
}
