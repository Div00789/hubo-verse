/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hubo: {
          orange: '#FF5C00',
          dark: '#090D16',
          card: '#0F172A',
          surface: '#131B2E',
          border: '#1E293B',
        },
      },
    },
  },
  plugins: [],
};
