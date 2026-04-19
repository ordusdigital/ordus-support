import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#0A0A0A',
        surface:  '#0E0E0E',
        surface2: '#111111',
        hover:    '#1A1A1A',
        brand: { DEFAULT: '#9A11E9', mid: '#7F2DC1', light: '#C060FF', dark: '#1F032F' },
        cta:   { DEFAULT: '#00A47B', dark: '#006653' },
        text:  { DEFAULT: '#F0F0F3', muted: 'rgba(240,240,243,0.60)', faint: 'rgba(240,240,243,0.40)' },
        border: { DEFAULT: 'rgba(255,255,255,0.08)', brand: 'rgba(154,17,233,0.20)', strong: 'rgba(255,255,255,0.14)' },
        light: { bg: '#F5F5F5', card: '#FFFFFF', text: '#0A0A0A', muted: '#6A6A6A', border: 'rgba(0,0,0,0.08)' },
      },
      fontFamily: {
        display: ['Fractul', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px', pill: '100px',
      },
      boxShadow: {
        sm:    '0 2px 8px rgba(0,0,0,0.40)',
        md:    '0 4px 16px rgba(0,0,0,0.50)',
        lg:    '0 8px 32px rgba(0,0,0,0.50)',
        brand: '0 0 24px rgba(154,17,233,0.30)',
        card:  '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 24px rgba(154,17,233,0.12)',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s cubic-bezier(0,0,0.2,1) both',
        'smoke':     'smokeReveal 0.8s cubic-bezier(0,0,0.2,1) both',
        'dot-pulse': 'dotPulse 2s ease-in-out infinite',
        'gradient':  'gradientShift 12s ease infinite',
        'pill-in':   'pillIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      keyframes: {
        gradientShift: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        fadeUp:        { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        smokeReveal:   { from: { opacity: '0', filter: 'blur(6px)', transform: 'translateY(10px)' }, to: { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' } },
        dotPulse:      { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.4', transform: 'scale(0.75)' } },
        pillIn:        { from: { opacity: '0', transform: 'translateY(-10px) scale(0.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
    },
  },
  plugins: [],
}

export default config
