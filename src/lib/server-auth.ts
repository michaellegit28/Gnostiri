import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import prisma from "@/lib/db";

export const SESSION_COOKIE = "__session";

export async function getCurrentUser() {
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const claims = await adminAuth.verifySessionCookie(cookie, true);
    return await prisma.user.findUnique({ where: { firebaseUid: claims.uid } });
  } catch {
    return null;
  }
}
