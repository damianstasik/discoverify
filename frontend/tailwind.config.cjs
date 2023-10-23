const { lerpColors } = require("tailwind-lerp-colors");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: lerpColors(),
    extend: {
      colors: {
        "slate-1000": "#0A0B0F",
        "slate-950": "#0f1117",
        "slate-900": "#13151D",
        "slate-850": "#161922",
        "slate-800": "#1A1D27",
        "slate-750": "#1D212B",
        "slate-700": "#20242F",
        "slate-650": "#232834",
        "slate-600": "#272C3A",
        "slate-550": "#2B3140",
        "slate-500": "#303646",
      },
      boxShadow: {
        inner: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
      },
      spacing: {
        em: "1em",
        rem: "1rem",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/forms"),
    plugin(({ matchUtilities, addUtilities, theme }) => {
      addUtilities({
        ".skeleton": {
          "&:before": {
            content: '" "',
          },
        },
      });
      matchUtilities(
        {
          s: (value) => ({
            width: value,
            height: value,
          }),
        },
        {
          values: theme("spacing"),
        },
      );
    }),
  ],
};
