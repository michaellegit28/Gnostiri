// PREVIEW SWITCHES — re-wired 2026-10-11: sign-in and premium are live again.
// Flip either back to `true` to re-open anonymous preview access.

// While true, pages that normally require sign-in render for anonymous
// visitors (currently the university course quiz page).
export const OPEN_PREVIEW = false;

// While true, university content is NOT premium-gated: hasPremiumAccess()
// returns true for everyone, unlocking all lessons, quizzes, tutor access,
// and adaptive plans without a subscription.
export const UNIVERSITY_OPEN = false;

// 1st-launch token gate. While true, the whole site sits behind the launch
// screen: only token holders (and the allowlisted auth/launch routes) pass.
// LAUNCH_ENDS_AT (ISO string) auto-opens the site when it passes — set both
// together on launch day. Caps: 220 tokens total, max 20 benefactor tier.
export const LAUNCH_GATE = false;
export const LAUNCH_ENDS_AT: string | null = null;
export const LAUNCH_MAX_TOKENS = 220;
export const LAUNCH_MAX_BENEFACTORS = 20;
