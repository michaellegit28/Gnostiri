import Link from "next/link";
import { BookOpen, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/db";
import CountrySelector from "@/components/CountrySelector";
import HomeDashboard from "@/components/HomeDashboard";
import { GnostiriLogo } from "@/components/logo/GnostiriLogo";
import DarkVeil from "@/components/effects/DarkVeil";
import TechText from "@/components/effects/TechText";
import FlexCarousel from "@/components/effects/FlexCarousel";
import GhostFibers from "@/components/effects/GhostFibers";

export default async function Home() {
  const domainCards = [
    {
      title: "Global School",
      description: "Whatever your country's system — master its subjects and ace its examinations.",
      numeral: "I",
      rule: "via-teal-400/60",
      badge: "Free Forever",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      link: "/highschool",
      icon: BookOpen,
      tint: "from-teal-950/50 via-slate-900 to-slate-900",
      iconColor: "text-teal-300",
      glow: "hover:shadow-teal-500/10",
    },
    {
      title: "University",
      description: "Deep dive into degree-level coursework, technical modules, and research.",
      numeral: "II",
      rule: "via-[#D4AF37]/60",
      badge: "From $3/mo",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      link: "/university",
      icon: GraduationCap,
      tint: "from-amber-950/40 via-slate-900 to-slate-900",
      iconColor: "text-[#D4AF37]",
      glow: "hover:shadow-[#D4AF37]/10",
    },
    {
      title: "Extras",
      description: "Explore professional certifications, practical skills, and elective topics.",
      numeral: "III",
      rule: "via-violet-400/60",
      badge: "Free",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      link: "/extras",
      icon: Sparkles,
      tint: "from-slate-800/80 via-slate-900 to-slate-950",
      iconColor: "text-teal-300",
      glow: "hover:shadow-teal-500/10",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Study",
      description: "Access curated, syllabus-aligned lessons tailored to your target qualification.",
    },
    {
      step: "02",
      title: "Practice",
      description: "Test your knowledge with interactive quiz attempts, past papers, and instant feedback.",
    },
    {
      step: "03",
      title: "Improve",
      description: "Get personalized AI tutoring insights and dynamic study plans to boost performance.",
    },
  ];

  const showcase = [
    {
      title: "Global School",
      caption: "Any country's system — free lessons and practice questions.",
      href: "/highschool",
      badge: "Free Forever",
      gradient: "bg-gradient-to-br from-teal-950 via-slate-900 to-slate-900",
    },
    {
      title: "University",
      caption: "Degree-level courses, quizzes and certificates.",
      href: "/university",
      badge: "From $3/mo",
      gradient: "bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900",
    },
    {
      title: "Extras",
      caption: "Certifications, practical skills and electives.",
      href: "/extras",
      badge: "Free",
      gradient: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
    },
    {
      title: "AI Tutor",
      caption: "Ask anything — explanations, examples and study plans.",
      href: "/tutor",
      badge: "New",
      gradient: "bg-gradient-to-br from-[#2a230f] via-slate-900 to-slate-950",
    },
  ];

  // Live stats — sequential queries (pooler-safe) with graceful fallback:
  // if the database is unreachable during prerender, the band hides
  // instead of failing the build.
  let examCount = 0;
  let topicCount = 0;
  let regionCount = 0;
  try {
    examCount = await prisma.examination.count({ where: { domain: "highschool" } });
    topicCount = await prisma.topic.count({ where: { isPublished: true } });
    const regionRows: { country: string | null }[] = await prisma.examination.findMany({
      where: { domain: "highschool" },
      select: { country: true },
    });
    regionCount = new Set(
      regionRows.map((r) => (r.country || "International").trim())
    ).size;
  } catch {
    examCount = 0;
    topicCount = 0;
    regionCount = 0;
  }

  const stats = [
    { value: `${examCount}`, label: "Examination systems" },
    { value: `${regionCount}`, label: "Regions covered" },
    { value: `${topicCount}+`, label: "Topics and counting" },
  ];
  const showStats = examCount + topicCount + regionCount > 0;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <GnostiriLogo />
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/highschool"
            className="hidden px-4 py-2 min-h-[48px] sm:inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/progress"
            className="hidden px-4 py-2 min-h-[48px] sm:inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors"
          >
            Progress
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 min-h-[48px] inline-flex items-center text-sm font-medium rounded-lg bg-[#D4AF37] text-slate-950 hover:bg-[#c3a030] transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center space-y-20">
        <HomeDashboard />
        {/* Hero Section — GhostFibers atmosphere + TechText particle brand */}
        <section className="relative w-full overflow-hidden rounded-2xl border border-slate-800/60">
          <div className="relative h-[600px] md:h-[640px]">
            <GhostFibers
              lineColor="#1a1a2e"
              glowColor="#4a5568"
              speed={0.15}
              scale={1.5}
              layers={3}
              glowIntensity={0.8}
              vignette={0.9}
              grain={0.03}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h1 className="sr-only">
                Gnostiri — Make exceptional learning accessible to everyone.
              </h1>
              <TechText
                text="GNOSTIRI"
                fontSize={120}
                mobileFontSize={80}
                fontWeight={500}
                letterSpacing={-0.02}
                color="#ffffff"
                accentColor="#D4AF37"
                reveal="letter"
                reach={150}
                softness={0.8}
                specks={8}
                selection={true}
                labels={false}
                draggable={true}
              />
              <p className="mt-6 text-xl sm:text-2xl font-serif font-bold tracking-tight text-slate-100">
                Make exceptional learning accessible to everyone.
              </p>
              <p className="mt-3 text-base sm:text-lg text-slate-400 font-light max-w-2xl">
                Interactive curricula, real-time AI guidance, and targeted examination practice tailored to high school, university, and beyond.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/highschool"
                  className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-lg bg-[#D4AF37] text-slate-950 font-semibold text-sm hover:bg-[#c3a030] transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                >
                  Start Learning Free
                </Link>
                <Link
                  href="/tutor"
                  className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-lg border border-slate-600 text-slate-200 font-semibold text-sm hover:border-slate-400 hover:text-white transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
                >
                  Ask the AI Tutor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats band — real numbers, never faked; hidden if DB unreachable */}
        {showStats && (
        <section aria-label="Gnostiri in numbers" className="w-full">
          <dl className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center"
              >
                <dd className="font-serif text-3xl md:text-5xl font-bold text-[#D4AF37]">
                  {s.value}
                </dd>
                <dt className="mt-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </section>
        )}

        {/* Showcase — FlexCarousel */}
        <section className="w-full space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-serif font-bold text-slate-100">Explore Gnostiri</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Tap a card to step inside each learning world.
            </p>
          </div>
          <FlexCarousel
            items={showcase}
            preset="liquid"
            intro="rise"
            fit="natural"
            cardHeight={0.6}
            gap={16}
            radius={8}
            squeeze={0.15}
            focusOnClick={true}
            captions={true}
            autoplay={true}
            interval={5}
          />
        </section>

        {/* Domain Cards Section — the three doorways */}
        <section className="w-full space-y-8">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              The three ways
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-100">
              Learning has never been one shape.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Three worlds, one account — your progress follows you everywhere.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {domainCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.title}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b ${card.tint} p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 shadow-lg hover:shadow-xl ${card.glow}`}
                >
                  <div className={`pointer-events-none absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent ${card.rule} to-transparent`} />
                  <div>
                    <div className="text-xs font-mono tracking-[0.25em] text-slate-500 mb-4">
                      {card.numeral}.
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                        <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${card.badgeColor}`}
                      >
                        {card.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-100 mb-3">
                      {card.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                      {card.description}
                    </p>
                  </div>

                  <Link
                    href={card.link}
                    className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#c3a030] text-slate-950 font-semibold text-sm transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                  >
                    Enter {card.title}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section — DarkVeil depth backdrop */}
        <section className="relative w-full overflow-hidden rounded-2xl border border-slate-800/60 px-6 py-14 md:px-10">
          <DarkVeil
            hueShift={0}
            noiseIntensity={0.05}
            scanlineIntensity={0.1}
            speed={0.3}
            scanlineFrequency={0.5}
            warpAmount={0.1}
            resolutionScale={0.75}
          />
          <div className="relative w-full max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-serif font-bold text-slate-100">How It Works</h2>
              <p className="text-slate-400 text-sm sm:text-base">
                A structured roadmap to mastering any subject step-by-step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl flex flex-col space-y-4"
                >
                  <div className="text-3xl font-serif font-extrabold text-[#D4AF37]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

        {/* Manifesto */}
        <section className="w-full max-w-4xl mx-auto text-center space-y-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            The Gnostiri principle
          </p>
          <blockquote className="font-serif text-3xl md:text-5xl font-bold leading-tight text-slate-100">
            Curiosity is the <span className="italic text-[#D4AF37]">only</span> prerequisite.
          </blockquote>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            Not your grades, not your country, not your past. If you wonder about
            something, this is a place built to walk with you while you find out.
          </p>
        </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-6 bg-transparent text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <GnostiriLogo wordClassName="font-serif font-bold text-[#D4AF37] text-lg" markClassName="w-7 h-7 text-[#D4AF37]" />
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-4">
              <Link href="/highschool" className="hover:text-slate-200 transition-colors">
                High School
              </Link>
              <Link href="/university" className="hover:text-slate-200 transition-colors">
                University
              </Link>
              <Link href="/extras" className="hover:text-slate-200 transition-colors">
                Extras
              </Link>
              <Link href="/progress" className="hover:text-slate-200 transition-colors">
                Progress
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CountrySelector />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 space-y-2 text-center md:text-left">
          <p className="font-serif italic text-slate-400 text-sm">
            Learning is not a place. It is a posture toward the world.
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Gnostiri. All fields open, all doors unlocked.
          </p>
        </div>
      </footer>
    </div>
  );
}
