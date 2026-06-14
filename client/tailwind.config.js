/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
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
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#212529',
          300: '#1a1d21',
          400: '#14171a',
          500: '#0d1117',
        },
        light: {
          50: '#ffffff',
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
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
