/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          twitter: '#1DA1F2',
          linkedin: '#0A66C2',
          instagram: '#E1306C',
          facebook: '#1877F2',
        },
        slate: {
          850: '#151e2e',
          925: '#0b1120',
          950: '#070b14',
        }
      },
      keyframes: {
        renderFlash: {
          '0%': { outline: '2px solid rgba(239, 68, 68, 0.9)', backgroundColor: 'rgba(239, 68, 68, 0.15)' },
          '50%': { outline: '2px solid rgba(245, 158, 11, 0.6)', backgroundColor: 'rgba(245, 158, 11, 0.08)' },
          '100%': { outline: '2px solid transparent', backgroundColor: 'transparent' },
        },
        renderFlashGreen: {
          '0%': { outline: '2px solid rgba(16, 185, 129, 0.9)', backgroundColor: 'rgba(16, 185, 129, 0.15)' },
          '100%': { outline: '2px solid transparent', backgroundColor: 'transparent' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        }
      },
      animation: {
        'render-flash': 'renderFlash 0.6s ease-out forwards',
        'render-flash-green': 'renderFlashGreen 0.6s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
