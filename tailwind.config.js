/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This enables class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'fira-code': ['Fira Code', 'monospace'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
        'source-code-pro': ['Source Code Pro', 'monospace'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'ubuntu-mono': ['Ubuntu Mono', 'monospace'],
        'cascadia-code': ['Cascadia Code', 'monospace'],
        'ibm-plex-mono': ['IBM Plex Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '0.375rem',
              fontFamily: 'Fira Code, monospace',
            },
            code: {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: '#24292e',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontFamily: 'Fira Code, monospace',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            pre: {
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
            },
            code: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#e6e6e6',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}