/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#9A7A2E',
        },
        luxury: {
          dark: '#0D1117',
          card: '#111318',
          surface: '#1C1F26',
        }
      },
      animation: {
        'shimmer-text': 'shimmerText 4s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
