import { redirect } from "next/navigation";

// Global Arena was renamed Merit League (ROADMAP.md, 2026-10-27).
// The old route permanently redirects so shared links keep working.
export const dynamic = "force-dynamic";

export default function ArenaPage() {
  redirect("/league");
}
