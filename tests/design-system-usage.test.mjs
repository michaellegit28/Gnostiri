// Usage-level design-system guards.
//
// tests/a11y.test.mjs proves the PALETTE is correct. These tests prove the
// palette is USED correctly, which is a different failure mode and the one that
// actually shipped bugs: tailwind.config.ts aliases the `slate` scale onto the
// theme tokens (slate-50 -> --surface-2, slate-100 -> --text, slate-950 -> --bg)
// so legacy utilities silently changed meaning. That produced two real,
// user-visible defects:
//
//   1. `text-slate-50` (a TEXT colour) resolved to --surface-2, the elevated
//      card surface. Contrast 1.47:1 dark / 1.11:1 light -- the selected answer
//      in the CBT exam runner and every exam-page heading rendered effectively
//      invisible, in both themes.
//   2. `text-slate-950` resolved to --bg (#101B33 dark / #F7F9FF light). On a
//      gold CTA that is 8.45:1 in dark but 1.93:1 in light -- the primary
//      "continue studying" button was unreadable in light mode.
//
// Neither failed a build and neither was caught by a token test, because the
// tokens themselves were fine. Only usage checks catch them.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = new URL("../src/", import.meta.url).pathname;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const FILES = walk(SRC);

test("no text-slate-50 anywhere — it is --surface-2, not a text colour", () => {
  const offenders = [];
  for (const file of FILES) {
    const src = readFileSync(file, "utf8");
    // not followed by another digit, so text-slate-500 is fine (that one
    // resolves to --text-subtle, a separate decorative rule).
    const m = src.match(/\btext-slate-50(?![0-9])/g);
    if (m) offenders.push(file.replace(SRC, "src/") + " (" + m.length + "x)");
  }
  assert.deepEqual(
    offenders,
    [],
    "text-slate-50 paints text in the surface colour:\n" + offenders.join("\n")
  );
});

test("no text-slate-950 on a coloured fill — it is --bg and fails in light mode", () => {
  const offenders = [];
  for (const file of FILES) {
    const src = readFileSync(file, "utf8");
    for (const cls of src.match(/className=(?:"[^"]*"|\{[^}]*\})/g) ?? []) {
      if (/\btext-slate-950\b/.test(cls) && /\bbg-(gold|emerald|rose|amber|primary)\b/.test(cls)) {
        offenders.push(file.replace(SRC, "src/") + ": " + cls.slice(0, 90));
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    "text-slate-950 on a coloured fill is 1.93:1 in light mode:\n" + offenders.join("\n")
  );
});

test("solid gold fills label with on-gold, not a slate alias", () => {
  // Only SOLID bg-gold fills that style visible text. bg-gold/10 washes, gold
  // borders and progress-bar fills carry no label and are correctly excluded.
  const offenders = [];
  for (const file of FILES) {
    const src = readFileSync(file, "utf8");
    for (const line of src.split("\n")) {
      if (!/\bbg-gold\b(?!\/|-hover)/.test(line)) continue; // solid fill only
      if (!/\btext-/.test(line)) continue; // pure fill, no label to style
      if (/\btext-on-gold\b/.test(line)) continue;
      if (/^\s*(\/\/|\*|\/\*|import|export)/.test(line)) continue;
      offenders.push(file.replace(SRC, "src/") + ": " + line.trim().slice(0, 100));
    }
  }
  assert.deepEqual(
    offenders,
    [],
    "a solid gold fill must label with text-on-gold (raw slate on gold is 1.93:1 in light mode):\n" +
      offenders.join("\n")
  );
});
