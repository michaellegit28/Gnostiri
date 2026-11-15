import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Supabase OAuth callback: Google redirects back here through Supabase with a
// one-time code; we exchange it for the session (cookies written by the SSR
// client) and bounce to the requested destination.
function safeNext(raw: string | null): string {
  // Only allow same-site relative paths — never an open redirect.
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/highschool";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Missing code or failed exchange — send the user back to login with a flag.
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}