/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulseGlow 3s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
}
