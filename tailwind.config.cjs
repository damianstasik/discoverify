const { lerpColors } = require('tailwind-lerp-colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: lerpColors(),
  },
  plugins: [require('@tailwindcss/forms')],
};
