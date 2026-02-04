/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkBg: "#000000",
        darkBgSecondary: "#202020",
        darkBgTertiary: "#383838",
        darkBgQuaternary: "#FFFFFF",
        darkBgQuinary: "#D1F9E2",
        darkBgSenary: "#E3992C",
        darkBgSeptenary: "#FF0000",
        darkBgOctonary: "#74AEF1",
        darkBgNonary: "rgba(255, 255, 255, 0.1)",

        gradientBg: "linear-gradient(180deg, #16549E 0%, #000000 100%)",

        darkText: "#FFFFFF",
        darkTextSecondary: "rgba(255, 255, 255, 0.6)",
        darkTextTertiary: "#000000",
        darkTextQuaternary: "rgba(0, 0, 0, 0.6)",
        darkTextQuinary: "#FF0000",
        darkTextSenary: "#FFAA2E",

      },
    },
  },
  plugins: [],
};
