import { extractText } from "unpdf";

/**
 * pdf.ts — in-memory PDF text extraction for the Desk pipeline.
 *
 * The source PDF is NEVER stored (ROADMAP.md Phase 3 rule): the buffer arrives
 * from the upload route, unpdf extracts its text, and the buffer goes out of
 * scope. Only processed artifacts (notes, quiz items, tasks) persist.
 *
 * Failure taxonomy:
 *   - "invalid"   — not a PDF, or an empty upload (rejected before parsing)
 *   - "encrypted" — password-protected PDF: no text can be extracted
 *   - "parse"     — pdf.js itself failed (corrupt structure)
 * A scanned PDF is NOT an error here: it parses cleanly and yields empty
 * pages, which the pipeline maps to status "needs-ai" with an honest note.
 */

export type PdfErrorCode = "invalid" | "encrypted" | "parse";

export class PdfExtractionError extends Error {
  code: PdfErrorCode;

  constructor(code: PdfErrorCode, message: string) {
    super(message);
    this.name = "PdfExtractionError";
    this.code = code;
  }
}

export interface ExtractedPdfText {
  pages: string[];
  pageCount: number;
}

/** Classify a pdf.js/unpdf throw into the failure taxonomy above. */
function classify(error: unknown): PdfExtractionError {
  const message = (error instanceof Error ? error.message : String(error)) || "";
  const name = error instanceof Error ? error.name : "";
  if (/password|encrypt/i.test(message) || name === "PasswordException") {
    return new PdfExtractionError("encrypted", "PDF is password-protected — decrypt it before uploading.");
  }
  return new PdfExtractionError("parse", `PDF could not be parsed: ${message.slice(0, 200)}`);
}

/** Uint8Array view copied off the pooled Buffer — pdf.js wants a plain view. */
function toBytes(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer);
}

/**
 * Extract per-page text from a PDF buffer. Pages keep their order so the
 * chunker, the hasher, and the reader all see one consistent document.
 */
export async function extractPdfText(buffer: Buffer): Promise<ExtractedPdfText> {
  if (!buffer || buffer.length === 0) {
    throw new PdfExtractionError("invalid", "Empty upload — nothing to extract.");
  }
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new PdfExtractionError("invalid", "Not a PDF — file does not start with the %PDF- header.");
  }

  let result: { text: string[]; totalPages: number };
  try {
    result = await extractText(toBytes(buffer), { mergePages: false });
  } catch (error) {
    throw classify(error);
  }

  const pages = (result.text ?? []).map((page) => String(page ?? ""));
  // Scanned/image-only PDFs parse but carry no text layer: pages come back
  // empty or whitespace. The caller normalises and decides "needs-ai".
  return { pages, pageCount: result.totalPages ?? pages.length };
}
