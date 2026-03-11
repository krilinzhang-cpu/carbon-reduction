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
        primary: "#0D7A6B",
        "primary-light": "#E6F4F1",
        "primary-dark": "#095C50",
        blue: "#1A6FA8",
        "blue-light": "#E8F3FB",
        bg: "#F7F8FA",
        surface: "#FFFFFF",
        border: "#E4E7ED",
        "text-primary": "#1D2129",
        "text-secondary": "#4E5969",
        "text-disabled": "#A9AEB8",
        success: "#00B42A",
        warning: "#FF7D00",
        info: "#165DFF",
        error: "#F53F3F",
      },
    },
  },
  plugins: [],
};

export default config;
