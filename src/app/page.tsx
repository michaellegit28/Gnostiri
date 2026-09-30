import Link from "next/link";
import { BookOpen, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";
import CountrySelector from "@/components/CountrySelector";
import DarkVeil from "@/components/effects/DarkVeil";
import TechText from "@/components/effects/TechText";
import FlexCarousel from "@/components/effects/FlexCarousel";
import GhostFibers from "@/components/effects/GhostFibers";

export default function Home() {
  const domainCards = [
    {
      title: "High School",
      description: "Master curriculum subjects and ace standardized national examinations.",
      badge: "Free Forever",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      link: "/highschool",
      icon: BookOpen,
    },
    {
      title: "University",
      description: "Deep dive into degree-level coursework, technical modules, and research.",
      badge: "From $3/mo",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      link: "/university",
      icon: GraduationCap,
    },
    {
      title: "Extras",
      description: "Explore professional certifications, practical skills, and elective topics.",
      badge: "Free",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      link: "/extras",
      icon: Sparkles,
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
      title: "High School",
      caption: "WAEC, JAMB & NECO prep — free lessons and practice questions.",
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

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold text-[#D4AF37]">Gnostiri</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/highschool"
            className="px-4 py-2 min-h-[48px] inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/progress"
            className="px-4 py-2 min-h-[48px] inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors"
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

        {/* Domain Cards Section */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {domainCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-8 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-lg hover:shadow-[#D4AF37]/5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-slate-700/50 rounded-lg text-[#14B8A6]">
                        <IconComponent className="w-6 h-6" />
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
                    className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-[#14B8A6] hover:bg-[#0f9284] text-slate-950 font-semibold text-sm transition-colors focus:ring-2 focus:ring-[#14B8A6] focus:outline-none"
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

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-6 bg-slate-950 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="font-serif font-bold text-[#D4AF37] text-lg">Gnostiri</span>
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
        <div className="max-w-7xl mx-auto mt-6 text-center md:text-left text-xs text-slate-500">
          © {new Date().getFullYear()} Gnostiri. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
