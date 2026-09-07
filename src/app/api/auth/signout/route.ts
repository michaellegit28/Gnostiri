import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-server";

/**
 * Clear the session cookie on sign-out.
 */
export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.delete(SESSION_COOKIE_NAME);
  // Clean up the legacy insecure cookie if it exists.
  response.cookies.delete("firebaseUid");
  return response;
}
