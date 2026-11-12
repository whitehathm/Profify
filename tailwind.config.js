import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: 'rgb(var(--profify-blush-rgb) / <alpha-value>)',
          100: '#FFE0E7',
          200: '#FFC2CF',
          300: '#FFA3B7',
          400: '#FF7F98',
          500: 'rgb(var(--profify-coral-rgb) / <alpha-value>)',
          600: '#E84566',
          700: '#C93253',
          800: '#9C273F',
          900: '#2D2931',
          950: 'rgb(var(--profify-charcoal-rgb) / <alpha-value>)',
        },
        accent: {
          50: 'rgb(var(--profify-blush-rgb) / <alpha-value>)',
          100: '#FFE0E7',
          200: '#FFC2CF',
          300: '#FFA3B7',
          400: '#FF7F98',
          500: 'rgb(var(--profify-coral-rgb) / <alpha-value>)',
          600: '#E84566',
          700: '#C93253',
          800: '#8A2942',
          900: '#2D2931',
          950: 'rgb(var(--profify-charcoal-rgb) / <alpha-value>)',
        },
        secondary: {
          50: 'rgb(var(--profify-neutral-rgb) / <alpha-value>)',
          100: '#F1F1EF',
          200: 'rgb(var(--profify-border-rgb) / <alpha-value>)',
          300: '#D8D7D5',
          400: '#A8A6AA',
          500: '#79777E',
          600: '#626168',
          700: '#49474F',
          800: '#2D2931',
          900: 'rgb(var(--profify-charcoal-rgb) / <alpha-value>)',
        },
        slate: {
          50: 'rgb(var(--profify-neutral-rgb) / <alpha-value>)',
          100: '#F1F1EF',
          200: 'rgb(var(--profify-border-rgb) / <alpha-value>)',
          300: '#D8D7D5',
          400: '#A8A6AA',
          500: '#79777E',
          600: '#626168',
          700: '#49474F',
          800: '#2D2931',
          900: 'rgb(var(--profify-charcoal-rgb) / <alpha-value>)',
          950: 'rgb(var(--profify-charcoal-rgb) / <alpha-value>)',
        },
        success: {
          50: '#EAFBF5',
          100: '#C8F4E3',
          500: 'rgb(var(--profify-emerald-rgb) / <alpha-value>)',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#FFF7E6',
          100: '#FDE9BD',
          500: 'rgb(var(--profify-amber-rgb) / <alpha-value>)',
          700: '#A16207',
        },
        error: {
          50: '#FFF0F3',
          100: '#FFDDE4',
          500: '#D83B5B',
          600: '#B72D49',
          700: '#92233A',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(18, 17, 23, 0.045), 0 1px 2px rgba(18, 17, 23, 0.03)',
        'card-hover': '0 10px 28px -8px rgba(18, 17, 23, 0.13), 0 3px 10px -4px rgba(18, 17, 23, 0.06)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'sheet-up': 'sheet-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'toast-in': 'toast-in 0.3s ease-out both',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('rtl', '[dir="rtl"] &');
      addVariant('ltr', '[dir="ltr"] &');
    }),
  ],
};
