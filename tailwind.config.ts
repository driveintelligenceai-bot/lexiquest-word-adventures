import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Lexend', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Wilson Colors
        consonant: {
          DEFAULT: "hsl(var(--consonant))",
          border: "hsl(var(--consonant-border))",
          text: "hsl(var(--consonant-text))",
        },
        vowel: {
          DEFAULT: "hsl(var(--vowel))",
          border: "hsl(var(--vowel-border))",
          text: "hsl(var(--vowel-text))",
        },
        digraph: {
          DEFAULT: "hsl(var(--digraph))",
          border: "hsl(var(--digraph-border))",
          text: "hsl(var(--digraph-text))",
        },
        welded: {
          DEFAULT: "hsl(var(--welded))",
          border: "hsl(var(--welded-border))",
          text: "hsl(var(--welded-text))",
        },
        suffix: {
          DEFAULT: "hsl(var(--suffix))",
          border: "hsl(var(--suffix-border))",
          text: "hsl(var(--suffix-text))",
        },
        tutor: {
          bg: "hsl(var(--tutor-bg))",
          card: "hsl(var(--tutor-card))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.02)", opacity: "0.9" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 8px hsl(var(--primary) / 0.4)" },
          "50%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "zoom-in": "zoom-in 0.3s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 1.5s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
      boxShadow: {
        "game-card": "0 4px 20px -4px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--border))",
        "game-button": "0 6px 0 hsl(var(--primary) / 0.3), 0 4px 12px hsl(var(--primary) / 0.2)",
        "game-button-pressed": "0 2px 0 hsl(var(--primary) / 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
