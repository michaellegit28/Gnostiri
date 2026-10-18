import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ country: null });
  return NextResponse.json({ country: user.country });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { country } = await req.json();
  if (typeof country !== "string" || !["US","GB","CA","IE","FR","DE","NG","GH","KE","ZA","EG","IN","PK","CN","JP","AU","SG","AE","IL","BR","EU"].includes(country.toUpperCase())) return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  await prisma.user.update({ where: { id: user.id }, data: { country: country.toUpperCase() } });
  return NextResponse.json({ success: true });
}
