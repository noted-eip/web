/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        '2xl': '32px',
        'xl': '24px',
        'lg': '16px',
        'md': '12px',
        'sm': '8px',
        'xs': '6px',
        'xxs': '4px',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
