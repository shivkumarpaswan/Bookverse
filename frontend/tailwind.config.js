/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vintage: {
          50: '#fdf8f3', 100: '#f9ede0', 200: '#f0d5b8',
          500: '#a67c52', 700: '#6b4423', 900: '#3d2817'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif']
      }
    }
  },
  plugins: []
};