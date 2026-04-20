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
        coral:  { DEFAULT: "#FF4D6D", dark: "#E63558", light: "#FFE0E6" },
        navy:   { DEFAULT: "#0D1B3E", mid: "#1a2f5e" },
        amber:  { DEFAULT: "#FFD166", dark: "#F5BE3A" },
        mint:   { DEFAULT: "#06D6A0", light: "#D1FAF0" },
        bg:     "#F8F9FF",
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        inter:   ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        coral: "0 4px 14px rgba(255,77,109,0.35)",
        amber: "0 4px 14px rgba(255,209,102,0.40)",
        card:  "0 2px 12px rgba(13,27,62,0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
