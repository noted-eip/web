/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        '2xl': '8rem',
        'xl': '6rem',
        'lg': '4rem',
        'md': '3rem',
        'sm': '2rem',
        'xs': '1rem',
        'xxs': '0.5rem',
      }
    }
  },
  plugins: [],
}
