import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            h1: {
              color: theme('colors.foreground'),
            },
            h2: {
              color: theme('colors.foreground'),
            },
            h3: {
              color: theme('colors.foreground'),
            },
            strong: {
              color: theme('colors.foreground'),
            },
            code: {
              color: theme('colors.foreground'),
              backgroundColor: theme('colors.gray.800'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.500'),
            },
            'ol > li::before': {
              color: theme('colors.gray.500'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;