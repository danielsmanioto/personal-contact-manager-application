export const typography = {
  fontFamily: {
    primary: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
    mono: ['"Source Code Pro"', '"JetBrains Mono"', 'monospace'],
  },
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const

export type Typography = typeof typography
