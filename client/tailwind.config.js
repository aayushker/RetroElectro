/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        re: {
          bg0: "var(--bg-0)",
          bg1: "var(--bg-1)",
          bg2: "var(--bg-2)",
          surface0: "var(--surface-0)",
          surface1: "var(--surface-1)",
          surface2: "var(--surface-2)",
          border0: "var(--border-0)",
          border1: "var(--border-1)",
          text0: "var(--text-0)",
          text1: "var(--text-1)",
          text2: "var(--text-2)",
          accent0: "var(--accent-0)",
          accent1: "var(--accent-1)",
          accent2: "var(--accent-2)",
        },
      },
      borderRadius: {
        "re-xl": "var(--radius-xl)",
        "re-lg": "var(--radius-lg)",
        "re-md": "var(--radius-md)",
      },
      boxShadow: {
        "re-0": "var(--shadow-0)",
        "re-1": "var(--shadow-1)",
      },
      transitionTimingFunction: {
        "re-1": "var(--ease-1)",
        "re-2": "var(--ease-2)",
      },
      transitionDuration: {
        "re-1": "var(--dur-1)",
        "re-2": "var(--dur-2)",
        "re-3": "var(--dur-3)",
      },
      keyframes: {
        reFadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)", filter: "blur(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
      },
      animation: {
        "re-fade-up": "reFadeUp var(--dur-3) var(--ease-2) both",
      },
    },
  },
  plugins: [],
} 