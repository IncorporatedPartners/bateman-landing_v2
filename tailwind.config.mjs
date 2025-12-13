// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // You can wire these to your actual CSS @imports:
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"Cormorant Garamond"', "serif"],
        terminal: ['"IBM Plex Mono"', "monospace"]
      },
      colors: {
        bone: "#fdfbf7",
        terminal: "#00FF41",
        emerald700: "#047857",
        oxblood700: "#BE123C"
      },
      keyframes: {
        blink: {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(500%)" }
        },
        loading: {
          "0%": { width: "0%", marginLeft: "0%" },
          "50%": { width: "100%", marginLeft: "0%" },
          "100%": { width: "0%", marginLeft: "100%" }
        }
      },
      animation: {
        blink: "blink 1s steps(2, start) infinite",
        scan: "scan 4s linear infinite",
        loading: "loading 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
