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
        accent: "#115bcaa6",
        secondary: "#f9f9f9",
        text: "#1e1e1e",
        white: {
          100: "#ffffffd3",
          900: '#ffffff'
        },
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
        ,
        black: {
          100: "#111111",
          700: "#222222",
          500: "#333333",
          300: "#444444",
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
