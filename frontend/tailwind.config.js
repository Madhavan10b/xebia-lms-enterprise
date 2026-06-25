/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6C1D5F',       // Tranquil Velvet
          primaryDark: '#4A1E47',   // Dark Primary
          accent: '#84117C',        // Accent Velvet
          success: '#01AC9F',       // Emerald Success
          cta: '#FF6200',           // Sunset CTA Orange
          bg: '#FAFBFD',            // Light main background
          text: '#221A2B',          // Deep Violet-Black text
          muted: '#5D5768',         // Muted gray-purple text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 10px 30px -10px rgba(74, 30, 71, 0.04)',
        glassLg: '0 30px 60px -15px rgba(74, 30, 71, 0.08), 0 10px 30px -10px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
