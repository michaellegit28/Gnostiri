// Paystack wiring contract (payments-lane round 1).
//
// Kills three shipped defects and locks the go-live path for the moment the
// owner uploads real credentials:
//
//   1. SIGNATURE ALGORITHM — the webhook verified x-paystack-signature with
//      HMAC-SHA256. Paystack signs webhook payloads with HMAC-SHA512 of the RAW
//      body using the secret key (docs, verified 2026-11-25). This suite signs
//      a sample payload with BOTH algorithms using dummy secrets and asserts
//      the handler logic accepts only the correct one and rejects tampered,
//      wrong-key, malformed and replayed requests. Pure crypto: no network,
//      no real credentials.
//   2. CHECKOUT — the Paystack path used to POST /plan (minting a NEW Paystack
//      plan on EVERY checkout request). The route now initializes a one-off
//      transaction with amount + currency directly, guarded so that missing
//      credentials fail BEFORE any database row is created (inert without
//      creds: 503, no writes).
//   3. ENTITLEMENT — activation used to set only tier:"premium", leaving
//      Subscription.plan at its "free" default. getEntitlements() only maps
//      tier→prime when plan is NOT a valid PlanId, so paid users were locked
//      out of every gate. Activation now sets plan:"prime" — the only plan
//      that passes hasPremiumAccess for university, highschool AND extras.
//
// Also locks the pricing source: one table (PRIME_PRICES in src/lib/plans.ts)
// feeds both the charged amount and the /pricing page display.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  classifyPaystackEvent,
  paystackEventId,
  verifyPaystackEvent,
} from "../src/lib/payments.ts";
import {
  PRIME_PRICES,
  formatPrimePrice,
  primePriceForCountry,
} from "../src/lib/plans.ts";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DUMMY_SECRET_KEY = "sk_test_dummy_gnostiri_payments_lane";
const DUMMY_WEBHOOK_SECRET = "whsec_dummy_gnostiri_signing_secret";

const SAMPLE_BODY = JSON.stringify({
  event: "charge.success",
  data: {
    reference: "sub_1demo_reference",
    status: "success",
    amount: 250000,
    currency: "NGN",
    metadata: { subscriptionId: "sub_1demo", userId: "user_1", period: "monthly" },
  },
});

function hmacHex(algorithm, secret, payload) {
  return createHmac(algorithm, secret).update(payload, "utf8").digest("hex");
}

const now = Math.floor(Date.now() / 1000);

describe("Paystack webhook signature (docs-verified 2026-11-25)", () => {
  test("accepts the documented HMAC-SHA512 signature of the raw body (secret key)", () => {
    const sig = hmacHex("sha512", DUMMY_SECRET_KEY, SAMPLE_BODY);
    assert.match(sig, /^[0-9a-f]{128}$/, "Paystack signatures are 128 lowercase hex chars");
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: sig }, { secretKey: DUMMY_SECRET_KEY }, now),
      "secret-key"
    );
  });

  test("REJECTS the old HMAC-SHA256 verification (the shipped defect)", () => {
    const sha256Sig = hmacHex("sha256", DUMMY_SECRET_KEY, SAMPLE_BODY);
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: sha256Sig }, { secretKey: DUMMY_SECRET_KEY }, now),
      null,
      "a sha256 signature must never verify — Paystack signs with SHA512"
    );
  });

  test("rejects tampered bodies, wrong secrets and malformed signatures", () => {
    const sig = hmacHex("sha512", DUMMY_SECRET_KEY, SAMPLE_BODY);
    const tampered = SAMPLE_BODY.replace("charge.success", "charge.failure");
    assert.notEqual(tampered, SAMPLE_BODY);
    assert.equal(
      verifyPaystackEvent(tampered, { xPaystackSignature: sig }, { secretKey: DUMMY_SECRET_KEY }, now),
      null,
      "signature over the original body must not verify a modified body"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: sig }, { secretKey: "sk_test_other_key" }, now),
      null,
      "wrong secret key"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: sig.toUpperCase() }, { secretKey: DUMMY_SECRET_KEY }, now),
      null,
      "signatures are lowercase hex per docs"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: sig.slice(0, 127) }, { secretKey: DUMMY_SECRET_KEY }, now),
      null,
      "truncated signature"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: "" }, { secretKey: DUMMY_SECRET_KEY }, now),
      null,
      "empty header"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: sig }, {}, now),
      null,
      "inert without credentials: no secret configured → reject even a well-formed header"
    );
    assert.equal(verifyPaystackEvent(SAMPLE_BODY, {}, { secretKey: DUMMY_SECRET_KEY }, now), null, "no header");
  });

  test("accepts the newer Paystack-Signature t/v1 scheme (dashboard signing secret)", () => {
    const sig = createHmac("sha512", DUMMY_WEBHOOK_SECRET)
      .update(`${now}.${SAMPLE_BODY}`, "utf8")
      .digest("hex");
    const header = `t=${now},v1=whk_demo1:${sig}`;
    assert.equal(
      verifyPaystackEvent(
        SAMPLE_BODY,
        { paystackSignature: header },
        { webhookSecret: DUMMY_WEBHOOK_SECRET },
        now
      ),
      "signing-secret"
    );
  });

  test("v1 scheme: any matching v1 entry wins; timestamp window is enforced", () => {
    const stale = now - 400;
    const future = now + 400;
    const nearPast = now - 299; // inside the 300s tolerance
    const sign = (t) =>
      createHmac("sha512", DUMMY_WEBHOOK_SECRET).update(`${t}.${SAMPLE_BODY}`, "utf8").digest("hex");
    assert.equal(
      verifyPaystackEvent(
        SAMPLE_BODY,
        { paystackSignature: `t=${nearPast},v1=whk_a:${sign(nearPast)}` },
        { webhookSecret: DUMMY_WEBHOOK_SECRET },
        now
      ),
      "signing-secret",
      "±300s tolerance accepted"
    );
    assert.equal(
      verifyPaystackEvent(
        SAMPLE_BODY,
        { paystackSignature: `t=${stale},v1=whk_a:${sign(stale)}` },
        { webhookSecret: DUMMY_WEBHOOK_SECRET },
        now
      ),
      null,
      "stale timestamp rejected (replay window)"
    );
    assert.equal(
      verifyPaystackEvent(
        SAMPLE_BODY,
        { paystackSignature: `t=${future},v1=whk_a:${sign(future)}` },
        { webhookSecret: DUMMY_WEBHOOK_SECRET },
        now
      ),
      null,
      "future timestamp rejected"
    );
    // Two v1 entries (secret rotation overlap): the second matches.
    assert.equal(
      verifyPaystackEvent(
        SAMPLE_BODY,
        { paystackSignature: `t=${now},v1=whk_old:${sign(now).slice(0, 64)}xxxx,v1=whk_new:${sign(now)}` },
        { webhookSecret: DUMMY_WEBHOOK_SECRET },
        now
      ),
      "signing-secret"
    );
  });

  test("v1 scheme: malformed headers and the authoritative-header rule", () => {
    const goodSig = createHmac("sha512", DUMMY_WEBHOOK_SECRET)
      .update(`${now}.${SAMPLE_BODY}`, "utf8")
      .digest("hex");
    const legacySig = hmacHex("sha512", DUMMY_SECRET_KEY, SAMPLE_BODY);
    const env = { secretKey: DUMMY_SECRET_KEY, webhookSecret: DUMMY_WEBHOOK_SECRET };

    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { paystackSignature: "t=abc,v1=whk_a:zz" }, env, now),
      null,
      "non-numeric t"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { paystackSignature: `t=${now}` }, env, now),
      null,
      "header without any v1 entry"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { paystackSignature: `t=${now},v1=whk_a:${goodSig}ff` }, env, now),
      null,
      "a bad v1 with a VALID legacy header must still fail — the present newer header is authoritative"
    );
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { paystackSignature: `t=${now},v1=nocolon,v1=whk_b:${goodSig}` }, env, now),
      "signing-secret",
      "entries without a colon are skipped, matching v1 accepted"
    );
    // Legacy header alone still verifies with the secret key when configured.
    assert.equal(
      verifyPaystackEvent(SAMPLE_BODY, { xPaystackSignature: legacySig }, env, now),
      "secret-key"
    );
  });
});

describe("Paystack event classification", () => {
  test("charge.success → grant with binding + charge audit fields", () => {
    const c = classifyPaystackEvent(JSON.parse(SAMPLE_BODY));
    assert.equal(c.action, "grant");
    assert.equal(c.paid, true);
    assert.equal(c.cancelled, false);
    assert.equal(c.providerRef, "sub_1demo_reference");
    assert.equal(c.appSubscriptionId, "sub_1demo");
    assert.equal(c.currency, "NGN");
    assert.equal(c.amount, 250000);
  });

  test("charge.success with a non-success status never grants", () => {
    const c = classifyPaystackEvent({
      event: "charge.success",
      data: { reference: "ref_1", status: "failed", metadata: { subscriptionId: "sub_1" } },
    });
    assert.equal(c.action, "ignore");
    assert.equal(c.paid, false);
  });

  test("charge.success without a reference never grants (no empty binding)", () => {
    const c = classifyPaystackEvent({
      event: "charge.success",
      data: { status: "success", metadata: { subscriptionId: "sub_1" } },
    });
    assert.equal(c.action, "ignore");
  });

  test("refund.processed → cancel, bound by transaction reference", () => {
    const byRef = classifyPaystackEvent({
      event: "refund.processed",
      data: { transaction_reference: "sub_1demo_reference", amount: 250000 },
    });
    assert.equal(byRef.action, "cancel");
    assert.equal(byRef.cancelled, true);
    assert.equal(byRef.providerRef, "sub_1demo_reference");

    const byNested = classifyPaystackEvent({
      event: "refund.processed",
      data: { transaction: { reference: "ref_nested" } },
    });
    assert.equal(byNested.action, "cancel");
    assert.equal(byNested.providerRef, "ref_nested");

    const unbindable = classifyPaystackEvent({ event: "refund.processed", data: {} });
    assert.equal(unbindable.action, "ignore", "a refund with no reference cannot be bound");
  });

  test("informational / unbindable events are acknowledged, never guessed", () => {
    for (const name of [
      "subscription.disable",
      "subscription.not_renew",
      "charge.dispute.create",
      "charge.dispute.resolve",
      "invoice.update",
      "transfer.success",
    ]) {
      const c = classifyPaystackEvent({ event: name, data: { subscription_code: "SUB_x" } });
      assert.equal(c.action, "ignore", `${name} must not mutate entitlements`);
    }
    assert.equal(classifyPaystackEvent({}).action, "ignore");
    assert.equal(classifyPaystackEvent({ event: "totally.unknown", data: null }).action, "ignore");
  });
});

describe("Replay idempotency key", () => {
  test("same payload → same id (provider retries/resends dedupe); different payload → different id", () => {
    const expected = `paystack:${createHash("sha256").update(SAMPLE_BODY, "utf8").digest("hex")}`;
    assert.equal(paystackEventId(SAMPLE_BODY), expected);
    assert.equal(paystackEventId(SAMPLE_BODY), paystackEventId(SAMPLE_BODY));
    assert.notEqual(paystackEventId(SAMPLE_BODY), paystackEventId(SAMPLE_BODY + " "));
  });
});

describe("Prime pricing — one table feeds charge AND display", () => {
  test("NGN amounts are kobo (×100 of the displayed naira price)", () => {
    assert.deepEqual(primePriceForCountry("NG", "monthly"), { currency: "NGN", amount: 250000 });
    assert.deepEqual(primePriceForCountry("NG", "annual"), { currency: "NGN", amount: 2500000 });
    assert.equal(primePriceForCountry("NG", "monthly").amount % 100, 0, "kobo integer");
  });

  test("USD anchor matches the ROADMAP §6 pricing: $3.99/mo · $39.90/yr", () => {
    assert.deepEqual(primePriceForCountry("US", "monthly"), { currency: "USD", amount: 399 });
    assert.deepEqual(primePriceForCountry("US", "annual"), { currency: "USD", amount: 3990 });
    assert.equal(PRIME_PRICES.US.monthly, 399);
    // REGRESSION GUARD: the legacy checkout map charged 3999 ($39.99) while the
    // /pricing page displayed (and ROADMAP §6 anchors) $39.90 — a real overcharge.
    assert.equal(PRIME_PRICES.US.annual, 3990);
    assert.equal(PRIME_PRICES.GB.annual, 3990);
    assert.equal(PRIME_PRICES.EU.annual, 3990);
  });

  test("unknown / lowercase countries fall back to USD", () => {
    assert.deepEqual(primePriceForCountry("XX", "monthly"), { currency: "USD", amount: 399 });
    assert.deepEqual(primePriceForCountry(null, "annual"), { currency: "USD", amount: 3990 });
    assert.deepEqual(primePriceForCountry(" ng ", "monthly"), { currency: "NGN", amount: 250000 });
  });

  test("display strings are byte-identical to the legacy /pricing page (charge == shown price)", () => {
    const legacy = {
      NG: ["₦2,500 / month", "₦25,000 / year"],
      GH: ["GH₵35 / month", "GH₵350 / year"],
      KE: ["KSh 350 / month", "KSh 3,500 / year"],
      IN: ["₹199 / month", "₹1,999 / year"],
      PK: ["₨500 / month", "₨5,000 / year"],
      US: ["$3.99 / month", "$39.90 / year"],
      GB: ["£3.99 / month", "£39.90 / year"],
      EU: ["€3.99 / month", "€39.90 / year"],
    };
    for (const [country, [monthly, annual]] of Object.entries(legacy)) {
      assert.equal(formatPrimePrice(country, "monthly"), monthly, `${country} monthly display`);
      assert.equal(formatPrimePrice(country, "annual"), annual, `${country} annual display`);
      // The display derives from the SAME entry the checkout charges.
      const charged = primePriceForCountry(country, "monthly");
      assert.equal(charged.amount, PRIME_PRICES[country].monthly);
    }
    // Unknown country → the US fallback display.
    assert.equal(formatPrimePrice("ZZ", "monthly"), "$3.99 / month");
  });
});

describe("Route source contracts (payments wiring, no creds required)", () => {
  const webhookSrc = readFileSync(
    new URL("../src/app/api/payments/webhook/[provider]/route.ts", import.meta.url),
    "utf8"
  );
  const checkoutSrc = readFileSync(
    new URL("../src/app/api/payments/checkout/route.ts", import.meta.url),
    "utf8"
  );
  const paymentsSrc = readFileSync(new URL("../src/lib/payments.ts", import.meta.url), "utf8");

  test("webhook verifies Paystack via the sha512 verifier and never logs raw bodies", () => {
    assert.ok(webhookSrc.includes("verifyPaystackEvent"), "webhook must use the shared verifier");
    assert.ok(webhookSrc.includes("classifyPaystackEvent"), "webhook must use the shared classifier");
    assert.ok(
      paymentsSrc.includes('createHmac("sha512"'),
      "Paystack verification is HMAC-SHA512 (docs)"
    );
    assert.ok(
      !paymentsSrc.includes('createHmac("sha256"'),
      "no sha256 path may remain in the Paystack verifier"
    );
    assert.ok(!webhookSrc.includes("console.log("), "webhook must not log (raw bodies included)");
    assert.match(
      webhookSrc,
      /console\.error\("Payment webhook failed", error\)/,
      "the only log line is the error tag — never the payload"
    );
  });

  test("checkout initializes Paystack with amount directly — no per-checkout plan minting", () => {
    assert.ok(
      !checkoutSrc.includes("api.paystack.co/plan"),
      "the POST /plan on every checkout is gone"
    );
    assert.ok(
      checkoutSrc.includes("transaction/initialize"),
      "one-off transaction/initialize with amount + currency"
    );
    assert.ok(checkoutSrc.includes("primePriceForCountry"), "pricing comes from the shared catalog");
  });

  test("checkout is inert without credentials: config guard runs BEFORE any DB write", () => {
    const guard = checkoutSrc.indexOf("if (!configured) throw");
    const create = checkoutSrc.indexOf("prisma.subscription.create");
    assert.ok(guard > -1, "configuration guard exists");
    assert.ok(create > -1);
    assert.ok(guard < create, "unconfigured providers must not create Subscription rows");
  });

  test("activation payload matches the real gate semantics (plan: prime, all domains)", () => {
    assert.match(webhookSrc, /plan: "prime"/, "paid users must map to the prime plan");
    assert.match(webhookSrc, /tier: "premium"/, "legacy tier checks stay satisfied");
    assert.match(
      webhookSrc,
      /domainAccess: \["highschool", "university", "extras"\]/,
      "all-access product opens every AppDomain"
    );
    assert.match(webhookSrc, /plan: "free"/, "cancellation resets the plan too");
  });

  test("env names: PAYSTACK_WEBHOOK_SECRET is declared in .env.example (names only)", () => {
    const envExample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
    assert.match(envExample, /^PAYSTACK_SECRET_KEY=/m);
    assert.match(envExample, /^PAYSTACK_WEBHOOK_SECRET=/m);
  });
});
