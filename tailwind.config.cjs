const { lerpColors } = require('tailwind-lerp-colors');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: lerpColors(),
    extend: {
      spacing: {
        em: '1em',
        rem: '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          s: (value) => ({
            width: value,
            height: value,
          }),
        },
        {
          values: theme('spacing'),
        },
      );
    }),
  ],
};
