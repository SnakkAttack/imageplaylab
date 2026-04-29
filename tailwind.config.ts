import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Night palette: dark UI base
        night: {
          DEFAULT: "#E8E8E6",  // primary text on dark
          50:  "#B8B8BC",      // secondary text
          100: "#808088",      // muted
          200: "#505058",      // dim / placeholder
          300: "#3A3A40",      // subtle borders
          400: "#2A2A30",      // borders
          500: "#1E1E22",      // raised surface
          600: "#161618",      // panel bg
          700: "#111113",      // surface bg
          800: "#0F0F10",      // page bg
          900: "#0A0A0B",      // canvas / deepest
        },
        // Amber: single accent color
        amber: {
          DEFAULT: "#FFAA00",
          50:  "#FFF3CC",
          100: "#FFE580",
          600: "#CC8800",
        },
        // Paper: used on home/about for light backgrounds
        paper: {
          DEFAULT: "#FAFAF8",
          100: "#F0EFEB",
          200: "#E4E3DE",
        },
        ink: {
          DEFAULT: "#111110",
          secondary: "#5C5C58",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.01em" }],
        "3xs": ["9px",  { lineHeight: "12px", letterSpacing: "0.04em" }],
      },
      boxShadow: {
        instrument: "0 0 0 1px rgba(255,170,0,0.08), 0 4px 24px rgba(0,0,0,0.4)",
        glow:       "0 0 12px rgba(255,170,0,0.25), 0 0 40px rgba(255,170,0,0.06)",
        float:      "0 8px 32px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)",
        paper:      "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "fade-in":  { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up":  { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scan":     {
          "0%":   { backgroundPosition: "0 -100%" },
          "100%": { backgroundPosition: "0 100%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-up": "fade-up 0.3s ease-out",
        "scan":    "scan 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
