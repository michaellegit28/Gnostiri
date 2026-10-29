import { getCurrentUser } from "@/lib/server-auth";
import { COMPETITION_FORMATS, FORMAT_META } from "@/lib/competition";
import JoinLanding from "@/components/league/JoinLanding";
import type { FormatOption } from "@/components/league/CreateCupForm";

export const dynamic = "force-dynamic";

function asString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * /league/join?code=XXXX — an invite landing. The server wrapper only reads
 * the code and computes the format labels; JoinLanding (client) resolves the
 * cup from the join route and runs the actual join.
 */
export default async function JoinPage({
  searchParams,
}: {
  searchParams: { code?: string | string[]; competitionId?: string | string[] };
}) {
  // Force auth-based rendering of the landing (the client re-checks via GET).
  await getCurrentUser();

  const code = asString(searchParams.code);
  const competitionId = asString(searchParams.competitionId);

  const formats: FormatOption[] = COMPETITION_FORMATS.map((format) => {
    const meta = FORMAT_META[format];
    return { value: format, label: meta.label, blurb: meta.blurb, duration: meta.duration };
  });

  return <JoinLanding code={code} competitionId={competitionId} formats={formats} />;
}
