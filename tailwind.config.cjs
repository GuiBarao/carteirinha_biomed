/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#022b23",
          800: "#044035",
          700: "#065846",
          600: "#0b7a5f",
          500: "#10a174",
          400: "#34d399"
        },
        accent: {
          500: "#22c55e"
        },
        surface: "#020617",
        card: "#020817",
        muted: "#1e293b"
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        "soft-card": "0 18px 45px rgba(15, 118, 110, 0.45)"
      },
      backgroundImage: {
        "green-cracked":
          "radial-gradient(circle at 0 0, rgba(34,197,94,0.25), transparent 60%), radial-gradient(circle at 100% 100%, rgba(16,185,129,0.3), transparent 55%), linear-gradient(135deg, #022c22 0%, #020617 45%, #065f46 100%)"
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      }
    }
  },
  plugins: []
};
