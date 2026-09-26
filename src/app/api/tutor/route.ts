import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AppDomain } from "@prisma/client";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

const domains: AppDomain[] = ["highschool", "university", "extras"];

async function incrementDaily(userId: string, domain: AppDomain) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Tutor rate limiter is not configured");
  const date = new Date().toISOString().slice(0, 10);
  const key = `tutor:${userId}:${domain}:${date}`;
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([["INCR", key], ["EXPIRE", key, 90000]]),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Tutor rate limiter unavailable");
  const result = await response.json();
  return Number(result?.[0]?.result || 0);
}

async function getDailyCount(userId: string, domain: AppDomain) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return 0;
  const date = new Date().toISOString().slice(0, 10);
  const key = `tutor:${userId}:${domain}:${date}`;
  const response = await fetch(`${url}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return 0;
  const result = await response.json();
  return Number(result.result || 0);
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domains.includes(domain as AppDomain)) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  const topicId = req.nextUrl.searchParams.get("topicId");
  const premium = await hasPremiumAccess(user.id, domain as AppDomain);
  if (domain === "university" && !premium) return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
  const session = await prisma.tutorSession.findFirst({ where: { userId: user.id, domain: domain as AppDomain, ...(topicId ? { topicId } : {}) }, orderBy: { createdAt: "desc" } });
  const count = await getDailyCount(user.id, domain as AppDomain);
  const messages = Array.isArray(session?.messages) ? session.messages : [];
  return NextResponse.json({ messages, remaining: premium ? "unlimited" : Math.max(0, 5 - count) });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    const body = await req.json();
    const domain = domains.includes(body.domain) ? body.domain as AppDomain : null;
    const action = ["ask", "why_wrong", "similar_question", "study_plan"].includes(body.action) ? body.action : "ask";
    if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 404 });
    const premium = await hasPremiumAccess(user.id, domain);
    if (action === "study_plan" && !premium) return NextResponse.json({ error: "Premium required for adaptive plans" }, { status: 403 });
    if (domain === "university" && !premium) return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
    let dailyCount = 0;
    if (!premium) {
      const count = await incrementDaily(user.id, domain);
      dailyCount = count;
      if (count > 5) return NextResponse.json({ error: "Daily Tutor limit reached", remaining: 0, upgrade: true }, { status: 429 });
    }
    const topicId = typeof body.topicId === "string" ? body.topicId : undefined;
    const topic = topicId ? await prisma.topic.findFirst({ where: { id: topicId, domain }, include: { parent: true, lessons: { orderBy: { orderIndex: "asc" }, take: 1 } } }) : null;
    if (topicId && !topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    const prompt = typeof body.message === "string" ? body.message.trim().slice(0, 4000) : "";
    if (!prompt && action !== "study_plan") return NextResponse.json({ error: "Message required" }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Tutor is not configured" }, { status: 503 });
    const history = Array.isArray(body.messages) ? body.messages.slice(-8).filter((m: any) => ["user", "assistant"].includes(m.role) && typeof m.content === "string").map((m: any) => ({ role: m.role, content: m.content.slice(0, 2000) })) : [];
    const context = topic ? `Current domain: ${domain}. Subject: ${topic.parent?.title || "General"}. Topic: ${topic.title}. Lesson: ${JSON.stringify(topic.lessons[0]?.content || {}).slice(0, 6000)}` : `Current domain: ${domain}.`;
    const system = `You are Gnostiri Tutor. Teach only within the learner's educational curriculum. Do not browse the web. Politely decline harmful and non-educational requests. ${context} Use concise Markdown for explanations. For similar_question return a JSON object with questionText, options (string array), correctAnswer, explanation. For study_plan return a JSON object with items: an array of {subject, topic, duration, priority}.`;
    const client = new OpenAI({ apiKey });
    if (action === "similar_question" || action === "study_plan") {
      const result = await client.chat.completions.create({
        model: process.env.OPENAI_TUTOR_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: system }, ...history, { role: "user", content: prompt || "Create an adaptive study plan." }],
        response_format: { type: "json_object" },
      });
      const rawText = result.choices[0]?.message?.content || "{}";
      let parsed: any;
      try { parsed = JSON.parse(rawText); } catch { return NextResponse.json({ error: "Tutor returned invalid structured content" }, { status: 502 }); }
      let output: unknown;
      if (action === "similar_question") {
        if (typeof parsed.questionText !== "string" || !Array.isArray(parsed.options) || typeof parsed.correctAnswer !== "string" || typeof parsed.explanation !== "string") return NextResponse.json({ error: "Tutor returned an invalid question" }, { status: 502 });
        output = { questionText: parsed.questionText.slice(0, 1000), options: parsed.options.slice(0, 6).map((option: unknown) => String(option).slice(0, 400)), correctAnswer: parsed.correctAnswer.slice(0, 400), explanation: parsed.explanation.slice(0, 2000) };
      } else {
        if (!Array.isArray(parsed.items)) return NextResponse.json({ error: "Tutor returned an invalid study plan" }, { status: 502 });
        output = parsed.items.slice(0, 30).map((item: any) => ({ subject: String(item.subject || "").slice(0, 120), topic: String(item.topic || "").slice(0, 160), duration: Math.min(240, Math.max(5, Number(item.duration) || 30)), priority: ["high", "medium", "low"].includes(item.priority) ? item.priority : "medium" }));
        await prisma.studyPlan.updateMany({ where: { userId: user.id, domain, isActive: true }, data: { isActive: false } });
        await prisma.studyPlan.create({ data: { userId: user.id, domain, generatedBy: "ai", items: output as any, isActive: true } });
      }
      const text = JSON.stringify(output);
      await prisma.tutorSession.create({ data: { userId: user.id, domain, subjectId: topic?.parentId, topicId: topic?.id, context, messages: [...history, ...(prompt ? [{ role: "user", content: prompt }] : []), { role: "assistant", content: text }] } });
      return new Response(`data: ${JSON.stringify({ token: text })}\n\ndata: [DONE]\n\n`, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", "X-Tutor-Remaining": premium ? "unlimited" : String(Math.max(0, 5 - dailyCount)) } });
    }
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_TUTOR_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...history, ...(prompt ? [{ role: "user" as const, content: prompt }] : [{ role: "user" as const, content: "Create a study plan based on the current domain and learning context." }])],
      stream: true,
    });
    let fullText = "";
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const token = chunk.choices[0]?.delta?.content || "";
            fullText += token;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
          }
          await prisma.tutorSession.create({ data: { userId: user.id, domain, subjectId: topic?.parentId, topicId: topic?.id, context, messages: [...history, ...(prompt ? [{ role: "user", content: prompt }] : []), { role: "assistant", content: fullText }] } });
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch { controller.error(new Error("Tutor stream failed")); }
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Tutor-Remaining": premium ? "unlimited" : String(Math.max(0, 5 - dailyCount)) } });
  } catch (error) {
    console.error("Tutor request failed", error);
    return NextResponse.json({ error: "Tutor unavailable" }, { status: 503 });
  }
}
