import crypto from "crypto";
import prisma from "@/lib/db";
import { LAUNCH_MAX_TOKENS, LAUNCH_MAX_BENEFACTORS } from "@/lib/access";

// 1st-launch token engine: mint, redeem, and access checks. Tokens are
// single-use (atomic claim), country-bound, and supply-capped. Benefactor
// tokens also grant university premium for the life of the subscription-less
// launch (see entitlements.hasPremiumAccess).

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function randomCodeSegment(length: number): string {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

export function generateTokenCode(): string {
  return `GN-${randomCodeSegment(4)}-${randomCodeSegment(4)}-${randomCodeSegment(4)}`;
}

export type TokenTier = "standard" | "benefactor";

export interface MintResult {
  minted: { code: string; country: string; tier: TokenTier }[];
  totals: { total: number; standard: number; benefactor: number };
  skipped?: string;
}

// Mint tokens under the hard caps: 220 total, 20 benefactor max.
export async function mintLaunchTokens(params: {
  count: number;
  country: string;
  tier: TokenTier;
  expiresAt?: Date | null;
  note?: string;
}): Promise<MintResult> {
  const existing = await prisma.launchToken.groupBy({
    by: ["tier"],
    _count: { _all: true },
  });
  const countBy = (tier: string) => existing.find((e) => e.tier === tier)?._count._all ?? 0;
  const totals = {
    total: countBy("standard") + countBy("benefactor"),
    standard: countBy("standard"),
    benefactor: countBy("benefactor"),
  };

  const wanted = Math.max(0, Math.min(200, Math.floor(params.count)));
  if (totals.total >= LAUNCH_MAX_TOKENS) {
    return { minted: [], totals, skipped: `cap reached: ${LAUNCH_MAX_TOKENS} tokens already exist` };
  }
  if (params.tier === "benefactor" && totals.benefactor >= LAUNCH_MAX_BENEFACTORS) {
    return { minted: [], totals, skipped: `benefactor cap reached: ${LAUNCH_MAX_BENEFACTORS}` };
  }

  const totalRoom = LAUNCH_MAX_TOKENS - totals.total;
  const tierRoom = params.tier === "benefactor" ? LAUNCH_MAX_BENEFACTORS - totals.benefactor : totalRoom;
  const toMint = Math.min(wanted, totalRoom, tierRoom);
  if (toMint === 0) return { minted: [], totals, skipped: "no room left for this tier" };

  const minted: { code: string; country: string; tier: TokenTier }[] = [];
  for (let i = 0; i < toMint; i++) {
    const token = await prisma.launchToken.create({
      data: {
        code: generateTokenCode(),
        country: params.country.trim().toUpperCase(),
        tier: params.tier,
        expiresAt: params.expiresAt ?? null,
        note: params.note ?? null,
      },
      select: { code: true, country: true, tier: true },
    });
    minted.push({ code: token.code, country: token.country, tier: token.tier as TokenTier });
  }

  totals.total += toMint;
  totals[params.tier] += toMint;
  return { minted, totals };
}

export interface RedeemResult {
  ok: boolean;
  error?: string;
  tier?: TokenTier;
}

// Redeem a token: signed-in user, country-bound, single-use. The claim is an
// atomic conditional update — two users racing for the same token can never
// both win, and one user can never consume two tokens (usedById is unique).
export async function redeemLaunchToken(
  userId: string,
  userCountry: string | null,
  code: string
): Promise<RedeemResult> {
  const normalized = code.trim().toUpperCase();
  if (!/^GN-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(normalized)) {
    return { ok: false, error: "That doesn't look like a Gnostiri token (format GN-XXXX-XXXX-XXXX)." };
  }

  const token = await prisma.launchToken.findUnique({ where: { code: normalized } });
  if (!token) return { ok: false, error: "Token not found — check the code and try again." };
  if (token.usedById) return { ok: false, error: "This token has already been used." };
  if (token.expiresAt && token.expiresAt < new Date()) {
    return { ok: false, error: "This token has expired." };
  }
  if (!userCountry) {
    return { ok: false, error: "Set your country first, then redeem your token." };
  }
  if (userCountry.trim().toUpperCase() !== token.country.toUpperCase()) {
    return { ok: false, error: `This token is reserved for another region (${token.country}).` };
  }

  const claimed = await prisma.launchToken.updateMany({
    where: { id: token.id, usedById: null },
    data: { usedById: userId, usedAt: new Date() },
  });
  if (claimed.count !== 1) return { ok: false, error: "This token was just used by someone else." };

  return { ok: true, tier: token.tier as TokenTier };
}

// Does the user hold launch access (a consumed, unexpired token)?
export async function hasLaunchAccess(userId: string): Promise<boolean> {
  const token = await prisma.launchToken.findFirst({
    where: { usedById: userId },
    select: { expiresAt: true },
  });
  if (!token) return false;
  if (token.expiresAt && token.expiresAt < new Date()) return false;
  return true;
}

export async function isBenefactor(userId: string): Promise<boolean> {
  const token = await prisma.launchToken.findFirst({
    where: { usedById: userId, tier: "benefactor" },
    select: { id: true },
  });
  return token !== null;
}

// HMAC launch cookie — verified at the edge by middleware. Only the redeem
// endpoint can mint one, so a valid signature IS the proof of access.
export function signLaunchCookie(userId: string): string {
  const secret = process.env.LAUNCH_SECRET || "";
  const mac = crypto.createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${mac}`;
}
