// TEMPORARY PREVIEW SWITCHES — public build preview.
// Flip both flags back to `false` when accounts and subscriptions are re-wired.

// While true, pages that normally require sign-in render for anonymous
// visitors (currently the university course quiz page).
export const OPEN_PREVIEW = true;

// While true, university content is NOT premium-gated: hasPremiumAccess()
// returns true for everyone, so all lessons, quizzes, tutor access, and
// adaptive plans render without a subscription.
export const UNIVERSITY_OPEN = true;
