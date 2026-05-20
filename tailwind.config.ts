import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          pure: '#000000',   // page background
          card: '#0a0a0a',   // card, hero, section backgrounds
          hover: '#111111',  // hover state on dark surfaces
          surface: '#1a1a1a', // tag/chip backgrounds
          section: '#222222', // section header background variant
        },
        white: {
          pure: '#ffffff',   // primary text
          off: '#f0f0f0',    // CTA button background
          '50': 'rgba(255,255,255,0.5)',   // secondary text
          '30': 'rgba(255,255,255,0.30)',  // muted text
          '15': 'rgba(255,255,255,0.15)',  // ghost button border
          '12': 'rgba(255,255,255,0.12)',  // tag chip border
          '06': 'rgba(255,255,255,0.06)',  // card border default
          '04': 'rgba(255,255,255,0.04)',  // subtle background
        },
        accent: {
          green: '#c6ff4e',
        }
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-space)", "sans-serif"],
      },
      animation: {
        'marquee': 'marqueeScroll 22s linear infinite',
      },
      keyframes: {
        marqueeScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
