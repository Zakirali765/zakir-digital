/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F33',
        petrol: '#0F766E',
        teal: '#14B8A6',
        ink: '#102A43',
        mist: '#EAF1F6',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(11, 31, 51, 0.12)',
      },
    },
  },
  plugins: [],
}
