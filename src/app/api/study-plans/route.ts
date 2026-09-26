import { NextRequest, NextResponse } from "next/server";
import { AppDomain } from "@prisma/client";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasPremiumAccess } from "@/lib/entitlements";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const domain = req.nextUrl.searchParams.get("domain");
  if (!["highschool", "university", "extras"].includes(domain || "")) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  const plans = await prisma.studyPlan.findMany({ where: { userId: user.id, domain: domain as AppDomain }, orderBy: { updatedAt: "desc" }, take: 20 });
  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const body = await req.json();
  const domain = body.domain;
  if (!["highschool", "university", "extras"].includes(domain)) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  if (!Array.isArray(body.items) || body.items.length > 100) return NextResponse.json({ error: "Plan items must be an array with at most 100 entries" }, { status: 400 });
  const generatedBy = body.generatedBy === "ai" ? "ai" : "manual";
  if (generatedBy === "ai" && !(await hasPremiumAccess(user.id, domain))) return NextResponse.json({ error: "Premium required for adaptive plans" }, { status: 403 });
  const items = body.items.map((item: any) => ({ subject: String(item.subject || "").slice(0, 120), topic: String(item.topic || "").slice(0, 160), duration: Math.max(5, Math.min(240, Number(item.duration) || 30)), priority: ["high", "medium", "low"].includes(item.priority) ? item.priority : "medium" }));
  const examDate = body.examDate ? new Date(body.examDate) : null;
  if (examDate && Number.isNaN(examDate.getTime())) return NextResponse.json({ error: "Invalid exam date" }, { status: 400 });
  await prisma.studyPlan.updateMany({ where: { userId: user.id, domain, isActive: true }, data: { isActive: false } });
  const plan = await prisma.studyPlan.create({ data: { userId: user.id, domain, items, examDate, generatedBy, isActive: true } });
  return NextResponse.json({ plan }, { status: 201 });
}
