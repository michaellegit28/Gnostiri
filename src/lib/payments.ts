// Pure payment-provider primitives: webhook signature verification + Paystack
// event classification. NO Prisma, NO fetch, NO env reads — this module must
// stay importable from `node --test` with no database, no network and no real
// secrets (tests/payments-paystack.test.mjs drives it with dummy keys).
//
// Paystack signature rules verified against
// https://paystack.com/docs/payments/webhooks/ (fetched 2026-11-25):
//
//  1. `x-paystack-signature` — lowercase-hex HMAC-SHA512 (128 hex chars) of the
//     RAW request body, keyed with the account SECRET KEY (sk_…). No timestamp.
//     (The historical sha256 reading was wrong — Paystack has always used
//     SHA512 for this header.)
//  2. `Paystack-Signature: t=<unix-seconds>,v1=<keyid>:<hex>` — the newer
//     dashboard signing-secret scheme (whsec_…): HMAC-SHA512 of
//     `${t}.${rawBody}` keyed with the WHOLE signing secret including the
//     `whsec_` prefix, ±300 s clock tolerance, and ANY v1 entry may match.
//
// The docs keep both schemes live while an account still holds a secret key, so
// both are honoured here: when a signing secret is configured AND the newer
// header is present it is authoritative; otherwise the secret-key header is
// verified. A request with no verifiable scheme is rejected (fail closed).
// The caller reads the raw body BEFORE any JSON parsing — re-serialised JSON
// never re-matches the signature.

import { createHash, createHmac, timingSafeEqual } from "crypto";

export type PaystackSignatureScheme = "signing-secret" | "secret-key";

export interface PaystackVerifyEnv {
  /** PAYSTACK_SECRET_KEY (sk_…, test or live). */
  secretKey?: string | null;
  /** PAYSTACK_WEBHOOK_SECRET (whsec_…, dashboard signing secret). */
  webhookSecret?: string | null;
}

const SHA512_HEX_128 = /^[0-9a-f]{128}$/;
const CLOCK_TOLERANCE_SECONDS = 300;

interface ParsedSignatureHeader {
  t: number;
  entries: Array<{ kid: string; hex: string }>;
}

/** Parse `t=…,v1=kid:hex,v1=kid:hex` per the Paystack docs sample. null if malformed. */
function parseSigningHeader(header: string): ParsedSignatureHeader | null {
  let t: number | null = null;
  const entries: Array<{ kid: string; hex: string }> = [];
  for (const part of header.split(",")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key === "t") {
      // Docs sample: a second t, or a non-numeric t, invalidates the header.
      if (t !== null || !/^[0-9]+$/.test(value)) return null;
      t = Number(value);
    } else if (key === "v1") {
      const colon = value.indexOf(":");
      if (colon !== -1) entries.push({ kid: value.slice(0, colon), hex: value.slice(colon + 1) });
    }
    // Any other key (future fields) is ignored per the docs.
  }
  if (t === null || entries.length === 0) return null;
  return { t, entries };
}

/**
 * Verify a Paystack webhook. Returns the scheme that matched, or null when the
 * request must be rejected. `now` (unix seconds) is injectable for tests.
 */
export function verifyPaystackEvent(
  rawBody: string,
  headers: {
    paystackSignature?: string | null; // Paystack-Signature
    xPaystackSignature?: string | null; // X-Paystack-Signature
  },
  env: PaystackVerifyEnv,
  now: number = Math.floor(Date.now() / 1000)
): PaystackSignatureScheme | null {
  const newerHeader = headers.paystackSignature?.trim() || "";
  if (newerHeader && env.webhookSecret) {
    const parsed = parseSigningHeader(newerHeader);
    if (!parsed) return null;
    if (Math.abs(now - parsed.t) > CLOCK_TOLERANCE_SECONDS) return null;
    const expected = createHmac("sha512", env.webhookSecret)
      .update(`${parsed.t}.${rawBody}`, "utf8")
      .digest();
    for (const { hex } of parsed.entries) {
      if (!SHA512_HEX_128.test(hex)) continue;
      const provided = Buffer.from(hex, "hex");
      if (provided.length === expected.length && timingSafeEqual(provided, expected)) {
        return "signing-secret";
      }
    }
    // A present newer header is authoritative: never fall back to the legacy
    // header when it fails — an attacker could otherwise append junk to dodge
    // the timestamp window.
    return null;
  }

  const legacyHeader = headers.xPaystackSignature?.trim() || "";
  if (legacyHeader && env.secretKey) {
    if (!SHA512_HEX_128.test(legacyHeader)) return null;
    const expected = createHmac("sha512", env.secretKey).update(rawBody, "utf8").digest();
    const provided = Buffer.from(legacyHeader, "hex");
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) {
      return "secret-key";
    }
    return null;
  }

  // No configured scheme matches the headers present → reject.
  return null;
}

// ---------------------------------------------------------------------------
// Event classification. Names are Paystack's actual event names (docs table,
// 2026-11-25): charge.success, refund.processed, refund.pending/failed,
// subscription.disable / subscription.not_renew, charge.dispute.create/resolve.
// The checkout uses one-off transactions (amount + currency), so refunds bind
// to our Subscription rows via the transaction reference; Paystack subscription
// codes never match a row and are treated as informational.
// ---------------------------------------------------------------------------

export interface PaystackEventClassification {
  /** grant = activate/extend premium; cancel = revoke; ignore = acknowledge only. */
  action: "grant" | "cancel" | "ignore";
  providerRef: string;
  appSubscriptionId: string;
  paid: boolean;
  cancelled: boolean;
  /** Reported charge currency (ISO 4217) on charge.success, when present. */
  currency?: string;
  /** Reported charge amount in the smallest currency unit, when present. */
  amount?: number;
}

interface RawPaystackEvent {
  event?: unknown;
  data?: {
    reference?: unknown;
    status?: unknown;
    amount?: unknown;
    currency?: unknown;
    transaction_reference?: unknown;
    transaction?: { reference?: unknown } | null;
    subscription_code?: unknown;
    metadata?: { subscriptionId?: unknown } | null;
  } | null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function classifyPaystackEvent(event: RawPaystackEvent): PaystackEventClassification {
  const name = asString(event.event);
  const data = event.data ?? {};
  const base: PaystackEventClassification = {
    action: "ignore",
    providerRef: "",
    appSubscriptionId: "",
    paid: false,
    cancelled: false,
  };

  if (name === "charge.success") {
    const status = asString(data.status);
    const providerRef = asString(data.reference);
    const paid = status === "success" && providerRef !== "";
    return {
      ...base,
      action: paid ? "grant" : "ignore",
      providerRef,
      appSubscriptionId: asString(data.metadata?.subscriptionId),
      paid,
      currency: typeof data.currency === "string" ? data.currency : undefined,
      amount: typeof data.amount === "number" ? data.amount : undefined,
    };
  }

  if (name === "refund.processed") {
    // Money actually returned to the learner → revoke access. Bind on the
    // transaction reference (our Subscription.providerRef).
    const providerRef =
      asString(data.transaction_reference) ||
      asString(data.transaction?.reference) ||
      asString(data.reference);
    return { ...base, action: providerRef ? "cancel" : "ignore", providerRef, cancelled: true };
  }

  // subscription.disable / subscription.not_renew / charge.dispute.* /
  // invoice.* / transfer.*: no row binding exists for Paystack subscription or
  // dispute objects in the one-off-charge model — acknowledge, never guess.
  return base;
}

/**
 * Idempotency key for the webhook handler. Paystack resends the SAME payload
 * byte-identical on retries/resends, so a content hash dedupes replays without
 * trusting any provider-supplied id.
 */
export function paystackEventId(rawBody: string): string {
  return `paystack:${createHash("sha256").update(rawBody, "utf8").digest("hex")}`;
}
