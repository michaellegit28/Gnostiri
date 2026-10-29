import prisma from "@/lib/db";

/**
 * notify.ts — the single writer every feature uses for notifications.
 *
 * Contract (ROADMAP §2 — in-app is primary, email is an opt-in backup):
 *   - `createNotification` writes the one `Notification` row. It honours the
 *     user's muted types and their email backup preference (incl. quiet hours),
 *     so no feature has to re-implement delivery policy.
 *   - `notifyEmail` is the only outbound call. It is a no-op unless the Resend
 *     credentials are configured, and it never throws: an email provider
 *     outage must not break the feature that triggered the notification.
 */

export const NOTIFICATION_TYPES = [
  "cup_starting",
  "streak_risk",
  "overtaken",
  "bracket_invite",
  "milestone",
  "artifact_reward",
  "season_result",
  "report_resolved",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationInput {
  type: NotificationType;
  title: string;
  body: string;
  href?: string | null;
}

const QUIET_HOURS_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;

// "22:00-07:00" — local wall-clock minutes, wrapping midnight when start > end.
export function isValidQuietHours(value: string): boolean {
  return QUIET_HOURS_PATTERN.test(value);
}

function minutesOfDay(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function isWithinQuietHours(quietHours: string | null | undefined, now: Date): boolean {
  if (!quietHours || !isValidQuietHours(quietHours)) return false;
  const [start, end] = quietHours.split("-");
  const from = minutesOfDay(start);
  const to = minutesOfDay(end);
  const at = now.getHours() * 60 + now.getMinutes();
  return from <= to ? at >= from && at < to : at >= from || at < to;
}

function renderEmailHtml(title: string, body: string, href: string | null | undefined): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const link =
    appUrl && href
      ? `<p><a href="${appUrl.replace(/\/$/, "")}${href}">Open in Gnostiri</a></p>`
      : href
        ? `<p>In Gnostiri: ${href}</p>`
        : "";
  return [
    '<div style="font-family:Georgia,serif;max-width:32rem;margin:0 auto;padding:1.5rem">',
    '<p style="font:600 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.3em;color:#D4AF37;text-transform:uppercase">Gnostiri</p>',
    `<h1 style="font-size:1.5rem;color:#0f172a">${title}</h1>`,
    `<p style="color:#334155">${body}</p>`,
    link,
    "</div>",
  ].join("");
}

/**
 * Write one notification. Returns the created row, or null when the user has
 * muted this type (a muted type produces nothing at all: no in-app row, no
 * email — the preference is enforced at the single writer, not per surface).
 */
export async function createNotification(userId: string, input: NotificationInput) {
  const prefs = await prisma.notificationPreference.findUnique({ where: { userId } });
  if (prefs && prefs.mutedTypes.includes(input.type)) return null;

  // Quiet-hours deferral: inside the user's quiet window the in-app row is
  // still written (it is silent until they open the bell) but the email
  // backup is skipped and emailed stays false, so nothing wakes them up.
  // The next non-quiet event for that user sends normally.
  let emailed = false;
  const withinQuietHours = isWithinQuietHours(prefs?.quietHours, new Date());
  if (prefs?.emailOptIn && !withinQuietHours) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (user?.email) {
      emailed = await notifyEmail({
        to: user.email,
        subject: input.title,
        html: renderEmailHtml(input.title, input.body, input.href),
      });
    }
  }

  return prisma.notification.create({
    data: {
      userId,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href ?? null,
      emailed,
    },
  });
}

/**
 * Email backup. No-op unless BOTH Resend credentials exist, so the primary
 * in-app channel works on any deployment without extra configuration.
 */
export async function notifyEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM_EMAIL;
  if (!apiKey || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`notifyEmail: provider rejected the send (${res.status})`);
      return false;
    }
    return true;
  } catch {
    console.error("notifyEmail: provider call failed");
    return false;
  }
}
