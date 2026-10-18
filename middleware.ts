import { NextRequest, NextResponse } from "next/server";
import { LAUNCH_GATE, LAUNCH_ENDS_AT } from "@/lib/access";

// 1st-launch token gate (edge): the whole site sits behind /launch until the
// user redeems a token, EXCEPT the allowlisted auth/launch/static routes.
// Access proof = the __launch cookie, an HMAC signature minted only by the
// verified redemption endpoint — unforgeable without LAUNCH_SECRET.
// No database calls at the edge; Prisma checks happen in server components.

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

export async function middleware(request: NextRequest) {
  // ---- 1st-launch token gate ----
  if (LAUNCH_GATE && launchStillActive() && !isLaunchAllowlisted(request.nextUrl.pathname)) {
    if (!(await hasValidLaunchCookie(request))) {
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Launch access required" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/launch", request.url));
    }
  }

  // ---- IP rate limiting for /api (unchanged behavior) ----
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Rate limiting is not configured" }, { status: 503 });
    return NextResponse.next();
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
    if (count > 100) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Rate limiting unavailable" }, { status: 503 });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
