import prisma from "@/lib/db";
import { buildExam, scoreSession, archiveSession, type ExamSession, type ScoredSession } from "@/lib/assessment";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";
import { recordLearningActivity } from "@/lib/activity";

// University exams are a premium surface — the same gate the course quiz API
// applies. The paper (stems, options) may be served to an entitled student,
// but answer keys never leave the server before grading: GET strips them and
// POST re-derives them from the DB, so a forged payload cannot fabricate a
// score or harvest the marking scheme.
async function access() {
  const user = await getCurrentUser();
  if (!user) return { error: Response.json({ error: "Authentication required" }, { status: 401 }) };
  if (!(await hasPremiumAccess(user.id))) return { error: Response.json({ error: "Premium subscription required" }, { status: 403 }) };
  return { user };
}

/** Serve the paper without its keys — the client renders stems/options only. */
function publicSession(session: ExamSession) {
  return {
    ...session,
    items: session.items.map((item) => ({
      id: item.id,
      format: item.format,
      stem: item.stem,
      options: item.options,
      marks: item.marks,
      negativeMarks: item.negativeMarks,
      conceptId: item.conceptId,
      conceptTitle: item.conceptTitle,
    })),
  };
}

export async function GET(req: Request) {
  const gate = await access();
  if ("error" in gate) return gate.error;

  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");
  if (!courseId) return Response.json({ error: "courseId is required" }, { status: 400 });

  const mode = (url.searchParams.get("mode") as "timed" | "open") ?? "timed";
  const formatParam = url.searchParams.get("formats");
  const formats = formatParam ? formatParam.split(",").filter(Boolean) as ("sba" | "emq" | "vignette" | "short-answer")[] : undefined;

  try {
    const session = await buildExam({ courseId, mode, formats, negativeMarking: true });
    return Response.json({ session: publicSession(session) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 404 });
  }
}

export async function POST(req: Request) {
  const gate = await access();
  if ("error" in gate) return gate.error;
  const userId = gate.user.id;

  const body = await req.json().catch(() => null);
  if (!body || !body.courseId || !Array.isArray(body.answers)) {
    return Response.json({ error: "courseId and answers array are required" }, { status: 400 });
  }

  try {
    // buildExam is deterministic (ordered select + slice), so rebuilding here
    // yields the exact paper the student sat — grading happens against DB
    // keys, never against a client-supplied session.
    const session = await buildExam({
      courseId: String(body.courseId),
      mode: body.mode === "open" ? "open" : "timed",
      formats: Array.isArray(body.formats) ? body.formats : undefined,
      negativeMarking: true,
    });
    const scored: ScoredSession = scoreSession(session, body.answers);
    await archiveSession(userId, scored);
    await recordLearningActivity(userId);
    return Response.json({ scored });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 404 });
  }
}
