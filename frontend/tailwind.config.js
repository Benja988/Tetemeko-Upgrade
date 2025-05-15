/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        dark: 'var(--color-dark)',
        light: 'var(--color-light)',
        primaryLight: '#0C1E30',
        primaryText: '#D1D9E6',
        accent: '#0077B6',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.break-word': {
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
        },
      })
    },
  ],
}
