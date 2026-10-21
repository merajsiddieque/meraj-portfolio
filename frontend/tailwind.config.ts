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
        blue: {
          50: "#F1F5F8",
          100: "#E2EAF1",
          200: "#C7D5E2",
          300: "#A5BBD0",
          400: "#7F9CB9",
          500: "#5D7FA2",
          600: "#426B96",
          700: "#355A81",
          800: "#2D4A68",
          900: "#263B51",
          950: "#182838",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "#1A212B",
          50: "#252E39",
          100: "#202833",
          200: "#1A212B",
          300: "#151B24",
          400: "#11161D",
        },
        electric: {
          50: "#F1F5F8",
          100: "#E2EAF1",
          200: "#C7D5E2",
          300: "#A5BBD0",
          400: "#7F9CB9",
          500: "#5D7FA2",
          600: "#426B96",
          700: "#355A81",
          800: "#2D4A68",
        },
        cyan: {
          300: "#B7C5D2",
          400: "#95A8BB",
          500: "#70879E",
          600: "#5D7186",
        },
        violet: {
          300: "#C2C9D1",
          400: "#A6B0BC",
          500: "#82909F",
          600: "#687685",
        },
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.25)",
        "neon-blue": "0 0 20px rgba(66, 107, 150, 0.18)",
        "neon-cyan": "0 0 20px rgba(112, 135, 158, 0.14)",
        "neon-violet": "0 0 20px rgba(104, 118, 133, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
