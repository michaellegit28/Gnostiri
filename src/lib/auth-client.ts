"use client";

import { User } from "firebase/auth";

/**
 * Fetch wrapper that attaches the user's Firebase ID token as a
 * `Authorization: Bearer <token>` header so API routes can verify
 * the caller's identity server-side. Never send raw user IDs.
 */
export async function authedFetch(
  user: User | null,
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (user) {
    try {
      const idToken = await user.getIdToken();
      headers.set("Authorization", `Bearer ${idToken}`);
    } catch (error) {
      console.error("Failed to get Firebase ID token:", error);
    }
  }

  return fetch(input, { ...init, headers });
}
