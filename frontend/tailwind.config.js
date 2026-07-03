/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Silver palette — primary brand
        silver: {
          50: '#f8f6f2',
          100: '#f0ebe0',
          200: '#e0d5c3',
          300: '#c8b99a',
          400: '#b09a72',
          500: '#9a8460',
          600: '#7d6a4c',
          700: '#655640',
          800: '#534737',
          900: '#453c30',
          950: '#251f19'
        },
        // Gold accent
        gold: {
          50: '#fffbea',
          100: '#fff3c4',
          200: '#ffe683',
          300: '#ffd23f',
          400: '#ffbd0f',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        // Dark backgrounds
        dark: {
          50: '#e8e8e8',
          100: '#c5c5c5',
          200: '#8f8f8f',
          300: '#606060',
          400: '#404040',
          500: '#2a2a2a',
          600: '#1e1e1e',
          700: '#161616',
          800: '#111111',
          900: '#0a0a0a',
          950: '#050505'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif']
      },
      backgroundImage: {
        'silver-gradient': 'linear-gradient(135deg, #f8f6f2 0%, #e0d5c3 50%, #c8b99a 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #161616 50%, #1e1e1e 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #b45309 0%, #f59e0b 25%, #ffd23f 50%, #f59e0b 75%, #b45309 100%)',
        'hero-pattern': 'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,185,154,0.12) 0%, transparent 50%)'
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'spin-slow': 'spin 8s linear infinite'
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        glow: { from: { boxShadow: '0 0 10px rgba(245,158,11,0.3)' }, to: { boxShadow: '0 0 25px rgba(245,158,11,0.6), 0 0 50px rgba(245,158,11,0.2)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } }
      },
      boxShadow: {
        'gold': '0 0 0 1px rgba(245,158,11,0.3), 0 4px 20px rgba(245,158,11,0.15)',
        'gold-lg': '0 0 0 2px rgba(245,158,11,0.4), 0 8px 40px rgba(245,158,11,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card': '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)'
      },
      backdropBlur: { xs: '2px' },
      spacing: { '18': '4.5rem', '88': '22rem', '128': '32rem' }
    }
  },
  plugins: []
};
