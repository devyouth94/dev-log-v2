import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        "light-green": "#35c19f",
      },
      spacing: {
        header: "var(--height-header)",
        footer: "var(--height-header)",
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
