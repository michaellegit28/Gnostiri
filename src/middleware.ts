import { NextRequest, NextResponse } from "next/server";
import { LAUNCH_GATE, LAUNCH_ENDS_AT } from "@/lib/access";
import { boardBySlug } from "@/lib/exam-bank";
import { carrySessionCookies, updateSession } from "@/lib/supabase/middleware";

// 1st-launch token gate (edge): the whole site sits behind /launch until the
// user redeems a token, EXCEPT the allowlisted auth/launch/static routes.
// Access proof = the __launch cookie, an HMAC signature minted only by the
// verified redemption endpoint — unforgeable without LAUNCH_SECRET.
// No database calls at the edge; Prisma checks happen in server components.
// Supabase session refresh runs FIRST (updateSession) so the auth cookies it
// rotates are carried onto every response, including gate redirects.

function isLaunchAllowlisted(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/launch" ||
    pathname === "/login" ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/launch/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/launch") ||
    pathname.startsWith("/api/payments/webhook") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images")
  );
}

async function hasValidLaunchCookie(request: NextRequest): Promise<boolean> {
  const secret = process.env.LAUNCH_SECRET;
  const value = request.cookies.get("__launch")?.value;
  if (!secret || !value || !value.includes(".")) return false;
  const [userId, mac] = value.split(".");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(userId));
  const expected = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return mac === expected;
}

function launchStillActive(): boolean {
  if (!LAUNCH_ENDS_AT) return true;
  return new Date() < new Date(LAUNCH_ENDS_AT);
}

// Retired-board 404 guard (edge): page-level notFound() in a force-dynamic
// route streams the not-found UI with HTTP 200 — the status can only be fixed
// here. exam-bank.ts is pure data, safe for the edge bundle.
const HIGHSCOOL_STATIC_SEGMENTS = new Set(["study", "exams", "practice"]);
function examSegmentOf(pathname: string): string | null {
  const seg = pathname.split("/").filter(Boolean);
  if (seg[0] !== "highschool" || seg.length < 2) return null;
  if (seg[1] === "exams" || seg[1] === "practice") return seg[2] ?? null;
  if (HIGHSCOOL_STATIC_SEGMENTS.has(seg[1])) return null;
  return seg[1];
}

export async function middleware(request: NextRequest) {
  // ---- Supabase Auth session refresh (runs for every matched request) ----
  const sessionResponse = await updateSession(request);

  // ---- 1st-launch token gate ----
  if (LAUNCH_GATE && launchStillActive() && !isLaunchAllowlisted(request.nextUrl.pathname)) {
    if (!(await hasValidLaunchCookie(request))) {
      if (request.nextUrl.pathname.startsWith("/api")) {
        const unauthorized = NextResponse.json({ error: "Launch access required" }, { status: 401 });
        carrySessionCookies(sessionResponse, unauthorized);
        return unauthorized;
      }
      const redirect = NextResponse.redirect(new URL("/launch", request.url));
      carrySessionCookies(sessionResponse, redirect);
      return redirect;
    }
  }

  // ---- retired-board 404 (real status, not a streamed 200) ----
  const examSeg = examSegmentOf(request.nextUrl.pathname);
  if (examSeg && !boardBySlug(examSeg.toLowerCase())) {
    const notFound = new NextResponse(null, { status: 404 });
    carrySessionCookies(sessionResponse, notFound);
    return notFound;
  }

  // ---- answer-key oracle stopgap (edge) ----
  // POST /api/quiz/answer returns correctAnswer+explanation for ANY questionId —
  // anonymously that is the whole 6,000-question key (proven live 2026-11-18).
  // Require a Supabase session cookie until the app-lane fix binds reveals to an
  // active session (agent-3/api-security-fixes-r1). Auth cookies are named
  // sb-<projectRef>-auth-token by @supabase/ssr.
  if (request.method === "POST" && request.nextUrl.pathname === "/api/quiz/answer") {
    const hasSession = Array.from(request.cookies.getAll()).some(
      (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token") && c.value.length > 0
    );
    if (!hasSession) {
      const unauthorized = NextResponse.json({ error: "Sign in required" }, { status: 401 });
      carrySessionCookies(sessionResponse, unauthorized);
      return unauthorized;
    }
  }

  // ---- IP rate limiting for /api ----
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      const unavailable = NextResponse.json({ error: "Rate limiting is not configured" }, { status: 503 });
      carrySessionCookies(sessionResponse, unavailable);
      return unavailable;
    }
    return sessionResponse;
  }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = request.ip || forwarded || "unknown";
  const minute = Math.floor(Date.now() / 60000);
  const key = `ip-limit:${ip}:${minute}`;
  try {
    const response = await fetch(`${url}/incr/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok) throw new Error("Redis request failed");
    const result = await response.json();
    const count = Number(result.result || 0);
    if (count === 1) await fetch(`${url}/expire/${encodeURIComponent(key)}/70`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (count > 100) {
      const tooMany = NextResponse.json({ error: "Too many requests" }, { status: 429 });
      carrySessionCookies(sessionResponse, tooMany);
      return tooMany;
    }
    return sessionResponse;
  } catch {
    const unavailable = NextResponse.json({ error: "Rate limiting unavailable" }, { status: 503 });
    carrySessionCookies(sessionResponse, unavailable);
    return unavailable;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};