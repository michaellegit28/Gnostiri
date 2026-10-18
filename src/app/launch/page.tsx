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
      <div className="min-h-screen bg-transparent text-slate-50 p-10 text-center">
        <p className="text-slate-400">The 1st launch gate is not active.</p>
        <Link href="/" className="inline-flex mt-4 rounded-lg bg-gold px-5 py-3 font-semibold text-slate-950">
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
      <div className="min-h-screen bg-transparent text-slate-50 p-10 text-center space-y-4">
        <p className="text-emerald-300 font-semibold">You already have launch access{benefactor ? " (benefactor)" : ""}.</p>
        <Link href="/" className="inline-flex rounded-lg bg-gold px-5 py-3 font-semibold text-slate-950">
          Enter Gnostiri
        </Link>
      </div>
    );
  }

  const endsLabel = LAUNCH_ENDS_AT ? new Date(LAUNCH_ENDS_AT).toLocaleDateString() : null;

  return (
    <div className="min-h-screen bg-transparent text-slate-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8 py-10">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(110%_100%_at_50%_0%,#14213d_0%,#0a0f22_55%,#060814_100%)] px-6 py-12 md:px-12 md:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <SectionMark variant="school" className="w-4 h-4" accent="#14B8A6" />
            <span>1st Launch · Limited Access</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
            Gnostiri opens for <span className="text-gold">220 learners</span> first
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            Full curriculum rebuilt. Exam practice in your board&apos;s real format. AI marking.
            {endsLabel ? ` Free access runs until ${endsLabel}.` : ""} Redeem your launch token to enter.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 space-y-5">
          <h2 className="font-serif text-2xl font-bold">Redeem your token</h2>
          {!user ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Tokens are personal and single-use. Sign in or create your free account first, then come back
                to enter your token.
              </p>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center rounded-lg bg-gold px-6 font-semibold text-slate-950 hover:bg-gold-hover"
              >
                Sign in / Create account
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>Signed in as <span className="text-slate-200 font-medium">{email}</span></span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-teal-300" />
                  {country ? `Country: ${country}` : "No country set yet"}
                </span>
              </div>
              {!country && (
                <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
                  <p className="text-sm text-amber-200 mb-3">
                    Tokens are region-locked. Set your country so your token can match it:
                  </p>
                  <CountrySelector />
                </div>
              )}
              <LaunchRedeemForm />
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Benefactor tokens also unlock university premium for the launch. Standard tokens unlock the full
          launch experience; premium university stays subscription-gated.
        </p>
      </div>
    </div>
  );
}
