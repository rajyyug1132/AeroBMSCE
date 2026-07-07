import type { Config } from 'tailwindcss';

/* LOCKED brand system — every value maps to a design-system CSS var.
   No raw hex anywhere. See public/design-system/tokens/*.css.

   Tokens are wrapped in `rgb(from var(--x) r g b / <alpha-value>)` so Tailwind's
   /opacity modifier works on CSS-variable colors. Tailwind substitutes
   <alpha-value> with 1 for the base class (e.g. text-gold) and with the
   modifier for utilities like text-gold/70 or border-gold/40. Without this the
   opacity modifier silently produced no rule for var-based colors. */
const withAlpha = (token: string) => `rgb(from ${token} r g b / <alpha-value>)`;

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        page: withAlpha('var(--bg-page)'),
        hero: withAlpha('var(--bg-hero)'),
        section: withAlpha('var(--bg-section)'),
        card: withAlpha('var(--bg-card)'),
        'card-hover': withAlpha('var(--bg-card-hover)'),
        gold: withAlpha('var(--gold-500)'),
        'gold-press': withAlpha('var(--gold-600)'),
        'gold-soft': withAlpha('var(--gold-soft)'),
        text: withAlpha('var(--text)'),
        'text-muted': withAlpha('var(--text-muted)'),
        'text-body': withAlpha('var(--text-body)'),
        'on-gold': withAlpha('var(--text-on-gold)'),
        'status-on': withAlpha('var(--status-on)'),
        'status-block': withAlpha('var(--status-block)'),
        'status-done': withAlpha('var(--status-done)'),
        panel: withAlpha('var(--surface-panel)'),
        footer: withAlpha('var(--bg-footer)'),
      },
      boxShadow: {
        'glow-gold': 'var(--glow-gold)',
        card: 'var(--shadow-card)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderColor: {
        brand: withAlpha('var(--border-brand)'),
        panel: withAlpha('var(--border-panel)'),
        faint: withAlpha('var(--line-faint)'),
      },
      backgroundImage: {
        'grad-hero': 'var(--grad-hero)',
        'grad-card': 'var(--grad-card)',
        'grad-gold': 'var(--grad-gold)',
        'grad-fade-dark': 'var(--grad-fade-dark)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
      maxWidth: {
        container: 'var(--container)',
        narrow: 'var(--container-narrow)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
    },
  },
  plugins: [],
};

export default config;
