// ROADMAP Phase 5 — season rewards: verified certificates and win cards.
//
// The three defect classes this suite kills:
//   - a certificate that is a pretty PDF with no way to check it (the code
//     must be an HMAC of the DOCUMENTED fields, recomputed live on /verify)
//   - a cross-member leak (a route that hands a certificate or a win card to
//     a member who is not the owner)
//   - PII on a card that is about to be posted publicly to WhatsApp Status
//
// Structure: the generation functions are imported and exercised for real
// (the PDF bytes, the HMAC payload), and the routes/surfaces are read as
// source and checked for the authorisation and privacy invariants they must
// carry — the same style as tests/ranking.test.mjs.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { extractPdfText } from "../src/lib/pdf.ts";
import {
  VERIFICATION_CODE_LENGTH,
  buildCertificatePdf,
  rankLabel,
  rosterHash,
  verificationCode,
  verificationPayload,
} from "../src/lib/certificate.ts";
import { deltaLabel, winCardSvg } from "../src/lib/win-card.ts";

const ROOT = new URL("..", import.meta.url);
const Q = (p) => `${ROOT.pathname}${p}`;

const read = (p) => readFileSync(Q(p), "utf8");

const CERT_LIB = read("src/lib/certificate.ts");
const CERT_ROUTE = read("src/app/api/ranking/certificate/route.ts");
const CARD_LIB = read("src/lib/win-card.ts");
const CARD_ROUTE = read("src/app/api/ranking/win-card/route.ts");
const VERIFY_PAGE = read("src/app/verify/page.tsx");
const HALL_PAGE = read("src/app/league/hall-of-fame/page.tsx");
const LADDER_PAGE = read("src/app/league/ladder/page.tsx");
const CARD_BUTTON = read("src/components/ranking/WinCardButton.tsx");

/** A real-shaped engraved entry — same fields the season-close route writes. */
const ENTRY = {
  seasonSlug: "s3-2026",
  tier: 4,
  rank: 1,
  groupName: "Vanguard III",
  rosterJson: ["Zainab Bello", "Michael Fortune", "Aisha Danjuma"],
};

/** The single template literal that renders the whole card. */
function svgTemplate() {
  const start = CARD_LIB.indexOf("export function winCardSvg");
  assert.ok(start > -1, "winCardSvg is missing");
  const first = CARD_LIB.indexOf("`", start);
  const last = CARD_LIB.indexOf("`", first + 1);
  assert.ok(first > -1 && last > first, "winCardSvg has no single template literal");
  return CARD_LIB.slice(first, last + 1);
}

// ── 1. The verification code is an HMAC of the DOCUMENTED payload ──────────
test("certificate: the verification code is an HMAC of the documented fields", () => {
  // The payload is exactly `${seasonSlug}:${tier}:${rank}:${groupName}:${rosterHash}`.
  assert.match(
    verificationPayload(ENTRY),
    /^s3-2026:4:1:Vanguard III:[0-9a-f]{64}$/,
    "payload must be seasonSlug:tier:rank:groupName:rosterHash",
  );

  // The source must say so, in that order — not a drifted order of fields.
  const body = CERT_LIB.slice(CERT_LIB.indexOf("export function verificationPayload"), CERT_LIB.indexOf("export function verificationCode"));
  assert.match(body, /return `/, "verificationPayload returns a template literal");
  const payloadLine = body.split("\n").find((l) => l.includes("return `"));
  assert.ok(payloadLine, "verificationPayload has a return statement");
  const fields = [...payloadLine.matchAll(/\$\{([A-Za-z.]*?)(?:\(([^)]*)\))?\}/g)].map((m) => m[1].replace(/^[a-z]+\./, ""));
  assert.deepEqual(
    fields,
    ["seasonSlug", "tier", "rank", "groupName", "rosterHash"],
    "payload fields must be the five documented ones, in order",
  );

  // It is an HMAC-SHA256 keyed with LAUNCH_SECRET, truncated to 12 chars.
  assert.match(CERT_LIB, /createHmac\("sha256",\s*certificateSecret\(\)\)/, "must HMAC-SHA256 with the launch secret");
  assert.match(CERT_LIB, /LAUNCH_SECRET/, "the key must come from LAUNCH_SECRET");
  assert.match(CERT_LIB, /\.digest\("hex"\)\s*\.slice\(0, VERIFICATION_CODE_LENGTH\)/, "hex digest truncated to 12");
  assert.equal(VERIFICATION_CODE_LENGTH, 12);
});

test("certificate: rosterHash is sha256 of the sorted rosterJson joined", () => {
  const expected = createHash("sha256").update([...ENTRY.rosterJson].sort().join(":")).digest("hex");
  assert.equal(rosterHash(ENTRY.rosterJson), expected);
  // Order-independence: a roster listed differently signs the same code.
  assert.equal(rosterHash([...ENTRY.rosterJson].reverse()), expected);
  // A roster change must change the code.
  assert.notEqual(rosterHash([...ENTRY.rosterJson, "New Member"]), expected);
});

test("certificate: a caller can recompute the code without any repo code", () => {
  const recomputed = createHmac("sha256", "test-secret")
    .update(`${ENTRY.seasonSlug}:${ENTRY.tier}:${ENTRY.rank}:${ENTRY.groupName}:${rosterHash(ENTRY.rosterJson)}`)
    .digest("hex")
    .slice(0, 12);
  process.env.LAUNCH_SECRET = "test-secret";
  const code = verificationCode(ENTRY);
  assert.equal(code, recomputed, "verificationCode must equal a hand-rolled HMAC of the documented payload");
  assert.match(code, /^[0-9a-f]{12}$/, "12 lowercase hex characters");
  // Deterministic, and sensitive to every field it covers.
  assert.equal(verificationCode(ENTRY), code);
  assert.notEqual(verificationCode({ ...ENTRY, rank: 2 }), code);
  assert.notEqual(verificationCode({ ...ENTRY, tier: 5 }), code);
  assert.notEqual(verificationCode({ ...ENTRY, groupName: "Vanguard IV" }), code);
  assert.notEqual(verificationCode({ ...ENTRY, rosterJson: [...ENTRY.rosterJson, "Intruder"] }), code);
  delete process.env.LAUNCH_SECRET;
});

test("certificate: buildCertificatePdf emits real PDF bytes", async () => {
  const bytes = await buildCertificatePdf({
    ...ENTRY,
    seasonName: "Season 3 (2026)",
    tierLabel: "Vanguard",
    memberName: "Michael Fortune",
    memberSeat: 2,
    avgStars: 1234,
    issuedAt: new Date("2026-12-01T00:00:00.000Z"),
  });
  assert.equal(Buffer.from(bytes.subarray(0, 5)).toString("latin1"), "%PDF-", "a PDF must start with %PDF-");
  assert.ok(bytes.length > 1000, "a certificate is more than an empty page");
  // The code is in the file: PRINTED on the page (extracted with the repo's
  // own unpdf extractor), and in the document properties.
  const code = verificationCode(ENTRY);
  const pages = await extractPdfText(Buffer.from(bytes));
  const text = pages.pages.join("\n");
  assert.ok(text.includes(code), "the printed page carries the verification code");
  assert.ok(text.includes("Certified Season Victory"), "the page carries its title");
  assert.ok(text.includes("Vanguard · Vanguard III"), "the page carries the season · tier · group line");
  assert.ok(text.includes("Michael Fortune"), "the page carries the member's display name");
  assert.ok(text.includes("Zainab Bello"), "the page carries the winning roster");
  assert.ok(!text.includes("gnostiri.test"), "no email is printed on the certificate");
  const reloaded = await PDFDocument.load(bytes);
  assert.equal(reloaded.getPageCount(), 1, "one page");
  assert.ok(String(reloaded.getSubject()).includes(code), "the document properties carry the code too");
});

// ── 2. The certificate route authorises, and never fakes ───────────────────
test("certificate route: the caller must be signed in and be that member", () => {
  assert.match(CERT_ROUTE, /getCurrentUser/, "reuses the Firebase session gate");
  assert.match(CERT_ROUTE, /if \(!user\)[\s\S]{0,140}status: 401/, "signed-out callers get a 401");
  assert.match(CERT_ROUTE, /prisma\.user\.findUnique\(|prisma\.user\.findMany\(/, "resolves the member from the User row");
  // Membership is checked against the ROSTER, which stores display names.
  assert.match(CERT_ROUTE, /entry\.rosterJson\.includes\(/, "the entry must be one the member is engraved on");
  assert.ok(CERT_ROUTE.includes("displayHandle"), "roster matching goes through the display name");
  assert.match(CERT_ROUTE, /requireAdmin/, "an admin may fetch another member's certificate");
  assert.match(CERT_ROUTE, /status: 403/, "a stranger gets a 403, not the bytes");
});

test("certificate route: a JSON 404 when nothing is engraved — never a fake certificate", () => {
  assert.match(CERT_ROUTE, /status: 404/, "missing engraving is a 404");
  assert.match(CERT_ROUTE, /No Hall of Fame certificate for that member in this season/, "the 404 says why, in JSON");
  assert.doesNotMatch(CERT_ROUTE, /status: (200|201)[\s\S]{0,200}fake/i, "no code path mints a placeholder");
  assert.match(CERT_ROUTE, /if \(!entry\)[\s\S]*?return NextResponse\.json/, "the no-entry branch returns before any PDF is built");
});

test("certificate route: returns the PDF as an attachment", () => {
  assert.match(CERT_ROUTE, /"Content-Type": "application\/pdf"/, "content type is application/pdf");
  assert.match(CERT_ROUTE, /attachment; filename=/, "Content-Disposition forces a download");
  assert.match(CERT_ROUTE, /buildCertificatePdf/, "the bytes come from the real generator");
  assert.match(CERT_ROUTE, /Buffer\.from\(pdf\)/, "the Uint8Array is handed to the response");
});

// ── 3. /verify recomputes rather than trusting a stored code ───────────────
test("verify page: recomputes the HMAC of every entry, trusting nothing stored", () => {
  assert.match(VERIFY_PAGE, /prisma\.hallOfFameEntry\.findMany/, "reads the hall of fame");
  assert.match(VERIFY_PAGE, /verificationCode\(/, "recomputes the code from the entry");
  assert.match(VERIFY_PAGE, /find\([\s\S]*?verificationCode\([\s\S]*?wanted/, "scans every entry for the pasted code");
  // There is no stored-code column to trust: nothing calls a `code` field.
  assert.doesNotMatch(VERIFY_PAGE, /verificationCode\s*[:=]\s*entry\.|\bentry\.code\b|prisma\.certificate/, "no stored code is ever read");
  assert.ok(VERIFY_PAGE.includes("No matching certificate"), "an unmatched code is reported, not silently accepted");
  assert.match(VERIFY_PAGE, /searchParams/, "the code arrives as a query param");
  assert.match(VERIFY_PAGE, /<form[\s\S]*?name="code"/, "there is a paste field");
  assert.match(VERIFY_PAGE, /method="get"/, "the form is a plain GET");
});

// ── 4. The win card: 9:16, display name only ───────────────────────────────
test("win card: the SVG is 1080x1920 (9:16, WhatsApp Status)", () => {
  const svg = winCardSvg({
    handle: "Michael Fortune",
    tierLabel: "Vanguard",
    delta: 3,
    context: "Pod quickfire · Vanguard III",
    title: "Pod victory",
    dateLabel: "1 Dec 2026",
  });
  assert.match(svg, /<svg[^>]*width="1080"/, "width is 1080");
  assert.match(svg, /<svg[^>]*height="1920"/, "height is 1920");
  assert.match(svg, /viewBox="0 0 1080 1920"/, "viewBox matches the raster");
  assert.ok(CARD_LIB.includes("WIN_CARD_WIDTH = 1080") && CARD_LIB.includes("WIN_CARD_HEIGHT = 1920"), "the constants are exported");
  // The required content.
  assert.ok(svg.includes("GNOSTIRI"), "the Gnostiri mark is on the card");
  assert.ok(svg.includes("Pod victory".toUpperCase()), "the card kind is shown");
  assert.ok(svg.includes(">Vanguard<"), "the tier is shown large");
  assert.ok(svg.includes("+3 Stars"), "the delta is shown");
  assert.ok(svg.includes("Pod quickfire · Vanguard III"), "the context line is shown");
  assert.ok(svg.includes("1 Dec 2026"), "the date is shown");
  assert.match(svg, /url\(#goldFill\)/, "a gold gradient is used");
});

test("win card: no PII is reachable from the template — display names only", () => {
  const template = svgTemplate();
  for (const forbidden of ["email", "userId", "user.id", "rosterJson", "roster", "uid", "firebase"]) {
    assert.ok(!template.includes(forbidden), `the SVG template must not contain ${forbidden}`);
  }
  // Only one identity field exists in the whole module.
  assert.ok(CARD_LIB.includes("input.handle"), "the card draws the display handle only");
  assert.doesNotMatch(CARD_LIB, /\.email\b/, "win-card.ts never reads an email anywhere");
  // Everything caller-supplied is escaped before it enters the template.
  assert.match(CARD_LIB, /function esc\(/, "input is XML-escaped");
  const hostile = winCardSvg({
    handle: "<script>alert(1)</script>",
    tierLabel: "Vanguard & Sons",
    delta: 3,
    context: "x\" onload=\"y",
    title: "Rank up",
    dateLabel: "1 Dec 2026",
  });
  assert.ok(!hostile.includes("<script>"), "a hostile handle cannot inject markup");
  assert.ok(hostile.includes("&lt;script&gt;"), "the handle is escaped instead");
  assert.ok(hostile.includes("Vanguard &amp; Sons"), "the tier label is escaped");
});

// ── 5. The win-card route authorises per variant ───────────────────────────
test("win-card route: returns a PNG attachment, cached privately", () => {
  assert.match(CARD_ROUTE, /"Content-Type": "image\/png"/, "content type is image/png");
  assert.match(CARD_ROUTE, /attachment; filename=/, "the card downloads rather than renders inline");
  assert.match(CARD_ROUTE, /"Cache-Control": "private, max-age=3600"/, "exactly the documented cache header");
  assert.match(CARD_ROUTE, /\.png\(\)\.toBuffer\(\)/, "rasterised through sharp");
  assert.match(CARD_ROUTE, /Buffer\.from\(winCardSvg\(/, "the bytes come from the shared renderer");
});

test("win-card route: the match variant requires a seat in that pod", () => {
  assert.match(CARD_ROUTE, /where: \{ matchId, userId: user\.id \}/, "membership is read from the caller's own seat");
  assert.match(CARD_ROUTE, /You are not a member of that pod/, "a non-member is told so");
  assert.match(CARD_ROUTE, /status: 403/, "and gets a 403, not a card");
  // The delta comes from the caller's own placement in the pod.
  assert.match(CARD_ROUTE, /rankPodMembers\(/, "placement is derived by the ranking engine");
  assert.match(CARD_ROUTE, /podStars\(placement\)/, "the delta is podStars of that placement");
});

test("win-card route: the rank-up variant is bounded by the caller's own ledger", () => {
  assert.match(CARD_ROUTE, /prisma\.rankState\.findUnique\(\{ where: \{ userId: user\.id \} \}\)/, "the tier comes from the caller's own RankState");
  assert.match(CARD_ROUTE, /tierFor\(rankState\.stars\) !== tierParam/, "a spoofed tier is rejected");
  assert.match(CARD_ROUTE, /prisma\.starLedger\.findFirst\(/, "the delta is checked against the ledger");
  assert.match(CARD_ROUTE, /lastAward\.delta !== deltaParam/, "a spoofed delta is rejected");
  assert.match(CARD_ROUTE, /delta must equal your most recent star award/, "and the caller is told why");
});

test("win-card route: no PII is passed into the renderer", () => {
  const calls = [...CARD_ROUTE.matchAll(/await toPng\(\{[\s\S]*?\}\)/g)].map((m) => m[0]);
  assert.ok(calls.length >= 2, "both variants call the shared renderer");
  for (const call of calls) {
    assert.doesNotMatch(call, /email|userId|rosterJson|roster|user\.id/, "the renderer call may not carry PII fields");
    assert.ok(/handle: displayHandle\(user\.name\)/.test(call), "the only identity passed is a display name");
  }
});

// ── 6. The surfaces expose both artifacts ──────────────────────────────────
test("surfaces: the Hall of Fame offers a certificate to its own members only", () => {
  assert.match(HALL_PAGE, /canDownload\(entry\.rosterJson\)/, "the button is gated on roster membership");
  assert.match(HALL_PAGE, /roster\.includes\(myHandle\)/, "server-checked against the display name");
  assert.match(HALL_PAGE, /myHandle = user \? displayHandle\(user\.name\) : null/, "the handle comes from the signed-in member's own User row");
  assert.match(HALL_PAGE, /Download certificate/, "the CTA exists");
  assert.match(HALL_PAGE, /\/api\/ranking\/certificate\?season=/, "and it hits the certificate route");
  assert.match(
    HALL_PAGE,
    /member=\$\{encodeURIComponent\(user!\.id\)\}/,
    "the link names the caller by user id, which the route re-checks against the row",
  );
  assert.match(HALL_PAGE, /href="\/verify"/, "a Verify a certificate link is present");
  assert.match(HALL_PAGE, /Verify a certificate/, "with its label");
});

test("surfaces: the ladder offers win cards, sized for WhatsApp Status", () => {
  assert.match(LADDER_PAGE, /from "@\/components\/ranking\/WinCardButton"/, "the ladder renders the shared button");
  assert.match(LADDER_PAGE, /<WinCardButton[\s\S]*?tier=\{tier\}[\s\S]*?delta=\{lastAward\.delta\}/, "the rank-up card uses the caller's own last award");
  assert.match(LADDER_PAGE, /<WinCardButton[\s\S]*?matchId=\{seat\.match\.id\}/, "the pod card is per match");
  assert.match(LADDER_PAGE, /prisma\.starLedger\.findFirst\(/, "the ladder reads the caller's own ledger row for the delta");
  assert.match(LADDER_PAGE, /Share win card/, "the CTA exists");

  assert.match(CARD_BUTTON, /\/api\/ranking\/win-card\?/, "the button hits the win-card route");
  assert.match(CARD_BUTTON, /anchor\.download = /, "it triggers a download");
  assert.ok(CARD_BUTTON.includes("Sized for WhatsApp Status"), "the one-line hint is present");
});

test("surfaces: rank labels are honest about placement", () => {
  assert.equal(rankLabel(1), "Champion");
  assert.equal(rankLabel(2), "Runner-up");
  assert.equal(rankLabel(3), "Third");
  assert.equal(rankLabel(7), "Rank 7");
  assert.equal(deltaLabel(3), "+3 Stars");
  assert.equal(deltaLabel(-2), "-2 Stars");
  assert.equal(deltaLabel(0), "0 Stars");
});
