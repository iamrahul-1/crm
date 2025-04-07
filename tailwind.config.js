/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)', opacity: 0.5 },
          '50%': { transform: 'translateY(-16px)', opacity: 1 }
        },
        reflection: {
          '0%, 100%': { transform: 'scaleY(0.5)', opacity: 0.2 },
          '50%': { transform: 'scaleY(0.1)', opacity: 0.5 }
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: 1 },
          '100%': { transform: 'scale(1.1)', opacity: 0 }
        }
      },
    },
  },
  plugins: [],
};
