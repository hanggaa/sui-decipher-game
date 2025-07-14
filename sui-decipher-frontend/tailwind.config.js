// file: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Cari class di semua file dalam folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}