/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          500: '#14b8a6',
          400: '#2dd4bf',
          600: '#0d9488',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 4s linear infinite',
        'gradient-shift': 'gradient-shift 8s linear infinite',
        'subtle-float': 'subtle-float 6s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.4))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 25px rgba(20, 184, 166, 0.8))' },
        },
        'neon-flicker': {
          '0%, 18%, 22%, 25%, 53%, 57%, 100%': { opacity: 1 },
          '20%, 24%, 55%': { opacity: 0.7 },
        },
        'gradient-shift': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'subtle-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      backgroundImage: {
        'glass-gradient':
          'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
    },
  },
  plugins: [],
};
