import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        "light-green": "#35c19f",
      },
      spacing: {
        content: "var(--width-content)",
        limit: "var(--width-limit)",
      },
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
        roboto: ["var(--font-roboto)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
