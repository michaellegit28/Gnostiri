import { CalendarDays } from "lucide-react";

interface GreetingProps {
  name: string | null;
  email: string | null;
  now?: Date;
}

function firstNameOf(name: string | null, email: string | null): string | null {
  if (name && name.trim()) {
    const first = name.trim().split(/\s+/)[0];
    if (first) return first;
  }
  if (email) {
    const local = email.split("@")[0] ?? "";
    const words = local.replace(/[._\-+]+/g, " ").trim().split(/\s+/);
    const first = words[0];
    if (first) return first.charAt(0).toUpperCase() + first.slice(1);
  }
  return null;
}

function partOfDay(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Greeting({ name, email, now }: GreetingProps) {
  const date = now ?? new Date();
  const first = firstNameOf(name, email);
  const salutation = first ? `${partOfDay(date.getHours())}, ${first}` : "Welcome back";
  const dateLabel = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">
          {salutation}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Here is where your preparation stands today.
        </p>
      </div>
      <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        <CalendarDays className="h-4 w-4 text-gold" aria-hidden />
        {dateLabel}
      </p>
    </div>
  );
}
