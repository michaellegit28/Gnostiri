import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Dark mode is an EXPLICIT attribute, never the OS. The app ships eight named
  // themes (see src/lib/themes.ts); "Midnight Scholar" is the dark default and
  // every palette defines its tokens directly under [data-theme="<id>"] in
  // globals.css, so the dark: variant is dormant (no component uses it). It is
  // pinned to the default dark theme so if it is ever re-introduced it tracks an
  // attribute the app controls, not a prefers-color-scheme the app ignores.
  darkMode: ["selector", '[data-theme="midnight-scholar"]'],
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
          // 600/700 previously aliased --border-strong (a BORDER token): as
          // text it measured 2.5:1 dark / 1.6:1 light — invisible captions.
          // They now join 500 on --text-subtle, which clears 4.5:1 on bg and
          // surface-2 in BOTH themes.
          600: "rgb(var(--text-subtle) / <alpha-value>)",
          700: "rgb(var(--text-subtle) / <alpha-value>)",
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
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        bg: "rgb(var(--bg) / <alpha-value>)",
        line: "rgb(var(--border) / <alpha-value>)",
        "line-strong": "rgb(var(--border-strong) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        bgDeep: "rgb(var(--bg-deep) / <alpha-value>)",
        // Primary action = Electric Blue (theme-aware). Components migrate
        // from bg-gold/text-gold primary CTAs to bg-primary/text-on-primary.
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          on: "rgb(var(--on-primary) / <alpha-value>)",
        },
        // Vibrant Academic Futurism brand accents (theme-aware, AA via *-text).
        electric: {
          DEFAULT: "rgb(var(--electric) / <alpha-value>)",
          text: "rgb(var(--electric-text) / <alpha-value>)",
        },
        mint: "rgb(var(--mint) / <alpha-value>)",
        coral: "rgb(var(--coral) / <alpha-value>)",
        // cyan / violet / pink remapped onto the theme brand tokens so module
        // identities stay consistent in both themes. Shades preserved.
        cyan: {
          100: "rgb(var(--cyan) / <alpha-value>)",
          200: "rgb(var(--cyan-text) / <alpha-value>)",
          300: "rgb(var(--cyan-text) / <alpha-value>)",
          400: "rgb(var(--cyan) / <alpha-value>)",
          500: "rgb(var(--cyan) / <alpha-value>)",
          600: "rgb(var(--cyan) / <alpha-value>)",
        },
        violet: {
          100: "rgb(var(--violet) / <alpha-value>)",
          200: "rgb(var(--violet-text) / <alpha-value>)",
          300: "rgb(var(--violet-text) / <alpha-value>)",
          400: "rgb(var(--violet) / <alpha-value>)",
          500: "rgb(var(--violet) / <alpha-value>)",
          600: "rgb(var(--violet) / <alpha-value>)",
        },
        pink: {
          200: "rgb(var(--pink-text) / <alpha-value>)",
          300: "rgb(var(--pink-text) / <alpha-value>)",
          400: "rgb(var(--pink) / <alpha-value>)",
          500: "rgb(var(--pink) / <alpha-value>)",
          600: "rgb(var(--pink) / <alpha-value>)",
        },
        "cup-speed": "rgb(var(--cup-speed) / <alpha-value>)",
        "cup-mastery": "rgb(var(--cup-mastery) / <alpha-value>)",
        "cup-bracket": "rgb(var(--cup-bracket) / <alpha-value>)",
        "cup-endurance": "rgb(var(--cup-endurance) / <alpha-value>)",
        "mod-uni-a": "rgb(var(--mod-university-a) / <alpha-value>)",
        "mod-uni-b": "rgb(var(--mod-university-b) / <alpha-value>)",
        "mod-hs-a": "rgb(var(--mod-highschool-a) / <alpha-value>)",
        "mod-hs-b": "rgb(var(--mod-highschool-b) / <alpha-value>)",
        "mod-disc-a": "rgb(var(--mod-discovery-a) / <alpha-value>)",
        "mod-disc-b": "rgb(var(--mod-discovery-b) / <alpha-value>)",
        ink: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        subtle: "rgb(var(--text-subtle) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        // Form + disabled-state tokens. Inputs sit on --bg/--surface and need
        // a visible-but-quiet border (≥4.5:1 vs surface in both themes);
        // placeholders are real text and clear 4.5:1; disabled text is
        // decorative-only in light (pair with aria-disabled) and 4.31:1 in dark.
        "input-border": "rgb(var(--input-border) / <alpha-value>)",
        placeholder: "rgb(var(--text-placeholder) / <alpha-value>)",
        disabled: "rgb(var(--text-disabled) / <alpha-value>)",
        // Links carry their own token: primary-as-text fails in light on white,
        // and gold is premium-only. --link is AA on bg + surface-2 both themes.
        link: "rgb(var(--link) / <alpha-value>)",
        // Subject identities for per-trail chips (fill + text from one token:
        // dark = luminous accent on navy, light = deep AA fill/text).
        "subj-physics": "rgb(var(--subj-physics) / <alpha-value>)",
        "subj-chem": "rgb(var(--subj-chem) / <alpha-value>)",
        "subj-bio": "rgb(var(--subj-bio) / <alpha-value>)",
        "subj-math": "rgb(var(--subj-math) / <alpha-value>)",
        // mod-* aliases for subject trails: per-trail chips keep the mod-*
        // naming convention but resolve onto the subj-* tokens.
        "mod-physics": "rgb(var(--subj-physics) / <alpha-value>)",
        "mod-chem": "rgb(var(--subj-chem) / <alpha-value>)",
        "mod-bio": "rgb(var(--subj-bio) / <alpha-value>)",
        "mod-math": "rgb(var(--subj-math) / <alpha-value>)",
        // Semantic families are theme-aware so exam, tutor, and league states
        // keep the same meaning in both light and dark modes.
        teal: {
          200: "rgb(var(--teal-text) / <alpha-value>)",
          300: "rgb(var(--teal-text) / <alpha-value>)",
          400: "rgb(var(--teal-text) / <alpha-value>)",
          500: "rgb(var(--teal) / <alpha-value>)",
          600: "rgb(var(--teal) / <alpha-value>)",
        },
        emerald: {
          200: "rgb(var(--success-text) / <alpha-value>)",
          300: "rgb(var(--success-text) / <alpha-value>)",
          400: "rgb(var(--success-text) / <alpha-value>)",
          500: "rgb(var(--success) / <alpha-value>)",
          600: "rgb(var(--success) / <alpha-value>)",
        },
        rose: {
          200: "rgb(var(--error-text) / <alpha-value>)",
          300: "rgb(var(--error-text) / <alpha-value>)",
          400: "rgb(var(--error-text) / <alpha-value>)",
          500: "rgb(var(--error) / <alpha-value>)",
          600: "rgb(var(--error) / <alpha-value>)",
        },
        red: {
          300: "rgb(var(--error-text) / <alpha-value>)",
          400: "rgb(var(--error-text) / <alpha-value>)",
          500: "rgb(var(--error) / <alpha-value>)",
          600: "rgb(var(--error) / <alpha-value>)",
        },
        amber: {
          200: "rgb(var(--warning-text) / <alpha-value>)",
          300: "rgb(var(--warning-text) / <alpha-value>)",
          400: "rgb(var(--warning) / <alpha-value>)",
          500: "rgb(var(--warning) / <alpha-value>)",
          600: "rgb(var(--warning) / <alpha-value>)",
        },
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
