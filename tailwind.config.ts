import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#0F0F0F",
          panel: "#141414",
          border: "#242424",
          surface: "#1C1C1C",
          canvas: "#181818",
          text: "#E8E8E8",
          muted: "#888888",
          accent: "#3B82F6",
          accentHover: "#2563EB",
          destructive: "#EF4444",
          pin: "#F97316",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
