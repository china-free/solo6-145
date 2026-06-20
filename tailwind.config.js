/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        'cream': {
          50: '#FAF7F2',
          100: '#F5F0E8',
          200: '#EBE0CF',
          300: '#DCC9AB',
          400: '#CBAE87',
        },
        'rose-brown': {
          50: '#F7EFEB',
          100: '#EEDFD8',
          200: '#DBC2B5',
          300: '#C49A86',
          400: '#B88678',
          500: '#A6705C',
        },
        'sage': {
          50: '#F0F3F0',
          100: '#DCE4DC',
          200: '#BFCABF',
          300: '#9EAF9E',
          400: '#8B9A8A',
          500: '#6F816E',
        },
        'terracotta': {
          100: '#F5E4D0',
          200: '#EAC8A8',
          300: '#DFA87D',
          400: '#D4A574',
          500: '#C68C5A',
        },
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'body': ['"Lato"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
