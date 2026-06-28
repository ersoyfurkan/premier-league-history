import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#03040a",
        surface: "#0a0d1a",
        surface2: "#0d1124",
        muted: "#111827",
        border: "rgba(0,229,255,0.10)",
        "border-dim": "rgba(255,255,255,0.05)",
        foreground: "#e8eaf6",
        "fore-muted": "#6b7280",
        primary: "#00e5ff",
        "primary-dim": "rgba(0,229,255,0.12)",
        accent: "#a855f7",
        "accent-dim": "rgba(168,85,247,0.12)",
        secondary: "#7c3aed",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      boxShadow: {
        "glow-cyan":
          "0 0 20px rgba(0,229,255,0.25), 0 0 60px rgba(0,229,255,0.08)",
        "glow-purple":
          "0 0 20px rgba(168,85,247,0.25), 0 0 60px rgba(168,85,247,0.08)",
        "glow-card": "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(0,229,255,0.06) inset",
        "glow-card-hover": "0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.1)",
      },
    },
  },
};

export default config;