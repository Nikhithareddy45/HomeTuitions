// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./global.css",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        regular: ["SatoshiRegular", "sans-serif"],
        medium: ["SatoshiMedium", "sans-serif"],
        bold: ["SatoshiBold", "sans-serif"],
        black: ["SatoshiBlack", "sans-serif"],
        light: ["SatoshiLight", "sans-serif"],
      },
      colors: {  // ✅ Move colors here, not in extend.color
        primary: "#115bca",
        accent:"#2096daff",
        secondary: "#f9f9f9",
        text: "#1e1e1e",
        white: "#ffffffd3",
        black:{
          100: "#111111",
          700: "#222222",
          500: "#333333",
          300: "#444444",
        },
        gray:{
          100: "#a7a7a7c0",
          200: "#888888",
          300: "#999999",
          400: "#aaaaaa",
          500: "#a0a0a0ff",
          600: "#919090ff",
          700: "#8b8b8bff",
          800: "#706f6f50",
          900: "#252525ff",
        },
        success: "#10b981",
        danger: "#ef4444e1",
        warning: "#f59e0b",
        info: "#3b82f6",
        orange: "#f97316",
        pink: "#ec4899",
        purple: "#a855f7",
      },
    },
  },

  plugins: [],
};
