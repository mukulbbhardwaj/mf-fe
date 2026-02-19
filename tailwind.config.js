/** @type {import('tailwindcss').Config} */

export const darkMode = 'media';
export const content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
];
export const prefix = "";
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      "secondary-bg": "hsl(var(--secondary-background))",
      foreground: "hsl(var(--foreground))",
      banana: "hsl(var(--banana))",
      "energy-orange": "hsl(var(--energy-orange))",
      elite: "hsl(var(--elite))",
      green: "hsl(var(--primary))",
      line2: "hsl(var(--muted-foreground))",
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
      buy: {
        DEFAULT: "hsl(var(--buy))",
        foreground: "hsl(var(--buy-foreground))",
        hover: "hsl(var(--buy-hover))",
      },
      sell: {
        DEFAULT: "hsl(var(--sell))",
        foreground: "hsl(var(--sell-foreground))",
        hover: "hsl(var(--sell-hover))",
      },
      profit: {
        DEFAULT: "hsl(var(--profit))",
        foreground: "hsl(var(--profit-foreground))",
      },
      loss: {
        DEFAULT: "hsl(var(--loss))",
        foreground: "hsl(var(--loss-foreground))",
      },
    },
    borderRadius: {
      lg: "18px",
      md: "14px",
      sm: "10px",
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
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
};

export const plugins = [];