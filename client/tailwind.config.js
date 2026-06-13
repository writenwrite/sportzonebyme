/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFDB73',
          400: '#FFD14D',
          500: '#FFC726',
          600: '#D4A517',
          700: '#A38213',
          800: '#735D0E',
          900: '#42350A',
        },
        dark: {
          50: '#1A1A2E',
          100: '#16213E',
          200: '#0F0F23',
          300: '#0A0A1A',
          400: '#050510',
          500: '#000000',
        },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #FFC726 0%, #D4A517 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A2E 0%, #0A0A1A 100%)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 199, 38, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255, 199, 38, 0)' },
        },
      },
    },
  },
  plugins: [],
};
