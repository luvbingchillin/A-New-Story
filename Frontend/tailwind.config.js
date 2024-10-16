/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        lora: ['Lora', 'serif'],
        amatic: ['Amatic SC', 'cursive'],
      },
      gridTemplateColumns:{
        '70/30':'70% 28%',
      }
    },
  },
  plugins: [],
}