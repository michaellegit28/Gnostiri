import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return NextResponse.json({ error: "Email required in ID token" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        email,
        name: name || undefined,
        avatar: picture || undefined,
      },
      create: {
        firebaseUid: uid,
        email,
        name: name || null,
        avatar: picture || null,
        profile: {
          create: {
            currentDomain: "highschool",
          },
        },
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error verifying token or syncing session:", error);
    return NextResponse.json({ error: "Unauthorized or server error" }, { status: 401 });
  }
}
