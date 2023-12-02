/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      spacing: {
        '2xl': '32px',
        'xl': '24px',
        'lg': '16px',
        'md': '12px',
        'sm': '8px',
        'xs': '6px',
        'xxs': '4px',
      },
      fontSize: {
        'xxs': '0.69rem'
      }
    },
  },
  // plugins: [
  //   require('@tailwindcss/forms'),
  // ],
}
