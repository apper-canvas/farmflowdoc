/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D5016",
        secondary: "#7CB342",
        accent: "#FF8A00",
        surface: "#F5F5DC",
        background: "#FAFAF5",
        success: "#4CAF50",
        warning: "#FFC107",
        error: "#D32F2F",
        info: "#1976D2",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'pulse-success': 'pulse 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}