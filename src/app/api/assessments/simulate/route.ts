import prisma from "@/lib/db";
import { buildExam, scoreSession, archiveSession, type ExamSession, type ScoredSession } from "@/lib/assessment";
import { getCurrentUser } from "@/lib/server-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");
  if (!courseId) return Response.json({ error: "courseId is required" }, { status: 400 });

  const mode = (url.searchParams.get("mode") as "timed" | "open") ?? "timed";
  const formatParam = url.searchParams.get("formats");
  const formats = formatParam ? formatParam.split(",").filter(Boolean) as ("sba" | "emq" | "vignette" | "short-answer")[] : undefined;

  try {
    const session = await buildExam({ courseId, mode, formats, negativeMarking: true });
    return Response.json({ session });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 404 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.session || !Array.isArray(body.answers)) {
    return Response.json({ error: "session and answers array are required" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const userId = user.id;

  const scored: ScoredSession = scoreSession(body.session as ExamSession, body.answers);
  await archiveSession(userId, scored);

  return Response.json({ scored });
}