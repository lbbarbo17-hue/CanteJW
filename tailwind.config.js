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
          bg: '#1A1A2E',       // Deep Royal Purple (Fundo)
          panel: '#4A148C',    // Royal Purple (Cards / Painéis)
          lavender: '#9575CD', // Soft Lavender (Legendas ativas e realces)
          white: '#FFFFFF',    // Textos e ícones primários
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
