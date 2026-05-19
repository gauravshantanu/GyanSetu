/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#E8630A',
          dark: '#c4520a',
          light: '#fff4ee',
          mid: '#fde2cc',
        },
        'india-green': {
          DEFAULT: '#128807',
          light: '#edfaf0',
        },
      },
      fontFamily: {
        hindi: ['Tiro Devanagari Hindi', 'Noto Sans Devanagari', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
