/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../backend/templates/**/*.html", // if backend has HTML
    "../python-service/**/*.html", // if python-service has HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
