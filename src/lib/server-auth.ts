import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import type { User } from "@supabase/supabase-js";

/**
 * Every server component / route handler resolves the signed-in learner
 * through this one seam. The Supabase session cookie is validated against
 * the Supabase Auth server (getUser), then mapped to our Prisma User row.
 * Rows missing from our DB are created on first authenticated request, so
 * OAuth and email/password signups land in Postgres without a client call.
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();
    if (error || !authUser) return null;
    return await ensureAppUser(authUser);
  } catch {
    return null;
  }
}

export async function ensureAppUser(authUser: User) {
  const existing = await prisma.user.findUnique({ where: { supabaseUid: authUser.id } });
  if (existing) return existing;

  const email = authUser.email;
  if (!email) return null; // our schema requires an email address

  const metadata = (authUser.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : null;
  const avatar = typeof metadata.avatar_url === "string" ? metadata.avatar_url : null;

  // Adopt a pre-Supabase (Firebase era) row with the same verified email so
  // early users keep their history instead of orphaning it.
  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    if (byEmail.supabaseUid) return byEmail;
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { supabaseUid: authUser.id, name: byEmail.name ?? name, avatar: byEmail.avatar ?? avatar },
    });
  }

  try {
    return await prisma.user.create({
      data: {
        supabaseUid: authUser.id,
        email,
        name,
        avatar,
        profile: { create: { currentDomain: "highschool" } },
      },
    });
  } catch {
    // Unique-constraint race (two first requests at once): adopt the winner.
    const raced = await prisma.user.findFirst({
      where: { OR: [{ supabaseUid: authUser.id }, { email }] },
    });
    return raced;
  }
}