/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E7F5F0",
          100: "#CFEAE1",
          200: "#9FD4C3",
          300: "#6FBEA5",
          400: "#3FA887",
          500: "#2E8F72",
          600: "#23705A",
          700: "#1A5444",
          800: "#12392F",
          900: "#0A211C"
        }
      }
    },
  },
  plugins: [],
}
