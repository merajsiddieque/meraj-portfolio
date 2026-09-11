import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "#0E131F",
          50: "#182030",
          100: "#131826",
          200: "#0E131F",
          300: "#0A0E17",
          400: "#07090E",
        },
        electric: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#4F8CFF", // Electric Blue (#4F8CFF)
          600: "#3B76F6",
          700: "#2563EB",
          800: "#1D4ED8",
        },
        cyan: {
          300: "#7CE4FF",
          400: "#39D0FF", // Cyan (#39D0FF)
          500: "#06B6D4",
          600: "#0891B2",
        },
        violet: {
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6", // Violet (#8B5CF6)
          600: "#7C3AED",
        },
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.25)",
        "neon-blue": "0 0 24px rgba(79, 140, 255, 0.35)",
        "neon-cyan": "0 0 24px rgba(57, 208, 255, 0.35)",
        "neon-violet": "0 0 24px rgba(139, 92, 246, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
