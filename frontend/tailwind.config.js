/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bgPrimary: "#151515",
          bgSecondary: "#1D1D1D",
          darkBg: "#151515",
          darkCard: "#1E1E1E",
          darkCardSecondary: "#232323",
          ivory: "#F8F5F0",
          beige: "#EADDCB",
          secondaryText: "#D8D2C8",
          mutedText: "#A8A29E",
          charcoal: "#151515",
          gold: "#C8A75A",
          goldHover: "#D4B46A",
          goldLight: "#E7D3A2",
          earth: "#8B6F4E",
          olive: "#6B6E4A",
          border: "#383838",
          borderHover: "#C8A75A",
          error: "#C94A4A",
          success: "#5F8A5D",
          surface: "#151515"
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"]
      },
      boxShadow: {
        'luxury-hero': '0 30px 70px rgba(200, 167, 90, 0.15)',
        'luxury-card': '0 10px 30px rgba(0, 0, 0, 0.4)',
        'gold-glow': '0 0 25px rgba(200, 167, 90, 0.35)',
      },
      borderRadius: {
        'pill': '20px',
        'luxury': '18px'
      },
      animation: {
        'flame-glow': 'flame 2.5s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(1)', opacity: '0.85', filter: 'drop-shadow(0 0 8px rgba(200, 167, 90, 0.5))' },
          '50%': { transform: 'scale(1.04) rotate(1deg)', opacity: '1', filter: 'drop-shadow(0 0 14px rgba(212, 180, 106, 0.7))' },
          '100%': { transform: 'scale(0.98) rotate(-1deg)', opacity: '0.9', filter: 'drop-shadow(0 0 10px rgba(200, 167, 90, 0.6))' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
