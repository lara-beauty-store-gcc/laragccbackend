import type { Config } from 'tailwindcss';
import { businessInputs } from './src/config/business';

const c = businessInputs.design;

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: c.primaryColor,
        'primary-dark': c.primaryDarkColor,
        accent: c.accentColor,
        surface: c.backgroundColor,
        card: c.cardColor,
        ink: c.textColor,
        muted: c.mutedTextColor,
        border: c.borderColor,
      },
      fontFamily: {
        arabic: ['"Noto Kufi Arabic"', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(27, 58, 45, 0.08)',
        card: '0 4px 24px rgba(27, 58, 45, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
