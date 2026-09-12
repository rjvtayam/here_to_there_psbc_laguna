/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        campus: {
          paete: '#14b8a6',
          pagsanjan: '#06b6d4',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'badge-pulse': 'badgePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.2s ease-out',
        'float-up': 'floatUp 3.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
        badgePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(0) scale(0.5)' },
          '15%': { opacity: '1', transform: 'translateX(-50%) translateY(-20px) scale(1.1)' },
          '70%': { opacity: '1', transform: 'translateX(-50%) translateY(-80px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(-50%) translateY(-130px) scale(0.7)' },
        },
      },
    },
  },
  plugins: [],
}
