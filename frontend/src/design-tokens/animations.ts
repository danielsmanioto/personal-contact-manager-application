export const animations = {
  durations: {
    75: '75ms',
    150: '150ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
  },
  easing: {
    linear: 'linear',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  transitions: {
    default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

export type Animations = typeof animations
