// PREVIEW SWITCHES — re-wired 2026-10-11: sign-in and premium are live again.
// Flip either back to `true` to re-open anonymous preview access.

// While true, pages that normally require sign-in render for anonymous
// visitors (currently the university course quiz page).
export const OPEN_PREVIEW = false;

// While true, university content is NOT premium-gated: hasPremiumAccess()
// returns true for everyone, unlocking all lessons, quizzes, tutor access,
// and adaptive plans without a subscription.
export const UNIVERSITY_OPEN = false;
