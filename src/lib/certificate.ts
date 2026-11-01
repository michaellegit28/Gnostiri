import { createHash, createHmac } from "crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * certificate.ts — the verified season certificate (ROADMAP Phase 5).
 *
 * A winner of a season's Hall of Fame can download a PDF that says who they
 * are (a display name, never an email or an id), what they won, and a
 * verification code that ANYONE can re-derive from the published entry on
 * /verify. The code is the part that makes this a verified artifact rather
 * than a pretty picture: it is an HMAC-SHA256 over the five fields of the
 * engraved entry, keyed with LAUNCH_SECRET, so a forged PDF carries a code
 * that computes to nothing.
 *
 * The payload is EXACTLY:
 *   `${seasonSlug}:${tier}:${rank}:${groupName}:${rosterHash}`
 * where rosterHash is sha256 of the sorted rosterJson joined with ":".
 *
 * This module is the GENERATION half (it writes bytes). The CHECK half lives
 * in src/app/verify/page.tsx, which recomputes the same code for every row in
 * the hall and reports which one — if any — a pasted code belongs to. Nothing
 * is ever stored: the code is a function of the entry, so a changed entry
 * (a re-engraved rank, a renamed group) invalidates the old code by design.
 */

/** Verification codes are short enough to read out loud, long enough to not collide. */
export const VERIFICATION_CODE_LENGTH = 12;

/** Refined brass gold — the brand's 10% accent (see src/components/brand/Logo.tsx). */
const GOLD = rgb(0.776, 0.604, 0.18);
const INK = rgb(0.027, 0.043, 0.086);
const MUTED = rgb(0.4, 0.44, 0.52);
const PAPER = rgb(1, 1, 1);

/** A4 landscape in points: 842 x 595. */
const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;

/**
 * The five fields of an engraved Hall of Fame entry that the code covers.
 * Kept as a structural type so the route, the /verify page and the tests all
 * agree on the shape of what is being signed.
 */
export interface CertificateFields {
  seasonSlug: string;
  tier: number;
  rank: number;
  groupName: string;
  rosterJson: readonly string[];
}

/** Everything a certificate shows on the page (the entry plus its labels). */
export interface CertificateInput extends CertificateFields {
  seasonName: string;
  tierLabel: string;
  /** Display name only — the roster never carries an email or an id. */
  memberName: string;
  /** 1-based seat of this member inside the winning group. */
  memberSeat: number;
  avgStars: number;
  issuedAt: Date;
}

/** The signing key. Never a literal: it only ever lives in the environment. */
function certificateSecret(): string {
  return process.env.LAUNCH_SECRET || "";
}

/** sha256 of the sorted roster display names, joined by ":" — order-independent. */
export function rosterHash(roster: readonly string[]): string {
  return createHash("sha256")
    .update([...roster].sort().join(":"))
    .digest("hex");
}

/** The message the HMAC signs: the five documented fields, colon-separated. */
export function verificationPayload(fields: CertificateFields): string {
  return `${fields.seasonSlug}:${fields.tier}:${fields.rank}:${fields.groupName}:${rosterHash(fields.rosterJson)}`;
}

/**
 * The 12-character verification code for an engraved entry. Deterministic:
 * the same entry always produces the same code, so the /verify page can
 * recompute it rather than reading a stored one.
 */
export function verificationCode(fields: CertificateFields): string {
  return createHmac("sha256", certificateSecret())
    .update(verificationPayload(fields))
    .digest("hex")
    .slice(0, VERIFICATION_CODE_LENGTH);
}

/** Human placement for a group rank: 1 Champion, 2 Runner-up, 3 Third. */
export function rankLabel(rank: number): string {
  if (rank === 1) return "Champion";
  if (rank === 2) return "Runner-up";
  if (rank === 3) return "Third";
  return `Rank ${rank}`;
}

/**
 * WinAnsi-safe text: the standard PDF fonts only cover WinAnsi (ASCII plus
 * the Latin-1 supplement and its typographic punctuation), so a name carrying
 * a glyph outside that set is drawn with a placeholder rather than throwing
 * (a failed request is worse than a substituted letter).
 */
function winAnsiSafe(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const code = ch.codePointAt(0);
      if (code === undefined) return "?";
      if (code === 0x0a || (code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff)) return ch;
      return "?";
    })
    .join("");
}

/** Wrap on spaces so a long roster fits the page width without shrinking. */
function wrap(text: string, maxWidth: number, measure: (t: string) => number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate) <= maxWidth || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Build the certificate PDF. Returns the raw PDF bytes — the route turns them
 * into an attachment, the smoke script writes them to disk.
 */
export async function buildCertificatePdf(input: CertificateInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // The code the certificate carries — also written to the document
  // properties, where it survives as plain text in the file's Info dict.
  const code = verificationCode(input);
  pdf.setTitle(`Gnostiri Season Certificate — ${input.seasonName} · ${input.tierLabel} · ${input.groupName}`);
  pdf.setSubject(`Verified certificate for ${input.memberName} · verification code ${code}`);
  pdf.setKeywords(["gnostiri", input.seasonSlug, input.tierLabel, input.groupName, code]);
  pdf.setProducer("Gnostiri Global Ranking");

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);

  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: PAPER });
  page.drawRectangle({ x: 28, y: 28, width: PAGE_WIDTH - 56, height: PAGE_HEIGHT - 56, borderColor: GOLD, borderWidth: 2 });
  page.drawRectangle({ x: 36, y: 36, width: PAGE_WIDTH - 72, height: PAGE_HEIGHT - 72, borderColor: GOLD, borderWidth: 0.75 });

  const centre = (text: string, y: number, size: number, font: typeof serif, color = INK) => {
    const safe = winAnsiSafe(text);
    const width = font.widthOfTextAtSize(safe, size);
    page.drawText(safe, { x: (PAGE_WIDTH - width) / 2, y, size, font, color });
  };

  centre("GNOSTIRI", PAGE_HEIGHT - 92, 12, sansBold, GOLD);
  centre("Certified Season Victory", PAGE_HEIGHT - 138, 40, serifBold);

  // The headline the owner promised: season · tier · group, in one line.
  centre(
    `Season ${input.seasonName} · ${input.tierLabel} · ${input.groupName}`,
    PAGE_HEIGHT - 168,
    15,
    sans,
    INK,
  );

  centre("This certifies that", PAGE_HEIGHT - 232, 13, italic, MUTED);
  centre(input.memberName, PAGE_HEIGHT - 274, 32, serifBold, INK);
  centre(
    `finished in the Hall of Fame of ${input.tierLabel} as ${rankLabel(input.rank).toLowerCase()} of the tier`,
    PAGE_HEIGHT - 302,
    12,
    sans,
    MUTED,
  );

  // Fact grid: what was won, and when it was issued.
  const rows: { label: string; value: string }[] = [
    { label: "SEASON", value: input.seasonName },
    { label: "TIER", value: input.tierLabel },
    { label: "GROUP", value: input.groupName },
    { label: "PLACEMENT", value: `${rankLabel(input.rank)} (rank ${input.rank})` },
    { label: "GROUP AVERAGE", value: `${Math.round(input.avgStars).toLocaleString("en-GB")} stars` },
    {
      label: "ISSUED",
      value: input.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    },
  ];
  const gridTop = PAGE_HEIGHT - 350;
  const colX = [120, 340, 560];
  rows.forEach((row, i) => {
    const x = colX[i % 3];
    const y = gridTop - Math.floor(i / 3) * 54;
    page.drawText(row.label, { x, y, size: 8, font: sansBold, color: GOLD });
    page.drawText(winAnsiSafe(row.value), { x, y: y - 18, size: 12, font: sans, color: INK });
  });

  // The winning group — display names only, wrapped across two lines at most.
  page.drawText("WINNING GROUP", { x: 120, y: PAGE_HEIGHT - 486, size: 8, font: sansBold, color: GOLD });
  const roster = input.rosterJson.map((name) => winAnsiSafe(name)).join(" · ");
  const rosterLines = wrap(roster, PAGE_WIDTH - 260, (t) => sans.widthOfTextAtSize(t, 12));
  rosterLines.slice(0, 3).forEach((line, i) => {
    centre(line, PAGE_HEIGHT - 508 - i * 17, 12, sans, INK);
  });
  const seat = `Seat ${input.memberSeat} of ${input.rosterJson.length} in ${input.groupName}`;
  centre(seat, PAGE_HEIGHT - 508 - rosterLines.slice(0, 3).length * 17 - 4, 10, sans, MUTED);

  // Verification block: the code, and where to check it.
  const boxY = 92;
  page.drawRectangle({ x: 120, y: boxY, width: PAGE_WIDTH - 240, height: 62, borderColor: GOLD, borderWidth: 1, color: rgb(0.98, 0.97, 0.94) });
  page.drawText("VERIFICATION CODE", { x: 140, y: boxY + 42, size: 8, font: sansBold, color: MUTED });
  page.drawText(code, { x: 140, y: boxY + 16, size: 20, font: mono, color: INK });
  const hint = "Verify this certificate at /verify";
  const hintWidth = sans.widthOfTextAtSize(hint, 10);
  page.drawText(hint, { x: PAGE_WIDTH - 140 - hintWidth, y: boxY + 32, size: 10, font: sans, color: MUTED });
  const issued = `Issued ${input.issuedAt.toISOString().slice(0, 10)} · Gnostiri Global Ranking`;
  const issuedWidth = sans.widthOfTextAtSize(issued, 8);
  page.drawText(issued, { x: PAGE_WIDTH - 140 - issuedWidth, y: boxY + 16, size: 8, font: sans, color: MUTED });

  return pdf.save();
}
