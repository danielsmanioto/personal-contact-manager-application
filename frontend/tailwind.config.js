/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primárias (Azul Claro)
        sky: {
          50: '#F0F9FF',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        // Secundárias (Cinza)
        gray: {
          100: '#F3F4F6',
          400: '#D1D5DB',
          600: '#6B7280',
          900: '#1F2937',
        },
        // Estados
        green: {
          600: '#10B981',
        },
        amber: {
          500: '#F59E0B',
        },
        red: {
          500: '#EF4444',
        },
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.4', letterSpacing: '0.5px' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.6', fontWeight: '500' }],
        xl: ['20px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        '3xl': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        '4xl': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        full: '999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 12px rgba(0, 0, 0, 0.15)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
        'blue': '0 0 0 3px rgba(14, 165, 233, 0.1)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        200: '200ms',
      },
    },
  },
  plugins: [],
}
