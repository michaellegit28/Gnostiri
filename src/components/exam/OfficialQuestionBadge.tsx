import { BadgeCheck } from "lucide-react";
import { officialAttribution } from "./questionSource";

/**
 * OfficialQuestionBadge — shown ONLY for Version A items rendered on their own
 * official track (ZA/TZ), per the hybrid question model. Carries the mandatory
 * attribution line: openly published papers still require it.
 * Renders nothing if attribution for the board is unknown or the item is not
 * an official version. Server-safe.
 */
export default function OfficialQuestionBadge({
  board,
  className = "",
}: {
  /** Board whose paper this is (e.g. "NSC", "NECTA"). */
  board?: string | null;
  className?: string;
}) {
  const attribution = officialAttribution(board);
  if (!attribution) return null;

  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border border-teal-500/40 bg-teal-500/[0.07] p-3 ${className}`}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <BadgeCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-400" />
        Official past question
      </p>
      <p className="text-xs text-slate-400">{attribution}</p>
    </div>
  );
}
