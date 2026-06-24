import type { Config } from "tailwindcss";

const config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        paper: "#f6f7f9",
        panel: "#ffffff",
        line: "#d7dde5",
        mint: "#0f9f6e",
        amber: "#b7791f",
        coral: "#d14343",
        ocean: "#0b7285"
      },
      boxShadow: {
        dashboard: "0 10px 30px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
