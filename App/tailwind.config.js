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

        darkText: "#FFFFFF",
        darkTextSecondary: "rgba(255, 255, 255, 0.6)",
        darkTextTertiary: "#000000",
        darkTextQuaternary: "rgba(0, 0, 0, 0.6)",
        darkTextQuinary: "#FF0000",
        darkTextSenary: "#FFAA2E",

        lightBg: "#FFFFFF",
        lightBgSecondary: "#3F3F3F",
        lightBgTertiary: "#E5E5E5",
        lightBgQuaternary: "#000000",
        lightBgQuinary: "#D1F9E2",
        lightBgSenary: "#E3992C",
        lightBgSeptenary: "#FF0000",
        lightBgOctonary: "#74AEF1",
        lightBgNonary: "rgba(0, 0, 0, 0.06)",

        lightText: "#000000",
        lightTextSecondary: "rgba(0, 0, 0, 0.6)",
        lightTextTertiary: "#FFFFFF",
        lightTextQuaternary: "rgba(255, 255, 255, 0.6)",
        lightTextQuinary: "#FF0000",
        lightTextSenary: "#FFAA2E",
      },
    },
  },
  plugins: [],
};
