import Link from "next/link";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { hasLaunchAccess, isBenefactor } from "@/lib/launch";
import { LAUNCH_GATE, LAUNCH_ENDS_AT } from "@/lib/access";
import { SectionMark } from "@/components/logo/GnostiriLogo";
import { Globe2 } from "lucide-react";
import CountrySelector from "@/components/CountrySelector";
import LaunchRedeemForm from "./LaunchRedeemForm";

export const dynamic = "force-dynamic";

// 1st-launch landing: the entire site sits behind this screen until a valid
// token is redeemed. Accounts stay open — anyone can sign in, but only token
// holders get through.
export default async function LaunchPage() {
  if (!LAUNCH_GATE) {
    // Gate off — nothing to see here.
    return (
      <div className="min-h-screen bg-transparent text-slate-100 p-10 text-center">
        <p className="text-slate-400">The 1st launch gate is not active.</p>
        <Link href="/" className="gn-motion inline-flex min-h-12 mt-4 items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]">
          Go home
        </Link>
      </div>
    );
  }

  const user = await getCurrentUser();
  const email = user?.email ?? null;
  const country = user?.country ?? null;
  let alreadyIn = false;
  let benefactor = false;
  if (user) {
    alreadyIn = await hasLaunchAccess(user.id);
    benefactor = await isBenefactor(user.id);
  }
  if (alreadyIn) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 p-10 text-center space-y-4">
        <p className="text-slate-100 font-semibold">You already have launch access{benefactor ? " (benefactor)" : ""}.</p>
        <Link href="/" className="gn-motion inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]">
          Enter Gnostiri
        </Link>
      </div>
    );
  }

  const endsLabel = LAUNCH_ENDS_AT ? new Date(LAUNCH_ENDS_AT).toLocaleDateString() : null;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-2xl space-y-8 py-10">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-[radial-gradient(110%_100%_at_50%_0%,rgb(var(--surface))_0%,rgb(var(--bg))_55%,rgb(var(--bg-deep))_100%)] px-6 py-12 md:px-12 md:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/30 text-slate-400 text-xs font-semibold border border-line-strong">
            <SectionMark variant="school" className="w-4 h-4" />
            <span>1st Launch · Limited Access</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            Gnostiri opens for <span className="text-electric-text">220 learners</span> first
          </h1>
          <p className="text-muted mx-auto max-w-xl text-base md:text-lg">
            Full curriculum rebuilt. Exam practice in your board&apos;s real format. AI marking.
            {endsLabel ? ` Free access runs until ${endsLabel}.` : ""} Redeem your launch token to enter.
          </p>
        </div>

        <div className="gn-shadow rounded-xl border border-line bg-surface p-6 md:p-8 space-y-5">
          <h2 className="font-serif text-2xl font-bold">Redeem your token</h2>
          {!user ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Tokens are personal and single-use. Sign in or create your free account first, then come back
                to enter your token.
              </p>
              <Link
                href="/login"
                className="gn-motion inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
              >
                Sign in / Create account
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span>Signed in as <span className="text-slate-200 font-medium">{email}</span></span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-slate-400" />
                  {country ? `Country: ${country}` : "No country set yet"}
                </span>
              </div>
              {!country && (
                <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
                  <p className="text-sm text-slate-100 mb-3">
                    Tokens are region-locked. Set your country so your token can match it:
                  </p>
                  <CountrySelector />
                </div>
              )}
              <LaunchRedeemForm />
            </div>
          )}
        </div>

        <p className="text-muted text-center text-xs">
          Benefactor tokens also open university premium for the launch. Standard tokens open the full
          launch experience; premium university stays subscription-gated.
        </p>
      </div>
    </div>
  );
}
