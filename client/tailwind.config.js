/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          'green-light': '#1ED760',
          black: '#121212',
          'black-light': '#181818',
          'black-lighter': '#282828',
          gray: '#B3B3B3',
          'gray-dark': '#535353'
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b'
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        },
        accent: {
          DEFAULT: '#10b981', // emerald-500
          light: '#34d399',   // emerald-400
          dark: '#059669',    // emerald-600
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: []
};
