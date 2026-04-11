import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F2EC',
          2: '#EDE9E0',
        },
        sage: {
          DEFAULT: '#8BAF7C',
          light: '#C5D9B8',
          dark: '#4A7A5A',
          deep: '#2E5C3A',
        },
        mint: {
          DEFAULT: '#E8F2E4',
          2: '#D4EAC8',
        },
        plant: {
          dark: '#1E2D1F',
          mid: '#5A6B5B',
          light: '#8FA090',
        },
        healthy: '#5BAF6A',
        warning: '#E0A030',
        critical: '#D95555',
      },
      borderRadius: {
        xl2: '28px',
        xl3: '36px',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(46,92,58,0.08)',
        'card-lg': '0 8px 32px rgba(46,92,58,0.12)',
        fab: '0 6px 20px rgba(46,92,58,0.35)',
      },
      spacing: {
        '13': '3.25rem',
        '6.5': '1.625rem',
      },
    },
  },
  plugins: [],
}

export default config
