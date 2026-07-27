/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lightBg: "#FAF7F2",
          lightBgSecondary: "#F4EFE8",
          lightSection: "#F8F5F0",
          lightCard: "#FFFFFF",
          lightText: "#1F1F1F",
          lightTextMuted: "#666666",
          lightBorder: "#E6DFD3",
          gold: "#C8A75A",
          goldHover: "#D4B46A",
          goldLight: "#E7D3A2",
          darkBg: "#151515",
          darkBgSecondary: "#1D1D1D",
          darkCard: "#1E1E1E",
          darkCardSecondary: "#232323",
          darkText: "#F8F5F0",
          darkTextMuted: "#A8A29E",
          darkBorder: "#383838",
          error: "#C94A4A",
          success: "#5F8A5D",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"]
      },
      boxShadow: {
        'luxury-light': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'luxury-hero': '0 20px 50px rgba(200, 167, 90, 0.12)',
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
          '0%': { transform: 'scale(1)', opacity: '0.85', filter: 'drop-shadow(0 0 6px rgba(200, 167, 90, 0.4))' },
          '50%': { transform: 'scale(1.04) rotate(1deg)', opacity: '1', filter: 'drop-shadow(0 0 12px rgba(212, 180, 106, 0.6))' },
          '100%': { transform: 'scale(0.98) rotate(-1deg)', opacity: '0.9', filter: 'drop-shadow(0 0 8px rgba(200, 167, 90, 0.5))' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    },
  },
  plugins: [],
}
