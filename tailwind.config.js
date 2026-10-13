import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#101C2C',
          50: '#EEF1F5',
          100: '#D5DBE4',
          200: '#A9B5C6',
          300: '#7787A0',
          400: '#4A5C78',
          500: '#2B3B53',
          600: '#1C2A3E',
          700: '#162234',
          800: '#101C2C',
          900: '#0A121D',
        },
        ivory: '#FAF9F6',
        beige: {
          DEFAULT: '#EDE6DA',
          dark: '#DDD2C0',
        },
        gold: {
          DEFAULT: '#C6A56B',
          light: '#DCC69C',
          // Darker shade for gold text on light backgrounds (meets 4.5:1 on ivory)
          deep: '#86672F',
        },
        charcoal: '#30343B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,28,44,0.04), 0 8px 24px -8px rgba(16,28,44,0.12)',
        lift: '0 2px 4px rgba(16,28,44,0.06), 0 24px 48px -16px rgba(16,28,44,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      maxWidth: {
        content: '80rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'bounce-dot': 'bounceDot 1.2s infinite ease-in-out',
      },
    },
  },
  plugins: [forms],
};
