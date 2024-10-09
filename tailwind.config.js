/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}", "./views/styles/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

