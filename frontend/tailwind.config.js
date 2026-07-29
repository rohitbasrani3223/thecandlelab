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
          lightBg: "#FDFAF5",          // Warm White
          lightBgSecondary: "#F5EFE4", // Ivory
          lightSection: "#FAF5ED",
          lightCard: "#FFFFFF",
          lightText: "#1C1917",        // Deep Stone Black
          lightTextMuted: "#57534E",
          lightBorder: "#E7E0D3",
          gold: "#C4964A",             // Gold Primary
          goldHover: "#D4A85B",
          goldLight: "#E8CFA6",
          accentBrown: "#8B5E3C",      // Warm Brown
          darkBg: "#151413",
          darkBgSecondary: "#1E1B18",
          darkCard: "#201D19",
          darkCardSecondary: "#282420",
          darkText: "#F5EFE4",
          darkTextMuted: "#A8A29E",
          darkBorder: "#38342E",
          error: "#C94A4A",
          success: "#5F8A5D",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"]
      },
      boxShadow: {
        'luxury-light': '0 8px 30px rgba(28, 25, 23, 0.04)',
        'luxury-hero': '0 20px 50px rgba(196, 150, 74, 0.14)',
        'gold-glow': '0 0 25px rgba(196, 150, 74, 0.35)',
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
          '0%': { transform: 'scale(1)', opacity: '0.85', filter: 'drop-shadow(0 0 6px rgba(196, 150, 74, 0.4))' },
          '50%': { transform: 'scale(1.04) rotate(1deg)', opacity: '1', filter: 'drop-shadow(0 0 12px rgba(212, 168, 91, 0.6))' },
          '100%': { transform: 'scale(0.98) rotate(-1deg)', opacity: '0.9', filter: 'drop-shadow(0 0 8px rgba(196, 150, 74, 0.5))' }
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
