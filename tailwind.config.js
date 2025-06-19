/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8",       // Tailwind blue-700
        secondary: "#3B82F6",     // Tailwind blue-500
        background: "#f3f4f6",    // Tailwind gray-100
      },
    },
  },
  plugins: [],
};
