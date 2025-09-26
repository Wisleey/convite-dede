/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Força modo escuro baseado na classe 'dark'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       colors: {
         // FORÇA ABSOLUTA - SEMPRE AS MESMAS CORES
         yellow: {
           50: "#fbbf24",
           100: "#fbbf24",
           200: "#fbbf24",
           300: "#fbbf24", 
           400: "#fbbf24",
           500: "#fbbf24",
           600: "#fbbf24",
           700: "#fbbf24",
           800: "#fbbf24",
           900: "#fbbf24",
         },
         gold: {
           50: "#fbbf24",
           100: "#fbbf24",
           200: "#fbbf24",
           300: "#fbbf24",
           400: "#fbbf24",
           500: "#fbbf24",
           600: "#fbbf24",
           700: "#fbbf24",
           800: "#fbbf24",
           900: "#fbbf24",
         },
         black: "#000000",
         white: "#ffffff",
         gray: {
           50: "#1a1a1a",
           100: "#1a1a1a",
           200: "#1a1a1a",
           300: "#1a1a1a",
           400: "#1a1a1a",
           500: "#1a1a1a",
           600: "#1a1a1a",
           700: "#1a1a1a",
           800: "#1a1a1a",
           900: "#000000",
         },
       },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
        "slide-in-left": "slideInLeft 1s ease-out",
        "slide-in-right": "slideInRight 1s ease-out",
        "slide-in-up": "slideInUp 1s ease-out",
        "fade-in-scale": "fadeInScale 1.2s ease-out",
        "rotate-glow": "rotateGlow 8s linear infinite",
        "bounce-in": "bounceIn 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        heartbeat: "heartbeat 2s ease-in-out infinite",
        "text-shimmer": "textShimmer 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.1)" },
        },
        goldPulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2), 0 0 60px rgba(255, 215, 0, 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4), 0 0 90px rgba(255, 215, 0, 0.3)",
          },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeInScale: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        rotateGlow: {
          "0%": { transform: "rotate(0deg)", filter: "hue-rotate(0deg)" },
          "100%": { transform: "rotate(360deg)", filter: "hue-rotate(360deg)" },
        },
        textShimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3) rotate(-10deg)", opacity: "0" },
          "50%": { transform: "scale(1.05) rotate(5deg)" },
          "70%": { transform: "scale(0.9) rotate(-2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.1)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.1)" },
          "70%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
