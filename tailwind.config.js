const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fonts: {
        sans: ['Graphik', ...fontFamily.sans],
      },
      colors: {
        primary: '#1D4ED8', // Blue color for primary actions
        secondary: '#64748B', // Gray color for secondary elements
        accent: '#FBBF24', // Yellow color for highlights
      },
      spacing: {
        '18': '4.5rem', // Custom spacing value
      },
    },
  },
  plugins: [],
};