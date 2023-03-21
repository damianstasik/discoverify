const { lerpColors } = require('tailwind-lerp-colors');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: lerpColors(),
    extend: {
      boxShadow: {
        inner: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      spacing: {
        em: '1em',
        rem: '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ matchUtilities, addUtilities, theme }) => {
      addUtilities({
        '.skeleton': {
          '&:before': {
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
          values: theme('spacing'),
        },
      );
    }),
  ],
};
