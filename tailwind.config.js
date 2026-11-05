/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cante: {
          bg: '#1A1A2E',       // Deep Royal Purple (Fundo Sólido)
          lavender: '#9575CD', // Soft Lavender (Legenda Ativa e Realces)
          white: '#FFFFFF',    // Textos
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
