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
          ivory: "#F8F5F0",
          beige: "#EADDCB",
          charcoal: "#2B2B2B",
          gold: "#C8A75A",
          goldLight: "#DFBF6E",
          earth: "#8B6F4E",
          olive: "#6B6E4A",
          amber: "#D97706",
          darkBg: "#1E1E1E",
          darkCard: "#262626",
          surface: "#FAF8F5"
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"]
      },
      animation: {
        'flame-glow': 'flame 2.5s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(1)', opacity: '0.85', filter: 'drop-shadow(0 0 8px rgba(200, 167, 90, 0.6))' },
          '50%': { transform: 'scale(1.06) rotate(1deg)', opacity: '1', filter: 'drop-shadow(0 0 16px rgba(217, 119, 6, 0.8))' },
          '100%': { transform: 'scale(0.98) rotate(-1deg)', opacity: '0.9', filter: 'drop-shadow(0 0 10px rgba(200, 167, 90, 0.7))' }
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
