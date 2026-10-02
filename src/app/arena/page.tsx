import Link from "next/link";
import { Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

// Global Arena — inter-school and inter-country contests (phased rollout).
export default function ArenaPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Trophy className="w-12 h-12 text-[#D4AF37] mx-auto" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">Global Arena</p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold">Compete across borders</h1>
        <p className="text-slate-400">
          Inter-school and inter-country contests are opening soon — weekly challenges first,
          then tournaments, then live head-to-head battles.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/highschool/study" className="px-6 py-3 rounded-lg bg-[#D4AF37] text-slate-950 font-semibold text-sm">Train in High School</Link>
          <Link href="/progress" className="px-6 py-3 rounded-lg border border-slate-600 text-sm">My progress</Link>
        </div>
      </div>
    </div>
  );
}
