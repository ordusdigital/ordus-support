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
        bg: {
          DEFAULT: '#0A0A0A',
          card: '#111111',
          hover: '#1A1A1A',
        },
        primary: {
          DEFAULT: '#7F2DC1',
          hover: '#9235D4',
        },
        text: {
          DEFAULT: '#F0F0F2',
          muted: '#9090A0',
        },
        border: '#2A2A2A',
      },
      fontFamily: {
        display: ['Fractul', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F0F0F2',
            a: { color: '#9235D4' },
            h1: { color: '#F0F0F2', fontFamily: 'Fractul, sans-serif' },
            h2: { color: '#F0F0F2', fontFamily: 'Fractul, sans-serif' },
            h3: { color: '#F0F0F2' },
            code: { color: '#9235D4', backgroundColor: '#1A1A1A' },
            'pre code': { backgroundColor: 'transparent' },
            pre: { backgroundColor: '#111111', border: '1px solid #2A2A2A' },
            blockquote: { borderLeftColor: '#7F2DC1', color: '#9090A0' },
            hr: { borderColor: '#2A2A2A' },
            strong: { color: '#F0F0F2' },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
