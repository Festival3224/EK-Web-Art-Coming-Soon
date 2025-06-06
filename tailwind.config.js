/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Marcellus: ['Marcellus', 'serif'],
        Philosopher: ['Philosopher', 'serif']
      },
      colors: {
        'dark-gray': '#030303'
      },
      backgroundImage: {
        'static-bg': "url('./assets/bg-static.jpg')",
      },
    },
    container: {
      center: true,
      padding: '1rem', // отступы слева и справа: 16px
    },  
  },
  plugins: [],
}

