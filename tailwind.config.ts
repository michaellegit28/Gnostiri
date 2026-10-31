import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens (globals.css). slate/white are aliased onto the zinc
        // token scale so every existing utility (text-slate-400, bg-slate-950/60,
        // border-white/10) is theme-aware in BOTH modes with zero component edits.
        slate: {
          50: "rgb(var(--surface-2) / <alpha-value>)",
          100: "rgb(var(--text) / <alpha-value>)",
          200: "rgb(var(--text) / <alpha-value>)",
          300: "rgb(var(--text-muted) / <alpha-value>)",
          400: "rgb(var(--text-muted) / <alpha-value>)",
          500: "rgb(var(--text-subtle) / <alpha-value>)",
          600: "rgb(var(--border-strong) / <alpha-value>)",
          700: "rgb(var(--border-strong) / <alpha-value>)",
          800: "rgb(var(--border) / <alpha-value>)",
          900: "rgb(var(--surface) / <alpha-value>)",
          950: "rgb(var(--bg) / <alpha-value>)",
        },
        white: "rgb(var(--text) / <alpha-value>)",
        gold: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          hover: "rgb(var(--gold-hover) / <alpha-value>)",
          soft: "rgb(var(--gold-soft) / 0.14)",
          text: "rgb(var(--gold-text) / <alpha-value>)",
          from: "rgb(var(--gold-from) / <alpha-value>)",
          to: "rgb(var(--gold-to) / <alpha-value>)",
        },
        "on-gold": "rgb(var(--on-gold) / <alpha-value>)",
        line: "rgb(var(--border) / <alpha-value>)",
        "line-strong": "rgb(var(--border-strong) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        ink: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        subtle: "rgb(var(--text-subtle) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
      },
      letterSpacing: {
        label: "0.2em",
      },
      fontFamily: {
        // One clean sans family: the display face is Inter Tight (tight tracking,
        // no serif/curly character), body is Inter. No display font quirks.
        serif: ["var(--font-display)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        reading: ["var(--font-reading)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
