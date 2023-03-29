/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-1000': '#0A0B0F',
        'slate-950': '#0f1117',
        'slate-900': '#13151D',
        'slate-850': '#161922',
        'slate-800': '#1A1D27',
        'slate-750': '#1D212B',
        'slate-700': '#20242F',
        'slate-650': '#232834',
        'slate-600': '#272C3A',
        'slate-550': '#2B3140',
        'slate-500': '#303646',
      },
    },
  },
  plugins: [],
}
