/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', 'roboto', '"Noto Sans Myanmar UI"', '"Noto Sans Khmer"', 'arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

