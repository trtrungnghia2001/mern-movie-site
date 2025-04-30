/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'color-text-secondary-1': 'var(--color-text-secondary-1)',
        'color-text-secondary-2': 'var(--color-text-secondary-2)',
        'color-bg-container': 'var(--color-bg-container)',
        'color-border': 'var(--color-border)',
        'color-bg-item': 'var(--color-bg-item)',
      },
      fontSize: {
        10: '0.625rem',
        11: '0.6875rem',
        13: '0.8125rem',
        15: '0.9375rem',
      },
      aspectRatio: {
        'thumbnail-1': '35/49',
        'thumbnail-2': '8/9',
      },
    },
  },
  important: true,
  plugins: [],
}
