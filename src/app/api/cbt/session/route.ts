import { NextRequest, NextResponse } from "next/server";
import { buildCbtSession } from "@/lib/cbt/session";

/**
 * POST /api/cbt/session — build a question paper for a CBT sitting.
 * Body: { boardCode, mode, subjects?: string[], count?: number }
 * correctAnswer is NEVER included in the response.
 */
export async function POST(req: NextRequest) {
  let body: { boardCode?: string; mode?: string; subjects?: string[]; count?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const mode = body.mode === "practice" ? "practice" : "simulation";
  const result = await buildCbtSession(body.boardCode ?? "", mode, body.subjects ?? [], body.count);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.paper);
}
