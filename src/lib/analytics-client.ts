export type AnalyticsEventType =
  | "session_start"
  | "mission_viewed"
  | "mission_completed"
  | "question_answered"
  | "streak_incremented"
  | "paywall_viewed";

export async function trackAnalyticsEvent(
  type: AnalyticsEventType,
  meta: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  if (type === "paywall_viewed") {
    const feature = typeof meta.feature === "string" ? meta.feature : "unknown";
    const key = `gnostiri:paywall:${feature}`;
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(key) === "1";
      if (!alreadySeen) window.sessionStorage.setItem(key, "1");
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return;
  }
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, meta }),
      keepalive: true,
    });
  } catch {
    return;
  }
}
