/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/main/content/jcr_root/apps/wheelspin/clientlibs/clientlibs-shadcn-button/js/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
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
        // Custom colors for gradients, inspired by Aceternity UI
        "gradient-start": "rgba(22, 163, 74, 0.2)", // Example green
        "gradient-end": "rgba(59, 130, 246, 0.2)",   // Example blue
        "dark-bg": "#1a1a1a",
        "dark-card": "#2a2a2a",
        "dark-border": "#4a4a4a",
      },
      boxShadow: {
        "3d-light": "0px 10px 30px rgba(0, 0, 0, 0.1)", // For subtle 3D lift
        "3d-heavy": "0px 20px 50px rgba(0, 0, 0, 0.2)",
        "inner-glow": "inset 0 0 10px rgba(255, 255, 255, 0.1)", // For subtle inner glow
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'opacity-transform': 'opacity, transform',
        'shadow': 'box-shadow',
      },
    },
  },
  plugins: [],
};
