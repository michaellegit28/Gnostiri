import Link from "next/link";
import { BookOpen, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";

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
          <button className="px-5 py-2.5 min-h-[48px] text-sm font-medium rounded-lg bg-[#D4AF37] text-slate-950 hover:bg-[#c3a030] transition-colors focus:ring-2 focus:ring-[#D4AF37] focus:outline-none">
            Get Started
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-slate-50 leading-tight">
            Make exceptional learning accessible to everyone.
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Interactive curricula, real-time AI guidance, and targeted examination practice tailored to high school, university, and beyond.
          </p>
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

        {/* How It Works Section */}
        <section className="w-full max-w-5xl space-y-12">
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
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="country-select" className="text-xs text-slate-400">
              Country:
            </label>
            <select
              id="country-select"
              defaultValue="US"
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 min-h-[48px] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
              <option value="GH">Ghana</option>
              <option value="GLOBAL">Global / Other</option>
            </select>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 text-center md:text-left text-xs text-slate-500">
          © {new Date().getFullYear()} Gnostiri. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
