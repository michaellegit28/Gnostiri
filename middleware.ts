import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
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

export const config = { matcher: "/api/:path*" };
