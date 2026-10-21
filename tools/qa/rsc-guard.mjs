/**
 * tools/qa/rsc-guard.mjs — page-health detectors shared by tools/smoke.mjs and
 * tools/audit-counts.mjs.
 *
 * Build success is not a working page. Every page route is probed over HTTP and
 * screened for the three failure modes that ship silently:
 *
 *   1. RSC digest errors — a component threw in production, Next swallowed it
 *      and still returned a 200 shell.
 *   2. Soft-404s — the page renders an honest-looking empty state ("Papers are
 *      being digitized") while the board actually holds thousands of questions.
 *   3. Redirects/notFound() where a 200 is expected.
 *
 * All markers are matched against the raw HTML AND the normalized flight copy
 * (React SSR delimits adjacent text nodes with `<!-- -->` and escapes quotes as
 * `\"` inside the RSC payload), so no detector depends on whitespace luck.
 */

/** React SSR text-node delimiter + flight-string unescaping. */
export function normalizeFlight(html) {
  return html.replace(/\\"/g, '"').replace(/<!--[\s\S]*?-->/g, "");
}

function matchesAny(haystacks, patterns) {
  const hits = [];
  for (const re of patterns) {
    for (const hay of haystacks) {
      const m = re.exec(hay);
      if (m) {
        hits.push(m[0].replace(/\s+/g, " ").trim().slice(0, 120));
        break;
      }
    }
  }
  return hits;
}

/**
 * Crash/vanished-route markers. `"digest":"` is quoted on purpose: unquoted
 * `digest` matches topic ids like `…-nutrition-and-digestion`.
 */
export function rscErrorsIn(html) {
  const hits = matchesAny([html, normalizeFlight(html)], [
    /"digest":"/,
    /NEXT_NOT_FOUND/,
    /NEXT_REDIRECT/,
    /NEXT_HTTP_ERROR_FALLBACK/,
    /Internal Server Error/i,
    /Application error/i,
  ]);
  return hits.map((h) => `RSC/error marker: ${h}`);
}

/**
 * Unconditional false-empty-state copy. This is the exact string students saw
 * on a board that held 6,000 questions, so it must never render on any route.
 */
export function soft404In(html) {
  const out = [];
  const patterns = [[/Papers are being digitized/i, 'soft-404 copy: "Papers are being digitized"']];
  for (const [re, label] of patterns) {
    if (re.test(html) || re.test(normalizeFlight(html))) out.push(label);
  }
  return out;
}

/**
 * Empty-state copy that is HONEST when a board has no content yet and FALSE
 * when it does. Callers gate these on proof of content — the catalogue's
 * `expectContent`, or audit-counts' tree count > 0 — so that "In preparation"
 * on a not-yet-built board is not a false alarm.
 */
export function emptyCopyIn(html) {
  const out = [];
  const patterns = [
    [/No topics are tagged for [^<.]{0,80}practice yet/i, 'empty-state copy: "No topics are tagged … yet"'],
    [/Content lands here as topics are rebuilt and tagged/i, 'empty-state copy: "Content lands here as topics are rebuilt"'],
    [/Topic practice for this board is still being loaded/i, 'empty-state copy: "Topic practice … still being loaded"'],
    [/In preparation/, 'empty-state copy: "In preparation"'],
  ];
  for (const [re, label] of patterns) {
    if (re.test(html) || re.test(normalizeFlight(html))) out.push(label);
  }
  return out;
}

/** Parse a locale-formatted integer ("6,000" → 6000). Returns null when absent. */
export function parseCount(text) {
  if (text == null) return null;
  const m = String(text).replace(/[\s,]/g, "").match(/^(\d+)/);
  return m ? Number(m[1]) : null;
}

/** Count markdown-free digits out of a matched string. */
export function countFrom(match) {
  return match == null ? null : parseCount(match);
}
